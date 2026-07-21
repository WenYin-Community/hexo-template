---
title: "FreeBSD pkg 自动卸载安装依赖"
date: 2026-01-29
categories:
  - "Linux"
tags:
  - "freebsd"
  - "pkg"
  - "package-management"
---
`pkg delete <pkgname>`
`pkg autoremove`
例如：
`pkg delete py311-qt5-pyqt`
`pkg autoremove`
推荐做法
如果你希望依赖包在安装时就被标记为“自动安装”，安装时加 -A：
`pkg install -A py311-qt5-pyqt`
之后卸载主包：
`pkg delete py311-qt5-pyqt`
`pkg autoremove`
pkg autoremove 会删除不再被任何手动安装包需要的自动依赖。
查看会删除什么
先 dry-run：
`pkg autoremove -n`
或者：
`pkg delete -n py311-qt5-pyqt`
`pkg autoremove -n`
关键区别
- `pkg delete <pkg>`：只删除指定包，除非有依赖关系阻止。
- `pkg autoremove`：删除“自动安装且已无其他包依赖”的包。
- `pkg install -A <pkg>`：把包标记为自动安装。
- `pkg set -A 1 <pkg>`：把已安装包改成自动安装。
- `pkg set -A 0 <pkg>`：把包改成手动安装，避免被 autoremove 删除。
如果包当初不是用 -A 安装的
可以先把它和依赖标成自动，再卸载主包并 autoremove。但要小心不要误删你需要的包。
查看包的依赖：
`pkg info -d <pkgname>`
查看哪些包依赖它：
`pkg info -r <pkgname>`
把某个包标记为自动安装：
`pkg set -A 1 <pkgname>`
把某个包标记为手动安装：
`pkg set -A 0 <pkgname>`
CI/临时环境推荐
在 GitHub Actions / VM 里安装构建依赖时：
`pkg install -A -y <deps...>`
构建完成后清理：
`pkg delete -y <top-level-build-pkg>`
`pkg autoremove -y`
`pkg clean -ay`
如果只是一次性 CI VM，通常不需要清理；但如果有缓存或镜像复用，建议用 
`pkg autoremove -y && pkg clean -ay`
