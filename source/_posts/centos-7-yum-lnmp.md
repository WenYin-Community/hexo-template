---
title: "CentOS 7 YUM 10分钟快速安装 LNMP 环境"
date: 2018-02-28
categories:
  - "Linux"
tags:
  - "linux"
  - "lnmp"
  - "centos"
  - "yum"
  - "package-management"
---

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
