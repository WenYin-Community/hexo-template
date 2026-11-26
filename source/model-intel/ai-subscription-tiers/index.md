---
title: AI 订阅档位横向对比：$10 档三家 · $20 档四家（2026-11-26）
date: 2026-11-26
---

> 同价位订阅横向对比：$10 档（OpenCode Go / CommandCode GOAT / OpenDesign Go）与 $20 档（Ollama Pro / CommandCode Pro / OpenDesign Go Plus / Go Teams）。数据抓取日 **2026-11-26**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据来源（**抓取日期 2026-11-26**）：
> - **覆盖范围**：**$10 档**（OpenCode Go / CommandCode GOAT / **OpenDesign Go**）+ **$20 档**（**Ollama Pro** / CommandCode Pro / OpenCode Go Teams / **OpenDesign Go Plus**）。$10 档主对比见第一至三节，$20 档见第五节。
> - **OpenCode Go**：官方文档 opencode.ai/docs/go、**Console Go 页 `opencode.ai/console/go`（公开页）**、清单 API `/inference/go/v1/models`（**37 个 ID = 31 文本 + 3 decision + 3 embedding**）。
> - **CommandCode**：`commandcode.ai/docs/plans/goat`（SSR 可 curl）、`/docs/resources/pricing-limits`（Deals 明细 + 套餐矩阵）。**页头计数：GOAT plan 76 / All plans 107 / Deals 3 / Free 2**；**Pricing & Limits 页 Deals 小节实列 8 条**。
> - **档位权威源**：CLI 包内官方目录 `command-code@1.93.4` → `reference/models.md`（**145 行 / 19,175 字节 / 105 款**）；**Provider API 在线 105 端点，与 CLI 目录逐 ID 一致、差集 0**。
> - **OpenDesign**（open-design.ai/pricing）：**Go $10（首月 $8；年付 $84/年 = $7/月）/ Go Plus $20（首月 $16；$168/年 = $14/月）/ Go Pro $100（首月 $80；$840/年 = $70/月）/ Go Max $200（首月 $160；$1,680/年 = $140/月）**；**月额度上限 Go $220 / Plus $310 / Pro $780 / Max $1,410**；**Design Plan 已更名 Coding Plan**；官方页公布 **11 款 Coding Plan 模型的「Est. requests / 7 天」与「Monthly usage」双列**。
> - **Ollama**（ollama.com/pricing）：Pro **$20/月含 $60/月用量**（年付 $200/年 = $16.67/月），Max $100 含 $300，Team $500 含 $1,000 共享；**按 token 计费、无 5 小时 / 每周窗口**，超出按同价 PAYG 继续；**峰谷定义 = 工作日 12:00–18:00 UTC 为 peak，其余与周末全天为 off-peak**。
> - 🎯 **本文定位**：**同价位横向对比**。**$10 档**：OpenCode Go / CommandCode GOAT / OpenDesign Go；**$20 档**：Ollama Pro / CommandCode Pro / OpenDesign Go Plus / OpenCode Go Teams。Go 内部 Teams / Plus 档位单列于**第四节**。
> - 🎯 **额度口径**：**三平台同价 $10，但额度语义完全不同**——**Go 是"共享百分比池 + 逐模型 $ 分母"**；**GOAT 是"逐模型 credits 累加成套餐级 Up to $100"**；**OpenDesign 是"Coding Plan 池 + Top Models 池"双池、且 Go 档 Top Models 为 $0**。
> - 折算汇率：1 美元 ≈ 6.7096 元人民币（中国外汇交易中心 2026-11-26 中间价）。
> - ⚠️ **退役现状**：`stealth/pixel-canary`、`stealth/space-bunny-alpha`、`stealth/cat-jam:free`、`space-bunny` / `space-bunny-free`、`xiaomi/mimo-v2.5` 系——均已从网关 API 与 CLI 目录同步移除。

---

## 一、套餐基础对比

| 维度 | **OpenCode Go** | **CommandCode GOAT** | **OpenDesign Go** |
|---|---|---|---|
| 月费 | **$10** | **$10** | **$10**（首月 $8；年付 $84 = $7/月） |
| 官方定位 | Lower-cost access | Up to $100 credits（10x） | Coding Plan 模型额度 |
| 额度语义 | **共享百分比池 + 逐模型 $ 分母** | **逐模型 credits 累加**成套餐级 Up to $100 | **双池**：Coding Plan 池 + Top Models 池 |
| **月额度上限** | **无套餐级总额**；文本分 **6 档：$15 / $20 / $30 / $60 / $100 / $200**；decision/embedding 另计 **$10** | 逐模型分档（$10 / $15 / $20 / $33 / $40 / $47 / $50 / $60 / $70 / $100），套餐级 **Up to $100** | **$220**（Coding Plan 最高 $220 + **Top Models $0**） |
| 5 小时窗口 | **月额度 × 20%** | **Up to $20**（套餐级） | 存在 5 小时窗口，**金额未披露** |
| 7 天 / 周窗口 | **月额度 × 50%**（周一 00:00 UTC 重置） | **Up to $50**（套餐级） | 逐模型给「**Est. requests / 7 天**」 |
| 模型范围 | **31 款文本 + 6 款 decision/embedding** | **GOAT 76 款**（All plans 107 / 网关 105 / CLI 105） | **Coding Plan 11 款**（另有 Top Models 20 款**不含**） |
| premium 模型 | 部分（`gpt-6-luna`、`kimi-k3`、`grok-4.7`、`claude-haiku-5-5` 等） | 有（GPT / Claude / Gemini 系，Opus 需 Max） | **Go 档完全不可用**（Claude / GPT-6 Astra / Gemini 4 系列需 **Go Plus** 起） |
| 免费 / 兜底 | Zen `-free` 11 款 + Big Pickle；可开 **Extra Usage** 走 Console credits | 免费 2 款（各 1,000 次/日）+ PAYG 回落 | Free 版**无周期性额度**；额度用尽需升档 / 自动充值 / BYOK |
| API 支持 | 四类端点（`/inference/go/{openai,anthropic,google,systemone}/v1*`） | 三协议（Chat Completions / Responses / Messages） | **OpenDesign API key**，可用于 Codex / Claude Code / OpenCode / Hermes，**与 App 共用同一份额度** |
| 并发 | 未公布 | 未公布 | **10 个共享并发任务**（按 workspace 计，加人不加名额） |
| 成员数 | 仅限单成员 workspace | Team Pro / Enterprise 支持团队 | **邀请成员免费、人数不限**（额度与并发共享） |

### 1.1 OpenDesign 的额度结构（与另两家口径不同）

> OpenDesign 的付费计划**买的不是功能，而是托管模型额度**——App 本身开源免费，接本地 agent 或自带 key 则 $0 花费。

