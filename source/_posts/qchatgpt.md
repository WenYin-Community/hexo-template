---
title: "QChatGPT"
date: 2023-02-18
categories:
  - "AI"
tags:
  - "qchatgpt"
  - "openai"
  - "docker"
  - "github"
  - "linux"
---

## 部署

**部署过程中遇到任何问题，请先在 [QChatGPT](https://github.com/RockChinQ/QChatGPT/issues) 或 [qcg-installer](https://github.com/RockChinQ/qcg-installer/issues) 的 issue 里进行搜索**

### 注册 OpenAI 账号

**可以直接进群找群主购买** 或参考以下文章自行注册：

- [只需 1 元搞定 ChatGPT 注册](https://zhuanlan.zhihu.com/p/589470082)（已失效）
- [手把手教你如何注册 ChatGPT，超级详细](https://guxiaobei.com/51461)

注册成功后请前往[个人中心查看](https://beta.openai.com/account/api-keys) api_key 完成注册后，使用以下自动化或手动部署步骤。

### 自动化部署

展开查看，以下方式二选一，Linux 首选 Docker，Windows 首选安装器。

#### Docker 方式

请查看此仓库 [mikumifa/QChatGPT-Docker-Installer](https://github.com/mikumifa/QChatGPT-Docker-Installer)

#### 安装器方式

使用[此安装器](https://github.com/RockChinQ/qcg-installer)（若无法访问请到 [Gitee](https://gitee.com/RockChin/qcg-installer)）进行部署。

- 安装器目前仅支持部分平台，请到仓库文档查看，其他平台请手动部署。

### 手动部署

手动部署适用于所有平台：

- 请使用 Python 3.9.x 以上版本
- 请注意 OpenAI 账号额度消耗
  - 每个账户仅有 18 美元免费额度，如未绑定银行卡，则会在超出时报错
  - OpenAI 收费标准：默认使用的 `text-davinci-003` 模型 0.02 美元/千字

#### 配置 Mirai

按照[此教程](https://yiri-mirai.wybxc.cc/tutorials/01/configuration)配置 Mirai 及 YiriMirai。启动 mirai-console 后，使用 `login` 命令登录 QQ 账号，保持 mirai-console 运行状态。

#### 配置主程序

1. 克隆此项目：

```bash
git clone https://github.com/RockChinQ/QChatGPT
cd QChatGPT
```

2. 安装依赖：

```bash
pip3 install yiri-mirai openai colorlog func_timeout
pip3 install dulwich
```

3. 运行一次主程序，生成配置文件：

```bash
python3 main.py
```

4. 编辑配置文件 `config.py`

按照文件内注释填写配置信息。

5. 运行主程序：

```bash
python3 main.py
```

无报错信息即为运行成功。

**常见问题**

- mirai 登录提示 `QQ 版本过低`，见[此 issue](https://github.com/RockChinQ/QChatGPT/issues/38)
- 如提示安装 `uvicorn` 或 `hypercorn` 请**不要**安装，这两个不是必需的，目前存在未知原因 bug
- 如报错 `TypeError: As of 3.10, the *loop* parameter was removed from Lock()`，请参考[此处](https://github.com/RockChinQ/QChatGPT/issues/5)

## 使用

查看 [Wiki 功能使用页](https://github.com/RockChinQ/QChatGPT/wiki/%E5%8A%9E%E8%83%BD%E4%BD%BF%E7%94%A8#%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F)

### 在 mirai 上登录 QQ

```
login <机器人QQ号> <机器人QQ密码>
```

> 具体见[此教程](https://yiri-mirai.wybxc.cc/tutorials/01/configuration#4-%E7%99%BB%E5%BD%95-qq)

### 配置自动登录

当机器人账号登录成功以后，执行：

```
autologin add <机器人QQ号> <机器人密码>
autologin setConfig <机器人QQ号> protocol IPAD
```

> 出现 `mirai 登录时提示版本过低` 报错时候删除 `mirai/bots` 文件夹里面的数据，见[此 issue](https://github.com/RockChinQ/QChatGPT/issues/38)

完成后，`Ctrl + C` 退出。

### 编写配置文件

- 在 `bot` 目录下创建 `config.py`，将 `config-template.py` 的内容复制进去，编辑 `config.py` 修改**必需项**。

- 在 `mirai/config/net.mamoe.mirai-api-http` 文件夹中找到 `setting.yml`，这是 `mirai-api-http` 的配置文件。

- 将这个文件的内容修改为：

```yaml
adapters:
  - ws
debug: true
enableVerify: true
verifyKey: yirimirai
singleMode: false
cacheSize: 4096
adapterSettings:
  ws:
    host: localhost
    port: 8080
    reservedSyncId: -1
```

`verifyKey` 要求与 `bot` 的 `config.py` 中的 `verifyKey` 相同。

## 插件生态

现已支持自行开发插件对功能进行扩展或自定义程序行为，详见 [Wiki 插件使用页](https://github.com/RockChinQ/QChatGPT/wiki/%E6%8F%92%E4%BB%B6%E4%BD%BF%E7%94%A8)，开发教程见 [Wiki 插件开发页](https://github.com/RockChinQ/QChatGPT/wiki/%E6%8F%92%E4%BB%B6%E5%BC%80%E5%8F%91)

### 示例插件

在 `tests/plugin_examples` 目录下，将其整个目录复制到 `plugins` 目录下即可使用：

- `cmdcn` - 主程序指令中文形式
- `hello_plugin` - 在收到消息 `hello` 时回复相应消息
- `urlikethisijustsix` - 收到冒犯性消息时回复相应消息

### 更多

欢迎提交新的插件：

- [revLibs](https://github.com/RockChinQ/revLibs) - 将 ChatGPT 网页版接入此项目
- [hello_plugin](https://github.com/RockChinQ/hello_plugin) - `hello_plugin` 的储存库形式，插件开发模板
- [dominoar/QchatPlugins](https://github.com/dominoar/QchatPlugins) - dominoar 编写的诸多新功能插件（语言输出、Ranimg、屏蔽词规则等）
- [dominoar/QCP-NovelAi](https://github.com/dominoar/QCP-NovelAi) - NovelAI 故事叙述与绘画

## About

在 QQ 上与 ChatGPT 等语言模型进行对话，OpenAI + Mirai 实现，支持插件、多 APIKEY 管理，多平台一键部署。

---

# Installer for QChatGPT

为 [QChatGPT 项目](https://github.com/RockChinQ/QChatGPT) 使用 Go 语言编写的一键部署脚本，自动化部署所需依赖。

- 注意：下载的 Python 和 mirai 均为免安装版，不影响系统其他环境。

## 使用方法

**部署过程中遇到任何问题，请先在 [QChatGPT](https://github.com/RockChinQ/QChatGPT/issues) 或 [qcg-installer](https://github.com/RockChinQ/qcg-installer/issues) 的 issue 里进行搜索，若找不到请前往：交流、答疑群: `204785790`**

### 1. 注册 OpenAI 账号

参考以下文章：

- [只需 1 元搞定 ChatGPT 注册](https://zhuanlan.zhihu.com/p/589470082)
- [手把手教你如何注册 ChatGPT，超级详细](https://guxiaobei.com/51461)

注册成功后请前往[个人中心](https://beta.openai.com/account/api-keys)查看 `api_key`

### 2. 安装器

- 从 [Release 页面](https://github.com/RockChinQ/qcg-installer/releases/latest)下载可执行文件，若无法访问请到 [Gitee](https://gitee.com/RockChin/qcg-installer/releases/latest)
- 保存到电脑上某个空目录，直接运行，等待配置环境
- 完毕后根据提示输入 `api-key` 和 `QQ号`
- 到此安装完成

**常见问题**

**网络状况不好，下载失败？**

解决方法：

- 若您有网络代理可用于提速，可在启动安装器时提供参数 `-p <代理地址>`，如：

```bash
qcg-installer-0.1-windows-x64.exe -p http://localhost:7890
```

- 也可以提前下载所需文件，安装器运行中将不再进行下载，此功能适用于安装器版本 `0.7` 以上。
  - Windows 系统，下载以下文件并放置在安装器同目录，**请勿**重命名：
    - [python-3.10.9-embed-amd64.zip](https://www.python.org/ftp/python/3.10.9/python-3.10.9-embed-amd64.zip)
    - [get-pip.py](https://bootstrap.pypa.io/get-pip.py)
    - [mcl-installer-a02f711-windows-amd64.exe](https://github.com/iTXTech/mcl-installer/releases/download/a02f711/mcl-installer-a02f711-windows-amd64.exe)
  - Linux 系统，下载以下文件并放置在安装器同目录，**请勿**重命名：
    - [Python-3.10.9.tgz](https://www.python.org/ftp/python/3.10.9/Python-3.10.9.tgz)
    - [get-pip.py](https://bootstrap.pypa.io/get-pip.py)
    - [mcl-installer-a02f711-linux-amd64-musl](https://github.com/iTXTech/mcl-installer/releases/download/a02f711/mcl-installer-a02f711-linux-amd64-musl)

### 3. 运行程序

之后每次重启之后均需要按照以下步骤启动程序。

#### 启动 mirai

- 运行 `run-mirai.bat` (Windows) 或 `./run-mirai.sh` (Linux) 启动 mirai
- 并输入 `login <QQ号> <QQ密码>` 根据提示登录账号

#### 运行主程序

- 登录完成后运行 `run-bot.bat` (Windows) 或 `./run-bot.sh` (Linux) 启动主程序。

**常见问题**

- mirai 登录提示 `QQ 版本过低`，见[此 issue](https://github.com/RockChinQ/QChatGPT/issues/38)
- 运行 `run-bot.bat` 闪退请见[此解决方案](https://github.com/RockChinQ/qcg-installer/issues/2)
- 若启动后提示安装 `uvicorn` 或 `hypercorn`，请**不要**安装，会导致不明原因 bug

## 目前支持的平台和架构

- Windows x64
- CentOS x64（以及其他使用 `yum` 作为包管理器的操作系统）
- Ubuntu x64（以及其他使用 `apt` 作为包管理器的操作系统）
- Raspbian arm64
