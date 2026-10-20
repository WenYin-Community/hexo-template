---
title: "跨平台打包与 CI 发布踩坑集：overlay 隔离层与 FreeBSD 移植"
author: "学姐大人"
date: 2026-10-11
categories:
  - "开发工具"
tags:
  - "packaging"
  - "ci"
  - "github-actions"
  - "electron"
  - "freebsd"
  - "linux"
---

打包分发的坑分两类：**CI 的「静默吞」**与**发行版差异**。这篇把开源项目的多平台打包（RPM / DEB / Arch / Electron / AppImage）、CI 流水线，以及 overlay 隔离层与 FreeBSD 移植的经验收在一起。

<!-- more -->

<a id="packaging-ci-system-integration-pitfalls"></a>

## 跨平台打包与 CI 发布实践踩坑集

本文汇总开源项目打包分发（RPM / DEB / Arch PKGBUILD / Electron / AppImage）、GitHub Actions CI 流水线以及桌面系统集成中积累的踩坑记录。适用于需要同时发布多个平台产物的个人与团队项目。

<!-- more -->

## 一、Arch Linux 打包：LTO 根因排查

**现象**：PKGBUILD 在 CI 持续构建失败，报 `ld.lld: undefined symbol: sqlite3_errmsg` 等链接错误。

**排查弯路**：在 CI 上盲试了 5 轮、加了 3 个无依据的 workaround（换 rustup 工具链、改 linker、链系统 SQLite）都不解决。

**正确的复现方法**：本地 `podman run` 真实 `archlinux:base-devel` 容器，`makepkg` 逐步加标志复现：

```
干净构建成功 → 加基础 CFLAGS 仍成功 → 加 -flto=auto 立即复现
```

**根因**：Arch 的 makepkg **默认启用 LTO**，把 `-flto=auto` 注入 CFLAGS，使 SQLite/ring 的 C 对象带 LTO 位码，rustc 链接阶段无法解析符号。**修复**：PKGBUILD 清 LTO 标志 + `-C lto=off`。

**教训**：本地穷举时漏测了 LTOFLAGS，就该先在容器里完整复现再推 CI——"为什么要把 PKGBUILD 直接推上去盲试"。

**Arch 包规则补充**：

- Arch 没有独立的 `cargo` 包：`rust` 包 provides/conflicts/replaces cargo，`makedepends` 只列 `rust`（Fedora 相反：cargo/rust 是独立包，两个都要列）；
- Arch 官方只支持 x86_64（arm64 无官方镜像），ARM 用户按 AUR 惯例本地编译。

## 二、RPM / DEB 打包细节

- **`rpmbuild` 的 Source0** 指向 GitHub tag tarball 时需自备 `SOURCES/v0.9.x.tar.gz`，且顶层目录必须叫 `<name>-<version>/`；
- **`git archive` 只打已提交内容**——改动未提交则包里没有新功能（打包前的"忘记提交"会被静默吞掉）；
- **删除"冗余副本"前先核实**：`/usr/local/sbin` 是 `/usr/local/bin` 的软链接（usrmerge 布局），把它当冗余删掉时实际删除了 RPM 拥有的文件，导致命令失效——用 `rpm -qf` + 软链接解析确认；
- **DEB 构建 `dpkg-checkbuilddeps` 报缺 cargo/rustc**：CI 里 Rust 由 rustup 安装而非 apt 包，加 `-d` 跳过校验；
- RPM 卸载时被用户修改过的配置文件会另存为 `.rpmsave`——排查"配置不生效"时要检查。

## 三、GitHub Actions CI 陷阱

- **re-run 沿用旧 commit 的 workflow 定义**：修改过的 job 无法靠 re-run 生效，必须打新 tag；
- **`upload-artifact` 以通配符公共前缀为根保留子目录**，publish 时 `files: artifacts/*` 不递归 → 产物静默丢失（`sha256sum *` 遇目录报错又被 grep 吞掉，CI 依然绿色）；
- **容器化打包四连坑**：fpm 缺 rpmbuild/bsdtar 后端；容器无 C++ 工具链导致 node-gyp 编译失败（补 build-essential）；无 arm64 镜像要移除对应目标；容器内 git `dubious ownership` 拒绝操作（加 `safe.directory`）；
- **容器 shell 是 dash**：`[[` 与花括号展开均不可用；Debian 12 无 `magick`（只有 ImageMagick 6）——跨发行版脚本要按 POSIX 写；
- **`setup-android` 类 action 可能执行已移除的 SDK 工具**：某版本 action 执行已不存在的 `sdkmanager tools`，直接删掉该 action 即可；
- **workflow 里 YAML heredoc 缩进问题**会报 "workflow file issue"——改单行 `python3 -c` 更稳；
- **Ubuntu 自带 setuptools 与打包工具依赖的 setuptools_scm 不兼容**：`AttributeError: ignore_egg_info_in_manifest` → 钉 `setuptools_scm<10`；
- **依赖源被墙**：`dbus.freedesktop.org` 超时 → 换 gitlab.freedesktop.org；`raw.githubusercontent.com` 需代理时，`github.com` HTTPS git 不通可改 SSH 443。

