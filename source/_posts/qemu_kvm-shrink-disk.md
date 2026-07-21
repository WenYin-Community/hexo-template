---
title: "Qemu_kvm虚拟机缩小磁盘容量"
date: 2025-11-12
categories:
  - "虚拟化"
tags: 
  - "kvm"
---

用 0 填充 C 分区空闲区域：

```bash
sdelete -z c:
```

关闭客户机。

最后在 KVM 主机上转换 qcow2 磁盘镜像文件：

```bash
qemu-img convert -O qcow2 windows.qcow2 windows_new.qcow2
```

如果是派生镜像需要加 `-B` 来指定 back_file 原镜像。

参考 [qemu-img 文档](https://qemu.readthedocs.io/en/latest/tools/qemu-img.html#cmdoption-qemu-img-arg-convert)

转换完成后可以看到 windows_new.qcow2 占用的 KVM 主机存储空间与客户机使用的磁盘空间基本是一致的。然后用新的磁盘镜像文件 windows_new.qcow2 启动客户机即可。
