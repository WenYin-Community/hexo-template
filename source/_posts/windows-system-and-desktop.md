---
title: "Windows 系统与桌面技巧合集"
author: "学姐大人"
date: 2023-04-22
categories:
  - "开发工具"
tags:
  - "windows"
  - "wsl"
  - "windows-server"
---

Windows 侧的实用设置：自动登录、应用商店、WSL 的搬运与替换、以及服务器系统装网卡驱动。

<!-- more -->

<a id="windows-10-11-auto-login"></a>

## Windows 10/11自动登录设置

## 找回自动登录复选框的办法

要找回这个复选框其实也很简单，只需要修改注册表的一个小地方即可。

打开注册表路径：

```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\PasswordLess\Device
```

修改下面的 `DevicePasswordLessBuildVersion` 值为 0，那么再运行 `Netplwiz`，**【要使用本计算机，用户必须输入用户名和密码】** 复选框就又出现了。

<a id="windows10-ltsb-deploy-microsoft-store"></a>

## 在Windows 10 企业版长期服务计划版本部署应用商店

目前适用于ltsb 2015/2016版本，appx软件包由国外网友提取。

首先打开win10中开发人员模式，然后此处下载提取出的appx软件包：

[https://1drv.ms/u/s!Av9xX09cRe2HgblSXegPY-r2-Ik\_hA](http://link.zhihu.com/?target=https%3A//1drv.ms/u/s%21Av9xX09cRe2HgblSXegPY-r2-Ik_hA)

解压后直接运行其中IntallStore.ps1脚本即可。然后在开始菜单运行应用商店，等待其自动更新；

注意要使用微软账户登录。

附脚本内容：

```powershell
Get-Appxpackage | ? { $_.PackageFullName -match "Store" }

$packageList = ".\Microsoft.NET.Native.Runtime.1.0_1.0.22929.0_x64__8wekyb3d8bbwe.appx",".\Microsoft.VCLibs.140.00_14.0.22929.0_x64__8wekyb3d8bbwe.appx"

Add-AppxPackage -Path ".\76435323689e40d094e3dea2914c64c1.appxbundle" –DependencyPath $packageList
write-host " "
write-host "Installation beendet." 
write-host " "

pause
```

目前安装为英文版，大部分appx均可使用， 除xbox游戏无法使用因为没有账户整合

<a id="how-to-move-wsl-dict"></a>

## 如何将win10/win11的wsl子系统移动到其他位置

> **建议使用** [DDoSolitary/LxRunOffline](https://github.com/DDoSolitary/LxRunOffline) 工具进行配置。
>
> 但此工具长期未更新，在高版本 Win11 上面疑似失效（原因不明），在此提供使用 WSL 内置命令的方法。

## 适用于 Win10/11 支持 WSL1 和 WSL2 的所有版本

首先按正常方法安装 WSL，并启动运行。

确认安装好后，切换到系统的 cmd/powershell，执行：

```bash
# 显示已安装的发行版
wsl --list

# 关闭正在运行的 WSL 容器
wsl --shutdown
```

## 导出需要移动或备份的发行版

完成后可随意删除 appx 商店的应用，已不再需要。

```bash
wsl --export debian e:/WSL/debian.tar
wsl --unregister debian
wsl --import debian e:/WSL/debian e:/WSL/Debian.tar
```

输入 `wsl`，确认正常运行即可，将自动添加到 Windows Terminal 标签页中，但不会生成开始菜单选项。

## 按此方法修改位置后，默认将使用 root 登录，如何修复？

### 方法 1

在 Terminal 的 WSL 启动选项添加 `-u %USER` 参数，示例：

[![](images/QQ图片20230422112015.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/QQ图片20230422112015.png)

### 方法 2

在 WSL 中创建 `/etc/wsl.conf` 文件，输入以下内容：

[![](images/QQ图片20230422112512.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/QQ图片20230422112512.png)

<a id="windows-server-2016-install-wsl-archlinux"></a>

## 为Windows Server 2016正式版移植WSL组件并将其替换为Arch Linux

方法选自：[Windows Server 2016 14393 (1607) Discussion](https://forums.mydigitallife.net/threads/discussion-windows-server-2016-14393-1607.70435/page-10)

首先安装 Windows Server 2016 正式版并配置好，然后激活：

![](images/v2-2cca5c6cb05073257b314d2789a45904_hd.jpg)

然后下载 WSL 补充包，从 Win10 x64 提取的：

[下载链接 - OneDrive](https://1drv.ms/f/s!Av9xX09cRe2HgbNGyd7BTiCzc-uxYA)

对照文档中方案安装：

Paste this on an administrative command prompt, reboot when asked, enable the developer mode via the metro settings panel。

```bash
dism /online /norestart /add-package /packagepath:Microsoft-Windows-Lxss-Optional-Package.cab /packagepath:Microsoft-Windows-Lxss-Optional-Package-en-US.cab /packagepath:Microsoft-Windows-Lxss-Package.cab /packagepath:Microsoft-Windows-Lxss-Package-en-US.cab

dism /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all
```

（记得打开开发者模式）

![](images/v2-dc6672c4832e0cc868c74773e3844fb2_hd.jpg)

到此请重新启动设备：

![](images/v2-dc60a779d382e282ce227088f78f3ff9_hd.jpg)

重启后输入 `bash` 即可开始下载安装：

![](images/v2-ef2553af48c02afcb550ec0daecccaf3_hd.jpg)

等待，然后输入用户名密码，配置完成：

![](images/v2-57c0763b25bcbfab5089185fb8c9ab7d_hd.jpg)

![](images/v2-be82c82f23911120d08100a4c54e4cd4_hd.jpg)

替换为 Arch Linux 可以借用如下脚本：

[GitHub - turbo/alwsl: Install archlinux as the WSL](https://github.com/turbo/alwsl)

> 更新：故障已解决，WSL 可以正常运行。

> **提醒：Arch 环境毛病太多，本人还是换回 Ubuntu 了。**

## 要换回也简单，在 cmd 下执行：

```bash
alwsl.bat remove
```

**彻底卸载 Arch 环境重新安装 Ubuntu 即可。**

![](images/v2-c01449479e03bc1965349b31f4e02e20_hd.jpg)

切换到 Arch Linux，我们即可执行：

```bash
alwsl.bat install
```

（在 cmd 而不是 bash 环境）

![](images/v2-62e4bc2331b3de481d97a6268b37f289_hd.jpg)

然后就是漫长等待......

![](images/v2-668184389409cb757518f3395c8cd77c_hd.jpg)

等待执行完成，开始菜单中找到 Arch Linux 就可以运行了。

![](images/v2-77ab22cf069233899d221d51ef0ece8b_hd.jpg)

![](images/v2-95ba234d8c3411a516eb03dbeed662e5_hd.jpg)

<a id="windows-server-2019-intel-i211-driver"></a>

## Windows Server 2019安装Intel I211网卡驱动

由于Windows系统原因，一般桌面主板自带的Intel网卡（典型的包括I211、I211-AT、I217-V、I218-V、I219-V）等，都无法在Windows Server系统上找到对应的驱动。但是，这些网卡几乎都有对应的服务器主板版本（例如I219-LM）。这些网卡其实并没有本质上的差别，只是在驱动层面，利用不同的驱动签名使得显卡不能通用。本文将详细说明如何在Windows Server系统上安装这些驱动。

### 1、驱动下载

首先，在Intel官网下载网卡驱动程序包，由于Windows Server 2019刚发布，所以目前没有2019的专门页面，但可以通用Windows Server 2016版本（[下载页面](https://downloadcenter.intel.com/download/26092/Intel-Network-Adapter-Driver-for-Windows-Server-2016-)）。下载完成后，得到一个PROWinx64.exe的自解压安装包，使用7zip或其他解压软件解压到任意文件夹。

### 2、修改驱动程序文件（以I211为例）

进入第一步解压后的文件夹，依次进入PRO1000 -> Winx64 -> NDIS64文件夹。这个文件夹中，有举例的I211网卡的驱动安装文件。

![](images/1.png)

#### **I211**

#### 用记事本打开e1r64x64.inf这个文件，搜索I211找到对应的ID

和I219-V差不多的步骤，不过配置的文件是同文件夹下的另一个文件，e1r64x64.inf。同样通过搜索找到I211所对应的ID

![](images/5.png)

用这个ID搜索到对应的键\[Intel.NTamd64.6.3.1\]和配置行

![](images/6.png)

将此行复制到后面的另一个键\[Intel.NTamd64.6.3\]中。保存，关闭。

![](images/7.png)

### 开启测试模式

因为我们修改了签名配置文件，所以如果要安装这些驱动，我们需要开启测试模式，允许未经过签名的驱动。

在 CMD(管理员) 中执行以下两条命令：

```bash
bcdedit -set loadoptions DISABLE_INTEGRITY_CHECKS
bcdedit -set TESTSIGNING ON
```

执行完后，需要重启电脑，以进入测试模式。

### 安装驱动

这里以I211网卡驱动安装为例，I219-V安装同理，只是在后续步骤选择驱动程序文件时不同而已。

在设备管理器中，找到那个没有驱动的网络控制器，右键选择“更新驱动程序”

选择“浏览我的计算机以查找驱动程序软件”

选择“让我从计算机上的可用驱动程序列表中选取”

下滑下拉列表，找到并选择“网络设配器”，点击下一步

这里不做选择，点击右下的“从磁盘安装”

在弹出窗口中，点击右下角的浏览，选择我们刚才修改的I211所在的配置文件，即e1r64x64.inf，然后点击确认。

上一步点击完确认后，由于我们之前修改好了配置文件，所以就可以在后续窗口里看见I211驱动了，点击下一步。

这里会弹出一个警告，因为我们对配置文件进行了修改，签名肯定是无法通过验证的，所以这里会有这个警告信息。当然点击“始终安装此驱动程序软件”

安装完成后，在设备管理器中，也能看见这张网卡信息了。

### 关闭测试模式

安装完成后，关闭测试模式。在 CMD 中执行以下命令：

```bash
bcdedit -set loadoptions ENABLE_INTEGRITY_CHECKS
bcdedit -set TESTSIGNING OFF
```

重启电脑，完成。

### 6、附加：开启WLAN

默认安装时无线LAN服务是关闭的，如果需要开启，只需要在“添加角色和功能”中，选择开启“无线LAN服务”即可。

来源：http://blog.zivers.com/post/2157.html

<a id="tencentyun-install-windowsserver2012r2-and-linux"></a>

## 为腾讯云主机安装Windows Server 2012R2+Linux双系统

这里使用 Fedora 26 LxQt 版镜像作为示例，首先在腾讯云控制台选择安装 Windows Server 2012R2 系统，默认有 50+2GB 的磁盘空间，后面那个小虚拟磁盘用于交换，较大的在 Linux 下为 `/dev/vda1`，较小的为 `vda2`。

这里用的是腾讯云学生计划每月 1 元的主机，配置很低。

![](images/v2-d8653857f6d2c1083669a146a5d53b71_hd.jpg)

软件准备：EasyBCD 和 Fedora 安装镜像，个人使用的是 Fedora-LXQt-Live-x86_64-26-1.5.iso 这个。

第一步用 RDP 远程桌面登录首先截图记录，保存下本机的网络信息（腾讯云不提供 DHCP），以后会用到。

![](images/v2-e4c6030ab2a109ba842f47e803a99e3f_hd.jpg)

第二步将 Windows 中磁盘 1 压缩出一定空闲空间，个人分配了 30GB，并把磁盘 2 格式化为 FAT32 分区，如图所示：

![](images/v2-b84a6107729b61768eafc6c942728e2e_hd.jpg)

挂载上 Fedora 的安装镜像，并将根目录内所有文件复制到前面那个小的 2GB FAT32 分区中，并设置一个卷标，这里设为 FEDO。

![](images/v2-9ead8f27148a39af1b6cb5001ee85975_hd.jpg)

下面打开 EasyBCD，添加一个 NeoGrub 引导项，并进行配置：

（引导倒计时设为 30s 以上方便后续操作）

![](images/v2-341dbe0607e8736850470b653b344502_hd.jpg)

![](images/v2-7e9efcca2285595a671521e21af3334d_hd.jpg)

配置文件内写入：

```ini
title fedora LiveCD Method 1
root (hd0,1)
kernel /vmlinuz0 root=live:LABEL=FEDO rootfstype=auto ro rd.live.image quiet
initrd /initrd0.img
boot
```

注意前面 LABEL 后面的应该和你的存放安装镜像的分区标识相同。

下面注意将安装镜像下 isolinux 目录中 vmlinuz 和 initrd 俩文件复制到 C 盘根目录并改名为 vmlinuz0 和 initrd0。

下面重新启动虚拟机，在腾讯云后台的 VNC 界面打开，可见到如下菜单，选择 NeoGrub 引导。

![](images/v2-040643458ffc6ab8ad6e3fa4dad6751e_hd.jpg)

若配置正常即可进入 Fedora 的 LiveCD 环境，点击开始安装即可，注意安装到之前分出的 /dev/vda1 中。

![](images/v2-8e310bf3dfc466b283d853b74df26dc6_hd.jpg)

![](images/v2-458da2227961bb3ac1e430f16a69256c_hd.jpg)

安装完以后重启虚拟机，可以关闭图形界面然后确认一下分区情况，再重新启动。

![](images/v2-ad157b48f4226fd47dad1f5bf5a2fa85_hd.jpg)

顺便改一下 grub 菜单的超时时间，默认只有 5s 很难切换系统。

编辑 `/etc/default/grub` 文件：

```bash
sudo vi /etc/default/grub
```

第一行改为较大的如 30 以上即可，便可显示出菜单进行切换。

执行下面命令更新 grub 配置：

```bash
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
```

下面重新启动：

![](images/v2-938eb10b8030e575ab70b47820825376_hd.jpg)

出现下面界面表示双系统正常运行，下面自行配置 Linux 下的网络参数即可进行 ssh 连接和其他操作，下面不再赘述。

![](images/v2-8dd751b55cf0ae185b3cd16e37bcf4dd_hd.jpg)
