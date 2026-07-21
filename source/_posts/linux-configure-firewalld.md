---
title: "Linux下firewallD简单上手"
date: 2018-03-08
categories:
  - "网络与代理"
tags:
  - "firewalld"
  - "防火墙"
  - "linux"
---

| 导读 | FirewallD 是 [CentOS](https://www.linuxprobe.com/ "centos") 7 服务器上默认可用的防火墙管理工具。基本上，它是 iptables 的封装，有图形配置工具 firewall-config 和命令行工具 firewall-cmd。使用 iptables 服务，每次改动都要求刷新旧规则，并且从 /etc/sysconfig/iptables 读取新规则，然而 firewalld 只应用改动了的不同部分。 |
| --- | --- |

FirewallD 使用服务（service） 和区域（zone）来代替 iptables 的规则（rule）和链（chain）。

默认情况下，有以下的区域（zone）可用：

1. **drop** – 丢弃所有传入的网络数据包并且无回应，只有传出网络连接可用。
2. **block** — 拒绝所有传入网络数据包并回应一条主机禁止的 ICMP 消息，只有传出网络连接可用。
3. **public** — 只接受被选择的传入网络连接，用于公共区域。
4. **external** — 用于启用了地址伪装的外部网络，只接受选定的传入网络连接。
5. **dmz** — DMZ 隔离区，外部受限地访问内部网络，只接受选定的传入网络连接。
6. **work** — 对于处在你工作区域内的计算机，只接受被选择的传入网络连接。
7. **home** — 对于处在你家庭区域内的计算机，只接受被选择的传入网络连接。
8. **internal** — 对于处在你内部网络的计算机，只接受被选择的传入网络连接。
9. **trusted** — 所有网络连接都接受。

要列出所有可用的区域，运行：

```bash
firewall-cmd --get-zones
```

列出默认的区域：

```bash
firewall-cmd --get-default-zone
```

改变默认的区域：

```bash
firewall-cmd --set-default-zone=dmz
firewall-cmd --get-default-zone
```

## FirewallD 服务

FirewallD 服务使用 XML 配置文件，记录了 firewalld 服务信息。

列出所有可用的服务：

```bash
firewall-cmd --get-services
```

XML 配置文件存储在 `/usr/lib/firewalld/services/` 和 `/etc/firewalld/services/` 目录下。

## 用 FirewallD 配置防火墙

作为一个例子，假设你正在运行一个 web 服务器，SSH 服务端口为 7022，以及邮件服务，你可以利用 FirewallD 这样配置你的服务器：

首先设置默认区为 dmz：

```bash
firewall-cmd --set-default-zone=dmz
firewall-cmd --get-default-zone
```

为 dmz 区添加持久性的 HTTP 和 HTTPS 规则：

```bash
firewall-cmd --zone=dmz --add-service=http --permanent
firewall-cmd --zone=dmz --add-service=https --permanent
```

开启端口 25 (SMTP) 和端口 465 (SMTPS)：

```bash
firewall-cmd --zone=dmz --add-service=smtp --permanent
firewall-cmd --zone=dmz --add-service=smtps --permanent
```

开启 IMAP、IMAPS、POP3 和 POP3S 端口：

```bash
firewall-cmd --zone=dmz --add-service=imap --permanent
firewall-cmd --zone=dmz --add-service=imaps --permanent
firewall-cmd --zone=dmz --add-service=pop3 --permanent
firewall-cmd --zone=dmz --add-service=pop3s --permanent
```

因为将 SSH 端口改到了 7022，所以要移除 ssh 服务（端口 22），开启端口 7022：

```bash
firewall-cmd --remove-service=ssh --permanent
firewall-cmd --add-port=7022/tcp --permanent
```

要应用这些更改，我们需要重新加载防火墙：

```bash
firewall-cmd --reload
```

最后可以列出这些规则：

```bash
firewall-cmd --list-all
```

---

via: [Set Up and Configure a Firewall with FirewallD on CentOS 7](https://www.rosehosting.com/blog/set-up-and-configure-a-firewall-with-firewalld-on-centos-7/)

译者简介：

[Locez](http://locez.com/) 是一个喜欢技术，喜欢折腾的 Linuxer，靠着对 Linux 的兴趣自学了很多 Linux 相关的知识，并且志在于为 Linux 在中国普及出一份力。

作者：[rosehosting.com](https://www.rosehosting.com/blog/set-up-and-configure-a-firewall-with-firewalld-on-centos-7/) 译者：[Locez](https://github.com/locez) 校对：[jasminepeng](https://github.com/jasminepeng)

本文由 [LCTT](https://github.com/LCTT/TranslateProject) 原创编译，[Linux中国](https://linux.cn/) 荣誉推出
