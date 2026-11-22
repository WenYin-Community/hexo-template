---
title: AI 订阅档位横向对比：$10 档三家 · $20 档四家
date: 2026-11-22
---

> OpenCode Go、CommandCode GOAT、OpenDesign 与国产订阅的档位、额度语义与单位价值对照。数据抓取日 **2026-11-22**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据来源（**抓取日期 2026-11-22**）：
> - **覆盖范围**：**$10 档**（OpenCode Go / CommandCode GOAT / **OpenDesign Go**）+ **$20 档**（**Ollama Pro** / CommandCode Pro / OpenCode Go Teams / **OpenDesign Go Plus**）。$10 档主对比见第一至三节，$20 档见第五节。
> - **OpenCode Go**：官方文档 opencode.ai/docs/go（**5 张表**）、**Console Go 页 `opencode.ai/console/go`（公开页，无需登录；Limits / Pricing / Privacy / API 四 Tab）**、清单 API `/inference/go/v1/models`（**31 个 ID，且单价 / 三档额度 / ZDR / 峰谷倍率全在响应里**）。
> - **CommandCode**：`commandcode.ai/docs/plans/goat`（**SSR 可 curl**，5 张表）；`/docs/resources/pricing-limits`（Deals 明细 + 套餐矩阵）；`/docs/resources/usage-limits`（滚动窗口表）；`/zh/pricing`（档位与等效用量）。**页头计数：GOAT 75 / All plans 106 / Deals 3 / Free 2**；**Pricing & Limits 页 Deals 小节实列 8 条**（两页口径不一致，引用须写页源）。
> - **档位权威源**：CLI 包内官方目录 `command-code@1.93.0` → `package/dist/bundled/command-code-knowledge/reference/models.md`（**144 行 / 18,990 字节 / 104 款**）；**Provider API 在线 104 端点，与 CLI 目录逐 ID 一致、差集 0**。
> - **OpenDesign**（open-design.ai/pricing）：**Go $10（首月 $8；年付 $84/年 = $7/月）/ Go Plus $20（首月 $16；$168/年 = $14/月）/ Go Pro $100（首月 $80）/ Go Max $200（首月 $160）**；**月额度上限 Go $220 / Plus $310 / Pro $780 / Max $1,410**；**Design Plan 已更名 Coding Plan**；**官方页已公布逐模型「Est. requests / 7 天」与「Monthly usage」双列**（11 款 Coding Plan 模型 × 4 档）。
> - **Ollama**（ollama.com/pricing）：Pro **$20/月含 $60/月用量**（年付 $200/年 = $16.67/月），Max $100 含 $300，Team $500 含 $1,000 共享；**按 token 计费、取消 5 小时 / 每周窗口**，超出按同价 PAYG 继续。
> - 🎯 **本文定位**：**同价位横向对比**。**$10 档**：OpenCode Go / CommandCode GOAT / OpenDesign Go（第一至三节）；**$20 档**：Ollama Pro / CommandCode Pro / OpenDesign Go Plus / OpenCode Go Teams（第五节）。Go 内部的 Teams / Plus 档位单列于**第四节**。
> - 🎯 **额度口径（用户重点）**：**三平台同价 $10，但额度语义完全不同**——**Go 是"共享百分比池 + 逐模型 $ 分母"**（官方原话「paid models share one allowance」，$15 模型花 $1.50 与 $60 模型花 $6 都是 10%，**不可相加**）；**GOAT 是"逐模型 credits 累加成套餐级 Up to $100"**；**OpenDesign 是"Coding Plan 池 + Top Models 池"双池、且 Go 档 Top Models 为 $0**。
> - 🎯 **同模型额度对照**：`deepseek-v4.1-flash` **Go $100 = GOAT $100**（持平）；`glm-5.3-flash` **Go $60 vs GOAT $100**（GOAT 高 67%）；`glm-5.3` **Go $500 vs GOAT $70**（促销期内 Go 高 7 倍，但 Go 侧 $500 属 11-22 到期促销）——**两平台不可混用同一数字**。
> - 月费：**$10 档** = Go $10 / GOAT $10 / OpenDesign Go $10；**$20 档** = Ollama Pro $20 / CommandCode Pro $20 / OpenDesign Go Plus $20 / Go Teams $20·成员；其余：Go Plus $40 / CommandCode Go $1 / Provider $15 / Max 10× $100 / Max 20× $200 / Team Pro $40 / OpenDesign Go Pro $100 / Go Max $200 / Ollama Max $100 / Team $500；折算汇率：1 美元 ≈ 6.7131 元人民币（中国外汇交易中心 2026-11-20 中间价，每轮重取）
> - **Go Teams / Go Plus 简介**（详表见第四节）：三档 **Token 单价完全相同**，只差月度额度与成员数——**Teams = Go + $5/模型、每成员独立额度**；**Plus = Go × 2 / 3 / 4 倍（上限 4x，无更高档）、仅限单成员**。
> - ⚠️ **退役现状**：`stealth/pixel-canary`、`stealth/space-bunny-alpha`、**`stealth/cat-jam:free`（GOAT 侧同步下架）**、**`space-bunny` / `space-bunny-free`（Go/Zen 全线退出）**、`xiaomi/mimo-v2.5` 系——均已从网关 API 与 CLI 目录同步移除。

---

## 一、套餐基础对比

| 维度 | **OpenCode Go** | **CommandCode GOAT** | **OpenDesign Go** |
|---|---|---|---|
| 月费 | **$10** | **$10** | **$10**（首月 $8；**黑五首年 $84** = $7/月，次年 $120/年） |
| 官方定位 | Lower-cost access | Up to $100 credits（10x） | Coding Plan 模型额度 |
| 额度语义 | **共享百分比池 + 逐模型 $ 分母**（官方原话「paid models **share one allowance**」） | **逐模型 credits 累加**成套餐级 Up to $100 | **双池**：Coding Plan 池 + Top Models 池 |
| **月额度上限** | **无套餐级总额**；逐模型分 **6 档**：$15 / $20 / $30 / $60 / $100 / **$500**（$500 仅 `glm-5.3`，**属 11-22 到期促销**） | 逐模型分档（$10 / $20 / $40 / $50 / $60 / $70 / $100），套餐级 **Up to $100** | **$220**（Coding Plan 最高 $220 + **Top Models $0**） |
| 5 小时窗口 | **月额度 × 20%**（自首次使用起 5 小时） | **Up to $20**（套餐级） | 存在 5 小时窗口，**金额未在页面披露** |
| 7 天 / 周窗口 | **月额度 × 50%**（周一 00:00 UTC 重置） | **Up to $50**（套餐级） | 逐模型给「**Est. requests / 7 天**」（如 DeepSeek V4 Pro 3,120 次） |
| 模型范围 | **31 款**（API / docs / Console 三源一致） | **GOAT 75 款**（All plans 106 / 网关 104 / CLI 104） | **Coding Plan 11 款**（另有 Top Models 20 款**不含**） |
| premium 模型 | 部分（`gpt-6-luna`、`kimi-k3`、`grok-4.7`、`claude-haiku-5-5` 等） | 有（GPT / Claude / Gemini 系，Opus 需 Max） | **Go 档完全不可用**（Claude / GPT-6 Astra / Gemini 4 系列需 **Go Plus** 起） |
| 免费 / 兜底 | Zen `-free` 11 款 + Big Pickle；可开 **Extra Usage** 走 Console credits | 免费 2 款（各 1,000 次/日）+ PAYG 回落 | Free 版**无周期性额度**（仅注册送一次性体验额度）；额度用尽需升档 / 自动充值 / BYOK |
| API 支持 | 三协议（`/inference/go/{openai,anthropic,google}/v1*`） | 三协议（Chat Completions / Responses / Messages） | **OpenDesign API key**，可用于 Codex / Claude Code / OpenCode / Hermes，**与 App 共用同一份额度** |
| 并发 | 未公布 | 未公布 | **10 个共享并发任务**（按 workspace 计，加人不加名额） |
| 成员数 | 仅限单成员 workspace | Team Pro / Enterprise 支持团队 | **邀请成员免费、人数不限**（额度与并发共享） |

