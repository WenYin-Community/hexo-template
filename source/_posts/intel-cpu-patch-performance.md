---
title: "简要测试一下Intel处理器在安装漏洞补丁前后的性能差异"
date: 2018-02-28
categories:
  - "硬件设备"
tags: 
  - "cpu"
  - "intel"
  - "编译"
coverImage: "2-5.png"
---

硬件环境如下：系统采用 Fedora 27，编译器为 gcc 7.1，充分测试 CPU 和 IO 性能，benchmark 类程序没什么意义。

未打补丁的内核版本为 Linux 4.14.8，已打补丁的内核版本为 Linux 4.14.11。

![](images/2-300x172.png) ![](images/1-300x197.png)

这是未更新前的系统版本号。测试的方法是，用 gcc7.1 编译器编译相同的 php 7.2.1 源码包，用 dstat 程序读取编译时间和 IO 负载等信息，统一编译如下内容：

![](images/3-145x300.png)

gcc 编译器采用的优化参数为：

```bash
CFLAGS="-O2 -mtune=native -march=native"
CXXFLAGS="-O2 -mtune=native -march=native"
```

意思是根据 CPU 性能和指令集自动编译优化。

下面开始测试，首先在没有更新的旧版本内核启动系统，使用下列命令测试，并记录到 csv 文件中：

```bash
dstat --output testold.csv -rdt 5
```

每 5s 记录当前系统的 io 负载，磁盘 IO 计数，还有系统时间，输出到 testold.csv 文件中。

![](images/1-1-300x169.png) ![](images/2-1-300x169.png)

编译完成，不需要清理，重启用新版本 Linux 4.14.11 内核启动，重复如下测试，建议分别用两套纯净源码测试，以防干扰。注意查看一下更新后的内核版本，保持编译优化参数和编译模块内容一致：

![](images/3-1-300x52.png)

下面进入第二次编译过程，可以先记录一下时间戳：

![](images/1-2-300x169.png) ![](images/2-2-300x169.png)

下面打开记录的 csv 文件，分析一下结果。首先是老版本未打补丁的内核，开始编译的时间戳是 08-01 01:11:28，编译完成的时间戳是 08-01 01:15:53，也就是说编译用时 4min25s，通过 excel 等应用，将系统 IO 和磁盘 IO 数据制表，得到如下图形：

![](images/1-4-300x84.png) ![](images/2-4-300x95.png)

下面是新版本已经打补丁的内核（4.14.11），开始编译的时间戳 08-01 01:32:00 完成编译的时间戳是 08-01 01:36:55，用时 4min55s，编译用时这里多了约 30s，当然有 5s 以内误差，因为是手动按 Ctrl+C 停止记录，系统 IO 和磁盘 IO 数据制表：

![](images/1-5-300x88.png) ![](images/2-5-300x107.png)

原始的数据文件放到了网盘中，有需要的可以自行下载：https://pan.baidu.com/s/1hsyAKK0

> 注意 ods 是用 LibreOffice Calc 创建的文件，因为 Linux 下没有 Office

![](images/24a006160924ab1852a910dc3efae6cd79890be1.jpg)

testold 指旧内核，testnew 指新内核。

目前明显可见的性能差异是编译用时多了约 30s，因为属于重度 IO 类应用，而且是 `make -j4`，可让 cpu 满负载，是不是所谓性能损失不知道。关于图表各位可以自行分析一下。
