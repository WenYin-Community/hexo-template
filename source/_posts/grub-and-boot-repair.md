---
title: "GRUB 与系统引导修复合集"
author: "学姐大人"
date: 2026-04-04
categories:
  - "开发工具"
tags:
  - "grub"
  - "linux"
  - "boot"
  - "uefi"
  - "windows"
---

GRUB 的配置文件是自动生成的，手改容易丢；这几篇记录的是「怎么改才对、引导坏了怎么救」——从重建配置、用 grubby 做永久更改，到 chroot 修 Win10 双系统的引导。

<!-- more -->

<a id="fedora-rebuild-grub-config"></a>

## 在 Fedora 下重建 GRUB 配置文件

在 Fedora 下，重建（更新）GRUB 配置文件的命令取决于你的系统启动模式（UEFI 或 Legacy BIOS）以及安装方式。

对于绝大多数现代 Fedora 系统（UEFI 启动），请使用以下命令：

### 1. 标准 UEFI 系统（最常见）
```bash
sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg
```

### 2. 传统 BIOS/Legacy 系统
```bash
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
```

### 3. 通用自动检测命令（推荐）
如果你不确定路径，Fedora 提供了一个脚本可以自动判断并写入正确位置：
```bash
sudo grub2-mkconfig -o $(find /boot -name "grub.cfg" | head -n 1)
```
*注意：如果找到多个 `grub.cfg`，请确保选择 `/boot/efi/EFI/fedora/grub.cfg` (UEFI) 或 `/boot/grub2/grub.cfg` (BIOS)。*

---

### 完整操作流程（针对你之前的 DG1 问题）

假设你要添加 `i915.enable_guc=0` 参数：

1.  **编辑配置文件**：
    ```bash
    sudo vi /etc/default/grub
    ```
    找到 `GRUB_CMDLINE_LINUX` 行，在引号内追加参数：
    ```text
    GRUB_CMDLINE_LINUX="... existing_params ... i915.enable_guc=0"
    ```

2.  **重建 GRUB 配置**：
    ```bash
    # 如果是 UEFI 系统（大多数情况）
    sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg
    
    # 如果是 BIOS 系统
    sudo grub2-mkconfig -o /boot/grub2/grub.cfg
    ```

3.  **验证更改**（可选）：
    检查生成的文件中是否包含新参数：
    ```bash
    grep "i915.enable_guc=0" /boot/efi/EFI/fedora/grub.cfg
    # 或
    grep "i915.enable_guc=0" /boot/grub2/grub.cfg
    ```

4.  **重启系统**：
    ```bash
    sudo reboot
    ```

### 常见问题排查
*   **权限拒绝**：务必使用 `sudo`。
*   **文件不存在**：如果 `/boot/efi/EFI/fedora/grub.cfg` 不存在，请检查 `/boot/efi/EFI/` 目录下是否有其他文件夹（如 `fedora` 可能拼写不同，或者在 `BOOT` 文件夹下）。通常 Fedora 默认路径是 `/boot/efi/EFI/fedora/grub.cfg`。
*   **BLS 启动加载器**：Fedora 默认使用 BLS (Boot Loader Specification)。直接编辑 `/etc/default/grub` 并运行 `grub2-mkconfig` 是兼容且安全的做法，它会自动生成 BLS 条目。不要手动编辑 `/boot/loader/entries/` 下的文件，因为它们会在内核更新时被覆盖。

<a id="use-grubby-to-edit-grub"></a>

## 使用 grubby 工具在 GRUB 中进行永久更改

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

<a id="grub-boot-loader-customize"></a>

## 对 GRUB 引导装载程序进行永久性更改

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

<a id="recsue-grub-for-win10"></a>

## 系统｜ chroot | 修复Grub 引导 for Win10

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
