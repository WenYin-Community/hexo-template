---
title: "在基于RHEL的系统上安装KDE Plasma桌面环境"
date: 2023-04-09
categories:
  - "Linux"
tags:
  - "centos"
  - "epel"
  - "kde"
  - "redhat"
  - "rhel"
coverImage: "QQ图片20230410095846.png"
---

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
