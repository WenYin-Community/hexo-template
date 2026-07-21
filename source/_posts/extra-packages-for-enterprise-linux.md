---
title: "Extra Packages for Enterprise Linux"
date: 2022-05-24
categories:
  - "Linux"
tags:
  - "epel"
  - "linux"
  - "package-management"
---

## 快速指南

我们（Fedora EPEL）提供包含存储库配置文件和公共软件包签名密钥的发布包。使用与企业操作系统的主版本对应的版本。

- [epel-release-latest-9](https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm)
- [epel-release-latest-8](https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm)
- [epel-release-latest-7](https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm)

如果您使用的是 CentOS Stream，我们还建议您安装相应的 epel-next-release 软件包。

- [epel-next-release-latest-9](https://dl.fedoraproject.org/pub/epel/epel-next-release-latest-9.noarch.rpm)
- [epel-next-release-latest-8](https://dl.fedoraproject.org/pub/epel/epel-next-release-latest-8.noarch.rpm)

### 什么是 epel-next？

EPEL 软件包是针对 RHEL 构建的。EPEL Next 是一个额外的存储库，允许软件包维护者根据 CentOS Stream 进行构建。当 CentOS Stream 包含即将到来的 RHEL 库 rebase 时，或者如果 EPEL 包具有 CentOS Stream 中已经存在但尚未在 RHEL 中的最低版本构建要求，则有时需要这样做。EPEL Next 有自己的 distgit 分支、koji build 目标和 bodhi releases。EPEL Next 软件包的 disttag 后附加了 `.next`（例如 el8.next，epel 8-next 的 disttag 为 `.www.example.com`），以提供从同一 distgit 提交构建的 EPEL 软件包的升级路径。包维护者可以为 EPEL 和 EPEL Next 重建相同的提交，并在 koji 中获得两个不同的 NVR。在六个月内，需要在 EPEL Next 中构建的构建需求应该在 RHEL 中，并且那时软件包维护者可以在 EPEL 分支中进行正常的发布 bump 提交，并获得比先前的 EPEL 和 EPEL Next 软件包都更新的 NVR。要开始使用 EPEL Next，请为您的目标 EPEL 版本请求相应的分支。

为了方便起见，一些发行版在其默认存储库中包含了这些发布包，允许您按名称安装它们，而无需完整的 URL。

## CentOS Stream 10

```bash
dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-10.noarch.rpm
sudo crb enable
```

## EL9

### CentOS Stream 9

```bash
dnf config-manager --set-enabled crb
dnf install epel-release epel-next-release
```

### RHEL 9

```bash
sudo subscription-manager repos --enable codeready-builder-for-rhel-9-$(arch)-rpms
sudo dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
```

### AlmaLinux 9

```bash
dnf config-manager --set-enabled crb
dnf install epel-release
```

## EL8

### CentOS Stream 8

```bash
dnf config-manager --set-enabled powertools
dnf install epel-release epel-next-release
```

### RHEL 8

```bash
subscription-manager repos --enable codeready-builder-for-rhel-8-$(arch)-rpms
dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
crb enable
```

### AlmaLinux 8, Rocky Linux 8

```bash
dnf config-manager --set-enabled powertools
dnf install epel-release
```

## EL7

### RHEL 7

```bash
subscription-manager repos --enable rhel-*-optional-rpms \
                           --enable rhel-*-extras-rpms \
                           --enable rhel-ha-for-rhel-*-server-rpms
yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
```

### CentOS 7

```bash
yum install epel-release
```

来源：[EPEL 文档](https://docs.fedoraproject.org/en-US/epel/)