**两类额度池**：

| 额度池 | 覆盖模型 | Go 档额度 |
|---|---|---|
| **Coding Plan** | 11 款：DeepSeek V4.1 Flash / **V4.1 Flash Eco** / V4 Flash / **V4 Pro**、MiniMax M3.1 Flash、GLM-5.3 Flash、Kimi K2.7 Code、Hy4 Preview、MiMo V2.6 Flash / Pro、**DeepSeek V4 Flash Vision Exp** | **最高 $220/月** |
| **Top Models** | 20 款：Claude Fable 5.2 / 5.1、Opus 5.5、GPT-6 Astra / Sol / 6.1 Terra、Gemini 4 Neon / Hydrogen / Argon、Kimi K3 / K3.1 Pro、Grok 4.7、Claude Sonnet 5.5、Muse 系等 | **$0（Go 档不含）** |
| **图像 / 视频 / 音频** | 12 款（Seedream 5.5、Seedance 2.5、GPT Image 2.6、Wan 2.7、ElevenLabs 等），**仅 API 可调** | 需更高档 |

> 🔑 **扣费顺序官方原话**：「Coding Plan calls consume Coding Plan credits first, then remaining Top Model Credits (Go has none). Top Model calls consume Top Model Credits directly.」——**Go 档调用 premium 模型会直接失败，不是"扣更多"**。
> 🔑 **额度不结转**：每计费周期重置；**7 天窗口自订阅开始时间起算**。

**全档位对照（官方页 11-26 抓取）**：

| 档位 | 月付 | 首月价 | 年付 | 月总额度 | Coding Plan | Top Models | 并发 |
|---|---|---|---|---|---|---|---|
| Free | $0 | — | — | 无周期性额度 | — | — | — |
| **Go** | **$10** | $8 | **$84/年（$7/月）** | **$220** | $220 | **$0** | 10 |
| **Go Plus** | **$20** | $16 | **$168/年（$14/月）** | **$310** | $290 | **$20** | 20 |
| **Go Pro** | **$100** | $80 | **$840/年（$70/月）** | **$780** | $660 | $120 | 30 |
| **Go Max** | **$200** | $160 | **$1,680/年（$140/月）** | **$1,410** | $1,110 | $300 | 50 |

> ⚠️ **本期促销**：页面横幅为 **「OpenDesign Motion Week · DS off-peak rates」**——**DeepSeek V4.1 Flash 1017 按官方 API 全天 off-peak 价计费，为期一周**；另 **首月 20% off / 年付 30% off**。**首月价与促销属限时，预算须按续费价算。**
> ⚠️ **官方明确「Off-peak promo 不是额外额度」**：活动周内 Go 的 Coding Plan credits 在 off-peak 费率下最多可跑出 **$60/周** 的 V4.1 Flash 等值用量；**共享额度与重置时间不变**。

**Coding Plan 逐模型额度（官方页「Coding Plan usage」表，4 档全列）**：

| 模型 | Go 7 天请求 / 月额度 | Go Plus | Go Pro | Go Max |
|---|---|---|---|---|
| **DeepSeek V4.1 Flash Eco** | **266,933 次 / $220** | 359,270 / $290 | 805,653 / $660 | 1,344,373 / $1,110 |
| **DeepSeek V4.1 Flash** | 145,600 / $120 | 194,200 / $160 | 436,800 / $360 | 728,000 / $600 |
| DeepSeek V4 Flash | 36,700 / $60 | 48,900 / $80 | 110,100 / $180 | 183,500 / $300 |
| MiMo V2.6 Flash | 20,675 / $15 | 27,575 / $20 | 62,025 / $45 | 103,375 / $75 |
| DeepSeek V4 Flash Vision Exp | 19,000 / $60 | 25,300 / $80 | 57,000 / $180 | 95,000 / $300 |
| GLM-5.3 Flash | 18,000 / $60 | 24,000 / $80 | 54,000 / $180 | 90,000 / $300 |
| MiniMax M3.1 Flash | 16,300 / $60 | 21,700 / $80 | 48,800 / $180 | 81,400 / $300 |
| MiMo V2.6 Pro | 6,650 / $15 | 8,875 / $20 | 19,950 / $45 | 33,275 / $75 |
| Hy4 Preview | 3,920 / $60 | 5,230 / $80 | 11,800 / $180 | 19,600 / $300 |
| Kimi K2.7 Code | 3,750 / $60 | 5,000 / $80 | 11,200 / $180 | 18,800 / $300 |
| DeepSeek V4 Pro | 3,120 / $60 | 4,160 / $80 | 9,360 / $180 | 15,600 / $300 |
| DeepSeek V4.1 Flash Off-peak promo | 291,200 / **$60/周** | 388,400 / **$80/周** | 873,600 / **$180/周** | 1,456,000 / **$300/周** |

> 🔑 **读法**：与 Go 的语义相同——「Monthly usage」是**该模型单独用到月额度上限时的分母**，**不是可累加的子额度**；表中「7 天请求」是官方按典型用量估的**请求数**（OpenDesign 是唯一同时公布请求数与美元额度的平台）。
> 🔑 **与另两家的三个结构性差异**：
> 1. **双池且 premium 另计**——Go 的 $220 **一分 Top Models 都不能用**；GOAT 与 Go 均可在同一额度池内选 premium 模型。
> 2. **年付折扣力度最大**——Go $84/年 = $7/月，是三家 $10 档里唯一有**年付 + 首月折扣**的。
> 3. **⚠️ 面值 ≠ 官方 API 等值**——第三方网关实测（OctaFuse，经 DeepSeek 官方价表反推）显示 Go 档 7 天 $30 ≈ $20 等值、月 $120 ≈ $80 等值（≈66.5%）；**该实测基于旧额度，本轮未复测**。采购应以自行核账为准。

### CommandCode 全档位矩阵（11-26）

| 计划 | 价格/月 | Credits/月 | 估算请求 | 5h / 周窗口 |
|---|---|---|---|---|
| **Go** | **$1** | **$10** | ~9K | $2 / $5 |
| **GOAT** | **$10** | **Up to $100** | ~75K | **$20 / $50** |
| **Pro** | $20 | **Up to $110** | ~100K | **$22 / $55** |
| **Provider** | $15 | PAYG（Provider API 接入） | — | — |
| **Max 10×** | $100 | **$150**（premium $100 / standard $150 双池） | ~230K | $45 / $90 |
| **Max 20×** | $200 | **$300**（premium $200 / standard $300） | ~370K | $90 / $180 |
| **Team Pro** | $40 | $40 | ~35K | $12 / $24 |
| **Enterprise** | $5,000+ | Custom | Custom pool | 无滚动窗口上限 |

