---
title: "在 Fedora 下重建 GRUB 配置文件"
date: 2026-04-04
categories:
  - "Linux"
tags:
  - "fedora"
  - "grub"
  - "linux"
---
在 Fedora 下，重建（更新）GRUB 配置文件的命令取决于你的系统启动模式（UEFI 或 Legacy BIOS）以及安装方式。

对于绝大多数现代 Fedora 系统（UEFI 启动），请使用以下命令：

### 1. 标准 UEFI 系统（最常见）
```bash
sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg
```

### 2. 传统 BIOS/Legacy 系统
```bash
sudo grub2-mkconfig -o /boot/grub2/grub.cfg
```

### 3. 通用自动检测命令（推荐）
如果你不确定路径，Fedora 提供了一个脚本可以自动判断并写入正确位置：
```bash
sudo grub2-mkconfig -o $(find /boot -name "grub.cfg" | head -n 1)
```
*注意：如果找到多个 `grub.cfg`，请确保选择 `/boot/efi/EFI/fedora/grub.cfg` (UEFI) 或 `/boot/grub2/grub.cfg` (BIOS)。*

---

### 完整操作流程（针对你之前的 DG1 问题）

假设你要添加 `i915.enable_guc=0` 参数：

1.  **编辑配置文件**：
    ```bash
    sudo vi /etc/default/grub
    ```
    找到 `GRUB_CMDLINE_LINUX` 行，在引号内追加参数：
    ```text
    GRUB_CMDLINE_LINUX="... existing_params ... i915.enable_guc=0"
    ```

2.  **重建 GRUB 配置**：
    ```bash
    # 如果是 UEFI 系统（大多数情况）
    sudo grub2-mkconfig -o /boot/efi/EFI/fedora/grub.cfg
    
    # 如果是 BIOS 系统
    sudo grub2-mkconfig -o /boot/grub2/grub.cfg
    ```

3.  **验证更改**（可选）：
    检查生成的文件中是否包含新参数：
    ```bash
    grep "i915.enable_guc=0" /boot/efi/EFI/fedora/grub.cfg
    # 或
    grep "i915.enable_guc=0" /boot/grub2/grub.cfg
    ```

4.  **重启系统**：
    ```bash
    sudo reboot
    ```

### 常见问题排查
*   **权限拒绝**：务必使用 `sudo`。
*   **文件不存在**：如果 `/boot/efi/EFI/fedora/grub.cfg` 不存在，请检查 `/boot/efi/EFI/` 目录下是否有其他文件夹（如 `fedora` 可能拼写不同，或者在 `BOOT` 文件夹下）。通常 Fedora 默认路径是 `/boot/efi/EFI/fedora/grub.cfg`。
*   **BLS 启动加载器**：Fedora 默认使用 BLS (Boot Loader Specification)。直接编辑 `/etc/default/grub` 并运行 `grub2-mkconfig` 是兼容且安全的做法，它会自动生成 BLS 条目。不要手动编辑 `/boot/loader/entries/` 下的文件，因为它们会在内核更新时被覆盖。
