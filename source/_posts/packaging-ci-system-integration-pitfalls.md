---
title: "跨平台打包与 CI 发布实践踩坑集"
date: 2026-09-17
categories:
  - "开发工具"
tags:
  - "packaging"
  - "ci"
  - "github-actions"
  - "rpm"
  - "arch-linux"
  - "kde"
---

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
- **PHP 老应用迁移 PHP 8**：`@` 只能抑制 warning/notice，**不能抑制 `extract()` 的 TypeError**——`@extract(null)` 直接 Fatal error 截断了原有"缓存缺失→重建"的自愈路径。修法：数组兜底 + 强制触发缓存重建；
- **Android 固件解包**：tgz 是流式压缩，tar 必须读完整个数据流才结束（12GB 包不要用短超时命令）；动态分区（vendor_dlkm/odm）不在包内，需从 `super.img` 用 `lpunpack -p` 提取；
- **AAPT2 会自动 gunzip 以 `.gz` 结尾的 assets**：APK 内变纯文本，运行时 `GZIPInputStream` 读取直接崩溃——内置数据改纯文本 JSONL 存放。

## 总结

打包与分发的坑有两类：**CI 的"静默吞"**（产物丢失但 CI 绿色、re-run 不生效、未提交的改动没进包）与**发行版差异**（包名规则、LTO 默认值、工具链版本）。对策是：CI 里对关键产物加显式断言、本地容器先行复现、把"打包前的状态检查"（已提交、版本号一致）做成脚本。
