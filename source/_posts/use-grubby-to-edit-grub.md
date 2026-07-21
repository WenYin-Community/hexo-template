---
title: "使用 grubby 工具在 GRUB 中进行永久更改"
date: 2023-11-28
categories:
  - "Linux"
tags:
  - "grub"
  - "grubby"
  - "kernel"
  - "linux"
coverImage: "Screenshot_20231128_223058.png"
---

[![](images/Screenshot_20231128_223058-640x480.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/11/Screenshot_20231128_223058.png)

## 7.1 先决条件

- 您已在您的系统上成功安装了 RHEL。
- 您有 root 权限。

## 7.2 列出默认的内核

通过列出默认内核，您可以找到默认内核的文件名和索引号，以对 GRUB 引导装载程序进行永久更改。

**流程**

- 要找到默认内核的文件名，请输入：

```bash
grubby --default-kernel
```

- 要找到默认内核的索引号，请输入：

```bash
grubby --default-index
```

## 7.3 查看内核的 GRUB 菜单条目

您可以列出所有内核菜单条目，或者查看特定内核的 GRUB 菜单条目。

**流程**

- 要列出所有内核菜单条目，请输入：

```bash
grubby --info=ALL
```

- 要查看特定内核的 GRUB 菜单条目，请输入：

```bash
grubby --info /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

> 注意：尝试 tab 补全来查看 `/boot` 目录中的可用内核。

## 7.4 编辑内核参数

您可以更改现有内核参数中的值。例如，您可以更改虚拟控制台（屏幕）字体和大小。

**流程**

- 将虚拟控制台字体更改为 `latarcyrheb-sun`，大小为 `32`：

```bash
grubby --args=vconsole.font=latarcyrheb-sun32 --update-kernel /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

## 7.5 在 GRUB 菜单条目中添加和删除参数

您可以从 GRUB 菜单添加、删除或同时添加或删除参数。

**流程**

- 要向 GRUB 菜单条目中添加参数，请使用 `--update-kernel` 选项和 `--args`。例如，以下命令添加了一个串行控制台：

```bash
grubby --args=console=ttyS0,115200 --update-kernel /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

控制台参数附加到行尾，新控制台将优先于任何其他配置的控制台。

- 要从 GRUB 菜单条目中删除参数，请使用 `--update-kernel` 选项和 `--remove-args`。例如：

```bash
grby --remove-args="rhgb quiet" --update-kernel /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

这个命令会删除红帽图形引导参数，并启用日志消息，这是详细模式。

- 要同时添加和删除参数，请输入：

```bash
grubby --remove-args="rhgb quiet" --args=console=ttyS0,115200 --update-kernel /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

**验证步骤**

- 要查看您所做的永久更改，请输入：

```bash
grubby --info /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

## 7.6 添加一个新的引导条目

您可以向引导装载程序菜单条目中添加一个新的引导条目。

**流程**

1. 将来自默认内核的所有内核参数复制到这个新的内核条目：

```bash
grubby --add-kernel=new_kernel --title="entry_title" --initrd="new_initrd" --copy-default
```

2. 获取可用的引导条目的列表：

```bash
ls -l /boot/loader/entries/*
```

3. 创建一个新的引导条目。例如，对于 `4.18.0-193.el8.x86_64` 内核：

```bash
grubby --grub2 --add-kernel=/boot/vmlinuz-4.18.0-193.el8.x86_64 --title="Red Hat Enterprise 8 Test" --initrd=/boot/initramfs-4.18.0-193.el8.x86_64.img --copy-default
```

**验证**

- 验证新添加的引导条目是否已列在可用的引导条目中：

```bash
ls -l /boot/loader/entries/*
```

## 7.7 使用 grubby 更改默认引导条目

使用 `grubby` 工具，您可以更改默认引导条目。

**流程**

- 要在指定为默认内核的内核中进行持久更改，请输入：

```bash
grubby --set-default /boot/vmlinuz-4.18.0-372.9.1.el8.x86_64
```

## 7.8 使用同样的参数更新所有内核菜单

您可以向所有内核菜单条目中添加相同的内核引导参数。

**流程**

- 要向所有内核菜单条目中添加相同的内核引导参数，请附加 `--update-kernel=ALL` 参数。例如，这个命令向所有内核添加一个串行控制台：

```bash
grubby --update-kernel=ALL --args=console=ttyS0,115200
```

> 注意：`--update-kernel` 参数还接受 `DEFAULT` 或以逗号分隔的内核索引号列表。

## 7.9 为当前和将来的内核更改默认内核选项

通过使用 `kernelopts` 变量，您可以更改当前和将来的内核的默认内核选项。

**流程**

1. 列出 `kernelopts` 变量中的内核参数：

```bash
grub2-editenv - list | grep kernelopts
```

2. 对内核命令行参数进行更改。您可以添加、删除或修改参数。例如，要添加 `debug` 参数，请输入：

```bash
grub2-editenv - set "$(grub2-editenv - list | grep kernelopts) debug"
```

3. **（可选）**：验证新添加的参数是否已添加到 `kernelopts` 中：

```bash
grub2-editenv - list | grep kernelopts
```

4. 重启系统以使更改生效。

另外，您可以使用 `grubby` 命令将参数传递给当前和将来的内核：

```bash
grubby --update-kernel ALL --args="<PARAMETER>"
```

来源：[Red Hat Enterprise Linux 8 - Managing Monitoring and Updating the Kernel](https://access.redhat.com/documentation/zh-cn/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/assembly_making-persistent-changes-to-the-grub-boot-loader_managing-monitoring-and-updating-the-kernel)