## 四、Electron 应用打包（monorepo）

- **显示名与数据目录名解耦**：改 exe 显示名时若连带改了 electron-builder 的 productName，userData 目录会随之改变，导致与旧版本的数据（配置/凭据）不再共享；
- **四段版本号不可用**：`semver.coerce('3.14.3.1')` 得到 `3.14.3`，更新检测失效——跟主线大版本 + patch 自增更安全；
- **CI 打包缺运行时身份**：未显式设置生产环境标识时，产物是 Preview 身份、连的是测试后端（文件名还会带 `_TEST`）；
- **ImageMagick 写 ICNS 是假的**：只改扩展名、内容仍是 PNG，macOS 上失效 → 用 Pillow 按标准 TOC 生成 ic07–ic14；
- **rpm 与官方包共存冲突**：`/usr/lib/.build-id/*` 双份生成大量路径冲突 → fpm 传 `_build_id_links none`；
- **打包体积优化**：删掉依赖自带的非发行平台 prebuild 目录，80MB → 61MB。

## 五、桌面系统集成

**KDE Plasma 小工具（QML + Python）**：

- QML 内嵌 Python 用分号单行拼接 `; if ...:` 是语法错误，每次启动抛异常、下载从未执行——QML 里的 Python 代码必须真多行；
- **`configuration` 运行时赋值不会自动落盘** appletsrc，必须显式 `writeConfig()`（参照官方 slideshow 实现）；
- **改源码只是改仓库**：plasmashell 实际加载安装目录 `~/.local/share/plasma/wallpapers/<id>/`，必须同步安装目录再重启 plasmashell；
- 系统级旧版本会**遮蔽**用户级新版本（安装前清理系统级残留）。

**发布流程**：

- 覆盖式发布：本地无对应 tag 时先打 tag 再 force push，然后删除重建 release；CI 由 release published 触发；
- 双架构产物同名会互相覆盖，构建后先重命名。

**PDF 生成管线**（中文文档）：

- 方案演进：xelatex 方案在 Fedora 的 texlive 细拆包生态里依赖地狱（`ctex`/`xeCJK`/`booktabs` 等都不随主包，且 `texlive-longtable` 这类包名根本不存在）→ 最终改为 `pandoc → 内嵌样式 HTML → Chrome headless 打印 PDF`；
- Chrome 无头打印要用 `--headless=new --no-sandbox`，图片相对路径要设 base 目录；固持 Letter 忽略 CSS 的 A4 时换 WeasyPrint 更能保住表格/代码块；
- Markdown 表格单元格内裸 `|` 会被当列分隔符截断（改 `/` 绕开）；`table-layout: fixed` + 百分比列宽会文字叠印，撤销 fixed 改自动布局；
- ASCII 图含 CJK 双宽字符会破框——整体改表格；
- 导出 PNG 随机抽查时注意文件名补零（`p-1.png` 没有前导零会读不到）。

**其他系统级任务**：

- **指纹驱动**：设备在 libfprint 无驱动时，"No devices available"是驱动缺失而非配置问题；滑动式小传感器（出图仅 103×52）即使 enroll 成功，verify 也频繁失败——匹配算法处理不了小图（上游 MR 悬置多年）。KDE 锁屏原生支持指纹，但 SDDM 登录不支持（加了 PAM 模块会无提示失败+易误锁）；
- **PHP 老应用迁移 PHP 8**：内容较多，已单独成篇，见《PHP 8 下维护老系统：静默失效、致命错误与编码约束》；
- **Android 固件解包**：tgz 是流式压缩，tar 必须读完整个数据流才结束（12GB 包不要用短超时命令）；动态分区（vendor_dlkm/odm）不在包内，需从 `super.img` 用 `lpunpack -p` 提取；
- **AAPT2 会自动 gunzip 以 `.gz` 结尾的 assets**：APK 内变纯文本，运行时 `GZIPInputStream` 读取直接崩溃——内置数据改纯文本 JSONL 存放。

