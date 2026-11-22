---
title: "headless Chrome 退不出去：GPU 子进程失控的排查与收尾"
author: "学姐大人"
date: 2026-11-22
categories:
  - "开发工具"
tags:
  - "headless-chrome"
  - "gpu"
  - "systemd"
  - "troubleshooting"
  - "performance"
---

一个 agent 用的 headless Chrome 出现怪现象：**找不到窗口、关掉上层应用也没用、CPU 持续被吃**。任务管理器里它的主进程才 0.1%——看起来一切正常，机器却越来越卡。

这篇记一遍完整排查：真凶藏在进程树的第二层，而且「关闭」这个动作本身也是坏的。

<!-- more -->

## 一、症状与第一层误判

用户侧的观察是「agent-browser 退不出去且持续消耗 CPU」。直接看主进程：PID 95820 只有 0.1%，Chrome 主进程 95840 也才 0.4%——**顶层进程的 CPU 数字会骗人**。

按进程树往下翻一层才看到真凶：Chrome 的 GPU 子进程（`--type=gpu-process`，PID 104231）占用 **508% CPU、21 个线程**。

一个量化证据让它无可辩驳：该进程实际存活 2 分 05 秒，却消耗了 680 秒 CPU（用户态 626.9s + 内核态 53.2s）——**5.4 倍于真实时长**，这是死循环的特征，不是「正常的忙」。

方法本身值得记：`ps` 看百分比不够，要读 `/proc/<pid>/stat` 里的累计 CPU 时间，和进程实际存活时间对比。比值远大于 1（且持续增长）就是失控。

## 二、为什么 GPU 进程会死循环

这台机器没有独显直通，Chrome 用 SwiftShader 做软件渲染（`--use-angle=swiftshader-webgl --enable-unsafe-swiftshader`）。打开重动画页面时：

1. GPU 进程被软件 WebGL 压满；
2. Chrome 的健康检查判定 GPU 进程崩溃，杀掉并重启；
3. 新进程又初始化 SwiftShader，回到第 1 步——**崩溃-重启循环**。

每一轮都烧一遍满载 CPU，所以累计 CPU 时间远超存活时间。

## 三、为什么「关闭」也关不掉

三个因素叠在一起：

- `--headless=new --ozone-platform=headless` **从头到尾没有窗口**——用户想「关窗口」根本没有可关的东西；
- daemon 的原生父进程退出后，被 reparent 到 `systemd --user`（PID 1374），**不是任何上层应用**——关掉上层应用不会回收它；
- Chrome 的优雅关闭要等 GPU 进程确认退出，而 GPU 进程正满载死循环、不响应关闭消息；`close` 命令又只有 `--all` / `--session`，**没有 `--force` / `--timeout`**——只能干等。

## 四、处置与预防

**正常路径**：显式执行 `agent-browser close --all`，会话关闭、端口释放、`/tmp/agent-browser-chrome-*` 自动清理。

**卡死时的强杀顺序**（顺序很重要）：

```bash
pkill -f "agent-browser-chrome"   # 先杀 chrome 子进程
pkill -f "agent-browser-linux-x64" # 再杀主进程
```

顺序反了会留下孤儿 GPU 进程继续烧 CPU——主进程死了，GPU 进程不会跟着退。

**两个不要误杀的细节**：关闭后残留的 `chrome_crashpad_handler` 要先查 PPID 与 cmdline 归属（可能属于 QQ 或别的应用），不要盲目 kill；重渲染页面从源头加 `--disable-gpu`，避免软件 WebGL 压满 CPU。

## 五、把结论固化下来

这类「环境特定」的故障，修完就忘是常态。值得把排查过程写进工具自己的文档：

- 详细内容放独立的 `LOCAL-TROUBLESHOOTING.md`（症状、三层根因、排查命令、处置与预防），主 `SKILL.md` 只加几行指引——**不要把长文塞进 discovery stub**；
- 注意：改技能目录里的文件会让 `.skill-lock.json` 的 `skillFolderHash` 与内容不一致，下次技能 CLI 更新可能提示本地修改或直接覆盖——独立文档要在更新后补回；
- 顺手修正记忆里的误判（比如「父进程是某上层应用」），否则下次排查会从错误的父节点开始。

## 总结

headless Chrome「退不出去」的排查，三层各有一条教训：

- **定位**：顶层进程 CPU 低不代表正常，真凶在进程树第二层；用 `/proc/<pid>/stat` 的累计 CPU 时间对比存活时间，比值失控就是死循环；
- **根因**：无 GPU 环境下软件渲染重动画页面，会触发 GPU 进程崩溃-重启循环；
- **收尾**：headless daemon 被 systemd 收养、close 无 force 语义时，强杀要按「子进程 → 主进程」的顺序，并确认没有孤儿。

最后一句：**「关不掉」本身就是一个 bug 报告**——如果一个工具没有提供强制退出的路径，排障文档里就要写清楚手动收尾的命令，否则每个用户都要重新踩一遍。
