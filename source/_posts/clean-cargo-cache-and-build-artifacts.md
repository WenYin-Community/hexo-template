---
title: "清理 Cargo 缓存和构建产物"
date: 2026-03-03
categories:
  - "开发工具"
tags:
  - "cargo"
  - "rust"
  - "cache"
  - "package-management"
---
# 清理 Cargo 缓存和构建产物

**TL;DR**: 使用 `cargo clean` 清理项目构建产物，删除 `~/.cargo/registry` 清理全局缓存，或使用 `cargo-cache`/`cargo-sweep` 工具进行更精细的管理。

---

## 快速清理命令

### 清理当前项目
```bash
# 清理所有构建产物 (debug + release)
cargo clean

# 仅清理 release 构建
cargo clean --release
```

### 清理全局缓存
```bash
# 清理 crate 注册表缓存
rm -rf ~/.cargo/registry

# 清理 git 依赖缓存
rm -rf ~/.cargo/git

# 清理所有 cargo 缓存（谨慎使用）
rm -rf ~/.cargo
```

---

## 推荐工具

### cargo-cache
功能强大的缓存管理工具。

```bash
# 安装
cargo install cargo-cache

# 查看缓存统计
cargo cache

# 清理所有缓存
cargo cache --remove-dir all

# 清理未引用的 crate
cargo cache clean-unref

# 清理 30 天前的缓存
cargo cache --remove-if-older-than 30
```

### cargo-sweep
清理旧构建产物，支持按时间和工具链过滤。

```bash
# 安装
cargo install cargo-sweep

# 预览模式（推荐先执行）
cargo sweep --dry-run --time 30

# 清理 30 天前的构建文件
cargo sweep --time 30

# 清理非当前工具链的构建
cargo sweep --installed

# 清理指定项目
cargo sweep --time 30 /path/to/project
```

---

## 批量清理多个项目

```bash
# 递归删除所有项目的 target 目录
find /path/to/projects -type d -name target -exec rm -rf {} +

# 删除当前目录下所有 target 文件夹
find . -name "target" -type d -exec rm -rf {} + 2>/dev/null
```

---

## Rust 工具链管理

```bash
# 查看已安装的工具链
rustup show

# 卸载不需要的工具链
rustup uninstall nightly

# 清理旧版本
rustup self update
```

---

## 清理未使用依赖

```bash
# 安装工具
cargo install cargo-machete cargo-udeps

# 检查并移除未使用依赖
cargo machete
cargo udeps --all-targets
```

---

## 完全卸载 Rust

```bash
# 卸载 rustup 及工具链
rustup self uninstall

# 手动清理残留
rm -rf ~/.rustup
rm -rf ~/.cargo
```

---

## 环境变量配置

```bash
# 使用清华镜像源（添加到 ~/.bashrc 或 ~/.zshrc）
export RUSTUP_UPDATE_ROOT=https://mirrors.tuna.tsinghua.edu.cn/rustup/rustup
export RUSTUP_DIST_SERVER=https://mirrors.tuna.tsinghua.edu.cn/rustup
export CARGO_HOME="$HOME/.cargo"
export PATH="$CARGO_HOME/bin:$PATH"
```

---

## 清理策略对比

| 方法 | 清理范围 | 推荐场景 | 风险等级 |
|------|----------|----------|----------|
| `cargo clean` | 当前项目构建产物 | 快速释放项目空间 | 低 |
| `rm -rf ~/.cargo/registry` | 全局 crate 缓存 | 急需释放大量空间 | 中 |
| `cargo-cache` | 可定制缓存清理 | 精细化管理 | 低 |
| `cargo-sweep` | 旧构建产物 | 多项目开发环境 | 中 |
| `rustup uninstall` | 工具链 | 切换版本后清理 | 低 |

---

## 最佳实践

- **日常开发**：使用 `cargo sweep --time 7` 每周清理一次
- **CI/CD 环境**：每次构建前执行 `cargo clean`
- **磁盘空间紧张**：优先清理 `~/.cargo/registry` 和 `~/.rustup`
- **安全第一**：执行删除前使用 `--dry-run` 预览效果

---

**Tags**: #rust #cargo #cleanup #disk-space #development-tools
