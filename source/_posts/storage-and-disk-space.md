---
title: "存储、文件系统与空间回收合集"
author: "学姐大人"
date: 2026-05-08
categories:
  - "开发工具"
tags:
  - "storage"
  - "filesystem"
  - "disk"
  - "linux"
---

把空间要回来的几种做法：迁移 /home 并改 fstab、清 MySQL binlog、压缩虚拟机磁盘镜像。

<!-- more -->

<a id="home-space-migration-fstab-adjustment"></a>

## /home 空间迁移与 fstab 调整记录

本文记录一次 `/home` 空间压力处理：没有直接调整 XFS 分区，而是把部分用户目录迁移到 `/opt/home-offload/zemi`，再通过 bind mount 挂回原路径。

## 背景
系统未使用 LVM，`/` 与 `/home` 均为 XFS。XFS 不支持原地缩小，因此不适合直接缩小 `/` 后扩展 `/home`。

```text
/      XFS，约 75G，空闲较多
/home  XFS，约 50G，空间压力较大
```

最初计划是缩小 `/` 分区，把释放出的空间加给 `/home`；但 `/home` 位于 `/` 前面，且 `/` 为 XFS，实际操作会变成删除并重建根分区。

## 方案取舍
可行但高风险的离线方案是：用 Fedora LiveUSB 或 Rescue 环境启动，先备份根分区，再重建分区并恢复数据。

```text
xfsdump 备份 / -> 重建 / 分区 -> 扩展 /home -> xfsrestore 恢复 / -> 更新 fstab UUID -> 重建 dracut 和 GRUB
```

该方案没有执行。原因是需要删除并重建根分区，任何设备选错、备份损坏、UUID 未更新或引导修复失败，都可能导致系统无法启动。

## 实际迁移
最终将以下目录迁移到 `/opt/home-offload/zemi`，并通过 bind mount 挂回原路径：

```text
/home/zemi/.vscode/extensions
/home/zemi/.config/Code
/home/zemi/.config/google-chrome
/home/zemi/.config/QQ
/home/zemi/.local/share/zed
/home/zemi/.config/opencode
/home/zemi/.local/share/opencode
```

fstab 中为这些 bind mount 增加了 `nofail` 和 `x-systemd.requires-mounts-for=/opt/home-offload`：

```fstab
bind,nofail,x-systemd.requires-mounts-for=/opt/home-offload
```

`/home/zemi/.npm-global` 未迁移，因为当前会话依赖该目录中的可执行文件，迁移会影响正在运行的工具链。

## 清理与校验
迁移确认后，已先卸载 bind mount，确认原路径落在 `/home` 分区，再移动旧目录、重建挂载点、重新挂载，并删除被 bind mount 遮住的旧副本。

`/home/zemi/.cache` 中明确可重建的缓存（如 Chrome、Mozilla、libdnf5、opencode、uv、mesa shader、node-gyp、pnpm、pip 等）已清理；可能含用户状态的 `sessions`、`cliphist`、`thunderbird` 保留。

已执行 `findmnt --verify --verbose` 和 `mount -a --fake --verbose`。结果为 `0 parse errors, 0 errors, 4 warnings`；warning 来自工具无法直接探测部分磁盘文件系统类型，UUID 仍能解析到 `/`、`/boot/efi`、`/home` 和 `swap`。

## 结果与注意事项

```text
/home 已用约 26G -> 12G
/home 可用约 39G
/ 分区承载 offload 数据后仍约 37G 可用
```

Fedora 原地大版本升级前建议检查 `df -h / /home`、`findmnt | grep home-offload` 和 `sudo mount -a`。如果未来重装系统但保留 `/home`，必须单独备份 `/opt/home-offload/zemi`，因为它位于 `/` 分区。

回滚时先关闭对应应用，从 `/etc/fstab` 删除对应 bind mount 行，卸载挂载点，把数据从 `/opt/home-offload/zemi/...` 迁回原路径，再执行 `sudo systemctl daemon-reload` 和 `sudo mount -a`。

本次没有调整磁盘分区，也没有缩小 XFS 文件系统；实际采用的是更低风险的用户目录迁移方案，通过 bind mount 保持原路径不变。

<a id="how-to-clean-mysql-binary-log"></a>

## mysql日志文件mysql-bin太大怎么办

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

<a id="qemu_kvm-shrink-disk"></a>

## Qemu_kvm虚拟机缩小磁盘容量

用 0 填充 C 分区空闲区域：

```bash
sdelete -z c:
```

关闭客户机。

最后在 KVM 主机上转换 qcow2 磁盘镜像文件：

```bash
qemu-img convert -O qcow2 windows.qcow2 windows_new.qcow2
```

如果是派生镜像需要加 `-B` 来指定 back_file 原镜像。

参考 [qemu-img 文档](https://qemu.readthedocs.io/en/latest/tools/qemu-img.html#cmdoption-qemu-img-arg-convert)

转换完成后可以看到 windows_new.qcow2 占用的 KVM 主机存储空间与客户机使用的磁盘空间基本是一致的。然后用新的磁盘镜像文件 windows_new.qcow2 启动客户机即可。