### 1.1 OpenDesign 的额度结构（与另两家口径不同）

> OpenDesign 的付费计划**买的不是功能，而是托管模型额度**——App 本身开源免费，接本地 agent 或自带 key 则 $0 花费。

**两类额度池，决定能用哪些模型**：

| 额度池 | 覆盖模型 | Go 档额度 |
|---|---|---|
| **Coding Plan** | 11 款：DeepSeek V4.1 Flash / **V4.1 Flash Eco** / V4 Flash / **V4 Pro**、MiniMax M3.1 Flash、GLM-5.3 Flash、Kimi K2.7 Code、Hy4 Preview、MiMo V2.6 Flash / Pro、**DeepSeek V4 Flash Vision Exp** | **最高 $220/月**（官方「Total monthly credits」） |
| **Top Models** | 20 款：Claude Fable 5.2 / 5.1、Opus 5.5、GPT-6 Astra / Sol / 6.1 Terra、Gemini 4 Neon / Hydrogen / Argon、Kimi K3 / K3.1 Pro、Grok 4.7、Claude Sonnet 5.5、Muse 系等 | **$0（Go 档不含）** |
| **图像 / 视频 / 音频** | 11 款（Seedream、SeeDance、GPT Image 2.x、Wan 2.7、ElevenLabs 等），**仅 API 可调、客户端不提供** | 需更高档 |

> 🔑 **扣费顺序官方原话**：「Coding Plan calls consume Coding Plan credits first, then remaining Top Model Credits (Go has none). Top Model calls consume Top Model Credits directly.」——**Go 档调用 premium 模型会直接失败，不是"扣更多"**。
> 🔑 **额度不结转**：每计费周期重置；**体验额度不按 5 小时 / 7 天周期重置，且不能用于 API**。

**全档位对照（官方页 11-22 抓取）**：

| 档位 | 月付 | 首月价 | 年付首年 | 次年续费 | **月总额度** | Coding Plan | Top Models | 并发 | Top 模型数 |
|---|---|---|---|---|---|---|---|---|---|
| Free | $0 | — | — | — | 无周期性额度 | — | — | — | — |
| **Go** | **$10** | $8 | **$84（$7/月）** | $120/年 | **$220** | $220 | **$0** | 10 | 11 款 |
| **Go Plus** | **$20** | $16 | **$168（$14/月）** | $240/年 | **$310** | $290 | **$20** | 20 | 20 款 |
| **Go Pro** | **$100** | $80 | **$720（$60/月）** | $1,200/年 | **$780** | $660 | $120 | 30 | 30 款 |
| **Go Max** | **$200** | $160 | **$1,200（$100/月）** | $2,400/年 | **$1,410** | $1,110 | $300 | 50 | 50 款 |

> ⚠️ **黑五促销进行中**（页面倒计时约 1 天 19 时）：年付首年折扣、Claude / GPT 系列 **9 折**、**DeepSeek V4.1 Flash 与 V4.1 Flash Eco 7 天无限用**。**首年价属促销，次年按上表续费价**，预算须按续费价算。

**Coding Plan 逐模型额度（官方页「Coding Plan usage」表，4 档全列）**：

| 模型 | Go 7 天请求 / 月额度 | Go Plus | Go Pro | Go Max |
|---|---|---|---|---|
| **DeepSeek V4.1 Flash Eco** | **266,933 次 / $220** | 359,270 / $290 | 800,800 / $660 | 1,346,800 / $1,110 |
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

> 🔑 **读法**：与 Go 的语义相同——「Monthly usage」是**该模型单独用到月额度上限时的分母**，**不是可累加的子额度**；表中「Go 7 天请求」是官方按典型用量估的**请求数**（OpenDesign 是唯一同时公布请求数与美元额度的平台）。
> 🔑 **与另两家的三个结构性差异**：
> 1. **双池且 premium 另计**——Go 的 $220 **一分 Top Models 都不能用**；GOAT 与 Go 均可在同一额度池内选 premium 模型（受逐模型额度限制）。
> 2. **年付折扣力度最大**——黑五首年 Go $84 折 $7/月，是三家 $10 档里唯一有**年付 + 首年折扣**的。
> 3. **⚠️ 面值 ≠ 官方 API 等值**——第三方网关实测（OctaFuse，经 DeepSeek 官方价表反推）显示其 credits 折算约为面值的 **66.5%**；同口径下 GOAT 的 $100 几乎无缩水。**采购应以实测等值为准。**

### CommandCode 全档位矩阵（11-22）

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

> **四源计数口径不同，引用必须写明来源**：网关 API **104** / CLI **1.93.0** 目录 **104**（**两源逐 ID 一致，差集 0**）/ GOAT 档位文档页头 **GOAT plan 75 / All plans 106 / Deals 3 / Free 2** / Pricing & Limits 页头 **All 108 / Deals 3 / Free 2**。⚠️ **Deals 徽章两页都写 3，但 Pricing & Limits 的 Deals 小节实际列了 8 条**——徽章数与条目数不是一回事，引用须写清。页面计数与目录口径不同，任一源单独引用都可能给出错误数。
> **滚动窗口按"credit 价值"计量**，不是请求数——便宜模型（如 DeepSeek V4 Flash）能把同一份额度拉长得多。**套餐级额度按档位递进：Go $10 → GOAT $100 → Pro $110 → Max 10× $150 → Max 20× $300**（`Up to` 表示按逐模型分档累加的上限）。

### GOAT 功能与限制要点

