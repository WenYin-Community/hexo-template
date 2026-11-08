---
title: "在 FreeBSD 上跑 mihomo：TUN 的三条路与八个坑"
author: "学姐大人"
date: 2026-11-08
categories:
  - "开发工具"
tags:
  - "freebsd"
  - "mihomo"
  - "clash"
  - "tun"
  - "network"
  - "proxy"
---

把一套 Linux 上的 clash/mihomo 管理脚本移植到 FreeBSD，最麻烦的不是 shell 语法（虽然也够麻烦），而是**大家默认「Linux 能跑的 TUN，FreeBSD 也能跑」**。实际测下来，mihomo 在 FreeBSD 上的两条原生路径都是死的，最后只能换后端。

这篇按实际排查顺序记一遍：先解决虚拟机出网，再试 TUN 的三条路，最后是八个 FreeBSD 特有的适配缺陷。

<!-- more -->

## 一、先解决出网：SSH 反向隧道

测试环境是 KVM 里的 FreeBSD 15.1（4C/4G），GitHub 直连不通，但 `pkg.freebsd.org` 与 `gh-proxy.com` 可达。安装脚本要从 GitHub 拉 yq、geoip、dashboard，所以先得让 guest 能出网。

做法是用 SSH 反向隧道，把宿主机的代理端口映射进虚拟机：

```bash
# 在宿主机执行，把 guest 的 127.0.0.1:17890 转发到宿主机 127.0.0.1:7890
ssh -R 17890:127.0.0.1:7890 user@<vm-ip>
```

guest 内把代理指向 `127.0.0.1:17890` 即可。这里有个自找的坑：第一版隧道直接监听 guest 的 `7890`，而 mihomo 的 mixed-port 也是 `7890`——脚本的端口冲突检测生效，把 mixed-port 自动改成了 `7891`。看起来"能跑"，但后续所有验证都对着错误的端口。把隧道改到 `17890` 并重装后，mixed-port 才恢复 `7890`。

**结论**：隧道端口不要和被测服务的默认端口重合，否则「自动避让」会悄悄改掉你的配置。

## 二、TUN 的三条路

### 方案 A：mihomo 自带 TUN —— 必然失败

第一反应是开 mihomo 的 `tun:` 配置。结果设备起不来，日志也不明显。查 `sing-tun` 源码才看到根因：

```go
// tun_other.go
//go:build !(linux || windows || darwin)
func tunDevice() (tun.Device, error) {
    return nil, os.ErrInvalid
}
```

FreeBSD 直接落进 `tun_other.go`，返回 `os.ErrInvalid`。**这不是内核不支持 `/dev/tun`，而是依赖库根本没实现这个平台**。所以无论怎么调 mihomo 配置都不会成功。

### 方案 B：pf rdr + redir —— 后端是坏的

第二条路是 FreeBSD 传统的透明代理：pf 的 `rdr` 把流量重定向到本地端口，mihomo 用 `redir` 后端接管。理论上可行，实际也死了。

mihomo 的 `tcp_freebsd.go` 照搬了 Linux 的 `SO_ORIGINAL_DST`：

```go
const SO_ORIGINAL_DST = 80
```

这个 socket option 在 FreeBSD 上不存在。实测调用直接返回 `errno 42 Protocol not available`；更糟的是 `handleRedir` 解析失败后直接 `conn.Close()`，**没有任何日志**——表现就是"连上了但立刻断"，非常难查。

### 方案 C：tun2socks —— 可行

最后走的是「mihomo 只做 SOCKS 代理，TUN 交给 tun2socks」：

- mihomo 监听 SOCKS（本地回环即可）；
- `tun2socks` 创建 TUN 设备，把流量转给 mihomo 的 SOCKS 端口；
- 路由把默认流量指到 `tun0`。

实测 `tun on` 后默认路由从 `vtnet0` 切到 `tun0`（`198.18.0.1/15`），`pkg.freebsd.org` 与 `github.com` 都返回 200，UDP 日志能看到 `1.1.1.1:53` 的 DNS 查询；`tun off` 后路由恢复、设备销毁。TCP + UDP 都是真 TUN，不需要改 mihomo 内核。

