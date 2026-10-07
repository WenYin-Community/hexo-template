---
title: "对接多家大模型 API 的踩坑与治理经验"
date: 2026-08-08
categories:
  - "AI"
tags:
  - "llm"
  - "api"
  - "nodejs"
  - "websocket"
  - "sqlite"
  - "integration"
---

本文汇总 AI 应用集成类项目（图像/视频生成服务、Web 聊天应用、模型代理插件）对接多家大模型 API 时积累的踩坑记录，覆盖**配置加载、多厂商 API 差异、并发语义、数据落库与安全**五个方向。

<!-- more -->

## 一、配置与环境变量：加载时序是第一坑

**ESM 的 import 提升导致 dotenv 未生效**：模块顶层固化的 `getConfig()` 在 `dotenv.config()` 之前执行，读到 `undefined` 走了兜底分支；而请求内的惰性 `getConfig()` 返回正确值——表现为"接口行为对、启动横幅错"的矛盾现象。

**原则**：读环境变量的初始化必须放进 `dotenv.config()` 之后调用的函数里（lazy `process.env`），不要在模块顶层固化配置对象。

其他配置陷阱：

- `.env` 解析纪律：值不加引号、不写行内注释（dotenv 会截断）；BOM 会让首行失效；`export KEY=` 写法解析失败；
- **优先级**：前端 localStorage 的 key 高于服务端 `.env`；systemd/Docker/PM2 注入的同名环境变量**不会**被 dotenv 覆盖——"`.env` 看似失效"往往是被上层注入覆盖了；
- **key 保存用 `change` 事件需失焦才触发** → 改 `input` 实时保存。

## 二、多厂商 API 差异：必须做多路径兜底

同一厂商不同模型版本、不同中转站的行为差异远比文档复杂：

- **视频任务"完成但无 URL"**：旧代码只认 `result.video_url`，实际值在 `metadata.url` → 多路径兜底：`metadata.url → metadata.video_url → video_url → url → data[].url`，并打印响应前 500 字符便于排查；
- **查询端点变更**：`GET /v1/videos/{taskId}` 对新模型无效，需改用带 `model_name` 的专用端点 → 任务 ID 必须持久化进表（加列 + 旧库幂等迁移）；
- **请求体不通用**：V2.0 用 `height/width/num_frames/frame_rate`，2.5 用 `mode/seconds/size/aspect_ratio`，传旧字段被 400 拒绝；时长由帧数决定时须满足 `8n+1` 且不超过上限（121≈5s、241≈10s、361≈15s）；
- **错误信息要区分归属**：`model not allowed for this api key` 是入口校验（模型不存在）；`upstream request failed` 是出口转发失败（中转站文案）——两者排查方向完全不同；
- **模型识别三级优先级**：环境变量覆盖 > 上游元数据（`input_modalities`）> 内置兜底；模型目录动态拉取要落盘缓存（同步 hook 里必须先读缓存）；
- **判定真实模型不能看客户端配置**：经本地代理时，settings 里的模型名与真实模型不一致，要读会话记录里的 model 字段。

## 三、并发与流式：语义比连通性重要

- **同一 session 的并发语义**：实测网关对同一 `session_id` 的并发请求只处理最后一条，且回复广播给该 session 的所有连接——测试只数"3/3 收到"不比对内容会误判通过；
- **并发槽位泄漏**：`AbortSignal.any()` 写在 `try/finally` 之外，`acquire()` 成功、进 try 之前同步抛错会越过 finally，槽位不释放（后续请求挂死）。修复：构造移进 try 内 + 手写信号合并函数；教训是**负向路径也要验证**；
- **空闲超时被误判为客户端断连**：管道传了含预算的合并信号，上游静默 120s 被掐断 → 应传"客户端真的断开"的信号；
- **keep-alive 静默断**：上游服务静默断开的长连接需要在 dispatcher 层关闭（Node fetch 按规范丢弃 `Connection` 头，照抄无效）；
- **重试机制要防重复显示**：网关空响应重试会导致一条回复分段多次出现；
- **去重修复引入的回归**：2.5 秒静默阈值先 flush 前半段，完整版到达时因前缀相同被判为副本丢弃 → 正确语义是"同源更长版本原地替换"，等长或更短才丢弃。

## 四、数据落库：SQLite 与消息存储

- **SQLite 非原子写盘**：直接写库文件有损坏风险 → 先写 `chat.db.tmp` 再 `renameSync` 原子替换；
- **`saveChatMessage` 不检查 `response.ok`**：落库失败静默，刷新即丢——写操作必须校验响应；
- **WAL 与 `-shm` 文件**：只读打开 WAL 库需要 `-shm` 存在，某些平台进程一关即删 → 读副本更稳；`DELETE` 不缩文件，需 `wal_checkpoint(TRUNCATE)` + `VACUUM`；
- **记忆隔离的实测结论**：网关的记忆按渠道隔离（`dm_scope: "per-channel"`），所有 Web 连接属同一渠道 → "新会话记得旧内容"在应用侧无法根治（`session` 隔离对记忆无效，已实测推翻原假设）；
- **命令面板与全角输入**：中文输入法下的全角斜杠「／」(U+FF0F) 不会触发命令面板，需归一化。

## 五、Web 安全加固清单

- **反代后限流按代理 IP 计数**：未设 `TRUST_PROXY=1` 时所有用户共享一个限流桶；反过来 XFF 可伪造也能绕过限流——两侧都要处理；
- **CSP 去 `unsafe-inline`**：改 per-request nonce；
- **上传接口加限额**：multer 补 `limits.files` 防内存放大 DoS；
- **`decodeURIComponent` 需 try/catch**：畸形 Cookie 曾直接 500；
- **轮询解析用 `safeJson`**：一次裸 `res.json()` 解析错误会终止整个任务链；
- **删除类端点要防误伤**：不带实体 ID 的批量删除端点会清空所有会话（危险端点应直接删除或强制必填过滤条件）；
- **图片落库别用占位符**：19 字节占位符会让 grep 审计出现假阴性，二进制数据要二进制安全搜索。

## 六、自研 Markdown 渲染的三个坑（零依赖实现）

- `target="_blank"` 的 `_blank` 被斜体规则吃掉（`_` 解析优先级）；
- 全局 `input { width: 100% }` 会把任务列表的复选框撑满整行；
- `- 项` 紧跟 `1. 项` 时不能合并进同一个 `<ul>`。

## 总结

对接第三方 AI 服务的核心经验：**把"文档契约"当作假设而非事实**——多路径兜底、打印原始响应片段、把模型能力探测做成独立层。同时应用侧自身的并发语义（session、槽位、重试去重）需要显式设计与实测，因为"连通"和"正确"完全是两回事。
