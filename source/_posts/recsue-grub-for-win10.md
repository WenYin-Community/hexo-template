---
title: "系统｜ chroot | 修复Grub 引导 for Win10"
date: 2022-02-20
categories:
  - "Windows"
tags:
  - "windows10"
  - "windows"
  - "grub"
  - "linux"
---

最近被人安利了 `Win10 LTSC` (适用于低配电脑的 Win10)，就在我的破电脑上尝试了一下。交代一下我的条件：我的电脑上一块 1T 的硬盘，分了 18 个 MBR 分区，安装了 N 多个 Linux 系统。忘了什么时候，把第五个分区标识为引导分区，结果装 `Win10` 的时候，`Win10` 不能识别，装完之后，不能引导。

---

## 修复过程

首先尝试安装 grub：

```bash
sudo grub-install --target=i386-pc /dev/sda
```

结果出现了以下错误信息：

```
# Installing for i386-pc platform.
# grub-install: error: failed to get canonical path of `overlay'.
# 这个原因是因为我在 Linux Live 模式下
```

由于我的第一个分区不是引导分区，所以，我进入了 `Linux` 系统，利用 `gparted` 把引导标志设置为硬盘的第一个分区。具体方法就不详述了，大家进入 `gparted` 这个软件，一看便知。

然后利用 `chroot` 工具重新安装 grub：

```bash
sudo mount /dev/sda7 /mnt    # 我的硬盘上的 Linux 系统,我修复利用的就是这个系统。如果你的电脑上没有，你可以用 Linux Live。
sudo mount -o bind /dev /mnt/dev
sudo mount -o bind /sys /mnt/sys
sudo mount -o bind /dev/shm /mnt/dev/shm
sudo mount -o bind /proc /mnt/proc
sudo chroot /mnt
grub-install --target=i386-pc /dev/sda    # 我把grub安装在 /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg
```

然后，用 WinPE 工具修复了一下 Win 的引导。世界终于平静了。

---

作者：fanswm
链接：https://zhuanlan.zhihu.com/p/106129271
