---
title: "How to create an RPM package/zh-hk（如何创建一个打包的RPM"
date: 2018-03-02
categories:
  - "开发工具"
tags:
  - "fedora"
  - "rpm"
  - "packaging"
  - "linux"
  - "package-management"
---

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
