---
title: "内核开启BBR方法"
date: 2022-03-08
categories:
  - "网络与代理"
tags:
  - "bbr"
  - "kernel"
  - "linux"
---

## 1. 修改系统变量

```bash
sudo su
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
```

## 2. 保存生效

```bash
sysctl -p
```

## 3. 查看内核是否已开启 BBR

```bash
sysctl net.ipv4.tcp_available_congestion_control
```

显示以下即已开启：

```
# sysctl net.ipv4.tcp_available_congestion_control
net.ipv4.tcp_available_congestion_control = bbr cubic reno
```

## 4. 查看 BBR 是否启动

```bash
lsmod | grep bbr
```

显示以下即启动成功：

```
# lsmod | grep bbr
tcp_bbr 20480 14
```
