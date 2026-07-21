---
title: "优化新型号英特尔显卡在Linux下的多媒体加速"
date: 2023-06-10
categories:
  - "硬件设备"
coverImage: "QQ图片20230707133452.png"
tags:
  - "linux"
  - "intel"
  - "graphics"
---

在比较新的 Linux 发行版上为英特尔显卡获得硬件加速需要一些修改，因为默认值是面向最大稳定性而不是性能的，即使在内核和相关软件包中支持的较新硬件上也是如此。

我一直在尝试记录在较新的硬件上首次安装 Fedora 时要采取的步骤（例如：Intel gen11+（比如我的 Thinkpad X1 Carbon Gen 9，带 Iris Xe 显卡），并希望了解社区对它们的看法：

查看显卡型号：

[![](images/QQ图片20230707133452-640x108.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/06/QQ图片20230707133452.png)

```bash
lspci -nn |grep -Ei 'VGA|DISPLAY'
```

输出示例：

```
0000:00:02.0 VGA compatible controller [0300]: Intel Corporation TigerLake-LP GT2 [Iris Xe Graphics] [8086:9a49] (rev 01)
0000:03:00.0 VGA compatible controller [0300]: Intel Corporation DG1 [Iris Xe MAX Graphics] [8086:4905] (rev 01)
```

---

## 1. 安装 RPMFusion 源

```bash
sudo dnf install https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
sudo dnf install https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm
```

## 2. 安装 multimedia 软件包 & Intel tools

```bash
sudo dnf groupinstall multimedia
sudo dnf install intel-media-driver libva libva-utils gstreamer1-vaapi ffmpeg intel-gpu-tools mesa-dri-drivers mpv
```

## 3. 添加 Libva 初始化环境

在 `/etc/environment` 中添加：

```bash
LIBVA_DRIVER_NAME=iHD
```

## 4. 启用英特尔 GuC、HuC 和帧缓冲区压缩

GuC 和 HuC 是英特尔显卡[新一代内置的功能](https://01.org/linuxgraphics/downloads/firmware)，显然具有功耗和性能优势。

添加内核参数以加载 GuC 和 HuC（与流行的看法相反，[它们默认情况下不启用，除非在 Intel gen12+ 平台](https://wiki.archlinux.org/title/Intel_graphics#Enable_GuC_/_HuC_firmware_loading)在内核中）通过输入以下内容：

```bash
sudo nano /etc/modprobe.d/i915.conf
```

添加以下内容：

```bash
options i915 enable_guc=3
options i915 enable_fbc=1
```

然后重建 initramfs：

```bash
sudo dracut --force
```

## 5. 测试以确保一切都已启用并正常工作

测试 VA-API 支持并与[vainfo ArchWiki 部分](https://wiki.archlinux.org/title/Hardware_video_acceleration#Verifying_VA-API)比较。

检查以确保启用了 GuC 和 HuC：

```bash
sudo dmesg | grep guc
sudo dmesg | grep huc
```

应该返回类似内容：

```
GuC firmware i915/tgl_guc_62.0.0.bin version 62.0 submission:enabled
HuC firmware i915/tgl_huc_7.9.3.bin version 7.9 authenticated:yes
```

测试 VA-API 支持：

1. [下载测试视频文件](https://test-videos.co.uk/bigbuckbunny/mp4-h264)

2. 打开一个新的终端窗口并运行 `sudo intel_gpu_top`（保持这个窗口打开）

3. 在单独的终端窗口中，运行 `mpv --hwdec=auto <video file>`

4. 返回 intel_gpu_top 终端窗口并检查以确保"视频"栏显示活动，这表明视频正在正确加速。

## 6. 浏览器中的硬件加速

目前，Chrome/Chromium 和 Firefox 的最新版本浏览器（Chrome/Chromium 100 和 Firefox 98）在使用 Wayland 时都存在硬件加速问题。希望未来的版本能很快再次支持 VA-API。

---

对以上有什么想法吗？寻找有关要安装的软件包的任何建议，错过的任何优化等。

仍然困扰我的一件事是，`VideoEnhance` 即使在播放加速视频时，intel_gpu_top 中的引擎仍然没有显示任何活动。不清楚为什么会这样，但如果其他人已经成功了，请告诉我，我可以添加这些步骤。

来源：[优化新型号英特尔显卡在Linux下的多媒体加速](https://discussion.fedoraproject.org/t/intel-graphics-best-practices-and-settings-for-hardware-acceleration/69944)
