---
title: "树莓派、开发板与路由器合集"
author: "学姐大人"
date: 2025-11-18
categories:
  - "开发工具"
tags:
  - "raspberry-pi"
  - "arm"
  - "router"
  - "linux"
---

ARM 小机器的折腾记录：树莓派超频与换系统、RK3588 固件、斐讯盒子和路由器固件。

<!-- more -->

<a id="how-to-overclock-raspberry-pi-4-to-2-0ghz"></a>

## 将您的树莓派4超频至2.0GHz

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

<a id="scripts-for-arch-linux-arm-for-raspberry-pi-3"></a>

## 简易安装Arch Linux ARM for Raspberry Pi 3

把下列代码保存为：rpi3-arch-linux-to-sdcard.sh

```
#!/bin/bash

# <https://archlinuxarm.org/platforms/armv8/broadcom/raspberry-pi-3>

echo -e "\n\nArch Linux ARM to SD Card"
echo -e "For the Raspberry Pi 3, if you want to use the unofficial arm64 variant."
echo -e "(Otherwise use the Raspberry Pi 2 version of this script!)\n\n"

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

echo -e "\nAll drives on this computer:\n"
ls -1 /dev/sd?

echo -e "\nLast messages in syslog:\n"
dmesg | tail

echo -e "\nChoose sd card (like /dev/sdX):\n"
read SDCARD

echo -e "\n\nCurrent partitioning of $SDCARD:\n"
parted $SDCARD print

echo -e "\n\nYou chose $SDCARD\nAre you sure to continue? Press Ctrl-C to abort!"
read

cd /tmp

echo -e "\nDownloading the Arch Linux ARM root filesystem (if needed):\n"
URL=https://mirrors.ustc.edu.cn/archlinuxarm/os/ArchLinuxARM-rpi-3-latest.tar.gz
# Sometimes the download server is slow. In that case, try a different one instead:
#URL=http://de7.mirror.archlinuxarm.org/os/ArchLinuxARM-rpi-3-latest.tar.gz
FNAME=$(basename "$URL")
FSIZE=$(curl --head --location --silent "$URL" --write-out '%{http_code} %{size_download} \n' | tac | grep -m1 Content-Length | cut -f 2 -d' ' | tr -d '\r')
if [ -n "$FNAME" ]
then
  CURSIZE=$(wc -c <"$FNAME")
  if [ $CURSIZE -ne $FSIZE ]; then
    rm "$FNAME"
    echo "Removing any downloaded and leftover Arch Linux ARM image"
  fi
fi
curl --location --remote-name --time-cond "$FNAME" "$URL"
if [ $? -ne 0 ]; then
  echo "Could not download the image file, please check the mirror"
  exit 1
fi

echo -e "\nUnmounting partitions found on ${SDCARD}\n"
for MOUNT in ${SDCARD}?
do
  echo $MOUNT
  umount $MOUNT
done

parted -s $SDCARD unit s print
parted -s $SDCARD mktable msdos
parted -s $SDCARD mkpart primary fat32 8192s 128MiB
parted -s $SDCARD mkpart primary 128MiB 100%
parted -s $SDCARD unit s print

mkfs.vfat ${SDCARD}1
mkfs.ext4 ${SDCARD}2

rm -rf boot
rm -rf root

mkdir boot
mkdir root

mount ${SDCARD}1 boot
mount ${SDCARD}2 root

echo -e "\nExtracting the root filesystem\n"
bsdtar -xpf ArchLinuxARM-rpi-3-latest.tar.gz -C root
sync

echo -e "\nMoving boot files to the first partition\n"
mv root/boot/* boot

echo -e "\nUnmounting the two partitions\n"
umount boot root

rmdir boot root

echo "Insert the SD card into the Raspberry Pi , connect ethernet, and apply 5V power."
echo "Use the serial console or SSH to the IP address given to the board by your router. The username/password combination is alarm/alarm. The default root password is 'root'."

cd -
```

如果网络较慢请先下载

