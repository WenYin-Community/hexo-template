---
title: "RK3588设备更新UEFI edk2固件"
date: 2025-11-18
categories:
  - "硬件设备"
tags:
  - "rk3588"
  - "uefi"
  - "edk2"
---

```bash
sudo dd if=rock-5b_UEFI_Release_v1.1.img of=/dev/mtdblock0 conv=notrunc
sync
reboot
```
