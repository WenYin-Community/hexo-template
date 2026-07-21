---
title: "Install entware repository on Synology NAS"
date: 2019-05-20
categories:
  - "云服务"
tags: 
  - "entware"
  - "nas"
  - "synology"
---

## Introduction

[ARM & intel based devices](http://forum.synology.com/wiki/index.php/What_kind_of_CPU_does_my_NAS_have) are supported. DSM version must be 3.2 or higher. Use armv5 installer for Marvell Kirkwood mv6282 cpu, you can use armv7 installer for newer ARM cpu's. Although armv7 repo was compiled with cortex-a9 optimization it was successfully tested on Marvell Armada XP based NAS.

## Deploying Entware-ng

### 1. Create a folder on your hdd (outside rootfs)

```bash
mkdir -p /volume1/@entware-ng/opt
```

Make sure that `/opt` folder is empty (Optware is not installed), we will **remove** `/opt` folder with its contents at this step.

### 2. Remove `/opt` and create a symlink

```bash
rm -rf /opt
ln -sf /volume1/@entware-ng/opt /opt
```

### 3. Run install script

- for ARMv5

```bash
wget -O - http://pkg.entware.net/binaries/armv5/installer/entware_install.sh | /bin/sh
```

- for ARMv7

```bash
wget -O - http://pkg.entware.net/binaries/armv7/installer/entware_install.sh | /bin/sh
```

- for x86-32

```bash
wget -O - http://pkg.entware.net/binaries/x86-32/installer/entware_install.sh | /bin/sh
```

- for x86-64

```bash
wget -O - http://pkg.entware.net/binaries/x86-64/installer/entware_install.sh | /bin/sh
```

- for MIPS

```bash
wget -O - http://pkg.entware.net/binaries/mipsel/installer/installer.sh | /bin/sh
```

### 4. Edit `/etc/rc.local` file

Edit `/etc/rc.local` file with a text editor and insert following strings:

```bash
/bin/ln -sf /volume1/@entware-ng/opt /opt
/opt/etc/init.d/rc.unslung start
```

at the end of this file, but before `exit 0`. The last line ensures that Entware services will be started at boot.

> Note: As of DSM 6.0, `/etc/rc.local` is no longer executed as part of the boot process. Instead you have two options.

**Option 1**: Documented in the [Synology DSM6.0 3rd-Party Package Developer Guide](https://developer.synology.com/download/developer-guide.pdf), custom startup scripts should be placed in `/usr/local/etc/rc.d`.

Example: Create `/usr/local/etc/rc.d/entware-startup.sh`:

```bash
#!/bin/sh

case $1 in
    start)
    mkdir -p /opt
    mount -o bind /volume1/@entware-ng/opt /opt
    /opt/etc/init.d/rc.unslung start
    ;;
    stop)
    ;;
esac
```

**Option 2**: Make an executable script and use the Task Scheduler to create a triggered task that runs on boot. The script would contain:

```bash
#!/bin/sh

mkdir -p /opt
mount -o bind /volume1/@entware-ng/opt /opt
/opt/etc/init.d/rc.unslung start
```

### 5. Add the following line in the end of `/etc/profile` file

```bash
. /opt/etc/profile
```

It will add `/opt/bin` and `/opt/sbin` to the PATH variable for interactive login.

### 6. Reboot your NAS

After rebooting, you can use opkg commands.

---

via [Entware Wiki - Install on Synology NAS](https://github.com/Entware/Entware-ng/wiki/Install-on-Synology-NAS)
