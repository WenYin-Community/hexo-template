---
title: "给 AI agent 做长期记忆：从 MEMORY.md 到 SQLite"
author: "学姐大人"
date: 2026-10-25
updated: 2026-10-30
categories:
  - "开发工具"
tags:
  - "agent"
  - "memory"
  - "sqlite"
  - "llm"
  - "streaming"
  - "architecture"
  - "memory-search"
  - "database-repair"
  - "schema-v2"
  - "boundary"
---

给 AI agent 加"长期记忆"，第一版几乎都会这么做：在系统提示里约定一个 `MEMORY.md`，让模型"觉得重要就自己写进去"，下一轮再把它读回来。

能跑，但撑不过几周。这篇记录把它换成 SQLite 主库的过程，以及同一时期在流式管道、定时任务、客户端联网边界上踩到的坑。

<!-- more -->

## 一、旧机制为什么必然烂

迁移前先盘了一下旧数据，结论有点难看：

- `workspace2` 里 **2617 条**任务记录，其中 **1364 行（52%）落在重复组**里，76 个组覆盖了这些行；
- **999 条**记录是同一个模板——"判断是否值得长期记住"这个动作被当成了记忆内容本身；
- **899/90 条**记录共享同一段置顶背景前缀；
- 还有 **52 条** `hello`。

原因不复杂：**提示词约定 + 模型自由写文件**这套机制，没有去重键、没有时间语义、没有冲突处理、没有容量上限。模型每次"回忆"都可能再写一遍，写得越多噪声越大，最后真正要用的那几条被埋掉。

顺带暴露一个更基础的问题：所谓"保存记忆"其实是把 `workspace/sessions/*.jsonl` 逐条追加、每条 `fsync` 并原子重写 meta——**写盘开销随消息数线性增长**，而 `MEMORY.md` 只是模型主动写的一个普通文件。

## 二、表结构：条目要有「层」和「状态」

换成 SQLite 主库之后，`pkg/memstore` 拆成六个表：`entries`、`sources`、`supersedes`、`relationship_state`、`personas`、`meta`。

关键是给每条记忆加上三个维度：

- **`realm`**：`real` / `fictional` / `work` / `unknown` —— 区分"用户真实说过的事"和"角色扮演里虚构的设定"。不区分的话，一次剧本杀能把人设写歪。
- **`layer`**：`persona` / `profile` / `relationship` / `episodic` / `procedural` / `boundary` —— 人设、画像、关系状态、情节、流程、边界的注入优先级完全不同。
- **`status`**：`active` / `pending_review` / `superseded` / `archived` —— **不确定的先进待审核**，人工确认前不注入。

另外还有 `importance`、`emotional_weight`、`audience`（public / private）、`expires_at` 和版本链（`supersedes` 指向被取代的旧条目）。

这套设计的核心不是"存得多"，而是**"知道哪条不该用"**。`pending_review` 和 `superseded` 这两个状态，是后面能收敛的前提。

## 三、去重：四种手段叠着用

单一手段去不干净，实际是四层叠加：

1. **归一化 + SHA256 精确哈希** —— 处理"一个字不差"的重复；
2. **模板折叠** —— 把同一套句式（比如那个抽取模板）折成一条；
3. **中文 bigram Jaccard ≥ 0.75** —— 处理换词不改意的近似重复（中文没有空格，用 bigram 比按词切可靠）；
4. **SimHash Hamming ≤ 3** —— 处理长文本的小幅改动。

再加一条**语义冲突处理**：同一个 `subject + predicate` 出现新值时，旧条目置 `superseded` 而不是删掉——你要能回答"我当时为什么那么记"。

迁移后的效果：库收敛到 **515 条**，重复导入第二次 `0 added`，完全幂等（WAL checkpoint 为 0）。

## 四、注入：固定块 + 边界 + 检索

记忆有了，怎么塞进上下文是另一回事。全量注入会撑爆窗口，只按相似度检索又会丢人设。最后分成三块：

- **固定块**（≤500 tokens）：人设、关系状态、画像——每轮都带，不检索；
- **边界块**：不可越线的规则，独立拼接在固定块之后，不参与固定块预算；
- **检索块**（≤700 tokens）：按当前消息检索情节与流程类记忆。

三个细节值得单独说：

**按 `audience` 过滤。** 固定注入块最初忽略了 `audience=private`，私密记忆会被注入到工作渠道的对话里。修法是把过滤放到 `BuildMessagesFromPrompt`，按渠道过滤——这类"串台"不会报错，只会让不该看到的人看到。

**边界不能跟固定块一起被裁。** 0.4.5 及以前，boundary 也塞在固定块的 `parts` 里；`trimToBudget` 一旦超预算就 `break`，排在最后的 boundary 会被静默跳过。0.4.6 把 boundary 拆成独立的 `boundaryText`，在 `trimToBudget` 之后拼接；它仍然执行 audience、私有渠道和 fictional 过滤。回归测试覆盖两件事：大 profile 不会挤掉 boundary；private/fictional boundary 不会出现在错误渠道。

