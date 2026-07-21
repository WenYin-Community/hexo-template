---
title: "在RedHat/Fedora KDE桌面使用fcitx5/ibus输入法"
date: 2023-04-11
categories:
  - "Linux"
tags:
  - "fcitx"
  - "fedora"
  - "redhat"
  - "kde"
  - "linux"
coverImage: "Screenshot_20230411_162013.png"
---

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
