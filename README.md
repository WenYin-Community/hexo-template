# Hexo Template

基于 [Hexo](https://hexo.io/) 的静态博客模板，使用 [NexT](https://theme-next.js.org/) 主题（Pisces 布局），配色与 [wenyinos.com](https://wenyinos.com/) 主站视觉体系对齐。

## 快速开始

### 环境要求

- Node.js >= 18.0
- npm 或 pnpm

### 安装

```bash
git clone https://github.com/WenYin-Community/hexo-template.git
cd hexo-template
npm install
```

### 本地预览

```bash
npm run server
# 访问 http://localhost:4000
```

## Hexo 常用命令

### 文章管理

```bash
# 新建文章
hexo new post "文章标题"
# 生成文件：source/_posts/文章标题.md

# 新建草稿
hexo new draft "草稿标题"
# 生成文件：source/_drafts/草稿标题.md

# 发布草稿为文章
hexo publish "草稿标题"

# 新建页面（如 About、Links）
hexo new page "about"
# 生成文件：source/about/index.md
```

### 生成、清理与部署

```bash
# 清理缓存和已生成的文件
npm run clean
# 等价于 hexo clean
# 会删除 public/ 目录和 db.json 缓存文件

# 生成静态文件到 public/ 目录
npm run build
# 等价于 hexo generate

# 清理后重新生成（推荐）
hexo clean && hexo generate
# 或简写
hexo cl && hexo g

# 部署到 GitHub Pages（需配置 _config.yml 中的 deploy 字段）
npm run deploy
# 等价于 hexo deploy

# 清理、生成并部署
hexo clean && hexo generate --deploy
# 或简写
hexo cl && hexo g -d
```

### 本地调试

```bash
# 启动本地服务器（带热重载）
npm run server
# 等价于 hexo server

# 指定端口
hexo server -p 8080

# 监听所有网络接口（局域网可访问）
hexo server -i 0.0.0.0
```

## 文章 Front-matter

在 Markdown 文件顶部使用 YAML 格式设置文章属性：

```yaml
---
title: 文章标题
date: 2026-07-21 12:00:00
categories:
  - 技术
tags:
  - Hexo
  - 教程
---
```

## 目录结构

```
├── source/              # 文章和静态资源
│   ├── _posts/          # Markdown 文章
│   ├── _drafts/         # 草稿
│   ├── _data/           # NexT 自定义样式（styles.styl / variables.styl）
│   └── images/          # 图片资源
├── scaffolds/           # 文章模板
├── _config.yml          # Hexo 主配置
├── _config.next.yml     # NexT 主题配置
└── package.json
```

## 部署到 GitHub Pages

1. 修改 `_config.yml` 中的 deploy 配置：

```yaml
deploy:
  type: git
  repo: https://github.com/你的用户名/你的仓库名.git
  branch: main
```

2. 执行部署：

```bash
hexo clean && hexo g -d
```

## 技术栈

- Hexo 8.x
- NexT 8.29（Pisces 布局）
- hexo-generator-searchdb（本地搜索）
- hexo-excerpt（自动摘要）
- hexo-deployer-git
