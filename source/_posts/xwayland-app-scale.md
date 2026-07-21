---
title: "在XWayland应用中调整缩放"
date: 2024-04-01
categories:
  - "Linux"
coverImage: "Screenshot_20240401_215747.png"
tags:
  - "wayland"
  - "xwayland"
---

在 `~/.Xresources` 文件中添加以下内容：

```
Xft.dpi:       120
Xft.antialias: true
Xft.hinting:   true
Xft.autohint:  false
Xft.hintstyle: hintslight
Xft.lcdfilter: lcddefault
Xft.rgba:      rgb
```

然后执行：

```bash
nano ~/.Xresources
```

[![](images/Screenshot_20240401_215747.png)](https://wiki.wenyinos.com/wp-content/uploads/2024/04/Screenshot_20240401_215747.png)
