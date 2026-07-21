---
title: "斐讯K2t免拆机刷入LEDE/OpenWRT的步骤"
date: 2018-05-25
categories:
  - "网络与代理"
tags:
  - "openwrt"
---

首先感谢[@phitools](http://www.right.com.cn/forum/home.php?mod=space&uid=389408) 制作的telnet工具和[@ptpt52](http://www.right.com.cn/forum/home.php?mod=space&uid=372524) 制作的LEDE固件。

之前忘了提一步，有人说要先刷官改打开ssh以后才能刷，不然会砖! [http://www.right.com.cn/forum/forum.php?mod=viewthread&tid=321512](http://www.right.com.cn/forum/forum.php?mod=viewthread&tid=321512) 第一步是要先打开Telnet，进入终端操作，参考[http://www.right.com.cn/forum/forum.php?mod=viewthread&tid=321483](http://www.right.com.cn/forum/%E4%BC%A0%E9%80%81%E9%97%A8)即可（已刷官改的跳过）打开Telnet后，要使用ssh工具登录，用户名root，密码admin，需要sftp上传文件。 ssh工具推荐使用[MobaXterm](https://mobaxterm.mobatek.net/)，可以在左侧窗格直接拖放文件，右侧窗口输入命令：

OpenWRT/LEDE下载地址：

#### 本帖隐藏的内容

https://router-sh.ptpt52.com/rom/ 寻找Phicomm K2T A1/A2/A3 board (16MB flash)这个东西点击下载。

固件由@ptpt52 出品，代号：NATCAP

固件无线默认名称：NATCAP\_XXXX，密码：88888888 固件管理界面：[http://192.168.15.1/](http://192.168.15.1/) 管理界面账户/密码：root/admin

把下载的固件natcap-3.0.0-build201805181759-ar71xx-generic-k2t-16M-squashfs-sysupgrade.bin重命名为lede.bin

传送到路由器 `/tmp` 目录下，运行刷入：

```bash
mtd -r write /tmp/lede.bin firmware
```

在出现rebooting...之前切勿断电，等待刷机完成自动重启即可，正常情况下可以登录配置。

注意某些情况下有一定概率初次刷机出现找不到5G信号的情况，拔电重启一下就可以了。
