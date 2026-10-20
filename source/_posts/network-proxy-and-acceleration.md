---
title: "网络、代理与加速合集"
author: "学姐大人"
date: 2026-02-19
categories:
  - "开发工具"
tags:
  - "network"
  - "proxy"
  - "linux"
  - "ssh"
  - "firewall"
---

命令行代理、GitHub 加速、防火墙与 SSH 配置，以及两种把内核网络栈调快的做法（BBR）。

<!-- more -->

<a id="powershell-command-line-proxy"></a>

## PowerShell 配置命令行代理

我们将通过创建 PowerShell 函数来实现快速开启和关闭代理的功能。
### **步骤 1：找到并编辑 PowerShell [配置文件](https://zhida.zhihu.com/search?content_id=252477125&content_type=Article&match_order=1&q=%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6&zhida_source=entity)**

首先，我们需要找到 PowerShell 的配置文件。如果你还没有创建过，可以用以下命令创建：

```powershell
if (!(Test-Path -Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}
notepad $PROFILE
```

这会打开你的 PowerShell 配置文件。配置文件的默认路径通常是： `C:\Users\你的用户名\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`
### **步骤 2：添加代理函数**

在打开的配置文件中，添加以下函数：

```powershell
function proxy {
    $env:http_proxy = "http://127.0.0.1:7890"
    $env:https_proxy = "http://127.0.0.1:7890"
    [System.Net.WebRequest]::DefaultWebProxy = New-Object System.Net.WebProxy("http://127.0.0.1:10809")
    Write-Host "Proxy enabled: http://127.0.0.1:10809" -ForegroundColor Green
}

function unproxy {
    $env:http_proxy = $null
    $env:https_proxy = $null
    [System.Net.WebRequest]::DefaultWebProxy = $null
    Write-Host "Proxy disabled" -ForegroundColor Yellow
}

function check-proxy {
    if ($env:http_proxy -or $env:https_proxy) {
        Write-Host "Current proxy settings:" -ForegroundColor Cyan
        Write-Host "HTTP Proxy: $env:http_proxy"
        Write-Host "HTTPS Proxy: $env:https_proxy"
    } else {
        Write-Host "No proxy is currently set." -ForegroundColor Cyan
    }
}
```
### **步骤 3：保存并重新加载配置**

保存文件，然后重新启动 PowerShell 或运行 `. $PROFILE` 来重新加载配置文件。
## **如何使用**

现在，你可以在 PowerShell 中使用以下命令：

