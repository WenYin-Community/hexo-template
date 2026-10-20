---
title: "CPU、电源与内核调优合集"
author: "学姐大人"
date: 2025-08-17
categories:
  - "开发工具"
tags:
  - "cpu"
  - "power-management"
  - "kernel"
  - "linux"
  - "fedora"
---

性能模式、电源管理、CPU 热插拔与大小核调度、内核版本与内存压缩（zram）——都是「让机器按预期跑」的设置。

<!-- more -->

<a id="fedora-rhel-cpu-tuned-mode"></a>

## Fedora/RHEL动态调优CPU性能模式

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

<a id="linux-power-management"></a>

## Linux 电源管理设置

# 使用 CPUfreq 调控器

减少系统电力消耗和发热量的最有效的方法之一就是使用 CPUfreq。CPUfreq，也被称为 CPU 速度计，它允许随时调整处理器的时钟速度。这让系统可在降低的时钟速度下运行以便节电。CPUfreq 调控器中定义了更改频率的规则，无论是加快还是减慢时钟速度，以及何时更改频率。

调控器定义了系统的电源属性，它可影响 CPU 性能。每个调控器有其自身独特的负载行为、目的和实用性。这部分描述了如何选择和配置 CPUfreq 调节器，每个调节器的属性以及每个调节器适用的负载种类。

### CPUfreq 调控器类型

本节列出了 Red Hat Enterprise Linux 7 中可用的 CPUfreq 调控器的不同类型。

cpufreq\_performance

性能调控器会强制 CPU 使用最高时钟频率。这个频率是静态设置的，不会改变。因此，这个特定的调节器“_不提供节电效益_”。它只适用于几个小时的高负载，而且即使在那种情况下也只可用于 CPU 几乎不（或者从不）闲置的时候。

cpufreq\_powersave

反，节电调控器会强制 CPU 使用最低时钟频率。这个频率将被静态设置，且不会更改。因此，这个特定调节器提供最大节能效益，但这是以“最低 CPU 性能”为代价的。

这里“节电”一词有时是不正确的，因为（原则上）满负载但低速运行的 CPU 消耗的电量比没有负载但高速运行的 CPU 要多。因此，尽管我们可能建议在需要低性能时设定 CPU 使用节电调控器，但是在这期间意外的高负载可能会导致系统实际消耗了更多的电量。

简单地说，节电调控器对 CPU 更象是"限速器"而不是"节能器"。它在过热时会出问题的系统和环境中最有用。

cpufreq\_ondemand

按需调控器是一个动态调控器，它允许 CPU 在系统负载高时达到最大时钟频率，还允许系统处于闲置时使用最低时钟频率。虽然这允许系统根据系统负载调整电源消耗，但也确实要承受“_频率切换间造成的延迟_”。因此，如果系统在闲置和高负载间切换过于频繁，那么延迟可抵消任何按需调控器带来的性能/节能优势。

对大多数系统来说，按需调控器可在散热、电源消耗、性能以及管理性间提供最佳折中方案。若系统只在每天的某个具体时间繁忙，按需调控器将根据负载自动在最大和最小频率间切换而无须进一步操作。

cpufreq\_userspace

用户空间调控器允许用户空间程序，或者任何以 root 身份运行的进程，来设置频率。所有的调控器当中，用户空间调控器是最能够自定义的。根据它的配置，它能够为您的系统提供最佳的性能和能耗的折中方案。

cpufreq\_conservative

与按需调控器类似，传统调控器也会根据用量调整时钟频率（类似按需调控器）。但是按需调控器更极端（从最大到最小，再返回），传统调控器则在更接近的频率间进行切换。

这意味着传统调控器会将时钟频率调整为它认为适合负载的频率，而不是简单的在最大和最小频率间选择。虽然这样可以极大地节省电量消耗，但它的代价是产生比按需调控器“_更多的延迟_”。

**注意**

您可以使用 `cron` 指令启用调控器。这允许您在每天的特定时间自动设定某特定调节器。因此，您可以在闲置时指定低频率调控器（例如工作之余），并在高负载时返回高频率调控器。