- **思考强度调节**：内置 `/effort [level]` + 全局 `effort` / 逐模型 `reasoningEffort`（low→max，**按模型支持**；不支持时提示 "effort isn't supported for that model"）。
- **Provider API**：Chat Completions + Responses + Messages 三协议；**除 Command Code Go 计划外全部计划有 API 访问**（Go 计划用 Key 调 Provider API 返回 **403 `upgrade_required`**）；Provider 套餐 $15/月 + **$1.01 卡费**，PAYG 无加价、Deals 自动应用；模型命名 `provider/model-slug`（Claude 系无前缀，如 `claude-sonnet-5-5`）；流式 usage 自动回传，无需 opt-in；另有 **422 `cmd_zdr_no_providers`**（ZDR 下无可用 provider）。
- **Deals 清单（Pricing & Limits 页 Deals 小节实列 8 条）**：**提额 6 条** —— `deepseek-v4.1-flash`（$10 Go / **$100 GOAT** / $110 Pro）、`glm-5.3-flash`（同左，while capacity lasts）、`ling-3.1-flash`（$100 GOAT / $110 Pro）、`ling-3.1-flash-1019`（$100 GOAT / $110 Pro）、`glm-5.3`（$10 Go / $70 GOAT / $80 Pro）、`minimax-m3`（**2× usage**）；**免费 2 条** —— `glyph-cluster:free`、`flint-v1.0:free`（各 **1,000 次/日**，且不消耗额度）。
- **免费档现为 2 条**：**`recursive/flint-v1.0:free`**（Flint，262K）、`glyph-cluster:free`（**各 1,000 次/日**，while the stealth preview lasts）。⚠️ **已退出**：`thinkingmachines/inkling-2-small:free`、`poolside/laguna-s-2.1-free`、`stealth/crouton-alpha`、`reflection/beam:free`、`minimax-m3.1-flash:free`、`ornith-1.5-122b:free`。
- **地理限制**：**GPT-5.6 Luna（OpenAI）与 Gemini 3.7 / 3.8 Flash（Google）在中国内地不可用**（官方 Geo model limits 表）。
- **⚠️ 额度是"共享单池"**：低额度模型按比例消耗更多 credits，**不可把各模型额度简单相加**；滚动窗口按月度额度比例自动生成（GOAT 套餐级 Up to $100 → 5h $20 / 周 $50）。
- **开源仍未兑现**（页面口径 delay "later this month"）。

> **🔄 新模型查询要求（每次核对必做）**：四源交叉 diff —— ① `curl -s https://api.commandcode.ai/provider/v1/models`（**104**）；② CLI 包内目录（`command-code@1.93.0`，**104 款 / 144 行 / 18,990 字节**）；③ GOAT 档位文档页头（**75 / 106 / 3 / 2**）；④ Pricing & Limits 页（**All 108 / Deals 3 / Free 2**，Deals 小节实列 **8 条**）。**四源现已收敛到 104 款（差集 0），但页面计数口径仍各不相同。**
> Go 侧：`curl -sL https://opencode.ai/inference/go/v1/models`（**31 个 ID**）对 docs/go 正文（**31 款**）对 Console Go 页（**31 款**）——**三源一致**。
> **档位与价格以 CLI 包内官方目录为准**：`npm pack command-code@latest` → `tar xzOf command-code-*.tgz package/dist/bundled/command-code-knowledge/reference/models.md`（含 Context / Efforts / $每1M / Min plan；CHANGELOG 同步取以捕捉退役公告）。⚠️ **包体约 4.3 MB，禁止全量 `tar xzf`（沙箱 /tmp 配额不足），必须 `tar xzOf` 流式取单文件**。
> ⚠️ **`commandcode.ai/goat` 已改为用户主页（重定向 `/zh/goat`），档位页现为 `/docs/plans/goat`（SSR 可 curl）**；`/pricing` 与 `/zh/pricing` 亦为 SSR。完整规则见 [OpenCode Go 模型配置指南](/model-intel/opencode-go-model-guide/) 同名节。

**关键差异**：GOAT 有**套餐级限额 Up to $100 / 5h $20 / 周 $50**；**Go 没有套餐级总额**，只有**逐模型 $ 分母 + 共享百分比池**（5h = 20%、周 = 50%）。**Go 逐模型分 6 档（$15 / $20 / $30 / $60 / $100 / $500），GOAT 分 8 档（$10 ~ $100）**——**套餐级数字只是默认参考值，比较必须落到逐模型，见第二节。**

> **Go 内部档位（Teams / Plus）不与 GOAT 混比**——它们属于 OpenCode 生态内的升档选项，详见**第四节「OpenCode 内部档位对比」**。

---

## 二、逐模型额度对比

### 2.1 两边均有：请求数与月额度对比

> **Go 列**取自 Console Go 页 Limits Tab 的「Est. requests / 5 hr」+ API 的 `go.monthly_usage.go`；**GOAT 列**取自 `docs/plans/goat` 的「Requests / 5 hours」表 + 月 credits 表（**65 款**有完整三列）。⚙️ 注意：**两张请求数表各自按自家"典型请求"估算，token 口径不同，不能当精确换算**。

| 模型 | Go 5h 请求 | GOAT 5h 请求 | Go 月额度 | GOAT 月额度 | 结论 |
|---|---|---|---|---|---|
| **`deepseek-v4.1-flash`** | 43,300 | **51,300** | **$100** | **$100** | **额度完全持平**；GOAT 请求数 +18%（其典型 token 口径更小） |
| **`glm-5.3-flash`** | 6,320 | **11,800** | $60 | **$100** | **GOAT 双高**：额度 +67%、请求 +87% |
| **`glm-5.3`** | 6,600 | 947 | **$500**（促销） | $70 | **Go 额度 7 倍**——但 Go 侧 $500 属 11-22 到期促销，回落至 $15 后 GOAT 反超 |
| `kimi-k3` | 98 | **196** | $15 | $20 | GOAT 请求 +100%、额度 +33% |
| `kimi-k3.1-pro` | 147 | **294** | $15 | $20 | GOAT 请求 +100%、额度 +33% |
| `kimi-k2.7-code` | 994 | **1,080** | **$60** | **$60** | 额度持平；GOAT 请求 +9% |
| **`longcat-2.0`** | **11,400** | 12,800 | **$60** | $50 | **Go 额度 +20%**；GOAT 请求 +12% |
| `step-5-preview` | 426 | **1,040** | $15 | $20 | GOAT 请求 **+144%**、额度 +33% |
| `claude-haiku-5-5` | 3,850 | **5,970** | $15 | $20 | GOAT 请求 +55%、额度 +33% |
| `gpt-6-luna` | 4,230 | **6,060** | $15 | $20 | GOAT 请求 +43%、额度 +33% |
| `gpt-5.6-luna` | 2,050 | **2,960** | $15 | $20 | GOAT 请求 +44%、额度 +33% |
| `qwen3.8-max` | 162 | **261** | $15 | $20 | GOAT 请求 +61%、额度 +33% |
| `qwen3.7-plus` | **4,310** | 1,420 | **$60** | $33 | **Go 双高**：额度 +82%、请求 3 倍 |
| `qwen3.8-flash` | **5,400** | 3,910 | **$30** | $20 | **Go 额度 +50%**、请求 +38% |
| `minimax-m3` | **3,210** | 2,770 | **$60** | $47 | Go 额度 +28%；**GOAT 另有 `2× usage` Deal → 等效 $94**，实际反超 |
| `minimax-m3.1-flash` | 3,880 | **4,230** | **$20** | **$20** | 额度持平；GOAT 请求 +9% |
| `grok-4.7` | **169** | 144 | $15 | $20 | GOAT 额度 +33%；Go 请求 +17% |
| `deepseek-v4-pro` | 1,040 | **1,980** | $15 | $20 | GOAT 请求 +90%、额度 +33% |
| **`mimo-v2.6-flash`** | **30,100** | 13,000 | **$60** | $20 | **Go 额度 3 倍、请求 2.3 倍** |
| `mimo-v2.6-pro` | 3,260 | **5,700** | $15 | $20 | GOAT 请求 +75%、额度 +33% |
| **`muse-spark-1.3-contributor`** | **45,300** | 428 | **$60** | $20 | **Go 额度 3 倍、请求 106 倍**（GOAT 侧口径极保守） |
| **`ling-3.1-flash` / `-1019`** | ❌ 未上架 | 5,850 | — | **$100** | **GOAT 独占**（Deal 后仍 $100） |

