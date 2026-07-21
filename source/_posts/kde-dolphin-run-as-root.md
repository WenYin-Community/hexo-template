---
title: "KDE Dolphin文件管理器以root访问"
date: 2023-06-27
categories:
  - "Linux"
coverImage: "6fc092541a11c86ddf1d928f0e61301ec5a3.png"
tags:
  - "kde"
---

把下列代码保存为 `open_as_root.desktop`，放置于 `~/.local/share/kservices5/ServiceMenus/` 目录（无此目录请手动创建）：

```ini
[Desktop Entry]
Type=Service
Icon=system-file-manager
Actions=OpenAsRootKDE5
ServiceTypes=KonqPopupMenu/Plugin,inode/directory,inode/directory-locked

[Desktop Action OpenAsRootKDE5]
Exec=/usr/bin/pkexec env DISPLAY=$DISPLAY XAUTHORITY=$XAUTHORITY KDE_SESSION_VERSION=5 KDE_FULL_SESSION=true dolphin
Icon=system-file-manager-root
Icon=system-file-manager
Name=Open as Root
Name[ru]=Открыть папку с правами рут
Name[ua]=Відкрити папку з правами рут
Name[zh_CN]=打开具有根权限的文件夹
Name[zh_TW]=打開具有根許可權的資料夾
Name[de]=Öffnen des Ordners mit Root-Berechtigungen
Name[ja]=ルート権限を持つフォルダを開く
Name[ko]=루트 권한이 있는 폴더 열기
Name[fr]=Ouvrez le dossier avec les privilèges root
Name[el]=Ανοίξτε ως Root
Name[es]=Abrir la carpeta con privilegios de root
Name[tr]=Kök ayrıcalıkları olan klasörü açma
Name[he]=פתח תיקיה עם הרשאות שורש
Name[it]=Aprire la cartella con privilegi radice
Name[ar]=فتح المجلد بامتيازات الجذر
Name[pt_BR]=Abrir pasta com privilégios de root
Name[pt_PT]=Abrir pasta com privilégios de root
Name[sv]=Öppna mapp med root-behörigheter
Name[nb]=Åpne mappen med rotprivilegier
```

[![](images/6fc092541a11c86ddf1d928f0e61301ec5a3.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/06/6fc092541a11c86ddf1d928f0e61301ec5a3.png)
