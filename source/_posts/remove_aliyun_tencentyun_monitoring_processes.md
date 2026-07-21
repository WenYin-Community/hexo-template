---
title: "卸载阿里/腾讯云Linux主机监控进程，屏蔽云盾功能"
date: 2018-12-19
categories:
  - "云服务"
tags:
  - "agent"
  - "aliyun"
  - "vps"
  - "linux"
  - "腾讯云"
coverImage: "TIM图片20181219140139.png"
---

## 卸载阿里云盾监控

```bash
wget http://update.aegis.aliyun.com/download/uninstall.sh
chmod +x uninstall.sh
sudo ./uninstall.sh
```

```bash
wget http://update.aegis.aliyun.com/download/quartz_uninstall.sh
chmod +x quartz_uninstall.sh
sudo ./quartz_uninstall.sh
```

### 删除残留

```bash
sudo pkill aliyun-service
sudo rm -fr /etc/init.d/agentwatch /usr/sbin/aliyun-service
sudo rm -rf /usr/local/aegis*
```

### 屏蔽云盾 IP

用包过滤屏蔽如下 IP：

```bash
iptables -I INPUT -s 140.205.201.0/28 -j DROP
iptables -I INPUT -s 140.205.201.16/29 -j DROP
iptables -I INPUT -s 140.205.201.32/28 -j DROP
iptables -I INPUT -s 140.205.225.192/29 -j DROP
iptables -I INPUT -s 140.205.225.200/30 -j DROP
iptables -I INPUT -s 140.205.225.184/29 -j DROP
iptables -I INPUT -s 140.205.225.183/32 -j DROP
iptables -I INPUT -s 140.205.225.206/32 -j DROP
iptables -I INPUT -s 140.205.225.205/32 -j DROP
```

### 卸载云监控 Java 版本插件

```bash
sudo /usr/local/cloudmonitor/wrapper/bin/cloudmonitor.sh stop
sudo /usr/local/cloudmonitor/wrapper/bin/cloudmonitor.sh remove
sudo rm -rf /usr/local/cloudmonitor
```

### 阿里云监控插件卸载 Go 语言版本

烦人的插件，占内存。

```bash
/usr/local/cloudmonitor/CmsGoAgent.linux-amd64 stop
/usr/local/cloudmonitor/CmsGoAgent.linux-amd64 uninstall
rm -rf /usr/local/cloudmonitor
```

### 卸载云助手守护进程（Linux 实例）

云助手守护进程用于监控云助手客户端的资源消耗情况，上报云助手客户端的运行状态，以及当云助手客户端崩溃时重启客户端。您在卸载云助手客户端前，需要先卸载云助手守护进程。

> **说明** 目前云助手守护进程仅支持 Linux 操作系统。

1. 远程连接 Linux 实例。

2. 停止云助手守护进程：

```bash
/usr/local/share/assist-daemon/assist_daemon --stop
```

> **说明** `/usr/local/share/assist-daemon/assist_daemon` 为云助手守护进程的默认路径。

3. 卸载云助手守护进程：

```bash
/usr/local/share/assist-daemon/assist_daemon --delete
```

4. 删除云助手守护进程目录：

```bash
rm -rf /usr/local/share/assist-daemon
```

### 卸载云助手客户端（Linux 实例）

1. 远程连接 Linux 实例。

2. 卸载云助手守护进程。

3. 停止云助手客户端。

4. 运行以下命令卸载云助手客户端：

- rpm 包管理：

```bash
sudo rpm -qa | grep aliyun_assist | xargs sudo rpm -e
```

- deb 包管理：

```bash
sudo dpkg -l | grep aliyun_assist
sudo dpkg -r 云助手deb包名称
```

- 删除云助手客户端目录：

```bash
rm -rf /usr/local/share/aliyun-assist
```

---

## 卸载腾讯云盾监控

```bash
sudo systemctl stop tat_agent
sudo systemctl disable tat_agent
sudo /usr/local/qcloud/YunJing/uninst.sh
sudo /usr/local/qcloud/stargate/admin/uninstall.sh
sudo /usr/local/qcloud/monitor/barad/admin/uninstall.sh
```

### 删除残留

```bash
sudo rm -f /etc/systemd/system/tat_agent.service
sudo rm -rf /usr/local/qcloud
sudo rm -rf /usr/local/sa
sudo rm -rf /usr/local/agenttools
sudo rm -rf /tmp/tat_agent
```

编辑 `/etc/rc.d/rc.local` 去掉下面几行，然后 reboot 重启：

```bash
/usr/local/sa/agent/secu-tcs-agent-mon-safe.sh > /dev/null 2>&1
/usr/local/qcloud/irq/net_smp_affinity.sh >/tmp/net_affinity.log 2>&1
/usr/local/qcloud/cpuidle/cpuidle_support.sh &> /tmp/cpuidle_support.log
/usr/local/qcloud/rps/set_rps.sh >/tmp/setRps.log 2>&1
/usr/local/qcloud/irq/virtio_blk_smp_affinity.sh > /tmp/virtio_blk_affinity.log 2>&1
/usr/local/qcloud/gpu/nv_gpu_conf.sh >/tmp/nv_gpu_conf.log 2>&1
```

## 参考资料

- [卸载阿里云盾（安骑士）监控&屏蔽云盾IP](https://github.com/ssrpanel/SSRPanel/wiki/%E5%8D%B8%E8%BD%BD%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%BE%EF%BC%88%E5%AE%89%E9%AA%91%E5%A3%AB%EF%BC%89%E7%9B%91%E6%8E%A7&%E5%B1%8F%E8%94%BD%E4%BA%91%E7%9B%BEIP)
- [卸载 Agent](https://www.alibabacloud.com/help/zh/doc-detail/31777.htm)
- [云监控 Java 版本插件安装](https://help.aliyun.com/knowledge_detail/38859.html)
- [如何优雅地完整的一键卸载腾讯云监控](https://www.xjh.me/3687.html/amp)
