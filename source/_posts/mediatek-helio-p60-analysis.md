---
title: "MediaTek Helio P60一些详细参数的分析"
date: 2018-03-30
categories:
  - "硬件设备"
tags: 
  - "mediatek"
coverImage: "TIM图片20180328001843.png"
---

以下内容来自：

![](images/TIM图片20180327232950-300x250.png)

芯片的总体结构 block diagram 图，首先确定是没有专用的神经网络 AI 单元，用什么部分跑 AI 暂时还不得而知。不过很奇怪为什么没有 CCI 总线用作 CPU 部分两个丛集之间的互联，这样同频可以节约成本吗？没有 CCI 确实可以降低簇间处理延迟。

![](images/TIM图片20180327233406-300x223.png)

AP MCU subsystem 和内存控制器部分，发布会上面说的基本没问题。

![](images/TIM图片20180327233638-300x172.png)

LPDDR4x 控制器和 660/636 一样是 2*16bit 的（伪）双通道 1800MHz。

## 通信模块指标

- 仅支持 Cat.7
- FDD/TDD 高达 300Mbps 下行，150Mbps 上行
- 下行载波聚合（CA）能力
- 1.4 到 20MHz 射频带宽每组件载波（CC）和多达 2 个 CCS
- 8×2 下行单用户每分载体
- 下行 MU-MIMO 的组件载体
- 支持 FeICIC
- 支持 MBMS
- 上行 CoMP 能力
- 先进的干扰消除
- 发送 Atenna Selection

![](images/TIM图片20180327234059-300x206.png)

无线网络模块方面使用和 X20 方案同款的 MT6631，还阉割了蓝牙 5.0 的支持。

不过 P 系列总算支持了 802.11ac 和三频导航（加上北斗）。

![](images/TIM图片20180327234515-300x207.png)![](images/TIM图片20180327234535-300x157.png)

对比一下 MT6797（x20）的参数，基本确定是同款：

![](images/TIM图片20180327235024-300x273.png)

## 图形部分，倒车请注意

屏幕分辨率支持连 X20 都不如，从 WQHD(2,560×1,440) 降低到 FHD+（2400×1080），主要是少了一组 GPU 单元。

MIPI DSI interface 从 X20 的 (8 data lanes) 降低到 MIPI DSI interface (4 data lanes)

像素填充率由 X20 的 3,120M pixel/sec @ 780MHz 降低到 2,400M pixel/sec @ 800MHz

![](images/TIM图片20180327235726-300x273.png) ![](images/TIM图片20180327235838-294x300.png)

制程有优势的情况下，像素填充率少了 20%，理论性能最多相当于 X20 的 T880mp4 而已。

存储部分，同时支持 eMMC 5.1 和 UFS 2.1，USB 3.0 仅支持 device 模式，OTG 仅支持 USB 2.0。

![](images/TIM图片20180328000233-249x300.png)

图像处理（ISP）部分相对 X20 小幅度提升：

- MT6771：

  ![](images/TIM图片20180328001040.png)

- MT6797：

  ![](images/TIM图片20180328001108.png)

对比下相同定位，价格差不多的竞品，Snapdragon 636 参数：

其中 GPU 多了 OpenGL ES 3.2 和 OpenCL 2.0，也就是架构差一代。

sdm636 的通讯模块支持：

LTE Cat13，下行 3 载波聚合 600Mbps 256QAM，上行 2 载波聚合 150Mbps 64QAM。

- Downlink: LTE Cat 12 up to 600 Mbps, 3x20 MHz carrier aggregation, up to 256-QAM
- Uplink: LTE Cat 13 up to 150 Mbps, Snapdragon Upload+ (2x20 MHz carrier aggregation, up to 64-QAM)

![](images/TIM图片20180328001843-300x207.png)

总体评价是，相对今年同价位的竞品 Snapdragon 636，AP 部分稍有优势，BP 部分大幅落后。