- 输入 `proxy` 来启用代理
- 输入 `unproxy` 来禁用代理
- 输入 `check-proxy` 来查看当前的[代理设置](https://zhida.zhihu.com/search?content_id=252477125&content_type=Article&match_order=1&q=%E4%BB%A3%E7%90%86%E8%AE%BE%E7%BD%AE&zhida_source=entity)
## **注意事项**

1. 这个设置只影响当前的 PowerShell 会话，不会影响其他应用程序或系统级的代理设置。
2. 如果你的代理地址和端口不是 `127.0.0.1:7890`，请相应地修改函数中的 URL。
3. 如果你的代理需要认证，你需要修改函数来包含用户名和密码。

## bash/zsh:

```
proxy
  proxy () {
  export http_proxy="http://127.0.0.1:7890"
  export https_proxy=$http_proxy
  export socks5_proxy="socks5://127.0.0.1:7890"
  echo "HTTP Proxy on"
}

noproxy
  noproxy () {
  unset http_proxy
  unset https_proxy
  echo "HTTP Proxy off"
}
```

<a id="curl-query-wan-ip"></a>

## cURL 查询公网出口 IP

## 几个网址

- [ip-api.com](http://ip-api.com/json/)（推荐，速度快）
- [ipecho.net](https://ipecho.net/plain)（推荐）
- [百度](https://qifu-api.baidubce.com/ip/local/geo/v1/district)（效果也不错）
- [ip.cn](http://ip.cn/)（不支持 cURL）
- [ipinfo.io](http://ipinfo.io/)
- [cip.cc](http://cip.cc/)
- [ifconfig.me](http://ifconfig.me/)
- [myip.ipip.net](http://myip.ipip.net/)

## 样例

### ip-api.com

```bash
curl 'http://ip-api.com/json/?lang=zh-CN'
```

返回结果：

```json
{
  "status": "success",
  "country": "德国",
  "countryCode": "DE",
  "region": "HE",
  "regionName": "Hesse",
  "city": "法兰克福",
  "zip": "60313",
  "lat": 50.1188,
  "lon": 8.6843,
  "timezone": "Europe/Berlin",
  "isp": "Linode, LLC",
  "org": "Linode, LLC",
  "as": "AS63949 Linode, LLC",
  "query": "192.46.239.172"
}
```

---

### ipecho.net

```bash
curl ipecho.net/plain
```

返回结果：

```
168.63.213.70
```

---

### ipinfo.io

```bash
curl ipinfo.io
```

返回结果：

```json
{
  "ip": "111.30.233.219",
  "city": "Tianjin",
  "region": "Tianjin",
  "country": "CN",
  "loc": "39.1422,117.1767",
  "org": "AS38019 tianjin Mobile Communication Company Limited",
  "timezone": "Asia/Shanghai",
  "readme": "https://ipinfo.io/missingauth"
}
```

---

### cip.cc

```bash
curl cip.cc
```

返回结果：

```
IP  : 111.30.233.219
地址  : 中国  天津
运营商 : 移动

数据二 : 天津市 | 移动

数据三 : 中国天津天津 | 移动

URL : http://www.cip.cc/111.30.233.219
```

---

### myip.ipip.net

```bash
curl myip.ipip.net
```

返回结果：

```
当前 IP：111.30.233.219  来自于：中国 天津 天津  移动
```

---

### ifconfig.me

```bash
curl ifconfig.me
```

```
111.30.233.219
```

---

### members.3322.org/dyndns/getip

```bash
curl members.3322.org/dyndns/getip
```

```
111.30.233.219
```

---

作者：舌尖上的大胖
链接：https://www.jianshu.com/p/09363560a833

<a id="github-proxy"></a>

## GitHub Proxy

### [https://git.951959483.xyz/](https://git.951959483.xyz/)

### 终端命令行

支持终端命令行 git clone、wget、curl 等工具下载。支持 raw.githubusercontent.com、gist.github.com、gist.githubusercontent.com 文件下载。

> **注意：**不支持 SSH Key 方式 git clone 下载。

---

## git clone

```bash
git clone https://git.951959483.xyz/https://github.com/stilleshan/ServerStatus
```

## git clone 私有仓库

Clone 私有仓库需要在 [Personal access tokens](https://github.com/settings/tokens) 申请 Token 配合使用：

```bash
git clone https://user:your_token@git.951959483.xyz/https://github.com/your_name/your_private_repo
```

## wget & curl

```bash
wget https://git.951959483.xyz/https://github.com/stilleshan/ServerStatus/archive/master.zip
wget https://git.951959483.xyz/https://raw.githubusercontent.com/stilleshan/ServerStatus/master/Dockerfile
curl -O https://git.951959483.xyz/https://github.com/stilleshan/ServerStatus/archive/master.zip
curl -O https://git.951959483.xyz/https://raw.githubusercontent.com/stilleshan/ServerStatus/master/Dockerfile
```

## 首页下载

在本页地址栏输入合规链接（参考以下链接）点击下载按钮，支持 raw.githubusercontent.com、gist.github.com、gist.githubusercontent.com 文件下载。

---

## Raw 文件

```
https://raw.githubusercontent.com/stilleshan/ServerStatus/master/Dockerfile
```

## 分支源码

```
https://github.com/stilleshan/ServerStatus/archive/master.zip
```

## Releases 源码

```
https://github.com/stilleshan/ServerStatus/archive/v1.0.tar.gz
```

## Releases 文件

```
https://github.com/fatedier/frp/releases/download/v0.33.0/frp_0.33.0_linux_amd64.tar.gz
```

<a id="githubusercontent-github-fast-speed"></a>

## githubusercontent、github加速镜像

## 加速地址一览

- **[fastgit.org](https://hub.fastgit.org/)**：[https://doc.fastgit.org/](https://doc.fastgit.org/)
- **[cnpmjs.org](http://cnpmjs.org)**：[https://github.com.cnpmjs.org/](https://github.com.cnpmjs.org/)
- **[gitclone.com](http://gitclone.com)**：[https://gitclone.com/](https://gitclone.com/)
- **gitee**：[https://gitee.com/mirrors](https://gitee.com/mirrors)
- GitHub 文件加速：https://gh.api.99988866.xyz/
- Github 仓库加速：https://github.zhlh6.cn/
- Github 仓库加速：http://toolwa.com/github/

## 加速 clone

```bash
# 方法一：手动替换地址
# 原地址
git clone https://github.com/kubernetes/kubernetes.git
# 改为
git clone https://github.com.cnpmjs.org/kubernetes/kubernetes.git
# 或者
git clone https://hub.fastgit.org/kubernetes/kubernetes.git
# 或者
git clone https://gitclone.com/github.com/kubernetes/kubernetes.git

# 方法二：配置 git 自动替换
git config --global url."https://hub.fastgit.org".insteadOf https://github.com
# 测试
git clone https://github.com/kubernetes/kubernetes.git
# 查看 git 配置信息
git config --global --list
# 取消设置
git config --global --unset url.https://github.com/.insteadof
```

## 加速 release

```bash
# 原地址
wget https://github.com/goharbor/harbor/releases/download/v2.0.2/harbor-offline-installer-v2.0.2.tgz
# 加速下载方法一
wget https://download.fastgit.org/goharbor/harbor/releases/download/v2.0.2/harbor-offline-installer-v2.0.2.tgz
# 加速下载方法二
wget https://hub.fastgit.org/goharbor/harbor/releases/download/v2.0.2/harbor-offline-installer-v2.0.2.tgz
```

## 加速 raw

```bash
# 原地址
wget https://raw.githubusercontent.com/kubernetes/kubernetes/master/README.md
# 加速下载方法一
wget https://raw.staticdn.net/kubernetes/kubernetes/master/README.md
# 加速下载方法二
wget https://raw.fastgit.org/kubernetes/kubernetes/master/README.md
```

<a id="fedora-centos-configure-shadowsocks-on-commandline-mode"></a>

## Fedora/CentOS下命令行配置Shadowsocks全局代理

输入以下内容，创建 Shadowsocks 配置文件 `/etc/shadowsocks.json`：

```json
{
    "server": "********",
    "server_port": ****,
    "password": "******",
    "method": "aes-256-cfb",
    "remarks": "",
    "auth": false,
    "timeout": 5
}
```

使用以下命令启动服务：

```bash
sudo sslocal -c /etc/shadowsocks.json &
```

下面开始配置 privoxy 做全局代理：

```bash
sudo vi /etc/privoxy/config
```

找到并修改以下配置：

```ini
listen-address 127.0.0.1:8118
```

去掉注释，保证端口 8118 不与系统变量冲突即可，可自由设定。

找到并修改：

```ini
forward-socks5t / 127.0.0.1:1080 .
```

去掉注释，要求和 ss 端口号相同，注意最后一位英文句号不可丢！

保存并退出即可。

执行：

```bash
sudo privoxy /etc/privoxy/config
```

无报错则正确启动。

Shell 下使用 http 代理需执行：

```bash
export http_proxy=http://127.0.0.1:8118
export ftp_proxy=http://127.0.0.1:8118
```

运行 `w3m www.google.com` 可访问则说明代理已配置成功。

## Fedora & RHEL

Supported distributions:

- Recent Fedora versions (until EOL)
- RHEL 6, 7 and derivatives (including CentOS, Scientific Linux)

### Build from source with CentOS

If you are using CentOS 7, you need to install these prerequirements to build from source code:

```bash
yum install epel-release -y
yum install gcc gettext autoconf libtool automake make pcre-devel asciidoc xmlto c-ares-devel libev-devel libsodium-devel mbedtls-devel -y
```

### ArchLinux / Manjaro

```bash
bash <(curl -sL https://raw.githubusercontent.com/hijkpw/scripts/master/centos_install_ss.sh)
```

<a id="openvz-with-google-bbr"></a>

## OpenVZ 平台 Google BBR 一键安装脚本

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

<a id="enable-kernel-bbr"></a>

## 内核开启BBR方法

## 1. 修改系统变量

```bash
sudo su
echo "net.core.default_qdisc=fq" >> /etc/sysctl.conf
echo "net.ipv4.tcp_congestion_control=bbr" >> /etc/sysctl.conf
```

## 2. 保存生效

```bash
sysctl -p
```

## 3. 查看内核是否已开启 BBR

```bash
sysctl net.ipv4.tcp_available_congestion_control
```

显示以下即已开启：

```
# sysctl net.ipv4.tcp_available_congestion_control
net.ipv4.tcp_available_congestion_control = bbr cubic reno
```

## 4. 查看 BBR 是否启动

```bash
lsmod | grep bbr
```

显示以下即启动成功：

```
# lsmod | grep bbr
tcp_bbr 20480 14
```

<a id="linux-configure-firewalld"></a>

## Linux下firewallD简单上手

| 导读 | FirewallD 是 [CentOS](https://www.linuxprobe.com/ "centos") 7 服务器上默认可用的防火墙管理工具。基本上，它是 iptables 的封装，有图形配置工具 firewall-config 和命令行工具 firewall-cmd。使用 iptables 服务，每次改动都要求刷新旧规则，并且从 /etc/sysconfig/iptables 读取新规则，然而 firewalld 只应用改动了的不同部分。 |
| --- | --- |

FirewallD 使用服务（service） 和区域（zone）来代替 iptables 的规则（rule）和链（chain）。

默认情况下，有以下的区域（zone）可用：

1. **drop** – 丢弃所有传入的网络数据包并且无回应，只有传出网络连接可用。
2. **block** — 拒绝所有传入网络数据包并回应一条主机禁止的 ICMP 消息，只有传出网络连接可用。
3. **public** — 只接受被选择的传入网络连接，用于公共区域。
4. **external** — 用于启用了地址伪装的外部网络，只接受选定的传入网络连接。
5. **dmz** — DMZ 隔离区，外部受限地访问内部网络，只接受选定的传入网络连接。
6. **work** — 对于处在你工作区域内的计算机，只接受被选择的传入网络连接。
7. **home** — 对于处在你家庭区域内的计算机，只接受被选择的传入网络连接。
8. **internal** — 对于处在你内部网络的计算机，只接受被选择的传入网络连接。
9. **trusted** — 所有网络连接都接受。

要列出所有可用的区域，运行：

```bash
firewall-cmd --get-zones
```

列出默认的区域：

```bash
firewall-cmd --get-default-zone
```

改变默认的区域：

```bash
firewall-cmd --set-default-zone=dmz
firewall-cmd --get-default-zone
```

## FirewallD 服务

FirewallD 服务使用 XML 配置文件，记录了 firewalld 服务信息。

列出所有可用的服务：

```bash
firewall-cmd --get-services
```

XML 配置文件存储在 `/usr/lib/firewalld/services/` 和 `/etc/firewalld/services/` 目录下。

## 用 FirewallD 配置防火墙

作为一个例子，假设你正在运行一个 web 服务器，SSH 服务端口为 7022，以及邮件服务，你可以利用 FirewallD 这样配置你的服务器：

首先设置默认区为 dmz：

```bash
firewall-cmd --set-default-zone=dmz
firewall-cmd --get-default-zone
```

为 dmz 区添加持久性的 HTTP 和 HTTPS 规则：

```bash
firewall-cmd --zone=dmz --add-service=http --permanent
firewall-cmd --zone=dmz --add-service=https --permanent
```

开启端口 25 (SMTP) 和端口 465 (SMTPS)：

```bash
firewall-cmd --zone=dmz --add-service=smtp --permanent
firewall-cmd --zone=dmz --add-service=smtps --permanent
```

开启 IMAP、IMAPS、POP3 和 POP3S 端口：

```bash
firewall-cmd --zone=dmz --add-service=imap --permanent
firewall-cmd --zone=dmz --add-service=imaps --permanent
firewall-cmd --zone=dmz --add-service=pop3 --permanent
firewall-cmd --zone=dmz --add-service=pop3s --permanent
```

因为将 SSH 端口改到了 7022，所以要移除 ssh 服务（端口 22），开启端口 7022：

```bash
firewall-cmd --remove-service=ssh --permanent
firewall-cmd --add-port=7022/tcp --permanent
```

要应用这些更改，我们需要重新加载防火墙：

```bash
firewall-cmd --reload
```

最后可以列出这些规则：

```bash
firewall-cmd --list-all
```

---

via: [Set Up and Configure a Firewall with FirewallD on CentOS 7](https://www.rosehosting.com/blog/set-up-and-configure-a-firewall-with-firewalld-on-centos-7/)

译者简介：

[Locez](http://locez.com/) 是一个喜欢技术，喜欢折腾的 Linuxer，靠着对 Linux 的兴趣自学了很多 Linux 相关的知识，并且志在于为 Linux 在中国普及出一份力。

作者：[rosehosting.com](https://www.rosehosting.com/blog/set-up-and-configure-a-firewall-with-firewalld-on-centos-7/) 译者：[Locez](https://github.com/locez) 校对：[jasminepeng](https://github.com/jasminepeng)

本文由 [LCTT](https://github.com/LCTT/TranslateProject) 原创编译，[Linux中国](https://linux.cn/) 荣誉推出

<a id="allow-ssh-port-on-selinux"></a>

## Allow ssh port on SELinux

## Step 3: Allow new SSH port on SELinux

The default port labelled for SSH is 22.

```bash
semanage port -l | grep ssh
```

输出：

```
ssh_port_t                     tcp      22
```

If you want to allow **sshd** to bind to network port configured, then you need to modify the port type to **ssh_port_t**.

```bash
sudo semanage port -a -t ssh_port_t -p tcp 2200
```

Confirm that the new port has been added to list of allowed ports for ssh:

```bash
semanage port -l | grep ssh
```

输出：

```
ssh_port_t                     tcp      2200, 22
```

[![](images/HAGKQL4V1F3W7U59_OUL-640x121.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/07/HAGKQL4V1F3W7U59_OUL.png)

## Step 4: Open SSH port on Firewalld

It is always recommended to keep the Firewall service running and only allow trusted services.

```bash
sudo firewall-cmd --add-port=2200/tcp --permanent
sudo firewall-cmd --reload
```

<a id="set-ssh-key-login"></a>

## 设置 SSH 通过密钥登录

我们一般使用 PuTTY 等 SSH 客户端来远程管理 Linux 服务器。但是，一般的密码方式登录，容易有密码被暴力破解的问题。所以，一般我们会将 SSH 的端口设置为默认的 22 以外的端口，或者禁用 root 账户登录。其实，有一个更好的办法来保证安全，而且让你可以放心地用 root 账户从远程登录——那就是通过密钥方式登录。

密钥形式登录的原理是：利用密钥生成器制作一对密钥——一只公钥和一只私钥。将公钥添加到服务器的某个账户上，然后在客户端利用私钥即可完成认证并登录。这样一来，没有私钥，任何人都无法通过 SSH 暴力破解你的密码来远程登录到系统。此外，如果将公钥复制到其他账户甚至主机，利用私钥也可以登录。

下面来讲解如何在 Linux 服务器上制作密钥对，将公钥添加给账户，设置 SSH，最后通过客户端登录。

## 1. 制作密钥对

首先在服务器上制作密钥对。首先用密码登录到你打算使用密钥登录的账户，然后执行以下命令：

```bash
ssh-keygen   <== 建立密钥对
```

运行输出示例：

```
Generating public/private rsa key pair.
Enter file in which to save the key (/root/.ssh/id_rsa): <== 按 Enter
Created directory '/root/.ssh'.
Enter passphrase (empty for no passphrase): <== 输入密钥锁码，或直接按 Enter 留空
Enter same passphrase again: <== 再输入一遍密钥锁码
Your identification has been saved in /root/.ssh/id_rsa. <== 私钥
Your public key has been saved in /root/.ssh/id_rsa.pub. <== 公钥
The key fingerprint is:
0f:d3:e7:1a:1c:bd:5c:03:f1:19:f1:22:df:9b:cc:08 root@host
```

密钥锁码在使用私钥时必须输入，这样就可以保护私钥不被盗用。当然，也可以留空，实现无密码登录。

现在，在 root 用户的家目录中生成了一个 .ssh 的隐藏目录，内含两个密钥文件。id_rsa 为私钥，id_rsa.pub 为公钥。

## 2. 在服务器上安装公钥

键入以下命令，在服务器上安装公钥：

```bash
cd .ssh
cat id_rsa.pub >> authorized_keys
```

如此便完成了公钥的安装。为了确保连接成功，请保证以下文件权限正确：

```bash
chmod 600 authorized_keys
chmod 700 ~/.ssh
```

## 3. 设置 SSH，打开密钥登录功能

编辑 `/etc/ssh/sshd_config` 文件，进行如下设置：

```bash
RSAAuthentication yes
PubkeyAuthentication yes
```

另外，请留意 root 用户能否通过 SSH 登录：

```bash
PermitRootLogin yes
```

当你完成全部设置，并以密钥方式登录成功后，再禁用密码登录：

```bash
PasswordAuthentication no
```

最后，重启 SSH 服务：

```bash
sudo systemctl restart sshd
```
