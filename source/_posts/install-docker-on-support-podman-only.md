---
title: "在仅支持Podman的系统（如RHEL/Rocky）中安装Docker"
date: 2023-05-17
categories:
  - "Linux"
tags:
  - "docker"
  - "redhat"
  - "podman"
  - "rhel"
  - "linux"
---

Docker 是一个应用程序，它使在容器中运行应用程序进程变得简单和容易，这就像虚拟机一样，只是更便携，更资源友好，更依赖于主机操作系统。有关 Docker 容器的不同组件的详细介绍，请查看 [Docker 生态系统：通用组件介绍](https://www.digitalocean.com/community/tutorials/the-docker-ecosystem-an-introduction-to-common-components)。

在本教程中，您将学习如何在现有的 Rocky Linux 9 安装上安装和使用它。

Rocky Linux 9 服务器的非 root 用户使用 [Rocky Linux 9 的初始设置指南设置了 `sudo` 权限](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-rocky-linux-9)，解释了如何设置。

本教程中的所有命令都应以非 root 用户身份运行。如果该命令需要 root 访问权限，则它将以 `sudo` 开头。[Rocky Linux 9 的初始设置指南](https://www.digitalocean.com/community/tutorials/initial-server-setup-with-rocky-linux-9) 解释了如何添加用户并为他们提供 sudo 访问权限。

## 安装 Docker

Rocky Linux 9 官方存储库中提供的 Docker 安装包可能不是最新版本。要获得最新和最好的版本，请从官方 Docker 存储库安装 Docker。本节将向您展示如何做到这一点。

首先，让我们更新包数据库：

```bash
sudo dnf check-update
```

接下来，添加官方 Docker 仓库：

```bash
sudo dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
```

虽然 Docker 没有 Rocky Linux 特定的存储库，但 Rocky Linux 基于 CentOS，可以使用相同的存储库。添加存储库后，安装 Docker，它由三个包组成：

```bash
sudo dnf install docker-ce docker-ce-cli containerd.io
```

安装完成后，启动 Docker 守护进程：

```bash
sudo systemctl start docker
```

验证它是否正在运行：

```bash
sudo systemctl status docker
```

输出应类似于以下内容，显示服务处于活动状态并正在运行：

```
docker.service - Docker Application Container Engine
Loaded: loaded (/lib/systemd/system/docker.service; enabled; vendor preset: enabled)
Active: active (running) since Sun 2016-05-01 06:53:52 CDT; 1 weeks 3 days ago
Docs: https://docs.docker.com
Main PID: 749 (docker)
```

最后，确保它在每次服务器重新启动时启动：

```bash
sudo systemctl enable docker
```

来源：[How to Install and Use Docker on Rocky Linux 9](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-rocky-linux-9)