> **四源计数口径不同，引用必须写明来源**：网关 API **105** / CLI **1.93.4** 目录 **105**（**两源逐 ID 一致，差集 0**）/ GOAT 档位文档页头 **GOAT plan 76 / All plans 107 / Deals 3 / Free 2** / Pricing & Limits 页的 Deals 小节实列 **8 条**。⚠️ **Deals 徽章写 3，但小节实列 8 条**——徽章数与条目数不是一回事。
> **滚动窗口按"credit 价值"计量**，不是请求数。**套餐级额度按档位递进：Go $10 → GOAT $100 → Pro $110 → Max 10× $150 → Max 20× $300**。

### GOAT 功能与限制要点

- **思考强度调节**：内置 `/effort [level]` + 全局 `effort` / 逐模型 `reasoningEffort`（low→max，**按模型支持**）。
- **Provider API**：Chat Completions + Responses + Messages 三协议；**除 Command Code Go 计划外全部计划有 API 访问**；Provider 套餐 $15/月 + **$1.01 卡费**，PAYG 无加价；模型命名 `provider/model-slug`；流式 usage 自动回传；错误码含 403 `upgrade_required` 与 422 `cmd_zdr_no_providers`。
- **Deals（8 条）**：提额 6 条 —— `deepseek-v4.1-flash`（$10 Go / **$100 GOAT** / $110 Pro）、`glm-5.3-flash`（同左，while capacity lasts）、`ling-3.1-flash`（$100 GOAT / $110 Pro）、`ling-3.1-flash-1019`（$100 GOAT / $110 Pro）、`glm-5.3`（$10 Go / $70 GOAT / $80 Pro）、`minimax-m3`（**2× usage**）；免费 2 条 —— `glyph-cluster:free`、`flint-v1.0:free`（各 **1,000 次/日**，不消耗额度）。
- **免费档现为 2 条**：`recursive/flint-v1.0:free`（Flint，262K）、`glyph-cluster:free`（256K）。⚠️ **已退出**：`thinkingmachines/inkling-2-small:free`、`poolside/laguna-s-2.1-free`、`stealth/crouton-alpha`、`reflection/beam:free`、`minimax-m3.1-flash:free`、`ornith-1.5-122b:free`。
- **地理限制**：**GPT-5.6 Luna（OpenAI）与 Gemini 3.7 / 3.8 Flash（Google）在中国大陆不可用**。
- **⚠️ 额度是"共享单池"**：低额度模型按比例消耗更多 credits，**不可把各模型额度简单相加**。
- **本期新增 1 款**：`thinkingmachines/inkling-2-mini`（1.05M、$0.075/$0.30、五档含 `off`），目录 104 → **105**。

> **🔄 新模型查询要求**：四源交叉 diff —— ① `curl -s https://api.commandcode.ai/provider/v1/models`（**105**）；② CLI 包内目录（`command-code@1.93.4`，**105 款 / 145 行 / 19,175 字节**）；③ GOAT 档位文档页头（**76 / 107 / 3 / 2**）；④ Pricing & Limits 页（Deals 小节 **8 条**）。
> Go 侧：`curl -sL https://opencode.ai/inference/go/v1/models`（**37 个 ID**）对 Console Go 页（**31 行文本 + 1 行残留**）——**以 API 为准**。

**关键差异**：GOAT 有**套餐级限额 Up to $100 / 5h $20 / 周 $50**；**Go 没有套餐级总额**，只有**逐模型 $ 分母 + 共享百分比池**。**Go 文本分 6 档（$15 / $20 / $30 / $60 / $100 / $200），GOAT 分 10 档（$10 ~ $100）**——**套餐级数字只是默认参考值，比较必须落到逐模型，见第二节。**

---

## 二、逐模型额度对比

### 2.1 两边均有：请求数与月额度对比

> **Go 列**取自 Console Go 页 Limits Tab 的「Est. requests / 5 hr」+ API 的 `go.monthly_usage.go`；**GOAT 列**取自 `docs/plans/goat` 的「Requests / 5 hours」表 + 月 credits 表。⚙️ **两张请求数表各自按自家"典型请求"估算，token 口径不同，不能当精确换算**。

| 模型 | Go 5h 请求 | GOAT 5h 请求 | Go 月额度 | GOAT 月额度 | 结论 |
|---|---|---|---|---|---|
| **`deepseek-v4.1-flash`** | 43,300 | **51,300** | **$100** | **$100** | **额度持平**；GOAT 请求 +18% |
| **`glm-5.3-flash`** | 6,320 | **11,800** | $60 | **$100** | **GOAT 双高**：额度 +67%、请求 +87% |
| **`glm-5.3`** | 2,640 | 947 | **$200** | $70 | **Go 额度 2.86 倍** |
| `kimi-k3` | 98 | **196** | $15 | $20 | GOAT 请求 +100%、额度 +33% |
| `kimi-k3.1-pro` | 147 ⚠️ | **294** | **$60** | $20 | **Go 额度 3 倍**；请求数为 Console 旧估算 |
| `kimi-k2.7-code` | 994 | **1,080** | **$60** | **$60** | 额度持平；GOAT 请求 +9% |
| `minimax-m3` | 3,210 | 2,770 | **$60** | $47（**2× Deal 后等效 $94**） | 标称 Go 高；**Deal 后 GOAT 反超** |
| `minimax-m3.1-flash` | 3,880 | **4,230** | **$20** | **$20** | 持平；GOAT 请求 +9% |
| `qwen3.7-plus` | **4,310** | 1,420 | **$60** | $33 | **Go 双高**：额度 +82%、请求 3 倍 |
| `qwen3.8-flash` | **5,400** | 3,910 | **$30** | $20 | **Go 额度 +50%**、请求 +38% |
| `qwen3.8-max` | 162 | **261** | $15 | $20 | GOAT 请求 +61%、额度 +33% |
| `qwen4-max` | 463 | **513** | **$15** | **$15** | 持平 |
| `grok-4.7` | **169** | 144 | $15 | $20 | GOAT 额度 +33%；Go 请求 +17% |
| `deepseek-v4-pro` | 1,040 | **1,980** | $15 | $20 | GOAT 请求 +90%、额度 +33% |
| `hy3` | 4,300 | **7,080** | $60 | $70 | GOAT 双高 |
| `hy4` | **2,710** | 1,220 | **$60** | $20 | **Go 额度 3 倍** |
| `hy4-preview` | **1,350** | 1,220 | **$30** | $20 | **Go 额度 +50%** |
| `mimo-v2.6-flash` | **30,100** | 13,000 | **$60** | $20 | **Go 额度 3 倍、请求 2.3 倍** |
| `mimo-v2.6-pro` | 3,260 | **5,700** | $15 | $20 | GOAT 请求 +75%、额度 +33% |
| `muse-spark-1.3-contributor` | **45,300** | 18,200 | **$60** | $20 | **Go 额度 3 倍** |
| `step-5-preview` | 426 | **1,040** | $15 | $20 | GOAT 请求 **+144%**、额度 +33% |
| `claude-haiku-5-5` | 3,850 | **5,970** | $15 | $20 | GOAT 请求 +55%、额度 +33% |
| `gpt-6-luna` | 4,230 | **6,060** | $15 | $20 | GOAT 请求 +43%、额度 +33% |
| `gpt-5.6-luna` | 2,050 | **2,960** | $15 | $20 | GOAT 请求 +44%、额度 +33% |
| **`ling-3.1-flash` / `-1019`** | ❌ 未上架 | 5,850 | — | **$100** | **GOAT 独占** |

