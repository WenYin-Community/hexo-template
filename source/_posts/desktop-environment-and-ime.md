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

## KDE 默认应用的 MIME 优先级：按文件名类别排序

`.md` 双击打开方式在 mdoxide / zedg / kwrite 之间反复横跳，最后挖出 KDE/KIO 的真实查找规则——它**不是** XDG 规范的「目录优先级交错」。

- **现象**：系统设置里把 `.md` 默认程序改成 zedg，改完立刻变回 mdoxide；删掉 `~/.config/kde-mimeapps.list` 后又变成 kwrite；
- **真实规则**：所有 `<desktop>-mimeapps.list`（无论在 `~/.config` 还是 `/usr/share`）**整体排在**所有 `mimeapps.list` 之前。系统级 `/usr/share/applications/kde-mimeapps.list`（`plasma-workspace` 自带）写着 `text/markdown=org.kde.kate.desktop;org.kde.kwrite.desktop`，kate 未安装 → kwrite 接手；用户 `mimeapps.list` 优先级更低，怎么写都赢不过；
- **决定性实验**：把 `~/.config/kde-mimeapps.list` 写成空的 `[Default Applications]` 段，此时 `mimeapps.list` 里明明有 `text/markdown=dev.mdoxide.app.desktop`，`kde-open` 实测仍起 kwrite——证明不是「同名 key 谁优先」的合并关系，而是文件名类别决定整条查找路径；
- **修法**：删除 `~/.config/kde-mimeapps.list`，在 `~/.config/mimeapps.list` 末尾追加 `[Removed Associations]` 段与 `text/markdown=org.kde.kate.desktop;org.kde.kwrite.desktop;`，再 `kbuildsycoca6` 重建缓存；
- **顺序不能反**：先删补丁文件会立刻回退到系统默认的 kwrite，必须先加 `[Removed Associations]` 再删；
- **软链合并不成立**：`kde-mimeapps.list -> mimeapps.list` 写入正常、内容同步，但 KDE 按规范化路径去重、软链被视为同一文件，打开仍走 kwrite；
- **`text/x-markdown` 只是别名**：`.md` 的真实类型是 `text/markdown`，两套 key 各写各的默认值，两条都要处理；
- **别信 `xdg-mime query default`**：它只读配置字面值，不校验应用是否声明支持该 MIME，也不反映 KIO 的真实优先级。判断实际行为要用 `kde-open <file>` + `ps -eo comm`；
- **`kreadconfig6` 只读 `mimeapps.list`**：显示 zedg 已生效，与真实行为不符；`strings` 读 ksycoca 索引要用 `strings -el`（内部是 UTF-16）。

## KDE 主题的窗口圆角：`mask-*` 不是外形

改 Aurorae 窗口装饰时常会误以为 `mask-*` 是「窗口外形遮罩」，其实在 Plasma 6.8 / KDecoration3 里：

- `mask-*` 经 `KSvg::FrameSvg::mask()` 调用 `setBlurRegion()`，**只定义模糊区域的形状**；
- 窗口外形和圆角由 `decoration-*` 角部元素决定（`decoration-topright` / `right` / `bottomright` 等）；缺的角靠 FrameSvg 镜像回退，实测正常；
- **最大化窗口本来就不绘制圆角**，截最大化窗口无法验证圆角，必须用非最大化窗口实测；
- 底部 4px 圆角肉眼看起来像直角，要用 XML 精确解析 + 高分辨率像素验证，不能靠截图目测。

还有一个几何约束：**圆角半径不能超过边框厚度**。想把底角从 4px 加到 12px，必须同步把 `BorderBottom` 从 4 加到 12、`PaddingBottom` 相应减小、底边条加厚——否则窗口底部会多出一条深色边。改之前先想清楚视觉代价。

另外，4 个 `look-and-feel/*/contents/defaults` 里的 `library=org.kde.kwin.aurorae` 在 Plasma 6.8 已过时，实际插件是 `org.kde.kwin.aurorae.v2`。因为本机 `kwinrc` 早已是 v2 值，所以**不报错、静默失效**，只有重装主题才会把旧值写回。

## GTK 主题在 FreeBSD 上的安装脚本

把 Linux 上的 `install.sh` 直接搬到 FreeBSD 会立刻失败：bash 数组、`[[ ]]`、`sed -i` 需要扩展名、`&>` 重定向，FreeBSD 的 sh 和 BSD sed 都不认。做法是另写一个 POSIX `sh` 脚本，自包含编译与安装：

- `sassc` 只检测并提示 `pkg install sassc`，不代装依赖；
- 默认用户级安装，`-s` 走系统级；
- 没有 GNOME Shell 时跳过 Shell 主题，其余 GTK / Metacity / XFWM4 / Plank / Cinnamon 照常安装；
- GNOME 检测要放在参数解析之后，否则 `-h` / `-u` 也会打印「未找到 gnome-shell」；
- 卸载测试有破坏性（`-u` 会把已有的同名主题一起删掉），做之前先确认能重装恢复。
