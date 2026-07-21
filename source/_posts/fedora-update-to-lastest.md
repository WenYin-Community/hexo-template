---
title: "Fedora 更新到最新版"
date: 2025-05-10
categories:
  - "Linux"
tags:
  - "dnf"
  - "fedora"
  - "linux"
  - "package-management"
---

## 更新系统

```bash
sudo dnf update
```

## 卸载旧包

```bash
sudo dnf autoremove
```

## 配置 dnf 加速

```bash
sudo nano /etc/dnf/dnf.conf
```

从 3 到 20 的数字——这意味着可以使用 dnf 完成许多数字包的下载：

```
max_parallel_downloads=10
```

## 安装升级插件

```bash
sudo dnf install dnf-plugin-system-upgrade
```

## 升级到新版

```bash
sudo dnf system-upgrade download --releasever=43
```

（可选）允许清除不兼容软件包：

```bash
sudo dnf system-upgrade download --releasever=43 --allowerasing
```

## 安装升级

```bash
sudo dnf offline reboot
```

## 重置 selinux

```bash
sudo fixfiles -B onboot
```

## 验证

```bash
cat /etc/os-release
```

## 升级后清理

```bash
sudo dnf system-upgrade clean
```

对损坏的符号链接进行排序：

```bash
sudo symlinks -r /usr | grep dangling
```

删除所有损坏的符号链接：

```bash
sudo symlinks -r -d /usr
```
