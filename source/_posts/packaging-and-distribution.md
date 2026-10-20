---
title: "打包与分发合集（RPM / AUR）"
author: "学姐大人"
date: 2026-03-14
categories:
  - "开发工具"
tags:
  - "packaging"
  - "rpm"
  - "aur"
  - "arch-linux"
  - "linux"
---

把自己的软件做成别人能装的东西：从零写 RPM spec，以及往 AUR 提交包。

<!-- more -->

<a id="how-to-create-an-rpm-package-zh-hk"></a>

## How to create an RPM package/zh-hk（如何创建一个打包的RPM

首先感谢存档，本文在此找回：[https://fedoraproject.org/wiki/How\_to\_create\_an\_RPM\_package/zh-hk](https://fedoraproject.org/wiki/How_to_create_an_RPM_package/zh-hk)

此页面包含 [Packaging:ScriptletSnippets](https://fedoraproject.org/wiki/Packaging:ScriptletSnippets "Packaging:ScriptletSnippets") 的 zh\_CN 翻译，由于不具有 ScriptletSnippets 的编辑权限，故在此保存翻译。

# RPM 打包脚本综述

Rpm spec 文件有几个部分，允许软件包执行代码来完成安装和卸载操作。这些软件包中的脚本片段大多用于更新系统信息。此页面提供 RPM 脚本片段概述和一些常见软件包的 spec 脚本片段的示例。更完整的脚本片段，请参阅 [Maximum RPM book](http://www.rpm.org/max-rpm-snapshot/) 。

# 默认 Shell

在 Fedora ，您可以直接使用默认的 bash shell (`/bin/sh`)。因此，所有脚本片段可以安全地在 bash 中运行。

# 语法

基本语法在 %build, %install 以及 rpm spec 文件的其他部分都是一致的。脚本支持一个特殊标记， -p 允许脚本直接调用一个程序，而不必启用 shell 来运行程序。(即 `%post -p /sbin/ldconfig`)

脚本片段还传递一个参数，用于表示本软件包的**个数**。执行特定动作时，通过向 $1 传递不同值，来表示不同动作（安装/升级/卸载），除了 %pretrans 和 %posttrans 它们的 $1 为 0 (rpm 4.4+ 支持 %pretrans 和 %posttrans)。对于安装、升级和卸载，所传递的参数值如下表所示：

|  | 安装（install） | 升级（update/upgrade） | 卸载（remove/erase） |
| --- | --- | --- | --- |
|  %pretrans | $1 == 0 | $1 == 0 | (N/A) |
|  %triggerprein | 安装本包: $1 == 0, $2 == 1 安装目标包: $1 == 1, $2 == 0 | $1 == 1, $2 == 1 | (N/A) |
|  %pre | $1 == 1 | $1 == 2 | (N/A) |
|  %post | $1 == 1 | $1 == 2 | (N/A) |
|  %triggerin | $1 == 1, $2 == 1 | 升级本包: $1 == 2, $2 == 1 升级目标包: $1 == 1, $2 == 2 | (N/A) |
|  %triggerun | (N/A) | $1 == 1, $2 == 1 | 卸载本包: $1 == 0, $2 == 1 卸载目标包: $1 == 1, $2 == 0 |
|  %preun | (N/A) | $1 == 1 | $1 == 0 |
|  %postun | (N/A) | $1 == 1 | $1 == 0 |
|  %triggerpostun | (N/A) | 升级目标包: $1 == 1, $2 == 1 | 卸载目标包: $1 == 1, $2 == 0 |
|  %posttrans | $1 == 0 | $1 == 0 | (N/A) |

注意，如果安装相同软件包的多个版本，这些参数值将会不同（这发生于同时安装包，如 kernel 和 multilib 包。然而，它会引发错误，防止软件包升级完成）。所以，使用以下结构的脚本是个好主意：

```
%pre
if [ $1 -gt 1 ] ; then   # -gt大于
fi

```

...对于 %pre 和 %post 脚本，检查它的值等于 2。

除了一些特殊情况（如果有的话），我们希望所有的脚本退出时返回 0。因为 rpm 默认配置不使用 `-e` 参数执行 shell 脚本，不包括明确的 `exit` 调用（可能出现非 0 返回值），在脚本中，最后一个命令的退出状态决定了脚本片段的退出状态。大多数命令包含 "`|| :`" 后缀，这会强制以 0 状态退出，无论命令是否可以正常工作。通常，最重要的是在脚本片段的最后一个命令添加此后缀，或在脚本的最后一行添加 "`:`" 或 "`exit 0`" 命令。注意，根据情况，使用其他的错误检测/预防措施可能更合适，事先运行一些命令进行检查，检查成功才执行之后的命令。

脚本片段以非 0 状态退出会中断安装/升级/删除操作，避免事务中的包执行进一步的操作（见脚本片段命令部分），这可以防止旧包被删除，同时也在 rpmdb 留下了重复记录，在文件系统上留下了无主文件。某些情况下，事务中的脚本片段执行失败，可能导致部分安装失败（不会中断）。这往往局限于，软件包不影响事务继续执行，而此时中断安装之后的某些包，会导致更严重的系统问题。

# 脚本片段命令

%pre 和 %post 脚本片段分别在软件包安装前和安装后执行。%preun 和 %postun 脚本片段分别在软件包卸载前和卸载后执行。%pretrans 和 %posttrans 脚本片段分别在软件包事务开始和结束时执行。升级软件包时，按如下顺序执行脚本片段：

1. 检查软件包依赖、下载软件包和 DRPM
2. (all)%pretrans：事务开始时，执行新软件包的此段代码
3. ...... (操作其它软件包) ......
4. (any)%triggerprein：此包的新版本安装之前，触发此包或其他包的脚本（如果有）
5. (new)%triggerprein：指定的其他软件包安装之前，触发此脚本
6. (new)%pre：执行新软件包的 %pre 脚本
7. ...... (安装所有新文件) ......
8. (new)%post：执行新软件包的 %post 脚本
9. (any)%triggerin：安装此软件包时，触发此包或其他包的脚本（如果有）
10. (new)%triggerin：安装指定的其他软件包时，触发此脚本
11. (old)%triggerun：卸载指定的其他软件包的旧版本时，触发此脚本
12. (any)%triggerun：卸载此软件包的旧版本时，触发此包或其他包的脚本（如果有）
13. (old)%preun：执行旧软件包的 %preun 脚本
14. ...... (删除所有旧文件) ......
15. (old)%postun：执行旧软件包的 %postun 脚本
16. (old)%triggerpostun：指定的其他软件包的旧版本已卸载之后，触发此脚本
17. (any)%triggerpostun：此包的旧版本已卸载之后，触发其他包的脚本（如果有，此包脚本不运行）
18. ...... (操作其它软件包) ......
19. (all)%posttrans：事务结束时，执行新软件包的此段代码
20. 验证软件包，Done

* * *

Trigger 示例：

Trigger 用于在操作指定包时，运行您包中的一些代码。通常因为您的包使用其他包的服务，或为其他包提供服务。参考以下的 Trigger 部分。提供以下示例以帮助理解：

```
%triggerin -p /usr/bin/perl -- ruby > 2.0, perl > 5.20  # -p 指定其他解释器

```

以下情况触发此段代码：

- 已安装此包，ruby 或 perl 被安装/升级时
- 已安装 ruby 或 perl，此包被安装/升级时

# 编写脚本片段

以下是一些编写高质量打包脚本的建议。

## 在脚本片段间保存状态

有时脚本需要保存之前脚本的一些状态，以便在之后运行脚本时使用。这常用于对脚本片段进行优化。例如：

- 如果 `%posttrans` 需要在软件包升级时注销一些信息，但旧软件包删除时，包含这些信息的文件也一并被删除，`%pre` 或 `%post` 脚本片段需要在文件中保存这些信息，以便 `%posttrans` 脚本可以访问。
- 如果我们只想让 `%posttrans` 中的程序在每次事务时工作，我们需要编写一个标志文件，使 `%posttrans` 执行相应动作。

为了解决这些问题，脚本片段需要输出供 `%posttrans` 使用的信息。我们建议使用 `%{_localstatedir}/lib/rpm-state/` 子目录保存信息。例如， 当安装 eclipse 插件时，脚本需要在 `%{_localstatedir}/lib/rpm-state/eclipse/` 创建一个文件。 `%posttrans` 运行脚本检查文件是否存在。如果存在，执行相应动作，并删除文件。这样，每次事务时脚本只执行一次操作。

[![Note.png](images/35px-Note.png)](https://fedoraproject.org/wiki/File:Note.png)

在 Fedora 中，我们要求 `%{_localstatedir}/lib/rpm-state/` 目录属于 rpm 或 filesystem 软件包。使用事务时，软件包需要创建自己的 `%{_localstatedir}/lib/rpm-state/` 子目录。

## Macros

复杂的脚本片段可以记录在 rpm 宏中。这有两个好处：

1. 标准包的作者只需要记住宏，不需要记住它复杂的内容。
2. 宏的实现可能改变，而无需更新包。

编写宏时，FPC 需要审阅宏（指南中记录了打包者需要做什么）。

原则上，宏不能包含脚本片段的起始标记（如 `%pre`）。这也意味着，一个宏不能同时定义 `%pre` 和 `%post` 需要执行的动作。相反，需要编写一个宏在 `%pre` 执行，编写另一个宏在 `%post` 执行。此原则使所有 spec 文件可以以同样的方式使用宏，即使它们已定义了 `%pre` 或 `%post`。

## Trigger

Trigger 用于在操作指定包时，运行您包中的一些代码。通常因为您的包使用其他包的服务，或为其他包提供服务。Trigger 语法如下：

```
%trigger{un|in|postun} [[-n] <subpackage>] [-p <program>] -- <trigger>

```

有一个很好的例子。假设您正在为 Emacs 和 Xemacs 编辑器打包一个很好的插件。它可以和这些编辑器一起工作，但根据不同编辑器，需要做不同配置。安装插件时，可以检查 Emacs 和 Xemacs 是否已安装，并配置插件。但是，如果用户稍后安装 Xemacs，那么会发生什么呢？您的插件在 Xemacs 不可用，除非用户卸载并重装插件。通过触发器，可以告诉此包，“已安装 Xemacs，需要执行插件配置”。怎么样，很赞吧！

```
%triggerin -- emacs  # 以下情况执行：已安装此包， emasc 被安装/升级时；已安装 emacs，此包被安装/升级时。
# 安装插件相关代码
%triggerin -- xemacs # 以下情况执行：已安装此包，xemasc 被安装/升级时；已安装 xemacs，此包被安装/升级时。
# 安装插件相关代码
%triggerun -- emacs  # 以下情况执行：已安装此包， emacs 被卸载时；已安装 emacs，此包被卸载时。
# 卸载插件相关代码
%triggerun -- xemacs # 以下情况执行：已安装此包，xemacs 被卸载时；已安装 xemacs，此包被卸载时。
# 卸载插件相关代码

```

rpm 向触发器脚本传递了两个参数。$1 表示脚本完成时本软件包的个数。$2 表示脚本完成时被触发的软件包的个数。

# 代码片段

## 共享库

安装共享库需要运行 /sbin/ldconfig 来更新动态链接器的缓存文件。可调用以下语句：

```
%post
/sbin/ldconfig
%postun
/sbin/ldconfig

```

仅需要运行 ldconfig 时，可使用 -p 选项避免运行 shell：

```
%post -p /sbin/ldconfig
%postun -p /sbin/ldconfig

```

建议使用第二种方式，这样会自动添加 /sbin/ldconfig 依赖到软件包（另外，可以避免启用不必要的 Shell 进程来执行脚本）。

## 用户和组

这些问题在 [separate page](https://fedoraproject.org/wiki/Packaging/UsersAndGroups "Packaging/UsersAndGroups") 讨论。

## 服务

### Init 脚本约定

完整 SysV 风格的 init 脚本指南： [Packaging/SysVInitScript](https://fedoraproject.org/wiki/Packaging/SysVInitScript "Packaging/SysVInitScript") 脚本片段细节： [Packaging/SysVInitScript#InitscriptScriptlets](https://fedoraproject.org/wiki/Packaging/SysVInitScript#InitscriptScriptlets "Packaging/SysVInitScript")

## GConf

GConf 是 GNOME 桌面目前使用的配置方案。程序使用的默认值保存在 \[NAME\].schemas 文件，并安装至 %{\_sysconfdir}/gconf/schemas/\[NAME\].schemas。gconf 守护进程注册并监控这些配置，并在配置变化时通知应用程序。schema 文件中包含了每个值的解释（使用 gconf-editor 查询数据库时显示这些信息）。

在构建包的过程中，必须禁止安装 schema，并在实际安装时，使用 gconf 守护进程注册 \[NAME\].schemas 值；在删除时，注销这些值。脚本片段包含以下 4 个步骤。

创建包时，禁止安装 Gconf schema：

```
%install
export GCONF_DISABLE_MAKEFILE_SCHEMA_INSTALL=1
make install DESTDIR=$RPM_BUILD_ROOT
...

```

GCONF\_DISABLE\_MAKEFILE\_SCHEMA\_INSTALL 环境变量在包构建过程中，禁止安装 schema。另一种方法是通过 configure 标识设置：

```
%build
%configure --disable-schemas
...

```

不幸的是，此选项需要上游开发者修改 Makefile.am 进行处理 。如果 Makefile.am 未配置，此选项不会生效，需使用环境变量代替。

第 2 步：

```
BuildRequires: GConf2
Requires(pre): GConf2
Requires(post): GConf2
Requires(preun): GConf2
...
%pre
%gconf_schema_prepare schema1 schema2
%gconf_schema_obsolete schema3

```

在这一部分，我们使用 2 个宏卸载/更新旧 schema。

`%gconf_schema_prepare` 用于任何 GConf schema。它需要卸载当前已安装的 schema。它需要不包含路径和后缀的空格分隔的 schema 列表。注意宏幕后的工作，这个宏在 `%post` 中只处理已更改的 Gconf schema。

`%gconf_schema_obsolete` 标记废弃包之前提供的 schema。如果系统存在旧 schema，它会将其注销。如果旧 schema 不存在，则不执行动作。此宏接受空格分隔的 schema 列表。以下示例可能用于软件包已改名的情况。如果旧 schema 名为 `foo.schemas`，新 schema 名为 `foobar.schemas`，你应该使用：

```
%gconf_schema_prepare foobar
%gconf_schema_obsolete foo

```

下一步，对新安装的 schema 进行处理：

```
%post
%gconf_schema_upgrade schema1 schema2

```

`%gconf_schema_upgrade` 接受以空格分隔的 schema 列表。在宏幕后，它实际注册新版本的 schema 并注销旧版本。

最后一步，在包删除时注销 schema：

```
%preun
%gconf_schema_remove schema1 schema2

```

当包升级时，rpm 调用 `%pre` 脚本来注册和注销 schema。当包卸载时，使用 `%preun` 脚本。`%gconf_schema_remove` 接受空格分隔的 schema 列表，并提供删除方法。

### 为已修改的宏重建包

当宏修改时，使用这些宏的软件包必须重建，以适应这些变化。repoquery 命令用于查找包含 schema 的软件包：

```
repoquery --whatprovides "/etc/gconf/schemas/*" |sort |uniq |wc -l

```

### EPEL 说明

EPEL 不包含 macros.gconf2，所以请按此说明操作： [Packaging:EPEL#GConf](https://fedoraproject.org/wiki/Packaging:EPEL#GConf "Packaging:EPEL")

## GSettings Schema

GSettings是 GNOME 3 桌面的配置系统。它代替了 GNOME 2 中使用的 GConf 系统。GSettings 支持可插拔后端，本地的 GNOME 使用 DConf 存储设置。GSettings API 和工具属于 glib2 软件包。

程序使用的 GSettings schema 文件保存在 %{\_datadir}/glib-2.0/schemas 目录。schema 文件是扩展名为 .gschema.xml 的 XML 文件。运行时，GSettings 使用已编译的二进制缓存（平台无关），缓存通过 glib-compile-schemas 创建。只要修改 schema，就需要运行 /usr/bin/glib-compile-schemas 更新缓存。

```
%postun
if [ $1 -eq 0 ] ; then
    /usr/bin/glib-compile-schemas %{_datadir}/glib-2.0/schemas &> /dev/null || :
fi

%posttrans
    /usr/bin/glib-compile-schemas %{_datadir}/glib-2.0/schemas &> /dev/null || :

```

## gdk-pixbuf 加载器

gdk-pixbuf 库属于 gdk-pixbuf2 软件包。它用于在 GNOME 中加载各种图像格式。gdk-pixbuf 可通过载入模块来扩展对图像格式的支持。这些模块必须安装在 %{\_libdir}/gdk-pixbuf-2.0/2.10.0/loaders。为了避免载入所有模块，gdk-pixbuf 在 %{\_libdir}/gdk-pixbuf-2.0/2.10.0/loaders.cache 文件中保存模块信息缓存。当模块更改时，需要调用 /usr/bin/gdk-pixbuf-query-loaders 程序更新缓存信息。gdk-pixbuf-query-loaders 包含 -32 和 -64 版本，用于生成对应架构的缓存。

维护缓存文件的脚本是：

```
%postun
    /usr/bin/gdk-pixbuf-query-loaders-%{__isa_bits} --update-cache &> /dev/null || :

%post
if [ $1 -eq 1 ] ; then
    # For upgrades, the cache will be regenerated by the new package's %postun
    /usr/bin/gdk-pixbuf-query-loaders-%{__isa_bits} --update-cache &> /dev/null || :
fi

```

注意， %{\_\_isa\_bits} 宏根据软件包架构返回 32 或 64。

## GTK+ 模块

GTK+ 工具包（gtk3）支持通过加载模块来提供主题引擎，输入方法，打印后端或其他功能。这些模块必须安装至 %{\_libdir}/gtk-3.0 或 %{\_libdir}/gtk-3.0/3.0.0 目录。对于输入法，GTK+ 使用 %{\_libdir}/gtk-3.0/3.0.0/immodules.cache 缓存记录输入法模块信息。当修改输入法时，需要调用 gtk-query-immodules-3.0 更新缓存信息。gtk-query-immodules-3.0 包含 -32 和 -64 版本，用于生成对应架构的缓存。

维护缓存文件的脚本是：

```
%postun
/usr/bin/gtk-query-immodules-3.0-%{__isa_bits} --update-cache &> /dev/null || :

%post
if [ $1 -eq 1 ] ; then
    # For upgrades, the cache will be regenerated by the new package's %postun
    /usr/bin/gtk-query-immodules-3.0-%{__isa_bits} --update-cache &> /dev/null || :
fi

```

3.0版本的可执行文件，是由于 gtk2 包含相同功能的工具（gtk-query-immodules-2.0）。注意， %{\_\_isa\_bits} 宏根据软件包架构返回 32 或 64。

## GIO 模块

GIO 共享库属于 glib2 软件包。它是 GNOME 中的底层堆栈。GIO 可以通过模块中的 [extension points](http://library.gnome.org/devel/gio/2.26/extending-gio.html) 实现扩展。这些扩展模块必须安装至 %{\_libdir}/gio/modules。为了避免载入所有模块，GIO 在相同目录的 giomodule.cache 文件中记录可用模块的缓存信息。当模块改变时，通过调用 gio-querymodules 程序更新缓存信息。 gio-querymodules 包含 -32 和 -64 版本，用于生成对应架构的缓存。

维护缓存文件的脚本是：

```
%postun
/usr/bin/gio-querymodules-%{__isa_bits} %{_libdir}/gio/modules &> /dev/null || :

%post
# We run this after every install or upgrade because of a cornercase
# when installing the second architecture of a multilib package 
/usr/bin/gio-querymodules-%{__isa_bits} %{_libdir}/gio/modules || :

```

注意， %{\_\_isa\_bits} 宏根据软件包架构返回 32 或 64。

## Texinfo

GNU 项目和许多其他程序使用 texinfo 文件格式保存文档。这些 info 文件保存在 /usr/share/info/。安装或删除软件包时，install-info 添加新文件至 info 索引中，并在卸载时删除它们。

```
Requires(post): info
Requires(preun): info
...
%post
/sbin/install-info %{_infodir}/%{name}.info %{_infodir}/dir || :

%preun
if [ $1 = 0 ] ; then
  /sbin/install-info --delete %{_infodir}/%{name}.info %{_infodir}/dir || :
fi

```

这两个脚本使用 install-info 在安装时将 info 页的信息添加至 info 索引文件，并在卸载时删除索引信息。 "|| :" 可防止在系统已配置为不安装任何 %doc 文件，或使用只读挂载 %\_netsharedpath /usr/share时，命令执行失败。

## Scrollkeeper

在当前 Fedora 中， scrollkeeper 已被 rarian 代替。rarian 不需要使用脚本片段进行处理。关于 EPEL 源的进一步说明，请访问 [Packaging:EPEL#Scrollkeeper](https://fedoraproject.org/wiki/Packaging:EPEL#Scrollkeeper "Packaging:EPEL")

## desktop-database

当 desktop entry 包含 MimeType 关键字时，应添加以下脚本。

```
%post
/usr/bin/update-desktop-database &> /dev/null || :

%postun
/usr/bin/update-desktop-database &> /dev/null || :

```

注意：对于 Fedora Core 5 之后的版本，使用相同的 mimeinfo 文件和 gtk-icon-cache。即 spec 文件不需要为此添加 Require desktop-file-utils 。对于旧发行版，应添加以下语句：

```
Requires(post): desktop-file-utils
Requires(postun): desktop-file-utils

```

(访问 [http://bugzilla.redhat.com/180898](http://bugzilla.redhat.com/180898) 和 [http://bugzilla.redhat.com/180899](http://bugzilla.redhat.com/180899))

## mimeinfo

当软件包在 %{\_datadir}/mime/packages 安装 XML 文件时，需使用以下脚本。

```
%post
/bin/touch --no-create %{_datadir}/mime/packages &>/dev/null || :

%postun
if [ $1 -eq 0 ] ; then
  /usr/bin/update-mime-database %{_datadir}/mime &> /dev/null || :
fi

%posttrans
/usr/bin/update-mime-database %{?fedora:-n} %{_datadir}/mime &> /dev/null || :

```

注意，与 gtk-update-icon-cache 代码类似，这些脚本只在安装 shared-mime-info 软件包时运行，但不需要指定 Requires: shared-mime-info 。如果未安装 shared-mime-info，update-mime-database 不会运行。然而这并不重要，因为大部分系统默认安装 shared-mime-info。

## Icon 缓存

如果应用程序在 `%{_datadir}/icons/` 的子目录（如 `hicolor`）安装图标，则必须更新图标缓存，以便菜单正常显示图标。这包括：更新图标上层目录的时间戳，并运行 `gtk-update-icon-cache`。'touch' 顶层目录以便兼容 [Icon theme specification](http://standards.freedesktop.org/icon-theme-spec/latest/ar01s08.html) 的环境可以刷新缓存，并且 `gtk-update-icon-cache` 的运行也需要基于目录的时间戳。

注意，不需要为此添加依赖关系。如果 gtk-update-icon-cache 不可用，则不会更新图标缓存，同上，如果 "touch" 不可用，则不会更新图标缓存。不添加 gtk-update-icon-cache（即 gtk2 >= 2.6.0）或 "touch" 依赖，使软件包（spec）对系统的兼容性更好。例如，旧发行版或最小化安装方式，通常在 spec 文件、rpmdb 和源的元数据中不包含这些包的条目。

```
%post
/bin/touch --no-create %{_datadir}/icons/hicolor &>/dev/null || :

%postun
if [ $1 -eq 0 ] ; then
    /bin/touch --no-create %{_datadir}/icons/hicolor &>/dev/null
    /usr/bin/gtk-update-icon-cache %{_datadir}/icons/hicolor &>/dev/null || :
fi

%posttrans
/usr/bin/gtk-update-icon-cache %{_datadir}/icons/hicolor &>/dev/null || :

```

## Systemd

包含 systemd unit 文件的软件包，需要使用脚本以确保妥善处理这些服务。默认服务可以启用或禁用。确定哪些情况下可以启动服务，请参考 FESCo 策略： [Starting\_services\_by\_default](https://fedoraproject.org/wiki/Starting_services_by_default "Starting services by default")。升级包时，如果服务正在运行，则会重启服务；如果服务未运行，则不启动它。同时，如果服务当前被禁用，则服务不会启用。

### 新软件包

[![Note.png](images/35px-Note.png)](https://fedoraproject.org/wiki/File:Note.png)

**什么是新软件包?** 在这段文字中，一个新软件包指不包含任何 SysV init 脚本文件的包。

#### Scriptlets

Fedora 18+ 之后的 systemd 软件包，提供了一系列宏来帮助处理 systemd 服务。这些宏的功能相当于旧版本 Fedora 的启动脚本，但它还加入了 systemd "presets" 支持，参考文档： [https://fedoraproject.org/wiki/Features/PackagePresets](https://fedoraproject.org/wiki/Features/PackagePresets) 注意不要使用 %systemd\_requires 宏。

```
Requires(post): systemd
Requires(preun): systemd
Requires(postun): systemd
BuildRequires: systemd

[...]
%post
%systemd_post apache-httpd.service

%preun
%systemd_preun apache-httpd.service

%postun
%systemd_postun_with_restart apache-httpd.service 

```

有些服务不支持重启（如 D-Bus 和某些存储守护进程）。如果你的服务不需要在升级时重启，使用以下 `%post` 脚本代替以上脚本：

```
%postun
%systemd_postun

```

如果你的软件包包含的一个或多个 systemd unit，需要在安装时默认启用，它们 **必须** 符合 [Fedora preset policy](https://fedoraproject.org/wiki/Starting_services_by_default "Starting services by default")。

宏的细节信息，请参考以下链接： [http://cgit.freedesktop.org/systemd/systemd/tree/src/core/macros.systemd.in](http://cgit.freedesktop.org/systemd/systemd/tree/src/core/macros.systemd.in) [http://www.freedesktop.org/software/systemd/man/daemon.html](http://www.freedesktop.org/software/systemd/man/daemon.html)

### 将软件包从 SysV init 脚本迁移至 Systemd Unit

当从包含 SysV init 脚本的软件包升级至包含 systemd unit 文件的软件包时，将使用新的管理策略，不迁移用户之前的配置。因此，可以简单的使用以上脚本，不必担心将 SysV 的相关信息迁移到 systemd。

[![Warning.png](images/35px-Warning.png)](https://fedoraproject.org/wiki/File:Warning.png)

**在发行版之间迁移** 软件包严禁从 systemd 更新到一个不包含 systemd 的版本。由于迁移将重置系统管理服务。只允许在 Fedora 版本间进行迁移。

## Shells

`/etc/shells` 配置文件用于控制应用程序是否可以作为系统的用户登录 shell。它包含用于系统的有效 shells。如果你制作了一个新的 shell 软件包，你需要将 shell 添加至此文件。详细参考： `man 5 SHELLS` 获得更多信息。

由于此配置可以编辑，所以首先需要确定配置已包含相关路径。如果路径不存在，就需要查看 shell 的二进制文件路径。自从 Fedora 17 应用 UsrMove Feature 后，`/bin` 作为 `/usr/bin` 目录的软链接，我们需要导出所有路径至 `/etc/shells` 文件。以下脚本，以打包名为 "foo" 的 shell 为例：

```
%post
if [ "$1" = 1 ]; then
  if [ ! -f %{_sysconfdir}/shells ] ; then
    echo "%{_bindir}/foo" > %{_sysconfdir}/shells
    echo "/bin/foo" >> %{_sysconfdir}/shells
  else
    grep -q "^%{_bindir}/foo$" %{_sysconfdir}/shells || echo "%{_bindir}/foo" >> %{_sysconfdir}/shells
    grep -q "^/bin/foo$" %{_sysconfdir}/shells || echo "/bin/foo" >> %{_sysconfdir}/shells
fi

%postun
if [ "$1" = 0 ] && [ -f %{_sysconfdir}/shells ] ; then
  sed -i '\!^%{_bindir}/foo$!d' %{_sysconfdir}/shells
  sed -i '\!^/bin/foo$!d' %{_sysconfdir}/shells
fi

```

<a id="aur-submit-guide"></a>

## AUR 提交指南

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
