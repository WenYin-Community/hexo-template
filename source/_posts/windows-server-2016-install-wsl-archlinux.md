---
title: "为Windows Server 2016正式版移植WSL组件并将其替换为Arch Linux"
date: 2018-02-28
categories:
  - "Windows"
tags:
  - "arch"
  - "linux"
  - "windows10"
  - "windows-server"
  - "windows"
---

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
