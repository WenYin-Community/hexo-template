---
title: "自己的编辑器（续）：打包、桌面集成与跟上游同步"
author: "学姐大人"
date: 2026-10-26
categories:
  - "开发工具"
tags:
  - "rust"
  - "egui"
  - "desktop"
  - "packaging"
  - "upstream"
---

> 本文是《[自己写的编辑器卡在哪](/2026/10/26/desktop-editor-ime-export-performance/)》的续篇，记录打包 CI、桌面集成与跟上游大版本同步的经验。

## 八、打包与 CI 的四个坑

**`Cargo.lock` 没提交，CI 直接失败。** 功能提交只带了 `Cargo.toml` 和源码，CI 用 `cargo check --locked`，报 `the lock file needs to be updated but --locked was passed`。锁文件是仓库产物，必须一起提交；提交前本地先跑一次 `--locked` 验证自洽。

**NSIS 的相对路径基准是「脚本所在目录」。** 不是仓库根。`File`/`OutFile` 写成 `target/release/mdoxide.exe` 会找不到，要写成 `..\..\target\release\mdoxide.exe`。

**Windows runner 没有 `makensis`。** release workflow 里要先装（Chocolatey），否则 Windows 包永远出不来。

**Dependabot 会把「工具链版本的 ref」当成 action 版本升级。** `dtolnay/rust-toolchain@1.92.0` 指的是 **Rust 版本**（由 `rust-toolchain.toml` 固定），Dependabot 却把它当 action 版本提到 `1.120.0`，必然失败 → 加 ignore 规则。

另外一条经验：版本号从 tag 里取时别混入 `v` 前缀；本地残留的旧 tag 要先删再重新指向当前发布提交，否则 release workflow 一直是「没有新 tag」。

## 九、附：桌面集成的另外两处

同一个月的两个桌面问题，性质类似，一起记。

**Wayland 下窗口能力是空的。** 想让小工具固定在角落、置顶、不在任务栏出现——在 winit 的 Wayland 后端里，`set_visible`、`set_outer_position`、`set_window_level` **全是空实现**（源码注释直接写 "Not possible on Wayland."），`set_minimized(true)` 也无法取消。要做全功能得自己写 layer-shell 后端（估 800–1500 行新代码，且 GNOME 不实现该协议），实际选择是**继续走 XWayland**。

**X11 下任务栏也不会自己让开。** KWin 不会因为窗口是 Utility 就跳过任务栏，而 winit 的 X11 后端又没有 `skip_taskbar` 接口（只有 Windows 有）。只能自己发 EWMH 消息：

```
_NET_WM_STATE_SKIP_TASKBAR
_NET_WM_STATE_SKIP_PAGER
```

要注意**窗口还没被窗口管理器接管时，这两条消息会被丢弃**——发送后要回读 `_NET_WM_STATE` 确认，失败就重试（实践里最多重试 10 次、约 5 秒）。

**KDE 维护两套 MIME 关联文件。** 系统设置里改默认应用，一切换页面就回滚、双击文件还是老程序打开。原因是：KCM 和右键菜单只写 `~/.config/mimeapps.list`，而**运行时优先读 `~/.config/kde-mimeapps.list`**，系统级 `/usr/share/applications/kde-mimeapps.list` 又提供了默认值。三份文件叠在一起，只改 GUI 那份永远不生效。

定位方法很实用：**把默认指向一个无界面的测试应用，看谁被真正拉起**——由此确定运行时到底读的是哪份配置。

还有一层：**「直接关联」优先于「父 MIME 继承」**。一个 desktop 同时声明 `text/plain;text/markdown;text/x-markdown` 时，去重后目标 MIME 只剩继承关系，强度低于另一个直接声明它的应用——表现就是「设了默认却打不开」。

## 十、从「能用」到「耐用」：0.5 到 0.6 补的几道关

前九个方向解决的是「能不能用」，后面几个版本补的是「用久了会不会坏」。

**重载入口只能有一个。** 文件被外部修改时，编辑器有磁盘监听、窗口聚焦、手动刷新三个触发点。多个入口各自读盘，会互相覆盖未保存内容。做法是收敛成 `replace_from_disk` 单一入口，并用 `revision` 门控缓存：内容版本没变就不重建 AST。

**启动恢复要收敛，写入要增量。** 恢复流程原来会重建整份文档再比较，大文件下启动明显变慢；改成只回放差异，并给 AST 设 64 MB 上限，超限就退化为纯文本视图，避免恢复时把内存打满。

