---
title: OpenCode Go 模型配置指南
date: 2026-11-04
---

> Go 套餐 30 款模型的清单口径、端点归属、倍率与配置推荐。数据抓取日 **2026-11-04**。

[← 返回「模型情报」合集](/model-intel/)

---

> 版本：**2026-10-21**（数据抓取日 2026-10-21）
> 适用：Claude Code · OpenCode Go · oh-my-opencode-slim · Linux · FreeBSD · Docker · Kubernetes · Rust · Go · Python · 网络设备运维
> ⚠️ 本版**只保留现行有效口径**。模型清单、额度与价格每次以官方清单 API diff 复核。

## OpenCode Go 模型列表

**数据来源**：OpenCode Go 官方文档（[opencode.ai/docs/go](https://opencode.ai/docs/go/)，**2026-10-21 抓取，9 张表全量解析**）、官方营销页 opencode.ai/zh/go、各厂商官方 API 定价。智能/Agentic = Artificial Analysis 智能指数 / Agentic 指数（AA 已移除编码指数，沿用 08-18 快照；另有 Command Code GOAT 页 "Intelligence" 单列，**与 AA 快照不同标度、不可混用**，见本节末）。
**清单口径**：docs 正文 **30 款**；套餐 API `GET https://opencode.ai/inference/go/v1/models` 于 **2026-11-04 实测返回 28 个 ID**——**两源互有出入**：**2 款仅正文列出、API 已不返**：`mimo-v2.5`、`mimo-v2.5-pro`（小米官方 API 已于 2026-10-21 10:00 UTC+8 下线）；**API 侧 28 款全部已入正文**（`glm-5.1`、`grok-4.6`、`kimi-k2.6`、`minimax-m2.5`、`minimax-m2.7`、`omen-alpha`、`qwen3.6-plus`、`qwen3.7-max` 八款**已全部退出套餐 API**）。**正文新增 3 款**：`kimi-k3.1-pro`（Kimi 新旗舰）、`iceman-contributor-free`（免费档）、`gemini-4-argon`（原 `gemini-4-argon-contributor` 更名）。**已退出清单的 ID（切勿再写进配置）**：`deepseek-flash`、`deepseek-v4-flash`、`deepseek-v4-flash-vision-exp`、`glm-5`、`grok-4.5`、`hy3-preview`、`kimi-k2.5`、`mimo-v2-omni`、`mimo-v2-pro`、`qwen3.5-plus`、**`space-bunny`**、`space-bunny-free`、`cat-jam-free`、**`minimax-m3.1-flash-free`**（限时免费已结束）。⚠️ 营销页计数与 docs 正文口径不同，**以 docs 正文为准**。
**额度口径**：官方以**月度美元上限 + 比例窗口**表述——**5 小时 = 月度上限 20%、每周 = 50%、每月 = 100%**（**$80 档 = $16/$40/$80**；$60 档 = $12/$30/$60；$30 档 = $6/$15/$30；$15 档 = $3/$7.5/$15；Plus $120 档 = $24/$60/$120；Plus $240 档 = $48/$120/$240）。同页保留逐模型"Estimated requests"表（下表沿用该口径）。
**订阅与免费模型**：Go 订阅管理已并入 OpenCode Zen 控制台；免费模型为 Zen 的独立 `-free` 端点（清单 API 于 **2026-11-04 实测 9 款 `-free` + Big Pickle**），**不自动回落、需手动切换模型 ID**。**Go / Go Plus 均限于单成员 workspace**（带 Go 订阅的 workspace 无法邀请成员）。
**限时免费**：**LongCat 2.5 Preview Free**、**Beam Free**、**MiniMax M3.1 Flash Free**（docs 正文均标 "Unlimited limited time"，官方未公布截止日，不可假定已到期）；**Beam Free 另有地区限制 + 30 天留存**。⚠️ **DeepSeek V4.1 Flash 月额度实测 $80**（Off-Peak / Peak 两档同额度），为 Go 侧现行最高档。**限时翻倍**：**Step 5 Preview** $15→$60（4x）、**Gemini 4 Argon Contributor** $30→$60（2x），额度与请求数同步翻倍。
⚠️ **`mimo-v2.5` / `mimo-v2.5-pro` 已于 2026-10-21 10:00（UTC+8）在小米官方 API 正式下线**，但 Go / CommandCode / OpenRouter 渠道**仍在供**（转售存货）——**新配置一律改用 `mimo-v2.6-flash` / `mimo-v2.6-pro`**。

### Go 三档订阅结构（Go $10 / Go Teams $20·成员 / Go Plus $40）

官方三档订阅结构（**Token 单价完全相同，仅月度额度与成员数不同**）：

| 计划 | 月费 | 官方定位 | 模型清单 |
|---|---|---|---|
| **Go** | **$10** | Lower-cost access to the models below | 同一份清单（30 款） |
| **Go Plus** | **$40** | **Higher usage limits** across the models below | 同一份清单（30 款） |
| **Go Teams** | **$20 / 成员 / 月** | **Every member gets their own limits, $5/month higher than Go on every model** | 同一份清单（30 款） |

> 🔑 **关键口径：三档的 Token 单价完全相同**（官方原话「Token pricing is the same for Go and Go Plus」）——**Plus / Teams 买的不是更便宜的单价，而是更高的额度上限**。定价表（Input/Output/Cached Read/Cached Write）三档共用，仅 Monthly limit 不同。
> 🔑 **Go Teams（$20/成员/月）为 11-04 新增档位**：官方原话「Every member gets their own limits, **$5/month higher than Go on every model**」——**逐模型额度 = Go 档 + $5**（如 DeepSeek V4.1 Flash $100 → $105、GLM-5.3-Flash $60 → $65、Kimi K3 $15 → $20），**每成员独立计额**，是团队场景下比 Go Plus $40 更划算的选项。
> **额度结构沿用比例窗口**：5 小时 = 月度上限 20%、每周 = 50%、每月 = 100%。
> **工作区限制**：Only one member per workspace can subscribe to OpenCode Go or Go Plus。

**逐模型额度倍率（Plus ÷ Go）**——倍率分 **2x / 3x / 4x / 8x** 四档，29 款全覆盖：

| 倍率 | 模型 | Go 月额度 → Plus 月额度 | Go 5h/月请求 → Plus 5h/月请求 |
|---|---|---|---|
| **8.0x** | **GLM-5.3** | $15 → **$120** | 220 / 1,080 → **1,760 / 8,640** |
| **4.0x** | Kimi K3 | $15 → $60 | 110 / 490 → 440 / 1,960 |
| | LongCat-2.0 | $60 → $240 | 11,400 / 57,200 → 45,600 / 228,800 |
| | **Step 5 Preview（限时 $60）** | $15 → $60 | 430 / 2,130 → 1,720 / 8,520（限时 4x 后 6,880 / 34,080） |
| | MiMo-V2.6-Pro / MiMo-V2.5-Pro | $15 → $60 | 3,250 / 16,300 → 13,000 / 65,200 |
| | Qwen3.8 Max | $15 → $60 | 160 / 810 → 640 / 3,240 |
| | DeepSeek V4 Pro | $15 → $60 | 1,050 / 5,200 → 4,200 / 20,800 |
| | Hy4 preview | $30 → $120 | 1,350 / 6,770 → 5,400 / 27,080 |
| | Hy3 | $60 → $240 | 4,300 / 21,500 → 17,200 / 86,000 |
| | Grok 4.7 | $15 → $60 | 169 / 845 → 676 / 3,380 |
| | GPT 6 Luna / GPT 5.6 Luna | $15 → $60 | 4,230 / 21,130 → 16,920 / 84,520；2,050 / 10,250 → 8,200 / 41,000 |
| | **Claude Haiku 5.5** | $15 → $60 | 3,850 / 19,230 → 15,380 / 76,920 |
| | **Gemini 4 Argon Contributor（限时 $60）** | $30 → $120 | 220 / 1,060 → 880 / 4,240（限时 2x 后 1,760 / 8,480） |
| **3.0x** | GLM-5.3-Flash / GLM-5.2 | $60 → $180 | 6,320 / 31,580 → 18,960 / 94,740；880 / 4,300 → 2,640 / 12,900 |
| | Kimi K2.7 Code | $60 → $180 | 1,350 / 6,750 → 4,050 / 20,250 |
| | MiniMax M3 | $60 → $180 | 3,200 / 16,000 → 9,600 / 48,000 |
| | Qwen3.8 Flash | $30 → $90 | 5,400 / 27,000 → 16,200 / 81,000 |
| | Qwen3.7 Plus | $60 → $180 | 4,300 / 21,600 → 12,900 / 64,800 |
| **2.0x** | **DeepSeek V4.1 Flash** | $80 → $160 | 34,670 / 173,330 → 69,330 / 346,670 |
| | **MiMo-V2.6-Flash / MiMo-V2.5** | $60 → $120 | 30,100 / 150,400 → 60,200 / 300,800 |
| | **Muse Spark 1.3 / 1.2 Contributor** | $60 → $120 | 45,300 / 226,600 → 90,600 / 453,200 |
| **免费** | LongCat 2.5 Preview Free、Beam Free、**MiniMax M3.1 Flash Free**（均限时） | Unlimited | Unlimited |

> ⚠️ **算账结论（重要）**：Plus 月费是 Go 的 **4 倍**（$10 → $40），因此**额度倍率 ≥ 4x 才不亏**：
> - **8x（GLM-5.3，1 款）**：单位成本降至 **0.5 倍**（便宜 50%）→ **唯一明确划算的模型**；
> - **4x（14 款）**：**单位成本与 Go 持平**，Plus 只是"同样的钱能跑更久"；
> - **3x（6 款：GLM-5.3-Flash、GLM-5.2、Kimi K2.7 Code、MiniMax M3、Qwen3.8 Flash、Qwen3.7 Plus）**：单位成本 **贵约 33%**；
> - **2x（5 款：DeepSeek V4.1 Flash、MiMo-V2.6-Flash、MiMo-V2.5、Muse Spark 1.3/1.2）**：单位成本 **贵 100%**——**这批恰是 Go 侧额度已最高的主力模型**（V4.1 Flash $80、MiMo-V2.6-Flash / Muse Spark $60）。
>
> **P0 选型建议**：① 主力用 **DeepSeek V4.1 Flash / MiMo-V2.6-Flash / Muse Spark**（调用量榜 Top 主力）→ **留在 Go，$10 更划算**；② 主力是 **GLM-5.3** → **升 Plus，单位成本腰斩**；③ 需要"长时间专注编码不撞墙"（大项目、长会话）→ **Plus 的价值在额度天花板而非单价**，按 4x 档模型评估；④ **不要为了"更便宜"买 Plus**——除 GLM-5.3 外，Plus 的单位成本均 ≥ Go。

### 高级推理模型

| 模型 | 定位 | 智能/Agentic | 上下文 | 月额度 | 性价比 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| GLM-5.3 | 编码+网络安全旗舰（743B，CyberGym 领先）；**Go Plus 下额度 8x（$15→$120），全目录唯一明确划算的升级项** | **59.51/59.10**¹ | 1M² | $15（Plus **$120**） | 1.6x（Plus **0.8x**） |
| GLM-5.2 | 顶级规划与推理 | 52.64/45.7 | 1M | $60 | **6.5x** |
| Hy3 | 通用推理旗舰（腾讯 295B） | 42.0/31.4 | 256K | $60 | **6.0x** |
| Kimi K3 | 旗舰推理（智能第一） | **59.70/54.26** | 1M | $15 | 1.5x |
| DeepSeek V4 Pro（官方 `DeepSeek-V4-Pro-0813`） | 深度推理（**继续在役，无下线时间表**） | 53.20/49.56 | 1M | $15 | 1.5x |
| MiMo-V2.5-Pro | 中高阶推理 | 42.88/29.5 | 1M | $15 | 1.5x |
| MiMo-V2.6-Pro | **MiMo 最新旗舰（2026-09-21 上线）**；1.05M 上下文、多模态 Agentic 编码；内部价与 V2.5-Pro 相同（$0.435/$0.87/$0.003625）、3,250/8,150/16,300 次 | AA 未收录 | 1.05M | $15 | 1.5x |
| GPT 5.6 Luna | OpenAI 低成本旗舰 | 52.32/46.90 | 1M | $15 | 1.5x |
| **GPT 6 Luna** | **OpenAI 最新低成本档（2026-09-22 发布）**；$0.10/$0.50/$0.01（Go 内最低单价），1.05M 上下文、4,230/10,560/21,130 次 | AA 未收录 | 1.05M | $15 | **1.5x**（单价极低） |
| Qwen3.8 Max | 阿里旗舰（Agentic 第二） | 58.08/58.40 | 1M | $15 | 1.5x |
| Grok 4.7 | **xAI 旗舰（2026-09-21 发布，Go 内唯一 Grok）**；500K 双档计价、169/423/845 次；AA 未收录（DeepSWE v1.1 71.0%、CursorBench 4.0 46.3%、Terminal-Bench 4.0 38.0%） | AA 未收录 | 500K | $15 | 1.5x |
| Hy4 preview | 腾讯旗舰（770B 总参 / 49B 激活、MoE） | AA 未收录 | 1M | $30 | **3.0x**⁷ |
| DeepSeek V4.1 Flash（官方 `DeepSeek-V4.1-Flash-1017`） | **DeepSeek 主力旗舰**；官方称成本/速度/性能全面超 V4 Pro；**月额度 $80，Go 侧现行最高档** | AA 未收录 | 1M | **$80**（Plus **$160**，2x） | **8.0x**（Plus 4.0x） |

¹ GLM-5.3 AA 08-18 快照：智能 59.51（Go 内第二，仅次 Kimi K3）、**Agentic 59.10（Go 内最高）**；**权重已于 2026-08-28 开源**（MIT）。² GLM-5.3 上下文官方未单独公布，按 GLM-5.2 口径标注。
⁷ Hy4 preview：Go 内部价 $0.834/$2.501/$0.042，典型 token 830/71,500/295，1,350/3,380/6,770 次，测算 3.0x。
⁸ **`glm-5.1`、`grok-4.6`、`kimi-k2.6`、`minimax-m2.5`、`minimax-m2.7`、`omen-alpha`、`qwen3.6-plus`、`qwen3.7-max` 八款仅套餐 API 返回**（`GET /inference/go/v1/models`），docs 正文四张表（Go 价目 / Plus 价目 / 请求数 / 端点）全部不列，**无官方额度与请求数，不参与性价比测算，不写入推荐配置**。

### Coding 模型

| 模型 | 定位 | 智能/Agentic | 上下文 | 月额度 | 性价比 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Kimi K2.7 Code | 最佳 Coding Agent（性价比第一） | 43.02/30.3 | 256K | $60 | **8.2x** |
| MiniMax M3 | 综合开发（$60 档 Agentic 最高） | 45.40/36.1 | 1M | $60 | **6.0x** |
| Qwen3.7 Plus | 综合开发 | 39.4/20.7 | 256K | $60 | **6.0x** |

### 快速辅助模型

| 模型 | 定位 | 智能/Agentic | 上下文 | 月额度 | 性价比 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| GLM-5.3-Flash | 高性价比多模态视觉辅助（320B/18B、MIT 开源，6,320 次/5h）；**Go 侧 $60，CommandCode GOAT 侧 $80，两侧口径不同** | 57.5⁹ | 1M | **$60**（Plus **$180**，3x） | **6.0x**³ |
| Muse Spark 1.2 Contributor | 高请求量辅助（45,300 次/5h，**Meta 模型，数据训练条款**） | 56.8⁴ | 1M⁶ | $60 | **6.0x**⁴ |
| Muse Spark 1.3 Contributor | 高请求量辅助（与 1.2 同请求数/同价 $0.10/$0.20/$0.002；Not ZDR、数据训练条款、限区域） | 未收录（1.2 为 56.8） | 1M | $60 | **6.0x** |
| MiMo-V2.5 | 轻量任务（**官方 2026-10-21 已下线，渠道存货，新配置改用 V2.6-Flash**） | **38.0** | 1M | $60 | **6.0x** |
| MiMo-V2.6-Flash | **MiMo 最新轻量档（2026-09-21 上线）**；1.05M 上下文、30,100/75,200/150,400 次（Go 内请求数第一档） | AA 未收录 | 1.05M | $60 | **6.0x** |
| DeepSeek V4.1 Flash | DeepSeek 主力旗舰；**月额度 $80，Go 侧现行最高档** | AA 未收录 | 1M | **$80**（Plus **$160**，2x） | **8.0x**（Plus 4.0x） |
| LongCat-2.0 | 高请求量通用辅助（11,400 次/5h） | AA 未收录 | — | $60（Plus $240，4x） | **6.0x** |
| **LongCat 2.5 Preview Free** | **美团新一代（2026-09-25 发布）**；1.6T 总参 / 约 48B 激活 MoE、1M 上下文、128K 输出、**支持图片理解**；面向长程 Agent（终端/浏览器/桌面/表格/设计工具）；兼容 OpenAI 与 Anthropic 接口 | AA 未收录 | 1M | **免费（限时）** | 免费（Unlimited） |
| **Beam Free** | **Reflection 模型（`reflection/beam`）**；Go 侧限时免费、**限地区**、留存 30 天；OpenRouter 最低渠道 $0.25/$1.00（无缓存项） | AA 未收录 | — | **免费（限时、限地区）** | 免费（Unlimited） |
| **MiniMax M3.1 Flash Free** | **MiniMax 新一代轻量档（CLI 1.85.0 起收录）**；1M 上下文、多模态编码、可调思考深度（low→max）；Go 侧限时免费、0 天留存 | AA 未收录 | 1M | **免费（限时）** | 免费（Unlimited） |
| Qwen3.8 Flash | 阿里高性价比辅助（千亿总参/6B 激活，5,400 次/5h） | AA 未收录 | 1M⁸ | $30 | **3.0x** |
| **Step 5 Preview** | **StepFun 预览档**；$1.00/$2.70/$0.10；官方标注**限时 4x**（$15 → $60）；430/1,070/2,130 次 | AA 未收录 | — | **$15**（限时 **$60**） | 1.5x（限时 **6.0x**） |
| **Claude Haiku 5.5** | **Anthropic 低成本档**；≤100K $0.10/$0.50/$0.01（缓存写 $0.125），>100K $0.50/$2.50/$0.05；3,850/9,620/19,230 次；留存 30 天 | AA 未收录 | 100K 分档 | **$15**（Plus $60，4x） | 1.5x |
| **Gemini 4 Argon Contributor** | **Google Contributor 档**；$4.00/$20.00/$0.20；官方标注**限时 2x**（$30 → $60）；**训练 Yes / Not ZDR** | AA 未收录 | — | **$30**（限时 **$60**） | 3.0x（限时 **6.0x**） |

³ GLM-5.3-Flash：Go 内部价 $0.15/$0.50/$0.03，典型 token 1,000/55,000/200，6,320/15,790/31,580 次，测算 6.0x；官方定价 = GLM-5.3 的 1/10（目录价 ¥0.8/¥2.8）。⁴ Muse Spark 典型 token 组成 620/71,400/300，测算 6.0x；官方注明以"提示词/补全训练 Meta 模型"换折扣、限部分地区，**敏感项目慎用**。⁶ Muse Spark Contributor 上下文 1M。⁸ Qwen3.8 Flash：Go 内部价 $0.15/$0.47/$0.016（缓存写 $0.20），典型 token 600/58,000/200，5,400/13,500/27,000 次，测算 3.0x。⁹ AA 智能 57.5（来源为 Command Code GOAT 页，Go 官方文档未收录）。

> **计算口径说明**：单次成本 = 典型输入 × 输入价 + 典型缓存 × 缓存价 + 典型输出 × 输出价；性价比 = 月等效价值 ÷ $10。**Step 5 Preview / Claude Haiku 5.5 / Gemini 4 Argon / Beam Free / MiniMax M3.1 Flash Free 无官方典型 token 口径**，前三款按 `月额度 ÷ 月请求数` 反推（Beam Free 与 MiniMax M3.1 Flash Free 为 Unlimited，不测算）。Kimi K2.7 Code 因典型 token 口径沿用 K2.6，测算值 8.2x 高于标称 $60 额度（+36%），**预算规划以 $60 额度为准**。

### 模型评分参照（Artificial Analysis，08-18 快照）

智能指数 / Agentic 指数，artificialanalysis.ai 独立评测（AA 已移除编码指数）。参照：Claude Opus 5 = 63.05/59.17，Claude Fable 5 = 62.07/56.59，Claude Sonnet 5 ≈ 55/49.7。

| 模型 | 智能 | Agentic | 性价比 | 评分定位 |
| :--- | :---: | :---: | :---: | :--- |
| Kimi K3 | **59.70** | 54.26 | 1.5x | Go 内智能第一 |
| GLM-5.3 | 59.51 | **59.10** | 1.6x | Agentic Go 内最高 |
| Qwen3.8 Max | 58.08 | 58.40 | 1.5x | Agentic 第二 |
| DeepSeek V4 Pro（0813） | 53.20 | 49.56 | 1.5x | 深度推理 |
| GLM-5.2 | 52.64 | 45.7 | **6.5x** | 均衡主力 |
| GPT 5.6 Luna | 52.32 | 46.90 | 1.5x | 第一梯队（$15） |
| MiniMax M3 | 45.40 | 36.1 | **6.0x** | $60 中 Agentic 最高 |
| Kimi K2.7 Code | 43.02 | 30.3 | **8.2x** | 性价比第一（$60 档） |
| MiMo-V2.5-Pro | 42.88 | 29.5 | 1.5x | 中等（$15） |
| Hy3 | 42.0 | 31.4 | **6.0x** | 通用推理 |
| Qwen3.7 Plus | 39.4 | 20.7 | **6.0x** | 中下 |
| MiMo-V2.5 | **38.0** | 23.7 | 6.0x | 中下 |
| GLM-5.3-Flash | **57.5** | — | 6.0x | 唯一已收录的新型号 |
| Muse Spark 1.2/1.3、Hy4 preview、Qwen3.8 Flash、LongCat-2.0、MiniMax M3.1 Flash Free、DS V4.1 Flash、**Grok 4.7、MiMo-V2.6-Flash/Pro、Step 5 Preview、Claude Haiku 5.5、Gemini 4 Argon、Beam** | — | — | 6.0 / 6.0 / 3.0 / 3.0 / 3.0 / 免费 / **8.0** / 1.5 / **6.0 / 1.5 / 1.5 / 1.5 / 3.0 / 免费** | AA 未收录 |

> **场外参考**：**Gemini 3.7 Flash**（未入 Go）AA 收录 56.03/45.10。同款模型 AA 智能分（Command Code GOAT 页披露）：GPT-5.6 Sol 60.9、Muse Spark 1.2（含 Contributor）56.8、Qwen 3.8 27B 52.0、Nemotron 3 Ultra 38.3、Kimi K2.5 36.0、GLM-5 40.6。

### Command Code GOAT 页 "Intelligence" 列（10-21 抓取，**独立标度**）

> ⚠️ **口径隔离声明**：下表数值取自 commandcode.ai/docs/plans/goat 模型表的 **Intelligence** 列（10-21 抓取，73 行 T0），**与上文 Artificial Analysis 08-18 快照不是同一标度**——同款模型两处数值系统性偏低（如 GLM-5.3：AA 59.51 / GOAT 页 44.8；Kimi K3：AA 59.70 / GOAT 页 43.6）。**禁止把两列混排、禁止用一方补另一方的空值**；本页列仅用于**横向排序参考**与"AA 未收录模型的唯一可得评分"。`not yet scored` 为页面原文。

| 模型 | GOAT 页 Intelligence | 模型 | GOAT 页 Intelligence |
|---|---:|---|---:|
| Claude Sonnet 5.5 | 56.0 | **Claude Haiku 5.5** | **43.4** |
| Muse Spark 1.3 | 48.1 | Ling 3.1 Flash | 41.1 |
| GPT-5.6 Sol | 47.0 | Gemini 3.8 Flash | 40.9 |
| Grok 4.7 | 46.4 | Qwen 3.8 Max | 40.2 |
| MiMo V2.6 Pro | 46.3 | Muse Spark 1.2 | 39.6 |
| Qwen 3.8 Max 0902 | 45.4 | DeepSeek V4.1 Flash | 39.5 |
| GLM-5.3 | 44.8 | Gemini 3.7 Flash | 39.1 |
| Grok 4.6 | 44.3 | Grok 4.5 | 38.8 |
| **Step 5 Preview** | **43.7** | **Mistral Large 4** | **38.4** |
| Kimi K3 | 43.6 | MiMo V2.6 Flash | 37.9 |
| GPT-6 Luna / GPT-5.6 Luna | 37.3 / 37.3 | DeepSeek V4 Pro (latest) | 36.0 |
| DeepSeek V4 Flash Vision (exp) | 34.8 | DeepSeek V4 Flash (latest) | 34 |
| Qwen 3.8 27B | 33.7 | GLM-5.2 | 33.7 |
| MiniMax M3 | 29.2 | Qwen 3.7 Max | 29.5 |
| Qwen 3.6 Max Preview | 28.4 | Inkling Small | 27.8 |
| GLM-5 | 27.9 | GLM-5.1 | 26.1 |
| Qwen 3.6 Plus / Kimi K2.6 | 27.0 / 27.0 | MiMo V2.5 Pro | 26.0 |
| MiMo V2.5 | 25.2 | Tencent Hy3 | 25.3 |
| Kimi K2.7 Code | 25.8 | Inkling | 25.0 |
| Kimi K2.5 | 23.5 | Nemotron 3 Ultra | 22.9 |
| MiniMax M2.7 / MiniMax M2.5 | 22.8 / 22.8 | LongCat 2.0 | 19.1 |
| Step 3.7 Flash / Step 3.5 Flash | 19.5 / 17.0 | Qwen 3.7 Plus | 25.2 |

> **`not yet scored`（页面对以下款未给分）**：**Beam 1.0**、**MiniMax M3.1 Flash**、**Ornith 1.5 122B**、**Muse Spark Open**、Jev 1.14.0 / Jev、**Nemotron 3.5 Super VL**、**Glyph Cluster**、**Qwen 3.8 Max Prime**、GLM-5.3 FlashX、Qwen 3.8 Omni Flash、Qwen 3.8 Flash、MiMo V2.6 Pro UltraSpeed、Tencent Hy4 Preview、GLM-5.2 Fast、Kimi K2.7 Code HighSpeed、Qwen 3.7 Flash、DeepSeek V4 Flash Fast、DeepSeek V4.1 Flash Fast、Muse Spark 1.3/1.2 Contributor、Laguna S 2.1。
> 🔑 **对本工作区的用途**：这批数值是 **AA 未收录新模型（Grok 4.7、MiMo V2.6 Pro、Qwen 3.8 Max 0902、Step 5 Preview、Claude Haiku 5.5、DeepSeek V4.1 Flash）目前唯一的第三方排序信号**，可用于"新模型梯队估计"，但**不得写入性价比或选型结论作为定量依据**。

## 模型调用量排名（2026-11-04 快照）

> 数据来源：**OpenCode Data（[opencode.ai/data](https://opencode.ai/data)）**，页面顶部更新 **11月4日, GMT+8 14:32**，OpenCode 全量用户。**本节只保留摘要；完整周榜 / 日榜 / 前 5 国家每日份额 / 作者份额统计见 [OpenCode 模型调用量排名](/model-intel/opencode-model-usage-ranking/)。**

**周榜 Top 5（滚动 7 日，截至 2026-11-04）**

| 排名 | 模型 | 厂商 | Token 调用量 | 周环比（页面口径） |
| :--: | :--- | :--- | :----------: | :----: |
| 1 | **deepseek-v4.1-flash** | DeepSeek | **133T** | **+4%** |
| 2 | muse-spark-1.3-contributor | Meta | 6.5T | -17% |
| 3 | glm-5.3-flash | Zhipu | 6.0T | -25% |
| 4 | **beam-1.0-501b-a23b** | Reflection | 5.5T | -6% |
| 5 | mimo-v2.6-flash | Xiaomi | 3.2T | -34% |

> 完整周榜 / 日榜、地理分布与作者份额见 [OpenCode 模型调用量排名](/model-intel/opencode-model-usage-ranking/)（页面顶部"已更新 11月4日, GMT+8 14:32"）。

**要点**：
- **`deepseek-v4.1-flash` 以 133T 居首、周环比 +4%**；作者份额当日 **76.3% → 85.1%**。
- **榜单模型 ID 变更**：`beam` 已以 `beam-1.0-501b-a23b` 出现；**`iceman-contributor`（+729%）/ `iceman` / `pulse-alpha` / `flint-40b` 为新进榜的免费或 stealth 端点**，其中 `iceman-contributor-free` 正是本套餐新增的免费档。
- **`minimax-m3.1-flash` 掉至第 14（552B，-93%）**——免费端点下架后量级持续塌缩；**MiniMax 当日作者份额仅 0.4%**。
- **日榜（NOV 4）**：`deepseek-v4.1-flash` **6.6T** 居首，其后 `glm-5.3-flash` 254B、`muse-spark-1.3-contributor` 238B、`beam-1.0-501b-a23b` 192B、`mimo-v2.6-flash` 125B、**`pulse-alpha` 101B（第 6）**。
- **国家份额（前 5，NOV 4）**：中国 **16%（209T）**、美国 12%（151T）、印度 6%（73T）、德国 4%（56T）、巴西 4%（55T）。
- **全站缓存比例 97%**：已缓存 6.3T、未缓存 180.8B。

### OpenCode Zen 网关与免费模型

**Zen**（[opencode.ai/zen](https://opencode.ai/zen)）是 OpenCode 按量付费精选模型网关：$20 起充（余额低于 $5 自动充 $20）、按请求付费**零加价**、可设月度限额、美区托管；信用卡手续费按成本转嫁（**4.4% + $0.30/笔**）。**Go 订阅管理已并入 Zen 控制台**。**免费模型是 Zen 的独立 `-free` 端点，不会从 Go 自动回落**——Zen 下模型 ID 为 `opencode/<model-id>`（如 `opencode/mimo-v2.6-flash-free`），与 Go 的 `opencode-go/<model-id>` **名称不同**，达限额后需手动切换模型 ID；Go 唯一的自动回落机制是控制台开启 **Use balance** 后回退 Zen 余额按量付费。
**清单规模**：`/zen/v1/models` 于 **2026-11-04 实测 80 款 = 9 款 `-free` + Big Pickle + 70 付费**，**以 API 清单为准**：

| 免费模型（模型 ID） | 说明 |
|---|---|
| **Beam Free（`beam-free`）** | Reflection 模型免费端点；**限时 + 限地区** |
| **DeepSeek V4.1 Flash Free（`deepseek-v4.1-flash-free`）** | V4.1 Flash 免费端点 |
| **GLM-5.3 Flash Free（`glm-5.3-flash-free`）** | 智谱轻量档免费端点（未列进 docs/zen 免费表，以 API 为准） |
| Jev 1.13 Free（`jev-1.13-free`） | TypeSafe AI System One 决策模型免费端点（`/v1/systemone`） |
| **LongCat 2.5 Preview Free（`longcat-2.5-preview-free`）** | 美团新一代（2026-09-25 发布）；1.6T/约 48B 激活、1M 上下文、原生多模态（图片理解）；面向长程 Agent |
| **MiMo-V2.6-Flash Free（`mimo-v2.6-flash-free`）** | 小米 MiMo 最新轻量档免费端点（免费期收集数据改进模型） |
| **MiniMax M3.1 Flash Free（`minimax-m3.1-flash-free`）** | MiniMax 新一代轻量档免费端点（CLI 1.85.0 起收录）；1M 上下文、多模态编码、可调思考深度 |
| **Nemotron 3.5 Lightning Free（`nemotron-3.5-lightning-free`）** | NVIDIA 免费试用端点，**请勿提交机密数据**（会记录） |
| **Nemotron 3.5 Super VL Free（`nemotron-3.5-super-vl-free`）** | NVIDIA 多模态免费端点 |
| Big Pickle（`big-pickle`） | **隐身（stealth）模型**，限时免费（免费期收集数据；身世未揭晓） |

> ⚠️ **Zen `-free` 独立端点现行共 9 款**（另有 Big Pickle）：`beam-free`、`crouton-alpha-free`、`deepseek-v4.1-flash-free`、`flint-40b-free`、`glm-5.3-flash-free`、`mimo-v2.6-flash-free`、`nemotron-3.5-lightning-free`、`nemotron-3.5-super-vl-free`、**`pulse-alpha-free`（新收录）**；**已下架/转付费**：**`jev-1.13-free`（已退出 Zen）**、**`minimax-m3.1-flash-free`（限时免费结束）**、**`longcat-2.5-preview-free`**、`space-bunny-free`、`cat-jam-free`、`muse-spark-1.2-contributor-free`、`muse-spark-1.3-contributor-free`、`mimo-v2.5-free`、`ling-3.0-flash-fin-free`、`ling-3.1-flash-free`、`fledge-alpha-free`、`nemotron-3-ultra-free`、`deepseek-v4-flash-free`。**新收录**：`flint-40b-free`（对应 OpenRouter `recursive/flint-v1.0:free`，262K，免费）。部分 `-free` 未列进 docs/zen 免费表者，**以 API 清单为准**。

> **付费区**含闭源旗舰：**GPT-6 Astra**（$10/$50，≤272K；>272K 为 $20/$75）、GPT 5.6 Sol/Terra、**Grok Build 0.1**（$1/$2）、Claude Fable 5/**5.1**、Claude Opus **4.5–4.8/5**、Gemini **3.1 Pro** / 3.5–3.8 Flash 等。配置 ID 格式 `opencode/<model-id>`。

**Go 套餐 API 端点**：全部为 **`https://opencode.ai/inference/go/{openai,anthropic,google}/v1*`**（旧 `https://opencode.ai/zen/go/v1/*` 仍返回 200 且 ID 一致，属兼容别名，**新配置一律写新路径**），以 Go 订阅的同一 API key 认证（登录 Zen 控制台复制），按协议分流——docs/go 端点表实测 **29 行 = Responses 5 + Google 1 + Chat Completions 18 + Messages 5**。
- **Responses `/inference/go/openai/v1/responses`**（`@ai-sdk/openai`，**5 款**）：Grok **4.7**、**GPT 6 Luna**、GPT 5.6 Luna、Muse Spark **1.3/1.2** Contributor
- **Chat Completions `/inference/go/openai/v1/chat/completions`**（`@ai-sdk/openai-compatible`，**18 款**）：GLM-5.3-Flash、GLM-5.3、GLM-5.2、Kimi K3、Kimi K2.7 Code、LongCat-2.0、**LongCat 2.5 Preview Free**、**Step 5 Preview**、**Beam Free**、**DeepSeek V4.1 Flash（`deepseek-v4.1-flash`）**、DeepSeek V4 Pro、**MiMo-V2.6-Flash、MiMo-V2.6-Pro**、MiMo-V2.5、MiMo-V2.5-Pro、Hy4 preview、Hy3、**MiniMax M3.1 Flash Free**
- **Google `/inference/go/google/v1beta/models/gemini-4-argon-contributor`**（`@ai-sdk/google`，**1 款**）：**Gemini 4 Argon Contributor**
- **Messages `/inference/go/anthropic/v1/messages`**（`@ai-sdk/anthropic`，**5 款**）：**Claude Haiku 5.5**、MiniMax M3、Qwen3.8 Max、Qwen3.8 Flash、Qwen3.7 Plus

> ⚠️ **协议归属易错点**：**Kimi K3 走 Chat Completions**（不是 Messages），**MiniMax M3 走 Messages**（不是 Chat Completions）。Anthropic 兼容层下 `max_tokens` 必填。
> ⚠️ **端点表只覆盖 docs 正文 29 款**：套餐 API 另返回的 8 个 ID（`glm-5.1`、`grok-4.6`、`kimi-k2.6`、`minimax-m2.5`、`minimax-m2.7`、`omen-alpha`、`qwen3.6-plus`、`qwen3.7-max`）**不在端点表内**，其协议归属**官方未公布、不得按同族外推**。

模型 ID 短格式（`kimi-k3`），配置中写 `opencode-go/kimi-k3`。
**✅ API 协议对齐**：**OpenCode Go 与 Command Code Provider API 均已支持 OpenAI Responses 端点**（GOAT 自 CLI v1.55.0 起补齐），**两平台协议能力一致**。

**客户端与会话头要求**：Go 官方文档设 **Validated Clients / Known Problematic Clients** 两节，要求客户端：① 发送"典型 coding agent 流量"；② **自带 user agent**（如 `my-coding-agent/1.0`），不要用通用 SDK/HTTP 库名；③ **每个会话发送稳定的 `x-opencode-session` 会话 ID**（便于路由优化与提示缓存）。
- **已验证可用**：Hermes（需含 PR #101864 的构建，v0.21.0 不含修复）、**Claude Code（识别其原生会话头，无需自定义包装）**、Codex（识别原生会话头，部分版本/代理会丢，转发时需保留）、**ZCode**（官方原文：`x-opencode-session` 已非必须）、Pi、jcode（需 v0.81.6+）、Kilo Code CLI（需含 PR #13752，**不覆盖 VS Code 扩展**）。
- **已知有问题**：DeepSeek Harness（部分模型路径会丢会话信息）、GitHub Copilot Chat（VS Code issue #334186）、Kimi Code（issue #3506）、MiMo Code（PR #2327 未合并）。

**隐私与留存**：
- **0 days（ZDR）**：GLM 全系、Kimi K3 / K2.7 Code、LongCat-2.0、MiMo 全系、Qwen 全系、MiniMax M3、Hy4 preview、Hy3、**MiniMax M3.1 Flash Free**、LongCat 2.5 Preview Free、Step 5 Preview。
- **0 days\*（DeepSeek）**：V4.1 Flash / V4 Pro——**ZDR 协议按月续签，现行有效期至 2026-10-31**（官方原文 "The current agreement is valid through October 31, 2026"）；⚠️ **ZDR 会关闭依赖存储数据的功能**："ZDR disables important API features that depend on stored data, including **the stateful Responses API, Files and Collections, and the Batch API**"；滥用监控日志对所有 API 用量保留至多 30 天（与 ZDR 并行）。
- **30 days**：Grok 4.7、GPT 6 Luna / 5.6 Luna、**Claude Haiku 5.5**（按 Anthropic Data Policies）、**Beam Free**。
- **训练 Yes / Not ZDR**：**Gemini 4 Argon Contributor**（提示与补全可用于训练未来 Google 模型）、Muse Spark 1.3 / 1.2 Contributor（Meta 地理政策限地区）。

### 新模型查询与核实要求（每次更新文档前必做）

> **教训**：OpenCode Go/Zen 与 CommandCode 曾同一天各上架 5-8 款新模型，仅靠新闻检索会全部漏掉——**新模型必须走 API 清单 diff，不能只信页面**。
> **stealth 模型"来去无踪"**：如 Union Alpha 静默上架 Go/Zen（不进 docs 正文、无官方博客，只有官方 X 一句话），一周后从 Go 正文、营销页、Go/Zen 清单 API 与 OpenRouter endpoints 全部消失。**结论：stealth 模型的"上架"与"下架"都只能靠高频 API diff 捕捉，历史快照必须带抓取时间戳；榜单上出现而清单里查不到的 ID（如 `deepseek-v4p1-flash`、`morph-dsv4flash`）应单独标注"第三方/stealth 通道、官方未确认"。**

```bash
# ① 四平台权威清单（匿名 GET，无需 key）
curl -sL https://opencode.ai/inference/go/v1/models | jq -r '.data[].id' | sort   # Go 套餐 API（11-04 实测 28 ID / docs 正文 30 款）
curl -s https://opencode.ai/zen/v1/models     | jq -r '.data[].id' | sort   # Zen 清单（80 款 = 9 `-free` + big-pickle + 70 付费）
curl -s https://api.commandcode.ai/provider/v1/models | jq -r '.data[].id' | sort   # CommandCode 在线端点（11-04 实测 96；CLI 1.88.2 目录 94，差集 2 款网关独有）
curl -s https://openrouter.ai/api/v1/models   | jq -r '.data | sort_by(.created) | reverse | .[:15][] | [.created|todate, .id] | @tsv'   # OpenRouter 最近上架（10-21 目录 468 款）
curl -s https://openrouter.ai/api/v1/models/{slug}/endpoints   # 单模型逐渠道价；stealth 模型下架后 endpoints 返回空数组 []

# ② 与本文件既有清单逐一 diff：新增/下架/改名（如 meituan/LongCat-2.0:free 的 slug 直接揭晓厂商归属）
# ②b Command Code 目录（T+0，含上下文/推理档位/网关价/最低套餐）——npm 包 pi-commandcode-provider 滞后 CLI，必须直接取 CLI 包
cd /tmp && npm pack command-code@latest --silent && tar xzOf command-code-*.tgz package/dist/bundled/command-code-knowledge/reference/models.md > m.md   # 禁 tar xzf（包体 3.5MB，/tmp 配额不足）
tar xzOf command-code-*.tgz package/CHANGELOG.md > c.md ; npm view command-code version   # 记录版本号（11-04 = 1.88.2），须写进文档
# ③ 逐模型报价：https://openrouter.ai/api/v1/models/{slug}/endpoints（官方直供端点会消失，必须每次重抓不可沿用）
```

**核实规则**：
1. **created 时间戳仅 OpenRouter 可信**——Go/Zen/CommandCode 三家的 API 每日整表重打时间戳，不能用于判断上架时间；新品发布日期以厂商官网/官方博客/OpenRouter created 交叉确认。
2. **API 清单与文档正文会分叉**（Go API 返回 **28 ID** vs docs 正文 **30 款**，差集为 `mimo-v2.5` / `mimo-v2.5-pro` 只存在于正文、API 已不返；docs/zen 端点表只列部分 free 但 API 实测返回 **9 款 `-free` + big-pickle**）——文档必须同时记录两个口径并注明"以 API 清单为准、docs 表格为其子集"。
3. **请求数/额度**：Go 侧读 docs/go（SSR 可 `curl -sL`，9 张表完整可解析）；**GOAT 页 Caps 列（"+1" 展开器）是客户端渲染，curl 拿不到**，但**页面下方的「请求数」「月额度」两张表已渲染进 DOM**，可用 `agent-browser open https://commandcode.ai/docs/plans/goat` 后 `agent-browser eval "document.body.innerText"` 直接提取。全量单价与套餐可用性另见 `commandcode.ai/docs/resources/pricing-limits`（SSR 可 curl）。**推理档位以 CLI 包内 `models.md` 的 Efforts 列为准（T+0）**，未列档位即自动档；**禁止按同族模型外推档位**。
4. 新模型确认后需**同步更新五处**：本指南模型列表表、[OpenCode Go 定价与性价比测算](/model-intel/opencode-go-pricing-comparison/)（请求数+内部价+性价比三表）、GOAT 对比文档（逐模型两表+独占清单+胜负统计）、价格对比文档（OpenRouter/GOAT/Zen 节）、调用量排名（若已登榜）。
5. 厂商匿名模型（stealth/Unknown）以 OpenRouter slug 前缀为归属证据（如 inclusionai/ling→蚂蚁、poolside/laguna→Poolside、meituan/LongCat→美团）。
6. **额度口径每次必查"表述方式"本身是否变了**——官方现以"**月度美元上限 + 比例窗口**（5h=20%、周=50%、月=100%）"定义 Go 额度，**新档位窗口自动按比例生成**（如 $15 档 = $3/$7.5/$15）。GOAT 页同样按月度额度比例生成滚动窗口（GOAT $70 → $14/$35）。
7. **官方"下线/路由"计划会被撤销**——凡涉及"即将下线/即将迁移"的公告，下一次必须回查官方文档确认是否已反转（DeepSeek V4 Pro 的"9/14 下线路由"即被官方撤销，Go 侧额度行因此保持不变）。
8. **OpenRouter 价格必须读 `pricing.discount`**：该字段表示 `prompt`/`completion`/`input_cache_read` **已是折后实付价**（`0.895` = −89.5%），原价 = 折后价 ÷ (1 − discount)；**负值 = 溢价**。忽略此字段会把"折后价"当"目录价"比较，得出完全相反的结论。

## 模型选择原则

### 额度分层

| 额度 | 性价比 | 模型 | 使用策略 |
| :---: | :---: | :--- | :--- |
| **$80** | **8.0x** | **DeepSeek V4.1 Flash** | Go 侧现行最高档（Off-Peak / Peak 同额度） |
| $60 | 6.0–8.2x | Kimi K2.7 Code（8.2x）, GLM-5.2（6.5x）, MiniMax M3 / Qwen3.7 Plus / Hy3 / MiMo-V2.5 / MiMo-V2.6-Flash / **Muse Spark 1.2/1.3（Meta）** / LongCat-2.0 / **GLM-5.3-Flash（多模态）**（均 6.0x） | 主力使用；Muse Spark 注意数据条款；**MiMo-V2.5 官方已下线，改用 V2.6-Flash** |
| **$30** | 3.0x | **Qwen3.8 Flash, Hy4 preview, Gemini 4 Argon Contributor（限时 $60 = 6.0x）** | 可用 |
| $15 | 1.5–1.6x | GLM-5.3, GPT 6 Luna, GPT 5.6 Luna, Kimi K3, DS V4 Pro（**继续在役**）, MiMo-V2.5-Pro, MiMo-V2.6-Pro, Qwen3.8 Max, Grok 4.7, **Step 5 Preview（限时 $60 = 6.0x）、Claude Haiku 5.5** | 谨慎使用；**GLM-5.3 评分双高（59.51/59.10）可作疑难任务首选，Plus 下 8x** |
| **免费** | Unlimited | **LongCat 2.5 Preview Free、Beam Free、MiniMax M3.1 Flash Free（均限时；Beam 另限地区）** | 达额度后手动切换即可继续；Beam 留存 30 天 |

### 上下文优先级

| 场景 | 推荐上下文 | 适用模型 |
| :--- | :---: | :--- |
| 大型项目重构 | 1M | GLM-5.2/5.3/5.3-Flash, Kimi K3, MiMo-V2.5 / V2.6-Flash, DS V4 Pro / V4.1 Flash, MiniMax M3, GPT 5.6 Luna, GPT 6 Luna, Qwen3.8 Max, Hy4 preview, Qwen3.8 Flash |
| 日常开发 | 256K+ | Kimi K2.7 Code, Qwen3.7 Plus, Hy3, Step 5 Preview |
| 长程推理 | 1M | GLM-5.2, Kimi K3, DS V4 Pro |
| 截图/图像理解 | 1M | GLM-5.3-Flash（多模态，$60 档）或 MiniMax M3.1 Flash Free（限时） |

> **上下文口径**（已用 OpenRouter 厂商自营端点 `context_length` 与 Command Code CLI 官方目录裁定）：**GPT-6/5.6 Luna 1.05M**、**Qwen3.7 Plus 1M**、Muse Spark 1.2 Contributor 1M、Hy3 262K、**Claude Haiku 5.5 200K（Go 内部按 100K 分档计价）**。完整逐模型对比见 [OpenCode Go vs CommandCode GOAT](/model-intel/opencode-go-vs-commandcode-goat/)。

## Claude Code 模式映射

Claude Code 采用四层工作流：**Fable → Opus → Sonnet → Haiku**

### Fable（总规划）
职责：总规划 · 长任务执行 · 多 Agent 协调 · 架构设计
- **推荐：GLM-5.2**（1M，6.5x）
- 备选：Kimi K3（智能第一）· Step 5 Preview（限时 4x）
- GLM-5.2：1M 上下文 + 6.5x 性价比，是编排规划的最优选择。Kimi K2.7 Code：8.2x 最高性价比，256K 上下文适合多数场景。

### Opus（深度推理）
职责：深度推理 · 架构决策 · 疑难分析 · 高级 Debug
- **推荐：GLM-5.2**（1M，6.5x）
- 备选：**GLM-5.3（智能/Agentic 双高，$15 额度谨慎，Plus 8x）** · Kimi K3（智能第一）· Qwen3.8 Max（Agentic 第二）· DeepSeek V4 Pro（53.20）
- GLM-5.2：1M 上下文 + 评分均衡（52.64/45.7）+ 6.5x 性价比，最稳的主力。GLM-5.3：Agentic Go 内第一（59.10）、智能 59.51 仅次 Kimi K3，编码与网络安全专项旗舰，权重已于 2026-08-28 开源，$15 额度（220 次/5h）需谨慎，**但 Plus 下是唯一单位成本下降的模型（0.5x）**。Kimi K3：Go 内智能第一（59.70/54.26）。Qwen3.8 Max：Agentic 58.40 第二，1.5x 性价比。

### Sonnet（主力开发）
职责：主力开发 · 编写代码 · 修改代码 · 重构 · 测试
- **推荐：Kimi K2.7 Code**（256K，8.2x）
- 备选：MiniMax M3 · GLM-5.2
- Kimi K2.7 Code：8.2x 最高性价比，日常开发首选；智能/Agentic 非最高（43.02/30.3），复杂编码任务可换 GLM-5.2（52.64/45.7）。MiniMax M3：$60 额度中 Agentic 最高（36.1），适合多步工具调用任务。

### Haiku（快速辅助）
职责：搜索 · 总结 · 代码浏览 · 日志分析
- **推荐：MiMo-V2.6-Flash（6.0x，1.05M，150,400 次/月）**
- 备选：**GLM-5.3-Flash（6.0x，多模态，1M）** · Hy3（6.0x）· Claude Haiku 5.5（1.5x，≤100K 档 $0.10/$0.50）· Muse Spark 1.2/1.3（6.0x，注意 Meta 数据条款）· Step 5 Preview（限时 6.0x）
- 截图/图像理解用 GLM-5.3-Flash（多模态）或 MiniMax M3.1 Flash Free（限时）。**MiMo-V2.5 已于 2026-10-21 在小米官方下线，统一改用 MiMo-V2.6-Flash。**

### Claude Code 最终推荐

> **Fable** → GLM-5.2（1M，6.5x）｜**Opus** → GLM-5.2（1M，6.5x）｜**Sonnet** → Kimi K2.7 Code（256K，8.2x）｜**Haiku** → MiMo-V2.6-Flash（1.05M，6.0x）

## oh-my-opencode-slim Agent 模型配置

完整 Agent：Orchestrator · Oracle · Librarian · Explorer · Designer · Fixer · Council

### Orchestrator（编排者）
职责：总体规划 · Agent 调度 · 工作流控制 · 长链路执行
- **推荐：GLM-5.2** ｜ 备选：Kimi K3（智能第一）· Step 5 Preview（限时 4x）

### Oracle（神谕者）
职责：深度推理 · 架构分析 · 复杂问题决策 · 技术评审
- **推荐：GLM-5.2** ｜ 备选：**GLM-5.3（Agentic Go 内第一）** · Kimi K3（智能第一）· Qwen3.8 Max（Agentic 第二）· DeepSeek V4 Pro
- GLM-5.2 评分均衡（52.64/45.7）且性价比 6.5x。GLM-5.3：智能 59.51 + Agentic 59.10 双高，编码/安全专项旗舰，$15 额度（220 次/5h）内可作疑难任务首选。Kimi K3 智能 Go 内第一（59.70）。Qwen3.8 Max Agentic 58.40，1.5x 性价比。

### Librarian（图书管理员）
职责：文档检索 · MCP 查询 · API 查询 · 知识整理
- **推荐：MiMo-V2.6-Flash（6.0x，1.05M）** ｜ 备选：Hy3（6.0x）· GLM-5.3-Flash（1M 上下文）· Claude Haiku 5.5 · MiniMax M3

### Explorer（探索者）
职责：浏览项目 · 搜索代码 · 阅读日志 · 收集信息
- **推荐：MiMo-V2.6-Flash** ｜ 备选：Hy3 · GLM-5.3-Flash（1M 上下文）· MiniMax M3
- MiMo-V2.6-Flash：1.05M 上下文 + 6.0x 性价比 + 150,400 次/月，适合浏览大型项目。

### Designer（设计师）
职责：系统设计 · API 设计 · 数据结构设计 · 前端设计 · 架构草案
- **推荐：Kimi K2.7 Code** ｜ 备选：GLM-5.2 · MiniMax M3

### Fixer（修复者）
职责：编写代码 · 修复 Bug · 重构 · 编写测试
- **推荐：Kimi K2.7 Code** ｜ 备选：MiniMax M3 · GLM-5.3-Flash

### Council（评议会）
职责：多模型投票 · 架构评审 · 风险评估 · 决策仲裁

**质量优先**
> Kimi K3 ＋ GLM-5.2 ＋ Kimi K2.7 Code
> （Kimi K3 智能第一，覆盖最高质量决策；GLM-5.2 均衡主力；K2.7 Code 性价比开发。GLM-5.3 评分双高，可替换任一席位做 Agentic 侧重。）

**平衡模式**
> GLM-5.2 ＋ Kimi K2.7 Code ＋ MiniMax M3
> （全部 $60 额度模型，性价比最优。）

**省额度模式**
> MiMo-V2.6-Flash ＋ Hy3 ＋ GLM-5.3-Flash
> （全部 $60 额度 + 高请求数模型（同为 6.0x），MiMo 以 1.05M 上下文优先。）

### oh-my-opencode-slim 最终推荐

**质量优先**
> **Orchestrator** → GLM-5.2（1M，6.5x）｜**Oracle** → GLM-5.2（1M，6.5x）｜**Librarian** → MiMo-V2.6-Flash（1.05M，6.0x）｜**Explorer** → MiMo-V2.6-Flash（1.05M，6.0x）｜**Designer** → Kimi K2.7 Code（256K，8.2x）｜**Fixer** → Kimi K2.7 Code（256K，8.2x）
> **Council**：Kimi K3 ＋ GLM-5.2 ＋ Kimi K2.7 Code

**平衡模式**
> **Orchestrator** → GLM-5.2（1M，6.5x）｜**Oracle** → GLM-5.2（1M，6.5x）｜**Librarian** → MiMo-V2.6-Flash（1.05M，6.0x）｜**Explorer** → MiMo-V2.6-Flash（1.05M，6.0x）｜**Designer** → Kimi K2.7 Code（256K，8.2x）｜**Fixer** → Kimi K2.7 Code（256K，8.2x）
> **Council**：GLM-5.2 ＋ Kimi K2.7 Code ＋ MiniMax M3

## FreeBSD / Linux / Docker / Rust 推荐方案

适用于：FreeBSD 系统维护 · Linux 运维 · Docker · Kubernetes · Rust 开发 · Go 开发 · 网络设备配置 · 大型项目重构

**推荐：Claude Code**
> **Fable** → GLM-5.2（1M，6.5x）｜**Opus** → GLM-5.2（1M，6.5x）｜**Sonnet** → Kimi K2.7 Code（256K，8.2x）｜**Haiku** → MiMo-V2.6-Flash（1.05M，6.0x）

**oh-my-opencode-slim**
> **Orchestrator** → GLM-5.2（1M，6.5x）｜**Oracle** → GLM-5.2（1M，6.5x）｜**Librarian** → MiMo-V2.6-Flash（1.05M，6.0x）｜**Explorer** → MiMo-V2.6-Flash（1.05M，6.0x）｜**Designer** → Kimi K2.7 Code（256K，8.2x）｜**Fixer** → Kimi K2.7 Code（256K，8.2x）
> **Council**：Kimi K3 ＋ GLM-5.2 ＋ Kimi K2.7 Code

## 使用原则

- **70% 日常开发**：Kimi K2.7 Code（8.2x，$60 额度）；复杂任务切 GLM-5.2（6.5x）
- **15% 架构设计与推理**：GLM-5.2（6.5x，$60 额度，1M 上下文）；评分第一梯队（Kimi K3、GLM-5.3 等）留作关键决策
- **10% 搜索与日志分析**：**MiMo-V2.6-Flash（6.0x，1.05M）** / **GLM-5.3-Flash（6.0x，多模态，1M）** / Hy3（6.0x）/ Claude Haiku 5.5（1.5x，低价快速）；截图/图像类任务用 GLM-5.3-Flash
- **5% 疑难问题（谨慎使用）**：Kimi K3（智能最高）/ **GLM-5.3（Agentic 第一、编码/安全专项）** / DeepSeek V4 Pro（评分 53.20，$15）
  - $15 额度模型性价比 1.5–1.6x，仅在 GLM-5.2 / Kimi K2.7 Code 无法解决时使用。**GLM-5.3 智能 59.51 + Agentic 59.10 双高，疑难任务可优先于 Kimi K3 试（仅 220 次/5h）**。**DeepSeek 双雄注意错峰**：Go 内部价分峰谷，工作日高峰调用成本约为空闲 2 倍，尽量在 9:00 前 / 12:00-14:00 / 18:00 后使用；**周末全天按空闲价**。

## 最终结论

**Claude Code**
> **Fable** → GLM-5.2（1M，6.5x）｜**Opus** → GLM-5.2（1M，6.5x）｜**Sonnet** → Kimi K2.7 Code（256K，8.2x）｜**Haiku** → MiMo-V2.6-Flash（1.05M，6.0x）

**oh-my-opencode-slim**
> **Orchestrator** → GLM-5.2（1M，6.5x）｜**Oracle** → GLM-5.2（1M，6.5x）｜**Librarian** → MiMo-V2.6-Flash（1.05M，6.0x）｜**Explorer** → MiMo-V2.6-Flash（1.05M，6.0x）｜**Designer** → Kimi K2.7 Code（256K，8.2x）｜**Fixer** → Kimi K2.7 Code（256K，8.2x）
> **Council**：Kimi K3 ＋ GLM-5.2 ＋ Kimi K2.7 Code

## Command Code GOAT 套餐（竞品参考）

> 竞品逐模型对比详见 [OpenCode Go vs CommandCode GOAT](/model-intel/opencode-go-vs-commandcode-goat/)。以下为用 GOAT 跑 Claude Code / oh-my-opencode-slim 的速查。

### 套餐与额度

| 维度 | OpenCode Go | Command Code GOAT |
|---|---|---|
| 月费 | $10 | $10 |
| 每 5 小时限额 | **$12（= 月度上限 20%）** | $14 |
| 每周限额 | **$30（= 月度上限 50%）** | $35 |
| 每月限额 | **按模型分档 $15 / $20 / $30 / $60 / $100**（+ 2 款限时免费不限量） | **按模型分档 $10 ~ $100**（套餐级参考 $70） |
| 模型数 | **30 款正文**（套餐 API 实测 **28 个 ID**） | **GOAT 72 款**（All plans 98；**网关 API 96 端点**，CLI 1.88.2 目录 94 款，差集 2 款为网关独有的 `ling-3.1-flash-1019` / `crouton-alpha`；limits 页 All 102） |
| 免费模型 | 无内置（达限额后**不自动回落**，需手动切换 Zen `-free` 独立端点：**9 款 + Big Pickle**） | **在线 4 款**：`poolside/laguna-s-2.1-free`（while capacity lasts）、`stealth/glyph-cluster:free`（每日 100 请求上限）、**`stealth/crouton-alpha`**（while the stealth preview lasts）、**`reflection/beam:free`**（无每日上限，while capacity lasts） |
| 套餐档位 | **Go $10**（Go 生态内的 Teams $20·成员 / Plus $40 属升档选项，见 [OpenCode Go vs CommandCode GOAT](/model-intel/opencode-go-vs-commandcode-goat/) 第四节） | **Go $1（credits $10；5h $2 / 周 $5）/ GOAT $10（$70）/ Pro $20（$80）/ Provider $15 PAYG / Max 10× $100（$150）/ Max 20× $200（$300）/ Team Pro $40 / Enterprise $5,000+（无滚动窗口上限）** |
| 独占模型 | **无**（8 款仅套餐 API 返回但无 docs 行） | **GLM-5.3 FlashX**、**Qwen 3.8 Omni Flash**、GPT-5.6 Sol / Terra、Gemini 3.6/3.7/3.8 Flash、DS V4 Flash Fast / V4.1 Flash Fast、**Step 3.5 Flash / Step 3.7 Flash**、**GLM-5.2 Fast**、**Claude Haiku 4.5**、Inkling / Inkling Small、Fugu Ultra、Muse Wonder 1.0、**MiniMax M3.1 Flash**、**Ornith 1.5 122B**、**Jev**（TypeSafe 决策模型，32K、$0.042/$0.00、**仅 headless `cmd -p` 与 Provider API，不在 `/model`**）等（Go 未上架） |

### 两平台额度取向（谁更慷慨）

| 方向 | 模型 |
|---|---|
| **GOAT 更大方** | Hy3 / GLM-5.2（$70 vs $60）、**GLM-5.3-Flash（$80 vs Go $60）**、GPT-5.6 Sol / Gemini 3.7/3.8 Flash / **GLM-5.3 FlashX** / **Qwen 3.8 Omni Flash**（Go 未上架）、**DS V4 Flash Fast（$20）/ V4.1 Flash Fast（$60）**（Go 未上架） |
| **Go 更大方** | Muse Spark Contributor（$60 vs GOAT $20）、MiMo-V2.5（$60 vs $30）、Qwen3.7 Plus（$60 vs $33）、**Hy4 Preview（$30/1,350 次 vs GOAT $20/1,220 次）**、**Kimi K2.7 Code（$60 vs GOAT $60 持平，请求数 Go 更宽）** |
| **持平** | **DeepSeek V4.1 Flash**：GOAT **$80** / Go **$80**（两侧均为现行最高档） |
| **GOAT 更优（同模型）** | **LongCat 2.0**：GOAT $0.30/$1.20 计费，Go 为 $60 档 |

### GOAT 特色功能

- **思考强度调节**：内置 `/effort [level]` + 全局 `effort` / 逐模型 `reasoningEffort`（low→max，**按模型支持**；不支持时提示 "effort isn't supported for that model"）。
- **Provider API**：OpenAI `/v1/chat/completions` + Anthropic `/v1/messages` + **OpenAI Responses（自 CLI v1.55.0 起支持）**——**与 OpenCode Go 的 API 能力已完全对齐**。**除 Command Code Go 计划外全部计划有 API 访问**（Go 用 Key 调 Provider API 返回 403 `upgrade_required`；GOAT 用量计入套餐 credits；另有独立 Provider 套餐 $15/月 + $1.01 卡费 PAYG 无加价，Deals 自动应用）；模型命名 `provider/model-slug`（Claude 系无前缀，如 `claude-sonnet-5-5`）；流式 usage 自动回传无需 opt-in；错误码含 403 `upgrade_required` 与 422 `cmd_zdr_no_providers`。Anthropic 格式仅 Claude 系，**GOAT 内置款现含 Claude Sonnet 5.5**（$10 额度）与 **Claude Haiku 5.5**（$20 额度），Opus 5.5 / Fable 5.1 仍需 Max 档。**网关 Provider API 实测 96 个在线端点**；CLI 1.88.2 官方目录 94 款，**差集 2 款**（`inclusionai/ling-3.1-flash-1019`、`stealth/crouton-alpha` 已上线网关、CLI 目录尚未收录）；页面计数为 GOAT 页 GOAT plan 72 / All plans 98 / Deals 5 / Free 4，limits 页 All 102 / Free 6。
- **Deals（11-04，页头计数 Deals 5 / Free 4）**：
  - **免费 4 条**：`laguna-s-2.1-free`（while capacity lasts）、`glyph-cluster:free`（100/日，while the stealth preview lasts）、**`crouton-alpha-free`**（while the stealth preview lasts）、**`beam:free`**（无日限，while capacity lasts）。
  - **付费 1 条**：`minimax-m3` **2× usage（50% off）**。
  - ⚠️ **已退出清单**：**`minimax-m3.1-flash:free` 与 `ornith-1.5-122b:free` 限时免费已结束**（Ornith 免费截止 2026-10-21 23:00 PT），两款付费 slug 仍在；`mimo-v2.5` / `mimo-v2.5-pro` up to 99% off 已随网关下架退出；`mistral-large-4` 加成额度（through Oct 20th）已到期，GOAT 额度由 $40 回落 **$20**；`deepseek-v4.1-flash` 的 $100 促销（through Oct 21st）已到期，现行 **$80**；`kimi-k3` 额度加成（2026-10-07 到期）、`grok-4.7` 40% off、`GPT-6 Luna` 的 $0.10/$0.50 促销均已转常规目录价。
- **地理限制**：**GPT-5.6 Luna（OpenAI）与 Gemini 3.7 Flash（Google）在中国大陆不可用**（官方 Geo model limits 表）。
- **⚠️ 额度是"共享单池"**：低额度模型按比例消耗更多 credits，**不可把各模型额度简单相加**。滚动窗口按月度额度比例自动生成（GOAT $70 → 5h $14 / 周 $35）。
- **开源仍未兑现**（页面口径 delay "later this month"）。

### 用 GOAT 模型替代 Go 角色（Claude Code 四层）

| 层 | Go 方案 | GOAT 替代 |
|---|---|---|
| Fable（总规划） | GLM-5.2（$60） | **GPT-5.6 Sol**（$70，60.9）或 GLM-5.2（GOAT $70） |
| Opus（深度推理） | GLM-5.2 | **GPT-5.6 Sol** / Grok 4.6（$20） |
| Sonnet（主力开发） | Kimi K2.7 Code（$60） | **Kimi K2.7 Code**（GOAT $60）或 Qwen 3.8 27B（$70） |
| Haiku（快速辅助） | MiMo-V2.6-Flash（$60） | **DeepSeek V4 Flash**（GOAT $60）或 **GLM-5.3-Flash**（$40，多模态，AA 57.5）或 **DS V4 Flash Fast**（$20）/ **DS V4.1 Flash Fast**（$60）（Go 未上架） |

### oh-my-opencode-slim（GOAT 版速查）

> Orchestrator → GPT-5.6 Sol　｜　Oracle → GPT-5.6 Sol / Grok 4.6　｜　Librarian → DeepSeek V4 Flash　｜　Explorer → MiMo V2.6 Flash　｜　Designer → Kimi K2.7 Code　｜　Fixer → Kimi K2.7 Code　｜　Council → GPT-5.6 Sol + GLM-5.2 + Kimi K2.7 Code（省额度 → GLM-5.2 + MiMo V2.6 Flash + DeepSeek V4 Flash）

### 一句话建议

> 需要**国产模型大额度**（MiMo-V2.6-Flash / Muse Spark / Kimi K2.7 Code 等）留 Go；需要**新旗舰开放度 + 高额 DeepSeek / GLM-5.3-Flash** 或 **GOAT 的独占模型**选 GOAT；看重 7x 官方倍率可优先试 GOAT。

---

> **附注**：Go 使用限制为 **月度美元上限 + 比例窗口**（5h = 20%、周 = 50%、月 = 100%），按模型分档 $15 / $30 / $60 / $80，Plus 档放大 2x / 3x / 4x / 8x。调用量排名数据更新至 **2026-11-04**（完整榜见 [OpenCode 模型调用量排名](/model-intel/opencode-model-usage-ranking/)）；详细价格数据见 [OpenCode Go 定价与性价比测算](/model-intel/opencode-go-pricing-comparison/) 与 [国产大模型官方 API vs OpenRouter 价格对比](/model-intel/china-llm-api-vs-openrouter-pricing/)；行业动态见 [AI 大模型一周汇总](/model-intel/ai-weekly-roundup/)；竞品逐模型额度对比见 [OpenCode Go vs CommandCode GOAT](/model-intel/opencode-go-vs-commandcode-goat/)。
