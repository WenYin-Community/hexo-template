---
title: "Debian安装新版本Linux内核（backports kernel）"
date: 2024-04-13
categories:
  - "Linux"
tags:
  - "linux"
  - "kernel"
  - "debian"
---

[![](images/f608a1b1-8fb1-4c06-1e5e-c4f00d766c25.png)](https://wiki.wenyinos.com/wp-content/uploads/2024/04/f608a1b1-8fb1-4c06-1e5e-c4f00d766c25.png)Debian预置的Linux内核，版本随发行版的大版本冻结，比方Debian 9就一直是内核4.9版。想用新版本Linux内核的话，除了找第三方版本或自己编译外，官方也有提供backports软件库版本的内核，版本可能不是最新、但也是接近最新版本的Linux内核。

backports软件库从分支上说测试（testing），所以软件包的稳定性理论上比发行版软件库（stable）里的要低，所以谨慎选择！

可按下列步骤安装backports kernel（需要sudo权限）

**1、检查Debian的发行版本和内核版本**，主要是看下发行版的代号（codename），不同发行版因代号不同，步骤有些不同

检查发行版本（Debian 9的代号叫stretch，Debian 8的代号叫jessie，这影响后续的命令不同）

  `lsb_release -a`

检查内核版本

`uname -sr`

**2、把backports软件库的源加到apt源列表里**

  `echo "deb http://ftp.debian.org/debian stretch-backports main" | sudo tee -a /etc/apt/sources.list > /dev/null`

以上如果是Debian 9命令里是stretch-backports，如果是Debian 8则是jessie-backports，这就是根据发行版代号的区别

**3、更新软件包的源**

`sudo apt-get update`

**4、安装apt查询工具aptitude**

`sudo apt-get install aptitude -y`

**5、用aptitude查询软件源里有什么版本的内核**（backports内核的名称中间有bpo字样）

`aptitude search linux-image`

带cloud字样的是推荐云上的虚拟机用的，dbg字样的是带系统调试信号库的，什么都不带的是推荐物理机器用的

**6、安装backports内核**（不同发行版的Debian，根据发行版的代号不同，命令会有所不同）

根据以上aptitude的结果，选择安装内核，比方要安装linux-image-4.16.0-0.bpo.2-cloud-amd64这个内核

`sudo apt-get -t stretch-backports install linux-image-4.16.0-0.bpo.2-cloud-amd64 -y`

**7、（可选）更新其他backports源里有的软件包**

`sudo apt-get -t stretch-backports upgrade -y`

**8、（可选）清理已无依赖关系的旧版软件（包括旧版内核）、清理apt缓存**

`sudo apt autoremove -y`

   `sudo apt-get autoclean -y`

**9、重启机器**

`sudo reboot`

**10、查看Linux内核版本号，确认已用新的backports内核启动**

`uname -r`
