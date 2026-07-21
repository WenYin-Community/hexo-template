---
title: "用户会话退出导致的级联服务停止"
date: 2026-03-27
categories:
  - "Linux"
tags:
  - "systemd"
  - "linux"
  - "service"
---
# 用户会话退出导致的级联服务停止

**TL;DR**: 用户 `wenyinos` (UID 1002) 注销 SSH/图形会话导致其 systemd user 实例停止，所有用户级服务（ZeroClaw、CLI Proxy API）被级联终止。解决方案：启用 `loginctl enable-linger`。

---

## 问题分析

### 根本原因
所有服务运行在用户 `wenyinos` (UID 1002) 的 systemd user 实例 (`user@1002.service`) 下，当该用户注销会话时，Linux 默认终止其所有进程和服务。

### 关键证据链
日志显示标准的 **Systemd User Session Shutdown** 流程：

1. **业务服务停止**
   - `zeroclaw.service: Succeeded.`
   - `cliproxyapi.service: Succeeded.`（正在处理请求时被中断，返回 500 错误）

2. **用户级目标停止**
   - `Stopped target Basic System/Paths/Sockets/Timers`
   - 用户级 socket 被关闭（dbus、gpg-agent、snapd 等）

3. **会话结束**
   - `Finished Exit the Session.`
   - `Reached target Exit the Session.`

4. **用户管理器停止**
   - `systemd[1]: user@1002.service: Succeeded.`
   - `systemd[1]: Stopped User Manager for UID 1002.`
   - `Removed slice User Slice of UID 1002.`

### 为什么 CLI Proxy 报 500 错误？
在进程被强制终止 (SIGTERM) 时，CLI Proxy 正在处理一个耗时 6.82s 的 POST 请求，无法完成响应，因此记录内部错误。这是停机过程中的正常现象，非代码缺陷。

---

## 解决方案

### 启用 Systemd Linger（防止再次发生）

```bash
# 启用 linger（需 root/sudo）
sudo loginctl enable-linger wenyinos

# 验证状态
loginctl show-user wenyinos -p Linger
# 应输出: Linger=yes

# 重启服务以应用更改
systemctl --user daemon-reload
systemctl --user restart zeroclaw cliproxyapi
```

**作用**：即使用户无活跃会话，systemd 也会保持该用户的 systemd 实例运行，实现服务后台常驻。

---

## 总结

- **非崩溃**：服务被系统优雅终止
- **非配置错误**：Linux 用户会话管理的默认行为
- **修复方法**：执行 `sudo loginctl enable-linger wenyinos`

---

## 预防清单

- [ ] 为所有生产环境用户服务启用 linger
- [ ] 使用 `systemctl --user enable` 设置服务自启
- [ ] 考虑使用 `tmux`/`screen` 作为备选方案
- [ ] 监控用户会话状态

---

**Tags**: #systemd #linux #troubleshooting #service-management #zeroclaw #session #uid-1002
