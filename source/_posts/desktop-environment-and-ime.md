---
title: "桌面环境与输入法合集"
author: "学姐大人"
date: 2023-06-27
categories:
  - "开发工具"
tags:
  - "kde"
  - "desktop"
  - "input-method"
  - "fedora"
  - "rhel"
---

KDE 与 RHEL 系桌面的安装、输入法配置，以及几个高频小故障（Dolphin 提权、KDE Connect 失联）。

<!-- more -->

<a id="redhat-fedora-kde-use-fcitx5-ibus-input-method"></a>

## 在RedHat/Fedora KDE桌面使用fcitx5/ibus输入法

[![](images/Screenshot_20230411_162013.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/Screenshot_20230411_162013.png)

## 安装 Fcitx5

```bash
sudo dnf install fcitx5-gtk2 fcitx5-gtk3 fcitx5-gtk4 fcitx5-gtk fcitx5-data fcitx5 fcitx5-qt-libfcitx5qtdbus fcitx5-qt-module fcitx5-lua fcitx5-qt-libfcitx5qt5widgets fcitx5-chinese-addons fcitx5-chinese-addons-data fcitx5-qt kcm-fcitx5 fcitx5-rime
```

## 安装 ibus

```bash
sudo dnf install ibus ibus-libpinyin ibus-gtk2 ibus-gtk3 ibus-gtk4 ibus-qt
```

## 配置文件

编辑 `/etc/environment`：

```bash
sudo vim /etc/environment
```

输入以下内容并保存，注销重新登陆即可使用，右击任务栏图标即可配置。

### Fcitx5 配置

```bash
INPUT_METHOD=fcitx5
GTK_IM_MODULE=fcitx5
QT_IM_MODULE=fcitx5
XMODIFIERS=@im=fcitx5
```

### iBus 配置

```bash
INPUT_METHOD=ibus
GTK_IM_MODULE=ibus
QT_IM_MODULE=ibus
XMODIFIERS=@im=ibus
```

<a id="installing-kde-plasma-on-rhel-based-9"></a>

## 在基于RHEL的系统上安装KDE Plasma桌面环境

[![](images/QQ图片20230410095846.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/QQ图片20230410095846.png)这大概也适用于Rocky/Alma和CentOS（Stream）。

我需要为某个项目创建一个AlmaLinux 9.1（注：译者在RHEL9.1测试通过）工作站。

我唯一的抱怨是，我不是GNOME桌面的忠实粉丝。 除了“标准”桌面或GNOME桌面之外，如果有另一种选择就好了。  
我最近不得不为一个项目创建一个AlmaLinux 9.1工作站。我唯一的抱怨是，我不是Gnome桌面的忠实粉丝。 除了“标准”桌面或Gnome桌面之外，如果有另一种选择就好了。

这就是如何在基于RHEL9的系统上安装KDE Plasma的方法。  
这就是如何在基于RHEL9的系统上安装KDE Plasma。

#### 首先，[参考此处](https://wiki.wenyinos.com/index.php/2022/05/24/extra-packages-for-enterprise-linux/)安装EPEL镜像。

## 安装 KDE：安装KDE

`sudo dnf -y groupinstall "KDE Plasma Workspaces" "base-x"`

#### KDE可选组件：

```
sudo dnf groupinstall kde-apps
sudo dnf groupinstall kde-media
sudo dnf groupinstall kde-education
sudo dnf install okular
sudo dnf groupinstall kde-software-development
sudo dnf groupinstall kf5-software-development
```

（注：若有依赖关系破损可通过 --skip-broken参数跳过，使用中暂未见异常）

#### (可选) 使用sddm作为登录管理器：

```
sudo systemctl set-default graphical.target
sudo dnf install sddm\*
sudo systemctl enable sddm -f
```

#### (可选) 通过Flatpak安装Apps：

```
sudo dnf -y install flatpak
sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
sudo flatpak install flathub org.kde.kdenlive
sudo flatpak install flathub org.kde.krita
```

#### （可选）禁用GNOME的gdm：设置sddm替换gdm登录屏幕

```
sudo systemctl disable gdm
sudo systemctl enable gdm
```

注销，在登录界面选择Plasma会话登录即可。

在登录屏幕上从小“设置”图标中选择您的桌面环境然后重启到等离子桌面。

#### （可选）卸载GNOME桌面删除GNOME桌面

`sudo dnf autoremove @gnome-desktop gdm`

### 来源：

[https://www.linux.org/threads/installing-kde-plasma-on-almalinux-9-1.42978/](https://www.linux.org/threads/installing-kde-plasma-on-almalinux-9-1.42978/)

[https://fedoraproject.org/wiki/SIGs/KDE/EPEL](https://fedoraproject.org/wiki/SIGs/KDE/EPEL)

<a id="kde-dolphin-run-as-root"></a>

## KDE Dolphin文件管理器以root访问

把下列代码保存为 `open_as_root.desktop`，放置于 `~/.local/share/kservices5/ServiceMenus/` 目录（无此目录请手动创建）：

```ini
[Desktop Entry]
Type=Service
Icon=system-file-manager
Actions=OpenAsRootKDE5
ServiceTypes=KonqPopupMenu/Plugin,inode/directory,inode/directory-locked

[Desktop Action OpenAsRootKDE5]
Exec=/usr/bin/pkexec env DISPLAY=$DISPLAY XAUTHORITY=$XAUTHORITY KDE_SESSION_VERSION=5 KDE_FULL_SESSION=true dolphin
Icon=system-file-manager-root
Icon=system-file-manager
Name=Open as Root
Name[ru]=Открыть папку с правами рут
Name[ua]=Відкрити папку з правами рут
Name[zh_CN]=打开具有根权限的文件夹
Name[zh_TW]=打開具有根許可權的資料夾
Name[de]=Öffnen des Ordners mit Root-Berechtigungen
Name[ja]=ルート権限を持つフォルダを開く
Name[ko]=루트 권한이 있는 폴더 열기
Name[fr]=Ouvrez le dossier avec les privilèges root
Name[el]=Ανοίξτε ως Root
Name[es]=Abrir la carpeta con privilegios de root
Name[tr]=Kök ayrıcalıkları olan klasörü açma
Name[he]=פתח תיקיה עם הרשאות שורש
Name[it]=Aprire la cartella con privilegi radice
Name[ar]=فتح المجلد بامتيازات الجذر
Name[pt_BR]=Abrir pasta com privilégios de root
Name[pt_PT]=Abrir pasta com privilégios de root
Name[sv]=Öppna mapp med root-behörigheter
Name[nb]=Åpne mappen med rotprivilegier
```

[![](images/6fc092541a11c86ddf1d928f0e61301ec5a3.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/06/6fc092541a11c86ddf1d928f0e61301ec5a3.png)

<a id="kde-connect-repair"></a>

## KDE Connect 故障修复

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
