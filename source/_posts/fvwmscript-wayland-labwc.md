---
title: "把 FvwmScript 生态搬到 Wayland：不改旧代码的 labwc 兼容路线"
author: "学姐大人"
date: 2026-11-26
categories:
  - "开发工具"
tags:
  - "wayland"
  - "labwc"
  - "fvwm"
  - "migration"
  - "c"
---

NsCDE 是一套 CDE 风格的桌面，底座是 FVWM——一个 X11 时代的窗口管理器。它的交互面板、对话框、工具全靠 FvwmScript 写成：39 个脚本、26,724 行、660 个控件。想让这套东西活在 Wayland 上，直觉方案是「fork 合成器」或「Xwayland 转译」，但这次走了第三条路：**换一个原生 Wayland 合成器当宿主，FvwmScript 的代码一行不改**。

这篇记的是方向判断和落地时踩的坑。X11 遗产迁移到 Wayland 的文章很多，但「怎么让一堆无法重写的旧脚本继续跑」这个角度，参考资料几乎没有。

<!-- more -->

## 一、先想清楚「不改旧代码」的真实含义

用户的需求约束是逐步收紧的，最后成型为四条：完整兼容 fvwm3 的 FvwmScript、原样式直接移植、Wayland 原生（不考虑 Xwayland）、不改和尽量少改旧代码。

「Wayland 原生 + 不改旧代码」在模块层是物理上不可兼得的——FvwmScript 的窗口和绘制全是 Xlib，Xlib 在 Wayland 下没有宿主。所以「尽量少改」必须被精确定义：

- **改动的全部集中在窗口/渲染后端**：`FvwmScript.c` 的 1,480 行事件循环（Xlib → wayland-client + xdg-shell）和 `Widgets/*.c` 的 5,564 行绘制层（X → cairo）；
- **语言层与控件逻辑保持原文件不动**：39 个脚本 26,724 行零改动，bison/flex 源 1,051 行零改动。

这个定义立住之后，工作量可以从「重写整个桌面」收敛到「换两个后端」：估算 11–16 周、净新增 8–10k 行 C。

## 二、合成器选 labwc，而且裁决它零改动

选 labwc（Openbox 风格的堆叠合成器）是因为它能覆盖 FVWM 的窗口管理核心：堆叠、`windowRules`、键鼠绑定、嵌套菜单、虚拟桌面、Openbox 3 主题兼容。更关键的是把「要不要 fork labwc」做了一次分档裁决：

| 需求 | labwc 现状 | 改动量 |
| --- | --- | --- |
| 对话框类脚本 | 交给 FvwmScript 兼容层 | 0 行 |
| 命令通道（列出/激活/移动窗口） | foreign-toplevel + ext-workspace + SIGHUP 均已具备 | 0 行 |
| 面板宿主与 applet | 同一进程内 `wl_subsurface` | 0 行 |
| 真跨进程窗口嵌入 | 需改 wlr_scene 图层 | 唯一 fork 触发点 |

第四档被 subsurface 方案消解之后，labwc 的改动量锁定在 **0 行、不 fork**——跟上游的关系从「维护一个 fork」变成「纯使用者」，这是整个方案里最值钱的一个决定。

顺带排除掉两条死路：fork fvwm3 给它换 Wayland 后端（上游 issue #970 官方判定 impossible）；用带 IPC 的年轻合成器（功能覆盖不够，且太年轻不敢押）。

## 三、旧代码怎么「零改动」地接进来

两个关键机制：

**1. 模块协议照抄。** fvwm 侧的 `module_list.c` 建双向管道后 fork/exec 子进程，fd 通过 `argv[1]`/`argv[2]` 传递——不是环境变量。argv[3] 是配置路径、argv[4] 是 window context。兼容层（compatd）按同一协议与脚本进程对话，脚本侧的通信代码完全不用动。

**2. 解析器直接 vendor。** FvwmScript 的语法解析器是 bison/flex 生成的 C 代码，把它连同一批头文件 vendor 进来，补一个 stub `config.h` 和 10 个符号 shim，就能在不改 fvwm3 源码的前提下获得与原版**完全一致**的语法解析。双解析对比（vendored vs 手写）39 个脚本 37 个完全匹配、1 个已知差异、1 个待修数据。

## 四、labwc 的配置陷阱（都是静默失败）

这套迁移里最磨人的不是写代码，是 labwc 的配置项**错了不报错**：

- `<desktops>` 写在 `<core>` 里会被静默忽略——表现为 ext-workspace 只暴露 1 个桌面，我一度以为是协议限制，找了两天才发现是 XML 层级放错。必须放 `rc.xml` 根级；
- `labwc -c` 是配置**文件**路径、`-C` 才是配置**目录**。把目录传给 `-c`，整个配置被静默忽略、回退默认主题——截图里的装饰一直是内置浅灰，我还以为主题引擎有 bug；
- 标题栏布局不是 `<titleLayout>`，是 `<theme><titlebar><layout>` 嵌套元素。CDE 原版标题栏是 `menu:iconify,max`（没有 close），猜错配置层级就永远是三键。

**教训：合成器的配置静默失败时，先怀疑 XML 层级，再怀疑功能不支持。**

## 五、Wayland 客户端开发的几个必踩点

兼容层本身是标准 wayland-client + xdg-shell，几个坑都值得单独记：

