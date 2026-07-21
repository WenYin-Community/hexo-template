---
title: "Allow ssh port on SELinux"
date: 2023-07-06
categories:
  - "网络与代理"
coverImage: "HAGKQL4V1F3W7U59_OUL.png"
tags:
  - "linux"
  - "ssh"
  - "selinux"
---

## Step 3: Allow new SSH port on SELinux

The default port labelled for SSH is 22.

```bash
semanage port -l | grep ssh
```

输出：

```
ssh_port_t                     tcp      22
```

If you want to allow **sshd** to bind to network port configured, then you need to modify the port type to **ssh_port_t**.

```bash
sudo semanage port -a -t ssh_port_t -p tcp 2200
```

Confirm that the new port has been added to list of allowed ports for ssh:

```bash
semanage port -l | grep ssh
```

输出：

```
ssh_port_t                     tcp      2200, 22
```

[![](images/HAGKQL4V1F3W7U59_OUL-640x121.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/07/HAGKQL4V1F3W7U59_OUL.png)

## Step 4: Open SSH port on Firewalld

It is always recommended to keep the Firewall service running and only allow trusted services.

```bash
sudo firewall-cmd --add-port=2200/tcp --permanent
sudo firewall-cmd --reload
```