> **读数小结**：
> - **GOAT 在"小额度档"（$15 → $20）普遍多给 33% 额度**，且请求数估算更宽松。
> - **Go 在"高额度档"更慷慨**：`glm-5.3`（$200 vs $70）、`kimi-k3.1-pro`（$60 vs $20）、`mimo-v2.6-flash`（$60 vs $20）、`muse-spark`（$60 vs $20）、`hy4`（$60 vs $20）、`qwen3.7-plus`（$60 vs $33）。
> - **`glm-5.3-flash` 是 GOAT 最明显的优势项**（$100 vs $60）。

### 2.2 月额度（Credits）逐模型对比

| 模型 | Go 月额度 | GOAT 月额度 | Go 性价比 | GOAT 性价比 | 胜出 |
|---|---|---|---|---|---|
| DeepSeek V4.1 Flash | $100 | $100 | 10.0x | 10.0x | **持平** |
| GLM-5.3 Flash | $60 | $100 | 6.0x | 10.0x | **GOAT** |
| GLM-5.3 | $200 | $70 | 20.0x | 7.0x | **Go** |
| Kimi K3 | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| Kimi K3.1 Pro | $60 | $20 | 6.0x | 2.0x | **Go** |
| Kimi K2.7 Code | $60 | $60 | 6.0x | 6.0x | **持平** |
| LongCat 2.5 / 2.0 | $60（2.5） | $50（2.0） | 6.0x | 5.0x | 不可直接比（不同代际） |
| Step 5 Preview | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| Claude Haiku 5.5 | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| GPT-5.6 Luna | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| GPT-6 Luna | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| Qwen 3.8 Max | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| Qwen 3.7 Plus | $60 | $33 | 6.0x | 3.3x | **Go** |
| Qwen 3.8 Flash | $30 | $20 | 3.0x | 2.0x | **Go** |
| Qwen 4 Max | $15 | $15 | 1.5x | 1.5x | **持平** |
| MiniMax M3 | $60 | $47（2× Deal → $94） | 6.0x | 4.7x / 9.4x | 标称 Go；**Deal 后 GOAT** |
| MiniMax M3.1 Flash | $20 | $20 | 2.0x | 2.0x | **持平** |
| Grok 4.7 | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| DeepSeek V4 Pro | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| Hy3 | $60 | $70 | 6.0x | 7.0x | **GOAT** |
| Hy4 | $60 | $20 | 6.0x | 2.0x | **Go** |
| Hy4 preview | $30 | $20 | 3.0x | 2.0x | **Go** |
| MiMo V2.6 Flash | $60 | $20 | 6.0x | 2.0x | **Go** |
| MiMo V2.6 Pro | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| Muse Spark 1.2 Contributor | $60 | $20 | 6.0x | 2.0x | **Go** |
| Muse Spark 1.3 Contributor | $60 | $20 | 6.0x | 2.0x | **Go** |
| Gemini 4 Argon | $30 | ❌ 未上架（Pro 起） | 3.0x | — | **Go 独占** |

> **四项持平**：`deepseek-v4.1-flash`（$100）、`kimi-k2.7-code`（$60）、`qwen4-max`（$15）、`minimax-m3.1-flash`（$20）。
> **Go 优势项（10 款）**：`glm-5.3`、`kimi-k3.1-pro`、`hy4`、`mimo-v2.6-flash`、`muse-spark-1.2/1.3-contributor`、`qwen3.7-plus`、`qwen3.8-flash`、`minimax-m3`（标称）、`hy4-preview`。
> **GOAT 优势项（11 款）**：`glm-5.3-flash`、`hy3`，以及**全部 $15 档模型**（`kimi-k3`、`qwen3.8-max`、`grok-4.7`、`deepseek-v4-pro`、`gpt-5.6-luna`、`gpt-6-luna`、`claude-haiku-5-5`、`step-5-preview`、`mimo-v2.6-pro`）——GOAT 统一给 $20。

### 2.3 内部单价差异（仅列出两平台不同的项）

| 模型 | Go 输入/输出/缓存读 | GOAT 输入/输出/缓存读 | 说明 |
|---|---|---|---|
| Qwen3.7 Plus | $0.40 / $1.60 / **$0.04** | $0.40 / $1.60 / **$0.08** | **GOAT 缓存读贵一倍** |
| Qwen3.8 Flash | **$0.15** / $0.47 / $0.016 | **$0.16** / $0.47 / $0.016 | GOAT 输入贵 6.7% |
| Step 5 Preview | $1.00 / $2.70 / **$0.10** | $1.00 / $2.70 / **$0.05** | GOAT 缓存读便宜一半 |
| MiMo V2.6 Pro | $0.435 / $0.87 / $0.003625 | $0.435 / $0.87 / $0.0036 | 四舍五入差异 |
| 其余共有模型 | — | — | **完全一致** |

### 2.4 GOAT 独占模型（Go 未上架，含额度与请求数）

