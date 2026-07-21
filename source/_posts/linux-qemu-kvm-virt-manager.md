---
title: "Linux install qemu-kvm and virt-manager"
date: 2022-12-03
categories:
  - "虚拟化"
tags:
  - "kvm"
  - "libvirt"
  - "virt-manager"
  - "linux"
  - "qemu"
---

1、更新软件源

```
sudo apt-get update
```

2、安装 virt-manager和依赖：

`sudo apt-get install virt-manager qemu-system libvirt-bin qemu-kvm libvirt-dev`

`sudo dnf group install virtualization`

3.启动下列服务（Fedora）：

```
virtinterfaced.socket
virtnetworkd.socket
virtnodedevd.socket
virtnwfilterd.socket
virtproxyd.socket
virtqemud.service
virtsecretd.socket
virtstoraged.socket
```

4.添加用户组：

`sudo usermod -a -G libvirt ${USER}`
