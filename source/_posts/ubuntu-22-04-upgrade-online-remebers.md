---
title: "Ubuntu 22.04在线升级注意事项"
date: 2023-04-25
categories:
  - "Linux"
tags:
  - "ssh"
  - "ubuntu"
  - "linux"
---

### 1. 某些云服务商使用自定义镜像源

在直接使用在线更新时会被禁用，需要使用下列命令更新：

```bash
RELEASE_UPGRADER_ALLOW_THIRD_PARTY=1 do-release-upgrade
```

### 2. 新版搭载的 OpenSSH 软件包默认已拒绝 rsa-sha1 算法生成的密钥

请提前配置 sha2 密钥，如：

```bash
ssh-keygen -t rsa-sha2-512 -b 4096
```

如果您无法在本地计算机上更改任何内容，或者不想使用新密钥，并且希望在本地计算机上重新启用 RSA，请在远程计算机上编辑文件 `/etc/ssh/sshd_config` 并添加以下行：

```bash
HostKeyAlgorithms +ssh-rsa
PubkeyAcceptedKeyTypes +ssh-rsa
```

这将允许使用您已经拥有的不安全 RSA 密钥。

请记住通过以下方式重新启动 sshd 服务：

```bash
sudo systemctl restart sshd
```

否则，您必须重新启动计算机才能使更改生效。
