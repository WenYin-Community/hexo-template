---
title: "免费申请120天的IBM PowerPC s390x大型机VPS试用"
date: 2018-03-02
categories:
  - "云服务"
tags: 
  - "ibm"
  - "linux"
  - "vps"
  - "大型机"
coverImage: "TIM图片20180302181355.png"
---

IBM的LinuxONE是在S390大型机上运行Linux。与之配套的有一个社区云项目：[IBM LinuxONE Community Cloud](https://developer.ibm.com/linuxone/) ——用户可以免费在community cloud上测试自己的应用。每个用户可以创建一个最高2核4G内存的虚拟机，使用期限是120天！

注册过程比较简单，信息尽量填写完整。邮箱没有要求，不过尽量用国外邮箱。注册成功后，邮箱里面会收到一封邮件，根据的邮件里的说明就可以激活并登陆到管理控制台了。

配置：LinuxONE-Medium CPU: 2 core(s) Memory: 4096MB Disk: 40GB

1.  首先，进入注册页面进行注册：[https://linuxone20.cloud.marist.edu/cloud/#/register](https://linuxone20.cloud.marist.edu/cloud/#/register) （请填写正确的信息，最后一步国内手机号也可以）![](images/TIM图片20180228123806-300x145.png) ![](images/TIM图片20180301204639-300x146.png)
2. 注册后查看邮箱，会收到类似内容的邮件，里面标明了你可以使用到什么时候。点击其中给出的信息登录到控制面板。
3. ![](images/TIM图片20180302180714-300x213.png)
4. 进入后台选择create开始创建，选择如下内容即可，操作系统有红帽Linux企业7和SUSE企业版11，12三种，看个人需求，本人比较习惯红帽Linux企业7.
5. ![](images/TIM图片20180302180845-300x115.png) ![](images/TIM图片20180302180949-300x184.png)
6. 最重要的一步，是创建登录的ssh密钥，点击此处的create创建一个ssh key密钥对，输入任意一个名称并保存，浏览器会自动下载一个pem文件，请保存好，这是登录服务器的唯一凭据。![](images/TIM图片20180302181101-300x109.png)

所有步骤创建完成后，部署服务器需要五六分钟，回到控制台主页，等右侧出现IP时即可登录

![](images/TIM图片20180302181148-300x63.png)

现在使用Windows下的MobaXterm软件进行登录，按提示填入ip地址，用户名（注意是linux1而不是root）认证类型选择ssh私钥，选择当时保存的pem文件即可，最后保存并登录，稍候即可出现Linux shell界面，这里的root权限使用sudo，查看一下是不是正牌的IBM s390x大型机。

![](images/TIM图片20180302181250-300x255.png) ![](images/TIM图片20180302181355-300x143.png)