```
http://archlinuxarm.org/os/ArchLinuxARM-rpi-3-latest.tar.gz
```

放置到/tmp下面，按提示运行即可。

来源：[https://gist.github.com/pklaus/0e90aaa2d91064edd731fa30f44fce3f](https://gist.github.com/pklaus/0e90aaa2d91064edd731fa30f44fce3f)

<a id="run-opensuse-on-rpi3"></a>

## 在树莓派 3 上运行 openSUSE：简单几步搭建一个实用系统

本文由 SUSE 文档团队的技术作者 Dmitri Popov 撰写。

> 在[树莓派 3](https://www.raspberrypi.org/) 上部署 [openSUSE](https://www.opensuse.org/) 系统不是很复杂，不过这儿有一些小技巧教你更好地完成这个过程。

首先，你将会有一些版本可供选择。如果你打算使用树莓派 3 作为一个普通主机，那么带有图形界面的 openSUSE 将是你最好的选择。有几种不同的图形环境可供选择：[X11](https://www.x.org/wiki/)、[Enlightenment](https://www.enlightenment.org/)、[Xfce](https://www.xfce.org/) 或是 [LXQT](http://lxqt.org/)。openSUSE 还有一个 JeOS 版本能够提供最基础的系统，可以把树莓派 3 作为一个无显示器的服务器使用。更好的选择还有 openSUSE 的 [Leap](https://www.opensuse.org/#Leap) 或 [Tumbleweed](https://www.opensuse.org/#Tumbleweed) 版本。

首先你需要从 [https://en.opensuse.org/HCL:Raspberry_Pi3](https://en.opensuse.org/HCL:Raspberry_Pi3) 下载所需的 openSUSE 镜像，然后制作一张可启动的 microSD 卡。虽然可以使用命令行工具将下载好的镜像写入 microSD 卡，但 [Etcher](https://etcher.io/) 可以使这个过程更轻松安全。

1. 从项目网站上获取 Etcher 程序，解压下载的 .zip 文件，并使用以下命令把得到的 .AppImage 文件设置为可执行：

```bash
chmod +x Etcher-x.x.x-linux-x64.AppImage
```

2. 将 microSD 卡插入电脑，双击运行 Etcher 软件，选择下载好的 .raw.xz 镜像文件，点击 **Flash!** 按钮。

然后将显示器和键盘连接到树莓派 3，插入 microSD 卡，启动树莓派。第一次启动时，openSUSE 会自动扩展文件系统以充分利用 microSD 卡上的剩余空间。这时你将看到以下信息：

```
GPT data structures destroyed! You may now partition the disk using fdisk or other utilities
GPT 数据结构被破坏！您需要使用 fdisk 或其它工具对磁盘分区。
```

不用担心，稍等两分钟，openSUSE 将继续正常启动。当看到提示时，输入默认用户名 `root` 和默认密码 `linux` 登录系统。

如果你选择在树莓派 3 上部署 JeOS 版本，第一次启动时你不会看到屏幕上有任何输出。屏幕会一直保持空白，直到系统完成对文件系统的扩展。你可以通过配置内核参数来显示输出，不过没有必要做这麻烦事。只需稍等片刻，你就能看到命令行提示。

由于 openSUSE 已经启用并且配置了 SSH 服务，所以启动树莓派时你可以不用显示器。这样的话，你就需要使用网卡接口将树莓派连接到网络中。给树莓派足够的时间来启动和扩展系统后，你就能够从同一网络中的其他主机，使用 `ssh root@linux.local` 命令，通过 SSH 服务连接树莓派。

默认情况下你将以 `root` 用户登录系统，所以创建一个普通用户是个不错的主意。你可以使用 YaST 配置工具轻松完成这件事。运行 `yast2` 命令，选择 **安全与用户** -> **用户与用户组管理** 选项，就可以创建新用户了。你还可以选择 **系统** -> **在线升级** 选项来更新系统。完成之后，退出 YaST，重启树莓派，然后使用新创建的用户登录系统。

一切搞定，不过还有一个重要的系统组件不能正常工作，那就是无线接口。当然，这个问题也可以轻松解决。首先使用以下命令安装 nano 文本编辑器：

```bash
sudo zypper in nano
```

然后运行以下命令修改 `raspberrypi_modules.conf` 文件：

```bash
sudo nano /etc/dracut.conf.d/raspberrypi_modules.conf
```

删除文件第一行的 `sdhci_iproc`，再取消最后一行的注释。运行以下命令保存修改：

```bash
mkinitrd -f
```

最后，重启树莓派。

再次运行 YaST，在 **系统** -> **网络设置** 区域，你应该能在网络接口列表中看到 `BCM43430 WLAN Card` 项。选择这一项，点击 **编辑** 按钮。开启 **动态地址分配 DHCP** 选项，点击 **下一步**，选择你想要连接的无线网络，配置所需的连接设置。点击 **下一步** 和 **确定** 保存设置。重启树莓派，它应该就能连接上特定的 Wi-Fi 网络了。

至此，你就完成了树莓派上的系统部署。

---

via: [openSUSE on Raspberry Pi 3: Zero Functional System in Easy Steps](https://www.suse.com/communities/blog/opensuse-raspberry-pi-3-zero-functional-system-easy-steps/)

作者：[chabowski](https://www.suse.com/communities/blog/author/chabowski/) 译者：[Cathon](https://github.com/Cathon) 校对：[jasminepeng](https://github.com/jasminepeng)

<a id="raspberry-pi-run-archisteamfarm"></a>

## 使用Raspberry Pi等ARM迷你开发板运行ArchiSteamFarm挂卡程序

首先启动树莓派或别的开发板，确定 CPU 架构，一般有 ARM32 和 ARM64 两种，因为运行的系统版本不同，下载的 dotnet 包有差别。先运行下列命令安装依赖包：

```bash
sudo apt-get install curl libunwind8 gettext screen
```
sudo apt-get install curl libunwind8 gettext screen
```

![](images/TIM图片20180505201923.png)

然后运行 `lscpu` 或 `neofetch` 等命令确定当前使用的是什么系统版本。本人一个树莓派，一个香橙派，一个64位一个32位（注意树莓派官方系统是32位）。aarch64 为64位，armv7l 则为32位。

![](images/TIM图片20180505201723.png) ![](images/TIM图片20180505201800.png)

确定下系统时间是否准确方可进行下一步操作，因为 ARM 设备通常无时钟，断电情况下不会保持时间，使用：

```bash
sudo date -s "2023-01-01 12:00:00"
```

设置当前时间。

---

下载 dotnet 环境：

32 位系统（大多数开发板）运行：

```bash
curl -sSL -o dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Runtime/release/2.0.0/dotnet-runtime-latest-linux-arm.tar.gz
```

64 位系统运行：

```bash
curl -sSL -o dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Runtime/release/2.0.0/dotnet-runtime-latest-linux-arm64.tar.gz
```

创建目标文件夹并将下载的包解压到其中：

```bash
sudo mkdir -p /opt/dotnet && sudo tar zxf dotnet.tar.gz -C /opt/dotnet
```

设置符号链接：

```bash
sudo ln -s /opt/dotnet/dotnet /usr/local/bin
```

输入以下命令测试安装：

```bash
dotnet --help
```
curl -sSL -o dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Runtime/release/2.0.0/dotnet-runtime-latest-linux-arm.tar.gz
```

64位系统运行：

```
curl -sSL -o dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Runtime/release/2.0.0/dotnet-runtime-latest-linux-arm64.tar.gz
```

Run ：

```
sudo mkdir -p /opt/dotnet && sudo tar zxf dotnet.tar.gz -C /opt/dotnet
```

to create a destination folder and extract the downloaded package into it.

Run：

```
sudo ln -s /opt/dotnet/dotnet /usr/local/bin
```

to set up a symbolic link...a shortcut to you Windows folks ? to the **dotnet** executable.

Test the installation by typing

```
dotnet --help
```

出现下面的内容则提示安装成功：

![](images/TIM图片20180505203020.png)

然后按照常规步骤配置 ArchiSteamFarm 并运行即可，如图所示：

![](images/TIM图片20180505203225.png)

<a id="rk3588-update-uefi-edk2"></a>

## RK3588设备更新UEFI edk2固件

```bash
sudo dd if=rock-5b_UEFI_Release_v1.1.img of=/dev/mtdblock0 conv=notrunc
sync
reboot
```

<a id="phicomm-n1-install-armbian-linux"></a>

## 在斐讯N1盒子上刷入armbian Linux系统

在 N1 内置 eMMC 中刷入 Linux armbian，不需要外置 USB 设备启动，除了没有 GPIO 外和各种 Pi 功能完全一样，内置千兆以太网/2.4+5G WiFi/Bluetooth/USB2.0\*2/HDMI，硬件配置为 Amlogic S905D 1.5GHz\*4 Cortex-A53+2GB RAM+8GB eMMC（Linux 可用 5GB）。

在二手平台收购全新已激活的 N1 仅需 80-90 元，未激活的 900 多元，三个月返现 1099（此处注意风险）可以说是很超值了。

## 一、拿到盒子，首先降级 Bootloader，刷入第三方固件

参考资料：[N1盒子 2018-5-28 斐讯天天链N1 官改v2.0线刷包, 补丁patch1](http://www.right.com.cn/forum/thread-322736-1-1.html)

## 二、制作 Linux 启动盘

按照说明，制作好 Linux 启动盘，插入 N1 正常启动，并配置好用户名密码，网络连接等。请使用 8G 以上，质量可靠的 U 盘。

参考资料：[N1盒子 应广大人民群众要求,搞个N1通过U盘跑LINUX(armbian)的教程](http://www.right.com.cn/forum/thread-322991-1-1.html)

> 6. 打开 n1 的 adb
> 7. 通过 adb 连接 n1 (`adb connect ip`)
> 8. 输入 `adb shell reboot update`
> 9. 喝口茶等待启动

注：原文中以上操作可改为在 N1 盒子内部的终端模拟器输入 `su` 回车然后 `reboot update`

## 三、将系统写入 eMMC

将配置好的 U 盘中的 armbian 系统写入到内置 eMMC，并修改引导，直接从内置 eMMC 启动，不再需要插入 U 盘。

参考资料：[N1盒子 成功！把Armbian 安装到 emmc并直接从 emmc 启动](http://www.right.com.cn/forum/thread-327496-1-1.html)

安装步骤为：

1. 下载原文中附件 install.gz 脚本，上传释放到 N1 的 /root 目录下，名称为 install.sh，并赋予执行权限；

2. 以 root 用户执行（第二行操作时间较长请耐心等待执行完成）：

```bash
cat /proc/cmdline
nand-sata-install
# 取消U盘上第二分区的 ROOTFS 标签，并给 emmc 上的 data 分区打上 ROOTFS 的标签
e2label /dev/sda2 ""
e2label /dev/data "ROOTFS"
```

3. 关机并拔下 U 盘，重新上电，正常情况下可启动到 Linux。

> **原理说明：**
> 基本原理：uboot 命令中支持读取 ext4 文件系统，所以：
> 1. 在把 root 系统安装到 eMMC
> 2. 设置 uboot 里面的环境变量，让系统先尝试从 U 盘启动，如果没有 U 盘的话，再尝试 eMMC 的 data 分区上的 armbian 相关文件
> 3. 如果都没有，再尝试启动盒子上的 android 系统。
>
> **风险：**不会破坏系统上原先的 android 系统，但是安装了 armbian 系统之后，没有一定的 linux 基础知识，你可以回不去 android 系统。
>
> 基于某些测试，ext4load 命令偶尔会读取不了文件，所以想尝试的同学，需要一个大心脏，有一定的机率失败。
>
> 系统是直接启动到 armbian 了，想回到 android 怎么办？android 和 armbian 可以自由切换。很简单，启动到 armbian 系统后，只需要把 /boot/s905_autoscript 改个名字，重新启动就会跑到 android 系统去了。如果想回到 armbian 系统，只需要在 android 系统里面，把 /data/boot/ 下面 s905_autoscript 名字改回来就行了。

![](images/TIM图片20180624230645.png)![](images/TIM图片20180624230657.png)

内置 eMMC 读取速度，比采用 SD 卡做根文件系统的 Pi 不知高到哪里去了。

![](images/TIM图片20180625104922.png)

---

## 补充：N1刷入Linux后可以删除掉的原分区及内容

以下操作会完全破坏掉 Android 系统，只能用 Linux，不过随时可以线刷回来，不要动 eMMC 的分区结构：

1. /dev/data 里面的内容：先 cd 到 / 下，删除以下目录中内容，占用空间比较多。

![](images/TIM图片20180625142012.png)

2. 格式化掉 android 的 system 分区，记得先挂载上看看内容对不对再 mkfs，为了安全起见：

![](images/TIM图片20180625142112.png)

```bash
sudo mkfs.ext4 /dev/system
```

然后把 /dev/system 随便挂载到什么地方就可以用了。

不知道哪些分区还能干掉，目前不敢动别的，希望各位补充。

最终容量如图所示：

![](images/TIM图片20180625142900.png)

![](images/haha.png)

<a id="phicomm-k2t-openwrt"></a>

## 斐讯K2t免拆机刷入LEDE/OpenWRT的步骤

首先感谢[@phitools](http://www.right.com.cn/forum/home.php?mod=space&uid=389408) 制作的telnet工具和[@ptpt52](http://www.right.com.cn/forum/home.php?mod=space&uid=372524) 制作的LEDE固件。

之前忘了提一步，有人说要先刷官改打开ssh以后才能刷，不然会砖! [http://www.right.com.cn/forum/forum.php?mod=viewthread&tid=321512](http://www.right.com.cn/forum/forum.php?mod=viewthread&tid=321512) 第一步是要先打开Telnet，进入终端操作，参考[http://www.right.com.cn/forum/forum.php?mod=viewthread&tid=321483](http://www.right.com.cn/forum/%E4%BC%A0%E9%80%81%E9%97%A8)即可（已刷官改的跳过）打开Telnet后，要使用ssh工具登录，用户名root，密码admin，需要sftp上传文件。 ssh工具推荐使用[MobaXterm](https://mobaxterm.mobatek.net/)，可以在左侧窗格直接拖放文件，右侧窗口输入命令：

OpenWRT/LEDE下载地址：

#### 本帖隐藏的内容

https://router-sh.ptpt52.com/rom/ 寻找Phicomm K2T A1/A2/A3 board (16MB flash)这个东西点击下载。

固件由@ptpt52 出品，代号：NATCAP

固件无线默认名称：NATCAP\_XXXX，密码：88888888 固件管理界面：[http://192.168.15.1/](http://192.168.15.1/) 管理界面账户/密码：root/admin

把下载的固件natcap-3.0.0-build201805181759-ar71xx-generic-k2t-16M-squashfs-sysupgrade.bin重命名为lede.bin

传送到路由器 `/tmp` 目录下，运行刷入：

```bash
mtd -r write /tmp/lede.bin firmware
```

在出现rebooting...之前切勿断电，等待刷机完成自动重启即可，正常情况下可以登录配置。

注意某些情况下有一定概率初次刷机出现找不到5G信号的情况，拔电重启一下就可以了。

<a id="router-asus-merlin-reset-method"></a>

## 路由器梅林固件软件中心重置方法

**路由器梅林固件软件中心重置方法** 2021年6月4日 悟空

**文章目录** 1) 1. 软件中心重置方法

    1.1) 1.1 界面重置：

    1.2) 1.2 命令重置： 1.3) 1.3 一键重置： 2) 2. 释放jffs空间 3) 3. 重启软件中心

 

最近刷了华硕固件，但是软件中心页面出了点问题，

似乎是/jffs/db目录下的数据库损毁导致skipd服务启动不了了，

解决方法就是重置软件中心数据库，下面是找到的资料，留下来保存一下。

**1\. 软件中心重置方法**

软件中心出现问题需要重置软件中心的，可以解决大部分问题；

由于jffs坏块或者硬件问题导致的软件中心问题，重置是不管用的，建议及时换机。

**1.1 界面重置：**

在【系统管理 】–【 系统设置】内勾选：

Format JFFS partition at next boot 和 Enable JFFS custom scripts and configs

然后点击应用本页面设置，成功应用后重启路由器即可，

此操作可以清除jffs分区中的所有数据，包括安装在jffs分区的软件中心和所有插件。

重启路由后，软件中心会自动重新完成初始安装，然后将路由器连上网络，

进入软件中心将软件中心更新到最新即完成软件中心重置。

软件中心一直显示更新中怎么办？ 可以尝试通过运行命令service restart\_skipd来重启skipd服务。

如果运行重启skipd的命令后，再次运行ps|grep skipd|grep -v grep仍然没有输出，

说明储存在jffs分区的skipd数据库可能遭到了损坏，

此时可以请参考 软件中心重置方法 （见下文：重要命令部分）

**1.2 命令重置：**

需要开启固件的ssh功能（【系统管理 】-【 系统设置】-【启用 SSH】），

然后使用ssh客户端（Putty、Xshell、SecureCRT等软件均可）登录进路由器，

依次输入以下命令，即可重置软件中心。

\# 1. 关闭软件中心相关进程，删除软件中心文件 kill -9 $(pidof skipd) cd /koolshare/perp && sh perp.sh stop cd / && rm -rf /jffs/.asusrouter /jffs/.koolshare /jffs/db #2. 重置软件中心 jffsinit.sh cd /koolshare/perp && sh perp.sh start service restart\_skipd \# 3. 重启路由器（可选） reboot \# 4.浏览器进入软件中心，将软件中心版本更新到最新，安装插件... **1.3 一键重置：**

如果你刷的梅林固件是384.10\_0及其以上版本，

直接在ssh客户端内运行koolshare-reset命令即可，

其效果等同上面手动输入命令。

**2\. 释放jffs空间**

注意，此操作会删除jffs分区内的所有文件，

包括但不限于：软件中心本身、软件中心所有的插件、

安装的证书、TrafficAnalyzer的数据库、自定义的设备图标等

kill -9 $(pidof skipd) rm -rf /jffs/.asusrouter /jffs/.koolshare /jffs/.cert /jffs/.sys /jffs/.wtfast /jffs/\* reboot

**3\. 重启软件中心**

当httpd进程挂掉的时候（FAQ中第3个问题），此时可以用ssh进入路由器后台，输入以下命令重启

cd /koolshare/perp sh perp.sh stop sh perp.sh start

> 转载本文时请注明出处及本文链接地址[路由器梅林固件软件中心重置方法](https://www.learnhard.cn/articles/797.html)

>  **1，解决Merlin 380 老固件软件中心显示 0.0**

很多用户反馈，重新刷固件，或者重置系统之后，软件中心显示 0.0，并且无法显示任何插件，解决方法: 打开路由器的 ssh（如何打开 ssh 终端请自己参考下相关方法） 复制下面的脚本，修复服务器地址 sed -i 's/koolshare.ngrok.wang/ks.ddnsto.com/g' /koolshare/scripts/ks\_app\_install.sh sed -i 's/koolshare.ngrok.wang/ks.ddnsto.com/g' /koolshare/webs/Main\_Soft\_center.asp **2，Koolshare软件中心1.5.8增加了对安装包名称的检测，屏蔽了科学插件，无法离线安装。** 如果提示检测到离线安装包名有非法关键词，开启路由器的SSH功能， 登录并输入以下命令后，再进行离线安装。 sed -i 's/\\tdetect\_package/\\t# detect\_package/g' /koolshare/scripts/ks\_tar\_install.sh

[![](images/QQ图片20231126144627-640x480.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/11/QQ图片20231126144627.png)
