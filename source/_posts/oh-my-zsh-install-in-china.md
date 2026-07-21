---
title: "在国内安装 oh-my-zsh"
date: 2023-06-29
categories:
  - "开发工具"
coverImage: "QQ图片20230629195511.png"
tags:
  - "zsh"
---

## 安装 zsh

Ubuntu 下：

```bash
apt-get install zsh
```

macOS 下：

```bash
brew install zsh
```

后面的内容两个系统通用。

## 安装 oh-my-zsh

```bash
wget https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh
```

然后给 install.sh 添加权限：

```bash
chmod +x install.sh
```

然后执行 install.sh：

```bash
./install.sh
```

如果发现很慢，可以修改为 gitee：

```bash
vim install.sh
```

进入编辑状态，找到以下部分：

```bash
# Default settings
ZSH=${ZSH:-~/.oh-my-zsh}
REPO=${REPO:-ohmyzsh/ohmyzsh}
REMOTE=${REMOTE:-https://github.com/${REPO}.git}
BRANCH=${BRANCH:-master}
```

然后将中间两行改为：

```bash
REPO=${REPO:-mirrors/oh-my-zsh}
REMOTE=${REMOTE:-https://gitee.com/${REPO}.git}
```

然后保存退出，重新执行即可。

[![](images/QQ图片20230629195511-640x370.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/06/QQ图片20230629195511.png)

---

版权声明：本文为 CSDN 博主「菜饼同学」的原创文章，遵循 CC 4.0 BY-SA 版权协议，转载时请附上原文出处链接及本声明。
原文链接：https://blog.csdn.net/qwe641259875/article/details/107201760/
