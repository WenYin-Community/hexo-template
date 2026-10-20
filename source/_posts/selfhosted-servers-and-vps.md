---
title: "自建服务与 VPS 运维合集"
author: "学姐大人"
date: 2020-03-06
categories:
  - "开发工具"
tags:
  - "server"
  - "vps"
  - "linux"
  - "self-hosted"
---

在自家机器或便宜 VPS 上跑服务：LNMP 环境、开机自启的游戏服、NAS 上的软件源，以及云主机的监控进程清理。

<!-- more -->

<a id="centos-7-yum-lnmp"></a>

## CentOS 7 YUM 10分钟快速安装 LNMP 环境

转载

源码编译安装 [LNMP](https://link.zhihu.com/?target=http%3A//www.luoxiao123.cn/tag/lnmp) 环境虽然便于自定义，但是对于小型服务器来说，漫长的编译时间让人无法等待。如果能在 10 分钟后内搞定环境安装，再好不多了。

那么如何在 10 分钟内快速安装完 [LNMP](https://link.zhihu.com/?target=http%3A//www.luoxiao123.cn/tag/lnmp) 环境呢，答案是 **使用 YUM 安装**。

### 什么 YUM ？

> [官网给出的解释](https://link.zhihu.com/?target=http%3A//www.luoxiao123.cn/go/%3Furl%3Dhttps%3A//fedoraproject.org/wiki/Yum)
> 
> yum is a software package manager that installs, updates, and removes packages on RPM-based systems. It automatically computes dependencies and figures out what things should occur to install packages. yum makes it easier to maintain groups of machines without having to manually update each one using rpm.
> 
> Features include:
> 
> - Support for multiple repositories
> - Simple configuration
> - Dependency calculation
> - Fast operation
> - RPM-consistent behavior
> - Package group support, including multiple-repository groups
> - Simple interface

其中有两条解释很明显，**Simple configuration** —— **简单配置**，**Fast operation** ——**快速操作**。

### 配置安装

基于 YUM 的这种特性，那么就可以简单粗暴的安装 LNMP 环境了。

**配置 YUM 源**

CentOS 7 的 默认 YUM 源里的软件包版本可能不是最新的，如果要安装最新的软件包就得配置下 YUM 源。

配置 YUM 源可以通过直接安装 **RPM** (Red Hat Package Manager) 包，或者修改 Repository，本文讲解通过安装 RPM 方式。

首先需要安装 **EPEL** ( Extra Packages for Enterprise [Linux](https://link.zhihu.com/?target=http%3A//lib.csdn.net/base/linux) ) YUM 源，用以解决部分依赖包不存在的问题：

```bash
yum install -y epel-release
```

接着是 **[MySQL](https://link.zhihu.com/?target=http%3A//lib.csdn.net/base/mysql)** YUM 源，[MySQL 官网给出了配置教程](https://link.zhihu.com/?target=http%3A//www.luoxiao123.cn/go/%3Furl%3Dhttp%3A//dev.mysql.com/doc/mysql-repo-excerpt/5.6/en/linux-installation-yum-repo.html)，因为本文章讲解的是 CentOS 7，我们只需要安装对应的 RPM 包就行了。

安装 RPM 包前需要导入 RPM-GPG-KEY 文件，不然安装过程会出错。

将 [MySQL RPM-GPG-KEY](https://link.zhihu.com/?target=http%3A//www.luoxiao123.cn/go/%3Furl%3Dhttp%3A//dev.mysql.com/doc/refman/5.6/en/checking-gpg-signature.html) 另存为 mysql\_pubkey.asc 并导入 ：

```bash
rpm --import mysql_pubkey.asc
```

导入后安装 CentOS 7 的 MySQL RPM 包：

```bash
rpm -Uvh http://repo.mysql.com/mysql-community-release-el7-5.noarch.rpm
```

然后是 **[PHP](https://link.zhihu.com/?target=http%3A//lib.csdn.net/base/php)** YUM 源，PHP 最新的 RPM 包，可以使用 [Remi's RPM repository](https://link.zhihu.com/?target=http%3A//www.luoxiao123.cn/go/%3Furl%3Dhttp%3A//rpms.remirepo.net/)。

导入 [PHP RPM-GPG-KEY (remi)](https://link.zhihu.com/?target=http%3A//www.luoxiao123.cn/go/%3Furl%3Dhttp%3A//rpms.remirepo.net/RPM-GPG-KEY-remi)：

```bash
rpm --import http://rpms.remirepo.net/RPM-GPG-KEY-remi
```

安装 PHP RPM (remi) 包：

```bash
rpm -Uvh http://remi.mirrors.arminco.com/enterprise/remi-release-7.rpm
```

最后是 **Nginx** YUM 源，[Nginx 官网也给出了配置教程](https://link.zhihu.com/?target=http%3A//www.luoxiao123.cn/go/%3Furl%3Dhttp%3A//nginx.org/en/linux_packages.html)。

导入 [Nginx RPM-GPG-KEY](https://link.zhihu.com/?target=http%3A//www.luoxiao123.cn/go/%3Furl%3Dhttp%3A//nginx.org/keys/nginx_signing.key)：

```bash
rpm --import http://nginx.org/packages/keys/nginx_signing.key
```

安装 Nginx RPM 包：

```bash
rpm -Uvh http://nginx.org/packages/centos/7/noarch/RPMS/nginx-release-centos-7-0.el7.ngx.noarch.rpm
```

到目前为止，YUM 源已经安装好了 ，接着进行下一步的配置。

MySQL YUM 源默认是启用的 MySQL-5.6，PHP YUM 源默认都没有启用，Nginx YUM 源默认是启用的 Nginx-1.8。

定位到 /etc/yum.repos.d/，对 后缀为 .repo 的文件进行编辑，修改 enabled 为1 以启用。

启用 PHP-7.0 ：

1、修改 /etc/yum.repos.d/remi.repo，将 \[remi\] 和 \[remi-test\] 下面的 enabled=0 改为 enabled=1；

2、修改 /etc/yum.repos.d/remi-php70.repo，将 \[remi-php70\] 下面的 enabled=0 改为 enabled=1；

```bash
sed -i "/remi\/mirror/{n;s/enabled=0/enabled=1/g}" /etc/yum.repos.d/remi.repo
sed -i "/test\/mirror/{n;n;s/enabled=0/enabled=1/g}" /etc/yum.repos.d/remi.repo
sed -i "/php70\/mirror/{n;s/enabled=0/enabled=1/g}" /etc/yum.repos.d/remi-php70.repo
```

到这一步 YUM 配置就算完成了，清除并生成 YUM 缓存使之生效：

```bash
yum clean all
yum makecache
```

**安装 MySQL + PHP + Nginx + phpMyAdmin**

YUM 源已经配置好了，现在直接安装 MySQL + PHP + Nginx + phpMyAdmin：

```bash
yum install -y mysql-community-server nginx php php-bcmath php-fpm php-gd php-json php-mbstring php-mcrypt php-mysqlnd php-opcache php-pdo php-pdo_dblib php-pgsql php-recode php-snmp php-soap php-xml php-pecl-zip phpMyAdmin
```

注：上面安装的 php-\* 可以根据实际使用情况选择安装

安装完成后，进行下一步的环境配置，MySQL 配置文件在 /etc/my.cnf.d/，PHP 配置文件在 /etc/php-fpm.d/，Nginx 配置文件在 /etc/nginx/ ，phpMyAdmin 的配置文件在/etc/phpMyAdmin/。

**配置 MySQL**

MySQL 配置文件保持默认，运行一次安全配置即可。

启动 MySQL：

```bash
systemctl start mysqld.service
```

安全配置 MySQL：

设置 root 密码、删除匿名用户、禁止 root 远程登录、删除 test [数据库](https://link.zhihu.com/?target=http%3A//lib.csdn.net/base/mysql)、重新加载权限表，一路 Y 下去

```bash
mysql_secure_installation
```

**配置 PHP**

PHP 默认配置文件使用的是监听 9000 端口进行通信，针对小型单一、没有做负债均衡的服务器，可以使用 unix sock 方式通信。

使用 unix sock 方式需要修改 PHP 配置文件：

```bash
#更换监听方式
listen = /dev/shm/php-fpm-default.sock

#监听队列最大长度为不限
listen.backlog = -1
#指定监听用户和用户组（需存在）
listen.owner = www
listen.group = www
```

启动 PHP-FPM：

```bash
systemctl start php-fpm.service
```

**配置 Nginx**

让服务器默认访问显示为 400 提示页。

```bash
#新建名为 nginx-default.conf 的配置文件
touch /etc/nginx/conf.d/nginx-default.conf
#编辑配置文件
vi /etc/nginx/conf.d/nginx-default.conf
```

将以下信息输入到 nginx-default.conf

```nginx
server
{
    listen 80 default;
    return 400;
}
```

按下 Esc，输入 :x 保存并退出。

防火墙放行 HTTP 端口访问：

```bash
firewall-cmd --permanent --zone=public --add-service=http
firewall-cmd --reload
```

启动 Nginx：

```bash
systemctl start nginx.service
```

这时，在浏览器地址栏输入当前服务器 IP 就会看到一个 400 的提示页面了。

**_进阶！绑定域名+站点目录+保存日志+运行 PHP的配置文件：_**

```nginx
server
{
    listen 80; #监听80端口
    server_name default.com www.default.com; #绑定域名 default.com 和 www.default.com
    index index.html index.htm index.php; #设置首页文件，越前优先级越高
    charset utf-8; #设置网页编码

    root  /home/wwwroot/default; #设置站点根目录

    #运行 PHP
    location ~ .*\.php$
    {
        fastcgi_pass  127.0.0.1:9000 #默认使用9000端口和PHP通信
        #fastcgi_pass  unix:/dev/shm/php-fpm-default.sock; #使用 unix sock 和PHP通信
        fastcgi_index index.php;
        fastcgi_param DOCUMENT_ROOT  /home/wwwroot/default; #PHP 文档根目录
        fastcgi_param SCRIPT_FILENAME  /home/wwwroot/default$fastcgi_script_name; #PHP 脚本目录
        include fastcgi_params;
        try_files $uri = 404;
    }

    #设置文件过期时间
    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf|flv|mp3|wma)$
    {
        expires      30d;
    }

    #设置文件过期时间
    location ~ .*\.(js|css)$
    {
        expires      12h;
    }

    #设置文件访问权限
    location ~* /templates(/.*)\.(bak|html|htm|ini|old|php|tpl)$ {
        allow 127.0.0.1;
        deny all;
    }

    #设置文件访问权限
    location ~* \.(ftpquota|htaccess|htpasswd|asp|aspx|jsp|asa|mdb)?$ {
        deny all;
    }

    #保存日志
    access_log /var/log/nginx/default-access.log main;
    error_log /var/log/nginx/default-error.log crit;
}
```

**配置 phpMyAdmin**

```bash
# 编辑配置文件
vi etc/phpMyAdmin/config.inc.php
```

修改以下内容：

```php
$cfg['Servers'][$i]['host'] = 'localhost';
$cfg['Servers'][$i]['port'] = '3306';
$cfg['Servers'][$i]['socket'] = '/var/lib/mysql/mysql.sock';
$cfg['Servers'][$i]['connect_type'] = 'socket';
$cfg['Servers'][$i]['extension'] = 'mysqli';
$cfg['Servers'][$i]['auth_type'] = 'cookie';
$cfg['UploadDir'] = '/tmp';
$cfg['SaveDir'] = '/tmp';
```

如果Nginx使用的是上面的进阶代码，那么把 phpMyAdmin 的目录 复制到 /home/wwwroot/default/phpMyAdmin/ 下面，就可通过[http://default.com/phpMyAdmin](https://link.zhihu.com/?target=http%3A//default.com/phpMyAdmin) 访问了：

```bash
#复制 phpMyAdmin 目录
cp -a /usr/share/phpMyAdmin /home/wwwroot/default/

#替换连接形式为目录
rm -rf /home/wwwroot/default/phpMyAdmin/doc/html
cp -a /usr/share/doc/phpMyAdmin-<span class="pl-k">*</span>/html /home/wwwroot/default/phpMyAdmin
```

<a id="linux-game-server-running-on-boot"></a>

## Linux Game Server Running on Boot

## Using systemd

systemd is the default init system for most modern distros.

You need to create a service file in `/etc/systemd/system/`

Example `ts3server.service`:

```ini
[Unit]
Description=LinuxGSM Teamspeak3 Server
After=network-online.target
Wants=network-online.target

[Service]
Type=forking
User=ts3server
WorkingDirectory=/home/ts3server
ExecStart=/home/ts3server/ts3server start
ExecStop=/home/ts3server/ts3server stop
Restart=no
RemainAfterExit=yes   # Assume that the service is running after main process exits with code 0

[Install]
WantedBy=multi-user.target
```

Replace the user and paths to fit your setup.

You need to reload the systemd-daemon once to make it aware of the new service file:

```bash
systemctl daemon-reload
```

Now you can do:

```bash
sudo systemctl start ts3server    # Start the server
sudo systemctl stop ts3server   # Stop the server
sudo systemctl enable ts3server  # Enable start on boot
sudo systemctl disable ts3server # Disable start on boot
```

## Using Crontab

The crontab will allow you to create cronjobs that allow you to run a command on a set time or on boot. The below examples uses `@reboot` that will run a command on boot。

```bash
@reboot '/home/username/gameserver monitor' > /dev/null 2>&1
```

> note: Most admins will also have a timed monitor cronjob configured. If you do not want to have extra cronjobs the timed monitor will also start a server but with a timed delay.

## Using `monitor` command

After a reboot, any game server that has a "started" status will be started on boot. Servers that were manually stopped will remain stopped.

```bash
crontab -e
@reboot su - username -c '/home/username/gameserver monitor' > /dev/null 2>&1
```

To learn more, see [cronjobs](https://docs.linuxgsm.com/configuration/cronjobs) and [automated monitoring](https://docs.linuxgsm.com/commands/monitor#automated-monitoring).

## Using `start` command

Start a game server unconditionally, even if you manually stopped a server.

```bash
crontab -e
@reboot su - username -c '/home/username/gameserver start' > /dev/null 2>&1
```

To learn more, see [Start-Stop-Restart](https://docs.linuxgsm.com/commands/start-stop-restart)

## Using `rc.local`

rc.local is another method to run scripts on boot. Any commands added to the rc.local file will run on boot.

```bash
nano /etc/rc.local
su - username -c '/home/username/gameserver start'
```

<a id="using-mono-archisteamfarm-to-hang-card-under-linuxcentos7"></a>

## Linux(CentOS 7)下使用mono+ArchiSteamFarm挂卡

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

<a id="install-entware-on-synology-nas"></a>

## Install entware repository on Synology NAS

## Introduction

[ARM & intel based devices](http://forum.synology.com/wiki/index.php/What_kind_of_CPU_does_my_NAS_have) are supported. DSM version must be 3.2 or higher. Use armv5 installer for Marvell Kirkwood mv6282 cpu, you can use armv7 installer for newer ARM cpu's. Although armv7 repo was compiled with cortex-a9 optimization it was successfully tested on Marvell Armada XP based NAS.

## Deploying Entware-ng

### 1. Create a folder on your hdd (outside rootfs)

```bash
mkdir -p /volume1/@entware-ng/opt
```

Make sure that `/opt` folder is empty (Optware is not installed), we will **remove** `/opt` folder with its contents at this step.

### 2. Remove `/opt` and create a symlink

```bash
rm -rf /opt
ln -sf /volume1/@entware-ng/opt /opt
```

### 3. Run install script

- for ARMv5

```bash
wget -O - http://pkg.entware.net/binaries/armv5/installer/entware_install.sh | /bin/sh
```

- for ARMv7

```bash
wget -O - http://pkg.entware.net/binaries/armv7/installer/entware_install.sh | /bin/sh
```

- for x86-32

```bash
wget -O - http://pkg.entware.net/binaries/x86-32/installer/entware_install.sh | /bin/sh
```

- for x86-64

```bash
wget -O - http://pkg.entware.net/binaries/x86-64/installer/entware_install.sh | /bin/sh
```

- for MIPS

```bash
wget -O - http://pkg.entware.net/binaries/mipsel/installer/installer.sh | /bin/sh
```

### 4. Edit `/etc/rc.local` file

Edit `/etc/rc.local` file with a text editor and insert following strings:

```bash
/bin/ln -sf /volume1/@entware-ng/opt /opt
/opt/etc/init.d/rc.unslung start
```

at the end of this file, but before `exit 0`. The last line ensures that Entware services will be started at boot.

> Note: As of DSM 6.0, `/etc/rc.local` is no longer executed as part of the boot process. Instead you have two options.

**Option 1**: Documented in the [Synology DSM6.0 3rd-Party Package Developer Guide](https://developer.synology.com/download/developer-guide.pdf), custom startup scripts should be placed in `/usr/local/etc/rc.d`.

Example: Create `/usr/local/etc/rc.d/entware-startup.sh`:

```bash
#!/bin/sh

case $1 in
    start)
    mkdir -p /opt
    mount -o bind /volume1/@entware-ng/opt /opt
    /opt/etc/init.d/rc.unslung start
    ;;
    stop)
    ;;
esac
```

**Option 2**: Make an executable script and use the Task Scheduler to create a triggered task that runs on boot. The script would contain:

```bash
#!/bin/sh

mkdir -p /opt
mount -o bind /volume1/@entware-ng/opt /opt
/opt/etc/init.d/rc.unslung start
```

### 5. Add the following line in the end of `/etc/profile` file

```bash
. /opt/etc/profile
```

It will add `/opt/bin` and `/opt/sbin` to the PATH variable for interactive login.

### 6. Reboot your NAS

After rebooting, you can use opkg commands.

---

via [Entware Wiki - Install on Synology NAS](https://github.com/Entware/Entware-ng/wiki/Install-on-Synology-NAS)

<a id="using-wifi-adapter-unas40"></a>

## 在万由U-NAS 4.0中使用无线网卡

U-NAS 4.0 使用了 debian 9，内核版本提升到 4.9.0-8-amd64，支持的硬件更多，以前 3.0 的时候驱动很难编译过去（不知道系统内少了什么组件）。这里找到一块使用 MT7601u 的不知名无线网卡插在 nas 上面配置。

## SSH 连接

获取 root 权限：

> （root 密码 yutech，建议 adduser 创建个用户然后 visudo 写到 sudo 里面方便后续操作，自带 admin 账户连 /home 主目录都没有）

## 安装 Network-Manager

```bash
sudo apt install network-manager
```

## 插入无线网卡

输入 `lsusb` 查看型号：

此网卡在 Linux 内核中自带驱动，只需要下载闭源 firmware 即可。

[点击此处下载闭源 firmware](https://github.com/candlumine/UsingDebian)

提取 mt7601u.bin 文件，放到 nas 的 `/lib/firmware` 下面（不知官方为何去掉这个目录）。

```bash
sudo mkdir /lib/firmware
sudo chmod 777 /lib/firmware
sudo cp mt7601u.bin /lib/firmware
```

## 配置 NetworkManager

```bash
sudo nano /etc/NetworkManager/NetworkManager.conf
```

文档末尾写入如下内容：

```ini
[device]
wifi.scan-rand-mac-address=no
```

最后 `sudo reboot` 重启后输入 `sudo nmtui` 配置无线网络。

按提示输入密码，左侧出现 * 号即配置成功。

`ifconfig` 正常获取 ip，已经可以联网。

网页控制台同样显示，正常出现 IP 即可。

<a id="use-android-phone-make-home-server"></a>

## 使用吃灰的Android手机代替第三方开发板等制作简易家庭服务器

准备工作：通过 Play Store 或 apkpure 等官方商店安装 Linux Deploy APP，启动后点击右下角箭头图标，进行如下设置。本次以安装 Fedora 25 为例，设备为古董的 MSM8926+1GB RAM。

![](images/v2-2d7ff6e2ff8e00debde53b95c44f88c6_hd.jpg)

![](images/v2-3d82e6bf44a4c4ce12cb8d212e5e73e3_hd.jpg)

Image size 指安装盘 img 文件大小，合理分配位置以及容量，无图形界面的 Linux 安装一般需要 1.5GB 就足够了，采用 chroot 形式。文件系统建议使用非日志形式的 ext2，减少对存储介质的损伤。源镜像用国内服务器即可，填入：

```
http://mirrors.ustc.edu.cn
```

注意各发行版的地址形式不同，Arch Linux 一般为：

```
http://mirrors.ustc.edu.cn/archlinuxarm
```

另外注意发行版的架构，ARM 32 位机型选择 armhfp 或 armv7，ARM 64 位选择 armv8 或 aarch64 即可，Intel x86 设备选择 i686 或 x86_64 之类。

GUI 无特殊需求不建议安装，ssh 端口建议修改一下，此处改为 2222，以后本机 ssh 地址为 `127.0.0.1:2222`，用户名和密码已输入。

![](images/v2-f8353db548e5a0c02eb6e8d735689cd7_hd.jpg)

![](images/v2-6c87f876b1a99426c326a47978bcb661_hd.jpg)

返回到主页面，右上角点击 install 开始安装，如果没有错误便开始配置一系列软件包，安装完会有提示。等待一些时间。

安装完成后点击 start 启动，设备连接到无线局域网，用手机端或 PC 端 SSH 工具都可以访问（当然本机也可以），IP 就是显示那个。

![](images/v2-150443bed62c4c47a1fac584dacfa55f_hd.jpg)

![](images/v2-33cb1abc1234c71749c22048726391c5_hd.jpg)

另外注意要设置保持唤醒，否则 ARM 设备在灭屏状态下 CPU 会休眠无法运行，Linux Deploy APP 也不能放到一键清理中：

![](images/v2-1e6635fe531eff83aaa5c211cb227123_hd.jpg)

下面用 PC 上面的 ssh 工具登录，即可当做普通的 Linux 设备使用。

有些 Linux 命令可能不全需要手动补充，例如 ifconfig 需要 net-tools 软件包，free、ps 等需要 procps-ng 软件包，wget、gcc、git、perl、python 等环境也需要安装。

此处识别出了 Qualcomm MSM8926：

![](images/v2-42b70e1700cfb3ea6f2479fcc6c0b89e_hd.jpg)

下面测试实例为安装 nginx web server，通过 dnf 安装：

![](images/v2-0835a2400b43f60bfe3fb4b598101e6a_hd.jpg)

磁盘占用情况，也是不多的。

注意 Android 手机的 chroot 环境下无法运行 systemctl、service 等服务管理命令，只可直接运行 nginx 可执行文件，需将参数写入开机运行脚本：

![](images/v2-a2a704ab17fb6877c85ca7620aa3c819_hd.jpg)

启动 web 服务后在浏览器输入 Android 的设备 IP，显示以下页面表示成功。以后配置所有支持 ARM 编译的 Linux 软件都可以了，以现在手机性能运行一个小型网站不是问题。

![](images/v2-424661bd494d96d154c1857787a8e032_hd.jpg)

<a id="remove_aliyun_tencentyun_monitoring_processes"></a>

## 卸载阿里/腾讯云Linux主机监控进程，屏蔽云盾功能

## 卸载阿里云盾监控

```bash
wget http://update.aegis.aliyun.com/download/uninstall.sh
chmod +x uninstall.sh
sudo ./uninstall.sh
```

```bash
wget http://update.aegis.aliyun.com/download/quartz_uninstall.sh
chmod +x quartz_uninstall.sh
sudo ./quartz_uninstall.sh
```

### 删除残留

```bash
sudo pkill aliyun-service
sudo rm -fr /etc/init.d/agentwatch /usr/sbin/aliyun-service
sudo rm -rf /usr/local/aegis*
```

### 屏蔽云盾 IP

用包过滤屏蔽如下 IP：

```bash
iptables -I INPUT -s 140.205.201.0/28 -j DROP
iptables -I INPUT -s 140.205.201.16/29 -j DROP
iptables -I INPUT -s 140.205.201.32/28 -j DROP
iptables -I INPUT -s 140.205.225.192/29 -j DROP
iptables -I INPUT -s 140.205.225.200/30 -j DROP
iptables -I INPUT -s 140.205.225.184/29 -j DROP
iptables -I INPUT -s 140.205.225.183/32 -j DROP
iptables -I INPUT -s 140.205.225.206/32 -j DROP
iptables -I INPUT -s 140.205.225.205/32 -j DROP
```

### 卸载云监控 Java 版本插件

```bash
sudo /usr/local/cloudmonitor/wrapper/bin/cloudmonitor.sh stop
sudo /usr/local/cloudmonitor/wrapper/bin/cloudmonitor.sh remove
sudo rm -rf /usr/local/cloudmonitor
```

### 阿里云监控插件卸载 Go 语言版本

烦人的插件，占内存。

```bash
/usr/local/cloudmonitor/CmsGoAgent.linux-amd64 stop
/usr/local/cloudmonitor/CmsGoAgent.linux-amd64 uninstall
rm -rf /usr/local/cloudmonitor
```

### 卸载云助手守护进程（Linux 实例）

云助手守护进程用于监控云助手客户端的资源消耗情况，上报云助手客户端的运行状态，以及当云助手客户端崩溃时重启客户端。您在卸载云助手客户端前，需要先卸载云助手守护进程。

> **说明** 目前云助手守护进程仅支持 Linux 操作系统。

1. 远程连接 Linux 实例。

2. 停止云助手守护进程：

```bash
/usr/local/share/assist-daemon/assist_daemon --stop
```

> **说明** `/usr/local/share/assist-daemon/assist_daemon` 为云助手守护进程的默认路径。

3. 卸载云助手守护进程：

```bash
/usr/local/share/assist-daemon/assist_daemon --delete
```

4. 删除云助手守护进程目录：

```bash
rm -rf /usr/local/share/assist-daemon
```

### 卸载云助手客户端（Linux 实例）

1. 远程连接 Linux 实例。

2. 卸载云助手守护进程。

3. 停止云助手客户端。

4. 运行以下命令卸载云助手客户端：

- rpm 包管理：

```bash
sudo rpm -qa | grep aliyun_assist | xargs sudo rpm -e
```

- deb 包管理：

```bash
sudo dpkg -l | grep aliyun_assist
sudo dpkg -r 云助手deb包名称
```

- 删除云助手客户端目录：

```bash
rm -rf /usr/local/share/aliyun-assist
```

---

## 卸载腾讯云盾监控

```bash
sudo systemctl stop tat_agent
sudo systemctl disable tat_agent
sudo /usr/local/qcloud/YunJing/uninst.sh
sudo /usr/local/qcloud/stargate/admin/uninstall.sh
sudo /usr/local/qcloud/monitor/barad/admin/uninstall.sh
```

### 删除残留

```bash
sudo rm -f /etc/systemd/system/tat_agent.service
sudo rm -rf /usr/local/qcloud
sudo rm -rf /usr/local/sa
sudo rm -rf /usr/local/agenttools
sudo rm -rf /tmp/tat_agent
```

编辑 `/etc/rc.d/rc.local` 去掉下面几行，然后 reboot 重启：

```bash
/usr/local/sa/agent/secu-tcs-agent-mon-safe.sh > /dev/null 2>&1
/usr/local/qcloud/irq/net_smp_affinity.sh >/tmp/net_affinity.log 2>&1
/usr/local/qcloud/cpuidle/cpuidle_support.sh &> /tmp/cpuidle_support.log
/usr/local/qcloud/rps/set_rps.sh >/tmp/setRps.log 2>&1
/usr/local/qcloud/irq/virtio_blk_smp_affinity.sh > /tmp/virtio_blk_affinity.log 2>&1
/usr/local/qcloud/gpu/nv_gpu_conf.sh >/tmp/nv_gpu_conf.log 2>&1
```

## 参考资料

- [卸载阿里云盾（安骑士）监控&屏蔽云盾IP](https://github.com/ssrpanel/SSRPanel/wiki/%E5%8D%B8%E8%BD%BD%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%BE%EF%BC%88%E5%AE%89%E9%AA%91%E5%A3%AB%EF%BC%89%E7%9B%91%E6%8E%A7&%E5%B1%8F%E8%94%BD%E4%BA%91%E7%9B%BEIP)
- [卸载 Agent](https://www.alibabacloud.com/help/zh/doc-detail/31777.htm)
- [云监控 Java 版本插件安装](https://help.aliyun.com/knowledge_detail/38859.html)
- [如何优雅地完整的一键卸载腾讯云监控](https://www.xjh.me/3687.html/amp)
