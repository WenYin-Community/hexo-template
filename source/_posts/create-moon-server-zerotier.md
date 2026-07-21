---
title: "架设moon服务器加快zerotier的访问速度"
date: 2025-08-18
categories:
  - "网络与代理"
tags: 
  - "zerotier"
---

## 1. 使用服务器安装 zerotier 客户端

```bash
curl -s https://install.zerotier.com/ | sudo bash
```

### 启动 zerotier 服务

```bash
sudo systemctl start zerotier-one.service
sudo systemctl enable zerotier-one.service
```

### 加入你的 zerotier 网络

```bash
sudo zerotier-cli join 你的网络ID
```

如果成功的话，我们会在 zerotier 的管理页面里看到你的新服务器。给它把 Auth 那一栏给勾上，这样你的服务器就加入网络了。

## 2. 配置 moon 节点

### 生成一个 moon 文件

```bash
cd /var/lib/zerotier-one
sudo zerotier-idtool initmoon identity.public > moon.json
```

### 修改 moon.json

```bash
sudo nano moon.json
```

在 `stableEndpoints` 中括号里输入 `"你的服务器公网ip/9993"`，保存退出。注意两头加引号 `""`。

### 生成 moon 签名文件

```bash
sudo zerotier-idtool genmoon moon.json
```

这个时候下面会跳出来一行 wrote 开头的代码就说明写入成功了。

### 创建 moons.d 文件夹

```bash
sudo mkdir moons.d
```

### 移动签名文件

```bash
sudo mv 一串数字.moon moons.d/
```

这一步是把上次生成的签名文件移动到 moons.d 文件夹里。那个看起来一长串乱码的 .moon 文件的名字在那一行 wrote 开头的代码里可以看到，实在看不到就打个 `ls` 回车就看到了。

做完这些你的 moon 服务器就算配置完成，重启下 zerotier 服务：

```bash
sudo systemctl restart zerotier-one
```

然后保存 moon 文件，复制到其他客户端 moons.d 目录，再重启服务即可。

使用以下命令查看是否接入 moon 节点：

```bash
zerotier-cli listpeers
```

### 注意：在群晖 DSM 7 上面通过"我不是矿神"第三方源安装 zerotier 位置为（volume 为安装的存储空间编号）：

```
/volume1/@appdata/zerotier
```
