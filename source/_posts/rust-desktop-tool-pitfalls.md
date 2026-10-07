---
title: "Rust 桌面工具开发踩坑：从 TLS 指纹到系统托盘"
date: 2026-08-10
categories:
  - "开发工具"
tags:
  - "rust"
  - "desktop"
  - "tls"
  - "windows"
  - "linux"
  - "gui"
---

本文汇总多个 Rust 桌面工具（余额监控、壁纸应用、命令行 AI 助手）开发中积累的踩坑记录，覆盖 **TLS 与网络、MSRV 兼容性、Win32/系统集成、SQLite 与进程管理**几个方向。这些项目普遍有"支持老旧系统"与"跨 Windows/Linux"的硬约束，坑尤其密集。

<!-- more -->

## 一、TLS 指纹：不是所有 TLS 都一样

**现象**：某个 HTTPS 状态接口永远连接失败（`Connection reset by peer (os error 104)`），但 curl/Go 请求同一接口完全正常。

**根因**：该接口要求 TLS 握手的第一个密钥交换组为**后量子混合组 X25519MLKEM768**，而旧版 rustls（0.21，随 reqwest 0.11）不支持——curl/Go 能通只是 TLS 指纹不同。

**修复**：升级 rustls 0.23 + `prefer-post-quantum` 特性 + reqwest 0.12（aws-lc-rs 后端不需要 cmake，Windows 自带 NASM）。

**Windows 兼容的反向坑**：为支持 Win7 改用 rustls + webpki-roots 后，**企业 MITM 代理/HTTPS 扫描杀软会校验失败**——老系统兼容与网络环境兼容有时是互斥的，需要按用户群体取舍。

## 二、MSRV 钉子：依赖树的暗雷

固定旧版 Rust（如 1.77.2）的项目，依赖升级风暴随时可能引爆：

- **edition2024 传染**：`icu_normalizer` 新版本要求 edition2024（Cargo 1.85+），它位于 `reqwest → url → idna → idna_adapter` 链上。`cargo generate-lockfile` **不校验 manifest**，本机生成"成功"不代表能编译；
- 一次连环钉死了 9 个依赖版本（idna_adapter、home、indexmap、time、litemap、zerofrom、jobserver、unicode-segmentation、winresource）；
- **`generate-lockfile` 会重置手工钉子**——版本钉子必须写进 `Cargo.toml` 的依赖声明（`=版本`），不能只靠 lock；
- 缺少目标平台工具链时（如本机是 Linux、只出 Windows 包），用 `cargo check` + `cargo fetch --locked` 覆盖跨平台依赖超集，把大部分 MSRV/edition 问题在本地消掉。

## 三、Win32 原生控件（native-windows-gui）的坑

- **`LabelFlags::NONE` 等于隐形空白**：编译能过、界面全白——所有 Label 必须显式 `VISIBLE`；
- **"能显示窗口但一秒自动关闭"**：`RefCell` 借用嵌套（借用守卫未释放又去加载预览）导致崩溃——先取状态快照释放借用再分步操作；同时加 panic 钩子写日志，崩溃现场必入日志；
- **语言切换崩溃实为死锁**：持有配置锁时调用会再次加同一把不可重入 `std::sync::Mutex` 的函数，UI 线程永久挂起——先在独立作用域释放锁再执行；
- **高 DPI 缩放**：manifest 声明 DPI 感知后按物理像素渲染，固定布局在 125%/150% 屏上过小——用 `GetDeviceCaps(LOGPIXELSX)` 查询 DPI，以 96 为基准线性缩放全部坐标；
- **"无法定位程序输入点 GetWindowSubclass"**：exe 缺 Common-Controls v6 manifest，老系统加载的是 system32 的旧版 comctl32。修复：`build.rs` 嵌入 manifest，声明 Common Controls 6.0 + supportedOS GUID + DPI 感知。

## 四、系统托盘与窗口生命周期（跨平台）

- **托盘图标创建失败被静默吞掉**：`Shell_NotifyIconW` 失败只等 TaskbarCreated 广播——"进程在跑、没有图标"。需要重试与兜底；
- **气泡通知的编号偏移**：builder 会占用一个编号，通知必须按 2 指认，写死 1 则永远不出现；
- **开机自启早于外壳**：窗口自藏会变成隐形——应等托盘确实持有（最多 15 秒）再隐藏；
- **Wayland 限制**：`set_visible` 空实现、禁止取消最小化、无输入序列号的后台激活被 KWin 拒绝——默认策略选 `prefer_x11()`；
- **X11 图标尺寸上限**：`_NET_WM_ICON` 单次属性请求上限 65535 个 32 位字，256×256 需要 65538 → 静默失败窗口无图标，改用 128px；
- **托盘库的默认 feature 会拉入完整 Tokio**：无 Tokio runtime 时 panic——用 `default-features = false` + `async-io`。

## 五、SQLite 并发与迁移

- **无 `busy_timeout`/WAL 时多线程报 `database is locked`**；
- **迁移竞态**：`ensure_window_column` 先查后 ALTER，升级后首启时监控线程与界面线程同时 ALTER → 一边报 `duplicate column name`、`open_db` 返回 Err → 表现像"密钥丢失"，重启即好。迁移要用幂等 ALTER（先探测列）并串行化；
- **迁移顺序**：ALTER 迁移排在 CREATE TABLE 之前 → 全新安装报 `no such table`；
- **测试写真实目录是灾难**：crypto 测试直接改写用户状态目录里的密钥文件，而搬迁规则"目标已存在就跳过"→ 密钥解不开像数据全丢。修复：测试状态/配置指向 `/tmp/<app>-tests-<pid>/`，新测试必须先调"隔离目录"辅助函数。

## 六、进程清理的两种误伤

```bash
# 误杀同名旧版本进程
pkill -x dsmon
# 自匹配杀掉执行命令的 shell
pkill -f dsmon
# 正确做法：完整路径匹配取 PID 再 kill
pgrep -f '/usr/local/bin/dsmon' | xargs kill
```

## 七、文件路径安全

从远程返回的 ID 直接拼路径可写/删任意文件（路径遍历，高危）。三层拦截：

1. ID 白名单校验（ASCII、拒绝 `..`、长度 ≤128）；
2. 路径边界断言（拼接结果必须在目标目录内）；
3. 下载限额（大小上限 + Content-Length 预检 + 强制 HTTPS + 图片 magic bytes 校验）。

## 八、CI 与构建的补充教训

- **CI 只有 fmt+build、没有 `cargo test`**：安全回归单测从未在任何环境执行过，补上门禁后首跑即失败（期望值漏目录段、硬编码 `/` 分隔符在 Windows 不成立）；
- **双架构产物同名**：x64/x86 产物同名会在 Release 上互相覆盖，构建后先重命名；
- **本地能过、CI 失败的常见原因**：陈旧 `*.tsbuildinfo`（大量 TS6305 报错，清理即过）、本地残留的构建产物造成假象。

## 总结

Rust 桌面工具开发的坑集中在"**边界条件**"：老旧系统、企业网络环境、高 DPI、跨平台窗口系统、多线程数据库访问——每一项都有隐藏的窄路径。策略是：把兼容性约束写进 CI 门禁、把平台差异封装成显式的探测与降级，而不是"出问题再补"。