若要查看如何启用特定调控器的操作指南，请参阅〈[第 3.2.2 节 “CPUfreq 设置”](https://access.redhat.com/documentation/zh-cn/red_hat_enterprise_linux/7/html/power_management_guide/cpufreq_governors#cpufreq_setup)〉。

### CPUfreq 设置

所有的 CPUfreq 调控器都被内置于 kernel 工具包中，并且会被自动选定，因此若要设置 CPUfreq，您需要选择一个调控器。

您可以通过下列指令查看特定 CPU 可以使用的调控器：

`cpupower frequency-info --governors`

之后，您可以通过下列指令在所有 CPU 上启用这些调控器：

`cpupower frequency-set --governor` 

_\[governor\]_

若要只在特定核上启用某个调控器，请使用 `-c` 指令和 CPU 数的范围或是逗号分隔的清单。例如，若要为 CPU 1-3 和 5 启用用户空间调控器，指令为：

`cpupower -c 1-3,5 frequency-set --governor cpufreq_userspace`

### 微调 CPUfreq 策略和速度

选择适当的 CPUfreq 调控器后，您就可以使用 `cpupower frequency-info` 指令查看 CPU 速度和策略的信息，并可以使用 `cpupower frequency-set` 指令的选项进一步微调每一个 CPU 的速度。

`cpupower frequency-info` 有以下可用选项：

`--freq` — 根据 CPUfreq 核显示该 CPU 的当前速度，单位为 KHz。

`--hwfreq` — 根据硬件显示 CPU 的当前速度，单位为 KHz（仅限 root 用户）。

`--driver` — 显示这个 CPU 中用来设定频率的 CPUfreq 驱动器。

`--governors` — 显示此 kernel 上可用的 CPUfreq 调控器。若您想要使用此文件中未列出的 CPUfreq 调控器，请查看〈[第 3.2.2 节 “CPUfreq 设置”](https://access.redhat.com/documentation/zh-cn/red_hat_enterprise_linux/7/html/power_management_guide/cpufreq_governors#cpufreq_setup)〉

`--affected-cpus` — 列出需要频率协调软件的 CPU。

`--policy` — 显示当前 CPUfreq 策略范围，单位为 KHz，以及当前活跃的调控器。

`--hwlimits` — 列出该 CPU 的可用频率，单位为 KHz。

`cpupower frequency-set` 有以下可用选项：

`--min` _<freq>_ 和 `--max` _<freq>_ — 设定 CPU 的 “_策略限制_”，单位为 KHz。

**重要:**

当设定策略限制时，您应该在设定 `--min` 前设定 `--max`。

`--freq` _<freq>_ — 为 CPU 设定具体时钟速度，单位为 KHz。您只能选择一个在 CPU 策略限制范围内的速度（即 `--min` 和 `--max` 之间的数值）。

`--governor` _<gov>_ — 设定新的 CPUfreq 调控器。

**注意:**

如果您没有安装 cpupowerutils 软件包，则可在 `/sys/devices/system/cpu/`_\[cpuid\]_`/cpufreq/` 的可微调部分查看 CPUfreq 设置。通过写入这些 tunables 即可更改设置和数值。例如：要将 cpu0 的最低时钟速度设定为 360 KHz，请使用：

`echo 360000 > /sys/devices/system/cpu/cpu0/cpufreq/scaling_min_freq`

<a id="linux-hotplug-cpu-core"></a>

## Linux热插拔CPU核心

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

<a id="intel-12-13-th-gen-use-win10"></a>

## Intel 12、13代CPU在Win10、Win11系统大核调度方法

Intel 12、13代CPU部分U是大小核设计，操作系统Win11在调度使用核心时有一套基本规则，游戏等较重的任务交给大核的几率较高，偏重于后台或者较少人工干预的任务，交给小核或者说效能核的几率比较高，实际运行过程中，一般人更希望虚拟机或者编译等任务跑在大核上面.

Win0系统的实际调度表现更加一般。经过不断的探索，微软雪藏的调度策略被人发掘，就是电源方案里隐藏有一个异构CPU调度策略，

启用，并且设置优先调用大核心即性能核心、然后大核心超线程、最后小核心，Win11、Win10都可以使用，给大小核心使用者一个新的选择。至于选项显示、隐藏，电源方案复制、改名不作介绍。

### 节能模式

powercfg -s a1841308-3541-4fab-bc81-f71556f20b4a

::异构0 powercfg /SETACVALUEINDEX a1841308-3541-4fab-bc81-f71556f20b4a 54533251-82be-4824-96c1-47b60b740d00 7f2f5cfa-f10c-4823-b5e1-e93ae85f46b5 000

::大核、超线程优先 powercfg /SETACVALUEINDEX a1841308-3541-4fab-bc81-f71556f20b4a 54533251-82be-4824-96c1-47b60b740d00 93b8b6dc-0698-4d1c-9ee4-0644e900c85d 002 powercfg /SETACVALUEINDEX a1841308-3541-4fab-bc81-f71556f20b4a 54533251-82be-4824-96c1-47b60b740d00 bae08b81-2d5e-4688-ad6a-13243356654b 002

 

### 高性能模式

powercfg -s 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

::异构0 powercfg /SETACVALUEINDEX 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 54533251-82be-4824-96c1-47b60b740d00 7f2f5cfa-f10c-4823-b5e1-e93ae85f46b5 000

::大核、超线程优先 powercfg /SETACVALUEINDEX 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 54533251-82be-4824-96c1-47b60b740d00 93b8b6dc-0698-4d1c-9ee4-0644e900c85d 002 powercfg /SETACVALUEINDEX 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 54533251-82be-4824-96c1-47b60b740d00 bae08b81-2d5e-4688-ad6a-13243356654b 002

### 平衡模式

powercfg -s 381b4222-f694-41f0-9685-ff5bb260df2e ::异构0 powercfg /SETACVALUEINDEX 381b4222-f694-41f0-9685-ff5bb260df2e 54533251-82be-4824-96c1-47b60b740d00 7f2f5cfa-f10c-4823-b5e1-e93ae85f46b5 000 ::大核、超线程优先 powercfg /SETACVALUEINDEX 381b4222-f694-41f0-9685-ff5bb260df2e 54533251-82be-4824-96c1-47b60b740d00 93b8b6dc-0698-4d1c-9ee4-0644e900c85d 002 powercfg /SETACVALUEINDEX 381b4222-f694-41f0-9685-ff5bb260df2e 54533251-82be-4824-96c1-47b60b740d00 bae08b81-2d5e-4688-ad6a-13243356654b 002

<a id="debian-install-backports-kernel"></a>

## Debian安装新版本Linux内核（backports kernel）

[![](images/f608a1b1-8fb1-4c06-1e5e-c4f00d766c25.png)](https://wiki.wenyinos.com/wp-content/uploads/2024/04/f608a1b1-8fb1-4c06-1e5e-c4f00d766c25.png)Debian预置的Linux内核，版本随发行版的大版本冻结，比方Debian 9就一直是内核4.9版。想用新版本Linux内核的话，除了找第三方版本或自己编译外，官方也有提供backports软件库版本的内核，版本可能不是最新、但也是接近最新版本的Linux内核。

backports软件库从分支上说测试（testing），所以软件包的稳定性理论上比发行版软件库（stable）里的要低，所以谨慎选择！

可按下列步骤安装backports kernel（需要sudo权限）

**1、检查Debian的发行版本和内核版本**，主要是看下发行版的代号（codename），不同发行版因代号不同，步骤有些不同

检查发行版本（Debian 9的代号叫stretch，Debian 8的代号叫jessie，这影响后续的命令不同）

  `lsb_release -a`

检查内核版本

`uname -sr`

**2、把backports软件库的源加到apt源列表里**

  `echo "deb http://ftp.debian.org/debian stretch-backports main" | sudo tee -a /etc/apt/sources.list > /dev/null`

以上如果是Debian 9命令里是stretch-backports，如果是Debian 8则是jessie-backports，这就是根据发行版代号的区别

**3、更新软件包的源**

`sudo apt-get update`

**4、安装apt查询工具aptitude**

`sudo apt-get install aptitude -y`

**5、用aptitude查询软件源里有什么版本的内核**（backports内核的名称中间有bpo字样）

`aptitude search linux-image`

带cloud字样的是推荐云上的虚拟机用的，dbg字样的是带系统调试信号库的，什么都不带的是推荐物理机器用的

**6、安装backports内核**（不同发行版的Debian，根据发行版的代号不同，命令会有所不同）

根据以上aptitude的结果，选择安装内核，比方要安装linux-image-4.16.0-0.bpo.2-cloud-amd64这个内核

`sudo apt-get -t stretch-backports install linux-image-4.16.0-0.bpo.2-cloud-amd64 -y`

**7、（可选）更新其他backports源里有的软件包**

`sudo apt-get -t stretch-backports upgrade -y`

**8、（可选）清理已无依赖关系的旧版软件（包括旧版内核）、清理apt缓存**

`sudo apt autoremove -y`

   `sudo apt-get autoclean -y`

**9、重启机器**

`sudo reboot`

**10、查看Linux内核版本号，确认已用新的backports内核启动**

`uname -r`

<a id="use-zram-generator-configure"></a>

## 使用zram-generator配置zram

## 安装软件包

```bash
apt install systemd-zram-generator
```

## 配置 zram-generator

### 创建 zram-generator 配置文件

```bash
nano /etc/systemd/zram-generator.conf
```

### 填入配置

```ini
[zram0]
zram-size = min(ram / 2, 4096)
compression-algorithm = zstd
```

- zram 大小为内存的二分之一，最大 4096MiB

## 启动 zram

```bash
sudo systemctl daemon-reload
sudo systemctl start systemd-zram-setup@zram0.service
```