> **读数小结**：
> - **GOAT 在"小额度档"（$15 → $20）普遍多给 33% 额度**，且请求数估算更宽松——Go 的 $15 档模型（`kimi-k3`、`qwen3.8-max`、`grok-4.7`、`deepseek-v4-pro`、`gpt-*`、`claude-haiku-5-5`、`step-5-preview`、`mimo-v2.6-pro`）**几乎全是 GOAT 更优**。
> - **Go 在"高额度档"更慷慨**：`mimo-v2.6-flash`（$60 vs $20）、`muse-spark-1.3`（$60 vs $20）、`qwen3.7-plus`（$60 vs $33）、`longcat-2.0`（$60 vs $50）——这几款是 Go 的强项。
> - **`glm-5.3-flash` 是 GOAT 最明显的优势项**（$100 vs $60），而 `glm-5.3` 反之（促销期）。

### 2.2 月额度（Credits）逐模型对比

> 性价比口径：**月额度 ÷ 月费 $10**（Go 与 GOAT **同价 $10**，可直接比）。Go 侧升档（Teams / Plus）的性价比另见**第四节**。**Go 列取 `go.monthly_usage.go`，GOAT 列取 GOAT 页月 credits 表**，均为 11-22 实测。

| 模型 | Go 月额度 | GOAT 月额度 | Go 性价比 | GOAT 性价比 | 胜出 |
|---|---|---|---|---|---|
| DeepSeek V4.1 Flash | $100 | $100 | 10.0x | 10.0x | **持平** |
| GLM-5.3 Flash | $60 | $100 | 6.0x | 10.0x | **GOAT** |
| GLM-5.3 | $500 | $70 | 50.0x | 7.0x | **Go** |
| Kimi K3 | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| Kimi K3.1 Pro | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| Kimi K2.7 Code | $60 | $60 | 6.0x | 6.0x | **持平** |
| LongCat 2.0 | $60 | $50 | 6.0x | 5.0x | **Go** |
| Step 5 Preview | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| Claude Haiku 5.5 | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| GPT-5.6 Luna | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| GPT-6 Luna | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| Qwen 3.8 Max | $15 | $20 | 1.5x | 2.0x | **GOAT** |
| Qwen 3.7 Plus | $60 | $33 | 6.0x | 3.3x | **Go** |
| Qwen 3.8 Flash | $30 | $20 | 3.0x | 2.0x | **Go** |
| Qwen 4 Max | $15 | $15 | 1.5x | 1.5x | **持平** |
| MiniMax M3 | $60 | $47 | 6.0x | 4.7x | **Go** |
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
| Gemini 4 Argon | $30 | ❌ 未上架 | 3.0x | — | **Go 独占** |

> **四项持平**：`deepseek-v4.1-flash`（$100）、`kimi-k2.7-code`（$60）、`qwen4-max`（$15）、`minimax-m3.1-flash`（$20）——**同额度，选哪边取决于请求数与生态**。
> **Go 优势项（9 款）**：`glm-5.3`（$500 促销）、`hy4`（$60 vs $20）、`mimo-v2.6-flash`（$60 vs $20）、`muse-spark-1.2/1.3-contributor`（$60 vs $20）、`qwen3.7-plus`（$60 vs $33）、`qwen3.8-flash`（$30 vs $20）、`minimax-m3`（$60 vs $47，但 GOAT 有 `2× usage` Deal → 等效 $94 反超）、`longcat-2.0`（$60 vs $50）、`hy4-preview`（$30 vs $20）。
> **GOAT 优势项（12 款）**：`glm-5.3-flash`（$100 vs $60）、`hy3`（$70 vs $60），以及**全部 $15 档模型**（`kimi-k3`、`kimi-k3.1-pro`、`qwen3.8-max`、`grok-4.7`、`deepseek-v4-pro`、`gpt-5.6-luna`、`gpt-6-luna`、`claude-haiku-5-5`、`step-5-preview`、`mimo-v2.6-pro`）——GOAT 统一给 $20。
> ⚠️ **Go 的 $15 档是最大劣势**：Go 侧 12 款模型停在 $15，GOAT 同款给 $20（+33%）；而 Go 的高额度集中在 `mimo` / `muse` / `qwen-plus` 这几个族。

### 2.3 内部单价差异（仅列出两平台不同的项）

| 模型 | Go 输入/输出/缓存读 | GOAT 输入/输出/缓存读 | 说明 |
|---|---|---|---|
| Qwen3.7 Plus | $0.40 / $1.60 / **$0.04** | $0.40 / $1.60 / **$0.08** | **GOAT 缓存读贵一倍** |
| Qwen3.8 Flash | **$0.15** / $0.47 / $0.016 | **$0.16** / $0.47 / $0.016 | GOAT 输入贵 6.7% |
| Step 5 Preview | $1.00 / $2.70 / **$0.10** | $1.00 / $2.70 / **$0.05** | GOAT 缓存读便宜一半 |
| MiMo V2.6 Pro | $0.435 / $0.87 / $0.003625 | $0.435 / $0.87 / $0.0036 | 四舍五入差异 |
| 其余共有模型 | — | — | **完全一致**（GLM-5.3 / Kimi K3 / Kimi K3.1 Pro / Kimi K2.7 Code、LongCat 2.0、DS V4.1 Flash / V4 Pro、MiMo V2.6 Flash / Pro、MiniMax M3 / M3.1 Flash、Muse Spark Contributor、Qwen4 Max、Qwen3.8 Max、Hy3 / Hy4 / Hy4 preview、Grok 4.7、GPT-5.6 Luna / GPT-6 Luna、Claude Haiku 5.5） |

### 2.4 GOAT 独占模型（Go 未上架，含额度与请求数）

