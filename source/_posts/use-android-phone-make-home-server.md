---
title: "使用吃灰的Android手机代替第三方开发板等制作简易家庭服务器"
date: 2018-02-28
categories:
  - "云服务"
tags: 
  - "android"
  - "linux"
---

准备工作：通过 Play Store 或 apkpure 等官方商店安装 Linux Deploy APP，启动后点击右下角箭头图标，进行如下设置。本次以安装 Fedora 25 为例，设备为古董的 MSM8926+1GB RAM。

![](images/v2-2d7ff6e2ff8e00debde53b95c44f88c6_hd.jpg)

![](images/v2-3d82e6bf44a4c4ce12cb8d212e5e73e3_hd.jpg)

Image size 指安装盘 img 文件大小，合理分配位置以及容量，无图形界面的 Linux 安装一般需要 1.5GB 就足够了，采用 chroot 形式。文件系统建议使用非日志形式的 ext2，减少对存储介质的损伤。源镜像用国内服务器即可，填入：

```
http://mirrors.ustc.edu.cn
```

注意各发行版的地址形式不同，Arch Linux 一般为：

```
http://mirrors.ustc.edu.cn/archlinuxarm
```

另外注意发行版的架构，ARM 32 位机型选择 armhfp 或 armv7，ARM 64 位选择 armv8 或 aarch64 即可，Intel x86 设备选择 i686 或 x86_64 之类。

GUI 无特殊需求不建议安装，ssh 端口建议修改一下，此处改为 2222，以后本机 ssh 地址为 `127.0.0.1:2222`，用户名和密码已输入。

![](images/v2-f8353db548e5a0c02eb6e8d735689cd7_hd.jpg)

![](images/v2-6c87f876b1a99426c326a47978bcb661_hd.jpg)

返回到主页面，右上角点击 install 开始安装，如果没有错误便开始配置一系列软件包，安装完会有提示。等待一些时间。

安装完成后点击 start 启动，设备连接到无线局域网，用手机端或 PC 端 SSH 工具都可以访问（当然本机也可以），IP 就是显示那个。

![](images/v2-150443bed62c4c47a1fac584dacfa55f_hd.jpg)

![](images/v2-33cb1abc1234c71749c22048726391c5_hd.jpg)

另外注意要设置保持唤醒，否则 ARM 设备在灭屏状态下 CPU 会休眠无法运行，Linux Deploy APP 也不能放到一键清理中：

![](images/v2-1e6635fe531eff83aaa5c211cb227123_hd.jpg)

下面用 PC 上面的 ssh 工具登录，即可当做普通的 Linux 设备使用。

有些 Linux 命令可能不全需要手动补充，例如 ifconfig 需要 net-tools 软件包，free、ps 等需要 procps-ng 软件包，wget、gcc、git、perl、python 等环境也需要安装。

此处识别出了 Qualcomm MSM8926：

![](images/v2-42b70e1700cfb3ea6f2479fcc6c0b89e_hd.jpg)

下面测试实例为安装 nginx web server，通过 dnf 安装：

![](images/v2-0835a2400b43f60bfe3fb4b598101e6a_hd.jpg)

磁盘占用情况，也是不多的。

注意 Android 手机的 chroot 环境下无法运行 systemctl、service 等服务管理命令，只可直接运行 nginx 可执行文件，需将参数写入开机运行脚本：

![](images/v2-a2a704ab17fb6877c85ca7620aa3c819_hd.jpg)

启动 web 服务后在浏览器输入 Android 的设备 IP，显示以下页面表示成功。以后配置所有支持 ARM 编译的 Linux 软件都可以了，以现在手机性能运行一个小型网站不是问题。

![](images/v2-424661bd494d96d154c1857787a8e032_hd.jpg)