| 模型 | GOAT 月额度 | 5h / 周 / 月请求 | 单价（输入/输出/缓存读） | 备注 |
|---|---|---|---|---|
| **Ling 3.1 Flash** | **$100** | 5,850 / 14,600 / 29,200 | $0.30 / $0.90 / $0.06 | GOAT 额度最高档（10.0x） |
| **Inkling 2 Mini**（新） | **$15** | 3,450 / 8,620 / 17,200 | $0.075 / $0.30 / $0.015 | 1.05M、五档含 `off` |
| **Muse Ember** | $20 | 10,500 / 26,300 / 52,600 | $0.10 / $0.50 / $0.004 | 1.05M、五档 |
| **Tencent Hy4 Flash** | **$15** | 11,400 / 28,600 / 57,200 | $0.07 / $0.281 / $0.003 | Go 侧仅免费档，GOAT 为付费档 |
| GPT-5.6 Sol | $20 | 118 / 296 / 592 | $5.00 / $30.00 / $0.50 | GOAT 页 Intelligence 47.0 |
| Qwen 3.8 27B | $70 | 4,790 / 12,000 / 24,000 | $0.40 / $3.00 / $0.04 | — |
| **DeepSeek V4.1 Flash Fast** | $60 | 11,500 / 28,700 / 57,500 | $0.16 / $0.58 / $0.016 | 高吞吐变体 |
| **DeepSeek V4.1 Flash Ultrafast** | $20 | 641 / 1,600 / 3,210 | $2.40 / $9.60 / $0.048 | 加速档 |
| DeepSeek V4 Flash / Vision (exp) | $60 / $20 | 30,800 / 76,900 / 154,000；10,300 / 25,600 / 51,300 | $0.15 / $0.60 / $0.003 | Go 侧旧 ID 已下线 |
| **GLM-5.3 FlashX** | $20 | 945 / 2,360 / 4,720 | $0.37 / $1.25 / $0.075 | 极速档（约 5x 速度） |
| Qwen 3.8 Omni Flash | $20 | 3,940 / 9,860 / 19,700 | $0.15 / $0.47 / $0.016 | 原生全模态 |
| Qwen 3.8 Max Prime / 0902 | $20 / $20 | 131 / 327 / 654；261 / 654 / 1,310 | $4.00 / $12.00 / $0.50；$2.00 / $6.00 / $0.25 | — |
| Gemini 3.8 Flash / 3.7 Flash | $40 / $40 | 784 / 1,960 / 3,920 | $1.50 / $7.50 / $0.15 | **中国内地不可用** |
| Mistral Large 4 | $20 | 448 / 1,120 / 2,240 | $1.36 / $4.18 / $0.14 | — |
| **MiMo V2.6 Pro UltraSpeed** | **$10** | 285 / 712 / 1,420 | $4.35 / $8.70 / $0.036 | **GOAT 内唯一 $10 档** |
| Kimi K2.7 Code HighSpeed | $20 | 181 / 452 / 904 | $1.90 / $8.00 / $0.38 | 262K |
| GLM-5.2 Fast | $20 | 138 / 346 / 691 | $3.00 / $10.25 / $0.50 | — |
| Step 3.7 Flash / 3.5 Flash | $20 / $20 | 1,670 / 4,180 / 8,370；3,530 / 8,830 / 17,700 | $0.20 / $1.15 / $0.04；$0.09 / $0.30 / $0.02 | — |
| Nemotron 3 Ultra / 3.5 Super VL | $20 / $20 | 575 / 1,440 / 2,870；1,770 / 4,420 / 8,850 | $0.60 / $2.40 / $0.12；$0.20 / $0.50 / $0.04 | — |
| Inkling / Inkling Small | $20 / $20 | 396 / 989 / 1,980；709 / 1,770 / 3,550 | $1.00 / $4.05 / $0.17；$0.50 / $1.20 / $0.10 | — |
| Qwen 3.7 Flash | $20 | — | $0.03 / $0.13 / $0.006 | 全目录最低单价段 |
| **Jev / Jev 1.14.0** | $20 / $20 | **119,000 / 298,000 / 595,000** | $0.042 / $0.00 / $0.00 | **请求量天花板**；决策模型，仅 headless 与 API |
| Claude Sonnet 5.5 | $10 | 238 / 595 / 1,190 | $2.00 / $10.00 / $0.10 | GOAT 页 Intelligence 56.0（全页最高） |
| Muse Spark 1.3 / 1.2 / Open（标准版） | $20 | 428 / 1,070 / 2,140 | $1.25 / $4.25 / $0.15 | Contributor 版见 §2.1 |
| Grok 4.5 / 4.6 | $20 | 144 / 360 / 719 | $2.00 / $6.00 / $0.50 | — |
| Ornith 1.5 122B | $20 | 3,180 / 7,960 / 15,900 | $0.16 / $0.64 / $0.02 | — |
| GLM-5.1 / Kimi K2.6 / K2.5 / GLM-5 / MiniMax M2.7 / M2.5 / Qwen 3.6 Plus / 3.6 Max Preview | $20 | — | — | 老款清单，GOAT 保留完整额度行 |

---

## 三、结论与选型

### 3.1 谁更慷慨（按模型族）

| 方向 | 模型 |
|---|---|
| **GOAT 更大方（11 款）** | **`glm-5.3-flash`（$100 vs Go $60）**、`hy3`（$70 vs $60），以及**全部 Go $15 档**：`kimi-k3`、`qwen3.8-max`、`grok-4.7`、`deepseek-v4-pro`、`gpt-5.6-luna`、`gpt-6-luna`、`claude-haiku-5-5`、`step-5-preview`、`mimo-v2.6-pro`——GOAT 统一 $20 |
| **Go 更大方（10 款）** | **`glm-5.3`（$200 vs $70）**、**`kimi-k3.1-pro`（$60 vs $20）**、**`mimo-v2.6-flash` / `muse-spark-1.2` / `muse-spark-1.3`（$60 vs $20）**、`hy4`（$60 vs $20）、`qwen3.7-plus`（$60 vs $33）、`qwen3.8-flash`（$30 vs $20）、`hy4-preview`（$30 vs $20）、`minimax-m3`（$60 vs $47，**但 GOAT 有 2× Deal → 等效 $94 反超**） |
| **持平（4 款）** | `deepseek-v4.1-flash`（双方 $100）、`kimi-k2.7-code`（$60）、`qwen4-max`（$15）、`minimax-m3.1-flash`（$20） |
| **GOAT 独占（Go 无对应）** | `ling-3.1-flash` / `-1019`（$100）、`qwen 3.8 27b`（$70）、`deepseek-v4.1-flash fast`（$60）/ `ultrafast`（$20）、`qwen 3.8 omni flash`、`glm-5.3-flashx`、`step 3.x flash`、`inkling` / `inkling 2 mini`、`muse ember`、`jev`（595,000 次/月）、`mimo v2.6 pro ultraspeed`（$10） |
| **Go 独占（GOAT 无对应）** | `gemini-4-argon`（$30，**12-01 起单价翻倍**）、`longcat-2.5`（$60）、`hy4-flash-free`、`hungerg-free`、`iceman-contributor-free`、3 款 decision + 3 款 embedding |

### 3.2 P0 决策