**代价**：多一个进程、多一层转发，但这是 FreeBSD 上唯一能用的方案。

## 三、八个 FreeBSD 适配缺陷

脚本从 Linux 搬过来后，按最小权限在 VM 里回归，修了这些：

1. **autostart 关闭时 `service start` 会被拒绝**：FreeBSD 的 rc 系统在 `rc.conf` 里服务为 `NO` 时不允许 `start`，必须用 `onestart`；`stop`/`restart` 同理改成 `onestop`/`onerestart`；
2. **rc.d 启动环境缺 `/usr/local/bin`**：导致 mihomo 与控制器探测都找不到命令，日志报「控制器未在预期时间内可访问」——rc.d 模板里显式设置 `PATH`；
3. **`clashctl select <组> <节点>` 非交互调用崩溃**：缺 `proxy_select_direct` 函数，补上并复用 `proxy_group_select`；
4. **doctor 缺 `freebsd-rc` 分支**：诊断脚本的 `case` 没有 FreeBSD 分支，直接落到 unknown；
5. **status 后端显示错误**：非 root 用户看不到 root 进程，改用 pidfile + `ps -p` 检测；
6. **Dashboard 白名单漏了 `zashboard-release`**：新版 dashboard 的路径没进白名单，访问 404；
7. **卸载不清理 root shell rc**：system scope 卸载后 root 的 `.profile`/`.cshrc` 里还留着环境变量块；
8. **`tun off` 误删回环路由**：排除网段里包含 `127.0.0.0/8`，关闭 TUN 时把回环网段的路由一起删了——关闭逻辑要显式跳过回环。

另外两个不是"缺陷"但必须处理：

- **TUN 切换默认路由会断公网 SSH**：SSH 对端流量被吸进 TUN，连接立刻断。解法是从 `SSH_CONNECTION`、`netstat`、`who` 里识别对端 IP，加一条直连路由，`tun off` 时清理；
- **bash → sh 全量迁移成本过高**：FreeBSD 的 sh 不支持数组、`[[ ]]`、`(( ))`、`<()`、`<<<`、`${var:1:2}`，全量迁移涉及 1.6 万行、300+ 语法点。最后决定不迁移，只修缺陷。

## 四、验证清单

FreeBSD 上验证代理是否真的工作，按这个顺序：

```bash
# 1. 服务与端口
service clash_freebsd status
sockstat -4 -l | grep -E '7890|9090'

# 2. SOCKS 直连
curl -x socks5h://127.0.0.1:7890 https://github.com -o /dev/null -w '%{http_code}\n'

# 3. TUN 路由
netstat -rn | head -5          # 默认路由应指向 tun0
ifconfig tun0                   # 198.18.0.1/15

# 4. TUN 下真实出网（不走 -x）
curl https://pkg.freebsd.org -o /dev/null -w '%{http_code}\n'

# 5. 关闭后恢复
clashctl tun off
netstat -rn | head -5          # 默认路由回到 vtnet0
```

## 总结

FreeBSD 上跑 mihomo 的核心结论只有一句：**不要假设 Linux 的 TUN 实现可以平移**。

- `sing-tun` 对 FreeBSD 是显式返回 `os.ErrInvalid`，不是配置问题；
- mihomo 的 `redir` 后端照搬了 Linux 的 socket option，在 FreeBSD 上必然失败且无日志；
- 唯一可行的是 **tun2socks + SOCKS**，多一层转发换真 TUN；
- 移植脚本时，rc.d 的 `onestart`、PATH、pidfile 检测、回环路由这些都是 FreeBSD 特有的窄路径，要逐项过一遍。

最后一条经验：**测试环境的网络要先打通再谈功能**。这次如果没先把 SSH 反向隧道和端口冲突理清楚，后面所有"TUN 不通"的现象都会指向错误的方向。
