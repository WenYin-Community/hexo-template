---
title: OpenCode Go 模型配置指南（2026-11-26 实测）
date: 2026-11-26
---

> Go 套餐 37 个模型 ID（31 文本 + 3 decision + 3 embedding）的清单口径、端点归属、倍率与配置推荐。数据抓取日 **2026-11-26**。

[← 返回「模型情报」合集](/model-intel/)

---

> 版本：**2026-11-26**（数据抓取日 2026-11-26）
> 适用：Claude Code · OpenCode Go · oh-my-opencode-slim · Linux · FreeBSD · Docker · Kubernetes · Rust · Go · Python · 网络设备运维
> ⚠️ 本版**只保留现行有效口径**。模型清单、额度与价格每次以官方清单 API diff 复核。

## OpenCode Go 模型列表

**数据来源**：OpenCode Go 官方文档（[opencode.ai/docs/go](https://opencode.ai/docs/go/)，**2026-11-26 抓取**）与 **Console Go 页 opencode.ai/console/go（公开页）**、清单 API `GET https://opencode.ai/inference/go/v1/models`、各厂商官方 API 定价。智能/Agentic = Artificial Analysis 智能指数 / Agentic 指数（AA 已移除编码指数，沿用 08-18 快照；另有 Command Code GOAT 页 "Intelligence" 单列，**与 AA 快照不同标度、不可混用**，见本节末）。
**清单口径（两源 + Console 交叉）**：清单 API **37 个 ID** = **31 款文本模型（27 付费 + 4 免费）+ 3 款 decision 模型 + 3 款 embedding 模型**。Console Go 页 Limits Tab 显示 **32 行**，其中 **31 行为现行文本模型、1 行为过期残留 `GLM-5.2`**（SSR HTML 未随水合移除，API 与 docs 均已无此 ID）——**以 API 37 个 ID 为准**。
**额度口径**：**付费模型共用一个额度池**，官方原话「The paid models you use on Go **share one allowance**」「**Switching models draws from the same allowance**」。窗口为 **5 小时 = 月度额度 20%**（**自首次使用起算 5 小时，非固定时钟**）、**每周 = 50%**（每周一 00:00 UTC 重置）、**每月 = 100%**（随付费周期重置）。
> ⚠️ **逐模型「Monthly limit」是换算分母，不是可累加的子额度**。官方举例：**在 $15 档模型上花掉 $1.50 = 用了 10% 月额度；在 $60 档模型上花掉 $6 同样 = 10%**。因此**绝不能把各模型额度相加**当总量。
> **Go 侧现行档位共 7 档（按模型分配，11-26 API 实测）**：**$10 / $15 / $20 / $30 / $60 / $100 / $200**。其中 **$10 仅用于 3 款 decision + 3 款 embedding**（官方原文：这些模型「come at list price, with no Go discount」，月额度等于月费：**Go $10 / Plus $40 / Teams $15**）；文本模型分 **$15 / $20 / $30 / $60 / $100 / $200** 六档。对应 5h / 周 / 月切分：$15 → $3 / $7.5 / $15；$20 → $4 / $10 / $20；$30 → $6 / $15 / $30；$60 → $12 / $30 / $60；$100 → $20 / $50 / $100；$200 → $40 / $100 / $200。
**订阅与免费模型**：Go 订阅管理已并入 OpenCode Zen 控制台；免费模型为 Zen 的独立 `-free` 端点（清单 API 于 **2026-11-26 实测 11 款 `-free` + Big Pickle**），**不自动回落、需手动切换模型 ID**。**Go / Go Plus 均限于单成员 workspace**（带 Go 订阅的 workspace 无法邀请成员）。
**限时免费（现行 4 款，均为 ∞ 额度）**：`beam-free`（**限地区 + 30 天留存**）、`hy4-flash-free`（ZDR ✅）、`hungerg-free`（**新收录**，ZDR ✅、不限地区）、`iceman-contributor-free`（**训练数据用于改进：是**）。
> ⚠️ **`longcat-2.5-free` 已转付费**：现行 ID 为 **`longcat-2.5`**（$0.30/$1.20、$60 档），且 **Hosted in China，需在 workspace privacy 中选择 Global regions**（Console 标注 Limited regions）。**旧 ID `longcat-2.5-free` 勿再使用**。
> ⚠️ **`glm-5.3` 现行月额度为 $200**：Plus $400、Teams $205，请求数 **2,640 / 5h**（13,200 / 月）。
> ⚠️ **`kimi-k3.1-pro` 额度已在 API 侧上调**：API `go.monthly_usage` = **$60 / $120 / $65**（原 $15 / $60），倍率由 4x 变为 **2x**；但 **Console 行仍显示 $15 / $60 与 147 / 588 次**，两者不自洽——**以 API 为准**，Console 请求数仅作参考。
> ⚠️ **`Gemini 4 Argon` 留存期已由 30 天改为 55 天**（docs Privacy 表原文 "retained for up to 55 days for abuse monitoring"）；**50% 折扣至 2026-11-30**，12-01 起 Input / Output / Cache read 翻倍为 $4 / $20 / $0.20。

> ⚠️ **docs/go 现行结构**：官方页保留 **5 张表**（套餐表、客户端 Session support、客户端 Status、字段说明、Model / Data retention），并新增 **Decision models / Embedding models 两节**；逐模型价目表、请求数表、端点表仍指向 **Console Go 页** `opencode.ai/console/go`（**公开页，无需登录**）。
> 🔑 **首选数据源 = 清单 API**：`GET https://opencode.ai/inference/go/v1/models` 单次返回 `cost.text.{input,output}.price`、`cost.text.input.cache.{read,write}`、**`go.monthly_usage.{go,go-plus,go-teams}`**、`go.zdr` / `go.training` / `go.limited_regions`、`limit.context` / `limit.output`、`capabilities.reasoning.effort`、`cost.multipliers`。**逐模型价目与额度一律以 API 为准**。
> 🔑 **官方正文明确的现行规则**：① **Token prices 为每 1M tokens，Go / Go Plus / Go Teams 三档完全相同**；② **5 小时窗口 = 月额度 20%**，**每周窗口 = 50%，每周一 00:00 UTC 重置**；③ **Go / Go Plus 仅覆盖订阅者本人与 workspace API keys**；④ **Go Teams $20/成员/月、2 成员起（最低 $40/月）**，第二个席位覆盖下一个加入的成员不再收费，期中加入者收 $20 并获全额月度额度，**服务账号不被覆盖**；⑤ 达限额后可切免费模型或开启 **Extra Usage** 走 Console credits；⑥ 响应头 `opencode.allowance` 回报本次请求计入的额度；⑦ **可用 workspace credit 支付 Go 订阅/续费/升级**；⑧ **Decision / embedding 请求无需 `x-opencode-session`**，任何客户端（RAG 库、memory provider、脚本）均可调用。

### Go 三档订阅结构（Go $10 / Go Teams $20·成员 / Go Plus $40）

官方三档订阅结构（**Token 单价完全相同，仅月度额度与成员数不同**）：

| 计划 | 月费 | 官方定位 | 模型清单 |
|---|---|---|---|
| **Go** | **$10** | Lower-cost access to the models below | 同一份清单（31 款文本 + 6 款 decision/embedding） |
| **Go Plus** | **$40** | **Higher usage limits** across the models below | 同上 |
| **Go Teams** | **$20 / 成员 / 月** | **Every member gets their own limits, $5/month higher than Go on every model** | 同上 |

> 🔑 **关键口径：三档的 Token 单价完全相同**（官方原话「Token pricing is the same for Go and Go Plus」）——**Plus / Teams 买的不是更便宜的单价，而是更高的额度上限**。
> 🔑 **Go Teams（$20/成员/月）**：**逐模型额度 = Go 档 + $5**（如 DeepSeek V4.1 Flash $100 → $105、GLM-5.3-Flash $60 → $65、Kimi K3 $15 → $20），**每成员独立计额**。
> **额度结构沿用比例窗口**：5 小时 = 月度上限 20%、每周 = 50%、每月 = 100%。
> **工作区限制**：Only one member per workspace can subscribe to OpenCode Go or Go Plus。

**逐模型额度倍率（Plus ÷ Go）**——11-26 API 实测，27 款付费文本模型分 **2x / 3x / 4x** 三档，4 款免费不分档：

| 倍率 | 款数 | 模型 | Go → Plus → Teams 月额度 |
|---|---|---|---|
| **4x** | **16** | `deepseek-v4-pro`、`grok-4.7`、`gpt-5.6-luna`、`gpt-6-luna`、`claude-haiku-5-5`、`kimi-k3`、`mimo-v2.6-pro`、`step-5-preview`、`qwen3.8-max`、`qwen4-max`（均 $15→$60）、`minimax-m3.1-flash`（$20→$80）、`hy4-preview`、`gemini-4-argon`（$30→$120）、`hy3`、`hy4`、`longcat-2.5`（$60→$240） | 与 Go 同倍率放大 |
| **3x** | **5** | `glm-5.3-flash`、`kimi-k2.7-code`、`minimax-m3`、`qwen3.7-plus`（$60→$180）、`qwen3.8-flash`（$30→$90） | 贵 33% |
| **2x** | **6** | `glm-5.3`（$200→$400）、`deepseek-v4.1-flash`（$100→$200）、`kimi-k3.1-pro`（$60→$120）、`mimo-v2.6-flash`、`muse-spark-1.2-contributor`、`muse-spark-1.3-contributor`（$60→$120） | 贵 100% |
| 免费 | 4 | `beam-free`、`hy4-flash-free`、`hungerg-free`、`iceman-contributor-free` | ∞ → ∞ |

> ⚠️ **算账结论（Plus $40 vs Go $10，价格 4 倍）**：
> - **上限就是 4x，没有任何文本模型超过 4x**——**Plus 最好只能做到"单位成本持平"**。**4x 的 16 款 = 持平**，**3x 的 5 款贵约 33%**，**2x 的 6 款贵 100%**。
> - **Plus 的真正卖点是额度天花板，不是单价**：加价的本质是"4 倍钱换 2–4 倍额度"，用于大项目/长会话防撞墙。
>
> **算账结论（Teams $20·成员 vs Go $10，价格 2 倍）**：
> - **Teams 单位价值恒为 0.51x–0.67x**（额度只比 Go 高 $5 固定值）：$15 档 → 0.67x；$20 档 → 0.63x；$30 档 → 0.58x；$60 档 → 0.54x；$100 档 → 0.53x；$200 档 → 0.51x。
> - **单看额度，Teams 一定不如"每人各买一份 Go"**（后者 2 人 = $20 得 2×Go 额度，前者 2 人 = $40 得 2×(Go+$5)）。**Teams 的价值只在"一张账单 + 统一隐私/区域管控 + 每成员独立额度"的运维诉求**。
>
> **P0 选型建议**：① 单人主力 → **Go $10**，不要升 Plus（无模型能低于 4x）；② 团队需要统一账单/隐私策略 → **Teams $20·成员**；③ 需要"长时间专注编码不撞墙"的大项目 → **Plus $40**，优先用 4x 档模型；④ **不要为了"更便宜"买 Plus**。

### Go 逐模型价目与额度（37 款全表，11-26 API 实测）

> 全部字段取自 `GET https://opencode.ai/inference/go/v1/models` 的 `cost` / `go` / `limit` 节点。**Token 单价三档完全相同**，故只列一列；**Plus / Teams 的月额度见上表「逐模型额度倍率」**。

| 模型 ID | Input /1M | Output /1M | Cache read | Cache write | Go 月额度 | 5h 请求 | 上下文 | 输出上限 | ZDR |
|---|---|---|---|---|---|---|---|---|---|
| `beam-free` | Free | Free | Free | — | **∞** | ∞ | 1,048,576 | 131,072 | — |
| `hy4-flash-free` | Free | Free | Free | — | **∞** | ∞ | 1,048,576 | 65,536 | ✅ |
| `hungerg-free` | Free | Free | Free | — | **∞** | ∞ | 1,000,000 | 65,536 | ✅ |
| `iceman-contributor-free` | Free | Free | Free | — | **∞** | ∞ | 262,144 | 131,072 | 🔺训练 |
| `glm-5.3` | $1.4 | $4.4 | $0.26 | — | **$200** | 2,640 | 1,000,000 | 131,072 | ✅ |
| `deepseek-v4.1-flash` | $0.15 | $0.6 | $0.003 | — | **$100** ⏫峰谷 | 43,300 | 1,000,000 | 384,000 | ✅ |
| `muse-spark-1.2-contributor` | $0.1 | $0.2 | $0.002 | — | **$60** | 45,300 | 1,048,576 | 131,072 | 🔺训练 |
| `muse-spark-1.3-contributor` | $0.1 | $0.2 | $0.002 | — | **$60** | 45,300 | 1,048,576 | 131,072 | 🔺训练 |
| `mimo-v2.6-flash` | $0.14 | $0.28 | $0.0028 | — | **$60** | 30,100 | 1,048,576 | 131,072 | ✅ |
| `longcat-2.5` | $0.3 | $1.2 | $0.006 | $0 | **$60** | 11,400 | 1,000,000 | 262,144 | ✅ |
| `glm-5.3-flash` | $0.15 | $0.5 | $0.03 | — | **$60** | 6,320 | 1,000,000 | 131,072 | ✅ |
| `minimax-m3` | $0.3 | $1.2 | $0.06 | — | **$60** | 3,210 | 1,000,000 | 131,072 | ✅ |
| `qwen3.7-plus` | $0.4 | $1.6 | $0.04 | $0.5 | **$60** | 4,310 | 1,000,000 | 65,536 | ✅ |
| `kimi-k2.7-code` | $0.95 | $4 | $0.19 | — | **$60** | 994 | 262,144 | 262,144 | ✅ |
| `hy3` | $0.14 | $0.58 | $0.035 | — | **$60** | 4,300 | 256,000 | 128,000 | ✅ |
| `hy4` | $0.834 | $2.501 | $0.042 | — | **$60** | 2,710 | 1,048,576 | 65,536 | ✅ |
| `kimi-k3.1-pro` | $2 | $10 | $0.2 | $2 | **$60** | 147 ⚠️ | 1,048,576 | 1,048,576 | ✅ |
| `gemini-4-argon` | $2 | $10 | $0.1 | — | **$30** ⏫ | 566 | 1,048,576 | 65,536 | — |
| `hy4-preview` | $0.834 | $2.501 | $0.042 | — | **$30** | 1,350 | 1,048,576 | 65,536 | ✅ |
| `qwen3.8-flash` | $0.15 | $0.47 | $0.016 | $0.2 | **$30** | 5,400 | 1,000,000 | 131,072 | ✅ |
| `minimax-m3.1-flash` | $0.15 | $0.6 | $0.015 | — | **$20** | 3,880 | 1,000,000 | 512,000 | ✅ |
| `gpt-5.6-luna` | $0.2 | $1.2 | $0.02 | 30m $0.25 / 12h $0.5 | **$15** | 2,050 | 1,050,000 | 128,000 | — |
| `gpt-6-luna` | $0.1 | $0.5 | $0.01 | 30m $0.125 / 12h $0.25 | **$15** | 4,230 | 1,050,000 | 128,000 | — |
| `kimi-k3` | $3 | $15 | $0.3 | $3 | **$15** | 98 | 1,048,576 | 1,048,576 | ✅ |
| `mimo-v2.6-pro` | $0.435 | $0.87 | $0.003625 | — | **$15** | 3,260 | 1,048,576 | 131,072 | ✅ |
| `deepseek-v4-pro` | $0.66 | $1.98 | $0.022 | — | **$15** ⏫峰谷 | 1,040 | 1,000,000 | 384,000 | ✅ |
| `claude-haiku-5-5` | $0.1 | $0.5 | $0.01 | $0.125 | **$15** | 3,850 | 1,000,000 | 128,000 | — |
| `step-5-preview` | $1 | $2.7 | $0.1 | — | **$15** | 426 | 1,000,000 | 65,536 | ✅ |
| `qwen3.8-max` | $2 | $6 | $0.25 | $2.5 | **$15** | 162 | 1,000,000 | 131,072 | ✅ |
| `qwen4-max` | $1.5 | $4.5 | $0.075 | 5m $1.875 / 1h $3 | **$15** | 463 | 1,000,000 | 262,144 | ✅ |
| `grok-4.7` | $2 | $6 | $0.5 | — | **$15** | 169 | 500,000 | 500,000 | — |
| `jev-1.14` | $0.042 | Free | — | — | **$10** | — | 64,000 | — | ✅ |
| `gemini-decision-1` | $0.1 | Free | — | — | **$10** | — | 262,144 | — | — |
| `gpt-6-luna-decision` | $0.1 / $0.2（>272K） | Free | $0.01 / $0.02 | $0.125 / $0.25 | **$10** | — | 1,050,000 | 128,000 | — |
| `text-embedding-3-small` | $0.02 | — | — | — | **$10** | — | 8,192 | — | — |
| `qwen3-embedding-8b` | $0.01 | — | — | — | **$10** | — | 32,768 | — | — |
| `gemini-embedding-2` | $0.2 | — | — | — | **$10** | — | 8,192 | 3,072 dim | — |

> **标记说明**：**⏫峰谷** = 工作日 **01:00–04:00 与 06:00–10:00 UTC** 单价 **×2**（`deepseek-v4-pro`、`deepseek-v4.1-flash`）；**⏫** = `gemini-4-argon` 自 **2026-12-01** 起 **×2**（50% 折扣到期）。**⚠️ `kimi-k3.1-pro` 的 147 次为 Console 旧估算**，API 月额度已升 $60，请求数未同步。
> **ZDR**：✅ = `go.zdr=true`（零数据留存）；**🔺训练** = `go.training=true`（**请求数据用于改进**，仅 `muse-spark-1.2/1.3-contributor` 与 `iceman-contributor-free` 三款）。
> **Cache write 分档**：`gpt-5.6-luna` / `gpt-6-luna` 按缓存存活期计价（**30 分钟档更便宜，12 小时档翻倍**）；`qwen4-max` 按 **5 分钟 $1.875 / 1 小时 $3**；`longcat-2.5` 写入为 **$0**。
> **Decision / embedding 额度**：官方明示「come at list price, with no Go discount」，其月额度**等于月费**——**Go $10 / Plus $40 / Teams $15**；与文本模型的 5h/周/月比例窗口**同池计算**。
> **上下文与输出**：最长上下文 `gpt-5.6/6-luna` **1,050,000**；最长输出 `kimi-k3` / `kimi-k3.1-pro` **1,048,576**；最短上下文 `text-embedding-3-small` / `gemini-embedding-2` **8,192**（embedding 模型）与 `jev-1.14` **64,000**（decision 模型）。

### 高级推理模型

| 模型 | 定位 | 智能/Agentic | 上下文 | 月额度 | 性价比 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| GLM-5.3 | 编码+网络安全旗舰（743B，CyberGym 领先）；$200 为促销结束后的现行档 | **59.51/59.10**¹ | 1M | **$200**（Plus $400，2x） | **20.0x**（Plus 10.0x） |
| **GLM-5.3-Flash** | **多模态 + 1M + $60 档，智能 57.5**；`glm-5.2` 退出后的主力替代位 | **57.5**³ | 1M | $60 | **6.0x**（Plus 4.5x / 3x） |
| **Kimi K3.1 Pro** | **K3 升级档（单价 $2/$10，低于 K3 的 $3/$15）**；API 月额度已升至 $60 | AA 未收录 | 1M | **$60**（Plus $120，2x） | **6.0x**（Plus 3.0x） |
| Hy3 | 通用推理旗舰（腾讯 295B） | 42.0/31.4 | 256K | $60 | **6.0x** |
| Kimi K3 | 旗舰推理（智能第一，**但仅 490 次/月**） | **59.70/54.26** | 1M | $15 | 1.5x |
| DeepSeek V4 Pro（官方 `DeepSeek-V4-Pro-0813`） | 深度推理（**继续在役，无下线时间表**） | 53.20/49.56 | 1M | $15 | 1.5x |
| MiMo-V2.6-Pro | **MiMo 最新旗舰（2026-09-21 上线）**；1.05M 上下文、多模态 Agentic 编码 | AA 未收录 | 1.05M | $15 | 1.5x |
| GPT 5.6 Luna | OpenAI 低成本旗舰 | 52.32/46.90 | 1.05M | $15 | 1.5x |
| **GPT 6 Luna** | **OpenAI 最新低成本档（2026-09-22 发布）**；$0.10/$0.50/$0.01（Go 内最低单价） | AA 未收录 | 1.05M | $15 | **1.5x**（单价极低） |
| Qwen3.8 Max | 阿里旗舰（Agentic 第二） | 58.08/58.40 | 1M | $15 | 1.5x |
| **Qwen4 Max** | 阿里新一代旗舰；**缓存写分档（5m $1.875 / 1h $3）** | AA 未收录 | 1M | $15 | 1.5x |
| Grok 4.7 | **xAI 旗舰（2026-09-21 发布，Go 内唯一 Grok）**；500K | AA 未收录 | 500K | $15 | 1.5x |
| Hy4 preview | 腾讯旗舰（770B 总参 / 49B 激活、MoE） | AA 未收录 | 1M | $30 | **3.0x** |
| DeepSeek V4.1 Flash（官方 `DeepSeek-V4.1-Flash-1017`） | **DeepSeek 主力旗舰**；官方称成本/速度/性能全面超 V4 Pro；**月额度 $100，Go 侧文本最高档** | AA 未收录 | 1M | **$100**（Plus $200，2x） | **10.0x**（Plus 5.0x） |

¹ GLM-5.3 AA 08-18 快照：智能 59.51（Go 内第二，仅次 Kimi K3）、**Agentic 59.10（Go 内最高）**；**权重已于 2026-08-28 开源**（MIT）。³ GLM-5.3-Flash 的 AA 智能值由 Command Code GOAT 页披露，**异口径、不可与 AA 数值混比**。

> ⚠️ **智谱已上线 GLM-5.4，但不在 Go / Zen / CommandCode**：官方文档列为「旗舰模型」，1M 上下文 / 128K 输出，**仅向 GLM Coding Plan 全量用户开放，模型 API 待安全评估后开放**。当前 Go 侧 GLM 最高档仍为 `glm-5.3`。
> ⚠️ **Kimi K2 系列将于 2026 年 12 月底下线**（Kimi 官方定价页）；Go 侧 `kimi-k2.7-code` 属 K2 系列，**长期配置应规划迁移到 `kimi-k3` / `kimi-k3.1-pro`**。

### Coding 模型

| 模型 | 定位 | 智能/Agentic | 上下文 | 月额度 | 性价比 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| Kimi K3.1 Pro | **编码 Agent 升级档**（$2/$10，1M 上下文） | AA 未收录 | 1M | **$60** | **6.0x** |
| Kimi K2.7 Code | 最佳 Coding Agent（$60 档智能第二） | 43.02/30.3 | 256K | $60 | **6.0x** |
| MiniMax M3 | 综合开发（$60 档 Agentic 最高） | 45.40/36.1 | 1M | $60 | **6.0x** |
| Qwen3.7 Plus | 综合开发 | 39.4/20.7 | 1M | $60 | **6.0x** |
| LongCat 2.5 | **美团新一代（2026-09-25 发布）**；1.6T 总参 / 约 48B 激活、1M、262K 输出、图片理解 | AA 未收录 | 1M | $60 | **6.0x** |

### 快速辅助模型

| 模型 | 定位 | 智能/Agentic | 上下文 | 月额度 | 性价比 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| GLM-5.3-Flash | 高性价比多模态视觉辅助（320B/18B、MIT 开源，6,320 次/5h）；**Go 侧 $60，CommandCode GOAT 侧 $100** | 57.5⁹ | 1M | **$60**（Plus **$180**，3x） | **6.0x** |
| Muse Spark 1.2 Contributor | 高请求量辅助（45,300 次/5h，**Meta 模型，数据训练条款**） | 56.8⁴ | 1M | $60 | **6.0x**⁴ |
| Muse Spark 1.3 Contributor | 与 1.2 同请求数/同价；Not ZDR、数据训练、限区域 | AA 未收录 | 1M | $60 | **6.0x** |
| MiMo-V2.6-Flash | **MiMo 轻量档（2026-09-21 上线）**；1.05M、30,100 次/5h（Go 内请求数第三） | AA 未收录 | 1.05M | $60 | **6.0x** |
| DeepSeek V4.1 Flash | DeepSeek 主力旗舰；**月额度 $100，Go 侧文本最高档** | AA 未收录 | 1M | **$100**（Plus **$200**，2x） | **10.0x**（Plus 5.0x） |
| LongCat 2.0 | 高请求量通用辅助（11,400 次/5h） | AA 未收录 | 1.05M | $60（Plus $240，4x） | **6.0x** |
| **`hungerg-free`** | **新收录限时免费档**；1M 上下文、ZDR ✅、不限地区、不训练 | AA 未收录 | 1M | **免费（Unlimited）** | 免费 |
| **`beam-free`** | **Reflection 模型（`reflection/beam`）**；限时免费、**限地区（中国含港澳不可用）**、30 天留存 | AA 未收录 | 1.05M | **免费（限时、限地区）** | 免费 |
| **`hy4-flash-free`** | 腾讯 Hy4 轻量免费档；1.05M、ZDR ✅ | AA 未收录 | 1.05M | **免费（Unlimited）** | 免费 |
| **`iceman-contributor-free`** | Contributor 档；262,144 上下文；**训练数据用于改进：是** | AA 未收录 | 256K | **免费（Unlimited）** | 免费 |
| **`minimax-m3.1-flash`** | MiniMax 轻量档；1M、512K 输出、多模态编码、可调思考深度 | AA 未收录 | 1M | **$20**（Plus $80，4x） | **2.0x** |
| Qwen3.8 Flash | 阿里高性价比辅助（千亿总参/6B 激活，5,400 次/5h） | AA 未收录 | 1M | $30 | **3.0x** |
| **Step 5 Preview** | **StepFun 预览档**；$1.00/$2.70/$0.10；426 次/5h | AA 未收录 | 1M | **$15** | 1.5x |
| **Claude Haiku 5.5** | **Anthropic 低成本档**；≤100K $0.10/$0.50/$0.01（缓存写 $0.125），>100K $0.50/$2.50/$0.05；留存 30 天 | AA 未收录 | 1M | **$15**（Plus $60，4x） | 1.5x |
| **Gemini 4 Argon** | **Google 旗舰**；Go 内部 $2/$10/$0.10；**12-01 起翻倍为 $4/$20/$0.20**；留存 55 天 | AA 未收录 | 1,048,576 | **$30**（Plus $120，4x） | 3.0x（12-01 后 1.5x） |

⁴ Muse Spark 典型 token 组成 620/71,400/300，测算 6.0x；官方注明以"提示词/补全训练 Meta 模型"换折扣、限部分地区，**敏感项目慎用**。⁹ AA 智能 57.5（来源为 Command Code GOAT 页，Go 官方文档未收录）。

> **计算口径说明**：官方已直接给出月度美元额度，故「性价比 ≡ 月额度 ÷ $10」，无需用典型 token 反推。`step-5-preview` / `claude-haiku-5-5` / `gemini-4-argon` / `kimi-k3.1-pro` / `qwen4-max` / `hy4` / `minimax-m3.1-flash` 的官方未公布典型 token 口径，单次成本按 `月额度 ÷ 月请求数` 反推。**`kimi-k3.1-pro` 因 Console 请求数未随 API 额度更新，本轮不参与「请求数 × 单次成本 = 月额度」自洽校验**。

### 模型评分参照（Artificial Analysis，08-18 快照）

智能指数 / Agentic 指数，artificialanalysis.ai 独立评测（AA 已移除编码指数）。参照：Claude Opus 5 = 63.05/59.17，Claude Fable 5 = 62.07/56.59，Claude Sonnet 5 ≈ 55/49.7。

| 模型 | 智能 | Agentic | 性价比 | 评分定位 |
| :--- | :---: | :---: | :---: | :--- |
| Kimi K3 | **59.70** | 54.26 | 1.5x | Go 内智能第一（**仅 490 次/月**） |
| GLM-5.3 | 59.51 | **59.10** | **20.0x** | Agentic Go 内最高；$200 档仍为性价比第一 |
| Qwen3.8 Max | 58.08 | 58.40 | 1.5x | Agentic 第二 |
| GLM-5.3-Flash | **57.5** | — | **6.0x** | `glm-5.2` 退出后的主力替代位（多模态 + 1M） |
| DeepSeek V4 Pro（0813） | 53.20 | 49.56 | 1.5x | 深度推理 |
| GPT 5.6 Luna | 52.32 | 46.90 | 1.5x | 第一梯队（$15） |
| MiniMax M3 | 45.40 | 36.1 | **6.0x** | $60 中 Agentic 中上 |
| Kimi K2.7 Code | 43.02 | 30.3 | **6.0x** | $60 档智能第二（256K） |
| Hy3 | 42.0 | 31.4 | **6.0x** | 通用推理 |
| Qwen3.7 Plus | 39.4 | 20.7 | **6.0x** | 中下 |
| Muse Spark 1.2/1.3、Hy4 / Hy4 preview、LongCat 2.5、Qwen3.8 Flash、`minimax-m3.1-flash`、DS V4.1 Flash、Grok 4.7、MiMo-V2.6-Flash/Pro、Step 5 Preview、Claude Haiku 5.5、Gemini 4 Argon、Kimi K3.1 Pro、Qwen4 Max、4 款免费、3 款 decision、3 款 embedding | — | — | 6.0 / 6.0 & 3.0 / 6.0 / 3.0 / 2.0 / **10.0** / 1.5 / **6.0 & 1.5** / 1.5 / 1.5 / 3.0 / 1.5 / **6.0** / 1.5 / 免费 / $10 档 | AA 未收录 |

> **场外参考**：**Gemini 3.7 Flash**（未入 Go）AA 收录 56.03/45.10。同款模型 AA 智能分（Command Code GOAT 页披露）：GPT-5.6 Sol 60.9、Muse Spark 1.2（含 Contributor）56.8、Qwen 3.8 27B 52.0、Nemotron 3 Ultra 38.3、Kimi K2.5 36.0、GLM-5 40.6。

### Command Code GOAT 页 "Intelligence" 列（独立标度）

> ⚠️ **口径隔离声明**：下表数值取自 commandcode.ai/docs/plans/goat 模型表的 **Intelligence** 列（11-26 抓取），**与上文 Artificial Analysis 08-18 快照不是同一标度**——同款模型两处数值系统性偏低（如 GLM-5.3：AA 59.51 / GOAT 页 44.8；Kimi K3：AA 59.70 / GOAT 页 43.6）。**禁止把两列混排、禁止用一方补另一方的空值**；本页列仅用于**横向排序参考**与"AA 未收录模型的唯一可得评分"。`not yet scored` 为页面原文。

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

> **`not yet scored`（页面对以下款未给分）**：Beam 1.0、MiniMax M3.1 Flash、Ornith 1.5 122B、Muse Spark Open、Jev 1.14.0 / Jev、Nemotron 3.5 Super VL、Glyph Cluster、Qwen 3.8 Max Prime、GLM-5.3 FlashX、Qwen 3.8 Omni Flash、Qwen 3.8 Flash、MiMo V2.6 Pro UltraSpeed、Tencent Hy4 Preview、GLM-5.2 Fast、Kimi K2.7 Code HighSpeed、Qwen 3.7 Flash、DeepSeek V4 Flash Fast、DeepSeek V4.1 Flash Fast、Muse Spark 1.3/1.2 Contributor、Laguna S 2.1、Inkling 2 Mini、Muse Ember。
> 🔑 **用途**：这批数值是 **AA 未收录新模型（Grok 4.7、MiMo V2.6 Pro、Qwen 3.8 Max 0902、Step 5 Preview、Claude Haiku 5.5、DeepSeek V4.1 Flash）目前唯一的第三方排序信号**，可用于"新模型梯队估计"，但**不得写入性价比或选型结论作为定量依据**。

## 模型调用量排名（2026-11-26 快照）

> 数据来源：**OpenCode Data（[opencode.ai/data](https://opencode.ai/data)）**，页面顶部更新 **11月26日, UTC 03:12（GMT+8 11:12）**，OpenCode 全量用户。**本节只保留摘要；完整周榜 / 日榜 / 前 5 国家每日份额 / 作者份额统计见 [OpenCode 模型调用量排名](/model-intel/opencode-model-usage-ranking/)。**

**周榜 Top 5（滚动 7 日，截至 2026-11-26）**

| 排名 | 模型 | 厂商 | Token 调用量 | 周环比（页面口径） |
| :--: | :--- | :--- | :----------: | :----: |
| 1 | **deepseek-v4.1-flash** | DeepSeek | **156T** | **-17%** |
| 2 | **hy4-flash** | Tencent | **56T** | **+198%** |
| 3 | beam-1.0-501b-a23b | Reflection | 4.5T | -19% |
| 4 | muse-spark-1.3-contributor | Meta | 4.1T | -21% |
| 5 | **glm-5.3** | Zhipu | 4.1T | **+76%** |

> 完整周榜 / 日榜、地理分布与作者份额见 [OpenCode 模型调用量排名](/model-intel/opencode-model-usage-ranking/)。

**要点**：
- **`deepseek-v4.1-flash` 以 156T 居首、周环比 -17%**；作者份额当日 **63.9%**。
- **`hy4-flash` 56T（+198%）居第 2**，Tencent 作者份额 **22.6%**；`hungerg` 新上榜第 7（2.9T），对应 Go 新免费档。
- **`glm-5.3` +76% 至第 5**，与 Go 侧额度回落 $200 同期；`glm-5.3-flash` -57% 退至第 6。
- **`minimax-m3.1-flash` 368B（-91%）**——免费端点下架后量级持续塌缩；**MiniMax 当日作者份额仅 0.1%**。
- **日榜（NOV 25）**：`deepseek-v4.1-flash` **27T** 居首，`hy4-flash` 10T、`hungerg` 1.5T。
- **国家份额（前 5，NOV 26）**：中国 **20%（319T）**、美国 11%（181T）、印度 5%（77T）、德国 4%（68T）、巴西 4%（65T）。
- **全站缓存比例 96%**：已缓存 54T、未缓存 2.1T。

### OpenCode Zen 网关与免费模型

**Zen**（[opencode.ai/zen](https://opencode.ai/zen)）是 OpenCode 按量付费精选模型网关：$20 起充（余额低于 $5 自动充 $20）、按请求付费**零加价**、可设月度限额、美区托管；信用卡手续费按成本转嫁（**4.4% + $0.30/笔**）。**Go 订阅管理已并入 Zen 控制台**。**免费模型是 Zen 的独立 `-free` 端点，不会从 Go 自动回落**——Zen 下模型 ID 为 `opencode/<model-id>`（如 `opencode/mimo-v2.6-flash-free`），与 Go 的 `opencode-go/<model-id>` **名称不同**，达限额后需手动切换模型 ID。
**清单规模**：`/zen/v1/models` 于 **2026-11-26 实测 108 款 = 11 款 `-free` + Big Pickle + 96 付费**，**以 API 清单为准**：

| 免费模型（模型 ID） | 说明 |
|---|---|
| **`seaglass-alpha-free`** | **新收录（stealth）**，上限与身世未公布 |
| **`beam-free`** | Reflection 模型免费端点；**限时 + 限地区（中国含港澳不可用）**、30 天留存 |
| **`deepseek-v4.1-flash-free`** | V4.1 Flash 免费端点 |
| **`flint-40b-free`** | 对应 OpenRouter `recursive/flint-v1.0:free`，262K |
| **`hy4-flash-free`** | 腾讯 Hy4 轻量免费档，1.05M、ZDR ✅ |
| **`iceman-free`** | Contributor 免费档，**训练数据用于改进** |
| **`jev-1.13-free`** | TypeSafe AI System One 决策模型免费端点（`/v1/systemone`） |
| **`longcat-2.5-free`** | 美团新一代；1.6T/约 48B 激活、1M、原生多模态 |
| **`mimo-v2.6-flash-free`** | 小米 MiMo 轻量档免费端点（免费期收集数据改进模型） |
| **`nemotron-3.5-lightning-free`** | NVIDIA 免费试用端点，**请勿提交机密数据**（会记录） |
| **`nemotron-3.5-super-vl-free`** | NVIDIA 多模态免费端点 |
| Big Pickle（`big-pickle`） | **隐身（stealth）模型**，限时免费（免费期收集数据；身世未揭晓） |

> ⚠️ **Zen `-free` 独立端点现行共 11 款**（另有 Big Pickle 非 `-free` 命名）：`beam-free`、`deepseek-v4.1-flash-free`、`flint-40b-free`、`hy4-flash-free`、`iceman-free`、`jev-1.13-free`、`longcat-2.5-free`、`mimo-v2.6-flash-free`、`nemotron-3.5-lightning-free`、`nemotron-3.5-super-vl-free`、`seaglass-alpha-free`。**已下架/转付费（勿写进配置）**：`tidepool-alpha-free`、`glm-5.3-flash-free`、`minimax-m3.1-flash-free`、`crouton-alpha-free`、`pulse-alpha-free`、`space-bunny-free`、`cat-jam-free`、`muse-spark-1.2/1.3-contributor-free`、`mimo-v2.5-free`、`ling-3.0-flash-fin-free`、`ling-3.1-flash-free`、`fledge-alpha-free`、`nemotron-3-ultra-free`、`deepseek-v4-flash-free`、`longcat-2.5-preview-free`。**以 API 清单为准**。

> **付费区**含闭源旗舰：**GPT-6 Astra**（$10/$50，≤272K；>272K 为 $20/$75）、**GPT-6.2 Astra / Sol**、GPT 5.6 Sol/Terra、**Grok Build 0.1**、Claude Fable 5/**5.1/5.2**、Claude Opus **4.5–4.8/5/5.5**、Gemini **4 Carbon / Hydrogen / Neon / Argon**、Gemini 3.5–3.8 Flash 等。配置 ID 格式 `opencode/<model-id>`。

**Go 套餐 API 端点**：全部为 **`https://opencode.ai/inference/go/{openai,anthropic,google,systemone}/v1*`**（旧 `https://opencode.ai/zen/go/v1/*` 仍返回 200 且 ID 一致，属兼容别名，**新配置一律写新路径**），以 Go 订阅的同一 API key 认证（登录 Zen 控制台复制）。
> 🔑 **协议映射由清单 API 逐模型给出**：每个模型对象内嵌 **`api` 节点**（键 = 协议名，值含 `base_url` / `sdk` / `compatibility`），**37 款全覆盖**。实测 **19 + 5 + 6 + 1 + 3 + 3 = 37 款**（`gemini-4-argon` 同时支持 Google 两条路径）。

- **Chat Completions** `https://opencode.ai/inference/go/openai/v1`（`@ai-sdk/openai-compatible`，**19 款**）：`glm-5.3`、`glm-5.3-flash`、`kimi-k3`、**`kimi-k3.1-pro`**、`kimi-k2.7-code`、`longcat-2.5`、`step-5-preview`、`beam-free`、`hy4-flash-free`、`hungerg-free`、`iceman-contributor-free`、`hy4`、`hy4-preview`、`hy3`、`deepseek-v4.1-flash`、`deepseek-v4-pro`、`mimo-v2.6-flash`、`mimo-v2.6-pro`、`minimax-m3.1-flash`
- **Responses** `https://opencode.ai/inference/go/openai/v1`（`@ai-sdk/openai`，**5 款**）：`grok-4.7`、`gpt-6-luna`、`gpt-5.6-luna`、`muse-spark-1.3-contributor`、`muse-spark-1.2-contributor`
- **Messages** `https://opencode.ai/inference/go/anthropic/v1`（`@ai-sdk/anthropic`，**6 款**）：`claude-haiku-5-5`、`minimax-m3`、`qwen3.8-max`、`qwen4-max`、`qwen3.8-flash`、`qwen3.7-plus`
- **Google** `https://opencode.ai/inference/go/google/v1beta`（`@ai-sdk/google`，**1 款、双路径**）：`gemini-4-argon`——`generate-content` 与 `interactions`
- **System One（decision）** `https://opencode.ai/inference/go/systemone/v1`（`@ai-sdk/typesafe-ai`，**3 款**）：`jev-1.14`、`gemini-decision-1`、`gpt-6-luna-decision`
- **Embeddings** `https://opencode.ai/inference/go/openai/v1/embeddings`（**3 款**）：`text-embedding-3-small`（`@ai-sdk/openai`）、`qwen3-embedding-8b`、`gemini-embedding-2`（`@ai-sdk/openai-compatible`）

> ⚠️ **协议归属易错点**：**`kimi-k3` 与 `kimi-k3.1-pro` 均走 Chat Completions**（不是 Messages）；**`minimax-m3` 走 Messages、`minimax-m3.1-flash` 走 Chat Completions**；**`qwen4-max` 走 Messages**；`claude-haiku-5-5` 走 **Messages**。Anthropic 兼容层下 `max_tokens` 必填。**同族不同协议是常态，必须逐 ID 查 `api` 节点，禁止按厂商外推。**

模型 ID 短格式（`kimi-k3`），配置中写 `opencode-go/kimi-k3`。
**✅ API 协议对齐**：**OpenCode Go 与 Command Code Provider API 均已支持 OpenAI Responses 端点**，**两平台协议能力一致**。

**客户端与会话头要求**：Go 官方文档设 **Validated Clients / Known Problematic Clients** 两节，要求客户端：① 发送"典型 coding agent 流量"；② **自带 user agent**（如 `my-coding-agent/1.0`），不要用通用 SDK/HTTP 库名；③ **每个会话发送稳定的 `x-opencode-session` 会话 ID**。
- **已验证可用**：Hermes（需 v0.21.6+，含 PR #101864）、**Claude Code（识别其原生会话头，无需自定义包装）**、Codex（识别原生会话头，部分版本/代理会丢，转发时需保留）、**ZCode**（官方原文：`x-opencode-session` 已非必须）、Pi、jcode（需 v0.81.6+）、Kilo Code CLI（需含 PR #13752，**不覆盖 VS Code 扩展**）。
- **已知有问题**：DeepSeek Harness（部分模型路径会丢会话信息）、GitHub Copilot Chat（VS Code issue #334186）、Kimi Code（issue #3506）、MiMo Code（PR #2327 未合并）。

**隐私与留存**（口径 = 清单 API 的 `go.zdr` / `go.training` / `go.limited_regions` 三字段，**37 款全覆盖**）：
- **ZDR ✅（23 款，`go.zdr = true`）**：`glm-5.3`、`glm-5.3-flash`、`kimi-k3`、`kimi-k3.1-pro`、`kimi-k2.7-code`、`longcat-2.5`、`mimo-v2.6-flash`、`mimo-v2.6-pro`、`minimax-m3`、`minimax-m3.1-flash`、`qwen3.8-max`、`qwen4-max`、`qwen3.8-flash`、`qwen3.7-plus`、`hy3`、`hy4`、`hy4-preview`、`hy4-flash-free`、`hungerg-free`、`step-5-preview`、`deepseek-v4.1-flash`、`deepseek-v4-pro`、`jev-1.14`。
- **DeepSeek 的两个 ZDR 是「0 days\*」**：**ZDR 协议按月续签，现行文本有效期至 2026-12-31**；⚠️ **ZDR 会关闭依赖存储数据的功能**（stateful Responses API、Files and Collections、Batch API）；滥用监控日志保留至多 30 天。
- **非 ZDR（14 款，`go.zdr = false` 或未提供）**：`grok-4.7`、`gpt-6-luna`、`gpt-5.6-luna`、`claude-haiku-5-5`、`gemini-4-argon`、`beam-free`、`iceman-contributor-free`、`muse-spark-1.3/1.2-contributor`、`gemini-decision-1`、`gpt-6-luna-decision`、`text-embedding-3-small`、`qwen3-embedding-8b`、`gemini-embedding-2`——其中 `grok-4.7` / `gpt-5.6/6-luna` / `claude-haiku-5-5` / `beam-free` 为 **30 天留存**，`gemini-4-argon` 为 **55 天留存**。
- **🔺 训练 Yes（3 款，`go.training = true`）**：`muse-spark-1.3-contributor`、`muse-spark-1.2-contributor`、`iceman-contributor-free`——**提示与补全用于训练未来模型，敏感/商业代码项目禁用**。
- **🌍 地区限制（4 款，`go.limited_regions = true`）**：`beam-free`（**中国含港澳、白俄罗斯、古巴、伊朗、朝鲜、俄罗斯等不可用**）、`muse-spark-1.3/1.2-contributor`（按 Meta 地理政策）、`jev-1.14`。`longcat-2.5` **Hosted in China**，需在 workspace privacy 中选 **Global regions**（Console 标 Limited regions），否则不可用。
- ✅ **`gemini-4-argon` 并非 Contributor 档**：`go.training = false`、`go.zdr = false`（55 天留存），OpenRouter 目录价 $2/$10/$0.10 与 Go 内部价一致。

### 新模型查询与核实要求（每次更新文档前必做）

> **教训**：OpenCode Go/Zen 与 CommandCode 曾同一天各上架 5-8 款新模型，仅靠新闻检索会全部漏掉——**新模型必须走 API 清单 diff，不能只信页面**。
> **stealth 模型"来去无踪"**：`tidepool-alpha-free` 本期已从 Zen 清单消失，`seaglass-alpha-free` 新出现；**上架与下架都只能靠高频 API diff 捕捉**。

```bash
# ① 四平台权威清单（匿名 GET，无需 key）
curl -sL https://opencode.ai/inference/go/v1/models | jq -r '.data[].id' | sort   # Go（11-26 实测 37 ID）
curl -s https://opencode.ai/zen/v1/models     | jq -r '.data[].id' | sort   # Zen（108 款 = 11 `-free` + big-pickle + 96 付费）
curl -s https://api.commandcode.ai/provider/v1/models | jq -r '.data[].id' | sort   # CommandCode（11-26 实测 105；CLI 1.93.4 目录 105，差集 0）
curl -s https://openrouter.ai/api/v1/models   | jq -r '.data | sort_by(.created) | reverse | .[:15][] | [.created|todate, .id] | @tsv'   # OpenRouter 最近上架（11-26 目录 474 款）
curl -s https://openrouter.ai/api/v1/models/{slug}/endpoints   # 单模型逐渠道价；下架返回空数组 []

# ② Command Code 目录（T+0）——npm 包 pi-commandcode-provider 滞后 CLI，必须直接取 CLI 包
cd /tmp && npm pack command-code@latest --silent && tar xzOf command-code-*.tgz package/dist/bundled/command-code-knowledge/reference/models.md > m.md   # 禁 tar xzf（包体 4.3MB，/tmp 配额不足）
tar xzOf command-code-*.tgz package/CHANGELOG.md > c.md ; npm view command-code version   # 记录版本号（11-26 = 1.93.4）
```

**核实规则**：
1. **created 时间戳仅 OpenRouter 可信**——Go/Zen/CommandCode 三家的 API 每日整表重打时间戳，不能用于判断上架时间。
2. **Go 侧两源不总是逐款一致**：API 37 ID 含 decision / embedding，Console Limits 只列文本模型（且残留 1 行 `GLM-5.2`）；**必须同时记录两个口径并注明"以 API 清单为准"**。
3. **请求数/额度**：**Go 侧首选 `curl -sL https://opencode.ai/inference/go/v1/models`**——单次返回单价（含 cache read/write 分档）、`go.monthly_usage` 三档额度、`go.zdr`/`go.training`、`cost.multipliers`、上下文/输出上限；「Est. requests / 5 hr」只在 **Console Go 页**的 Limits Tab 提供，且**可能滞后于 API**（`kimi-k3.1-pro` 即为例证）。**推理档位以 CLI 包内 `models.md` 的 Efforts 列为准（T+0）**。
4. 新模型确认后需**同步更新五处**：本指南模型列表表、[OpenCode Go 定价与性价比测算](/model-intel/opencode-go-pricing-comparison/)（请求数+内部价+性价比三表）、GOAT 对比文档（逐模型两表+独占清单+胜负统计）、价格对比文档（OpenRouter/GOAT/Zen 节）、调用量排名（若已登榜）。
5. 厂商匿名模型（stealth/Unknown）以 OpenRouter slug 前缀为归属证据。
6. **额度口径每次必查"表述方式"本身是否变了**——官方现以"**月度美元上限 + 比例窗口**（5h=20%、周=50%、月=100%）"定义 Go 额度；**decision / embedding 例外**，其月额度等于月费（Go $10 / Plus $40 / Teams $15）。
7. **官方"下线/路由"计划会被撤销**——凡涉及"即将下线/即将迁移"的公告，下一次必须回查官方文档确认是否已反转。
8. **OpenRouter 价格必须读 `pricing.discount`**：该字段表示 `prompt`/`completion`/`input_cache_read` **已是折后实付价**（`0.895` = −89.5%），原价 = 折后价 ÷ (1 − discount)；**负值 = 溢价**。

## 模型选择原则

### 额度分层

| 额度 | 性价比 | 模型（款数） | 使用策略 |
| :---: | :---: | :--- | :--- |
| **$200** | **20.0x** | **`glm-5.3`（1 款）** | **Go 侧性价比第一**；Agentic 最强，关键决策与疑难编码首选 |
| **$100** | **10.0x** | **`deepseek-v4.1-flash`（1 款）** | **文本稳定最高档**；峰谷同额度，错峰使用 |
| $60 | **6.0x** | `glm-5.3-flash`（多模态）· `kimi-k2.7-code` · `kimi-k3.1-pro` · `mimo-v2.6-flash` · `longcat-2.5` · `minimax-m3` · `qwen3.7-plus` · `hy3` · `hy4` · `muse-spark-1.3/1.2`（**11 款**） | **主力密集区**；Muse Spark 注意训练条款与地区限制 |
| **$30** | 3.0x | `qwen3.8-flash` · `hy4-preview` · `gemini-4-argon`（**3 款**） | 可用；`gemini-4-argon` **12-01 起单价翻倍** |
| **$20** | 2.0x | **`minimax-m3.1-flash`（1 款）** | 原免费档转付费，4x |
| $15 | 1.5x | `gpt-6-luna` · `gpt-5.6-luna` · `claude-haiku-5-5` · `kimi-k3` · `qwen4-max` · `qwen3.8-max` · `grok-4.7` · `deepseek-v4-pro` · `mimo-v2.6-pro` · `step-5-preview`（**10 款，均 4x**） | 谨慎使用；`glm-5.3` 评分双高（59.51/59.10）可作疑难任务首选 |
| **$10** | 1.0x | 3 款 decision + 3 款 embedding | **按量等价，无 Go 折扣**；RAG / 结构化决策按需调用 |
| **免费** | Unlimited | `beam-free`（限地区）· `hy4-flash-free` · `hungerg-free` · `iceman-contributor-free`（训练）· **4 款** | 达额度后手动切换；**不自动回落** |

### 上下文优先级

| 场景 | 推荐上下文 | 适用模型 |
| :--- | :---: | :--- |
| 超长项目重构 | **1,050,000** | `gpt-5.6-luna`、`gpt-6-luna`、`gpt-6-luna-decision` |
| 大型项目重构 | **1,048,576** | `glm-5.3`、`glm-5.3-flash`、`qwen4-max`、`qwen3.8-max`、`qwen3.8-flash`、`qwen3.7-plus`、`hy4`、`longcat-2.5`、`minimax-m3`、`minimax-m3.1-flash`、`step-5-preview`、`kimi-k3`、`kimi-k3.1-pro`、`mimo-v2.6-flash/pro`、`gemini-4-argon`、`muse-spark-1.3/1.2`（**1M 级共 18 款**） |
| 长输出场景 | 输出上限 **1,048,576** | `kimi-k3`、`kimi-k3.1-pro`（**输出上限 = 上下文上限，全目录唯一**） |
| 日常开发 | **262,144 / 256,000** | `kimi-k2.7-code`（262K）、`hy3`（256K）、`iceman-contributor-free`（262K） |
| 中长上下文 | **500,000** | `grok-4.7`（双档计价：≤200K 与 >200K） |
| 截图/图像理解 | 1M | `glm-5.3-flash`（多模态）、`deepseek-v4.1-flash`（视觉理解）、`longcat-2.5`（图片理解）、`mimo-v2.6-flash/pro`（多模态） |
| 结构化决策 | 64K–1.05M | `jev-1.14`（64K）、`gemini-decision-1`（262K）、`gpt-6-luna-decision`（1.05M） |
| 向量检索 | 8K–32K | `text-embedding-3-small`（8K）、`gemini-embedding-2`（8K）、`qwen3-embedding-8b`（32K） |

> **上下文口径已改为 API 实测**：`limit.context` / `limit.output` 逐模型给出。**输出上限最短的是 embedding / decision 模型，文本侧最短为 `hy4-preview` / `hy4` / `qwen3.7-plus` / `step-5-preview` / `gemini-4-argon` 的 65,536**。

## Claude Code 模式映射

Claude Code 采用四层工作流：**Fable → Opus → Sonnet → Haiku**

### Fable（总规划）
职责：总规划 · 长任务执行 · 多 Agent 协调 · 架构设计
- **推荐：`glm-5.3-flash`**（1M，6.0x，智能 57.5，多模态）
- 备选：`glm-5.3`（59.51/59.10，20.0x）· `kimi-k3`（智能第一）· `kimi-k3.1-pro`（6.0x）
- **`glm-5.3-flash` 是 `glm-5.2` 退出后的主力替代位**：1M 上下文 + 6.0x + 多模态，$60 额度可放心使用。

### Opus（深度推理）
职责：深度推理 · 架构决策 · 疑难分析 · 高级 Debug
- **推荐：`glm-5.3`**（59.51/59.10 双高，**$200 → 13,200 次/月**）
- 备选：`kimi-k3`（智能第一，**490 次/月**）· `qwen3.8-max`（Agentic 第二）· `deepseek-v4-pro`（53.20）· `glm-5.3-flash`（57.5，6.0x）
- **`glm-5.3` 是唯一「评分 + 性价比」双高项**：Agentic Go 内第一（59.10）、智能 59.51 仅次 `kimi-k3`，$200 档仍为 20.0x。`kimi-k3` 智能第一但仅 490 次/月，**不适合批量**。

### Sonnet（主力开发）
职责：主力开发 · 编写代码 · 修改代码 · 重构 · 测试
- **推荐：`kimi-k3.1-pro`**（1M，6.0x，**$2/$10 低于 K3**）
- 备选：`kimi-k2.7-code`（256K，6.0x）· `glm-5.3-flash` · `minimax-m3` · `qwen3.7-plus`
- `kimi-k3.1-pro` 的 API 月额度已升至 $60，是当前 **1M 上下文 + 6.0x + 前沿推理**的最优组合；`kimi-k2.7-code` 仍是 256K 日常开发的稳选项。

### Haiku（快速辅助）
职责：搜索 · 总结 · 代码浏览 · 日志分析
- **推荐：`mimo-v2.6-flash`**（6.0x，1.05M，**150,500 次/月**）
- 备选：`longcat-2.5`（6.0x，57,000 次/月，图片理解）· `glm-5.3-flash`（6.0x，多模态）· `hy3`（6.0x）· `claude-haiku-5-5`（1.5x）· `muse-spark-1.2/1.3`（6.0x，**训练条款 + 地区限制**）· `hungerg-free`（免费）
- 截图/图像理解用 `glm-5.3-flash`（多模态）或 `deepseek-v4.1-flash`（视觉理解）。

### Claude Code 最终推荐

> **Fable** → `glm-5.3-flash`（1M，6.0x）｜**Opus** → `glm-5.3`（1M，20.0x）｜**Sonnet** → `kimi-k3.1-pro`（1M，6.0x）｜**Haiku** → `mimo-v2.6-flash`（1.05M，6.0x）

## oh-my-opencode-slim Agent 模型配置

完整 Agent：Orchestrator · Oracle · Librarian · Explorer · Designer · Fixer · Council

### Orchestrator（编排者）
职责：总体规划 · Agent 调度 · 工作流控制 · 长链路执行
- **推荐：`glm-5.3-flash`** ｜ 备选：`kimi-k3`（智能第一）· `kimi-k3.1-pro`（6.0x）· `step-5-preview`

### Oracle（神谕者）
职责：深度推理 · 架构分析 · 复杂问题决策 · 技术评审
- **推荐：`glm-5.3`** ｜ 备选：`kimi-k3`（智能第一）· `qwen3.8-max`（Agentic 第二）· `deepseek-v4-pro` · `glm-5.3-flash`
- `glm-5.3`：智能 59.51 + Agentic 59.10 双高，编码/安全专项旗舰；$200 档 13,200 次/月。`kimi-k3` 智能 Go 内第一（59.70）但仅 490 次/月。`qwen3.8-max` Agentic 58.40。

### Librarian（图书管理员）
职责：文档检索 · MCP 查询 · API 查询 · 知识整理
- **推荐：MiMo-V2.6-Flash（6.0x，1.05M）** ｜ 备选：Hy3（6.0x）· GLM-5.3-Flash（1M 上下文）· Claude Haiku 5.5 · MiniMax M3 · LongCat 2.5

### Explorer（探索者）
职责：浏览项目 · 搜索代码 · 阅读日志 · 收集信息
- **推荐：MiMo-V2.6-Flash** ｜ 备选：Hy3 · GLM-5.3-Flash（1M 上下文）· MiniMax M3 · `hungerg-free`（免费）

### Designer（设计师）
职责：系统设计 · API 设计 · 数据结构设计 · 前端设计 · 架构草案
- **推荐：`kimi-k3.1-pro`** ｜ 备选：`kimi-k2.7-code` · `glm-5.3-flash` · `minimax-m3`

### Fixer（修复者）
职责：编写代码 · 修复 Bug · 重构 · 编写测试
- **推荐：Kimi K3.1 Pro** ｜ 备选：Kimi K2.7 Code · MiniMax M3 · GLM-5.3-Flash

### Council（评议会）
职责：多模型投票 · 架构评审 · 风险评估 · 决策仲裁

**质量优先**
> `kimi-k3` ＋ `glm-5.3` ＋ `kimi-k3.1-pro`
> （`kimi-k3` 智能第一，覆盖最高质量决策；`glm-5.3` 评分双高；`kimi-k3.1-pro` 承担日常开发。⚠️ `kimi-k3` 仅 490 次/月，Council 席位不宜高频调用。）

**平衡模式**
> `glm-5.3-flash` ＋ `kimi-k3.1-pro` ＋ `minimax-m3`
> （全部 $60 额度模型，性价比最优。）

**省额度模式**
> MiMo-V2.6-Flash ＋ Hy3 ＋ GLM-5.3-Flash
> （全部 $60 额度 + 高请求数模型，MiMo 以 1.05M 上下文优先。）

### oh-my-opencode-slim 最终推荐

**质量优先**
> **Orchestrator** → `glm-5.3-flash`（1M，6.0x）｜**Oracle** → `glm-5.3`（1M，20.0x）｜**Librarian** → `mimo-v2.6-flash`（1.05M，6.0x）｜**Explorer** → `mimo-v2.6-flash`（1.05M，6.0x）｜**Designer** → `kimi-k3.1-pro`（1M，6.0x）｜**Fixer** → `kimi-k3.1-pro`（1M，6.0x）
> **Council**：`kimi-k3` ＋ `glm-5.3` ＋ `kimi-k3.1-pro`

**平衡模式**
> **Orchestrator** → `glm-5.3-flash`（1M，6.0x）｜**Oracle** → `glm-5.3`（1M，20.0x）｜**Librarian** → `mimo-v2.6-flash`（1.05M，6.0x）｜**Explorer** → `mimo-v2.6-flash`（1.05M，6.0x）｜**Designer** → `kimi-k2.7-code`（256K，6.0x）｜**Fixer** → `kimi-k2.7-code`（256K，6.0x）
> **Council**：`glm-5.3-flash` ＋ `kimi-k3.1-pro` ＋ `minimax-m3`

## FreeBSD / Linux / Docker / Rust 推荐方案

适用于：FreeBSD 系统维护 · Linux 运维 · Docker · Kubernetes · Rust 开发 · Go 开发 · 网络设备配置 · 大型项目重构

**推荐：Claude Code**
> **Fable** → `glm-5.3-flash`（1M，6.0x）｜**Opus** → `glm-5.3`（1M，20.0x）｜**Sonnet** → `kimi-k3.1-pro`（1M，6.0x）｜**Haiku** → `mimo-v2.6-flash`（1.05M，6.0x）

**oh-my-opencode-slim**
> **Orchestrator** → `glm-5.3-flash`（1M，6.0x）｜**Oracle** → `glm-5.3`（1M，20.0x）｜**Librarian** → `mimo-v2.6-flash`（1.05M，6.0x）｜**Explorer** → `mimo-v2.6-flash`（1.05M，6.0x）｜**Designer** → `kimi-k3.1-pro`（1M，6.0x）｜**Fixer** → `kimi-k3.1-pro`（1M，6.0x）
> **Council**：`kimi-k3` ＋ `glm-5.3` ＋ `kimi-k3.1-pro`

## 使用原则

- **70% 日常开发**：`kimi-k3.1-pro`（6.0x，$60，1M）/ `kimi-k2.7-code`（6.0x，256K）；复杂任务切 `glm-5.3-flash`（6.0x，多模态 + 1M）
- **15% 架构设计与推理**：`glm-5.3-flash`（智能 57.5，6.0x，1M）；评分第一梯队（`glm-5.3`、`kimi-k3`）留作关键决策
- **10% 搜索与日志分析**：**MiMo-V2.6-Flash（6.0x，1.05M）** / **GLM-5.3-Flash（6.0x，多模态，1M）** / Hy3（6.0x）/ LongCat 2.5（6.0x，图片理解）/ Claude Haiku 5.5（1.5x，低价快速）；免费补充用 `hungerg-free`
- **5% 疑难问题（谨慎使用）**：Kimi K3（智能最高）/ **GLM-5.3（Agentic 第一、编码/安全专项）** / DeepSeek V4 Pro（53.20，$15）
  - $15 档模型性价比 1.5x，仅在 `glm-5.3-flash` / `kimi-k3.1-pro` 无法解决时使用。**DeepSeek 双雄注意错峰**：工作日 UTC 01:00–04:00 与 06:00–10:00（北京 9:00–12:00、14:00–18:00）单价 ×2；**周末全天按空闲价**。
- **结构化决策 / 向量检索**：decision 与 embedding 模型按量等价（$10 档），不需 coding agent 会话头，适合 RAG / memory provider / 脚本直接调用。

## 最终结论

**Claude Code**
> **Fable** → `glm-5.3-flash`（1M，6.0x）｜**Opus** → `glm-5.3`（1M，20.0x）｜**Sonnet** → `kimi-k3.1-pro`（1M，6.0x）｜**Haiku** → `mimo-v2.6-flash`（1.05M，6.0x）

**oh-my-opencode-slim**
> **Orchestrator** → `glm-5.3-flash`（1M，6.0x）｜**Oracle** → `glm-5.3`（1M，20.0x）｜**Librarian** → `mimo-v2.6-flash`（1.05M，6.0x）｜**Explorer** → `mimo-v2.6-flash`（1.05M，6.0x）｜**Designer** → `kimi-k3.1-pro`（1M，6.0x）｜**Fixer** → `kimi-k3.1-pro`（1M，6.0x）
> **Council**：`kimi-k3` ＋ `glm-5.3` ＋ `kimi-k3.1-pro`

## Command Code GOAT 套餐（竞品参考）

> 竞品逐模型对比详见 [$10 / $20 档订阅横向对比](/model-intel/ai-subscription-tiers/)。以下为用 GOAT 跑 Claude Code / oh-my-opencode-slim 的速查。

### 套餐与额度

| 维度 | OpenCode Go | Command Code GOAT |
|---|---|---|
| 月费 | $10 | $10 |
| 每 5 小时限额 | **逐模型 20%**（$15 → $3；$200 → $40） | **Up to $20** |
| 每周限额 | **逐模型 50%**（$15 → $7.5；$200 → $100） | **Up to $50** |
| 每月限额 | **按模型分档 $15 / $20 / $30 / $60 / $100 / $200**（+ 6 款 $10 decision/embedding + 4 款免费） | **按模型分档 $10 ~ $100**（套餐级 Up to $100） |
| 模型数 | **31 款文本 + 6 款 decision/embedding = 37 ID**（API 实测） | **GOAT 76 款**（All plans 107；**网关 API 105 = CLI 1.93.4 目录 105**；Deals 3 / Free 2） |
| 免费模型 | 无内置（达限额后**不自动回落**，需手动切换 Zen `-free` 独立端点：**11 款 + Big Pickle**） | **在线 2 款**：`recursive/flint-v1.0:free`（262K）、`stealth/glyph-cluster:free`（**每日 1,000 请求上限**） |
| 套餐档位 | **Go $10**（Go 生态内 Teams $20·成员 / Plus $40 属升档选项） | **Go $1（credits $10；5h $2 / 周 $5）/ GOAT $10（Up to $100）/ Pro $20（Up to $110）/ Provider $15 PAYG / Max 10× $100（$150）/ Max 20× $200（$300）/ Team Pro $40 / Enterprise $5,000+** |
| 独占模型 | **无**（Go 侧 API 37 ID，含 decision/embedding） | **GLM-5.3 FlashX**、**Qwen 3.8 Omni Flash**、GPT-5.6 Sol / Terra、Gemini 3.6/3.7/3.8 Flash、DS V4 Flash Fast / V4.1 Flash Fast / Ultrafast、**Step 3.5 / 3.7 Flash**、**GLM-5.2 Fast**、**Claude Haiku 4.5**、Inkling / Inkling Small / **Inkling 2 Mini**、Fugu Ultra、Muse Wonder 1.0、**Ornith 1.5 122B**、**Jev** 等（Go 未上架） |

### 两平台额度取向（谁更慷慨）

| 方向 | 模型 |
|---|---|
| **GOAT 更大方** | GLM-5.3 Flash（$100 vs Go $60）、Hy3（$70 vs $60）、DS V4 Flash Fast（$20）/ V4.1 Flash Fast（$60）（Go 未上架） |
| **Go 更大方** | **GLM-5.3（$200 vs GOAT $70，2.86 倍）**、**Kimi K3.1 Pro（$60 vs $20，3 倍）**、Muse Spark Contributor（$60 vs $20）、Qwen3.7 Plus（$60 vs $33）、Hy4（$60 vs $20）、Hy4 Preview（$30 vs $20）、MiMo V2.6 Flash（$60 vs $20）、MiMo V2.6 Pro（$15 vs $20 — GOAT 略高） |
| **持平** | **DeepSeek V4.1 Flash**：GOAT **$100** / Go **$100**；**Kimi K2.7 Code**：两侧 $60；**MiniMax M3.1 Flash**：两侧 $20 |

### GOAT 特色功能

- **思考强度调节**：内置 `/effort [level]` + 全局 `effort` / 逐模型 `reasoningEffort`（low→max，**按模型支持**）。
- **Provider API**：OpenAI `/v1/chat/completions` + Anthropic `/v1/messages` + **OpenAI Responses（自 CLI v1.55.0 起）**——**与 OpenCode Go 的 API 能力已对齐**。**除 Command Code Go 计划外全部计划有 API 访问**；模型命名 `provider/model-slug`；流式 usage 自动回传；错误码含 403 `upgrade_required` 与 422 `cmd_zdr_no_providers`。
- **Deals（`/docs/resources/pricing-limits`，8 条）**：提额 6 条（`deepseek-v4.1-flash`、`glm-5.3-flash`、`ling-3.1-flash`、`ling-3.1-flash-1019`、`glm-5.3`、`minimax-m3` 2× usage）+ 免费 2 条（`glyph-cluster:free`、`flint-v1.0:free`，各 1,000 次/日）。
- **地理限制**：**GPT-5.6 Luna（OpenAI）与 Gemini 3.7 / 3.8 Flash（Google）在中国大陆不可用**。
- **⚠️ 额度是"共享单池"**：低额度模型按比例消耗更多 credits，**不可把各模型额度简单相加**；滚动窗口按套餐级额度同比切分。
- **开源仍未兑现**（页面口径 "later this month"）。

### 用 GOAT 模型替代 Go 角色（Claude Code 四层）

| 层 | Go 方案 | GOAT 替代 |
|---|---|---|
| Fable（总规划） | **`glm-5.3-flash`（$60）** | **GPT-5.6 Sol**（$20，60.9）或 GLM-5.2（GOAT $70） |
| Opus（深度推理） | **`glm-5.3`（$200）** | **GPT-5.6 Sol** / Grok 4.7（$20） |
| Sonnet（主力开发） | **`kimi-k3.1-pro`（$60）** | **Kimi K3.1 Pro**（GOAT $20）或 Kimi K2.7 Code（$60） |
| Haiku（快速辅助） | MiMo-V2.6-Flash（$60） | **DeepSeek V4 Flash**（$60）或 **GLM-5.3-Flash**（$100，多模态） |

### 一句话建议

> 需要**国产模型大额度**（MiMo-V2.6-Flash / Muse Spark / GLM-5.3 / Kimi K3.1 Pro）留 Go；需要**新旗舰开放度 + 高额 GLM-5.3-Flash / DeepSeek** 或 **GOAT 的独占模型**选 GOAT。

---

> **附注**：Go 使用限制为 **月度美元上限 + 比例窗口**（5h = 20%、周 = 50%、月 = 100%），文本模型按 **$15 / $20 / $30 / $60 / $100 / $200** 分档，decision / embedding 为 **$10**（Plus $40 / Teams $15）；**Plus 放大 2x / 3x / 4x，上限 4x**；**Teams 恒为 Go + $5**。调用量排名数据更新至 **2026-11-26**（完整榜见 [OpenCode 模型调用量排名](/model-intel/opencode-model-usage-ranking/)）；详细价格数据见 [OpenCode Go 定价与性价比测算](/model-intel/opencode-go-pricing-comparison/) 与 [国产大模型官方 API vs OpenRouter 价格对比](/model-intel/china-llm-api-vs-openrouter-pricing/)；行业动态见 [AI 大模型一周汇总](/model-intel/ai-weekly-roundup/)；竞品逐模型额度对比见 [$10 / $20 档订阅横向对比](/model-intel/ai-subscription-tiers/)。
