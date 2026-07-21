---
title: "简易安装Arch Linux ARM for Raspberry Pi 3"
date: 2018-05-12
categories:
  - "硬件设备"
tags:
  - "linux"
  - "arch"
  - "树莓派"
  - "raspberry-pi"
---

把下列代码保存为：rpi3-arch-linux-to-sdcard.sh

```
#!/bin/bash

# <https://archlinuxarm.org/platforms/armv8/broadcom/raspberry-pi-3>

echo -e "\n\nArch Linux ARM to SD Card"
echo -e "For the Raspberry Pi 3, if you want to use the unofficial arm64 variant."
echo -e "(Otherwise use the Raspberry Pi 2 version of this script!)\n\n"

if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root" 1>&2
   exit 1
fi

echo -e "\nAll drives on this computer:\n"
ls -1 /dev/sd?

echo -e "\nLast messages in syslog:\n"
dmesg | tail

echo -e "\nChoose sd card (like /dev/sdX):\n"
read SDCARD

echo -e "\n\nCurrent partitioning of $SDCARD:\n"
parted $SDCARD print

echo -e "\n\nYou chose $SDCARD\nAre you sure to continue? Press Ctrl-C to abort!"
read

cd /tmp

echo -e "\nDownloading the Arch Linux ARM root filesystem (if needed):\n"
URL=https://mirrors.ustc.edu.cn/archlinuxarm/os/ArchLinuxARM-rpi-3-latest.tar.gz
# Sometimes the download server is slow. In that case, try a different one instead:
#URL=http://de7.mirror.archlinuxarm.org/os/ArchLinuxARM-rpi-3-latest.tar.gz
FNAME=$(basename "$URL")
FSIZE=$(curl --head --location --silent "$URL" --write-out '%{http_code} %{size_download} \n' | tac | grep -m1 Content-Length | cut -f 2 -d' ' | tr -d '\r')
if [ -n "$FNAME" ]
then
  CURSIZE=$(wc -c <"$FNAME")
  if [ $CURSIZE -ne $FSIZE ]; then
    rm "$FNAME"
    echo "Removing any downloaded and leftover Arch Linux ARM image"
  fi
fi
curl --location --remote-name --time-cond "$FNAME" "$URL"
if [ $? -ne 0 ]; then
  echo "Could not download the image file, please check the mirror"
  exit 1
fi

echo -e "\nUnmounting partitions found on ${SDCARD}\n"
for MOUNT in ${SDCARD}?
do
  echo $MOUNT
  umount $MOUNT
done

parted -s $SDCARD unit s print
parted -s $SDCARD mktable msdos
parted -s $SDCARD mkpart primary fat32 8192s 128MiB
parted -s $SDCARD mkpart primary 128MiB 100%
parted -s $SDCARD unit s print

mkfs.vfat ${SDCARD}1
mkfs.ext4 ${SDCARD}2

rm -rf boot
rm -rf root

mkdir boot
mkdir root

mount ${SDCARD}1 boot
mount ${SDCARD}2 root

echo -e "\nExtracting the root filesystem\n"
bsdtar -xpf ArchLinuxARM-rpi-3-latest.tar.gz -C root
sync

echo -e "\nMoving boot files to the first partition\n"
mv root/boot/* boot

echo -e "\nUnmounting the two partitions\n"
umount boot root

rmdir boot root

echo "Insert the SD card into the Raspberry Pi , connect ethernet, and apply 5V power."
echo "Use the serial console or SSH to the IP address given to the board by your router. The username/password combination is alarm/alarm. The default root password is 'root'."

cd -
```

如果网络较慢请先下载

```
http://archlinuxarm.org/os/ArchLinuxARM-rpi-3-latest.tar.gz
```

放置到/tmp下面，按提示运行即可。

来源：[https://gist.github.com/pklaus/0e90aaa2d91064edd731fa30f44fce3f](https://gist.github.com/pklaus/0e90aaa2d91064edd731fa30f44fce3f)
