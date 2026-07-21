---
title: "使用Raspberry Pi等ARM迷你开发板运行ArchiSteamFarm挂卡程序"
date: 2018-05-05
categories:
  - "硬件设备"
coverImage: "TIM图片20180505203225.png"
tags:
  - "树莓派"
  - "raspberry-pi"
---

首先启动树莓派或别的开发板，确定 CPU 架构，一般有 ARM32 和 ARM64 两种，因为运行的系统版本不同，下载的 dotnet 包有差别。先运行下列命令安装依赖包：

```bash
sudo apt-get install curl libunwind8 gettext screen
```
sudo apt-get install curl libunwind8 gettext screen
```

![](images/TIM图片20180505201923.png)

然后运行 `lscpu` 或 `neofetch` 等命令确定当前使用的是什么系统版本。本人一个树莓派，一个香橙派，一个64位一个32位（注意树莓派官方系统是32位）。aarch64 为64位，armv7l 则为32位。

![](images/TIM图片20180505201723.png) ![](images/TIM图片20180505201800.png)

确定下系统时间是否准确方可进行下一步操作，因为 ARM 设备通常无时钟，断电情况下不会保持时间，使用：

```bash
sudo date -s "2023-01-01 12:00:00"
```

设置当前时间。

---

下载 dotnet 环境：

32 位系统（大多数开发板）运行：

```bash
curl -sSL -o dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Runtime/release/2.0.0/dotnet-runtime-latest-linux-arm.tar.gz
```

64 位系统运行：

```bash
curl -sSL -o dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Runtime/release/2.0.0/dotnet-runtime-latest-linux-arm64.tar.gz
```

创建目标文件夹并将下载的包解压到其中：

```bash
sudo mkdir -p /opt/dotnet && sudo tar zxf dotnet.tar.gz -C /opt/dotnet
```

设置符号链接：

```bash
sudo ln -s /opt/dotnet/dotnet /usr/local/bin
```

输入以下命令测试安装：

```bash
dotnet --help
```
curl -sSL -o dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Runtime/release/2.0.0/dotnet-runtime-latest-linux-arm.tar.gz
```

64位系统运行：

```
curl -sSL -o dotnet.tar.gz https://dotnetcli.blob.core.windows.net/dotnet/Runtime/release/2.0.0/dotnet-runtime-latest-linux-arm64.tar.gz
```

Run ：

```
sudo mkdir -p /opt/dotnet && sudo tar zxf dotnet.tar.gz -C /opt/dotnet
```

to create a destination folder and extract the downloaded package into it.

Run：

```
sudo ln -s /opt/dotnet/dotnet /usr/local/bin
```

to set up a symbolic link...a shortcut to you Windows folks ? to the **dotnet** executable.

Test the installation by typing

```
dotnet --help
```

出现下面的内容则提示安装成功：

![](images/TIM图片20180505203020.png)

然后按照常规步骤配置 ArchiSteamFarm 并运行即可，如图所示：

![](images/TIM图片20180505203225.png)