| 模型 | GOAT 月额度 | 5h / 周 / 月请求 | 单价（输入/输出/缓存读） | 备注 |
|---|---|---|---|---|
| **Ling 3.1 Flash** | **$100** | 5,850 / 14,600 / 29,200 | $0.30 / $0.90 / $0.06 | GOAT 额度最高档（10.0x）；GOAT 页 Intelligence 41.1 |
| GPT-5.6 Sol | $20 | 118 / 296 / 592 | $5.00 / $30.00 / $0.50 | GOAT 页 Intelligence 47.0 |
| Qwen 3.8 27B | $70 | 4,790 / 12,000 / 24,000 | $0.40 / $3.00 / $0.04 | |
| **DeepSeek V4.1 Flash Fast** | $60 | 11,500 / 28,700 / 57,500 | $0.16 / $0.58 / $0.016 | V4.1 Flash 高吞吐变体，随主档同步 |
| DeepSeek V4 Flash / V4 Flash Vision (exp) | $60 / $20 | 30,800 / 76,900 / 154,000；10,300 / 25,600 / 51,300 | $0.15 / $0.60 / $0.003 | Go 侧旧 ID 已下线 |
| **GLM-5.3 FlashX** | $20 | 945 / 2,360 / 4,720 | $0.37 / $1.25 / $0.075 | 同基座极速档（约 5x 速度、2.5x 价格） |
| Qwen 3.8 Omni Flash | $20 | 3,940 / 9,860 / 19,700 | $0.15 / $0.47 / $0.016 | 原生全模态 |
| Qwen 3.8 Max Prime / Max 0902 | $20 / $20 | 131 / 327 / 654；261 / 654 / 1,310 | $4.00 / $12.00 / $0.50；$2.00 / $6.00 / $0.25 | |
| Gemini 3.8 Flash / 3.7 Flash | $40 / $40 | 784 / 1,960 / 3,920 | $1.50 / $7.50 / $0.15 | **中国内地不可用**（Geo 限制） |
| Mistral Large 4 | **$20**（Deal 已于 10-20 到期，由 $40 回落） | 896 / 2,240 / 4,480 | $1.36 / $4.18 / $0.14 | |
| **MiMo V2.6 Pro UltraSpeed** | **$10** | 285 / 712 / 1,420 | $4.35 / $8.70 / $0.036 | **GOAT 内唯一 $10 档**（超速档按 10 倍价计） |
| Kimi K2.7 Code HighSpeed | $20 | 181 / 452 / 904 | $1.90 / $8.00 / $0.38 | 262K |
| GLM-5.2 Fast | $20 | 138 / 346 / 691 | $3.00 / $10.25 / $0.50 | |
| Step 3.7 Flash / 3.5 Flash | $20 / $20 | 1,670 / 4,180 / 8,370；3,530 / 8,830 / 17,700 | $0.20 / $1.15 / $0.04；$0.09 / $0.30 / $0.02 | |
| Nemotron 3 Ultra / 3.5 Super VL | $20 / $20 | 575 / 1,440 / 2,870；1,770 / 4,420 / 8,850 | $0.60 / $2.40 / $0.12；$0.20 / $0.50 / $0.04 | |
| Inkling / Inkling Small | $20 / $20 | 396 / 989 / 1,980；709 / 1,770 / 3,550 | $1.00 / $4.05 / $0.17；$0.50 / $1.20 / $0.10 | |
| Qwen 3.7 Flash | $20 | — | $0.03 / $0.13 / $0.006 | 全目录最低单价段 |
| **Jev / Jev 1.14.0** | $20 / $20 | **119,000 / 298,000 / 595,000** | $0.042 / $0.00 / $0.00 | **请求量天花板**；决策模型，仅 headless `cmd -p` 与 Provider API，不在 `/model` |
| Claude Sonnet 5.5 | $10 | 238 / 595 / 1,190 | $2.00 / $10.00 / $0.10 | GOAT 页 Intelligence 56.0（全页最高） |
| Muse Spark 1.3 / 1.2 / Open（标准版） | $20 | 428 / 1,070 / 2,140 | $1.25 / $4.25 / $0.15 | 标准价版；Contributor 版见 §2.1 |
| Grok 4.5 / 4.6 | $20 | 144 / 360 / 719 | $2.00 / $6.00 / $0.50 | |
| GLM-5.1 / Kimi K2.6 / Kimi K2.5 / GLM-5 / MiniMax M2.7 / M2.5 / Qwen 3.6 Plus / 3.6 Max Preview | $20 | — | — | 老款清单，GOAT 保留完整额度行 |

---

## 三、结论与选型

### 3.1 谁更慷慨（按模型族）

| 方向 | 模型 |
|---|---|
| **GOAT 更大方（12 款）** | **`glm-5.3-flash`（$100 vs Go $60）**、`hy3`（$70 vs $60），以及**全部 Go $15 档**：`kimi-k3`、`kimi-k3.1-pro`、`qwen3.8-max`、`grok-4.7`、`deepseek-v4-pro`、`gpt-5.6-luna`、`gpt-6-luna`、`claude-haiku-5-5`、`step-5-preview`、`mimo-v2.6-pro`——GOAT 统一 $20 |
| **Go 更大方（9 款）** | **`mimo-v2.6-flash` / `muse-spark-1.2` / `muse-spark-1.3`（$60 vs $20）**、`hy4`（$60 vs $20）、`qwen3.7-plus`（$60 vs $33）、`minimax-m3`（$60 vs $47，**但 GOAT 有 2× Deal → 等效 $94 反超**）、`longcat-2.0`（$60 vs $50）、`hy4-preview`（$30 vs $20）、`qwen3.8-flash`（$30 vs $20） |
| **持平（4 款）** | `deepseek-v4.1-flash`（**双方 $100**）、`kimi-k2.7-code`（$60）、`qwen4-max`（$15）、`minimax-m3.1-flash`（$20） |
| **GOAT 独占（Go 无对应）** | `ling-3.1-flash` / `-1019`（$100）、`qwen 3.8 27b`（$70）、`deepseek-v4.1-flash fast`（$60）、`ds v4.1 flash ultrafast`（$20）、`qwen 3.8 omni flash`、`glm-5.3-flashx`、`step 3.x flash`、`inkling`、`jev`（**595,000 次/月**）、`mimo v2.6 pro ultraspeed`（$10）、`muse ember` |
| **Go 独占（GOAT 无对应）** | `gemini-4-argon`（$30，**12-01 起单价翻倍**）、`longcat-2.5-free`、`hy4-flash-free`、`iceman-contributor-free` |

### 3.2 P0 决策

