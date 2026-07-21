---
title: "Unofficial Windows Vista x64 Extender Kernel step by step installation guide"
date: 2022-05-10
categories:
  - "Windows"
tags:
  - "vista"
  - "windows"
  - "kernel"
  - "linux"
---

[vistaexkernsetup\_02042022.7z](https://wiki.wenyinos.com/wp-content/uploads/2022/05/vistaexkernsetup_02042022.7z)

**All the credits for the Extended Kernel go to [@win32](https://msfn.org/board/profile/424412-win32/), not me.**

Disclaimer: I take absolutely no responsibility for any damage to your PC (or laptop or whatever) caused by following/misfollowing this tutorial. **Backup everything before continuing.**

Special thanks to [@winvispixp](https://msfn.org/board/profile/429240-winvispixp/) for guide improvement suggestions.

[List of Vista-unsupported programs that work with the extended kernel](https://msfn.org/board/topic/181696-software-compatible-with-windows-vista-extended-kernel/page/20/#comment-1209536)

**version 02042022 (current):**

**Preparations:**

1.       Prepare a .7z extracting program (for  example 7-zip).

2.       Prepare Ubuntu or Linux Mint installation CD (for method 2 and uninsallation).

3.       Update your Vista to 2017 EOL version (especially install sp1,sp2 and the platform update).

4.       (Optional) You can install some server 2008 updates if you want. For safety test them on a virtual machine first.

5.       (Optional but highly recommended) Install KB4019478 - D3Dcompiler-x64 update, .NET Framework 4.6.1 and 3.5, DirectX June 2010 redistributable and all the Visual C++ redistributables 64 and 32 bit.

6\.       Install SHA-2 Server 2008 updates in the following order: KB4039648-v2,KB4493730, KB4474419.

7.       **Backup your original files.**

8.       Extract the vistaexkernsetup\_02042022.7z file into any folder you like (later called folder X).

**Method 1**

Method 1 involves using the Installer. Unfortunately for many users the installer only removes the original files, but it doesn’t  replace them with new ones. If you are facing this problem, use method 2 instead.

1.       Run the vistaexkernelsetup.cmd as administrator.

2.       Follow the instructions on your computer’s screen.

3.       Make sure that files like kernel32.dll are present in %systemroot%\\system32. If they are not, use method 2.

4.       Reboot the computer.

5.       Repair file permissions.

6.       Congratulations, enjoy

 

**Method 2**

Method 2 involves using the Ubuntu live CD. The reason why we use Ubuntu and not another windows installation is because Ubuntu doesn’t support NTFS file permissions and thus ignores them completely making file replacing much easier.

1.       Insert Ubuntu installation disk Either CD or USB (AKA live CD).

2.       Launch cmd.exe as administrator and run the following command without quotes: “bcdedit /set {current} nointegritychecks yes”.

3.       Reboot into the Ubuntu live CD.

4.       Choose: “Try Ubuntu”.

5.       On the top bar go to: Places\\Computer. (This may differ depending on version of Ubuntu you have).

6.       Locate folder X and copy all the dll and exe files from the folder X (EXCEPT ntext86.dll, kernel32x86.dll, powrprofx86.dll and ntk32.dll) to yourpartition:\\windows\\system32, click replace when prompted (make sure you have a backup).

7.       If your Vista is UEFI, do the same for winload.efi.

8.       Rename ntk32x64.dll in yourpartition:\\windows\\system32 to ntk32.dll

9.       (Optional) To install 32bit extended kernel first rename your old 32-bit kernel32 to kernelol.dll, than move ntext86.dll, kernel32x86.dll, powrprofx86.dll and ntk32.dll from the folder X to a different directory and rename first three of them to “ntext.dll”,  “kernel32.dll” and "powrprof.dll", than copy all three to yourpartition:\\windows\\SysWOW64, click replace when prompted (Right now 32bit extended kernel is in a very early stage of development, so personally I don’t recommend it for daily usage).

10\.     Shut down Ubuntu and boot Windows.

11.     Repair file permissions.

12\.     Congratulations, enjoy

 

**Method 3**

If you don’t want to replace your system files, you can make specific programs use extended kernel dlls instead of vanilla Vista ones using local redirection. Unfortunately  this method doesn’t let you run most of the new applications, that file replacing would do (for example there is a problem with exe files that spawn from another and many other).

1.       Apply the DLLredirectionenabler.reg.

2.       For each application you want to run with the extended kernel, do the following:

3.       For exefilesname.exe create an exefilesname.exe.local folder.

4.       Put files from folder X in the exefilesname.exe.local folder.

5.       Congratulations, enjoy

 

**Repairing file permissions**

If you visit system32 after the installation you will probably notice that permissions for extended kernel files look like this:

 

Obviously letting “Everyone” to modify your core system files causes a serious security issue so it is necessary to restore the default file permissions pattern:

 

**The owner should be: “nt service\\Trustedinstaller”.**

Example:

1.       Locate %systemroot%\\system32\\kernel32.dll

2.       Open properties and under security tab click “Advanced”.

3.       Make sure that “Include inheritable permissions from this object’s parent” checkbox is disabled.

4.       Close the advanced window and click “edit”

5.       Remove “Everyone” and other account that are not in the default pattern.

6.       Add  “Users” and “Administrators” accounts and set permissions for them to match the default pattern. The names have to be in your language. Look at other system files if you don’t know how to spell the words.

7.       Add “SYSTEM” account and set permissions for it to match the default pattern.

8.       Add “nt service\\Trustedinstaller” account and set permissions for it to match the default pattern. They are different this time.

9.       Click “OK”.

10.   Open properties and under security tab click “Advanced” again.

11.   Under  “Owner” tab click “edit” than “Other users or groups”.

12.   Enter “nt service\\Trustedinstaller” without quotes.

13.   Click “OK”.

14.   Congratulations!

Do the same for other files:

If you have installed only 64 extended kernel than you have to restore file permissions only in system32 for the following files that you have replaced:

- ci.dll
- dwmapi.dll
- kernel32.dll
- ntdll.dll
- ntk32.dll
- ntoskrnl.exe
- ole32.dll
- powrprof.dll
- shell32.dll
- user32.dll
- uxtheme.dll
- winload.efi
- winload.exe

If you have installed 32 bit extended kernel than you also have to restore access rights in syswow64 too (for the following files that you have replaced):

- ntk32.dll
- ntext.dll
- kernel32.dll
- powrprof.dll

These are the final names for those files, remember that some of them have to be renamed during the installation like ntk32x64dll into ntk32.dll as described in the guide.

 

**Optional Extended Kernel components**

d3d12.dll - This is DirectX 12 for Windows 7. You can copy it to system32. Does it work? I have no idea. (probably not).

Windows 7 Media Foundation Platform - This is needed for video codec support in some programs like Firefox. Making the Windows 7 mfplat system wide by installing it causes problems with Windows Media Player and Dremscene, so it's recommended to use redirection method instead:

1.       Apply the DLLredirectionenabler.reg.

2.       For each application you want to run with the Windows 7 mfplat, do the following:

3.       For exefilesname.exe create an exefilesname.exe.local folder.

4.       Extract the mfplatsetup.7z and copy all the dlls it contains to the exefilesname.exe.local folder.

5.       Congratulations, enjoy

**Windows Version Spoofer**

Version spoofer allows you to fool programs into thinking that you are running a newer version of Windows!

1. Create an empty file called "osver.ini" (without quotes) in the %systemroot% folder.
2. Put contents of the template below in your file.
3. Adjust the template depending on your needs.

Template:

```
[Path to an exe file]
Commandname=1 

[Path to another exe file]
Commandname=1 

[global]
Commandname=1
```

List of supported commands:

Enabled (this one is always needed)

Win7SuperVerFix

Win8SuperVerFix

Win10SuperVerFix

FirefoxFix (a lighter version of Win7SuperVerFix)

MajorVersion

MinorVersion

BuildNumber

CSDVersion (the service pack string)

PlatformId (caution, as the standard value of 2 is used to indicate that the OS is Windows NT. 1 represents 9x and 0 represents Win32s)

[https://msfn.org/board/topic/181612-wip-windows-vista-extended-kernel/page/111/](https://msfn.org/board/topic/181612-wip-windows-vista-extended-kernel/page/111/)

Example:

```
[C:\Program Files\Mozilla Firefox\firefox.exe]
Enabled=1
FirefoxFix=1

[global]
```

 

**Common errors**

- If you're using an ISO from MSDN you may encounter an error "The ordinal 899 could not be located in the dynamic link library SHELL32.dll" while booting. you need to swap the explorer.exe from C:\\Windows with the one called "replacement explorer".
- This error appears, when winload.exe's signature is different from the one expected by Windows. Make sure you have run this command: “bcdedit /set {current} nointegritychecks yes” and that you have replaced all of the required files.
- Make sure you have all the necessary updates installed.

 

**List of Vista-compatible programs that don’t work with the extended kernel.**

Windows Sidebar (resolvable):

1.       Apply the DLLredirectionenabler.reg.

2.       Create a "sidebar.exe.local" folder in %programfiles%\\Windows Sidebar\\ .

3.       Copy your backup ole.dll to the "sidebar.exe.local" folder.

4.       Congratulations, enjoy

CPU-Z (resolvable) - [https://msfn.org/board/topic/183046-guide-vista-extended-kernel-installation/?do=findComment&comment=1207488](https://msfn.org/board/topic/183046-guide-vista-extended-kernel-installation/?do=findComment&comment=1207488)

Kaspersky antivirus - [https://msfn.org/board/topic/181612-wip-windows-vista-extended-kernel/page/112/](https://msfn.org/board/topic/181612-wip-windows-vista-extended-kernel/page/112/)

VirtualBox (as a host) - VirtualBox checks if system files were signed by Microsoft. (it is called "hardering")

Feel free to report other programs.

**How to uninstall the extended kernel?**

Method 1

1. If you used Method 1 durning installation, the dlls were automatically backed up as \[nameofdll\].dll.bak. You just need to delete the extended kernel dll and then change the name of the vanilla one (delete the .bak extension; it should look like \[nameofdll\].dll after)
2. Repair File permissions

Method 2

1. Follow the Method 2 steps, but instead of copying extended kernel files, put your backup files back in system32 (or SysWOW64 if you are uninstalling the 32bit extended kernel)
2. Repair file permissions.

Method 3

1. Alternatively, file replacement can be done using Windows Vista PE.
2. Boot from CD or USB
3. Choose your keyboard layout and on the next screen click "Repair my Computer" and choose CMD.
4. You can use 7-Zip or Notepad's "save as" dialog as GUI
5. Put your backup files back in system32 (or SysWOW64 if you are uninstalling the 32bit extended kernel)
6. Repair file permissions

[https://msfn.org/board/topic/183046-guide-vista-extended-kernel-installation/](https://msfn.org/board/topic/183046-guide-vista-extended-kernel-installation/)[vistaexkernsetup\_02042022](https://wiki.wenyinos.com/wp-content/uploads/2022/05/vistaexkernsetup_02042022.7z)
