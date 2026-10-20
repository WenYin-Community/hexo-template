---
title: "显卡、显示与硬件加速合集"
author: "学姐大人"
date: 2026-04-28
categories:
  - "开发工具"
tags:
  - "graphics"
  - "intel"
  - "hardware-acceleration"
  - "wayland"
  - "linux"
---

Intel 核显/独显在 Linux 下的驱动与加速、浏览器硬解、XWayland 缩放，以及几款游戏的图形设置。

<!-- more -->

<a id="disable-intel-dg1-discrete-gpu"></a>

## 彻底禁用 DG1 独立显卡

彻底禁用 DG1 独立显卡有几种方法，取决于你是想**完全切断电源/驱动加载**（最彻底），还是仅仅**不让图形应用使用它**。

鉴于你遇到的 `MMIO` 和 `GuC` 崩溃问题，推荐按以下顺序操作：

### 方法一：通过内核参数黑名单禁用 i915 对 DG1 的支持（推荐，最稳定）
这种方法会让内核完全忽略 DG1 显卡，不加载驱动，不分配资源。这是解决驱动崩溃最彻底的方法。

1.  **获取 DG1 的 PCI ID**
    从你之前的 `lspci` 输出可知，DG1 位于 `0000:03:00.0`，设备 ID 是 `4905`。

2.  **编辑 Grub 配置**
    ```bash
    sudo vi /etc/default/grub
    ```

3.  **添加 `modprobe.blacklist` 或 `rd.driver.blacklist`**
    在 `GRUB_CMDLINE_LINUX` 中添加以下参数：
    
    *方案 A：直接禁用 i915 驱动对特定设备的绑定（更精准）*
    ```text
    i915.disable_devices=0x4905
    ```
    *(注意：`disable_devices` 参数在某些旧内核中可能不可用，如果无效请尝试方案 B)*

    *方案 B：完全禁用 i915 驱动（会影响核显，**不推荐**，除非你只用 DG1）*
    ```text
    modprobe.blacklist=i915
    ```
    *(警告：这会同时禁用你的 TigerLake 核显，导致没有图形界面！请勿使用此条，除非你有其他显卡)*

    *方案 C：使用 `pci-stub` 或 `vfio-pci` 接管设备（最彻底的内核级禁用）*
    在 `GRUB_CMDLINE_LINUX` 中添加：
    ```text
    pci-stub.ids=8086:4905
    ```
    或者如果你加载了 `vfio-pci` 模块：
    ```text
    vfio-pci.ids=8086:4905
    ```

    **推荐组合（针对你的双显卡笔记本/主机）：**
    由于 `i915` 是一个驱动管理所有 Intel GPU，很难只禁用其中一个而不影响另一个。最可靠的方法是**让驱动加载但强制不使用 DG1**，或者**物理/BIOS 禁用**。

    **修正推荐：使用 `modprobe` 配置禁用特定设备**
    
    其实，对于 Intel 双显卡，最简单的“软禁用”是让系统**只使用核显**。Vulkan 应用通常默认选择第一个 GPU 或离散 GPU。我们可以通过环境变量强制应用使用核显，从而“逻辑禁用” DG1。

    但如果要**彻底从系统层面移除 DG1**，最有效的是 **BIOS 禁用**（见方法三）。如果 BIOS 没选项，请使用下面的 **Method 2**。

### 方法二：通过 Xorg/Wayland 配置忽略 DG1（仅图形层面）
如果你只是不想让桌面环境或 Vulkan 应用用到 DG1，可以配置图形服务器忽略它。

1.  **创建 Xorg 配置文件** (如果使用 X11)
    ```bash
    sudo vi /etc/X11/xorg.conf.d/10-ignore-dg1.conf
    ```
    内容：
    ```text
    Section "Device"
        Identifier "Intel DG1"
        Driver "modesetting"
        BusID "PCI:3:0:0"
        Option "Ignore" "true"
    EndSection
    ```

2.  **对于 Wayland/Vulkan 应用**
    在运行应用时，强制指定使用核显（TigerLake）：
    ```bash
    # 查找核显的 VK_DEVICE_ID 或索引
    vulkaninfo --summary | grep -A 5 "TigerLake"
    
    # 运行 vkcube 时指定设备索引 (假设核显是 index 0)
    vkcube --gpu_number 0
    ```

### 方法三：在 BIOS/UEFI 中禁用（最彻底，硬件层面）
这是解决 `MMIO` 错误最根除的方法，因为硬件根本不会被枚举。

1.  重启电脑，进入 BIOS/UEFI 设置（通常按 F2, Del, 或 F12）。
2.  寻找 **Graphics Configuration**, **Video**, 或 **System Agent** 选项。
3.  查找 **Discrete Graphics**, **External GPU**, 或 **DG1** 相关选项。
4.  将其设置为 **Disabled** 或 **Auto** (如果 Auto 依然报错，尝试强制使用 **Integrated Graphics** 作为主显示)。
5.  保存并退出。

*注意：许多笔记本电脑不允许完全禁用独显，只能切换“混合模式”或“独显直连”。如果是台式机，可以直接拔掉 DG1 显卡。*

### 方法四：卸载/屏蔽 Vulkan ICD 文件（仅 Vulkan 层面）
如果你只是想让它不在 Vulkan 应用中可见：

1.  找到 DG1 的 Vulkan ICD 文件：
    ```bash
    ls /usr/share/vulkan/icd.d/
    # 通常有一个 intel_icd.x86_64.json，它同时包含核显和独显
    ```
    *遗憾：Intel 的 Vulkan 驱动通常在一个 ICD 文件中管理所有 Intel GPU，无法简单通过删除文件来只禁用 DG1 而保留核显。*

