---
title: "OpenVZ 平台 Google BBR 一键安装脚本"
date: 2018-03-13
categories:
  - "虚拟化"
tags: 
  - "bbr"
  - "openvz"
  - "vps"
---

更新了 liblkl-hijack.so 并打上了最近网上很火的“魔改版” BBR 补丁，同时更新了 haproxy。老版本的朋友可以重新下载安装脚本再安装一遍，需要先停止当前的服务。

## 使用方法

已测试通过的系统： Ubuntu 14.04 x64、Ubuntu 16.04 x64、CentOS 6 x64、CentOS 7 x64 只支持 64 位系统，要求 glibc 版本 2.14 以上。

|   1  2  3     |   wget https://raw.githubusercontent.com/kuoruan/shell-scripts/master/ovz-bbr/ovz-bbr-installer.sh  chmod +x ovz\-bbr\-installer.sh  ./ovz\-bbr\-installer.sh     |
| --- | --- |

需要配置的有如下几个选项：

1.需要加速的端口，即的 SS 端口。加速开启之后，流量会先经过 BBR 处理，之后再发送给后端的 SS。

2.可能需要配置 “公网接口名称”，即你服务器上具有公网 IP 的接口名称。搬瓦工 OpenVZ 上默认都是 venet0，但是有朋友可能需要安装在其他服务器上，所以我加入了此选项。

需要注意的是，在有 firewalld 的服务器上安装的时候，firewalld 会干扰 iptables 的规则，造成网络不通（现在具体原因未知，谁有解决方案可以提示一下）。所以在装有 firewalld 的服务器上需要先退出 firewalld：

|   1  2     |   systemctl disable firewalld  systemctl stop firewalld     |
| --- | --- |

如需卸载，请使用：

|   1     |   ./ovz\-bbr\-installer.sh uninstall     |
| --- | --- |

## 错误说明

有些机器一切正常，但是加速失败。从网友的反馈来看，可能需要将 SS 的监听地址从 vps IP 改到 127.0.0.1 或者 0.0.0.0，具体未测试，加速失败的朋友可以试一试

## 多端口加速

安装的时候只配置了一个加速端口，但是你可以配置多端口加速，配置方法非常简单。 修改文件

|   1     |   \# vi /usr/local/haproxy-lkl/etc/port-rules     |
| --- | --- |

在文件里添加需要加速的端口，每行一条，可以配置单个端口或者端口范围，以 # 开头的行将被忽略。 例如：8800 或者 8800-8810 配置完成之后，只需要重启 haproxy-lkl 即可。

注： 最初版本的实现是需要再开一个新端口，后来经人提醒，我又看了一下 HAproxy 的配置说明，可以直接代理后端端口，不必再开新端口。请注意，使用该方法后，如果 HAproxy 进程异常退出，会造成无法连接原有端口。所以，请确保在退出 HAproxy 时是通过命令正常退出的，在退出时会自动清理原有的防火墙规则。

使用 systemctl 或者 service 命令来启动、停止和重启 HAporxy-lkl：

|   1     |   systemctl {start\|stop\|restart} haproxy\-lkl     |
| --- | --- |

|   1     |   service haproxy\-lkl {start\|stop\|restart}     |
| --- | --- |

/usr/local/haproxy\-lkl/etc/haproxy.cfg 这个文件是通过 port-rules 自动生成的，每次启动都会重新生成，所以直接修改它的配置没用。 如果想要自定义配置，请修改启动文件：

|   1     |   /usr/local/haproxy\-lkl/sbin/haproxy\-lkl     |
| --- | --- |

## 更新 glibc

CentOS 6 更新 glibc，首先下载如下几个文件：

|   1  2  3  4  5     |   wget http://ftp.redsleeve.org/pub/steam/glibc-2.15-60.el6.x86\_64.rpm \\  http://ftp.redsleeve.org/pub/steam/glibc-common-2.15-60.el6.x86\_64.rpm \\  http://ftp.redsleeve.org/pub/steam/glibc-devel-2.15-60.el6.x86\_64.rpm \\  http://ftp.redsleeve.org/pub/steam/glibc-headers-2.15-60.el6.x86\_64.rpm \\  http://ftp.redsleeve.org/pub/steam/nscd-2.15-60.el6.x86\_64.rpm     |
| --- | --- |

然后安装：

|   1  2  3  4  5     |   \# rpm -Uvh glibc-2.15-60.el6.x86\_64.rpm \\  glibc\-common\-2.15\-60.el6.x86\_64.rpm \\  glibc\-devel\-2.15\-60.el6.x86\_64.rpm \\  glibc\-headers\-2.15\-60.el6.x86\_64.rpm \\  nscd\-2.15\-60.el6.x86\_64.rpm     |
| --- | --- |

如果以上步骤无法更新，可以手动编译更新（来自网友的方法）

|   1  2  3  4  5  6  7  8  9     |   wget http://ftp.gnu.org/gnu/glibc/glibc-2.15.tar.gz  wget http://ftp.gnu.org/gnu/glibc/glibc-ports-2.15.tar.gz  tar \-zxf glibc\-2.15.tar.gz  tar \-zxf glibc\-ports\-2.15.tar.gz  mv glibc\-ports\-2.15 glibc\-2.15/ports  mkdir glibc\-build\-2.15  cd glibc\-build\-2.15  ../glibc\-2.15/configure \--prefix\=/usr \--disable\-profile \--enable\-add\-ons \--with\-headers\=/usr/include \--with\-binutils\=/usr/bin  make all && make install     |
| --- | --- |

检查一下：

|   1  2  3  4  5  6     |   \# ldd --version  ldd (GNU libc) 2.15  Copyright (C) 2012 Free Software Foundation, Inc.  This is free software; see the source for copying conditions.  There is NO  warranty; not even for MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  Written by Roland McGrath and Ulrich Drepper.     |
| --- | --- |

已经升级到 glibc 2.15 了。

## 判断 BBR 已正常工作

判断 bbr 是否正常启动可以尝试 ping 10.0.0.2，如果能通，说明 bbr 已经启动。

然后检查 iptables 规则

|   1  2  3  4  5  6  7  8  9  10  11  12  13  14     |   iptables \-t nat \-nL  Chain PREROUTING (policy ACCEPT)  target     prot opt source               destination  LKL\_IN     all  \--  0.0.0.0/0            0.0.0.0/0  Chain POSTROUTING (policy ACCEPT)  target     prot opt source               destination  Chain OUTPUT (policy ACCEPT)  target     prot opt source               destination  Chain LKL\_IN (1 references)  target     prot opt source               destination  DNAT       tcp  \--  0.0.0.0/0            0.0.0.0/0            tcp dpt:8989 to:10.0.0.2     |
| --- | --- |

里边会看到多了一张链表 LKL\_IN，里边有相应的端口规则。

- 转载请注明: [Index](https://blog.kuoruan.com/author/admin "由Index发布") 2017年4月10日 于 [扩软博客](https://blog.kuoruan.com/ "访问扩软博客") 发表
