---
title: "Linux 电源管理设置"
date: 2023-03-12
categories:
  - "Linux"
tags: 
  - "linux"
  - "power"
---

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
