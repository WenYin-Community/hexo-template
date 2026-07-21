---
title: "清理 VS Code"
date: 2026-04-17
categories:
  - "开发工具"
tags:
  - "vscode"
  - "cache"
---
# 删除所有已安装的插件
`rm -rf ~/.vscode/extensions`
# 删除插件的全局存储数据（如数据库、缓存状态等）
`rm -rf ~/.config/Code/User/globalStorage`
# 删除插件的工作区状态
`rm -rf ~/.config/Code/User/workspaceStorage`
# 1. 删除插件目录
`rm -rf ~/.vscode/extensions`
# 2. 删除用户配置和数据目录 (包含 settings.json, keybindings.json, 缓存等)
`rm -rf ~/.config/Code 9d6b25a544a0e129df7ad4761de21fd4`