1. **主力是 `deepseek-v4.1-flash`** → 两平台**额度完全等价**（均 **$100**、10.0x）；选 Go 保留 OpenCode 生态与三协议端点，选 GOAT 则**请求数多 18%**（51,300 vs 43,300 / 5h）。
2. **主力是 `mimo-v2.6-flash` / `muse-spark` / `hy4`** → **必须留 Go**（额度 3 倍）。
3. **主力是 `glm-5.3-flash`** → **GOAT 明显更划算**（**$100 vs $60，10.0x vs 6.0x**，额度多 67%）。
4. **主力是 `glm-5.3`** → **Go 在促销期内大幅领先（$500 vs GOAT $70）**，但**该 $500 于 2026-11-22 到期**，长期档位为 $15——**若届时回落，GOAT 的 $70 反超 4.7 倍**。**这是全套数据里时效性最强的一项，决策前必须重抓。**
5. **需要窄领域独占模型**（Ling、Qwen 3.8 27B、GLM-5.3 FlashX、Step 3.x Flash、Inkling、Jev、MiMo UltraSpeed、Muse Ember）→ **GOAT 独有**，Go 无替代。
6. **需要单模型超高请求量** → Go 侧天花板是 `muse-spark-1.2/1.3-contributor` 与 `deepseek-v4.1-flash`（**45,300 / 43,300 次每 5 小时**）；GOAT 侧是 `deepseek-v4.1-flash` 51,300、`jev` 119,000（决策模型，非通用编码）。
7. **价格稳定性**：两平台内部价均与 OpenRouter 渠道价格战解耦；**GOAT 独有的 `planBudgetSteps` 会按日期自动切档**（促销窗口起止由该机制驱动），**引用额度必须带日期**。
8. **🔑 OpenDesign Go 的定位**：面值 **$220** 看似最高（Go 逐模型最高 $500 促销 / GOAT 套餐级 Up to $100），但**它一分 Top Models 额度都没有**，且第三方实测显示宣传值约缩水到**面值的 66.5%（$220 → 约 $146 等值）**。→ **按实测等值**：GOAT（$100，几乎无缩水）≈ Go（`deepseek-v4.1-flash` $100）**> OpenDesign Go（约 $146 面值 / $97 等值）** 三者基本同档。**OpenDesign Go 只适合"主力是 Coding Plan 模型 + 不需要 premium"的场景**；要 premium 必须上 **Go Plus $20**。
9. **需要 $20 档** → 见第五节：**OpenDesign Go Plus**（$310 面值，15.5x）/ **CommandCode Pro**（Up to $110，5.5x）/ **Ollama Pro**（$60，唯一无窗口限制）/ **Go Teams**（$20·成员，唯一多成员）。

---

## 四、OpenCode 内部档位对比（Go $10 / Go Teams $20·成员 / Go Plus $40）

> 三档 **Token 单价完全相同**（docs/go 定价表三档共用 Input / Output / Cached Read / Cached Write），**只差月度额度上限与成员数**。因此档位选择的唯一问题是：**多付的钱换到多少额度？**

### 4.1 三档机制

| 档位 | 月费 | 额度规则 | 成员数 | 官方表述 |
|---|---|---|---|---|
| **Go** | **$10** | 逐模型分档 **$15 / $20 / $30 / $60 / $100 / $500**（**共享百分比池 + 逐模型 $ 分母**） | **单成员** | Lower-cost access |
| **Go Teams** | **$20 / 成员 / 月** | **= Go 档 + $5 / 模型**（固定加数，非倍率） | **每成员独立额度** | Every member gets their own limits, **$5/month higher than Go on every model** |
| **Go Plus** | **$40** | **= Go 档 × 2 / 3 / 4**（按模型倍率，**上限 4x**） | **单成员** | Higher usage limits |

> 🔑 **这是三条完全不同的加成逻辑**：Teams 是**加数**（+$5）、Plus 是**乘数**（×2~×4）、Go 是基准。**加数对高额度模型几乎无感、对低额度模型提升明显；乘数反之**——这一点决定了两者的适用场景完全不同。
> 🔑 **额度是共享的**：官方原话「The paid models you use on Go **share one allowance**」「**Switching models draws from the same allowance**」——**逐模型 $ 数字只是该模型"独用到 100%"时的分母**，不是可累加的子额度。

### 4.2 逐模型额度全表（27 款付费模型 + 4 款免费，按 Plus 倍率分组）

| Plus 倍率 | 模型 | Go $10 | Teams $20·成员 | Plus $40 |
|:--:|---|---:|---:|---:|
| **2x**（5 款） | | | | |
| | `muse-spark-1.2-contributor` | $60 | $65 | $120 |
| | `muse-spark-1.3-contributor` | $60 | $65 | $120 |
| | `mimo-v2.6-flash` | $60 | $65 | $120 |
| | **`deepseek-v4.1-flash`** | $100 | $105 | $200 |
| | **`glm-5.3`** | $500 | $505 | $1,000 |
| **3x**（5 款） | | | | |
| | `qwen3.8-flash` | $30 | $35 | $90 |
| | `glm-5.3-flash` | $60 | $65 | $180 |
| | `kimi-k2.7-code` | $60 | $65 | $180 |
| | `minimax-m3` | $60 | $65 | $180 |
| | `qwen3.7-plus` | $60 | $65 | $180 |
| **4x**（17 款） | | | | |
| | `deepseek-v4-pro` | $15 | $20 | $60 |
| | `grok-4.7` | $15 | $20 | $60 |
| | `gpt-5.6-luna` | $15 | $20 | $60 |
| | `gpt-6-luna` | $15 | $20 | $60 |
| | `claude-haiku-5-5` | $15 | $20 | $60 |
| | `kimi-k3` | $15 | $20 | $60 |
| | `mimo-v2.6-pro` | $15 | $20 | $60 |
| | `step-5-preview` | $15 | $20 | $60 |
| | `qwen3.8-max` | $15 | $20 | $60 |
| | `kimi-k3.1-pro` | $15 | $20 | $60 |
| | `qwen4-max` | $15 | $20 | $60 |
| | `minimax-m3.1-flash` | $20 | $25 | $80 |
| | `hy4-preview` | $30 | $35 | $120 |
| | `gemini-4-argon` | $30 | $35 | $120 |
| | `hy3` | $60 | $65 | $240 |
| | `longcat-2.0` | $60 | $65 | $240 |
| | `hy4` | $60 | $65 | $240 |

> 免额度款：`beam-free`、`hy4-flash-free`、`iceman-contributor-free`、`longcat-2.5-free` 三档均标 **∞**，不参与额度比较。
> **倍率分布：2x × 5 款 / 3x × 5 款 / 4x × 17 款**——**Plus 的加成重心在 4x（17 款，占 63%）**。
> ⚠️ **`glm-5.3` 的 $500 / $1,000 是促销值**（官方：「Higher usage limits apply through November 22, 2026」），**其长期档位为 $15 / $120（8x）**，回落判断须重抓。
> ⚠️ **`gemini-4-argon` 的 $2/$10 是 50% 折扣价，12-01 起翻倍为 $4/$20**（额度不变）。

### 4.3 单位价值（每 1 美元买到多少额度）

> 口径：**单位价值 = 月额度 ÷ 月费**；**相对 Go** = 该档单位价值 ÷ Go 单位价值（**>1 表示升档后每美元买到更多额度，<1 表示变贵**）。

