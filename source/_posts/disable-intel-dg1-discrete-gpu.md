---
title: "彻底禁用 DG1 独立显卡"
date: 2026-04-28
categories:
  - "硬件设备"
tags:
  - "intel"
  - "dg1"
  - "graphics"
---
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
