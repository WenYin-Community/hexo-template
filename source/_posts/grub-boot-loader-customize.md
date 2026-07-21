---
title: "对 GRUB 引导装载程序进行永久性更改"
date: 2023-04-12
categories:
  - "Linux"
tags:
  - "grub"
  - "linux"
---

## 使用 grubby 工具在 GRUB 中进行永久更改。

### 先决条件

- 您已在您的系统上成功安装了 RHEL。
- 您有 root 权限。

### 列出默认的内核

通过列出默认内核，您可以找到默认内核的文件名和索引号，以对 GRUB 引导装载程序进行永久更改。要找到默认内核的文件名，请输入：

```bash
grubby --default-kernel
/boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

要找到默认内核的索引号，请输入：

```bash
grubby --default-index
0
```

### 查看内核的 GRUB 菜单条目

您可以列出所有内核菜单条目，或者查看特定内核的 GRUB 菜单条目。

要列出所有内核菜单条目，请输入：

```bash
grubby --info=ALL
```

要查看特定内核的 GRUB 菜单条目，请输入：

```bash
grubby --info /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

### 注意:

尝试 tab 补全来查看 `/boot` 目录中的可用内核。

## 编辑内核参数

您可以更改现有内核参数中的值。例如，您可以更改虚拟控制台（屏幕）字体和大小。

将虚拟控制台字体更改为 `latarcyrheb-sun`，大小为 `32`：

```bash
grubby --args=vconsole.font=latarcyrheb-sun32 --update-kernel /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

## 在 GRUB 菜单条目中添加和删除参数

您可以从 GRUB 菜单添加、删除或同时添加或删除参数。

要向 GRUB 菜单条目中添加参数，请使用 `--update-kernel` 选项和 `--args`。例如，以下命令添加了一个串行控制台：

```bash
grubby --args=console=ttyS0,115200 --update-kernel /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

控制台参数附加到行尾，新控制台将优先于任何其他配置的控制台。

要从 GRUB 菜单条目中删除参数，请使用 `--update-kernel` 选项和 `--remove-args`。例如：

```bash
grubby --remove-args="rhgb quiet" --update-kernel /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

这个命令会删除图形引导参数，并启用日志消息，这是详细模式。

要同时添加和删除参数，请输入：

```bash
grubby --remove-args="rhgb quiet" --args=console=ttyS0,115200 --update-kernel /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

### 验证步骤

要查看您所做的永久更改，请输入：

```bash
grubby --info /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

## 添加一个新的引导条目

您可以向引导装载程序菜单条目中添加一个新的引导条目。

将来自默认内核的所有内核参数复制到这个新的内核条目：

```bash
grubby --add-kernel=new_kernel --title="entry_title" --initrd="new_initrd" --copy-default
```

获取可用的引导条目的列表：

```bash
ls -l /boot/loader/entries/*
```

创建一个新的引导条目。例如，对于 `4.18.0-193.el8.x86_64` 内核：

```bash
grubby --grub2 --add-kernel=/boot/vmlinuz-4.18.0-193.el8.x86_64 --title="Red Hat Enterprise 8 Test" --initrd=/boot/initramfs-4.18.0-193.el8.x86_64.img --copy-default
```

验证新添加的引导条目是否已列在可用的引导条目中：

```bash
ls -l /boot/loader/entries/*
```
# grubby --info /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64

index=0
kernel="/boot/vmlinuz-4.18.0-372.9.1.el8.x86_64"
args="ro crashkernel=auto resume=/dev/mapper/rhel-swap rd.lvm.lv=rhel/root rd.lvm.lv=rhel/swap $tuned_params zswap.enabled=1 console=ttyS0,115200"
root="/dev/mapper/rhel-root"
initrd="/boot/initramfs-4.18.0-372.9.1.el8.x86_64.img $tuned_initrd"
title="Red Hat Enterprise Linux (4.18.0-372.9.1.el8.x86_64) 8.6 (Ootpa)"
id="67db13ba8cdb420794ef3ee0a8313205-4.18.0-372.9.1.el8.x86_64"
```

## 添加一个新的引导条目

您可以向引导装载程序菜单条目中添加一个新的引导条目。

将来自默认内核的所有内核参数复制到这个新的内核条目。

```
# grubby --add-kernel=new_kernel --title="entry_title" --initrd="new_initrd" --copy-default
```

获取可用的引导条目的列表。

```
# ls -l /boot/loader/entries/*

-rw-r--r--. 1 root root 408 May 27 06:18 /boot/loader/entries/67db13ba8cdb420794ef3ee0a8313205-0-rescue.conf
-rw-r--r--. 1 root root 536 Jun 30 07:53 /boot/loader/entries/67db13ba8cdb420794ef3ee0a8313205-4.18.0-372.9.1.el8.x86_64.conf
-rw-r--r-- 1 root root 336 Aug 15 15:12 /boot/loader/entries/d88fa2c7ff574ae782ec8c4288de4e85-4.18.0-193.el8.x86_64.conf
```

创建一个新的引导条目。例如，对于 _4.18.0-193.el8.x86\_64_ 内核，请按如下所示运行命令：

```
# grubby --grub2 --add-kernel=/boot/vmlinuz-4.18.0-193.el8.x86_64 --title="Red Hat Enterprise 8 Test" --initrd=/boot/initramfs-4.18.0-193.el8.x86_64.img --copy-default
```

验证新添加的引导条目是否已列在可用的引导条目中。

```
# ls -l /boot/loader/entries/*

-rw-r--r--. 1 root root 408 May 27 06:18 /boot/loader/entries/67db13ba8cdb420794ef3ee0a8313205-0-rescue.conf
-rw-r--r--. 1 root root 536 Jun 30 07:53 /boot/loader/entries/67db13ba8cdb420794ef3ee0a8313205-4.18.0-372.9.1.el8.x86_64.conf
-rw-r--r-- 1 root root 287 Aug 16 15:17 /boot/loader/entries/d88fa2c7ff574ae782ec8c4288de4e85-4.18.0-193.el8.x86_64.0~custom.conf
-rw-r--r-- 1 root root 287 Aug 16 15:29 /boot/loader/entries/d88fa2c7ff574ae782ec8c4288de4e85-4.18.0-193.el8.x86_64.conf

```

## 使用 grubby 更改默认引导条目

使用 `grubby` 工具，您可以更改默认引导条目。

要在指定为默认内核的内核中进行持久更改，请输入：

```bash
grubby --set-default /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

## 使用同样的参数更新所有内核菜单

您可以向所有内核菜单条目中添加相同的内核引导参数。

要向所有内核菜单条目中添加相同的内核引导参数，请附加 `--update-kernel=ALL` 参数。例如，这个命令向所有内核添加一个串行控制台：

```bash
grubby --update-kernel=ALL --args=console=ttyS0,115200
```

注意：`--update-kernel` 参数还接受 `DEFAULT` 或以逗号分隔的内核索引号列表。

## 其它资源

`/usr/share/doc/grub2-common` 目录。

`info grub2` 命令。

来源：[https://access.redhat.com/documentation/zh-cn/red\_hat\_enterprise\_linux/8/html-single/managing\_monitoring\_and\_updating\_the\_kernel/index#proc\_changing-the-default-boot-entry\_assembly\_making-persistent-changes-to-the-grub-boot-loader](https://access.redhat.com/documentation/zh-cn/red_hat_enterprise_linux/8/html-single/managing_monitoring_and_updating_the_kernel/index#proc_changing-the-default-boot-entry_assembly_making-persistent-changes-to-the-grub-boot-loader)