| 模型档（Go 额度） | Go $10 | Teams $20·成员 | Plus $40 | **Teams 相对 Go** | **Plus 相对 Go** |
|---|---:|---:|---:|:--:|:--:|
| **$15 档**（4x 的 11 款，如 `kimi-k3` / `deepseek-v4-pro` / `step-5-preview`） | 1.50 | 1.00 | 1.50 | **0.67x** | **1.00x（持平）** |
| **$20 档**（4x：`minimax-m3.1-flash`） | 2.00 | 1.25 | 2.00 | **0.63x** | **1.00x（持平）** |
| **$30 档**（4x 的 `hy4-preview` / `gemini-4-argon`；3x 的 `qwen3.8-flash`） | 3.00 | 1.75 | 3.00（4x）/ 2.25（3x） | **0.58x** | **1.00x / 0.75x** |
| **$60 档**（4x 的 `hy3` / `longcat-2.0` / `hy4`；3x 的 4 款；2x 的 3 款） | 6.00 | 3.25 | 6.00 / 4.50 / 3.00 | **0.54x** | **1.00x / 0.75x / 0.50x** |
| **$100 档**（2x：`deepseek-v4.1-flash`） | **10.00** | 5.25 | 5.00 | **0.53x** | **0.50x（腰斩）** |
| **$500 档**（2x：`glm-5.3`，促销） | **50.00** | 25.25 | 25.00 | **0.51x** | **0.50x（腰斩）** |

**读法**：
- **Go 永远是单位价值基准（1.00x）**，**Plus 在任何模型上都超不过 1.00x**——最好只是持平（4x 的 17 款）。
- **Teams 在所有档位上都是 0.51x–0.67x**——付 2 倍钱只多拿固定 `$5` 额度，**额度效率必然下降**；且**档位越高越亏**（$15 档 0.67x → $500 档 0.51x）。
- **Plus 的盈亏平衡点是 4x**：4x 持平、3x 亏 25%、2x 亏 50%。**现行清单内无 8x 档**（`glm-5.3` 促销期只有 2x）。

### 4.4 选型结论（P0→P2）

- **P0 单人、想省钱** → **留 Go $10**。**没有任何模型能让 Plus 的单位成本低于 Go**（最好持平），升 Teams 则一律变贵。
- **P0 团队多人、各自独立额度** → **选 Teams $20/成员**。**这是 Teams 存在的唯一理由**：`Go / Plus 均限单成员 workspace`，只有 Teams 能让每人拿到独立额度而不互相挤占。⚠️ 但**人均额度效率低于 Go**（0.51~0.67x），人越多越明显——3 人 Teams = $60/月，已超过单人 Plus $40。
- **P1 需要"更长的天花板"而非"更便宜"** → **Plus $40** 只在 **4x 档 17 款**上做到持平；用于大项目 / 长会话防撞墙，**不要期待省钱**。
- **P1 主力是 2x 档（`deepseek-v4.1-flash` / `mimo-v2.6-flash` / `muse-spark-1.2` / `muse-spark-1.3`）** → **绝对留 Go**。升 Plus 单位价值腰斩，是所有升档动作里最亏的一档。
- **P1 主力是 3x 档（`glm-5.3-flash` / `kimi-k2.7-code` / `minimax-m3` / `qwen3.7-plus` / `qwen3.8-flash`）** → **留 Go 或换 GOAT**（GOAT 的 `glm-5.3-flash` 给 $100，Go 只有 $60），**不要升 Plus**（−25%）。
- **P2 需要 Teams 又要高额度** → **Teams + 按需 credits**（Teams 成员同样受 5h=20% / 周=50% / 月=100% 比例窗口约束，超限可开 **Extra Usage** 走 Console credits 按量付费，不自动回落）。
- **P2 若 `glm-5.3` 促销在 11-22 后回落至 $15** → **Plus 重新变成 8x（2.00x 单位价值）**，那时它才是唯一值得升 Plus 的模型；**决策前必须重抓该模型的 `go.monthly_usage`**。

> ⚠️ **两档都不能解决"额度效率"问题**：三档 Token 单价完全相同，**加额度只能靠加钱**。若目标是"同样的钱跑更多 token"，正解是换更便宜的模型（见 [国产大模型官方 API vs OpenRouter 各渠道价格对比](/model-intel/china-llm-api-vs-openrouter-pricing/)）或走 GOAT（见第一至三节）。

---

## 五、$20 档横向对比（Ollama Pro / CommandCode Pro / OpenDesign Go Plus / OpenCode Go Teams）

> 同一 $20 月费档的四个选项。**性价比口径统一为「月额度 ÷ 月费」**，与第二、四节一致。

| 平台 / 档位 | 月费 | 月额度 | **性价比** | 窗口限制 | 模型范围 | 额度能否跨模型混用 |
|---|---|---:|---:|---|---|---|
| **OpenDesign Go Plus** | $20（首月 $16；黑五首年 $168 = $14/月，次年 $240/年） | **$310**（Coding Plan $290 + Top Models $20） | **15.5x** | 5 小时 + 7 天（**金额未披露**） | Coding Plan 11 款 **+ Top Models 20 款**（可跑 Claude Opus 5.5 / GPT-6 Astra / Gemini 4 系列） | **两池独立**，Top Models 仅 $20 |
| **CommandCode Pro** | $20 | **Up to $110** | **5.5x** | 5h **$22** / 周 **$55** | GOAT 全部 + 更多 premium（Claude Sonnet 5.5、GPT-6 Sol 等；Opus / Fable 仍需 Max） | 按模型分档，单池 |
| **Ollama Pro** | $20（年付 $16.67） | **$60 用量** | **3.0x** | **无 5 小时 / 无每周限制** | 开放权重模型（含 pro models、Kimi K3 等） | 单池，按 token 计费 |
| **OpenCode Go Teams** | **$20 / 成员** | **逐模型 = Go + $5**（$15→$20、$60→$65、$100→$105、$500→$505） | **0.51~0.67x**（相对 Go，见 §4.3） | 5h = 月额度 20% / 周 50% | 与 Go 同（31 款） | 按模型分档，**每成员独立** |

### 5.1 四家的结构性差异

1. **OpenDesign Go Plus 额度面值最高（$310，15.5x），但 premium 池仍很小**——$310 里 **$290 只能用于 Coding Plan 模型**，Top Models 仅 $20。若主力是 Claude Opus / GPT-6 Astra，$20 的 premium 额度很快见底；若主力是 DeepSeek V4.1 Flash Eco / GLM-5.3 Flash 这类 Coding Plan 模型，$290 的性价比极高。
   > ⚠️ **面值需打折读**：Go 档第三方实测显示宣传 credits 约缩水到 **66.5%**。按同比例折算，**$310 × 0.665 ≈ $206 等值 → 约 10.3x**，与 Go 的 `deepseek-v4.1-flash`（10.0x）基本持平。**Plus 档本身仍无公开实测，采购前建议自行核账。**
2. **CommandCode Pro 是唯一"纯加钱换额度"的档位**——与 GOAT **同样的 Token 单价**、同样的按模型分档，只把套餐级额度整体抬高：**Up to $100 → Up to $110**、5h **$20 → $22**、周 **$50 → $55**；同时把模型面扩到 Claude Sonnet 5.5、GPT-6 Sol 等（Opus / Fable 仍需 Max）。**单位价值 5.5x。**
3. **Ollama Pro 是唯一无窗口限制的**——**取消 5h / 周限制**是它相对另三家的最大差异：突发大用量不会被 5 小时窗口卡住，超出 $60 后按同价 PAYG 继续。代价是额度绝对值最低（$60），且只覆盖开放权重模型。
4. **Go Teams 是唯一支持多成员独立额度的**——它不是"买更多额度"，而是"买多份独立额度"，**人均额度效率低于 Go 本身**（0.51~0.67x）。人数越多总成本越高：3 人 = $60/月。

