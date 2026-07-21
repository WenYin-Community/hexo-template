---
title: "Fedora/CentOS下命令行配置Shadowsocks全局代理"
date: 2017-03-17
categories:
  - "网络与代理"
tags: 
  - "linux"
  - "shadowsocks"
  - "windows-server"
  - "代理"
  - "全局"
coverImage: "TIM图片20170317215807.png"
---

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
