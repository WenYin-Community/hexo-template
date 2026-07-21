---
title: "如何让Intel Arc在Fedora上面运行"
date: 2023-11-28
categories:
  - "硬件设备"
tags:
  - "arc"
  - "fedora"
  - "intel"
  - "linux"
  - "graphics"
coverImage: "Screenshot_20231128_220039.png"
---

这篇文章是为了帮助 Fedora 用户尝试让 Intel Arc Alchemist 正常工作。

请注意，您不需要使用 6.0 或更高版本的内核来使其正常工作，它只是提供了更好的性能。根据邮件列表和 git pull，我们应该能够在内核 6.2 之后删除下面详细介绍的设置。在此之前，Arc/图形支持是在 i915 实验下抛出的，我们需要添加内核参数来启用它。

还有一个很好的小功能是你可以保持安全启动启用！不需要关闭它或做脚本黑客和设置自动内核模块签名一样，我们仍然需要做的 Nvidia。

> **警告：** 永远不要相信网上的命令，在你运行它们之前阅读并理解命令，不要怪我。

## 添加 RPMFusion

Intel-media-driver 是开源的，但 Fedora 认为硬件编解码器支持有风险，所以在非自由仓库中。下面还提供了免费的 repo，因为您可能会使用它来添加编解码器支持。

```bash
sudo dnf install https://mirrors.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm https://mirrors.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```

更新并安装驱动：

```bash
sudo dnf update
sudo dnf install intel-media-driver
```

通过以下方式查找您的 PCI ID：

```bash
sudo lspci -nn | grep VGA
```

[![](images/Screenshot_20231128_220039-640x480.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/11/Screenshot_20231128_220039.png)

它应该返回类似于：

```
03:00.0 VGA compatible controller [0300]: Intel Corporation DG2 [Arc A770] [8086:56a0] (rev 08)
```

你看 `8086:56a0`？那是 vendor ID：PCI ID，因为我的 PCI ID 是 56a0，所以我在下面的命令中替换了它。

现在 Fedora 自带了 grubby，但你可以手动或使用其他工具来完成。

使用上面的数字运行下面的命令以替换 PCI ID：

```bash
sudo grubby --update-kernel=ALL --args="i915.force_probe=56a0"
sudo grubby --update-kernel=ALL --args="i915.force_probe=<pci ID>"
```

要删除参数，请执行以下操作：

```bash
sudo grubby --update-kernel=ALL --remove-args="i915.force_probe=<pci ID>"
```

重新启动并享受。