**注入预算是硬的。** 固定块和检索块各有预算，超了先砍检索结果；boundary 不参与这层裁剪，但也不代表可以无限长——它应该只放短规则，长文放检索层。

## 五、抽取要克制

0.4.0 上线后立刻出问题：**普通聊天被写进记忆库**。

比如一条消息里带"设定"两个字，就被抽成一条 `fictional/episodic` 的待审核记录。

根因是关键词表太宽：`设定`、`扮演`、`剧情`、`人设`、`世界观`、`虚构`、`故事线`——这些词在日常聊天里太常见；而且当时**同时扫描用户消息和助手回复**，每轮都跑一次。

0.4.1 的修法是把规则收紧到可枚举的程度：

- 删掉全部角色扮演类宽泛关键词；
- **只扫描用户消息**，不扫助手回复；
- 自动记忆只保留：显式"记住/记一下/别忘了"、用户与 AI 的称呼、偏好与过敏、生日/纪念日、带日期的事件。

实测：普通消息、含"设定"的消息、含"剧情"的消息，均为 **0 条新增、0 条待审核**；而显式"记住：E2E041 我的测试标记是蓝鲸"能正确写成一条 `active/real/profile`。

还有一处收尾：0.4.2 把 `MEMORY.md` **彻底下线**——删掉运行时回退，系统提示里那些"有事就更新 MEMORY.md"的规则一并删掉。否则会出现"SQLite 已经启用，但提示词还在让模型写一个没人读的文件"的鬼状态。

## 六、检索：非空不等于健康

0.4.5 之前，`memory` 工具的 search 走的是提示词检索的 `Search`，而不是管理搜索：

- 只查 `active + episodic/procedural`；
- 默认只查 `real/work`；
- `private` 记忆需要传入私有渠道；
- 工具层根本没有把 `realm/layer` 参数传下去。

当时库里有 306 条、296 active，但符合这套条件的只有 **3 条 `work/procedural`**。所以不管搜乱码、生日还是角色设定，都返回同 3 条。不是缓存，也不是 fallback，而是**搜索范围本身只有这 3 条**。

修复拆成两条路径：

- **管理搜索 `SearchEntries`**：默认查全部 layer，支持 realm/layer/status 过滤，不自动过滤 private，新写入立即可见。
- **提示词检索 `Search`**：仍只取 active episodic/procedural，但相似度为 0 的候选不再注入；去掉 SQL 预 `LIMIT`，避免较早的相关记忆被截断；继续保留 audience、私有渠道和 fictional 隔离。
- 单字中文查询增加归一化后的子串匹配，例如“海”可以命中“一起看了海”。

回归测试覆盖：乱码查询返回空、生日命中 `real/profile`、`realm=fictional` 生效、private 记忆在工具搜索可见但只在私有渠道注入、新写入立即可见。

另一个容易误判的点：`use_count/last_used_at` 为 0 不是故障证据，旧 `Search` 本来就不更新它们；库里没有 FTS 表也不是原因，检索走的是 SQL + Jaccard，不是 FTS5。

## 七、数据库修复与迁移

这次没有 schema 迁移，`memory.db` 的表结构不变。需要迁移的是**数据分类**：如果生产库仍把角色设定放在 `work/procedural`，提示词就会把它当成工作流程。

0.4.5 在 Launcher `/memory` 增加了“数据库修复”：

1. 选 source：realm / layer / status / audience / 关键词；
2. 预览匹配数量和前 20 条样本；
3. 设置 target：realm / layer / audience；
4. 执行：先用 SQLite `VACUUM INTO` 备份，再在事务里批量更新；
5. 验证：搜索原句、realm/layer 过滤、private 渠道隔离。

它只改分类，不删除记录；自动备份文件是 `memory.db.backup-时间戳`。语义分层（profile / relationship / episodic / boundary）仍建议分批、按关键词迁移，不要指望工具替你猜。

### 0.5.0：把 schema v2 迁移做进 Launcher

0.4.x 的数据库修复只改分类，不改表结构。0.5.0 把长期记忆升级到 schema v2，并把迁移入口放进 Launcher 的 `/memory`：

- `entries` 增加 `facet`：同一个 `subject+predicate` 下的不同侧面可以共存，不再互相 supersede；
- `personas` 改成 `(id, version)`，并增加 `realm / audience / scope`：伴侣人设可以只进入私有渠道；
- `relationship_state` 增加 `expires_at`，旧值写入 `relationship_state_history`；
- 空 `predicate` 统一为“待分类”，参考库 v13–v21 的 9 条 relationship 会写入 predicate/facet 并保持 active。

迁移仍然先 `VACUUM INTO` 备份，只改分类，不删除条目。页面会显示 schema 版本、空 predicate、空 relationship facet 和已映射数量；命令行对应 `picoclaw memory migrate`。这解决了一个很实际的问题：**用户不该为了升级记忆库去手写 SQL。**

## 八、流式管道的两个卡点

记忆之外，这块运行时里最影响体感的是流式。

**卡点一：多候选就不流式。** 原逻辑是"只有当活跃候选唯一时才走流式"，多候选 fallback 场景直接关流。改法是：**首选候选直接流式**；流式失败且**尚无可见输出**时才交回 fallback，已有可见输出绝不切换（否则用户会看到两段风格不同的回答拼在一起）。

