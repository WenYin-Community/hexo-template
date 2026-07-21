---
title: "如何将win10/win11的wsl子系统移动到其他位置"
date: 2023-04-22
categories:
  - "Windows"
coverImage: "QQ图片20230422112512.png"
tags:
  - "windows10"
  - "windows"
  - "wsl"
---

> **建议使用** [DDoSolitary/LxRunOffline](https://github.com/DDoSolitary/LxRunOffline) 工具进行配置。
>
> 但此工具长期未更新，在高版本 Win11 上面疑似失效（原因不明），在此提供使用 WSL 内置命令的方法。

## 适用于 Win10/11 支持 WSL1 和 WSL2 的所有版本

首先按正常方法安装 WSL，并启动运行。

确认安装好后，切换到系统的 cmd/powershell，执行：

```bash
# 显示已安装的发行版
wsl --list

# 关闭正在运行的 WSL 容器
wsl --shutdown
```

## 导出需要移动或备份的发行版

完成后可随意删除 appx 商店的应用，已不再需要。

```bash
wsl --export debian e:/WSL/debian.tar
wsl --unregister debian
wsl --import debian e:/WSL/debian e:/WSL/Debian.tar
```

输入 `wsl`，确认正常运行即可，将自动添加到 Windows Terminal 标签页中，但不会生成开始菜单选项。

## 按此方法修改位置后，默认将使用 root 登录，如何修复？

### 方法 1

在 Terminal 的 WSL 启动选项添加 `-u %USER` 参数，示例：

[![](images/QQ图片20230422112015.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/QQ图片20230422112015.png)

### 方法 2

在 WSL 中创建 `/etc/wsl.conf` 文件，输入以下内容：

[![](images/QQ图片20230422112512.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/QQ图片20230422112512.png)
