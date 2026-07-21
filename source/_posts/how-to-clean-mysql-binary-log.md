---
title: "mysql日志文件mysql-bin太大怎么办"
date: 2023-04-01
categories:
  - "开发工具"
tags:
  - "mysql"
---

宝塔面板的临时存储文件/www/server/data/太大,50G磁盘，用了近30G ，那么如何腾空这些无用文件呢？

解决方式：

1.禁用MySQL日志：修改/etc/my.cnf 文件

```text
log-bin=mysql-bin
binlog_format=mixed
server-id = 1
expire_logs_days = 10
```

重启 mysql

2.删除日志

清空面板回收站

```text
rm -rf /www/Recycle_bin/*
```

清除mysql二进制日志(操作过程中会停止、重启数据库)

```text
/etc/init.d/mysqld stop rm -f /www/server/data/ib_logfile* rm -f /www/server/data/mysql-bin.* /etc/init.d/mysqld start
```

清理完毕后可以输入以下命令检查磁盘剩余空间

```text
df -h
```

可以看见磁盘腾出了大部分空间，清理空间成功

转载请注明：[藏羚骸的博客~宝塔mysql日志文件mysql-bin太大怎么办](https://link.zhihu.com/?target=http%3A//zlhdsg.com/2022/04/27/%25e5%25ae%259d%25e5%25a1%2594mysql%25e6%2597%25a5%25e5%25bf%2597%25e6%2596%2587%25e4%25bb%25b6mysql-bin%25e5%25a4%25aa%25e5%25a4%25a7%25e6%2580%258e%25e4%25b9%2588%25e5%258a%259e/).
