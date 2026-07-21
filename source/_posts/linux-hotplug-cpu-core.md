---
title: "Linux热插拔CPU核心"
date: 2022-10-30
categories:
  - "Linux"
tags: 
  - "cpu"
  - "linux"
---

## 显示系统中共有多少个 CPU 核心

输入以下命令：

```bash
cd /sys/devices/system/cpu
ls -l
```

示例：

```
total 0
drwxr-xr-x 4 root root    0 Apr  2 12:03 cpu0
drwxr-xr-x 4 root root    0 Feb 15 07:06 cpu1
drwxr-xr-x 4 root root    0 Feb 15 07:06 cpu2
drwxr-xr-x 4 root root    0 Feb 15 07:06 cpu3
drwxr-xr-x 4 root root    0 Feb 15 07:06 cpu4
drwxr-xr-x 4 root root    0 Feb 15 07:06 cpu5
drwxr-xr-x 4 root root    0 Feb 15 07:06 cpu6
drwxr-xr-x 4 root root    0 Feb 15 07:06 cpu7
-rw-r--r-- 1 root root 4096 Apr  2 12:03 sched_mc_power_savings
```

共有 8 个 CPU 逻辑内核。转换为人类可读格式：

```bash
lscpu
```

示例：

```
Architecture:          x86_64
CPU op-mode(s):        32-bit, 64-bit
Byte Order:            Little Endian
CPU(s):                32
On-line CPU(s) list:   0-31
Thread(s) per core:    2
Core(s) per socket:    8
Socket(s):             2
NUMA node(s):          2
Vendor ID:             GenuineIntel
CPU family:            6
Model:                 45
Stepping:              7
CPU MHz:               2000.209
BogoMIPS:              4001.65
Virtualization:        VT-x
L1d cache:             32K
L1i cache:             32K
L2 cache:              256K
L3 cache:              20480K
NUMA node0 CPU(s):     0-7,16-23
NUMA node1 CPU(s):     8-15,24-31
```

在每个目录下都有一个 "online" 文件，这是用于逻辑上在线/离线处理器的控制文件。

查看哪些核心是在线状态：

## 关闭某个 CPU 核心

```bash
echo 0 > /sys/devices/system/cpu/cpu6/online
grep "processor" /proc/cpuinfo
```

## 开启某个 CPU 核心

```bash
echo 1 > /sys/devices/system/cpu/cpu6/online
grep "processor" /proc/cpuinfo
```

完成以上操作后，如果您的 BIOS 和服务器厂商支持，您实际上可以物理移除 CPU。

## 验证 CPU 是否在线或离线

要查看所有在线 CPU 的列表，运行：

```bash
cat /sys/devices/system/cpu/online
```

要查看所有离线 CPU 的列表，运行：

```bash
cat /sys/devices/system/cpu/offline
```