1. **主力是 `deepseek-v4.1-flash`** → 两平台**额度完全等价**（均 $100、10.0x）；选 Go 保留 OpenCode 生态与四类端点，选 GOAT 则**请求数多 18%**（51,300 vs 43,300 / 5h）。
2. **主力是 `mimo-v2.6-flash` / `muse-spark` / `hy4` / `kimi-k3.1-pro`** → **必须留 Go**（额度 3 倍）。
3. **主力是 `glm-5.3-flash`** → **GOAT 明显更划算**（$100 vs $60，10.0x vs 6.0x）。
4. **主力是 `glm-5.3`** → **Go 领先（$200 vs GOAT $70，2.86 倍）**；Plus 对它仍是 2x，**不值得升**。
5. **需要窄领域独占模型**（Ling、Qwen 3.8 27B、GLM-5.3 FlashX、Step 3.x Flash、Inkling 2 Mini、Jev、MiMo UltraSpeed、Muse Ember）→ **GOAT 独有**。
6. **需要单模型超高请求量** → Go 侧天花板是 `muse-spark-1.2/1.3-contributor` 与 `deepseek-v4.1-flash`（45,300 / 43,300 次每 5 小时）；GOAT 侧是 `deepseek-v4.1-flash` 51,300、`jev` 119,000（决策模型，非通用编码）。
7. **价格稳定性**：两平台内部价均与 OpenRouter 渠道价格战解耦；**GOAT 的 `planBudgetSteps` 会按日期自动切档**，引用额度必须带日期。
8. **🔑 OpenDesign Go 的定位**：面值 **$220** 看似最高，但**它一分 Top Models 额度都没有**；按第三方旧实测（约 66.5%）折算约 **$146 等值**。→ **按实测等值**：GOAT（$100，几乎无缩水）≈ Go（`deepseek-v4.1-flash` $100 / `glm-5.3` $200）**> OpenDesign Go（约 $146 面值 / $97 等值）**。**OpenDesign Go 只适合"主力是 Coding Plan 模型 + 不需要 premium"的场景**。
9. **需要 $20 档** → 见第五节：**OpenDesign Go Plus**（$310 面值，15.5x）/ **CommandCode Pro**（Up to $110，5.5x）/ **Ollama Pro**（$60，唯一无窗口限制）/ **Go Teams**（$20·成员，唯一多成员）。

---

## 四、OpenCode 内部档位对比（Go $10 / Go Teams $20·成员 / Go Plus $40）

> 三档 **Token 单价完全相同**，**只差月度额度上限与成员数**。档位选择的唯一问题是：**多付的钱换到多少额度？**

### 4.1 三档机制

| 档位 | 月费 | 额度规则 | 成员数 | 官方表述 |
|---|---|---|---|---|
| **Go** | **$10** | 文本分档 **$15 / $20 / $30 / $60 / $100 / $200**；decision/embedding **$10** | **单成员** | Lower-cost access |
| **Go Teams** | **$20 / 成员 / 月** | **= Go 档 + $5 / 模型**（固定加数） | **每成员独立额度** | Every member gets their own limits, **$5/month higher than Go on every model** |
| **Go Plus** | **$40** | **= Go 档 × 2 / 3 / 4**（按模型倍率，**上限 4x**） | **单成员** | Higher usage limits |

> 🔑 **这是三条完全不同的加成逻辑**：Teams 是**加数**（+$5）、Plus 是**乘数**（×2~×4）、Go 是基准。**加数对高额度模型几乎无感、对低额度模型提升明显；乘数反之**。

### 4.2 逐模型额度全表（27 款付费文本 + 6 款 decision/embedding + 4 款免费，按 Plus 倍率分组）

| Plus 倍率 | 模型 | Go $10 | Teams $20·成员 | Plus $40 |
|:--:|---|---:|---:|---:|
| **2x**（6 款） | | | | |
| | `glm-5.3` | $200 | $205 | $400 |
| | `deepseek-v4.1-flash` | $100 | $105 | $200 |
| | `kimi-k3.1-pro` | $60 | $65 | $120 |
| | `mimo-v2.6-flash` | $60 | $65 | $120 |
| | `muse-spark-1.2-contributor` | $60 | $65 | $120 |
| | `muse-spark-1.3-contributor` | $60 | $65 | $120 |
| **3x**（5 款） | | | | |
| | `glm-5.3-flash` | $60 | $65 | $180 |
| | `kimi-k2.7-code` | $60 | $65 | $180 |
| | `minimax-m3` | $60 | $65 | $180 |
| | `qwen3.7-plus` | $60 | $65 | $180 |
| | `qwen3.8-flash` | $30 | $35 | $90 |
| **4x**（16 款） | | | | |
| | `deepseek-v4-pro` | $15 | $20 | $60 |
| | `grok-4.7` | $15 | $20 | $60 |
| | `gpt-5.6-luna` | $15 | $20 | $60 |
| | `gpt-6-luna` | $15 | $20 | $60 |
| | `claude-haiku-5-5` | $15 | $20 | $60 |
| | `kimi-k3` | $15 | $20 | $60 |
| | `mimo-v2.6-pro` | $15 | $20 | $60 |
| | `step-5-preview` | $15 | $20 | $60 |
| | `qwen3.8-max` | $15 | $20 | $60 |
| | `qwen4-max` | $15 | $20 | $60 |
| | `minimax-m3.1-flash` | $20 | $25 | $80 |
| | `hy4-preview` | $30 | $35 | $120 |
| | `gemini-4-argon` | $30 | $35 | $120 |
| | `hy3` | $60 | $65 | $240 |
| | `hy4` | $60 | $65 | $240 |
| | `longcat-2.5` | $60 | $65 | $240 |
| **$10 档（6 款）** | 3 decision + 3 embedding | $10 | $15 | $40 |
| **免费（4 款）** | `beam-free` / `hy4-flash-free` / `hungerg-free` / `iceman-contributor-free` | ∞ | ∞ | ∞ |

> **倍率分布：2x × 6 款 / 3x × 5 款 / 4x × 16 款**——**Plus 的加成重心在 4x（16 款，占 59%）**。
> ⚠️ **`gemini-4-argon` 的 $2/$10 是 50% 折扣价，12-01 起翻倍为 $4/$20**（额度不变）。

### 4.3 单位价值（每 1 美元买到多少额度）

| 模型档（Go 额度） | Go $10 | Teams $20·成员 | Plus $40 | **Teams 相对 Go** | **Plus 相对 Go** |
|---|---:|---:|---:|:--:|:--:|
| **$10 档**（6 款 decision/embedding） | 1.00 | 0.75 | 1.00 | **0.75x** | **1.00x（持平）** |
| **$15 档**（4x，10 款） | 1.50 | 1.00 | 1.50 | **0.67x** | **1.00x（持平）** |
| **$20 档**（4x：`minimax-m3.1-flash`） | 2.00 | 1.25 | 2.00 | **0.63x** | **1.00x（持平）** |
| **$30 档**（4x：`hy4-preview` / `gemini-4-argon`；3x：`qwen3.8-flash`） | 3.00 | 1.75 | 3.00（4x）/ 2.25（3x） | **0.58x** | **1.00x / 0.75x** |
| **$60 档**（4x：`hy3` / `hy4` / `longcat-2.5`；3x：4 款；2x：3 款） | 6.00 | 3.25 | 6.00 / 4.50 / 3.00 | **0.54x** | **1.00x / 0.75x / 0.50x** |
| **$100 档**（2x：`deepseek-v4.1-flash`） | **10.00** | 5.25 | 5.00 | **0.53x** | **0.50x（腰斩）** |
| **$200 档**（2x：`glm-5.3`） | **20.00** | 10.25 | 10.00 | **0.51x** | **0.50x（腰斩）** |

