---
title: "Enable Hyper-V in VMWare Desktop"
date: 2023-02-04
categories:
  - "虚拟化"
tags:
  - "hyper-v"
  - "vmware"
  - "windows"
---

1. Open VMware Workstation and create a new VM by using the Windows Server 2012 template. We will need to make two tweaks to the VM configuration in order to (fully) support Hyper-V Server:

2. In the **Virtual Machine Settings** dialog box, enable the **Virtualization engine** options as shown in the following figure.

3. Add the following three new entries to the **.VMX** configuration file to match the following screenshot. VMware configuration files can be opened with any text editor:

```ini
hypervisor.cpuid.v0 = "FALSE"
mce.enable = "TRUE"
vhv.enable = "TRUE"
```
