---
title: "Plasma 主题、壁纸与 Winamp 皮肤"
author: "学姐大人"
date: 2023-06-27
categories:
  - "开发工具"
tags:
  - "kde"
  - "desktop"
  - "theme"
  - "wallpaper"
  - "skin"
---

> 本文是《[桌面环境与输入法合集](/2023/06/27/desktop-environment-and-ime/)》的续篇，记录 KDE 主题圆角、GTK 主题移植、Winamp 皮肤格式与 Plasma 壁纸组件的坑。

## KDE 主题的窗口圆角：`mask-*` 不是外形

改 Aurorae 窗口装饰时常会误以为 `mask-*` 是「窗口外形遮罩」，其实在 Plasma 6.8 / KDecoration3 里：

- `mask-*` 经 `KSvg::FrameSvg::mask()` 调用 `setBlurRegion()`，**只定义模糊区域的形状**；
- 窗口外形和圆角由 `decoration-*` 角部元素决定（`decoration-topright` / `right` / `bottomright` 等）；缺的角靠 FrameSvg 镜像回退，实测正常；
- **最大化窗口本来就不绘制圆角**，截最大化窗口无法验证圆角，必须用非最大化窗口实测；
- 底部 4px 圆角肉眼看起来像直角，要用 XML 精确解析 + 高分辨率像素验证，不能靠截图目测。

还有一个几何约束：**圆角半径不能超过边框厚度**。想把底角从 4px 加到 12px，必须同步把 `BorderBottom` 从 4 加到 12、`PaddingBottom` 相应减小、底边条加厚——否则窗口底部会多出一条深色边。改之前先想清楚视觉代价。

另外，4 个 `look-and-feel/*/contents/defaults` 里的 `library=org.kde.kwin.aurorae` 在 Plasma 6.8 已过时，实际插件是 `org.kde.kwin.aurorae.v2`。因为本机 `kwinrc` 早已是 v2 值，所以**不报错、静默失效**，只有重装主题才会把旧值写回。

## GTK 主题在 FreeBSD 上的安装脚本

把 Linux 上的 `install.sh` 直接搬到 FreeBSD 会立刻失败：bash 数组、`[[ ]]`、`sed -i` 需要扩展名、`&>` 重定向，FreeBSD 的 sh 和 BSD sed 都不认。做法是另写一个 POSIX `sh` 脚本，自包含编译与安装：

- `sassc` 只检测并提示 `pkg install sassc`，不代装依赖；
- 默认用户级安装，`-s` 走系统级；
- 没有 GNOME Shell 时跳过 Shell 主题，其余 GTK / Metacity / XFWM4 / Plank / Cinnamon 照常安装；
- GNOME 检测要放在参数解析之后，否则 `-h` / `-u` 也会打印「未找到 gnome-shell」；
- 卸载测试有破坏性（`-u` 会把已有的同名主题一起删掉），做之前先确认能重装恢复。

## Winamp 皮肤格式：能塞什么、不能塞什么

把千千静听（TTPlayer）的 `.skn` 转成 Audacious 能用的 `.wsz`，先要接受一个事实：**这个格式对矢量图一无所知**。

- 插件只识别 `.bmp` / `.png` / `.xpm`（`skins_util.cc`），不支持 SVG，也没有 `@2x` 之类的倍率加载机制；
- `double_size` 只是把整窗按整数倍放大，不是高清资源；
- 主窗口固定按 275×116 绘制，`skin.hints` 里的多数位置项只解析、不生效。

所以「BMP 转 SVG 以获得高分辨率」这条路在运行时收益为零。可行的做法是：**生成 SVG 母版用做源资产，离线渲染 1x/2x PNG 装进 `.wsz`**，布局保留原皮肤的绘制风格、控件位置重排到 Winamp 标准坐标。

另一个容易误判的地方是「旧皮肤过时了」。Audacious 对缺失的位图有不少兜底：`balance` 可以由 `volume` 代替、`nums_ex` 由 `numbers` 代替、`eq_ex` 可选。先读加载器规则再决定清理，否则会把 95 个还能用的皮肤全删掉。转换完的验收也很直接：所有 PNG 能被 GdkPixbuf 解码、尺寸符合 Winamp 2.x 规范、日志里没有 `Skin does not contain` / `Unable to load skin`。

## Plasma 壁纸组件：开机后当日壁纸不切换

一个 Bing 壁纸 plasmoid 的怪现象：开机后当日壁纸**能自动下载**，但桌面不切换，必须右键「刷新今日壁纸」；跨午夜/开机时序下更明显。

**根因有两层，第一层很隐蔽。** `Plasma5Support.DataSource` 的 `executable` 引擎对**相同命令的 source 去重**：开机时第一次 `find` 还没返回，下载回调又去连 `listArchiveFiles()`，第二次连接被引擎静默吞掉——第二个 `find` 从未执行，文件列表永远缺今日文件。日志时序可以实锤：下载回调 12:04:28.059，首次 find 返回 12:04:28.076，第二次 find 从未出现。同一调用里的 `disconnect + connect` 也会被合并，别指望「断开再连」能绕过去。

第二层是重试语义：开机瞬间网络未就绪导致下载失败后，`lastDownloadDate` 已经被置位，当天不再尝试——一次失败锁死一整天。

**修复思路**：

- 发起下载时记录 `pendingDownloadFile`，回调不再用「回调时刻」重新拼日期（跨午夜安全）；
- 下载成功**立即把文件并入列表并选最新文件**，不等可能被去重的第二次查询；
- 下载失败清空当日标记，Timer 每分钟重试；
- 不拿「系统日期 == 文件名」当选择依据——文件名是保存时刻的日期，00:00 后 Bing 可能还没发布当日图，会出现「日期是今天、内容还是昨天」；改为选最新文件，并用 Bing API 的 `fullstartdate` 校验，未切到当天就限次重试。

**验证时记住 QML 不会热更新**：改完 `main.qml` 不重启 plasmashell 等于没改，运行中的进程加载的还是启动时的旧代码。验证前必须重启，并以进程启动时间确认加载的是新版本。诊断手段推荐两个：备份 `main.qml` 注入 `console.warn` 时序日志（仓库源码不动），以及用 plasmashell 的 D-Bus `evaluateScript` 做无副作用探测。
