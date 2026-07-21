---
title: "非官方 Windows Vista x64 Extender Kernel 分步安装指南"
date: 2022-05-10
categories:
  - "Windows"
tags:
  - "vista"
  - "windows"
  - "kernel"
  - "linux"
---

**安装包下载：[vistaexkernsetup\_02042022.7z](https://wiki.wenyinos.com/wp-content/uploads/2022/05/vistaexkernsetup_02042022.7z)**

**原文：[https://msfn.org/board/topic/183046-guide-vista-extended-kernel-installation/vistaexkernsetup\_02042022](https://msfn.org/board/topic/183046-guide-vista-extended-kernel-installation/vistaexkernsetup_02042022)**

**扩展内核的所有学分都转到[@win32](https://msfn.org/board/profile/424412-win32/)， 不是我。**

免责声明：对于因遵循/错误遵循本教程而对您的 PC（或笔记本电脑或其他任何东西）造成的任何损坏，我绝对不承担任何责任。**在继续之前备份所有内容。**

特别感谢[@winvispixp](https://msfn.org/board/profile/429240-winvispixp/)用于指导改进建议。

[与扩展内核一起工作的不受 Vista 支持的程序列表](https://msfn.org/board/topic/181696-software-compatible-with-windows-vista-extended-kernel/page/20/#comment-1209536)

**版本 02042022（当前）：**

**准备工作：**

1\. 准备一个 .7z 的解压程序（例如 7-zip）。

2\. 准备好 Ubuntu 或 Linux Mint 安装光盘（用于方法 2 和卸载）。

3.更新你的Vista到2017 EOL版本（特别是安装sp1、sp2和平台更新）。

4\. （可选）您可以根据需要安装一些服务器 2008 更新。为了安全起见，首先在虚拟机上测试它们。

5.（可选但强烈推荐）安装 KB4019478 - D3Dcompiler-x64 更新、.NET Framework 4.6.1 和 3.5、DirectX 2010 年 6 月可再发行组件以及所有 Visual C++ 可再发行组件 64 和 32 位。

6\. 按以下顺序安装 SHA-2 Server 2008 更新：KB4039648-v2、KB4493730、KB4474419。

7.       **备份您的原始文件。**

8\. 将 vistaexkernsetup\_02042022.7z 文件解压到您喜欢的任何文件夹中（后来称为文件夹 X）。

**方法一**

方法 1 涉及使用安装程序。不幸的是，对于许多用户来说，安装程序只会删除原始文件，但不会用新文件替换它们。如果您遇到此问题，请改用方法 2。

1\. 以管理员身份运行 vistaexkernelsetup.cmd。

2\. 按照计算机屏幕上的说明进行操作。

3\. 确保 %systemroot%\\system32 中存在 kernel32.dll 等文件。如果不是，请使用方法 2。

4\. 重新启动计算机。

5.修复文件权限。

6.恭喜，享受

**方法二**

方法 2 涉及使用 Ubuntu live CD。我们使用 Ubuntu 而不是其他 Windows 安装的原因是因为 Ubuntu 不支持 NTFS 文件权限，因此完全忽略它们，使文件替换更容易。

1\. 插入 Ubuntu 安装盘 CD 或 USB（AKA live CD）。

2\. 以管理员身份启动 cmd.exe 并运行以下不带引号的命令：“bcdedit /set {current} nointegritychecks yes”。

3\. 重新启动进入 Ubuntu live CD。

4\. 选择：“试用 Ubuntu”。

5\. 在顶部栏上转到：Places\\Computer。（这可能因您拥有的 Ubuntu 版本而异）。

6.找到文件夹X，将文件夹X中的所有dll和exe文件（除了ntext86.dll、kernel32x86.dll、powrprofx86.dll和ntk32.dll）复制到yourpartition:\\windows\\system32，出现提示时点击replace（确保你有备份）。

7\. 如果您的 Vista 是 UEFI，请对 winload.efi 执行相同操作。

8.将yourpartition:\\windows\\system32中的ntk32x64.dll重命名为ntk32.dll

9\. （可选）要安装 32 位扩展内核，首先将旧的 32 位 kernel32 重命名为 kernelol.dll，然后将文件夹 X 中的 ntext86.dll、kernel32x86.dll、powrprofx86.dll 和 ntk32.dll 移动到不同的目录并重命名前三个到“ntext.dll”、“kernel32.dll”和“powrprof.dll”，然后将三个都复制到yourpartition:\\windows\\SysWOW64，提示时点击替换（现在32位扩展内核很早开发阶段，所以个人不推荐日常使用）。

10\. 关闭 Ubuntu 并启动 Windows。

11.修复文件权限。

12.恭喜，享受

 

**方法三**

如果您不想替换系统文件，您可以使特定程序使用扩展内核 dll，而不是使用本地重定向的普通 Vista 程序。不幸的是，这种方法不能让您运行大多数新应用程序，该文件替换会做（例如，从另一个和许多其他生成的 exe 文件存在问题）。

1\. 应用 DLLredirectionenabler.reg。

2\. 对于要使用扩展内核运行的每个应用程序，请执行以下操作：

3\. 为 exefilesname.exe 创建一个 exefilesname.exe.local 文件夹。

4\. 将文件夹 X 中的文件放入 exefilesname.exe.local 文件夹中。

5.恭喜，享受

 

**修复文件权限**

如果您在安装后访问 system32，您可能会注意到扩展内核文件的权限如下所示：

显然，让“所有人”修改您的核心系统文件会导致严重的安全问题，因此有必要恢复默认文件权限模式：

**所有者应该是：“nt service\\Trustedinstaller”。**

例子：

1.找到%systemroot%\\system32\\kernel32.dll

2\. 打开属性并在安全选项卡下单击“高级”。

3\. 确保禁用“包括从该对象的父级继承的权限”复选框。

4.关闭高级窗口，点击“编辑”

5.删除“Everyone”和其他不在默认模式中的帐户。

6\. 添加“用户”和“管理员”帐户并为其设置权限以匹配默认模式。名称必须使用您的语言。如果您不知道如何拼写单词，请查看其他系统文件。

7\. 添加“SYSTEM”帐户并为其设置权限以匹配默认模式。

8\. 添加“nt service\\Trustedinstaller”帐户并为其设置权限以匹配默认模式。这次他们不同了。

9\. 点击“确定”。

10\. 打开属性并在安全选项卡下再次单击“高级”。

11\. 在“所有者”选项卡下单击“编辑”而不是“其他用户或组”。

12\. 输入不带引号的“nt service\\Trustedinstaller”。

13\. 单击“确定”。

14\. 恭喜！

对其他文件执行相同操作：

如果您只安装了 64 扩展内核，则您必须仅在 system32 中为您已替换的以下文件恢复文件权限：

- ci.dll
- dwmapi.dll
- kernel32.dll
- ntdll.dll
- ntk32.dll
- ntoskrnl.exe
- ole32.dll
- powerprof.dll
- shell32.dll
- user32.dll
- uxtheme.dll
- 下载文件
- 下载文件

如果您安装了 32 位扩展内核，那么您还必须在 syswow64 中恢复访问权限（对于您已替换的以下文件）：

- ntk32.dll
- ntext.dll
- kernel32.dll
- powerprof.dll

这些是这些文件的最终名称，请记住，其中一些必须在安装过程中重命名，如指南中所述的将 ntk32x64dll 重命名为 ntk32.dll。

**可选的扩展内核组件**

d3d12.dll - 这是适用于 Windows 7 的 DirectX 12。您可以将其复制到 system32。它有效吗？我不知道。（可能不是）。

Windows 7 Media Foundation Platform - 这是某些程序（如 Firefox）中的视频编解码器支持所必需的。通过安装使 Windows 7 mfplat 系统范围广会导致 Windows Media Player 和 Dremscene 出现问题，因此建议改用重定向方法：

1\. 应用 DLLredirectionenabler.reg。

2\. 对于您要使用 Windows 7 mfplat 运行的每个应用程序，请执行以下操作：

3\. 为 exefilesname.exe 创建一个 exefilesname.exe.local 文件夹。

4\. 解压 mfplatsetup.7z 并将其中包含的所有 dll 复制到 exefilesname.exe.local 文件夹中。

5.恭喜，享受

**Windows 版本欺骗器**

版本欺骗程序可让您欺骗程序以为您正在运行更新版本的 Windows！

1. 在 %systemroot% 文件夹中创建一个名为“osver.ini”（不带引号）的空文件。
2. 将以下模板的内容放入您的文件中。
3. 根据您的需要调整模板。

模板：

```
[Path to an exe file]
Commandname=1 

[Path to another exe file]
Commandname=1 

[global]
Commandname=1
```

支持的命令列表：

Enabled=1（始终需要这个）

Win7SuperVerFix

Win8SuperVerFix

Win10SuperVerFix

FirefoxFix (a lighter version of Win7SuperVerFix)

MajorVersion

MinorVersion

BuildNumber

CSDVersion（服务包字符串）

PlatformId（注意，标准值2表示操作系统是Windows NT。1代表9x，0代表Win32s）

[https://msfn.org/board/topic/181612-wip-windows-vista-extended-kernel/page/111/](https://msfn.org/board/topic/181612-wip-windows-vista-extended-kernel/page/111/)

例子：

```
[global]
Enabled=1
Win7SuperVerFix=1
MinorVersion=1
BuildNumber=7601
```

```
[C:\Program Files\Mozilla Firefox\firefox.exe]
Enabled=1
FirefoxFix=1

[global]
```

**无法与扩展内核一起使用的 Vista 兼容程序列表。**

Windows 边栏（可解析）：

1\. 应用 DLLredirectionenabler.reg。

2\. 在 %programfiles%\\Windows Sidebar\\ 中创建一个“sidebar.exe.local”文件夹。

3\. 将备份的 ole.dll 复制到“sidebar.exe.local”文件夹。

4.恭喜，享受

CPU-Z（可解析）- [https://msfn.org/board/topic/183046-guide-vista-extended-kernel-installation/?do=findComment&comment=1207488](https://msfn.org/board/topic/183046-guide-vista-extended-kernel-installation/?do=findComment&comment=1207488)

卡巴斯基杀毒软件 - [https://msfn.org/board/topic/181612-wip-windows-vista-extended-kernel/page/112/](https://msfn.org/board/topic/181612-wip-windows-vista-extended-kernel/page/112/)

VirtualBox（作为主机）- VirtualBox 检查系统文件是否由 Microsoft 签名。（它被称为“hardering”）

随意报告其他程序。

**如何卸载扩展内核？**

方法一

1. 如果您在安装过程中使用方法 1，则 dll 会自动备份为 \[nameofdll\].dll.bak。您只需要删除扩展内核 dll，然后更改原版内核的名称（删除 .bak 扩展名；它应该看起来像 \[nameofdll\].dll 之后）
2. 修复文件权限

方法二

1. 按照方法 2 的步骤进行操作，但不要复制扩展内核文件，而是将备份文件放回 system32（或 SysWOW64，如果您要卸载 32 位扩展内核）
2. 修复文件权限。

方法三

1. 或者，可以使用 Windows Vista PE 完成文件替换。
2. 从 CD 或 USB 启动
3. 选择您的键盘布局，然后在下一个屏幕上单击“修复我的计算机”并选择 CMD。
4. 您可以使用 7-Zip 或记事本的“另存为”对话框作为 GUI
5. 将备份文件放回 system32（或 SysWOW64，如果您正在卸载 32 位扩展内核）
6. 修复文件权限
