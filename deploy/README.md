# CloudBase 自动部署说明

当前站点已部署到 CloudBase 独立静态应用：

- 应用名：`wenyinos-wiki`
- 测试地址：<https://wenyinos-wiki-dev-1-d7gu39iuzd13eabe2.webapps.tcloudbase.com>
- 环境：`dev-1-d7gu39iuzd13eabe2`（上海，体验版）

> 注意：CloudBase 体验版的默认测试域名会显示腾讯云风险提示，并可能有访问量限制；
> 当前该域名的响应头还带有 `Content-Disposition: attachment`，浏览器可能直接下载 HTML。
> 正式对外使用前必须绑定自定义域名（并完成证书/DNS），不能把默认测试域名当作生产地址。

## 方案一：源码仓库 push 自动构建部署（推荐）

文件：`.github/workflows/deploy-cloudbase.yml`

触发方式：推送到源码仓库 `main`，GitHub Actions 自动执行：

1. `npm ci`
2. `npm run build` 生成 `public/`
3. 用 CloudBase CLI 把 `public/` 部署到 `wenyinos-wiki`

这是 GitHub 原生 webhook，不需要额外服务器或 webhook 接收端。

### 必需的 Repository Secrets

在 GitHub 仓库的 **Settings → Secrets and variables → Actions** 添加：

| Secret | 说明 |
|---|---|
| `TCB_ENV_ID` | `dev-1-d7gu39iuzd13eabe2` |
| `TCB_API_KEY` | CloudBase 环境 API Key（推荐，权限可限定到该环境） |
| `TCB_SECRET_ID` / `TCB_SECRET_KEY` | 可选，腾讯云 API 密钥；没有 API Key 时使用 |

`TCB_API_KEY` 与 `TCB_SECRET_ID/TCB_SECRET_KEY` 二选一即可。API Key 更安全，优先使用。

## 方案二：直接镜像 GitHub Pages 产物（可选）

文件：`deploy/github-pages-mirror.yml`

如果站点以 `wenyinos/wenyinos.github.io` 仓库的构建产物为准，把该文件复制到 Pages 仓库的 `.github/workflows/` 下。它不构建 Hexo，只把 Pages 仓库内容同步到 CloudBase。

**方案一和方案二不要同时启用**，否则两个工作流会互相覆盖。

## 自定义域名

目前 `wiki.wenyinos.com` 解析到现有服务器，Nginx 正常提供同一份站点。若要把该域名切到 CloudBase：

1. 在 CloudBase 控制台为应用绑定自定义域名并申请/上传证书；
2. 把该域名的 DNS 从当前 `43.154.58.54` 改为 CloudBase 提供的 CNAME；
3. 确认 HTTPS 生效后再停止旧站。

域名切换前，现有 Nginx 站点继续作为主站，CloudBase 默认测试域名只用于验证文件是否上传成功。