**持久化要「耐久」而不是「写了」。** 直接从内存写文件，进程在写一半时崩溃就是半个 JSON。做法是 tmp + rename 原子写、配置保留 `.bak`、`RecoveryWriter` 后台串行写；索引更新加 400 ms debounce 且只跑一个 worker，否则每次按键都触发一次索引重建。

**正文所有权要收敛到 `Document`。** 早期 `Tab` 直接持有 `content`，渲染、保存、恢复各自拿 `&mut`，借用冲突只能靠拆字段绕。0.6.5 把正文收进 `Document`，`state.rs` 按职责拆分，`Tab` 只留 id 与元数据。

**安全边界要显式写出来。** 代码执行、HTML 预览、终端嵌入都是「能跑任意内容」的入口，默认关闭，开启时给出明确提示；AST 大小上限同时防住恶意深层嵌套。

**主题要跟系统走，但不能每次启动都覆盖用户选择。** 从本机 Zed 主题文件读出 `duskfox-blurred` 的色号，窗口 `with_transparent(true)` + 全透明 `clear_color`，再由 KWin 的模糊窗口规则补上背景模糊，观感接近 Zed。配置里加 `language_explicit`：旧配置没有该字段时每次启动跟随系统区域设置，用户手动选过语言后才固定。

几个只在重构时才会遇到的坑：

- **egui 的 `allocate_rect` 在 RTL 布局里会反向推进父布局游标**：右上角的模式切换分段各自调用它，父游标反向移动 52px，和字数统计重叠、还点不到。改用 `interact`，只命中不占位。
- **结构体尾部悬空的文档注释会触发 E0585，并「传染」整片类型推断**：一个孤立的 `///` 让 rustc 把结构体恢复成错误类型，随后大量字段被推断成 `Option<Path>`/`Option<str>`、出现 unsized 报错。删掉悬空注释、补齐初始化字段即可。
- **`Deref` 之后 `&mut tab.content` 会借用整个 `tab`**：渲染编辑器构造处改成用已保存的 `tab_id` 回查，避免整结构借用。
- **TextEdit 的状态会在右键菜单动作前被 move**：菜单编辑后状态丢失。统一在菜单处理结束后再保存状态。
- **改了行高/主题，测试还写死旧值**：断言行高 20px、主题循环没包含 Duskfox，CI 直接红。测试要引用 `FIXED_LINE_HEIGHT` 常量，主题循环跟着枚举走。

**构建策略也要认账**：release 二进制 51 MB、xz 压到 18.3 MB，刚好达 ≤20 MB；15 MB / 36 万行文档后台加载不阻塞 UI、峰值 RSS 约 564 MB。`cargo clean` 一次清掉 16121 个文件 / 10.1 GiB 之后，规则改成「不在本机构建或跑测试，全部走 GitHub Actions」——本地只做 `cargo check` 与格式化。

## 十一、跟上游大版本同步：不能 merge，只能按行为重写

编辑器后来对齐了一次上游（Ferrite v0.3.1）。两边从共同基点之后各走了 376 / 397 个提交，src 差异 212 个文件、+145,476/−21,054 行——**直接 merge 或 cherry-pick 都不可行**，只能挑选可移植的行为逐项重写。

先写一份「可移植项清单」，按 P0/P1/P2 分级，每项标注「直接移植 / 改造后移植 / 只借鉴 / 不移植」。红线项（视频 WebView、多窗口、多实例、LSP、拼写检查、各平台安装器）明确不碰，避免把上游的架构假设带进来。

**P0 数据安全，9 项全做：**

- 脏标签切换编码要弹 Save / Don't Save / Cancel，原来 `set_encoding` 直接覆盖正文；
- 有损编码保存要拒绝：`encode()` 忽略 `had_errors` 会把不可编码字符写成 `&#NNNN;`，必须检查错误标志并提示另存 UTF-8；
- UTF-16 BOM 要先于 null-byte 二进制判定，否则带 BOM 的文档被当成二进制；
- CRLF 与混合行尾要保持：Enter 固定插 `\n` 会让行尾混杂，需要引入「每文档主导行尾」；
- Mermaid 半输入括号要统一安全切片，多处直接切片会 panic；
- 引用块编辑前缀、Split 撤销交错、退出/全关保存全部标签、恢复与自动保存清理。

