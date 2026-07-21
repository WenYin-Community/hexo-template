---
title: "在万由U-NAS 4.0中使用无线网卡"
date: 2019-03-17
categories:
  - "硬件设备"
tags: 
  - "nas"
---

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
