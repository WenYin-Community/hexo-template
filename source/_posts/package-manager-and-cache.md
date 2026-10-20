---
title: "包管理器、缓存与工具链合集"
author: "学姐大人"
date: 2026-04-17
categories:
  - "开发工具"
tags:
  - "package-management"
  - "cache"
  - "linux"
  - "fedora"
  - "ubuntu"
  - "rhel"
---

清理缓存、换软件源、装社区仓库、升级发行版、编译工具链——这些「环境维护」动作每次都要重查一遍。这篇把散在各处的记录收在一起。

<!-- more -->

<a id="clean-vscode"></a>

## 清理 VS Code

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

<a id="clean-cargo-cache-and-build-artifacts"></a>

## 清理 Cargo 缓存和构建产物

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

<a id="npm-pnpm-clean-cache"></a>

## npm 和 pnpm 清理缓存

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

<a id="cargo-package-management"></a>

## Cargo 包管理器完全指南

# Cargo 包管理器完全指南

**TL;DR**: Cargo 是 Rust 的构建系统和包管理器，处理代码构建、依赖管理和任务自动化。本指南涵盖从安装到高级使用的完整流程。

---

## 目录
1. [安装与配置](#安装与配置)
2. [创建第一个项目](#创建第一个项目)
3. [核心命令](#核心命令)
4. [依赖管理](#依赖管理)
5. [项目类型](#项目类型)
6. [测试与检查](#测试与检查)
7. [优化构建](#优化构建)
8. [高级技巧](#高级技巧)

---

## 安装与配置

### 自动安装
```bash
# 下载安装脚本
curl https://sh.rustup.rs -sSf | sh

# 或手动下载后检查
sh ./rustup.rs
```

### 环境配置
```bash
# 立即生效
source $HOME/.cargo/env

# 永久配置（添加到 ~/.bashrc 或 ~/.zshrc）
export PATH="$HOME/.cargo/bin:$PATH"

# 验证安装
rustc --version
cargo --version
```

### 包管理器安装（Linux）
```bash
# Debian/Ubuntu
sudo apt install rust cargo

# RHEL/Fedora
sudo dnf install rust cargo
```

---

## 创建第一个项目

### 二进制项目（默认）
```bash
cargo new hello_opensource
cd hello_opensource
```

项目结构：
```
hello_opensource/
├── Cargo.toml          # 项目配置
└── src/
    └── main.rs         # 入口文件
```

### 库项目
```bash
cargo new --lib libhello
```

结构差异：
- 生成 `src/lib.rs` 而非 `src/main.rs`
- 包含默认测试示例

---

## 核心命令

### 构建与运行
| 命令 | 功能 | 输出目录 | 使用场景 |
|------|------|----------|----------|
| `cargo build` | 编译项目 | `target/debug/` | 开发调试 |
| `cargo run` | 编译并运行 | `target/debug/` | 快速执行 |
| `cargo check` | 仅检查语法 | 无二进制文件 | 快速验证 |
| `cargo clean` | 清理构建产物 | 删除 `target/` | 释放空间 |

### 时间对比示例
```bash
# build 耗时
time cargo build  # ~0.4s

# check 耗时（显著更快）
time cargo check  # ~0.15s
```

---

## 依赖管理

### 添加依赖
编辑 `Cargo.toml`：
```toml
[dependencies]
rand = "0.3.14"  # 指定版本
serde = "1.0"    # 语义化版本
```

### 更新依赖
```bash
# 更新所有依赖
cargo update

# 更新特定包
cargo update -p rand

# 查看依赖树
cargo tree
```

### 依赖解析机制
- `Cargo.lock`：锁定精确版本，确保可重现构建
- 自动处理传递依赖（如 `rand` 依赖 `libc`）

---

## 项目类型对比

| 类型 | 命令 | 入口文件 | 输出 | 适用场景 |
|------|------|----------|------|----------|
| 二进制 | `cargo new` | `main.rs` | 可执行文件 | 应用程序 |
| 库 | `cargo new --lib` | `lib.rs` | 库文件 | 共享代码 |

---

## 测试与检查

### 运行测试
```bash
# 运行所有测试
cargo test

# 运行特定测试
cargo test test_name

# 包含文档测试
cargo test --doc
```

### 默认测试示例
```rust
#[cfg(test)]
mod tests {
    #[test]
    fn it_works() {
        assert_eq!(2 + 2, 4);
    }
}
```

### 测试输出示例
```
running 1 test
test tests::it_works ... ok

test result: ok. 1 passed; 0 failed; 0 ignored
```

---

## 优化构建

### 开发构建（默认）
```bash
cargo build
# 输出: [unoptimized + debuginfo]
# 包含调试信息，未优化性能
```

### 发布构建
```bash
cargo build --release
# 输出: [optimized]
# 优化性能，移除调试信息
# 编译时间更长，运行时更快
```

### 性能对比
| 构建类型 | 编译时间 | 运行时性能 | 二进制大小 | 调试信息 |
|----------|----------|------------|------------|----------|
| Debug | 快 | 较慢 | 较大 | 包含 |
| Release | 慢 | 快 | 小 | 移除 |

---

## 高级技巧

### 详细模式
```bash
# 查看底层命令
cargo build -v

# 查看清理操作
cargo clean -v
```

### 构建外部包
```bash
git clone <repo-url>
cd <package-folder>
cargo build
```

### 增量编译
- 默认启用，加速重新编译
- 缓存位于 `target/debug/incremental/`

### 实用命令集合
```bash
# 格式化代码
cargo fmt

# 代码检查
cargo clippy

# 生成文档
cargo doc --open

# 发布到 crates.io
cargo publish
```

---

## 最佳实践

### 开发流程
1. **编码阶段**：使用 `cargo check` 快速验证
2. **调试阶段**：使用 `cargo build` 生成调试信息
3. **发布阶段**：使用 `cargo build --release` 优化性能
4. **测试阶段**：使用 `cargo test` 确保质量

### 项目维护
- 定期运行 `cargo update` 更新依赖
- 使用 `cargo outdated` 检查过期依赖
- 发布前执行 `cargo clean && cargo build --release`

### 磁盘管理
- 使用 `cargo clean` 清理中间文件
- 定期清理 `~/.cargo/registry` 缓存
- 使用 `cargo sweep` 清理旧构建产物

---

## 常见问题

### 如何处理版本冲突？
Cargo 自动解决依赖版本冲突，遵循语义化版本规则。使用 `cargo tree` 查看依赖关系图。

### 为什么编译这么慢？
- 首次构建需下载和编译依赖
- Release 模式优化级别高
- 解决方案：使用 `cargo check` 快速验证

### 如何加速 CI/CD 构建？
- 缓存 `~/.cargo` 和 `target/` 目录
- 使用 `cargo check` 代替 `cargo build` 进行快速验证

---

**Tags**: #rust #cargo #package-manager #build-system #development #tutorial #dependency-management

<a id="ubuntu-linux-remove-snap-packages"></a>

## Ubuntu Linux 中移除 Snap 软件包

这个指南阐述了你如何从 Ubuntu 系统中完全移除 Snap。

这些步骤在 [Ubuntu 22.04 LTS Jammy Jellyfish](https://www.debugpoint.com/2022/01/ubuntu-22-04-lts/) 中进行了测试。然而，它应该也适用于所有的 Ubuntu 系统版本。

> **警告：这些步骤将会移除 Ubuntu 系统中两个关键的程序：软件商店和 Firefox。尝试这些步骤之前确认你已经对书签和 Firefox 的其它设置做了备份。**

## 在 Ubuntu Linux 移除 Snap 软件包

1. 在你的系统中打开一个终端，使用以下命令查看已经安装的 Snap 软件包的列表：

```bash
snap list
```

2. 按照以下的顺序移除 Snap 软件包。首先移除 Firefox。然后是软件商店，和用以上命令看到的你的系统中的其它软件包：

```bash
sudo snap remove --purge firefox
sudo snap remove --purge snap-store
sudo snap remove --purge gnome-3-38-2004
sudo snap remove --purge gtk-common-themes
sudo snap remove --purge snapd-desktop-integration
sudo snap remove --purge bare
sudo snap remove --purge core20
sudo snap remove --purge snapd
```

3. 最后，通过 `apt` 命令移除 Snap 服务：

```bash
sudo apt remove --autoremove snapd
```

这还没完，即使你用以上命令移除了 Snap 软件包，但是如果你没有关闭 apt 触发器，`sudo apt update` 命令会再一次将 Snap 安装回来。

4. 所以，要关闭它，我们需要在 `/etc/apt/preferences.d/` 目录下创建一个 apt 设置文件 `nosnap.pref` 来关闭 Snap 服务：

```bash
sudo gedit /etc/apt/preferences.d/nosnap.pref
```

5. 添加以下的命令行，并保存该文件：

```
Package: snapd
Pin: release a=*
Pin-Priority: -10
```

如果你知道如何使用它，那么这个 apt 设置文件是一个潜在的工具。举个例子，在以上的状态中，`Pin-Priority -10` 意思就是阻止 Snap 软件包的安装。

与此教程不相关的，举个例子，如果你想给所有发行版代号为 "bullseye" 的软件包超高优先权的话，那么就可以查看这些设置文件。如果你想了解更多，你可以访问 [apt 手册页](https://manpages.ubuntu.com/manpages/focal/man5/apt_preferences.5.html)。

```
Package: *
Pin: release n=bullseye
Pin-Priority: 900
```

6. 回到我们的主题，一旦你已经保存和关闭以上文件，从终端中再次运行以下命令：

```bash
sudo apt update
```

7. 最后，从 Ubuntu 中移除 Snap 的步骤全部完成。

## 从 Ubuntu 移除 Snap 后使用 deb 文件安装软件商店和 Firefox

你已经移除了 Firefox 和软件商店，但是你的工作还需要它们。

要安装 apt 版的 GNOME 软件商店，你可以使用以下命令。确保使用 `--install-suggests` 参数。否则，将会再次安装上 Snap 版本的软件包管理器！

```bash
sudo apt install --install-suggests gnome-software
```

要安装 Firefox，通过以下命令使用官方 PPA 仓库：

```bash
sudo add-apt-repository ppa:mozillateam/ppa
sudo apt update
sudo apt install -t 'o=LP-PPA-mozillateam' firefox
```

一旦你已经安装完 Firefox，使用以下命令开启自动更新：

```bash
echo 'Unattended-Upgrade::Allowed-Origins:: "LP-PPA-mozillateam:${distro_codename}";' | sudo tee /etc/apt/apt.conf.d/51unattended-upgrades-firefox
```

最后但同样重要，当运行 `apt` 时，为 Firefox 创建另一个设置文件给予以上 PPA 仓库超高优先权。如果你不这么做，`apt update` 命令会再次安装 Snap 版本 Firefox，并把它的"Snap 朋友们"带回来。

```bash
sudo gedit /etc/apt/preferences.d/mozillateamppa
```

最后，添加这些命令行并保存文件：

```
Package: firefox*
Pin: release o=LP-PPA-mozillateam
Pin-Priority: 501
```

完成。

## 在 Ubuntu 系统恢复到 Snap 软件包

如果你改变想法，移除该设置文件，并通过以下命令再次启动安装程序：

```bash
sudo rm /etc/apt/preferences.d/nosnap.pref
sudo apt update && sudo apt upgrade
sudo snap install snap-store
sudo apt install firefox
```

<a id="extra-packages-for-enterprise-linux"></a>

## Extra Packages for Enterprise Linux

## 快速指南

我们（Fedora EPEL）提供包含存储库配置文件和公共软件包签名密钥的发布包。使用与企业操作系统的主版本对应的版本。

- [epel-release-latest-9](https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm)
- [epel-release-latest-8](https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm)
- [epel-release-latest-7](https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm)

如果您使用的是 CentOS Stream，我们还建议您安装相应的 epel-next-release 软件包。

- [epel-next-release-latest-9](https://dl.fedoraproject.org/pub/epel/epel-next-release-latest-9.noarch.rpm)
- [epel-next-release-latest-8](https://dl.fedoraproject.org/pub/epel/epel-next-release-latest-8.noarch.rpm)

### 什么是 epel-next？

EPEL 软件包是针对 RHEL 构建的。EPEL Next 是一个额外的存储库，允许软件包维护者根据 CentOS Stream 进行构建。当 CentOS Stream 包含即将到来的 RHEL 库 rebase 时，或者如果 EPEL 包具有 CentOS Stream 中已经存在但尚未在 RHEL 中的最低版本构建要求，则有时需要这样做。EPEL Next 有自己的 distgit 分支、koji build 目标和 bodhi releases。EPEL Next 软件包的 disttag 后附加了 `.next`（例如 el8.next，epel 8-next 的 disttag 为 `.www.example.com`），以提供从同一 distgit 提交构建的 EPEL 软件包的升级路径。包维护者可以为 EPEL 和 EPEL Next 重建相同的提交，并在 koji 中获得两个不同的 NVR。在六个月内，需要在 EPEL Next 中构建的构建需求应该在 RHEL 中，并且那时软件包维护者可以在 EPEL 分支中进行正常的发布 bump 提交，并获得比先前的 EPEL 和 EPEL Next 软件包都更新的 NVR。要开始使用 EPEL Next，请为您的目标 EPEL 版本请求相应的分支。

为了方便起见，一些发行版在其默认存储库中包含了这些发布包，允许您按名称安装它们，而无需完整的 URL。

## CentOS Stream 10

```bash
dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-10.noarch.rpm
sudo crb enable
```

## EL9

### CentOS Stream 9

```bash
dnf config-manager --set-enabled crb
dnf install epel-release epel-next-release
```

### RHEL 9

```bash
sudo subscription-manager repos --enable codeready-builder-for-rhel-9-$(arch)-rpms
sudo dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-9.noarch.rpm
```

### AlmaLinux 9

```bash
dnf config-manager --set-enabled crb
dnf install epel-release
```

## EL8

### CentOS Stream 8

```bash
dnf config-manager --set-enabled powertools
dnf install epel-release epel-next-release
```

### RHEL 8

```bash
subscription-manager repos --enable codeready-builder-for-rhel-8-$(arch)-rpms
dnf install https://dl.fedoraproject.org/pub/epel/epel-release-latest-8.noarch.rpm
crb enable
```

### AlmaLinux 8, Rocky Linux 8

```bash
dnf config-manager --set-enabled powertools
dnf install epel-release
```

## EL7

### RHEL 7

```bash
subscription-manager repos --enable rhel-*-optional-rpms \
                           --enable rhel-*-extras-rpms \
                           --enable rhel-ha-for-rhel-*-server-rpms
yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
```

### CentOS 7

```bash
yum install epel-release
```

来源：[EPEL 文档](https://docs.fedoraproject.org/en-US/epel/)

<a id="fix-packagekit-switch-proxy"></a>

## 修复PackageKit无法正确切换代理

使用过代理在图形界面下安装软件包后，会出现这样的毛病：

[![](images/Screenshot_20230426_084431-1276x720.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/Screenshot_20230426_084431.png)

目前确认为 PackageKit 软件包的问题，无法正确切换代理，需要手动编辑配置（数据库）。

## 解决方案

### 命令行操作

1. 安装 sqlite3：

```bash
sudo dnf/apt install sqlite3
```

2. 删除代理设置：

```bash
sudo sqlite3 /var/lib/PackageKit/transactions.db
DELETE FROM proxy;
.exit
```

3. 重启 packagekit：

```bash
sudo systemctl restart packagekit
```

### 图形界面操作

1. 安装 sqlitebrowser：

```bash
sudo dnf/apt install sqlitebrowser
```

2. 删除代理设定：

```bash
sudo sqlitebrowser /var/lib/PackageKit/transactions.db
```

点击浏览数据页面，选择表名 proxy 并删除所有数据。

[![](images/Screenshot_20230426_085129-640x480.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/Screenshot_20230426_085129.png)

[![](images/Screenshot_20230426_085146-640x480.png)](https://wiki.wenyinos.com/wp-content/uploads/2023/04/Screenshot_20230426_085146.png)

3. 重启 packagekit：

```bash
sudo systemctl restart packagekit
```

来源：[PackageKit Issue #392](https://github.com/PackageKit/PackageKit/issues/392#issuecomment-1077478068)

<a id="freebsd-pkg-autoremove-dependencies"></a>

## FreeBSD pkg 自动卸载安装依赖

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

<a id="ubuntu-22-04-upgrade-online-remebers"></a>

## Ubuntu 22.04在线升级注意事项

### 1. 某些云服务商使用自定义镜像源

在直接使用在线更新时会被禁用，需要使用下列命令更新：

```bash
RELEASE_UPGRADER_ALLOW_THIRD_PARTY=1 do-release-upgrade
```

### 2. 新版搭载的 OpenSSH 软件包默认已拒绝 rsa-sha1 算法生成的密钥

请提前配置 sha2 密钥，如：

```bash
ssh-keygen -t rsa-sha2-512 -b 4096
```

如果您无法在本地计算机上更改任何内容，或者不想使用新密钥，并且希望在本地计算机上重新启用 RSA，请在远程计算机上编辑文件 `/etc/ssh/sshd_config` 并添加以下行：

```bash
HostKeyAlgorithms +ssh-rsa
PubkeyAcceptedKeyTypes +ssh-rsa
```

这将允许使用您已经拥有的不安全 RSA 密钥。

请记住通过以下方式重新启动 sshd 服务：

```bash
sudo systemctl restart sshd
```

否则，您必须重新启动计算机才能使更改生效。

<a id="update-gcc-14_2"></a>

## 升级gcc 14.2.0

## 编译 GMP，MPFR，MPC

注意三个库编译的顺序 (gmp -> mpfr -> mpc)。因为编译 mpfr 时需要依赖于 gmp，编译mpc时候又需要依赖于 gmp 和 mpfr，所以需要最先编译 gmp，然后编译 mpfr，最后编译 mpc。编译过程中需要在 configure 配置时设置好 gmp，mpfr 的 include 和 lib 路径，不然就会遇见 **_configure: error: libgmp not found or uses a different ABI (including static vs shared). configure: error: libmpfr not found or uses a different ABI (including static vs shared)._** 这两个 **_configure: error_**。

### 2.1. 编译GMP

编译的时候需要记录下 `--prefix` 参数的值，也就是我们自定义的gmp的安装目录，后面编译其他两个库和gcc的时候需要使用。

```bash
tar -xvjf gmp-6.2.1.tar.bz2
cd gmp-6.2.1/
./configure --prefix=$(pwd)
make
make install
```

### 2.2. 编译MPFR

```bash
tar -xvjf mpfr-4.1.0.tar.bz2
cd mpfr-4.1.0/
./configure --prefix=$(pwd) \
--with-gmp-include=/home/test/deps/gmp-6.2.1/include \
--with-gmp-lib=/home/test/deps/gmp-6.2.1/lib
make
make install
```

### 2.3. 编译MPC

```bash
tar -xvzf mpc-1.2.1.tar.gz
cd mpc-1.2.1/
./configure --prefix=$(pwd) \
--with-gmp-include=/home/test/deps/gmp-6.2.1/include \
--with-gmp-lib=/home/test/deps/gmp-6.2.1/lib \
--with-mpfr-include=/home/test/deps/mpfr-4.1.0/include \
--with-mpfr-lib=/home/test/deps/mpfr-4.1.0/lib
make
make install
```

### 2.4. 配置动态库 (so)到 LD\_LIBRARY\_PATH 环境变量

在终端运行下面命令可以将上面所编译好的三个库的动态库 (so)文件配置到 LD\_LIBRARY\_PATH 环境变量中，如果需要让配置永久生效，则需将下面的代码添加到 ~/.bashrc 文件中 并运行 `source ~/.bashrc` 命令即可。

```bash
export LD_LIBRARY_PATH=/home/test/deps/gmp-6.2.1/lib:/home/test/deps/mpfr-4.1.0/lib:/home/test/deps/mpc-1.2.1/lib:$LD_LIBRARY_PATH
```

## 3\. 源代码编译安装GCC

### 3.1. 下载最新版的GCC

可以直接从 [GCC, the GNU Compiler Collection](https://link.zhihu.com/?target=https%3A//gcc.gnu.org/) 下载最新版本的 GCC 源码压缩包，在这里我通过 `wget`命令从[GCC mirror sites](https://link.zhihu.com/?target=https%3A//gcc.gnu.org/mirrors.html) 服务器下载当前最新版本 GCC 源码压缩包。 关于 [GCC mirror sites](https://link.zhihu.com/?target=https%3A//gcc.gnu.org/mirrors.html) 的选择可以浏览下面的网页：

[GCC mirror sites​gcc.gnu.org/mirrors.html](https://link.zhihu.com/?target=https%3A//gcc.gnu.org/mirrors.html)

```bash
wget http://ftp.tsukuba.wide.ad.jp/software/gcc/releases/gcc-13.1.0/gcc-13.1.0.tar.gz
```

### 3.2. 编译安装 GCC

详细的 `configure` 参数设置可以参考：[Installing GCC: Configuration](https://link.zhihu.com/?target=https%3A//gcc.gnu.org/install/configure.html)，这里我没有设置过多的参数。

```bash
tar -xvzf gcc-13.1.0.tar.gz
cd gcc-13.1.0
./configure \
--disable-multilib \
--prefix=$(pwd)/ \
--with-gmp-include=/home/test/deps/gmp-6.2.1/include \
--with-gmp-lib=/home/test/deps/gmp-6.2.1/lib \
--with-mpfr-include=/home/test/deps/mpfr-4.1.0/include \
--with-mpfr-lib=/home/test/deps/mpfr-4.1.0/lib \
--with-mpc-include=/home/test/deps/mpc-1.2.1/include \
--with-mpc-lib=/home/test/deps/mpc-1.2.1/lib
make -j4
make install
```

如果在make的过程遇见 `# error GATHER_STATISTICS must be defined` 这个错误,则只需通过在终端运行`export CPLUS_INCLUDE_PATH=` 命令暂时的清除CPLUS\_INCLUDE\_PATH 变量即可。

## 4\. 环境变量的配置

安装完 GCC 之后，我们需要将其配置到系统的环境变量中，如果需要长久生效，则需要将下面内容添加到 `~/.bashrc`中即可。也可以通过构建软链接的方式替换成老版本的GCC。

```bash
export PATH=/home/test/gcc-14.2.0/bin:$PATH
export LIBRARY_PATH=/home/test/gcc-14.2.0/lib64:$LIBRARY_PATH
export LD_LIBRARY_PATH=/home/test/gcc-14.2.0/lib64:$LD_LIBRARY_PATH
export C_INCLUDE_PATH=/home/test/gcc-14.2.0/include:$C_INCLUDE_PATH
export CPLUS_INCLUDE_PATH=/home/test/gcc-14.2.0/include:$CPLUS_INCLUDE_PATH
```
