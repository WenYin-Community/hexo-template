---
title: "GitHub Proxy"
date: 2022-10-30
categories:
  - "网络与代理"
tags:
  - "github"
  - "proxy"
---

### [https://git.951959483.xyz/](https://git.951959483.xyz/)

### 终端命令行

支持终端命令行 git clone、wget、curl 等工具下载。支持 raw.githubusercontent.com、gist.github.com、gist.githubusercontent.com 文件下载。

> **注意：**不支持 SSH Key 方式 git clone 下载。

---

## git clone

```bash
git clone https://git.951959483.xyz/https://github.com/stilleshan/ServerStatus
```

## git clone 私有仓库

Clone 私有仓库需要在 [Personal access tokens](https://github.com/settings/tokens) 申请 Token 配合使用：

```bash
git clone https://user:your_token@git.951959483.xyz/https://github.com/your_name/your_private_repo
```

## wget & curl

```bash
wget https://git.951959483.xyz/https://github.com/stilleshan/ServerStatus/archive/master.zip
wget https://git.951959483.xyz/https://raw.githubusercontent.com/stilleshan/ServerStatus/master/Dockerfile
curl -O https://git.951959483.xyz/https://github.com/stilleshan/ServerStatus/archive/master.zip
curl -O https://git.951959483.xyz/https://raw.githubusercontent.com/stilleshan/ServerStatus/master/Dockerfile
```

## 首页下载

在本页地址栏输入合规链接（参考以下链接）点击下载按钮，支持 raw.githubusercontent.com、gist.github.com、gist.githubusercontent.com 文件下载。

---

## Raw 文件

```
https://raw.githubusercontent.com/stilleshan/ServerStatus/master/Dockerfile
```

## 分支源码

```
https://github.com/stilleshan/ServerStatus/archive/master.zip
```

## Releases 源码

```
https://github.com/stilleshan/ServerStatus/archive/v1.0.tar.gz
```

## Releases 文件

```
https://github.com/fatedier/frp/releases/download/v0.33.0/frp_0.33.0_linux_amd64.tar.gz
```
