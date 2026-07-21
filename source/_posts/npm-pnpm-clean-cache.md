---
title: "npm 和 pnpm 清理缓存"
date: 2026-02-06
categories:
  - "开发工具"
tags:
  - "npm"
  - "pnpm"
  - "cache"
  - "package-management"
---
以下是 npm、pnpm 和 yarn 清理软件包缓存的标准命令：

### **npm**

```bash
# 清理本地缓存（默认位于 ~/.npm）
npm cache clean --force
```

- `--force` 参数是必需的，因为 npm 默认会提示确认。
- 清理后，下次安装包时会重新下载。

### **pnpm**

```bash
# 清理存储库中未使用的包（默认位于 ~/.pnpm-store）
pnpm store prune
```

- `prune` 命令会删除存储库中**未被任何项目使用**的包，是更安全的清理方式。
- 如果想彻底清空整个存储库（不推荐，会导致所有项目重新下载），可以使用：
   
    ```bash
   pnpm store prune --force
    ```


### **yarn (Classic, 1.x)**

```bash
# 清理全局缓存（默认位于 ~/.cache/yarn 或 ~/.yarn/cache）
yarn cache clean
```

- 在 Yarn 1.x 中，此命令会删除整个缓存文件夹。

### **yarn (Berry, 2+)**

Yarn 2+ 的缓存管理略有不同，通常通过其插件系统管理。最常用的清理命令同样是：

```bash
yarn cache clean
```

其行为与 Yarn 1 类似，会清理全局缓存。

在 Bun 中，清理缓存非常简单，只需执行以下命令即可：

```bash
bun pm cache rm
```

`bun pm cache dir`

这条命令会删除 Bun 的全局缓存目录（默认位于 `~/.bun/cache`），让你在下次安装或运行时重新下载所需的包。  
如果你想更彻底地清空缓存，可以加上 `--force` 选项：



> **提示**
> 
> - 运行 `bun cache clean` 后，Bun 会在下一次需要时自动重新下载缺失的依赖。
> - 该命令不会影响已安装的本地项目依赖，只会清理全局缓存。
