---
title: "在斐讯N1盒子上刷入armbian Linux系统"
date: 2018-06-24
categories:
  - "硬件设备"
tags:
  - "n1"
  - "linux"
coverImage: "haha.png"
---

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