顺带把前端新建模型的默认值从 `streamingEnabled: false` 改成 `true`——不然后加进来的模型永远走非流式。

**卡点二：收尾顺序。** 长回复的最后内容帧到 `typing.stop` 之间会阻塞约 **840ms**，短回复只有 8ms。根因是 finalize 里**先 Save（全量重写 + fsync）再发最终帧**。

把顺序调成「内存写入 → 算 usage → 发最终帧 → Save → Compact」之后，收尾降到 **8ms**。

同一批还修了：

- `picoConn` 加写超时（原来在锁内同步写、慢客户端能永久阻塞）；
- 开 WebSocket 的 permessage-deflate；
- **会话持久化异步化**：`AddMessage` 只进 pending 队列立即返回，后台 worker 每 20ms 合并一次、按会话一次 `append + fsync + meta`、同会话严格串行；单会话积压超 256 条强制同步落盘；`Close` 全量 flush。

代价要写清楚：**非正常崩溃最多丢最近 20ms 未落盘的消息**；外部程序直接读 `sessions/*.jsonl` 需要等 20ms 或显式 `Flush()`。

一个实测数据值得记：长回复 **2751 字符 / 235 帧 / 383KB**，而每帧都是**全量快照**——累计传输放大约 **140 倍**。这就是下一步要做增量帧的动机。

## 九、定时任务的四个「看起来正常」

定时任务这一块，四个 bug 的共同点是**界面显示一切正常**：

**① CLI 加了任务，跑着的 gateway 不执行。** CLI 是新建一个 `CronService` 写 `jobs.json`，而 gateway **只在启动时加载一次**、不监听文件变化。修法是加热加载。

**② 任务失败却显示 `lastStatus: ok`。** `CronTool.ExecuteJob` 只返回一个 `"Error: ..."` 字符串，`setupCronTool` 无论结果都返回 nil。修法是把签名改成 `(string, error)`，让错误真的传回 `CronService`。

**③ 停机期间过期的一次性任务永久空转。** 修法是启动后立即执行一次，并从存储删除；执行失败则保留为 disabled 并写 `lastError`，可用 `cron enable` 重试。

**④ 配置重载后新旧两个调度循环同时跑同一任务。** 修法是重载前先停旧 `CronService`，并让 `Stop` 等待调度循环真正退出。

还有两个边界：`tools.cron.enabled=false` 时仍要安装任务执行器（否则已持久化的任务静默不执行）；删掉最后一个任务后 `jobs.json` 要写 `"jobs": []` 而不是 `null`。

**已知限制**：CLI 与 gateway 同时写 `jobs.json` 仍是"最后写入者获胜"，彻底解决需要跨进程文件锁或由 gateway 提供控制 API。

## 十、客户端的出口边界

最后记一件和"记忆"看似无关、但同属 agent 工程边界的事。

一个桌面客户端分支被要求"开源版不参与官方活动"，但装好之后**仍然收到免费 token 的营销推送**。查下来是上游新增了一条 `marketingTouch` 通道，请求 `/api/v1/marketing/touch`。

根因比这一条通道更值得记：**代码里根本没有统一的"官方域名出口拦截层"**——屏蔽完全依赖每个消费点自己去查开关。上游新增一条通道而清单没跟上，它就保持默认开启。

于是那次不只是关一个开关，而是：

- 策略常量置 false + 服务层注册空实现（**返回空快照而不是抛错**，否则调用方会按失败退避反复重试）+ Renderer 不创建 runtime（不轮询、不下载资源、不渲染 Banner）；
- 顺手全仓扫出另外两处仍在自动触达官方域名的通道：**启动强制升级 gate**（上游一上调 `minimalVersion` 就可能阻止建主窗口）和**客户端远端配置**（两处灰度入口会请求 `/api/v1/client/configs`），都加关闭入口；
- 补 **`check:defaults` 静态断言**，并为上游新文件在架构策略里登记最小例外。

第三条是关键：这类"靠每个消费点自觉"的机制，**下次同步上游必然再漏一条**。没有拦截层，就只能靠"默认值 + 静态断言"把漏的地方钉住。

## 总结

做 agent 的长期记忆，容易把注意力放在"怎么存"，但真正决定成败的是三件事：

1. **知道哪条不该用**——`pending_review`、`superseded`、`audience` 这几个状态比存储量重要；
2. **抽取要克制**——自动写入的规则越宽，库烂得越快；宁可少记，也不要记错；
3. **注入要有预算**——固定块保人设、检索块补上下文，两个数字都要写死；边界规则单独拼接，不能被预算裁掉。

另外两条通用经验：

- **「看起来正常」是最危险的信号**——定时任务显示 ok、收尾看起来没慢、任务加了没报错，全是假象；判断标准要有可观测的副作用（`lastRunAtMs` 变了、`typing.stop` 的间隔、进程数）。
- **别指望每个调用点都自觉**——无论是"不请求官方域名"还是"失败要报错"，只要没有统一入口，就一定会漏。要么加拦截层，要么加静态断言。
