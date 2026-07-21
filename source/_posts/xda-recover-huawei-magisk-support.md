---
title: "XDA开发者已修复华为设备的Magisk支持"
date: 2018-10-11
categories:
  - "硬件设备"
tags: 
  - "huawei"
  - "magisk"
---

原文：[Huawei rolled out an update which broke Magisk, but it can be easily fixed](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/huawei-update-broke-magisk-fix/)

尽管最近美国和澳大利亚市场出现了问题，但华为继续在全球范围内拓展业务。该公司迅速成长到主导中国市场，现在正在挑战苹果和三星等公司。他们的[华为P20](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/huawei-p20)旗舰产品阵容证明了他们的成功，评论家们对它的相机，产品质量和功能表示赞赏，并且他们必将于[华为Mate 20](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/huawei-mate-20-notch-render-specifications/)再次掀起波澜。该公司的子品牌荣耀提供 [Honor Play](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/hands-on-with-the-honor-play/) 和[Honor 10等设备，](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/honor-10-mini-review-two-months-later/) 以在中端市场竞争。正是因为像这样的智能手机，许多XDA开发者都是华为和Honor设备的粉丝，但是很多人都知道，华为决定在令人惊讶的反消费者行动中[停止提供引导加载程序解锁代码](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/huawei-honor-request-bootloader-unlock-code/)，可以有效阻止开发者对手机的大多数开发和修改。

[我们之前已经在门户网站上解决了这个问题](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/xda-huawei-decision-stop-bootloader-unlocking/)，我们仍然对此决定感到非常失望。让像华为这样的巨头改变他们的决定或者至少提出妥协并不容易，虽然在这[方面取得了一些进展](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/honor-view-10/development/honor-bootloader-unlocking-limited-t3837880)，但对于爱好者来说情况依然严峻。最近的更新让人们对公司失去了更多的信心，因为更新导致使用**[Magisk进行root的](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/apps/magisk)**手机**不再启动，除非重新刷入原始的ramdisk映像**。因此，华为和Honor设备所有者不仅无法解锁他们的bootloader，而且那些已经这样做的人变得无法root他们的设备。许多公司对这个似乎（又一个）反爱好者的举动**感到震惊**，但对更新的调查显示，软件变砖是**更新的副作用，而不是故意阻止Magisk / root**。以下是我们对此更新的所有了解。

## 华为的“Patch01”更新阻止了Magisk-rooted手机的启动

XDA高级会员[Tecalote](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/member.php%3Fu%3D6870018) 在官方Magisk Beta XDA论坛帖子中首次[曝光了](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/apps/magisk/beta-magisk-v13-0-0980cb6-t3618589/post77415750%23post77415750)这个问题，[然后进一步详细说明](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/showpost.php%3Fp%3D77418253%26postcount%3D6557)[了](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/apps/magisk/beta-magisk-v13-0-0980cb6-t3618589/post77415750%23post77415750)这个问题。该成员在重新命名他的设备后，在他的[华为P9](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/p9)上偶然发现了这个问题，因此他可以安装官方的[Android Oreo](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/tag/android-oreo/)更新，然后安装一个小的“错误修复”OTA更新。更新本身，称为“patch01”，包括MMS和游戏的修复，但它还包括一个内核补丁软件块Magisk root设备。

根据他的说法，他在进行更新之前刷了原始启动映像，原始恢复和卸载的Magisk Manager，此时手机设法启动就好了。但是，在更新后重新刷新Magisk会导致手机卡在“您的设备无法信任”闪屏中。更新的固件仅使用原始b528 ramdisk映像启动。无论是否禁用了dm-verity，强制加密或Android验证启动，这种行为都会持续存在，并且Magisk v16.0和v16.7都已经过测试。（只是刷入[TWRP](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/how-to-install-twrp/)不是一个问题，因为恢复闪存到它自己的分区名recovery\_ramdisk，但是之后尝试root手机会触发一个bootloop。）

到目前为止，已有几个用户确认此行为。它似乎也不仅限于华为P9，因为[华为Mate 10论坛上的用户在](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/showpost.php%3Fp%3D77405758%26postcount%3D256)安装“patch01”OTA更新后也确认了相同的行为，这使我们认为这个补丁将推广到所有人目前支持华为/ Honor手机。鉴于华为最近关于引导加载程序解锁的行动，不难看出为什么人们认为这个更新被推出以故意阻止root。XDA认可的开发者/认可贡献者[topjohnwu是Magisk](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/member.php%3Fu%3D4470081)背后的主要开发者，最初在他的Twitter账户上承认了这个问题。
![](images/v2-1257680677e5929f698d4b0d05142bdf_hd.jpg)
Tecalote本人以及几位华为用户和开发人员在过去几天里承担了彻底调查问题的任务，[并设法找到了解决方案](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/showpost.php%3Fp%3D77560239%26postcount%3D27389)。
![](images/v2-41bf401b41470cca2c41a40990bcd311_hd.jpg)

## 为什么这样做？

![](images/v2-f19501a5ef89611baa46991f90750b29_hd.jpg)
初步证据（以及高度匆忙的猜测，谣言和文章/讨论）使得用户认为此更新被推出的唯一目的是从设备中锁定root用户。毕竟，华为最近对引导程序解锁采取了敌对态度。这可能不是手机制造商第一次对抗用户root手机了：去年，我们报告称LG包含了一个[root checker工具](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/lg-root-checker-tool-slow-performance/)，当它检测到root时会变得混乱。当然，我们也有许多[制造商和运营商阻止引导加载程序解锁的情况，](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/august-security-update-on-nokia-phones-blocks-the-only-bootloader-unlock-method/)以防止用户搞乱他们的手机，我们最近也包括华为。