**读法**：
- **Go 永远是单位价值基准（1.00x）**，**Plus 在任何模型上都超不过 1.00x**——最好只是持平（4x 的 16 款）。
- **Teams 在所有档位上都是 0.51x–0.75x**——付 2 倍钱只多拿固定 `$5` 额度，**额度效率必然下降**。
- **Plus 的盈亏平衡点是 4x**：4x 持平、3x 亏 25%、2x 亏 50%。**现行清单内无 8x 档**。

### 4.4 选型结论（P0→P2）

- **P0 单人、想省钱** → **留 Go $10**。没有任何模型能让 Plus 的单位成本低于 Go（最好持平），升 Teams 则一律变贵。
- **P0 团队多人、各自独立额度** → **选 Teams $20/成员**。**这是 Teams 存在的唯一理由**；⚠️ 但**人均额度效率低于 Go**（0.51~0.75x），3 人 Teams = $60/月，已超过单人 Plus $40。
- **P1 需要"更长的天花板"而非"更便宜"** → **Plus $40** 只在 **4x 档 16 款**上做到持平；用于大项目 / 长会话防撞墙，**不要期待省钱**。
- **P1 主力是 2x 档（`glm-5.3` / `deepseek-v4.1-flash` / `kimi-k3.1-pro` / `mimo-v2.6-flash` / `muse-spark`）** → **绝对留 Go**。升 Plus 单位价值腰斩。
- **P1 主力是 3x 档（`glm-5.3-flash` / `kimi-k2.7-code` / `minimax-m3` / `qwen3.7-plus` / `qwen3.8-flash`）** → **留 Go 或换 GOAT**（GOAT 的 `glm-5.3-flash` 给 $100），**不要升 Plus**（−25%）。
- **P2 需要 Teams 又要高额度** → **Teams + 按需 credits**（超限可开 **Extra Usage**）。
- **P2 需要结构化决策 / RAG** → **Go 的 decision / embedding 模型按量等价（$10 档）**，无折扣但也无溢价；这是 GOAT / OpenDesign 目前没有的独立能力。

> ⚠️ **两档都不能解决"额度效率"问题**：三档 Token 单价完全相同，**加额度只能靠加钱**。若目标是"同样的钱跑更多 token"，正解是换更便宜的模型或走 GOAT。

---

## 五、$20 档横向对比（Ollama Pro / CommandCode Pro / OpenDesign Go Plus / OpenCode Go Teams）

| 平台 / 档位 | 月费 | 月额度 | **性价比** | 窗口限制 | 模型范围 | 额度能否跨模型混用 |
|---|---|---:|---:|---|---|---|
| **OpenDesign Go Plus** | $20（首月 $16；年付 $168 = $14/月） | **$310**（Coding Plan $290 + Top Models $20） | **15.5x** | 5 小时 + 7 天（**金额未披露**） | Coding Plan 11 款 **+ Top Models 20 款** | **两池独立**，Top Models 仅 $20 |
| **CommandCode Pro** | $20 | **Up to $110** | **5.5x** | 5h **$22** / 周 **$55** | GOAT 全部 + 更多 premium（Claude Sonnet 5.5、GPT-6 Sol 等；Opus / Fable 仍需 Max） | 按模型分档，单池 |
| **Ollama Pro** | $20（年付 $16.67） | **$60 用量** | **3.0x** | **无 5 小时 / 无每周限制** | 开放权重模型（26 款，含 Kimi K3 / GLM-5.3 / Hy4） | 单池，按 token 计费 |
| **OpenCode Go Teams** | **$20 / 成员** | **逐模型 = Go + $5**（$15→$20、$60→$65、$100→$105、$200→$205） | **0.51~0.75x**（相对 Go，见 §4.3） | 5h = 月额度 20% / 周 50% | 与 Go 同（31 文本 + 6 decision/embedding） | 按模型分档，**每成员独立** |

### 5.1 四家的结构性差异

1. **OpenDesign Go Plus 额度面值最高（$310，15.5x），但 premium 池仍很小**——$310 里 **$290 只能用于 Coding Plan 模型**，Top Models 仅 $20。若主力是 Claude Opus / GPT-6 Astra，$20 的 premium 额度很快见底；若主力是 DeepSeek V4.1 Flash Eco / GLM-5.3 Flash，$290 的性价比极高。
   > ⚠️ **面值需打折读**：旧第三方实测 Go 档宣传 credits 约缩水到 **66.5%**。按同比例折算，**$310 × 0.665 ≈ $206 等值 → 约 10.3x**，与 Go 的 `deepseek-v4.1-flash`（10.0x）基本持平。**Plus 档本身仍无公开实测，采购前建议自行核账。**
2. **CommandCode Pro 是唯一"纯加钱换额度"的档位**——与 GOAT **同样的 Token 单价**、同样的按模型分档，只把套餐级额度整体抬高：**Up to $100 → Up to $110**、5h **$20 → $22**、周 **$50 → $55**；同时把模型面扩到 Claude Sonnet 5.5、GPT-6 Sol 等。**单位价值 5.5x。**
3. **Ollama Pro 是唯一无窗口限制的**——**取消 5h / 周限制**是它相对另三家的最大差异；超出 $60 后按同价 PAYG 继续。代价是额度绝对值最低（$60），且只覆盖开放权重模型。
4. **Go Teams 是唯一支持多成员独立额度的**——不是"买更多额度"，而是"买多份独立额度"，**人均额度效率低于 Go 本身**（0.51~0.75x）。3 人 = $60/月。

### 5.2 $20 档选型结论（P0→P2）

- **P0 主力是 Coding Plan 模型 + 需要最大额度** → **OpenDesign Go Plus $20**（面值 15.5x，按 66.5% 折算约 10.3x）。⚠️ **Plus 未实测**，须自行核账。
- **P0 需要最广模型面 + premium** → **CommandCode Pro $20**（5.5x，模型面 105，几乎无缩水）。
- **P0 团队多人、各自独立额度** → **Go Teams $20/成员**（唯一多成员选项），但接受额度效率 0.51~0.75x。
- **P1 用量突发性强、怕被 5 小时窗口卡住** → **Ollama Pro $20**（唯一无窗口限制），代价是额度仅 $60 且仅开放权重模型。
- **P2 纯省钱** → **留在 $10 档更稳**：OpenCode Go 的 `glm-5.3`（20.0x）、`deepseek-v4.1-flash`（10.0x）、GOAT 的 `glm-5.3-flash`（10.0x），与 OpenDesign Go Plus 的折算值（约 10.3x）基本同档，但门槛只有一半。