**poll 前必须 `wl_display_flush`。** Wayland 请求是先攒在客户端队列里的，主循环直接 `poll` fd 会把还没发出去的请求一起阻塞——表现是窗口纯黑或根本不创建。这个问题我在两个阶段各踩了一次（第一次是 bind 死等，第二次是 attach/commit 没送达）。

**subsurface 是父 surface 的双缓冲状态。** 面板上的 applet 只 commit 自己的子 surface，父 surface 不再 commit，位置更新永远不生效。补一次父 commit 才可见。

**xdg-shell v4 起的 `configure_bounds` 事件必须注册。** 不处理新 opcode，libwayland 直接终止客户端——窗口刚建就断开，报错信息完全指向不了根因。

**D-Bus 回调里不能同步创建代理。** 托盘（SNI）注册的回调里同步建 TrayItem 会消息重入死锁；先 return、再 `idle_add` 里创建。而 `idle_add` 的回调返回 `True` 会被解释为「重复执行」——单核 100% CPU 的来源。

## 六、验证的三层递进

- **headless**：`WLR_BACKENDS=headless` 截图逐项比对——快，但合成器配置错误在这里最容易漏（默认配置也能出图）；
- **嵌套**：跑在 KDE 窗口里，肉眼确认主题与桌面数；
- **独立 D-Bus + 最小环境**：等价 SDDM 启动路径，只差物理显示器。

最后是 **39 脚本启动冒烟矩阵**：每个脚本都拉起、渲染首帧、退出，39/39 通过。这个矩阵比任何单项测试都能说明「兼容」到底到什么程度——单看功能列表会高估，单看失败样例会低估。

## 七、还有一类坑：旧仓库自己就是坏的

vendor NsCDE 的 Python 资产时发现 `MotifColors.py` 顶层 import 的两个模块在母仓库里根本不存在——旧的主题链从拆分那天起就 import 会失败。这不是要修的 bug，是要记录的证据：**vendor 前先跑一遍 import，坏的就地淘汰，别把「能跑」当成默认前提。**

## 八、翻盘：布局别自己写，vendor 上游原码

面板布局是这套移植里最后、也是最典型的一段弯路。

时间线是这样的：先自己写按钮条 → applet 和按钮条各自从不同起点画，互相重叠；`__APPLET__` 占位符和空 launcher 混在一条里；按原配置重写一遍，用户看完还是「布局混乱」。最后放弃自写，直接 vendor 上游 FvwmButtons 的 `parse.c`/`button.c`/`draw.c`——**几何第一次和原项目一致**（root 1015×79、菜单/手柄 21px、左 5 launcher 63px、WSM 343px）。

动手前先数了依赖面：布局核心只有 **2 个 X11 符号 + 25 个 fvwm 函数**——这个数字决定了「vendor 原码」是可行的，如果依赖几百个符号就得另想办法。补 30 多个平台 shim 之后，9,114 行上游代码原样跑起来；绘制层同理（X11→cairo、Flocale→Pango、FvwmPicture→gdk-pixbuf），连 pclock 的指针几何都是照 `Graphics.c` 的公式抄的（时针 16px、分针 22px、秒针 22px，宽 4）。

**通用教训：如果上游代码的依赖面足够小，移植 > 重写。** 重写省不掉理解成本，还多一份「看起来一样但差几像素」的风险。

这一轮配套踩的坑：

- **「全部黑屏」是清理脚本误杀**：headless 验证结束时 `pkill -x swaybg nscde-paneld`，把嵌套会话里的壁纸和面板一起杀了——看起来像渲染崩了，实际是自杀。按 PID 精确清理；
- **shim 里的几何函数不能留空实现**：`XParseGeometry` 返回空时，布局「看起来跑了」但尺寸全是默认值，排查半天才发现根因在 shim；
- **Xwayland 禁用后 Swallow 槽永久黑**：目标窗口永远不会出现，按钮一直保持 `b_Hangon`，上游 `draw.c` 因此选了无背景色的 Pixmap colorset 填黑。布局构建完成后清 `b_Hangon`、空槽回落普通 colorset；
- **fvwm 配置是无分隔拼接**：`*FrontPanel` 和 option 不是 `*FrontPanel: option`，`GetTokenIndex` 按模块名长度切片——shim 必须按这个格式喂行，否则配置整段解析不到；
- **配置里的转义不还原会截断解析**：`InfoStoreAdd` 里的 `\"` 没还原，按钮定义被截断成黑块，子面板还把 `$[gt.*]` 当字面量显示；
- **嵌套会话下 grim 会挂起**：宿主 KDE 暂时不产新帧，`grim` 一直等不到 frame——视觉验证放 headless，嵌套会话只用来人工目视。

还有一条流程上的：**待办长期 pending 会卡死目标验证器**。需要用户授权的动作（比如 push）留在 pending 里，completion verifier 会一轮轮判「未完成」并反复要求授权，实际没有新工作可做。该尽早标成「等待授权」，而不是留 pending。

## 总结

把不可重写的旧生态搬到新平台，真正决定成败的是三个判断：

- **「少改」要被精确量化**——锁定改动面（两个后端文件），其余全部零改动，工作量才可控、行为才可对齐；
- **宿主的改动量要单独裁决**——合成器零改动、不 fork，长期维护成本直接归零；
- **静默失败优先查配置层级**——合成器不报错的配置错误，比协议不支持更浪费时间。

一句话：**兼容旧生态的价值不在「能跑起来」，在于旧代码的每一行行为都还有人对账。** 39/39 的冒烟矩阵，就是这份对账单。
