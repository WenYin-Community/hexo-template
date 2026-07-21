---
title: "Linux(CentOS 7)下使用mono+ArchiSteamFarm挂卡"
date: 2019-03-04
categories:
  - "Linux"
tags:
  - "asf"
  - "steam"
  - "挂卡"
  - "linux"
  - "centos"
---

首先感谢@[zjmonk](https://link.zhihu.com/?target=http%3A//steamcn.com/suid-191936) 发现的ArchiSteamFarm这么好的挂卡软件，在他的帖子里还提醒我可以用mono在linux上玩，真是大好人啊

补充下，本教程适用于服务器上24小时不间断挂卡，个人电脑不推荐安装linux桌面系统，自己家里还是用idle master更直观

FAQ： 1. 什么是mono呢？ 简单的理解，可以认为是linux环境下的.net Framework，是个开源的项目，可以让C#程序运行在linux上面 2. 为什么要用linux？ 当然是因为linux轻便性能高啦，如果能用linux挂卡，各大低配魔法主机、家里闲置的电脑、公司的服务器，都能拿来24小时挂卡！不用非得租用昂贵的Windows服务器啦！ 3. 任何linux系统都可以吗？ 本人linux小白，只保证CentOS7 64位我是测试过的，理论上Redhat也能用本教程。linux版本众多，不保证所有环境都行。 此外，mono这个东西，以前想用来开泰拉瑞亚服务器的时候用过，遭到了无情的失败，所以在一些环境里用mono无法运行一些C#程序，也是正常的...

下面是教程： 1. 首先ssh连接上远程主机，进入命令行 2. 安装mono(参考了[CentOS 7 上部署Mono 4 和Jexus 5.6](https://link.zhihu.com/?target=http%3A//www.cnblogs.com/shanyou/p/4509980.html))，先添加yum源。

> ```
> rpm --import "http://keyserver.ubuntu.com/pks/lookup?op=get&search=0x3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF" 
>    
> yum-config-manager --add-repo http://download.mono-project.com/repo/centos/
> ```

有可能提示找不到yum-config-manager ，这个是因为系统默认没有安装这个命令，这个命令在yum-utils 包里，可以通过命令yum -y install yum-utils 安装。 然后

1. yum -y install mono-complete

复制代码

这里和那篇文章里不太一样，我的主机执行他说的yum –y install mono-complete.x86\_64会提示找不到包 最后执行

1. mono -V

复制代码

如果出现 说明安装成功了。 3. 开始挂卡 安装完mono，可别急着运行，因为当前直接运行的话，一旦断掉ssh会话，程序就停止啦 使用screen命令，没安装的先yum -y install screen安装下 开启screen新窗口，并命名为asf

1. screen -S asf

复制代码

根据[安利一个新的挂卡软件ArchiSteamFarm - 平台研讨 - SteamCN 蒸汽动力 - 驱动正版游戏的引擎！](https://link.zhihu.com/?target=http%3A//steamcn.com/t169088-1-1) 下载asf，配置好你的xml文件，然后用ftp等方式把整个文件夹上传到远程主机，我的上传路径是/opt/ASF执行

1. cd /opt/ASF
2. mono ASF.exe

复制代码

看到

大功告成！这时候你就可以安心的退出ssh连接 4. 退出挂卡

1. screen -ls #显示所有的screen窗口名字和进程号
2. kill \[进程号\]

复制代码

这样就能退出了