**P1 21 项，除「统一 Rope」外全做**：Tab/Shift+Tab 缩进、标签右键菜单、Alt+Z 换行、Ctrl+Shift+R 重载、Unicode 大小写折叠搜索、设置防抖落盘、连续输入合并撤销；frontmatter 属性卡片、预览锁定、渲染/分屏查找滚动、系统 Emoji 回退、损坏配置改名备份、本地链接与图片按文档目录解析、剪贴板图片写入 `assets/`；`<details>/<summary>` 与 `<div align>` 的 AST/渲染、可导航块注册表 + 块光标、设置搜索逐行匹配控件、渲染视图独立字体、文件树活动行高亮。

还有一个打开策略的收口：`open_file_smart` 在创建标签前只读前 8KB，判定为二进制就交给系统默认应用并弹 toast，返回 `Result<Option<usize>>`；6 个调用点（打开/拖放/快速切换/CLI/文件树/二次实例）全部跟着改。

**P2 是锦上添花**：Mermaid 第二波（`fa:fa-*`、多索引 `linkStyle`、`%% @pos`、`autonumber`）、图表 popup viewer（0.5–3.0×、双轴拖动）、完整 gitGraph（commit/branch/cherry-pick/三种布局）、Nerd Font 私用区回退、Linux 主选区、原生系统标题栏、运行时统计模块。

这一轮新增 24 个回归测试。几个只在「跨分支移植」时才会踩的坑：

- **旧依赖会在最新 stable 编译器上编译失败**：CI 报 never-type 推断错误，源头是 `rfd 0.14 → ashpd 0.8.1`；升级 `rfd 0.17` 即解。
- **撤销合并的范围过宽会破坏历史语义**：连续输入合并成一次撤销后，测试失败——合并逻辑覆盖到了非 Raw 编辑路径，必须限定作用域。
- **计划文档「勾选即完成」不是完成证据**：两项被标已完成，实际一个仍直接返回二进制错误、另一个只有说明没有 fixture；校验器连续 13 次判未闭环，补实现才过。
- **tag 同名但指向不同提交**：上游 `v0.2.7`–`v0.3.1` 与本项目同名，`git fetch --tags` 会拒绝覆盖；对比只用 `upstream/master`，或把上游 tag 抓到独立命名空间。
- **gitGraph 用 `split("id:")` 解析会错**：带引号的值和重复 `tag:` 都解析不对，要重写属性解析器并补测试。
- **渲染字体复用编辑器字体族会串用**：自定义渲染字体必须独立 `CustomRendered` 字体族，加载失败回退 Inter。

**移植判断的经验**：先问「这项改动依赖上游的哪层架构」，依赖 AST/编辑器/设置框架的一律「只借鉴」；能独立表达成「输入 → 输出」的行为，才值得重写。

## 十二、告警清零与两个自动工具的坑

**编译告警从 33 条清到 0**，顺手净删了 374 行死代码——MarkText 化改造时留下的孤儿函数（`lsp_status_bar_text`、logo 纹理三件套之类）、egui 0.34 的 deprecated API 迁移、测试专用方法加 `#[cfg(test)]` 门控。清零本身不难，难的是忍住「顺手重构」的冲动：只删告警直接指向的死代码，其余不动。

这一步引出两个自动工具的坑，都跟「跨平台」有关：

- **`cargo fix` 会在 Linux 上「修坏」Windows**：它把只在 Windows 分支使用的变量改名加下划线、去掉 `mut`——Linux 编译确实更干净了，但 Windows job 用原名直接编译失败。正解是 `#[cfg_attr(not(windows), allow(unused_variables))]` 表达「仅 Windows 使用」，**不要让自动工具碰条件编译的名字**；
- **CI 的 `cancelled` 不是失败**：新推送排队时会自动取消正在跑的 job，第一次看到 Windows job 变灰还以为测试挂了。判断依据只有 job 的 conclusion 字段，不是颜色。

另一个小坑：`#[test]` 只能用于自由函数，写进 `impl` 块里直接编译错误——测试统一放文件末尾的 `#[cfg(test)] mod tests`。

## 总结

这一段的主线是「从能用到耐用」：打包链路要能稳定出包、桌面集成要能站在系统那一侧、跟上游同步要按行为重写而不是 merge。

- **打包**：锁文件、NSIS 路径基准、Windows runner 的工具安装，三个都可能让发布直接失败；
- **桌面集成**：Wayland 的能力边界、EWMA 任务栏、KDE 的两套 MIME 文件，都属于「框架没给、得自己挂」；
- **跟上游同步**：先写可移植项清单，按 P0/P1/P2 分级，依赖上游架构的一律「只借鉴」。

前七个方向（输入法、导出、性能、恢复、右键、架构判断）仍在主篇：[自己写的编辑器卡在哪：输入法、导出与每帧性能](/2026/10/26/desktop-editor-ime-export-performance/)。
