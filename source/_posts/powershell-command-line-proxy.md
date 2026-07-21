---
title: "PowerShell 配置命令行代理"
date: 2026-02-19
categories:
  - "网络与代理"
tags:
  - "powershell"
  - "proxy"
  - "command-line"
  - "代理"
---
我们将通过创建 PowerShell 函数来实现快速开启和关闭代理的功能。
### **步骤 1：找到并编辑 PowerShell [配置文件](https://zhida.zhihu.com/search?content_id=252477125&content_type=Article&match_order=1&q=%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6&zhida_source=entity)**

首先，我们需要找到 PowerShell 的配置文件。如果你还没有创建过，可以用以下命令创建：

```powershell
if (!(Test-Path -Path $PROFILE)) {
    New-Item -ItemType File -Path $PROFILE -Force
}
notepad $PROFILE
```

这会打开你的 PowerShell 配置文件。配置文件的默认路径通常是： `C:\Users\你的用户名\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`
### **步骤 2：添加代理函数**

在打开的配置文件中，添加以下函数：

```powershell
function proxy {
    $env:http_proxy = "http://127.0.0.1:7890"
    $env:https_proxy = "http://127.0.0.1:7890"
    [System.Net.WebRequest]::DefaultWebProxy = New-Object System.Net.WebProxy("http://127.0.0.1:10809")
    Write-Host "Proxy enabled: http://127.0.0.1:10809" -ForegroundColor Green
}

function unproxy {
    $env:http_proxy = $null
    $env:https_proxy = $null
    [System.Net.WebRequest]::DefaultWebProxy = $null
    Write-Host "Proxy disabled" -ForegroundColor Yellow
}

function check-proxy {
    if ($env:http_proxy -or $env:https_proxy) {
        Write-Host "Current proxy settings:" -ForegroundColor Cyan
        Write-Host "HTTP Proxy: $env:http_proxy"
        Write-Host "HTTPS Proxy: $env:https_proxy"
    } else {
        Write-Host "No proxy is currently set." -ForegroundColor Cyan
    }
}
```
### **步骤 3：保存并重新加载配置**

保存文件，然后重新启动 PowerShell 或运行 `. $PROFILE` 来重新加载配置文件。
## **如何使用**

现在，你可以在 PowerShell 中使用以下命令：

- 输入 `proxy` 来启用代理
- 输入 `unproxy` 来禁用代理
- 输入 `check-proxy` 来查看当前的[代理设置](https://zhida.zhihu.com/search?content_id=252477125&content_type=Article&match_order=1&q=%E4%BB%A3%E7%90%86%E8%AE%BE%E7%BD%AE&zhida_source=entity)
## **注意事项**

1. 这个设置只影响当前的 PowerShell 会话，不会影响其他应用程序或系统级的代理设置。
2. 如果你的代理地址和端口不是 `127.0.0.1:7890`，请相应地修改函数中的 URL。
3. 如果你的代理需要认证，你需要修改函数来包含用户名和密码。

## bash/zsh:

```
proxy
  proxy () {
  export http_proxy="http://127.0.0.1:7890"
  export https_proxy=$http_proxy
  export socks5_proxy="socks5://127.0.0.1:7890"
  echo "HTTP Proxy on"
}

noproxy
  noproxy () {
  unset http_proxy
  unset https_proxy
  echo "HTTP Proxy off"
}
```
