---
title: "Windows Server 2019安装Intel I211网卡驱动"
date: 2019-03-17
categories:
  - "Windows"
tags:
  - "i211"
  - "驱动"
  - "windows-server"
  - "windows"
  - "intel"
coverImage: "7.png"
---

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
