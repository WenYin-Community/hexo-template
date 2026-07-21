---
title: "KDE Connect 故障修复"
date: 2023-06-25
categories:
  - "Linux"
coverImage: "Screenshot_20230629_200122.png"
tags:
  - "kde"
---

[![](images/Screenshot_20230629_200122-640x480.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/06/Screenshot_20230629_200122.png)

## 故障处理

### 我有两个设备运行 KDE Connect 但他们不能发现对方

**KDE Connect** 在 1714-1764 内的动态端口使用 UDP 和 TCP 协议。因此，如果你在防火墙后面，确保为 TCP 和 UDP 打开这个端口范围。否则，请确保你的网络没有阻挡 UDP 广播数据包。

检查进程是否在网络上监听：

```bash
sudo netstat -tunelp | grep -i kdeconnect
```

端口是否开放/阻止？

```bash
netcat -z -v <your-phones-ip> 1714-1764
```

示例输出：

```
Connection to <your-phones-ip> 1716 port [tcp/*] succeeded!
```

你也会看到很多 Connection refused，但只需要 1 个 "succeeded"。

如果网络连接不是问题，你可以尝试从干净的配置重新开始：

```bash
killall kdeconnectd
mv ~/.config/kdeconnect ~/.config/kdeconnect.bak
```

#### ufw 防火墙

如果你使用 ufw 防火墙，你可以通过如下指令打开必要的端口：

```bash
sudo ufw allow 1714:1764/udp
sudo ufw allow 1714:1764/tcp
sudo ufw reload
```

#### firewalld 防火墙

如果你使用 **firewalld** 防火墙，你可以通过如下指令打开必要的端口：

```bash
sudo firewall-cmd --zone=public --permanent --add-port=1714-1764/tcp
sudo firewall-cmd --zone=public --permanent --add-port=1714-1764/udp
sudo systemctl restart firewalld.service
```

#### 防火墙配置 (firewall-config)

打开防火墙配置（`firewall-config`）。在 **分区(Zones)** ➔ **服务(Services)**，选中 kde-connect 服务。

确保你在顶部的下拉菜单中选中了"持久的" **配置:** 选项，否则重启后会丢弃你的更改。

#### iptables

如果你使用 **iptables** 防火墙，你可以通过如下指令打开必要的端口：

```bash
sudo iptables -I INPUT -i <yourinterface> -p udp --dport 1714:1764 -m state --state NEW,ESTABLISHED -j ACCEPT
sudo iptables -I INPUT -i <yourinterface> -p tcp --dport 1714:1764 -m state --state NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -o <yourinterface> -p udp --sport 1714:1764 -m state --state NEW,ESTABLISHED -j ACCEPT
sudo iptables -A OUTPUT -o <yourinterface> -p tcp --sport 1714:1764 -m state --state NEW,ESTABLISHED -j ACCEPT
```

### 当与另一个设备配对时 KDE Connect 崩溃或重启

有时，错误的配置文件可能在设备配对时导致 **KDE Connect** 软件崩溃，如果是这样，试试删除 `~/.config/kdeconnect` 的配置文件。

### KDE Connect Android app crashes

If the KDE Connect Android app crashes, you might be able to get more information about the crash by using **adb logcat**.

Set up ADB using the [official instructions](https://developer.android.com/studio/command-line/adb)

The following command should list all information relevant to your crash. Run **adb logcat** \*before\* triggering the crash:

```bash
adb logcat --pid=$(adb shell pidof -s org.kde.kdeconnect_tp)
```

### 没有显示服务器我能运行 KDE Connect 吗？

是的，你可以传递命令行参数 `-platform offscreen` 到守护进程（例如：`killall -9 kdeconnectd; /usr/lib/libexec/kdeconnectd -platform offscreen`）。

### GSConnect

**GSConnect** 是一个独立的项目，它将 **KDE Connect** 协议引入 GNOME 实现，并使用相同的 Android 应用。如果你正在运行 **GSConnect**，请先访问该项目 [GitHub 页面](https://github.com/andyholmes/gnome-shell-extension-gsconnect/wiki) 以获得支持。如果你和 **GSConnect** 团队确定问题出在安卓应用或协议上，请随时在 **KDE Connect** 错误跟踪器中报告这些问题。
