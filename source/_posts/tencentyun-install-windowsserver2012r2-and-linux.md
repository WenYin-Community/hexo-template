---
title: "为腾讯云主机安装Windows Server 2012R2+Linux双系统"
date: 2018-02-28
categories:
  - "云服务"
tags:
  - "vps"
  - "腾讯云"
  - "linux"
  - "windows-server"
  - "windows"
---

这里使用 Fedora 26 LxQt 版镜像作为示例，首先在腾讯云控制台选择安装 Windows Server 2012R2 系统，默认有 50+2GB 的磁盘空间，后面那个小虚拟磁盘用于交换，较大的在 Linux 下为 `/dev/vda1`，较小的为 `vda2`。

这里用的是腾讯云学生计划每月 1 元的主机，配置很低。

![](images/v2-d8653857f6d2c1083669a146a5d53b71_hd.jpg)

软件准备：EasyBCD 和 Fedora 安装镜像，个人使用的是 Fedora-LXQt-Live-x86_64-26-1.5.iso 这个。

第一步用 RDP 远程桌面登录首先截图记录，保存下本机的网络信息（腾讯云不提供 DHCP），以后会用到。

![](images/v2-e4c6030ab2a109ba842f47e803a99e3f_hd.jpg)

第二步将 Windows 中磁盘 1 压缩出一定空闲空间，个人分配了 30GB，并把磁盘 2 格式化为 FAT32 分区，如图所示：

![](images/v2-b84a6107729b61768eafc6c942728e2e_hd.jpg)

挂载上 Fedora 的安装镜像，并将根目录内所有文件复制到前面那个小的 2GB FAT32 分区中，并设置一个卷标，这里设为 FEDO。

![](images/v2-9ead8f27148a39af1b6cb5001ee85975_hd.jpg)

下面打开 EasyBCD，添加一个 NeoGrub 引导项，并进行配置：

（引导倒计时设为 30s 以上方便后续操作）

![](images/v2-341dbe0607e8736850470b653b344502_hd.jpg)

![](images/v2-7e9efcca2285595a671521e21af3334d_hd.jpg)

配置文件内写入：

```ini
title fedora LiveCD Method 1
root (hd0,1)
kernel /vmlinuz0 root=live:LABEL=FEDO rootfstype=auto ro rd.live.image quiet
initrd /initrd0.img
boot
```

注意前面 LABEL 后面的应该和你的存放安装镜像的分区标识相同。

下面注意将安装镜像下 isolinux 目录中 vmlinuz 和 initrd 俩文件复制到 C 盘根目录并改名为 vmlinuz0 和 initrd0。

下面重新启动虚拟机，在腾讯云后台的 VNC 界面打开，可见到如下菜单，选择 NeoGrub 引导。

![](images/v2-040643458ffc6ab8ad6e3fa4dad6751e_hd.jpg)

若配置正常即可进入 Fedora 的 LiveCD 环境，点击开始安装即可，注意安装到之前分出的 /dev/vda1 中。

![](images/v2-8e310bf3dfc466b283d853b74df26dc6_hd.jpg)

![](images/v2-458da2227961bb3ac1e430f16a69256c_hd.jpg)

安装完以后重启虚拟机，可以关闭图形界面然后确认一下分区情况，再重新启动。

![](images/v2-ad157b48f4226fd47dad1f5bf5a2fa85_hd.jpg)

顺便改一下 grub 菜单的超时时间，默认只有 5s 很难切换系统。

编辑 `/etc/default/grub` 文件：

```bash
sudo vi /etc/default/grub
```

第一行改为较大的如 30 以上即可，便可显示出菜单进行切换。

执行下面命令更新 grub 配置：

```bash
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
```

下面重新启动：

![](images/v2-938eb10b8030e575ab70b47820825376_hd.jpg)

出现下面界面表示双系统正常运行，下面自行配置 Linux 下的网络参数即可进行 ssh 连接和其他操作，下面不再赘述。

![](images/v2-8dd751b55cf0ae185b3cd16e37bcf4dd_hd.jpg)
