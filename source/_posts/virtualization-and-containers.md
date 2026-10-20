---
title: "虚拟化与容器合集"
author: "学姐大人"
date: 2023-05-17
categories:
  - "开发工具"
tags:
  - "virtualization"
  - "kvm"
  - "docker"
  - "podman"
  - "linux"
---

QEMU/KVM、Podman 环境里装 Docker、嵌套虚拟化，以及老式虚拟机的安装记录。

<!-- more -->

<a id="linux-qemu-kvm-virt-manager"></a>

## Linux install qemu-kvm and virt-manager

1、更新软件源

```
sudo apt-get update
```

2、安装 virt-manager和依赖：

`sudo apt-get install virt-manager qemu-system libvirt-bin qemu-kvm libvirt-dev`

`sudo dnf group install virtualization`

3.启动下列服务（Fedora）：

```
virtinterfaced.socket
virtnetworkd.socket
virtnodedevd.socket
virtnwfilterd.socket
virtproxyd.socket
virtqemud.service
virtsecretd.socket
virtstoraged.socket
```

4.添加用户组：

`sudo usermod -a -G libvirt ${USER}`

<a id="install-docker-on-support-podman-only"></a>

## 在仅支持Podman的系统（如RHEL/Rocky）中安装Docker

Docker 是一个应用程序，它使在容器中运行应用程序进程变得简单和容易，这就像虚拟机一样，只是更便携，更资源友好，更依赖于主机操作系统。有关 Docker 容器的不同组件的详细介绍，请查看 [Docker 生态系统：通用组件介绍](https://www.digitalocean.com/community/tutorials/the-docker-ecosystem-an-introduction-to-common-components)。

在本教程中，您将学习如何在现有的 Rocky Linux 9 安装上安装和使用它。

Rocky Linux 9 服务器的非 root 用户使用 [Rocky Linux 9 的初始设置指南设置了 `sudo` 权限](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-rocky-linux-9)，解释了如何设置。

本教程中的所有命令都应以非 root 用户身份运行。如果该命令需要 root 访问权限，则它将以 `sudo` 开头。[Rocky Linux 9 的初始设置指南](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-rocky-linux-9) 解释了如何添加用户并为他们提供 sudo 访问权限。

## 安装 Docker

Rocky Linux 9 官方存储库中提供的 Docker 安装包可能不是最新版本。要获得最新和最好的版本，请从官方 Docker 存储库安装 Docker。本节将向您展示如何做到这一点。

首先，让我们更新包数据库：

```bash
sudo dnf check-update
```

接下来，添加官方 Docker 仓库：

```bash
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

虽然 Docker 没有 Rocky Linux 特定的存储库，但 Rocky Linux 基于 CentOS，可以使用相同的存储库。添加存储库后，安装 Docker，它由三个包组成：

```bash
sudo dnf install docker-ce docker-ce-cli containerd.io
```

安装完成后，启动 Docker 守护进程：

```bash
sudo systemctl start docker
```

验证它是否正在运行：

```bash
sudo systemctl status docker
```

输出应类似于以下内容，显示服务处于活动状态并正在运行：

```
docker.service - Docker Application Container Engine
Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
Active: active (running) since Sun 2016-05-01 06:53:52 CDT; 1 weeks 3 days ago
Docs: https://docs.docker.com
Main PID: 749 (docker)
```

最后，确保它在每次服务器重新启动时启动：

```bash
sudo systemctl enable docker
```

来源：[How to Install and Use Docker on Rocky Linux 9](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-rocky-linux-9)

<a id="enable-hyperv-in-vmware-desktop"></a>

## Enable Hyper-V in VMWare Desktop

1. Open VMware Workstation and create a new VM by using the Windows Server 2012 template. We will need to make two tweaks to the VM configuration in order to (fully) support Hyper-V Server:

2. In the **Virtual Machine Settings** dialog box, enable the **Virtualization engine** options as shown in the following figure.

3. Add the following three new entries to the **.VMX** configuration file to match the following screenshot. VMware configuration files can be opened with any text editor:

```ini
hypervisor.cpuid.v0 = "FALSE"
mce.enable = "TRUE"
vhv.enable = "TRUE"
```

<a id="win8-81-virtual-pc-2007-install"></a>

## Win8/8.1安装和使用Virtual PC 2007虚拟机的方法以及注意事项（32位和64位）

> 众所周知，在 Windows 8 及以上版本是无法直接安装 Virtual PC 2007 的。（包括 Win8/8.1/10）。如果你打开便会弹出兼容性的窗口，而且即使把它给装上了也会出现很多问题。

那么我下面就教大家如何在 Windows 8/8.1 32 位和 64 位上安装 Virtual PC 2007 并解决某些问题，此方法也适用于 Windows 10 32 位，64 位没有测试过，感兴趣的可以去尝试一下。本文以 Win8.1 64 位系统为主。

## 一、下载并安装主程序

下载完成之后，解压，然后打开"Setup_你系统位数.exe"并安装，如果你没有什么特殊情况，一路"Next"即可，这也方便日后我们解决某些问题时需要。

安装完成后先别着急打开，如果这个时候打开主程序时你便会发现它弹出了兼容性窗口。那么你只要把这个主程序改为另外的名称，例如"VirtualPC.exe"即可。

## 二、汉化主程序

接着打开解压目录下的"vpc2007通用汉化包.exe"进行汉化。

## 三、分为两种情况

如果你使用的是 **32 位的系统**：那么现在你已经可以正常使用，你可以关闭此页面，你也可以继续浏览**附加信息**以更新某些组件。

---

如果你使用的是 **64 位的系统**：那么还没有结束，如果你现在停止浏览。那么当你启动任何一个虚拟机的时候，最终你会发现电脑会蓝屏。如果你仔细观察，就会发现里面提到了 VMM.sys 这个文件，因此我们只要替换这个文件为 2012 年发布的新版本即可。《Windows Phone SDK 7.1.1》附带了此文件。下载后先把 `C:\Windows\System32\Drivers` 文件夹里的 VMM.sys 备份，然后把下载到的 VMM.sys 放入该文件夹里，重启即可。

## 附加信息

以下教程用来解决某些特定问题，32 位和 64 位通用。

### 一、对于 Windows 8 系统

1. 不要安装适用于 Windows 8 64 位的 **KB969856** 补丁程序，因为它会把你当前的 vmm.sys 替换掉。

2. 关于汇总更新。你可以下载汇总更新把 Virtual PC 2007 更新到最新版本(6.0.210) 包含 32 位和 64 位。下载链接在文末，仅用于 win8，如果你是 win8.1 的请继续浏览。

---

### 二、对于 Windows 8.1 系统

#### 1、鼠标指针滞后问题

Windows 8.1 以新的方式使用鼠标指针。尽管大多数程序都可以像以前操作系统一样运行良好，但对于 Virtual PC 并非如此：鼠标在 VPC 中的行为异常。只有禁用指针集成时，才会发生此错误。但是，如果你是安装 Windows 95/98 之前的系统，你将无法启用指针集成（例如 Windows 3.0/3.1/3.2），因此如果你在 VPC 里安装这些系统将会特别难受。不过不要紧，解决方式还是有的，由于此问题还出现在其他游戏中，因此微软发布了一个补丁程序：**KB2908279**，下载后是无法直接安装的，如果你直接打开，将会告诉你以下信息。

因此我们需要使用 Dism++ 进行离线安装，不出意外的话是可以安装的。

安装后重启你的电脑。由于此补丁默认仅适用于某些游戏中，但是微软解释了如何添加指定程序：

1. 打开注册表编辑器：运行中输入 "regedit.exe"

2. 转到以下的项：

   ```
   HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\AppCompatFlags
   ```

   再展开"Layers"。（如果不存在则新建一个项，命名为"Layers"）

3. 在该项中，建立一个"字符串值"，并将其命名为你 VPC 程序的具体位置，如果你在安装时没有变动，则默认是 `C:\Program Files (x86)\Microsoft Virtual PC\VirtualPC.exe`

   > 注：一定要写清楚路径，指向的是文件而不是目录！

4. 除了名称，你还需要修改值为 "NoDTToDITMouseBatch"（不带引号），然后关闭界面

5. 按下"Win+X"点击"命令提示符(管理员)"，然后输入命令：

   ```bash
   Rundll32 apphelp.dll,ShimFlushCache
   ```

6. 重启电脑，问题解决！

#### 2、应用汇总

尽管你可以在 Windows XP 到 Windows 8 的许多操作系统上毫无问题地安装最新版本的 VPC2007(6.0.210)，但在 Windows 8.1 上却是另一回事！

在安装过程中，应用汇总更新虚拟网卡驱动程序的配置，这是正常现象，因为此更新可以提高 NAT 共享网络的性能。但奇怪的是，这会在 Windows 8.1 上卸载虚拟网卡驱动（这在以前的操作系统不会出现）。结果是：应用汇总后，虚拟机无法连接到网络。更糟糕的是，在 Windows 8.1 64 位系统中，安装更新后，你将无法从"控制面板"中卸载 VPC2007。Windows 8.1 32 位不受此影响。

所以我的建议是 **不要安装汇总更新**，虽然添加了许多有用的功能，但这不是必须的。如果这些功能的改进对你很重要，请手动将下面的更新文件覆盖掉之前的文件。这样，无需安装汇总更新即可享受最新功能！