> ⚠️ **跨平台不可简单比 $310 / $110 这类宣传值**：OpenDesign 的宣传额度是 **credits 面值**（第三方旧实测约 66.5%）；Ollama 的 $60 是**按 token 实付**、无窗口损耗；CommandCode 的 $100/$110 是**官方 API 等值的 credit**。三者的"1 美元额度"含金量不同。

### 5.3 Ollama 逐模型价格表（每百万 token，官网 2026-11-26 抓取）

> Ollama **按 token 计费，不按请求计费**——**没有「每月多少次请求」的换算表**，本工作区不对其请求数做估算。Pro 的 $60 / Max 的 $300 / Team 的 $1,000 是**美元用量池**，按下表费率逐 token 扣减，用尽后按同价 PAYG 继续。**官网现列 26 款**。

| 模型 | 输入 | 缓存输入 | 输出 |
|---|---:|---:|---:|
| beam | $0.125 | $0.015 | $0.40 |
| clef | $0.24 | — | — |
| **deepseek-v4.1-flash** | $0.30 | $0.006 | $1.20 |
| **deepseek-v4.1-flash (Off-Peak)** | **$0.15** | **$0.003** | **$0.60** |
| **deepseek-v4-pro** | $1.32 | $0.044 | $3.96 |
| **deepseek-v4-pro (Off-Peak)** | $0.66 | $0.022 | $1.98 |
| gemma4 | $0.14 | $0.05 | $0.40 |
| glm-5.3 | $1.40 | $0.26 | $4.40 |
| glm-5.3-flash | $0.15 | $0.03 | $0.50 |
| glm-5.2 | $1.40 | $0.26 | $4.40 |
| gpt-oss:120b | $0.15 | $0.014 | $0.60 |
| gpt-oss:20b | $0.07 | $0.035 | $0.30 |
| hy4 | $0.834 | $0.042 | $2.501 |
| inkling-2-small | $0.30 | $0.03 | $1.00 |
| kimi-k3.1-pro | $2.00 | $0.20 | $10.00 |
| kimi-k3 | $3.00 | $0.30 | $15.00 |
| kimi-k2.7-code | $0.95 | $0.19 | $4.00 |
| kimi-k2.6 | $0.95 | $0.16 | $4.00 |
| mimo-v2.6-flash | $0.14 | $0.0028 | $0.28 |
| mimo-v2.6-pro | $0.435 | $0.0036 | $0.87 |
| minimax-m3.1-flash | $0.15 | $0.015 | $0.60 |
| **minimax-m3** | **$0.60** | **$0.12** | **$2.40** |
| mistral-large-4 | $0.70 | $0.07 | $2.10 |
| muse-spark-open | $1.25 | $0.15 | $4.25 |
| nemotron-3-super | $0.015 | $0.015 | $0.60 |
| nemotron-3-ultra | $0.10 | $0.10 | $3.00 |

**两个要注意的点**：

1. **DeepSeek 系保留峰谷双档**——**官方定义：工作日 12:00–18:00 UTC 为 peak，其余时段与周末全天为 off-peak**。`deepseek-v4.1-flash` 高峰 $0.30/$1.20、空闲 $0.15/$0.60；`deepseek-v4-pro` 高峰 $1.32/$3.96、空闲 $0.66/$1.98。**Pro 用户若在工作日 12–18 UTC 集中使用，$60 池的消耗速度是空闲时的 2 倍**。
2. **⚠️ `minimax-m3` 溢价 2 倍**——Ollama 标 **$0.60/$2.40/$0.12**，而 MiniMax 官方与 CommandCode 均为 **$0.30/$1.20/$0.06**。其余多数模型与官方目录价持平。**在 Ollama 上跑 MiniMax M3 是明显的劣势项。**

> 📌 **与另三家的可比性**：Ollama 只覆盖**开放权重模型**（无 GPT-6.1 Terra / Gemini 4 Argon 这类闭源旗舰），且**没有 premium 分层**。

### 5.4 Ollama 的倍率怎么算（与另三家口径不同）

**公式**：`倍率 = 月含用量 ÷ 月费`。Ollama 的倍率是**套餐级固定值，与模型无关**。

| 档位 | 月费 | 月含用量 | **倍率** | 备注 |
|---|---:|---:|---:|---|
| Free | $0 | 少量起步额度 | **未公布** | 仅覆盖 starter models；可加 credits 走 PAYG |
| **Pro** | $20 | **$60** | **3.0x** | 年付 $200/年 折 $16.67/月 → **3.6x** |
| Max | $100 | **$300** | **3.0x** | 并发 10 |
| Team | $500 | **$1,000**（共享） | **2.0x** | 不限用户数，团队共享池 |

**四个口径差异**：

| 平台 | 倍率性质 | 分子是什么 | 结果 |
|---|---|---|---|
| **Ollama Pro** | **套餐级、统一** | 按 token 实付的美元用量池 | **3.0x，所有模型相同** |
| **OpenCode Go** | **逐模型** | 该模型专属的美元额度 | $15→1.5x / $60→6.0x / $100→10.0x / $200→20.0x（**随模型变**） |
| **CommandCode GOAT / Pro** | 逐模型为主 | 该模型专属的美元额度 | GOAT 最高 $100→10.0x；Pro 套餐级 Up to $110→5.5x |
| **OpenDesign Go / Plus** | 套餐级、**面值口径** | **credits 面值**（非官方 API 等值） | Go $220→22.0x / Plus $310→15.5x，**但需按约 0.665 折算成等值用量** |

> ⚠️ **三个必读提醒**：
> 1. **倍率高 ≠ 更便宜**。Ollama 的 3.0x 只说明"付 $20 换 $60 按表价的用量"；而 Ollama 表价多数与官方同价，**`minimax-m3` 甚至贵 2 倍**。
> 2. **逐模型倍率与统一倍率的不可比性**：Ollama 的 3.0x 是"任何模型都 3.0x"，Go 的 20.0x 是"只有 `glm-5.3` 能到 20.0x"。**拿单一数字横比会误导**。
> 3. **峰谷会改变实际可用量**：Ollama 的 DeepSeek 系保留 Peak / Off-Peak 双档（峰值 2 倍价），**同样 $60 在工作日 12–18 UTC 只能跑出空闲时段一半的 token**。