## 总结

打包与分发的坑有两类：**CI 的"静默吞"**（产物丢失但 CI 绿色、re-run 不生效、未提交的改动没进包）与**发行版差异**（包名规则、LTO 默认值、工具链版本）。对策是：CI 里对关键产物加显式断言、本地容器先行复现、把"打包前的状态检查"（已提交、版本号一致）做成脚本。

<a id="overlay-packaging-freebsd"></a>

## 不改上游源码做跨平台打包：overlay 隔离层与 FreeBSD 移植

有个常见需求：上游桌面应用只发 macOS 和 Windows，但你需要在 Linux（以及 FreeBSD）上用。直接 fork 改源码最省事，代价是**每次上游发版都要解一遍冲突**，很快就不想维护了。

本文记录另一种做法：**把平台支持做成一层 overlay 补丁，上游源码一个字节都不改**，构建时拉官方发布包、叠上补丁再打包。顺带记录 FreeBSD 移植里几个完全出乎意料的问题。

<!-- more -->

## 一、overlay 的核心：让上游保持"纯净"

思路很朴素：

1. fork 里**不保存上游源码**，只保存"要覆盖哪些文件"的清单和补丁内容；
2. CI 每次从上游 release 下载源码压缩包，解包；
3. 把清单里的文件逐个覆盖进去；
4. 走正常的构建流程。

好处是上游发新版时**不存在合并冲突**——因为根本没有合并，只有"新版本 + 同一层补丁"。

代价是：上游改了被覆盖的文件时，你的补丁会静默失效（新代码被旧补丁顶掉）。所以必须有基线校验。

## 二、清单 + 哈希基线

清单里给每个文件记录两项：**路径**和**打补丁时对应的上游 blob 哈希**。

构建时先做一次校验：拿上游压缩包里该文件的哈希和清单里的基线比对。不一致就说明上游动过这个文件，**直接失败**，而不是继续构建。

```json
{
  "files": [
    { "path": "apps/desktop/scripts/package-target.ts",
      "base": "<上游 blob sha>",
      "merge": false }
  ]
}
```

失败信息要写清楚"哪个文件漂移了、旧基线是什么、新哈希是什么"，因为处理它的人通常是三个月后的自己。

**这个校验救过好几次**：上游重构了打包脚本，如果没拦住，构建产物会是"新脚本 + 旧覆盖文件"的缝合怪，而且大概率能编译通过、运行时才炸。

## 三、`merge` 模式：只增不改

有些文件不能整文件覆盖，比如 `package.json`——上游会往里加依赖和脚本，你的 fork 也要加自己的键。整文件替换会把上游新增的全抹掉。

所以加了 `merge` 模式：**以上游的新文件为基底，只把自己的键叠上去**。

这里踩过最贵的一个坑：最初的实现是"三方合并"（base=旧上游 / ours=fork / theirs=新上游）。听起来很标准，但它会让**上游已经删除的键被 fork 副本原样带回来**。

后果不是报错，而是 lockfile 对不上：

```
ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile"
```

排查了很久才想明白：merge 的语义应该是"**只增加，不恢复**"。

## 四、三方合并的两个坑

如果确实需要对代码文件做三方合并，有两个问题必须先知道。

**第一，`git merge-file -p` 不写文件。**

```bash
git merge-file -p ours base theirs > merged   # 必须重定向
```

它的 `-p` 是"把结果写到标准输出"，不加重定向的话**目标文件纹丝不动**。当时一度以为 12 个文件已经"干净合并"了，后来抽查才发现全是原样——冲突判定是有效的，但内容根本没落盘。

**第二，覆盖文件会和"未被覆盖的文件"脱节。**

这是 overlay 架构最隐蔽的问题：你只维护了 20 多个文件，但上游有几千个。一旦上游重构，**那些没有被覆盖的文件可能 import 了被覆盖文件的新增导出**。

实际案例：上游在 `prepare-runtime.ts` 里新增了三个导出，而另外两个**未被覆盖**的脚本直接 import 它们。这时"只修当前报错的那一处"必然还会失败——必须让整层 overlay 和上游新版本对齐。

**判断方法**：改完后 grep 一遍"未被覆盖的文件有没有引用被覆盖文件的符号"，比逐个试错快。

## 五、FreeBSD：六个没想到

