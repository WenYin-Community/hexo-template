---
title: "在Windows 10 企业版长期服务计划版本部署应用商店"
date: 2018-02-28
categories:
  - "Windows"
tags:
  - "windows10"
  - "windows"
---

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