然而，XDA高级会员Tecalote和其他用户的进一步研究表明，这不一定是华为打击root用户的情况。相反，我们更有可能处理内核补丁的意外副作用，导致Magisk修补的ramdisk映像不兼容并阻止手机启动。此外，用户可以轻松解决问题，让Magisk在修补手机上正常工作。
![](images/v2-0e1a31c3ff2a2595f806d5eb7984028d_hd.jpg)
在一天结束时，我们无法确定这是否是故意的，因为华为的确切意图尚不清楚。我们没有看到一个合理的理由，为什么这个更新（如果确实是为了阻止用户root而有意做的话）存在，因为受影响的用户已经跳过了箍来解锁他们的bootloader。但鉴于最近有关该主题的研究和背景，以及您在更新后仍然可以安装Magisk这一事实，我们认为这根本不是故意的。

## 我怎样才能解决这个问题？

如果您已经更新了设备并希望在其上安装Magisk，则需要在安装之前启用“保留AVB 2.0 / dm-verity”标志，正如Tecalote在我们的论坛上透露的那样。您不能简单地在TWRP上刷新最新的Magisk zip，因为安装时不会自动设置所述标志，但您可以使用Magisk Manager手动修补启动映像：

1. 从官方线程下载最新的Magisk Manager APK，将其安装到您的设备上，然后打开应用程序。
2. 确保已启用“ **保留AVB 2.0 / dm-verity** ”复选框，如果已禁用，则启用它。如果您的设备已加密，请确保已启用“保留强制加密”。
3. 点击“安装”按钮，然后选择“ **Patch Boot Image File** ”选项。这将在应用程序内部创建一个Magisk修补的启动映像。
4. 将生成的启动映像刷新到您的设备。您可以在安装[FASTBOOT](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/google-releases-separate-adb-and-fastboot-binary-downloads/)通过移动文件到您的计算机的FASTBOOT目录，您的手机重新启动，以FASTBOOT模式，并使用“模式”命令，或者直接转至安装与TWRP刷入它，点击“Install image”按钮，刷入新patch过的boot.img。
5. `fastboot flash boot boot.img`
6. 重新启动系统并再次打开Magisk Manager应用程序。如果弹出窗口询问您是否要继续使用Magisk的其他设置，请点击是。
7. 请正常享用！

如果你已经root并且不想接受更新，你仍然可以采用老的方式来禁用OTA管理器：

1. 从Google Play商店或[XDA实验室](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/xda-labs/)下载Solid Explorer，[MiXplorer](https://link.zhihu.com/?target=https%3A//forum.xda-developers.com/showthread.php%3Ft%3D1523691)，FX文件资源管理器或任何其他支持root的文件浏览器。
2. 打开应用程序，接受条款和条件，授予权限并授予其root权限。
3. 转到存储的根目录，然后转到/ system / app / HwOUC。
4. 将HwOUC.apk重命名为HwOUC.bak。
5. 重启，你应该是好好的（译者注：坏了别怪我）

如果您正在运行[自定义ROM，](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/android-pie-android-9-port-custom-roms/)这要归功于[Project Treble支持](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/android-pie-gsi-project-treble/)，那么您应该对此安全，因为此功能只会影响华为自己的[EMUI](https://link.zhihu.com/?target=https%3A//www.xda-developers.com/tag/emui/)软件。

如果您已经更新了“Patch01”更新，我们强烈反对这样做：我们强烈反对这样做：某些更新可能有不同的Xloader（第三方bootloader）（例如华为Mate 10上的一些更新），并且您冒着风险**如果您使用不兼容的XLoader**，您的设备可能永久变砖。此外，上文中还找到了Magisk的解决方法。降级不适合胆小的人，所以如果您真的想要这样做并承认风险，我们建议您在我们的论坛中搜索您的设备的降级方法。

## 最后

即使我们不同意这些策略，阻止引导加载程序解锁并具有针对root访问权限的策略也是我们可以忍受的。但是，积极阻止那些已经解锁了他们的引导加载程序的root用户，并故意用更新来修补他们的手机？这是没有充分理由的，至少在我们看来，这是不必要的延伸，特别是考虑到使用root的用户在华为庞大的全球用户群的数量可以忽略不计。我们确实理解为什么用户会认为华为正在阻止root，但我们真的认为不是这样的。

root设备不应被视为类似于盗版，黑客攻击或任何网络犯罪。被root的Android智能手机与具有管理员权限的Windows计算机......或具有超级用户访问权限的Linux PC相当。那些选择root设备的人完全了解root以后所涉及的安全风险，并且正在寻找在他们花费大量资金拥有的设备上获得额外功能的方法。

虽然我们认为这不是故意的改变，但我们确实与华为进行了澄清，如果我们收到回复，我们会相应地更新这篇文章。如果您真的对root/使用ROM感兴趣，那么购买华为/ Honor设备仍然不是最明智的选择：正如我们之前提到的，他们仍然没有提供引导加载程序解锁代码。但与此同时，如果您已经更新，只需按照上面的步骤重新获得root。