同一个 Electron 应用，Linux 打包跑通后，FreeBSD 又踩了一轮。

**1. `pkg` 数据库已经不是目录结构了。**

老版本 FreeBSD 的 pkg 数据库是 `/var/db/pkg/<包名>/` 一堆目录；新版迁移到了 **SQLite**（`/var/db/pkg/local.sqlite`）。还在按目录读元数据，会得到"found 0"。

**2. `node_modules/.bin` 会遮蔽系统工具。**

PATH 里 `node_modules/.bin` 排在前面，于是 `pkg` 被解析成了 npm 上的 **`@yao-pkg/pkg`**（Node 打包工具），而不是系统的 `pkg(8)`。症状非常迷惑：退出码 2、错误信息写到 stdout、参数不被识别。

修法：所有系统工具调用改**绝对路径**（`/usr/sbin/pkg`、`/usr/bin/tar`）。

**3. 静态链接需要 `musl-gcc`。**

某些安全组件（如 landlock）要静态链接，FreeBSD 上也一样需要 musl 工具链，apt/pkg 安装列表里漏了会直接编译失败。

**4. `node-pty` 的平台宏只覆盖 Linux。**

原生模块里那个"关闭继承的 fd"函数用 `#ifdef __linux__` 包着，FreeBSD 走不到，链接时找不到符号。补丁要拓宽成 `__linux__ || __FreeBSD__`，并给 FreeBSD 走 `fcntl` 回退（它没有 `close_range`）。

**5. 源码压缩包不含 `.git`。**

构建脚本里有一句 `git rev-parse HEAD` 用来记录构建来源。从 release 下载的 tar.gz 里没有 `.git`，这句直接失败。

修法：在源码目录 `git init`，然后 `git fetch` 上游那个 tag 对象，让 HEAD 指向**真实的上游提交**——这样产物里记录的 commit 是可追溯的，而不是一个伪造的哈希。

**6. Office 引擎在 FreeBSD 上不存在。**

某些平台的能力是"有原生引擎就用，没有就回退 WASM"。FreeBSD 两个都没有，但检测逻辑只判断了"原生引擎是否缺失"，于是在打包后的环境里误判、抛错、不回退。这类问题只有真机装完才暴露。

## 六、Electron 打包的几个通用细节

即使不涉及 FreeBSD，这些也值得记一下。

**ASAR 对不存在的路径返回 `null`，而 Node 返回 `undefined`。**

代码里常见的写法是：

```js
if (fs.lstatSync(p) !== undefined) { /* 认为已安装 */ }
```

在 Node 里，路径不存在会抛异常或返回 undefined；而在 ASAR 里返回的是 `null`。`null !== undefined` 恒为真——于是**打包后的应用永远认为"原生引擎已存在"**，永远不回退。

这个坑只在"第一个必须依赖回退的平台"上暴露（macOS/Windows 有真引擎，走不到这个分支）。

**图标按原始尺寸安装会被主题忽略。**

给了一个 1104×1104 的 PNG，打包工具会把它装到 `hicolor/1104x1104/`，而图标主题只认 8/16/24/…/512 这些标准尺寸——**图标文件在，但永远显示不出来**。必须按标准尺寸集重新栅格化。

**可执行名默认推导可能是非法的。**

包名带 scope（`@org/app`）时，Linux 可执行名会被推导成带 `@` 和 `/` 的字符串，必须显式指定。

## 七、CI 里必须补的一课

overlay 方案的最后一步是"每次上游发 rc 就自动打包"。这里有两个容易踩的点：

- **从 release 下载源码时不要用 `git clone`**：目标就是"不碰上游仓库历史"，用官方源码压缩包更干净；
- **发布前必须做产物自检**：解包、检查可执行文件、跑一次 `--version`。只验证"CI 绿了"不够——文件少一个、权限不对、启动器路径写错，CI 都不会红。

## 总结

用 overlay 做跨平台支持，本质是**用"每次构建时校验"换"每次发版时合并"**：

- 清单记哈希，漂移就失败，不要静默继续；
- merge 语义是"只增不改"，别把上游删掉的键加回来；
- 覆盖文件和未被覆盖文件之间存在隐式接口，改一处要看全局；
- 目标平台的包管理器、路径解析、原生模块宏，是最容易出意外的地方。

最后一条：**跨平台打包的验证必须以"装完能跑"为准**——编译通过、生成产物、CI 全绿，这三件事没有一件能证明用户装上去能用。
