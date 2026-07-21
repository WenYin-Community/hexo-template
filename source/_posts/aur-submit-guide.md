---
title: "AUR 提交指南"
date: 2026-03-14
categories:
  - "开发工具"
tags:
  - "aur"
  - "arch-linux"
  - "packaging"
  - "linux"
  - "package-management"
---
用户可以使用 [Arch 用户仓库 (AUR)](https://wiki.archlinux.org.cn/title/Arch_User_Repository "Arch User Repository") **分享** [PKGBUILD](https://wiki.archlinux.org.cn/title/PKGBUILD "PKGBUILD") 脚本。AUR 不包含任何二进制软件包，但允许用户上传可以被他人下载的 `PKGBUILD`。这些 `PKGBUILD` 完全是非官方的，且未经彻底审查，因此使用风险自担。

## 提交软件包

**警告**

- 在尝试提交软件包之前，您应当熟悉 [Arch 软件包指南](https://wiki.archlinux.org.cn/title/Arch_package_guidelines "Arch package guidelines") 和 [PKGBUILD](https://wiki.archlinux.org.cn/title/PKGBUILD "PKGBUILD")。
- **仔细核实**您上传的内容是否正确。**违反规则**的软件包可能会在**不经通知的情况下被删除**。

如果您在阅读本节两遍后仍对软件包或构建/提交过程有任何疑虑，请在将 `PKGBUILD` 添加到 AUR 之前，将其提交到 [AUR 邮件列表](https://lists.archlinux.org/mailman3/lists/aur-general.lists.archlinux.org/)、Arch 论坛上的 [AUR 板块](https://bbs.archlinux.org/viewforum.php?id=4)，或在我们的 [IRC 频道](https://wiki.archlinux.org.cn/title/IRC_channel "IRC channel") 寻求公开审查。

### 提交规则

向 AUR 提交软件包时，请遵守以下规则：

- 提交的 `PKGBUILD` 在任何情况下都不得构建**已存在于任何官方**二进制**仓库**中的应用程序。请在 [官方软件包数据库](https://archlinux.org.cn/packages/) 中检查该软件包。如果存在任何版本，**请勿**提交该软件包。如果官方软件包已过时，请将其标记为过时。如果官方软件包损坏或缺少功能，请[提交 Bug 报告](https://wiki.archlinux.org.cn/title/Bug_reporting_guidelines "Bug reporting guidelines")。

这条严格规则的**唯一例外**是与官方版本相比，启用了**额外功能**和/或包含**补丁**的软件包。在这种情况下，`pkgname` 应该有所不同以体现这种差异。例如，包含侧边栏补丁的 GNU screen 软件包可以命名为 `screen-sidebar`。此外，应使用 `conflicts=('screen')` 数组以避免与官方软件包冲突。

- **检查 AUR** 以确认该软件包是否**已经存在**。如果目前有人维护，可以在评论中提交更改建议以引起维护者的注意。如果无人维护或维护者没有回应，可以根据需要接管（adopt）并更新该软件包。请勿创建重复的软件包。

- 确保您要上传的软件包是**有用**的。其他人会想用这个软件包吗？它是否过于专业化？如果不仅仅是少数人觉得这个软件包有用，那么它就适合提交。

AUR 和官方仓库旨在收录安装通用软件及软件相关内容的软件包，包括以下一种或多种：可执行文件；配置文件；特定软件或 Arch Linux 发行版整体的联机或脱机文档；旨在直接由软件使用的媒体文件。

- 不支持 `x86_64` 架构的软件包[不允许进入 AUR](https://lists.archlinux.org/archives/list/aur-general@lists.archlinux.org/message/GMYC74CRSFH7GGNENEUOODZUPWHOMX7A/)。

- 除非软件包需要重命名（例如 _Ethereal_ 更名为 _Wireshark_），否则不要在 AUR 的 `PKGBUILD` 中使用 `replaces`。如果软件包是**现有软件包的备选版本**，请使用 `conflicts`（如果其他软件包依赖于该软件包，则还需使用 `provides`）。主要区别在于：执行同步 (-Sy) 后，pacman 一旦在仓库中发现具有匹配 `replaces` 的软件包，就会立即想要替换已安装的“冲突”软件包；而 `conflicts` 仅在实际安装软件包时才进行评估，这通常是更理想的行为，因为它侵入性较小。

- 从版本控制系统（VCS）构建且不绑定到特定版本的软件包需要有适当的后缀，git 使用 `-git`，依此类推，完整列表请参见 [VCS 软件包指南#软件包命名](https://wiki.archlinux.org.cn/title/VCS_package_guidelines#Package_naming "VCS package guidelines")。

- 在源码可用时，使用**预构建**[交付物](https://en.wikipedia.org/wiki/Deliverable "wikipedia:Deliverable")的软件包必须使用 `-bin` 后缀。[Java](https://wiki.archlinux.org.cn/title/Java_package_guidelines#Java_packaging_on_Arch_Linux "Java package guidelines") 是一个例外。AUR 不应包含由 makepkg 创建的二进制 tar 包，也不应包含文件列表（filelist）。如果您正在打包非自由软件，另请参阅 [非自由应用程序软件包指南#软件包命名](https://wiki.archlinux.org.cn/title/Nonfree_applications_package_guidelines#Package_naming "Nonfree applications package guidelines") 中关于 `-bin` 后缀的使用说明。

- 使用特定版本从源码构建的软件包不使用后缀。

- 请在 `PKGBUILD` 文件的顶部添加**注释行**，包含当前**维护者**和过往**贡献者**的信息，并遵循以下格式。记得对您的电子邮件地址进行模糊处理以防垃圾邮件。其他行是可选的。

**注意：**对电子邮件地址进行模糊处理会使人们难以联系到您。

如果您接手了现有 `PKGBUILD` 的维护者角色，请像这样将您的名字添加到顶部：

# Maintainer: Your Name <address at domain dot tld>

如果有之前的维护者，请将他们列为贡献者。如果原始提交者不是您，这也同样适用。如果您是共同维护者，也请添加其他当前维护者的名字。

# Maintainer: Your name <address at domain dot tld>
# Maintainer: Other maintainer's name <address at domain dot tld>
# Contributor: Previous maintainer's name <address at domain dot tld>
# Contributor: Original submitter's name <address at domain dot tld>

- 向您的仓库添加 `LICENSE` 文件和/或 [REUSE.toml](https://reuse.software/tutorial/) 文件。鼓励您遵循 [Arch 软件包指南#软件包源码许可证](https://wiki.archlinux.org.cn/title/Arch_package_guidelines#Package_sources_licenses "Arch package guidelines") 并将您的提交内容以 [0BSD 许可证](https://gitlab.archlinux.org/archlinux/devtools/-/blob/master/data/LICENSE) 授权。

**注意：**缺少许可证或包含除 [0BSD](https://spdx.org/licenses/0BSD.html) 以外许可证的软件包[不符合](https://rfc.archlinux.page/0040-license-package-sources/#aur)晋升到[官方仓库](https://wiki.archlinux.org.cn/title/Official_repositories "Official repositories")的资格。

### 身份认证

为了获得 AUR 的写入权限，您需要有一对 [SSH 密钥](https://wiki.archlinux.org.cn/title/SSH_keys "SSH keys")。公钥的内容需要复制到“我的账户 (My Account)”中的个人资料里，并为 `aur.archlinux.org` 主机配置相应的私钥。例如：

~/.ssh/config

Host aur.archlinux.org
  IdentityFile ~/.ssh/aur
  User aur

您应该[创建一个新的密钥对](https://wiki.archlinux.org.cn/title/SSH_keys#Generating_an_SSH_key_pair "SSH keys")而不是使用现有的密钥对，以便在发生意外时可以选择性地撤销密钥。

$ ssh-keygen -f ~/.ssh/aur

**提示：**您可以在输入框中用换行符分隔多个公钥，从而将它们添加到您的个人资料中。

### 创建软件包仓库

如果您要从头开始[创建一个新软件包](https://wiki.archlinux.org.cn/title/Creating_packages "Creating packages")，请通过 [克隆 (cloning)](https://wiki.archlinux.org.cn/title/Git#Getting_a_Git_repository "Git") 预想的 [pkgbase](https://wiki.archlinux.org.cn/title/PKGBUILD#pkgbase "PKGBUILD") 来建立本地 [Git](https://wiki.archlinux.org.cn/title/Git "Git") 仓库和 AUR 远程仓库。如果软件包尚不存在，会出现以下预期的警告：

$ git -c init.defaultBranch=master clone ssh://aur@aur.archlinux.org/_pkgbase_.git

Cloning into '_pkgbase_'...
warning: You appear to have cloned an empty repository.
Checking connectivity... done.

**注意：**如果 `_pkgbase_` 匹配到一个已[删除](https://wiki.archlinux.org.cn/title/AUR_submission_guidelines#Requests)的软件包，仓库将不会是空的。

如果您已经有了一个软件包，如果它还不是 Git 仓库，请将其[初始化](https://wiki.archlinux.org.cn/title/Git#Getting_a_Git_repository "Git")为 Git 仓库：

$ git -c init.defaultBranch=master init

并添加 AUR 远程仓库：

$ git remote add _label_ ssh://aur@aur.archlinux.org/_pkgbase_.git

然后 [获取 (fetch)](https://wiki.archlinux.org.cn/title/Git#Working_with_remotes "Git") 该远程仓库以在 AUR 中进行初始化。

**注意：**如果 `_pkgbase_` 匹配到一个已删除的软件包，请执行 [pull 和 rebase](https://git-scm.cn/docs/git-pull#Documentation/git-pull.txt---rebasefalsetruemergesinteractive) 以解决冲突。

### 发布新软件包内容

**警告：**您的提交将使用您的[全局 Git 用户名和电子邮件地址](https://wiki.archlinux.org.cn/title/Git#Configuration "Git")作为作者。推送后很难更改提交记录 ([FS#45425](https://bugs.archlinux.org/task/45425))。如果您想以不同的凭据推送到 AUR，可以针对每个软件包通过 `git config user.name "..."` 和 `git config user.email "..."` 进行更改。

发布软件包软件的新版本时，请更新 [pkgver](https://wiki.archlinux.org.cn/title/Pkgver "Pkgver") 或 [pkgrel](https://wiki.archlinux.org.cn/title/PKGBUILD#pkgrel "PKGBUILD") 变量，以通知所有用户需要升级。如果发布的只是对 [PKGBUILD](https://wiki.archlinux.org.cn/title/PKGBUILD "PKGBUILD") 的细微更改（如修正错别字），请勿更新这些值。

不要为 [VCS 软件包](https://wiki.archlinux.org.cn/title/VCS_package_guidelines "VCS package guidelines") 提交纯粹的 `pkgver` 更新。当上游有新提交时，它们不被视为过时。仅在引入其他更改（例如更改构建过程）时才进行新的提交。

每当 `PKGBUILD` 元数据发生变化（如 `pkgver()` 更新）时，务必重新生成 [.SRCINFO](https://wiki.archlinux.org.cn/title/.SRCINFO ".SRCINFO")；否则 AUR 将不会显示更新后的版本号。

要上传或更新软件包：

- [添加](https://wiki.archlinux.org.cn/title/Git#Recording_changes "Git") _至少_ `PKGBUILD` 和 `.SRCINFO`，
- 添加任何额外的新的或修改过的辅助文件（例如 [_.install_](https://wiki.archlinux.org.cn/title/PKGBUILD#install "PKGBUILD") 文件或 [本地源文件](https://wiki.archlinux.org.cn/title/PKGBUILD#source "PKGBUILD") 如 [补丁](https://wiki.archlinux.org.cn/title/Patching_packages "Patching packages")），
- 添加 [软件包源码许可证](https://wiki.archlinux.org.cn/title/Arch_package_guidelines#Package_sources_licenses "Arch package guidelines")，
- [提交 (commit)](https://wiki.archlinux.org.cn/title/Git#Recording_changes "Git") 并附带具有实际意义的提交信息，
- [推送 (push)](https://wiki.archlinux.org.cn/title/Git#Remote_branches "Git") 更改到 AUR。

例如：

$ makepkg --printsrcinfo > .SRCINFO
$ git add PKGBUILD .SRCINFO
$ git commit -m "_useful commit message_"
$ git push

**注**

- 如果您上次提交中没有包含 `.SRCINFO`，请通过 `git commit --amend` [修改上次提交](https://git-scm.cn/docs/git-commit#Documentation/git-commit.txt---amend) 来添加它，这样 AUR 才会允许您的推送。
- AUR 只允许推送到 `master` 分支。如果本地分支名称不同，请先[重命名](https://git-scm.cn/docs/git-branch#Documentation/git-branch.txt---move)后再推送。

**提示：**为了保持工作目录和提交尽可能整洁，可以创建一个 [gitignore(5)](https://man.archlinux.org/man/gitignore.5) 文件来排除所有文件，并根据需要强制添加文件。

## 维护软件包

- 检查其他用户的反馈和评论，并尝试采纳他们建议的任何改进；将其视为一个学习过程！
- 请不要在每次更新软件包时都留下包含版本号的评论。这可以保持评论区对上述有价值内容的可用性。
- 请不要提交软件包后就置之不理！维护者的职责是通过检查更新和改进 `PKGBUILD` 来维护软件包。
- 如果您因某种原因不想继续维护该软件包，请使用 AUR Web 界面 `disown`（弃置）该软件包，和/或在 AUR 邮件列表发布消息。如果一个 AUR 软件包的所有维护者都弃置了它，它将变成一个[“孤儿 (orphaned)”](https://aur.archlinux.org/packages?submit=Orphans)软件包。
- 自动化对维护者来说是有用的工具，但它不能取代[人工干预](https://lists.archlinux.org/archives/list/aur-general@lists.archlinux.org/message/AYISVT7SOB444HXHIF2CKA2TIHBESH2D/)（例如项目可能会更改许可证、添加或删除依赖项，以及即使在“微小”版本发布中也有其他重大更改）。使用自动化 `PKGBUILD` 更新的风险由您自担，任何运行异常的账户及其软件包可能会在不经事先通知的情况下被删除。

## 请求

可以通过点击右侧“软件包操作 (Package Actions)”下的“提交请求 (Submit Request)”链接来创建删除、合并和弃置请求。这会向当前软件包维护者发送通知邮件，并发送到 [aur-requests 邮件列表](https://lists.archlinux.org/mailman3/lists/aur-requests.lists.archlinux.org/) 进行讨论。[软件包维护者 (Package Maintainers)](https://wiki.archlinux.org.cn/title/Package_Maintainers "Package Maintainers") 随后会接受或拒绝该请求。

### 删除 (Deletion)

请求从 AUR 中_移除_一个 `pkgbase`。需要简短说明删除原因，并提供支持性细节（例如当软件包由另一个软件包提供时、如果您本身就是维护者、软件包已重命名且原所有者同意等）。

**注**

- 仅在软件包评论中解释为何要删除是不够的：一旦软件包维护者采取行动，获取此类信息的唯一地方就是 aur-requests 邮件列表。
- 删除请求可能会被拒绝，在这种情况下，如果您是维护者，可能会被建议弃置（disown）该软件包，以便其他维护者接管。
- 软件包被“删除”后，其 [git](https://wiki.archlinux.org.cn/title/Git "Git") 仓库仍然可以进行 [克隆](https://wiki.archlinux.org.cn/title/Arch_User_Repository#Acquire_build_files "Arch User Repository")。

### 合并 (Merge)

请求删除一个 `pkgbase` 并将其投票和评论转移到另一个 `pkgbase`。需要提供要合并到的软件包名称。

例如，如果上游[重命名了他们的项目](https://lists.archlinux.org/archives/list/aur-requests@lists.archlinux.org/thread/CLPVKIYDKRCBOEITSWAG4FO5RBKTKGYG/#U73UG4AP6WMUIR23F7OA4ZKNILT6HZNU)，就需要使用此操作。

**注**

- 这与 `git merge` 或 GitLab 的合并请求（merge requests）没有关系。
- 由于投票和评论的转移需要一个已存在的目标，如果一个软件包没有投票或评论，那么提交一个[删除](https://wiki.archlinux.org.cn/title/AUR_submission_guidelines#Deletion)请求并[链接到新软件包](https://lists.archlinux.org/archives/list/aur-requests@lists.archlinux.org/thread/KSXL52EYMKTZXVO3WHWAUFEJI6DQAXV2/#KSXL52EYMKTZXVO3WHWAUFEJI6DQAXV2)的效果是一样的。

### 弃置 (Orphan)

请求将一个 `pkgbase` 设为弃置状态。如果当前维护者没有反应，这些请求将在两周后获得批准。例外情况是，如果一个软件包被标记为过时长达 180 天，弃置请求将被自动接受。
