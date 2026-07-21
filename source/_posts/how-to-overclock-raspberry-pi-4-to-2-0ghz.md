---
title: "将您的树莓派4超频至2.0GHz"
date: 2019-08-02
categories:
  - "硬件设备"
tags:
  - "树莓派"
  - "raspberry-pi"
---

上次，我使用了新的"霜塔CPU冷却风扇"用于 Raspberry Pi 4 之上，它可以很好地冷却主板，但很显然超过了极限。读者和评论者提到，固件升级后，可以将 Raspberry Pi 4 超频到 2.0 GHz。这对于我的新粉丝来说，这看起来将会非常完美！

我先升级了固件和操作系统：

```bash
sudo rpi-update
sudo apt dist-upgrade
```

然后，以 root 用户（sudo）编辑 `/boot/config.txt` 文件，添加以下代码，将最大频率提升到 2.0 GHz：

```ini
force_turbo=0
arm_freq=2000
over_voltage=6
```

> **不要试图设置 `force_turbo = 1`，**因为此选项会允许进一步提升电压，它会改变芯片中的保险结构，**[这将使您的保修失效](https://www.raspberrypi.org/documentation/configuration/config-txt/overclocking.md)。**

我们现在可以重新启动主板以验证设置，并检查是否应用：

```bash
vcgencmd get_config int | grep "arm\|over"
```

输出：

```
arm_freq=2000
over_voltage=6
```

好的。在 idle 状态下频率较低，但正常情况下：

```bash
vcgencmd measure_clock arm
```

输出：

```
frequency(48)=666826176
```

此时电压设置为 1.0335V：

```bash
vcgencmd measure_volts
```

输出：

```
volt=1.0335V
```

`over_voltage` 将以 0.025V 步进的递减/递增降低或增加最大电压，范围 -16 至 8，或 0.8V 至 1.4V。

运行之前的 `sbc-bench.sh`，用 rpi-monitor 监控温度：

```bash
sudo /bin/bash ./sbc-bench.sh -c
```

输出：

```
WARNING: this tool is meant to run only on Debian Stretch or Ubuntu Bionic.
When running on other distros results are partially meaningless or can't be collected.
Press [ctrl]-[c] to stop or [enter] to continue.

sbc-bench v0.6.7

Installing needed tools. This may take some time... Done.
Checking cpufreq OPP... Done.
Executing tinymembench. This will take a long time... Done.
Executing OpenSSL benchmark. This will take 3 minutes... Done.
Executing 7-zip benchmark. This will take a long time....
Done.
Checking cpufreq OPP... Done.

It seems neither throttling nor frequency capping has occured.

Memory performance:
memcpy: 2547.2 MB/s
memset: 3651.0 MB/s (0.8%)

7-zip total scores (3 consecutive runs): 6900,6877,6939

OpenSSL results:
type             16 bytes     64 bytes    256 bytes   1024 bytes   8192 bytes  16384 bytes
aes-128-cbc      83479.79k   102077.25k   110821.72k   112916.14k   113631.23k   113541.12k
aes-128-cbc      83514.12k   102155.14k   110784.17k   112935.59k   113573.89k   113382.74k
aes-192-cbc      67566.13k    86925.76k    95294.38k    97361.58k    98189.31k    98331.31k
aes-192-cbc      75028.43k    90016.62k    96037.97k    97670.83k    98301.27k    98178.39k
aes-256-cbc      68036.63k    79945.09k    84813.82k    86112.60k    86035.11k    86338.22k
aes-256-cbc      61634.20k    77697.69k    84171.18k    85799.89k    86406.49k    86474.75k

Full results uploaded to http://ix.io/1PxG. Please check the log for anomalies (e.g. swapping or throttling happenend) and otherwise share this URL.
```

从日志中查看 7-zip 测试期间的最高温度和实际频率：

```
System health while running 7-zip multi core benchmark:
 
Time        fake/real   load %cpu %sys %usr %nice %io %irq   Temp   VCore
15:11:29: 2000/2000MHz  3.17  14%   1%  12%   0%   0%   0%  48.7°C  1.0335V
15:11:52: 2000/2000MHz  3.28  85%   2%  83%   0%   0%   0%  52.1°C  1.0335V
15:12:34: 2000/2000MHz  4.43  96%  48%  47%   0%   0%   0%  53.1°C  1.0335V
15:12:54: 2000/2001MHz  4.21  83%   3%  79%   0%   0%   0%  52.6°C  1.0335V
15:13:37: 2000/2000MHz  4.96  95%  40%  54%   0%   0%   0%  52.1°C  1.0335V
15:13:57: 2000/2000MHz  4.61  82%   3%  79%   0%   0%   0%  52.6°C  1.0335V
15:14:39: 2000/2000MHz  4.92  95%  37%  57%   0%   0%   0%  52.1°C  1.0335V
```

Broadcom BCM2711 处理器，ARM Cortex-A72 2.0 GHz，目前温度高达 53.1°C，我们仍然具有良好的安全余量。

![](images/v2-6d2fc9846fdaeaa32052daf6166a7913_hd.jpg)

rpi-monitor 的图表中，在 55°C 时显示最高值，但仍与处理器的 85°C 硬件温控限制相差 30°C。

让我们看看，相比默认的 1.5 GHz 频率下运行的 Raspberry Pi 4，可以提升多少性能：

![](images/v2-f5353cf4759be1f73ea217962dbf2615_hd.jpg)

![](images/v2-fa0ceb5976002fe08e215153a43d0a37_hd.jpg)

内存基准测试性能基本相同，意味着带宽不受处理器频率的限制。

但对于其他类型基准测试，我们可以获得 27% 至 33% 的性能提升，这大概与预期的 33% 的理论性能提升相匹配。

如果出于某些原因，您希望拥有更高的内存带宽，那么您可能会遇到 `sdram_freq` 和 `over_voltage_sdram` 选项的设置，如 RPi [超频选项中所述](https://www.raspberrypi.org/documentation/configuration/config-txt/overclocking.md)。

翻译来源：[How to Overclock Raspberry Pi 4 to 2.0 GHz](https://www.cnx-software.com/2019/07/26/how-to-overclock-raspberry-pi-4/)