### 总结建议

鉴于你的 DG1 存在严重的内核级崩溃（MMIO Error）：

1.  **首选**：**BIOS 禁用**。如果 BIOS 有关闭独显的选项，直接关闭。这是最安全、最彻底的。
2.  **次选**：**内核参数隔离**。如果 BIOS 无法禁用，尝试使用 `pci-stub.ids=8086:4905`。
    *   编辑 `/etc/default/grub`
    *   添加 `pci-stub.ids=8086:4905`
    *   `sudo update-grub` && `sudo reboot`
    *   验证：`lspci -nnk | grep -A 5 4905`。如果驱动栏显示 `Kernel driver in use: pci-stub` 或为空，则成功禁用。
3.  **临时方案**：如果上述都太复杂，继续使用方法一中的 **`i915.enable_guc=0`**，虽然 DG1 还在工作，但至少不会崩溃。然后在使用 Vulkan 应用时，强制指定使用核显：
    ```bash
    # 强制 vkcube 使用第一个 GPU (通常是核显)
    vkcube --gpu_number 0
    ```

**如何验证 DG1 已被内核隔离（使用 pci-stub 方法）：**
```bash
lspci -nnk -s 03:00.0
```
如果输出中 `Kernel driver in use` 一行消失，或变为 `pci-stub`，则 DG1 已彻底禁用，不会再产生任何 `dmesg` 错误。

<a id="how-to-run-intel-arc-on-fedora"></a>

## 如何让Intel Arc在Fedora上面运行

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

<a id="intel-graphics-best-practices-and-settings-for-hardware-acceleration"></a>

## 优化新型号英特尔显卡在Linux下的多媒体加速

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

<a id="firefox-anable-hardware-decoder"></a>

## Firefox 打开视频硬解码功能

## Hardware Video Acceleration

This is for **Debian 11 / Bullseye**

Setup your system and install required packages: [https://wiki.debian.org/HardwareVideoAcceleration](https://wiki.debian.org/HardwareVideoAcceleration)

Starting around version 95 Firefox has enabled hardware video acceleration via VA-API but still needs to be manually turned on. [firefox-esr](https://packages.debian.org/firefox-esr) version 102 is available from the [Debian Security](https://www.debian.org/security/) repositories for Debian 11 since 2022-09-23.

Enter `about:config` in address bar:

| 配置项 | 值 | 说明 |
| --- | --- | --- |
| media.ffmpeg.vaapi.enabled | true | AVC/h.264 HEVC/h.265 works |
| media.ffvpx.enabled | false | disables firefox internal software decoding of VP8/VP9 and forces hardware decoding |

Then launch firefox based on whether you use X11 or Wayland:

| 环境 | 环境变量 |
| --- | --- |
| X11 | `MOZ_X11_EGL=1` |
| Wayland/Xwayland | `MOZ_ENABLE_WAYLAND=1` |

e.g. .desktop launcher command for X11 and Mozilla binary:

```bash
Exec=env MOZ_X11_EGL=1 /home/user/firefox/firefox
```

For version 96 and above, the above settings may change.

<a id="l4d2-graphics-config"></a>

## 求生之路2图形设定

steamapps\\common\\Left 4 Dead 2\\left4dead2\\cfg\\video.txt

```
"VideoConfig"
{
"setting.cpu_level" "2"
"setting.gpu_level" "0"
"setting.mat_antialias" "1"
"setting.mat_aaquality" "0"
"setting.mat_forceaniso" "1"
"setting.mat_vsync" "1"
"setting.mat_triplebuffered" "0"
"setting.mat_grain_scale_override" "0.000000"
"setting.mat_monitorgamma" "2.196800"
"setting.gpu_mem_level" "2"
"setting.mem_level" "2"
"setting.mat_queue_mode" "-1"
"setting.defaultres" "1920"
"setting.defaultresheight" "1080"
"setting.aspectratiomode" "1"
"setting.fullscreen" "0"
"setting.nowindowborder" "1"
"setting.mat_tonemapping_occlusion_use_stencil" "1"
}
```

[![](images/QQ图片20230406191836-640x480.jpg)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/QQ图片20230406191836.jpg)

<a id="xwayland-app-scale"></a>

## 在XWayland应用中调整缩放

在 `~/.Xresources` 文件中添加以下内容：

```
Xft.dpi:       120
Xft.antialias: true
Xft.hinting:   true
Xft.autohint:  false
Xft.hintstyle: hintslight
Xft.lcdfilter: lcddefault
Xft.rgba:      rgb
```

然后执行：

```bash
nano ~/.Xresources
```

[![](images/Screenshot_20240401_215747.png)](https://wiki.wenyinos.com/wp-content/uploads/2024/04/Screenshot_20240401_215747.png)

<a id="fedora-install-intel-opencl-ipex-llm"></a>

## 在Fedora安装Intel OpenCL套件以运行ipex-llm

`sudo dnf install intel-compute-runtime intel-opencl`

[https://github.com/intel/ipex-llm/blob/main/docs/mddocs/Quickstart/ollama\_portable\_zip\_quickstart.zh-CN.md#linux%E7%94%A8%E6%88%B7%E6%8C%87%E5%8D%97](https://github.com/intel/ipex-llm/blob/main/docs/mddocs/Quickstart/ollama_portable_zip_quickstart.zh-CN.md#linux%E7%94%A8%E6%88%B7%E6%8C%87%E5%8D%97)