### 5.2 $20 档选型结论（P0→P2）

- **P0 主力是 Coding Plan 模型（DeepSeek V4.1 Flash / Eco、GLM-5.3 Flash、MiMo V2.6、Kimi K2.7 Code）+ 需要最大额度** → **OpenDesign Go Plus $20**（**面值 15.5x，按 66.5% 折算约 10.3x**）。⚠️ 但**必须自行核账**——Go 档实测显示宣传值缩水约 1/3，Plus 未实测。
- **P0 需要最广模型面 + premium（GPT-6 Sol / Claude Sonnet 5.5）且不想吃折算损耗** → **CommandCode Pro $20**（5.5x，模型面 100+，几乎无缩水）。
- **P0 团队多人、各自独立额度** → **Go Teams $20/成员**（唯一多成员选项），但接受额度效率 0.51~0.67x。
- **P1 用量突发性强、怕被 5 小时窗口卡住** → **Ollama Pro $20**（唯一无窗口限制），代价是额度仅 $60 且仅开放权重模型。
- **P2 纯省钱** → **留在 $10 档更稳**：OpenCode Go 的 `deepseek-v4.1-flash` **10.0x**、GOAT 的 `glm-5.3-flash` **10.0x**，与 OpenDesign Go Plus 的折算值（约 10.3x）基本同档，但**门槛只有一半**。**$20 档买的是"更大额度池"与"更少约束"，不是更高的每美元额度。**

> ⚠️ **跨平台不可简单比 $310 / $110 这类宣传值**：OpenDesign 的宣传额度是 **credits 面值**（第三方实测 Go 档约 66.5%）；Ollama 的 $60 是**按 token 实付**、无窗口损耗；CommandCode 的 $100/$110 是**官方 API 等值的 credit**。三者的"1 美元额度"含金量不同。

### 5.3 Ollama 逐模型价格表（每百万 token，官网 2026-11-22 抓取）

> Ollama **按 token 计费，不按请求计费**——因此**没有「每月多少次请求」的换算表**，本工作区不对其请求数做估算。Pro 的 $60 / Max 的 $300 / Team 的 $1,000 是**美元用量池**，按下表费率逐 token 扣减，用尽后按同价 PAYG 继续。**官网现列 26 款**（`beam`、`hy4`、`kimi-k3.1-pro` 为新进；`mistral-large-3`、`nemotron-3-nano` 已退出）。

| 模型 | 输入 | 缓存输入 | 输出 |
|---|---:|---:|---:|
| **beam**（新） | $0.125 | $0.015 | $0.40 |
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
| **hy4**（新） | $0.834 | $0.042 | $2.501 |
| inkling-2-small | $0.30 | $0.03 | $1.00 |
| **kimi-k3.1-pro**（新） | $2.00 | $0.20 | $10.00 |
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

1. **DeepSeek 系保留峰谷双档**——`deepseek-v4.1-flash` 高峰 $0.30/$1.20、空闲 $0.15/$0.60；`deepseek-v4-pro` 高峰 $1.32/$3.96、空闲 $0.66/$1.98。**Pro 用户若在工作日高峰时段集中使用，$60 池的消耗速度是空闲时的 2 倍**。
2. **⚠️ `minimax-m3` 溢价 2 倍**——Ollama 标 **$0.60/$2.40/$0.12**，而 MiniMax 官方与 CommandCode 均为 **$0.30/$1.20/$0.06**。其余多数模型与官方目录价持平（GLM-5.3、Kimi K3、MiMo V2.6 等逐项一致）。**在 Ollama 上跑 MiniMax M3 是明显的劣势项。**

> 📌 **与另三家的可比性**：Ollama 只覆盖**开放权重模型**（无 GPT-6.1 Terra / Gemini 4 Argon 这类闭源旗舰），且**没有 premium 分层**——Pro 的"larger pro models"仅指开放权重里的大参数量级。若需要闭源前沿模型，Ollama 不构成替代。

### 5.4 Ollama 的倍率怎么算（与另三家口径不同）

**公式**：`倍率 = 月含用量 ÷ 月费`。Ollama 的倍率是**套餐级固定值，与模型无关**——因为按 token 实付，模型只决定消耗快慢，不改变"每 1 美元月费换到多少美元用量"这个比例。

| 档位 | 月费 | 月含用量 | **倍率** | 备注 |
|---|---:|---:|---:|---|
| Free | $0 | 少量起步额度 | **未公布**（官方只写"a starter amount each month"，未给具体美元值） | 仅覆盖 starter models；可加 credits 走 PAYG |
| **Pro** | $20 | **$60** | **3.0x** | 年付 $200/年 折 $16.67/月 → **3.6x** |
| Max | $100 | **$300** | **3.0x** | 并发 10 |
| Team | $500 | **$1,000**（共享） | **2.0x** | 不限用户数，团队共享池 |

**四个口径差异（本文所有「x」都指月额度 ÷ 月费，但分子含义不同）**：

| 平台 | 倍率性质 | 分子是什么 | 结果 |
|---|---|---|---|
| **Ollama Pro** | **套餐级、统一** | 按 token 实付的美元用量池 | **3.0x，所有模型相同** |
| **OpenCode Go** | **逐模型** | 该模型专属的美元额度 | $15→1.5x / $60→6.0x / $100→10.0x（**随模型变**） |
| **CommandCode GOAT / Pro** | 逐模型为主 | 该模型专属的美元额度 | GOAT 最高 $100→10.0x；Pro 套餐级 Up to $110→5.5x |
| **OpenDesign Go / Plus** | 套餐级、**面值口径** | **credits 面值**（非官方 API 等值） | Go $120→12.0x / Plus $180→9.0x，**但需按 2:1 折算成等值用量** |

> ⚠️ **三个必读提醒**：
> 1. **倍率高 ≠ 更便宜**。Ollama 的 3.0x 只说明"付 $20 换 $60 按表价的用量"；而 Ollama 表价多数**与官方同价**（GLM-5.3、Kimi K3、MiMo V2.6 逐项一致），**`minimax-m3` 甚至贵 2 倍**。所以它的"$60 用量"在某些模型上只相当于官方 $30 的产出。
> 2. **逐模型倍率与统一倍率的不可比性**：Ollama 的 3.0x 是"任何模型都 3.0x"，Go 的 10.0x 是"只有 `deepseek-v4.1-flash` 能到 10.0x"。**拿单一数字横比会误导**，必须说明是"最高倍率"还是"全模型统一倍率"。
> 3. **峰谷会改变实际可用量**：Ollama 的 DeepSeek 系保留 Peak / Off-Peak 双档（峰值 2 倍价），**同样 $60 在工作日高峰只能跑出空闲时段一半的 token**。倍率不变，但"每美元 token 量"会变。
