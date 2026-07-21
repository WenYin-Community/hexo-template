---
title: "githubusercontent、github加速镜像"
date: 2022-10-22
categories:
  - "网络与代理"
tags: 
  - "github"
---

## 加速地址一览

- **[fastgit.org](https://hub.fastgit.org/)**：[https://doc.fastgit.org/](https://doc.fastgit.org/)
- **[cnpmjs.org](http://cnpmjs.org)**：[https://github.com.cnpmjs.org/](https://github.com.cnpmjs.org/)
- **[gitclone.com](http://gitclone.com)**：[https://gitclone.com/](https://gitclone.com/)
- **gitee**：[https://gitee.com/mirrors](https://gitee.com/mirrors)
- GitHub 文件加速：https://gh.api.99988866.xyz/
- Github 仓库加速：https://github.zhlh6.cn/
- Github 仓库加速：http://toolwa.com/github/

## 加速 clone

```bash
# 方法一：手动替换地址
# 原地址
git clone https://github.com/kubernetes/kubernetes.git
# 改为
git clone https://github.com.cnpmjs.org/kubernetes/kubernetes.git
# 或者
git clone https://hub.fastgit.org/kubernetes/kubernetes.git
# 或者
git clone https://gitclone.com/github.com/kubernetes/kubernetes.git

# 方法二：配置 git 自动替换
git config --global url."https://hub.fastgit.org".insteadOf https://github.com
# 测试
git clone https://github.com/kubernetes/kubernetes.git
# 查看 git 配置信息
git config --global --list
# 取消设置
git config --global --unset url.https://github.com/.insteadof
```

## 加速 release

```bash
# 原地址
wget https://github.com/goharbor/harbor/releases/download/v2.0.2/harbor-offline-installer-v2.0.2.tgz
# 加速下载方法一
wget https://download.fastgit.org/goharbor/harbor/releases/download/v2.0.2/harbor-offline-installer-v2.0.2.tgz
# 加速下载方法二
wget https://hub.fastgit.org/goharbor/harbor/releases/download/v2.0.2/harbor-offline-installer-v2.0.2.tgz
```

## 加速 raw

```bash
# 原地址
wget https://raw.githubusercontent.com/kubernetes/kubernetes/master/README.md
# 加速下载方法一
wget https://raw.staticdn.net/kubernetes/kubernetes/master/README.md
# 加速下载方法二
wget https://raw.fastgit.org/kubernetes/kubernetes/master/README.md
```
