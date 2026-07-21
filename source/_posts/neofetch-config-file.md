---
title: "neofetch常用的配置文件"
date: 2017-06-05
categories:
  - "Linux"
tags: 
  - "linux"
coverImage: "2017-06-05-23-07-05屏幕截图.png"
---

效果如图：放置在~/.config/neofetch目录下，保存为config即可。

![](images/2017-06-05-23-07-05屏幕截图-300x199.png)

```bash
#!/usr/bin/env bash
# vim:fdm=marker
#
# Neofetch config file
# https://github.com/dylanaraps/neofetch

# Speed up script by not using unicode
export LC_ALL=C
export LANG=C

# Info Options {{{

# Info
# See this wiki page for more info:
# https://github.com/dylanaraps/neofetch/wiki/Customizing-Info
printinfo() {
    info title
    info underline

    info "Model" model
    info "OS" distro
    info "Kernel" kernel
    info "Uptime" uptime
    info "Packages" packages
    info "Shell" shell
    info "Resolution" resolution
    info "DE" de
    info "WM" wm
    info "WM Theme" wmtheme
    info "Theme" theme
    info "Icons" icons
    info "Terminal" term
    info "Terminal Font" termfont
    info "CPU" cpu
    info "GPU" gpu
    info "Memory" memory

    info "CPU Usage" cpu_usage
    info "Disk" disk
    info "Battery" battery
    info "Font" font
    info "Song" song
    info "Local IP" localip
    info "Public IP" publicip
    info "Users" users
    info "Birthday" birthday

    info linebreak
    info cols
    info linebreak
}
```
