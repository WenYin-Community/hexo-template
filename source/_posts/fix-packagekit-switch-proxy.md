---
title: "修复PackageKit无法正确切换代理"
date: 2023-04-26
categories:
  - "网络与代理"
tags:
  - "packagekit"
  - "代理"
  - "软件包"
  - "proxy"
coverImage: "Screenshot_20230426_085146.png"
---

使用过代理在图形界面下安装软件包后，会出现这样的毛病：

[![](images/Screenshot_20230426_084431-1276x720.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/Screenshot_20230426_084431.png)

目前确认为 PackageKit 软件包的问题，无法正确切换代理，需要手动编辑配置（数据库）。

## 解决方案

### 命令行操作

1. 安装 sqlite3：

```bash
sudo dnf/apt install sqlite3
```

2. 删除代理设置：

```bash
sudo sqlite3 /var/lib/PackageKit/transactions.db
DELETE FROM proxy;
.exit
```

3. 重启 packagekit：

```bash
sudo systemctl restart packagekit
```

### 图形界面操作

1. 安装 sqlitebrowser：

```bash
sudo dnf/apt install sqlitebrowser
```

2. 删除代理设定：

```bash
sudo sqlitebrowser /var/lib/PackageKit/transactions.db
```

点击浏览数据页面，选择表名 proxy 并删除所有数据。

[![](images/Screenshot_20230426_085129-640x480.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/Screenshot_20230426_085129.png)

[![](images/Screenshot_20230426_085146-640x480.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/Screenshot_20230426_085146.png)

3. 重启 packagekit：

```bash
sudo systemctl restart packagekit
```

来源：[PackageKit Issue #392](https://github.com/PackageKit/PackageKit/issues/392#issuecomment-1077478068)
