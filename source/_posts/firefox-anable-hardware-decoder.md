---
title: "Firefox 打开视频硬解码功能"
date: 2023-07-09
categories:
  - "硬件设备"
tags:
  - "graphics"
---

## Hardware Video Acceleration

This is for **Debian 11 / Bullseye**

Setup your system and install required packages: [https://wiki.debian.org/HardwareVideoAcceleration](https://wiki.debian.org/HardwareVideoAcceleration)

Starting around version 95 Firefox has enabled hardware video acceleration via VA-API but still needs to be manually turned on. [firefox-esr](https://packages.debian.org/firefox-esr) version 102 is available from the [Debian Security](https://www.debian.org/security/) repositories for Debian 11 since 2022-09-23.

Enter `about:config` in address bar:

| 配置项 | 值 | 说明 |
| --- | --- | --- |
| media.ffmpeg.vaapi.enabled | true | AVC/h.264 HEVC/h.265 works |
| media.ffvpx.enabled | false | disables firefox internal software decoding of VP8/VP9 and forces hardware decoding |

Then launch firefox based on whether you use X11 or Wayland:

| 环境 | 环境变量 |
| --- | --- |
| X11 | `MOZ_X11_EGL=1` |
| Wayland/Xwayland | `MOZ_ENABLE_WAYLAND=1` |

e.g. .desktop launcher command for X11 and Mozilla binary:

```bash
Exec=env MOZ_X11_EGL=1 /home/user/firefox/firefox
```

For version 96 and above, the above settings may change.
