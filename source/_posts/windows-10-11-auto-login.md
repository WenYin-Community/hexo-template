---
title: "Windows 10/11自动登录设置"
date: 2022-08-25
categories:
  - "Windows"
tags:
  - "windows10"
  - "windows"
---

## 找回自动登录复选框的办法

要找回这个复选框其实也很简单，只需要修改注册表的一个小地方即可。

打开注册表路径：

```
HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Windows NT\CurrentVersion\PasswordLess\Device
```

修改下面的 `DevicePasswordLessBuildVersion` 值为 0，那么再运行 `Netplwiz`，**【要使用本计算机，用户必须输入用户名和密码】** 复选框就又出现了。
