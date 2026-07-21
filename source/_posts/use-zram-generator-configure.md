---
title: "使用zram-generator配置zram"
date: 2025-08-17
categories:
  - "Linux"
tags:
  - "zram"
  - "systemd"
  - "linux"
  - "apt"
---

## 安装软件包

```bash
apt install systemd-zram-generator
```

## 配置 zram-generator

### 创建 zram-generator 配置文件

```bash
nano /etc/systemd/zram-generator.conf
```

### 填入配置

```ini
[zram0]
zram-size = min(ram / 2, 4096)
compression-algorithm = zstd
```

- zram 大小为内存的二分之一，最大 4096MiB

## 启动 zram

```bash
sudo systemctl daemon-reload
sudo systemctl start systemd-zram-setup@zram0.service
```
