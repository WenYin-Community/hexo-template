---
title: "Fedora/RHEL动态调优CPU性能模式"
date: 2023-04-09
categories:
  - "Linux"
tags:
  - "fedora"
  - "redhat"
  - "rhel"
  - "cpu"
  - "linux"
---

主要依赖 Tuned。

在 CentOS / RHEL 7 和 Fedora 上，默认情况下已预先安装并激活了 tuned，但在较旧版本的 CentOS / RHEL 6.x 上，需要使用以下 yum 命令进行安装：

```bash
sudo yum install tuned -y
```

安装后，您将找到以下重要的调整配置文件：

- `/etc/tuned` - 调整配置目录
- `/etc/tuned/tuned-main.conf` - 调整的邮件配置文件
- `/usr/lib/tuned/` - 存储所有调优配置文件的子目录

```bash
sudo tuned-adm list
```

列出自带的模式，实际上就是目录 `/usr/lib/tuned/` 里的目录对应 list 出的条目，我们可以自己创建目录写配置文件来定制一个模式。

> Available profiles:
> - accelerator-performance - Throughput performance based tuning with disabled higher latency STOP states
> - balanced - General non-specialized tuned profile
> - desktop - Optimize for the desktop use-case
> - hpc-compute - Optimize for HPC compute workloads
> - intel-sst - Configure for Intel Speed Select Base Frequency
> - latency-performance - Optimize for deterministic performance at the cost of increased power consumption
> - network-latency - Optimize for deterministic performance at the cost of increased power consumption, focused on low latency network performance
> - network-throughput - Optimize for streaming network throughput, generally only necessary on older CPUs or 40G+ networks
> - optimize-serial-console - Optimize for serial console use.
> - powersave - Optimize for low power consumption
> - throughput-performance - Broadly applicable tuning that provides excellent performance across a variety of common server workloads
> - virtual-guest - Optimize for running inside a virtual guest
> - virtual-host - Optimize for running KVM guests
> Current active profile: desktop

## 常用模式介绍

### balanced

它的目的是成为性能和功耗之间的折衷。它试图尽量使用自动调节。它有好的结果对于大多数负载。唯一的缺点是增加了延迟。在当前调释放它使 CPU、磁盘、音频和视频插件和激活 ondemand 调控器。radeon_powersave 设置为自动。

### desktop

针对桌面系统设计的节能 Profile，对 SATA 适配器、CPU、网络和磁盘插件应用 ALPM 策略。

### latency-performance

典型低延迟的性能模式。此配置会禁用动态调整机制和透明的大页面。cpuspeed 模式改变为 performance，将性能低的 CPU 锁定 C 状态（通过 PM QoS）。同时将磁盘 IO 的调度算法更改为 deadline，在 Red Hat Enterprise Linux 6.5 和更高版本中 cpu_dma_latency 参数的值注册为 1（可能的最低延迟，早期值为 0），用于电源管理服务质量，以尽可能限制延迟。

### throughput-performance

高吞吐量优化模式。用于典型吞吐量性能调整的服务器配置文件，它禁止 tuned 和 ktune 节能机制。如果系统没有企业级存储，则建议使用此配置文件。与 latency-performance 类似，但有以下区别：

- `kernel.sched_wakeup_granularity_ns`（调度程序唤醒粒度）设置为 15 毫秒
- `vm.dirty_ratio` 设置为 40%：脏数据限制，内存里的脏数据百分比不能超过这个值
- 透明的大页面已启用

### virtual-guest

基于企业存储配置文件，在其他任务，增加虚拟内存 swappiness 和减少磁盘预读值。它没有禁用磁盘屏障。

### oracle

基于 throughput-performance 模式，它另外禁用透明的巨大的页面和修改内核参数相关的一些其他性能。这个配置文件是由 tuned-profiles-oracle 包。在 6.8 及以后版本可用。

### network-latency

包括 "latency-performance"，禁用 transparent_hugepages，禁用 NUMA 平衡并启用一些基于延迟的网络调整。

### network-throughput

包括 "throughput-performance"，并增加网络堆栈缓冲区大小。

## 获取当前模式

```bash
sudo tuned-adm active
```

输出：

```
Current active profile: balanced
sudo tuned-adm profile_mode
Profile selection mode: auto
```

## 切换模式

切换到 throughput-performance 模式：

```bash
sudo tuned-adm profile throughput-performance
```

切换到 network-throughput 模式：

```bash
sudo tuned-adm profile network-throughput
```

切换到 network-latency 模式：

```bash
sudo tuned-adm profile network-latency
```
