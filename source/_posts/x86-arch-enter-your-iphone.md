---
title: "x86架构进入你的iPhone"
date: 2018-12-18
categories:
  - "硬件设备"
tags: 
  - "modem"
  - "x86"
---

来源：[https://lcq2.github.io/x86\_iphone/](http://link.zhihu.com/?target=https%3A//lcq2.github.io/x86_iphone/)

## 介绍

生活中，我是一名从事基带开发的漏洞研究员。正如每个漏洞研究人员都知道的那样，了解最新技术发展对于您的工作成功是至关重要的。当然，在Apple宣布其**新的，闪亮的，大的，更大的和最大的**iPhone智能手机系列之后，我从[http://ipsw.me](http://link.zhihu.com/?target=http%3A//ipsw.me)下载了一些OTA固件并开始研究新的基带固件。

我发现的东西在我的脊椎上发出一阵惊骇，那种只在夜间玩Doom的恐怖，独自在你的房间，没有灯光，可以产生。忍受我，我会告诉你我发现了什么......

_注意_：这只是一些初步分析，我不打算描述与基带恢复相关的任何内容，这不是本篇的范围。

## 谁/什么/在哪里？

基带cpu是一个独立的核心，存在于手机中，负责处理2g / 3g / 4g / cdma / 5g无线通信。鉴于这些标准的荒谬复杂性，现在的基带cpu必须非常强大且足够通用，因此基于FPGA的定制IP的时代早已过去，至少对于主要部分而言。在现代智能手机上已经有很多关于基带的说法和文章，所以我不再重复了。为了我们的目的，您只需要知道通常基带是使用嵌入式低功耗CPU实现的（译者注：通常使用简单的嵌入式架构），例如ARM（Cortex-M，Cortex-R或其他内容），Qualcomm Hexagon（一种通用，VLIW dsp）或其他或多或少的已知架构。

Apple在这方面并不特别，直到iPhone8 / iPhoneX（译者注：原文有误，iPhone7/7P开始使用不同的基带），它们曾经拥有两个不同的基带，一个用于CDMA市场，另一个用于其他所有基带。CDMA市场区域基于Qualcomm Hexagon dsp，而其他基于Intel XMMxxxx架构。对于那些喜欢玩iPhone固件的人来说，您可能已经在ipsw中看到了MAVxxx和ICExxx文件，这两个文件分别包含基于Qualcomm的设备（MAV）和基于Intel的设备（ICE）的固件。

您可能知道，Apple决定放弃高通，现在他们只使用基于英特尔的基带，因此本篇将专注讨论。

## 老款的英特尔基带

让我们来看看上一代的英特尔基带，一个用于iPhoneX的基带。如果你下载了

一个ipsw GSM固件并解压缩它（ipsw文件只是zip文件），除了其他之外，还有一个“固件”文件夹。在这个文件夹中你会看到几个文件：“ICE17-1.04.52.Release.bbfw”和“Mav17-1.91.00.Release.bbfw”。版本当然会改变，这些版本适用于带有iOS 11.4beta3的iPhone8。这些文件再次是zip文件，我们对ICE17-xxx感兴趣，让我们解压缩并查看内容：
![](images/v2-8d2cb7b111ba00e64927f86be503a08f_hd.jpg)
这里值得考虑。熟悉嵌入式固件反汇编的人，当然会把目光投向“psi\_ram.bin”和“ebl.bin”。对其内容进行快速十六进制转储，将立即显示它们包含ARM代码。事实上，“psi\_ram.bin”是stage0引导加载程序，它将在某个地址加载“ebl.bin”并跳转到其入口点。然后，ebl.bin将加载所有其他文件并跳转到SYS\_SW.elf中包含的主固件。为了确定，让我们使用IDA并打开psi\_ram.bin，加载地址无关紧要，只需将其设置为0：
![](images/v2-88da1dcf9248a899a75962e2c6769848_hd.jpg)
这里没什么奇怪的，它是你的标准嵌入式ARM启动代码，有一些与这个特定SoC相关的自定义设置。继续前进，psi\_ram将加载ebl并跳转到它，你可以自己找到代码，并不复杂。重要的是，这是ARM代码。

## 新的英特尔基带......恐怖......恐怖......

今天早上醒来，我想分析新版本的基带固件，以了解改变了什么以及在哪里。所以我从[http://ipsw.me](http://link.zhihu.com/?target=http%3A//ipsw.me)下载了一个新的iPhone的随机OTA，特别是：[https：//ipsw.me/otas/iPhone11,2](http://link.zhihu.com/?target=https%3A//ipsw.me/otas/iPhone11%2C2)，应该是新的iPhone Xs。我经历了通常的阶段（下载，解压缩，解压缩，解压缩，复制等等），我将psi\_ram.bin加载到IDA中，我选择ARM little endian，以及...大量未定义数据。我按“C”就像一个白痴大约200次，我重新加载文件多次，我尝试另一个IDA版本，我尝试用Capstone反汇编字节，我手动拆卸它们，什么都没有......我得到的只是无效代码。所以我回去睡觉，因为显然这不是一个美好的一天。

大约一个小时后我再次醒来，我再次下载同一型号的ipsw，我会像往常一样完成所有相同的步骤。代码仍然无效。我的第一个猜测是代码是加密的，所以我使用一些随机工具来分析被加密文件，没有，它非常低。好吧，这些天你不能相信工具，所以我编写了自己的脚本来计算，再次，太低而不能加密，无论如何，通过快速的“肉眼”分析也很清楚，即使你不应该过度相信你的眼睛。

我盯着屏幕看几分钟，想着发生了什么。但是当然，作为一个逆转器，你永远不应该放弃，所以我尝试了我所知道的每一个可能的RISC架构，并且相信我，它们中有很多（不是我的意思，很多，我把所有从Dreamcast SH4转移到富士通/西门子在我的尼康D90内跑，并...没什么，我得到的只是垃圾。我的下一个猜测是：好的，它是用一些熵保留算法加密的。我尝试了一些我知道的加密方法，即使我不是专业用户，仍然没有。

我又喝了一杯咖啡，在我看来，我开始认为这是一个笑话：fuck it，这是x86，因为英特尔已经疯了。我开始疯狂地对这个想法大笑，但是你知道，我已经尝试了所有东西，所以我重新打开“psi\_ram.bin”并在IDA中保留默认的“MetaPC”架构，并且......
![](images/v2-4e8b193a974c3ddcdc3ae59c6ede2e27_hd.jpg)
我无法相信自己的眼睛......我正在寻找基带CPU内运行的嵌入式x86代码。我认为这只是偶然的机会，不知为何，我最终得到了有效的x86代码，所以我看了另一个函数（注意：IDA自动解析了大部分代码）和.......
![](images/v2-22a6120c1e5a2a5643a167e845b4831f_hd.jpg)
holy shit ...

lgdt ... mov ds，eax ... jmp far ptr 8：xxx，你不能得到比这个更像x86的代码了。这绝不是巧合，这必须是有效的x86代码......我完全无言以及有些敬畏，因为这让我想起了我在386保护模式下运行的引导加载程序和操作系统时的年轻时光。

但我理性的部分告诉我“嘿，可能他们只是决定使用嵌入式x86 mcu启动系统，显然主要固件仍然在ARM上运行”，所以我把注意力转向主要固件“SYS\_SW.elf”。我看看ELF标题，它说ARM ......很好。我把它加载到IDA中，然后我得到垃圾......再次！我想.....

what.the.fuck，我尝试再次使用MetaPC加载它...... BOOM，有效的x86代码！随机片段：
![](images/v2-618b366c3513c0067d1903a58781894f_hd.jpg)
This is awesome…

## 结论

这并没有什么，我发现这是很有趣的并想分享。如果你觉得自己错过了生活中的x86核心，那么现在有一个或数个与你在一起，所以你不会再感到孤单。我没有时间分析其他模型，但我的猜测是它们也在x86机构上运行。

接下来会发生什么？我们打算在手机中使用z80吗？为什么不是6502？天啊，我很想在我的手机里本地运行C64基本解释器....

不是真的，我不批评苹果或英特尔使用x86架构，我真的不在乎，但是......我的个人观点认为，在这个世界上出现了一些问题。

## 参考

你可能在以下内容中发现有用的信息，无特别顺序：

- [Baseband Attacks: Remote Exploitation of Memory Corruptions in CellularProtocol Stacks](http://link.zhihu.com/?target=https%3A//www.usenix.org/system/files/conference/woot12/woot12-final24.pdf) by Ralf-Philipp Weinmann
- [Reverse engineering a Qualcomm baseband](http://link.zhihu.com/?target=https%3A//events.ccc.de/congress/2011/Fahrplan/attachments/2022_11-ccc-qcombbdbg.pdf) by Guillaume Delugré
- [All Your Baseband Are Belong To Us](http://link.zhihu.com/?target=http%3A//archive.hack.lu/2010/Weinmann-All-Your-Baseband-Are-Belong-To-Us-slides.pdf) by Ralf-Philipp Weinmann
- [Breaking Band - reverse engineering and exploiting the shannon baseband](http://link.zhihu.com/?target=https%3A//comsecuris.com/slides/recon2016-breaking_band.pdf)by Nico Golde, Daniel Komaromy
- [Path of Least Resistance: Cellular Baseband to Application Processor Escalation on Mediatek Devices](http://link.zhihu.com/?target=https%3A//comsecuris.com/blog/posts/path_of_least_resistance/) by György Miru
- [There’s Life in the Old Dog Yet: Tearing New Holes into Intel/iPhone Cellular Modems](http://link.zhihu.com/?target=https%3A//comsecuris.com/blog/posts/theres_life_in_the_old_dog_yet_tearing_new_holes_into_inteliphone_cellular_modems/) by Nico Golde
