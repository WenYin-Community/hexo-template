---
title: "路由器梅林固件软件中心重置方法"
date: 2023-11-26
categories:
  - "网络与代理"
tags: 
  - "asus"
  - "merlin"
  - "路由器"
coverImage: "QQ图片20231126144627.png"
---

**路由器梅林固件软件中心重置方法** 2021年6月4日 悟空

**文章目录** 1) 1. 软件中心重置方法

    1.1) 1.1 界面重置：

    1.2) 1.2 命令重置： 1.3) 1.3 一键重置： 2) 2. 释放jffs空间 3) 3. 重启软件中心

 

最近刷了华硕固件，但是软件中心页面出了点问题，

似乎是/jffs/db目录下的数据库损毁导致skipd服务启动不了了，

解决方法就是重置软件中心数据库，下面是找到的资料，留下来保存一下。

**1\. 软件中心重置方法**

软件中心出现问题需要重置软件中心的，可以解决大部分问题；

由于jffs坏块或者硬件问题导致的软件中心问题，重置是不管用的，建议及时换机。

**1.1 界面重置：**

在【系统管理 】–【 系统设置】内勾选：

Format JFFS partition at next boot 和 Enable JFFS custom scripts and configs

然后点击应用本页面设置，成功应用后重启路由器即可，

此操作可以清除jffs分区中的所有数据，包括安装在jffs分区的软件中心和所有插件。

重启路由后，软件中心会自动重新完成初始安装，然后将路由器连上网络，

进入软件中心将软件中心更新到最新即完成软件中心重置。

软件中心一直显示更新中怎么办？ 可以尝试通过运行命令service restart\_skipd来重启skipd服务。

如果运行重启skipd的命令后，再次运行ps|grep skipd|grep -v grep仍然没有输出，

说明储存在jffs分区的skipd数据库可能遭到了损坏，

此时可以请参考 软件中心重置方法 （见下文：重要命令部分）

**1.2 命令重置：**

需要开启固件的ssh功能（【系统管理 】-【 系统设置】-【启用 SSH】），

然后使用ssh客户端（Putty、Xshell、SecureCRT等软件均可）登录进路由器，

依次输入以下命令，即可重置软件中心。

\# 1. 关闭软件中心相关进程，删除软件中心文件 kill -9 $(pidof skipd) cd /koolshare/perp && sh perp.sh stop cd / && rm -rf /jffs/.asusrouter /jffs/.koolshare /jffs/db #2. 重置软件中心 jffsinit.sh cd /koolshare/perp && sh perp.sh start service restart\_skipd \# 3. 重启路由器（可选） reboot \# 4.浏览器进入软件中心，将软件中心版本更新到最新，安装插件... **1.3 一键重置：**

如果你刷的梅林固件是384.10\_0及其以上版本，

直接在ssh客户端内运行koolshare-reset命令即可，

其效果等同上面手动输入命令。

**2\. 释放jffs空间**

注意，此操作会删除jffs分区内的所有文件，

包括但不限于：软件中心本身、软件中心所有的插件、

安装的证书、TrafficAnalyzer的数据库、自定义的设备图标等

kill -9 $(pidof skipd) rm -rf /jffs/.asusrouter /jffs/.koolshare /jffs/.cert /jffs/.sys /jffs/.wtfast /jffs/\* reboot

**3\. 重启软件中心**

当httpd进程挂掉的时候（FAQ中第3个问题），此时可以用ssh进入路由器后台，输入以下命令重启

cd /koolshare/perp sh perp.sh stop sh perp.sh start

> 转载本文时请注明出处及本文链接地址[路由器梅林固件软件中心重置方法](https://www.learnhard.cn/articles/797.html)

>  **1，解决Merlin 380 老固件软件中心显示 0.0**

很多用户反馈，重新刷固件，或者重置系统之后，软件中心显示 0.0，并且无法显示任何插件，解决方法: 打开路由器的 ssh（如何打开 ssh 终端请自己参考下相关方法） 复制下面的脚本，修复服务器地址 sed -i 's/koolshare.ngrok.wang/ks.ddnsto.com/g' /koolshare/scripts/ks\_app\_install.sh sed -i 's/koolshare.ngrok.wang/ks.ddnsto.com/g' /koolshare/webs/Main\_Soft\_center.asp **2，Koolshare软件中心1.5.8增加了对安装包名称的检测，屏蔽了科学插件，无法离线安装。** 如果提示检测到离线安装包名有非法关键词，开启路由器的SSH功能， 登录并输入以下命令后，再进行离线安装。 sed -i 's/\\tdetect\_package/\\t# detect\_package/g' /koolshare/scripts/ks\_tar\_install.sh

[![](images/QQ图片20231126144627-640x480.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/11/QQ图片20231126144627.png)
