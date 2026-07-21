---
title: "Intel 12、13代CPU在Win10、Win11系统大核调度方法"
date: 2023-05-06
categories:
  - "Windows"
tags:
  - "windows10"
  - "windows"
  - "intel"
  - "cpu"
---

Intel 12、13代CPU部分U是大小核设计，操作系统Win11在调度使用核心时有一套基本规则，游戏等较重的任务交给大核的几率较高，偏重于后台或者较少人工干预的任务，交给小核或者说效能核的几率比较高，实际运行过程中，一般人更希望虚拟机或者编译等任务跑在大核上面.

Win0系统的实际调度表现更加一般。经过不断的探索，微软雪藏的调度策略被人发掘，就是电源方案里隐藏有一个异构CPU调度策略，

启用，并且设置优先调用大核心即性能核心、然后大核心超线程、最后小核心，Win11、Win10都可以使用，给大小核心使用者一个新的选择。至于选项显示、隐藏，电源方案复制、改名不作介绍。

### 节能模式

powercfg -s a1841308-3541-4fab-bc81-f71556f20b4a

::异构0 powercfg /SETACVALUEINDEX a1841308-3541-4fab-bc81-f71556f20b4a 54533251-82be-4824-96c1-47b60b740d00 7f2f5cfa-f10c-4823-b5e1-e93ae85f46b5 000

::大核、超线程优先 powercfg /SETACVALUEINDEX a1841308-3541-4fab-bc81-f71556f20b4a 54533251-82be-4824-96c1-47b60b740d00 93b8b6dc-0698-4d1c-9ee4-0644e900c85d 002 powercfg /SETACVALUEINDEX a1841308-3541-4fab-bc81-f71556f20b4a 54533251-82be-4824-96c1-47b60b740d00 bae08b81-2d5e-4688-ad6a-13243356654b 002

 

### 高性能模式

powercfg -s 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c

::异构0 powercfg /SETACVALUEINDEX 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 54533251-82be-4824-96c1-47b60b740d00 7f2f5cfa-f10c-4823-b5e1-e93ae85f46b5 000

::大核、超线程优先 powercfg /SETACVALUEINDEX 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 54533251-82be-4824-96c1-47b60b740d00 93b8b6dc-0698-4d1c-9ee4-0644e900c85d 002 powercfg /SETACVALUEINDEX 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 54533251-82be-4824-96c1-47b60b740d00 bae08b81-2d5e-4688-ad6a-13243356654b 002

### 平衡模式

powercfg -s 381b4222-f694-41f0-9685-ff5bb260df2e ::异构0 powercfg /SETACVALUEINDEX 381b4222-f694-41f0-9685-ff5bb260df2e 54533251-82be-4824-96c1-47b60b740d00 7f2f5cfa-f10c-4823-b5e1-e93ae85f46b5 000 ::大核、超线程优先 powercfg /SETACVALUEINDEX 381b4222-f694-41f0-9685-ff5bb260df2e 54533251-82be-4824-96c1-47b60b740d00 93b8b6dc-0698-4d1c-9ee4-0644e900c85d 002 powercfg /SETACVALUEINDEX 381b4222-f694-41f0-9685-ff5bb260df2e 54533251-82be-4824-96c1-47b60b740d00 bae08b81-2d5e-4688-ad6a-13243356654b 002
