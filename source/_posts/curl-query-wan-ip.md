---
title: "cURL 查询公网出口 IP"
date: 2024-05-19
categories:
  - "网络与代理"
tags: 
  - "curl"
  - "ip"
---

## 几个网址

- [ip-api.com](http://ip-api.com/json/)（推荐，速度快）
- [ipecho.net](https://ipecho.net/plain)（推荐）
- [百度](https://qifu-api.baidubce.com/ip/local/geo/v1/district)（效果也不错）
- [ip.cn](http://ip.cn/)（不支持 cURL）
- [ipinfo.io](http://ipinfo.io/)
- [cip.cc](http://cip.cc/)
- [ifconfig.me](http://ifconfig.me/)
- [myip.ipip.net](http://myip.ipip.net/)

## 样例

### ip-api.com

```bash
curl 'http://ip-api.com/json/?lang=zh-CN'
```

返回结果：

```json
{
  "status": "success",
  "country": "德国",
  "countryCode": "DE",
  "region": "HE",
  "regionName": "Hesse",
  "city": "法兰克福",
  "zip": "60313",
  "lat": 50.1188,
  "lon": 8.6843,
  "timezone": "Europe/Berlin",
  "isp": "Linode, LLC",
  "org": "Linode, LLC",
  "as": "AS63949 Linode, LLC",
  "query": "192.46.239.172"
}
```

---

### ipecho.net

```bash
curl ipecho.net/plain
```

返回结果：

```
168.63.213.70
```

---

### ipinfo.io

```bash
curl ipinfo.io
```

返回结果：

```json
{
  "ip": "111.30.233.219",
  "city": "Tianjin",
  "region": "Tianjin",
  "country": "CN",
  "loc": "39.1422,117.1767",
  "org": "AS38019 tianjin Mobile Communication Company Limited",
  "timezone": "Asia/Shanghai",
  "readme": "https://ipinfo.io/missingauth"
}
```

---

### cip.cc

```bash
curl cip.cc
```

返回结果：

```
IP  : 111.30.233.219
地址  : 中国  天津
运营商 : 移动

数据二 : 天津市 | 移动

数据三 : 中国天津天津 | 移动

URL : http://www.cip.cc/111.30.233.219
```

---

### myip.ipip.net

```bash
curl myip.ipip.net
```

返回结果：

```
当前 IP：111.30.233.219  来自于：中国 天津 天津  移动
```

---

### ifconfig.me

```bash
curl ifconfig.me
```

```
111.30.233.219
```

---

### members.3322.org/dyndns/getip

```bash
curl members.3322.org/dyndns/getip
```

```
111.30.233.219
```

---

作者：舌尖上的大胖
链接：https://www.jianshu.com/p/09363560a833
