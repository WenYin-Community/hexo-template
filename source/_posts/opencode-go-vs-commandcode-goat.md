---
title: "OpenCode Go vs CommandCode GOAT：两个 $10 套餐逐模型额度对比"
author: "学姐大人"
date: 2026-11-04
categories:
  - "ai-model-intel"
tags:
  - "opencode"
  - "commandcode"
  - "对比"
  - "额度"
---

> 数据来源（**抓取日期 2026-11-04**）：
> - **OpenCode Go（$10）**：官方文档 opencode.ai/docs/go（**11 张表全量解析**，含 Go / Teams / Plus 三档价目）、官方营销页 opencode.ai/zh/go、docs/zen、清单 API `/inference/go/v1/models`（**28 个 ID / 正文 30 款**）
> - **CommandCode**：commandcode.ai/docs/plans/goat（**SSR 可 curl**：5 张表 = 模型 73 行 + 请求数 61 行 + 额度 21/3/39 行）、docs/resources/pricing-limits（套餐矩阵、滚动窗口、Deals 明细）。**GOAT 页头：GOAT plan 69 / All plans 94 / Deals 4 / Free 3；Pricing & Limits 页头：All 98 / Free 5**
> - **档位权威源**：CLI 包内官方目录 `command-code@1.88.2` → `package/dist/bundled/command-code-knowledge/reference/models.md`（含 Context / Efforts / $每 1M / Min plan，**94 款**）；**Provider API 在线 96 端点**，差集 2 款为 `inclusionai/ling-3.1-flash-1019`、`stealth/crouton-alpha`（已上线网关、CLI 目录尚未收录）
> - 🎯 **本文定位**：**只做两个 $10 档套餐的同价位对比**——**OpenCode Go $10 vs CommandCode GOAT $10**。Go 内部的 Teams / Plus 档位**不进本文主对比**，单列于**第四节**。
> - 🎯 **额度口径（用户重点）**：**两平台同价 $10**。⚠️ **同一模型额度可能不同**：`deepseek-v4.1-flash` 双方**均为 $100**（现行同档），但 `glm-5.3-flash` 为 **Go $60 vs GOAT $100**——**两平台不可混用同一数字**。
> - 月费：**Go $10 / GOAT $10**（本文对比对象）；其余档位：Go Teams $20·成员 / Go Plus $40 / CommandCode Go $1 / Pro $20 / Provider $15 / Max 10× $100 / Max 20× $200 / Team Pro $40；折算汇率：1 美元 ≈ 6.7180 元人民币（中国外汇交易中心 2026-11-04 中间价，每轮重取）
> - **Go Teams / Go Plus 简介**（详表见第四节）：三档 **Token 单价完全相同**，只差月度额度与成员数——**Teams = Go + $5/模型、每成员独立额度**；**Plus = Go × 2/3/4/8 倍、仅限单成员**。
> - ⚠️ **退役现状**：`stealth/pixel-canary`、`stealth/space-bunny-alpha`、**`stealth/cat-jam:free`（GOAT 侧同步下架）**、**`space-bunny` / `space-bunny-free`（Go/Zen 全线退出）**——均已从网关 API 与 CLI 目录同步移除。

<!-- more -->

---

## 一、套餐基础对比

| 维度 | **OpenCode Go** | **CommandCode GOAT** |
|---|---|---|
| 月费 | **$10** | **$10** |
| 官方定位 | Lower-cost access | 7x credits（$70 credits） |
| 官方倍数表述 | docs 现行**不披露倍数**（按模型分档 1.5x–8.0x） | 7x（配合 Deals 可超 $100，即 10x+） |
| Token 单价 | 内部价（见 §2.3 与 GOAT 的逐项差异） | 内部价（与 Go 基本一致，少数模型有差异，见 §2.3） |
| 每5小时限额 | **按模型比例生成**（= 月额度 × 20%）；套餐级参考值 $12 | **按模型比例生成**；套餐级参考值 **$14**（GOAT $70 × 20%） |
| 每周限额 | 月额度 × 50%；套餐级参考值 $30 | 月额度 × 50%；套餐级参考值 **$35** |
| 每月限额 | **按模型分档**：$15 / $20 / $30 / $60 / $100（+ 2 款限时免费不限量） | **按模型分档**：$10 / $20 / $33 / $40 / $47 / $50 / $60 / $70 / $100 |
| 模型数量 | **30 款正文**（套餐 API 实测 **28 个 ID**） | **GOAT 72 款**（All plans **98**；**网关 API 96 端点**，CLI 1.88.2 目录 94 款，差集 2 款；limits 页 All **102**） |
| 免费模型 | Zen `-free` 独立端点（**9 款 + Big Pickle**，**不自动回落，需手动切换 `opencode/<model-id>`**）；套餐正文另含 **Iceman Contributor Free**、**Beam Free** 两个不限量限时免费 | **在线 4 款**：Laguna S 2.1 Free（while capacity lasts）、Glyph Cluster Free（每日 100 次）、**Crouton Alpha Free（while the stealth preview lasts）**、**Beam 1.0 Free（无日限，while capacity lasts）** |
| 超限兜底 | 开启 **Use balance** 后回退 Zen 余额按量付费（唯一自动机制）；免费模型手动切换 | 免费模型 + PAYG 额度回落；**滚动窗口仅约束套餐内月度 credits，按需 credits 不受限** |
| API 支持 | ✅ 套餐 API **`opencode.ai/inference/go/{openai,anthropic,google}/v1*`**（三协议；模型 ID 短格式 `kimi-k3`，配置写 `opencode-go/kimi-k3`）；官方要求带 **`x-opencode-session`** 与独立 user agent | ✅ Provider API **三协议齐备**：Chat Completions + **Responses（CLI v1.55.0 起）** + Anthropic Messages；网关在线 **96 端点**（CLI 1.88.2 目录 **94 款**，差集 2 款），模型 ID `deepseek/deepseek-v4.1-flash` |
| 成员数 | **仅限单成员 workspace**（Go / Plus 同） | Team Pro / Enterprise 支持团队；GOAT / Pro 为单人 |

### CommandCode 全档位矩阵（11-04）

| 计划 | 价格/月 | Credits/月 | 估算请求 | 5h / 周窗口 |
|---|---|---|---|---|
| **Go** | **$1** | **$10** | ~9K | $2 / $5 |
| **GOAT** | **$10** | **$70** | ~75K | $14 / $35 |
| **Pro** | $20 | **$80** | ~100K | $16 / $40 |
| **Provider** | $15 | PAYG（Provider API 接入） | — | — |
| **Max 10×** | $100 | **$150**（premium $100 / standard $150 双池） | ~230K | $45 / $90 |
| **Max 20×** | $200 | **$300**（premium $200 / standard $300） | ~370K | $90 / $180 |
| **Team Pro** | $40 | $40 | ~35K | $12 / $24 |
| **Enterprise** | $5,000+ | Custom | Custom pool | 无滚动窗口上限 |

> **四源计数口径不同，引用必须写明来源**：网关 API **96** / CLI 1.88.2 目录 **94**（差集 2 款网关独有）/ GOAT 页 **GOAT plan 72 / All plans 98 / Deals 5 / Free 4** / limits 页 All **102 / Free 6**。页面计数与目录口径不同，任一源单独引用都可能给出错误数。
> **滚动窗口按"credit 价值"计量**，不是请求数——便宜模型（如 DeepSeek V4 Flash）能把同一份额度拉长得多。

### GOAT 功能与限制要点

- **思考强度调节**：内置 `/effort [level]` + 全局 `effort` / 逐模型 `reasoningEffort`（low→max，**按模型支持**；不支持时提示 "effort isn't supported for that model"）。
- **Provider API**：Chat Completions + Responses + Messages 三协议；**除 Command Code Go 计划外全部计划有 API 访问**（Go 计划用 Key 调 Provider API 返回 **403 `upgrade_required`**）；Provider 套餐 $15/月 + **$1.01 卡费**，PAYG 无加价、Deals 自动应用；模型命名 `provider/model-slug`（Claude 系无前缀，如 `claude-sonnet-5-5`）；流式 usage 自动回传，无需 opt-in；另有 **422 `cmd_zdr_no_providers`**（ZDR 下无可用 provider）。
- **Deals 付费 1 条（11-04）**：`minimax-m3` **2× usage（50% off）**。⚠️ **已退出**：`mimo-v2.5` 与 `mimo-v2.5-pro` up to 99% off（已自网关与 CLI 目录移除）；**`mistral-large-4` 加成（through Oct 20th）已到期**，GOAT 额度由 $40 回落 **$20**；**`deepseek-v4.1-flash` 的 $100 促销（through Oct 21st）已到期并转为常态额度 $100**（GOAT 页当前无 `liveAtBuild=true` 的 creditDeal）。
- **免费 4 条**：`laguna-s-2.1-free`（while capacity lasts）、`glyph-cluster:free`（每日 100 次，while the stealth preview lasts）、**`crouton-alpha-free`（while the stealth preview lasts）**、**`beam:free`（无日限，while capacity lasts）**。⚠️ **已下架**：`minimax-m3.1-flash:free`、`ornith-1.5-122b:free`（限时免费结束，付费 slug 仍在）。
- **地理限制**：**GPT-5.6 Luna（OpenAI）与 Gemini 3.7 / 3.8 Flash（Google）在中国内地不可用**（官方 Geo model limits 表）。
- **⚠️ 额度是"共享单池"**：低额度模型按比例消耗更多 credits，**不可把各模型额度简单相加**；滚动窗口按月度额度比例自动生成（GOAT $70 → 5h $14 / 周 $35）。
- **开源仍未兑现**（页面口径 delay "later this month"）。

> **🔄 新模型查询要求（每次核对必做）**：全目录以 `curl -s https://api.commandcode.ai/provider/v1/models`、CLI 包内目录（1.88.2 = 94 款）与 GOAT 页头计数（**72 / 98 / 5 / 4**）、Pricing & Limits 页 Deals 小节（**当前 Deals 5 条 = 免费 4 + 付费 1**）**四源交叉 diff**（⚠️ **网关 96 与 CLI 目录 94 存在 2 款差集，须同时记录**）。Go 侧用 `curl -sL https://opencode.ai/inference/go/v1/models`（**28 ID**）对 docs/go 正文（**30 款**）。**档位与价格以 CLI 包内官方目录为准**：`npm pack command-code@latest` → `tar xzOf command-code-*.tgz package/dist/bundled/command-code-knowledge/reference/models.md`（当前 = CLI **1.88.2**，含 Context/Efforts/$每1M/Min plan；CHANGELOG 同步取以捕捉退役公告）。⚠️ **包体约 4.2 MB，禁止全量 `tar xzf`（沙箱 /tmp 配额不足），必须 `tar xzOf` 流式取单文件**。**GOAT 页 10-18 起为 SSR**：请求数表、额度三表、模型表均可直接 `curl -sL` + HTML 解析，无需浏览器；Caps 列的 "+1" 展开值仍为客户端渲染。完整规则见 [OpenCode Go 模型配置指南](/2026/11/04/opencode-go-model-guide/) 同名节。

**关键差异**：GOAT 套餐级参考限额 **$70** vs Go 参考值 **$60**，5 小时 $14 vs $12、每周 $35 vs $30。**但两平台额度都按模型分档**（Go：$15 / $20 / $30 / $60 / $100 五档；GOAT：$10~$100 十档），**套餐级数字只是默认参考值，比较必须落到逐模型，见第二节。**

> **Go 内部档位（Teams / Plus）不与 GOAT 混比**——它们属于 OpenCode 生态内的升档选项，详见**第四节「OpenCode 内部档位对比」**。

---

## 二、逐模型额度对比

### 2.1 两边均有：请求数对比（每5小时 / 每周 / 每月）

> Go 列取 docs/go 请求数表（29 行）；GOAT 列取 GOAT 页请求数表（58 行）。**限时翻倍值单列在备注**。

| 模型 | Go 5h/周/月 | GOAT 5h/周/月 | Go 月额度 | GOAT 月额度 | 差异结论 |
|---|---|---|---|---|---|
| **DeepSeek V4.1 Flash** | 43,330 / 108,330 / **216,670** | **51,300 / 128,000 / 256,000** | **$100** | **$100** | **额度完全持平（10.0x）**；GOAT 请求数 +18%（同额度下其典型 token 口径更小） |
| GLM-5.3 | 220 / 540 / 1,080 | 271 / 677 / 1,350 | $15 | $20 | GOAT +25% 请求、+33% 额度 |
| GLM-5.2 | 880 / 2,150 / 4,300 | 947 / 2,370 / 4,740 | $60 | **$70** | GOAT +10% 请求、+17% 额度 |
| **GLM-5.3 Flash** | 6,320 / 15,790 / 31,580 | 11,800 / 29,500 / 59,000 | **$60** | **$100** | **GOAT 额度反超 67%（10.0x vs 6.0x）** |
| **Kimi K3.1 Pro** | 147 / 368 / 735 | **294 / 735 / 1,470** | $15 | $20 | **GOAT 请求 +100%、+33% 额度**（10-23 新上架） |
| Kimi K3 | 110 / 250 / 490 | 196 / 490 / 980 | $15 | $20 | GOAT +78% 请求、+33% 额度 |
| Kimi K2.7 Code | 1,350 / 3,380 / 6,750 | 1,080 / 2,710 / 5,420 | $60 | $60 | **Go +25% 请求**（额度持平） |
| LongCat-2.0 | 11,400 / 28,600 / 57,200 | 12,800 / 32,100 / 64,100 | **$60** | $50 | **Go 额度更高**；GOAT 请求 +12% |
| **Step 5 Preview** | 430 / 1,070 / 2,130（**限时 4x = 1,720 / 4,280 / 8,520**） | 1,040 / 2,600 / 5,210 | $15（**限时 $60**） | $20 | 常态 GOAT 请求 2.4x；**Go 限时窗口内额度反超 3x** |
| MiMo-V2.5 | 30,100 / 75,200 / 150,400 | 19,500 / 48,700 / 97,400 | **$60** | $30 | **Go 大幅领先**（额度 2x、请求 1.54x） |
| **MiMo-V2.6-Flash** | 30,100 / 75,200 / 150,400 | 13,000 / 32,500 / 64,900 | **$60** | $20 | **Go 3x 额度、2.3x 请求**（GOAT 侧为 up to 98% off 计费） |
| MiMo-V2.5-Pro | 3,250 / 8,150 / 16,300 | 5,700 / 14,200 / 28,500 | $15 | $20 | GOAT +75% 请求、+33% 额度 |
| MiMo-V2.6-Pro | 3,250 / 8,150 / 16,300 | 5,700 / 14,200 / 28,500 | $15 | $20 | 同上（与 V2.5-Pro 同口径） |
| MiniMax M3 | 3,200 / 8,000 / 16,000 | 2,770 / 6,930 / 13,900 | **$60** | $47 | **Go +15% 请求、$60 > $47**（GOAT 侧标 2× usage） |
| Muse Spark 1.3 Contributor | 45,300 / 113,300 / 226,600 | 18,200 / 45,500 / 90,900 | **$60** | $20 | **Go +149% 请求、3x 额度** |
| Muse Spark 1.2 Contributor | 45,300 / 113,300 / 226,600 | 18,200 / 45,500 / 90,900 | **$60** | $20 | 同上 |
| Qwen3.8 Max | 160 / 400 / 810 | 261 / 654 / 1,310 | $15 | $20 | GOAT +62% 请求、+33% 额度 |
| Qwen3.8 Flash | 5,400 / 13,500 / 27,000 | 3,910 / 9,780 / 19,600 | **$30** | $20 | **Go +38% 请求、$30 > $20**（GOAT 输入价 $0.16 vs Go $0.15） |
| Qwen3.7 Plus | 4,300 / 10,800 / 21,600 | 1,420 / 3,560 / 7,110 | **$60** | $33 | **Go +204% 请求、额度近 2x**（GOAT 缓存读 $0.08 vs Go $0.04） |
| DeepSeek V4 Pro | 1,050 / 2,600 / 5,200 | 1,980 / 4,940 / 9,880 | $15 | $20 | GOAT +90% 请求、+33% 额度 |
| Hy3 | 4,300 / 10,750 / 21,500 | 7,080 / 17,700 / 35,400 | $60 | **$70** | GOAT +65% 请求、+17% 额度 |
| Hy4 preview | 1,350 / 3,380 / 6,770 | 1,220 / 3,060 / 6,120 | **$30** | $20 | **Go 请求 +11%、额度 $30 > $20** |
| Grok 4.7 | 169 / 423 / 845 | 144 / 360 / 719 | $15 | $20 | **Go 请求 +17%**；GOAT 额度 +33% |
| GPT 6 Luna | 4,230 / 10,560 / 21,130 | 6,060 / 15,200 / 30,300 | $15 | $20 | GOAT +43% 请求、+33% 额度（Go 单价更低 $0.10/$0.50） |
| GPT 5.6 Luna | 2,050 / 5,100 / 10,250 | 2,960 / 7,400 / 14,800 | $15 | $20 | GOAT +44% 请求、+33% 额度 |
| Claude Haiku 5.5 | 3,850 / 9,620 / 19,230 | 5,970 / 14,900 / 29,900 | $15 | $20 | GOAT +55% 请求、+33% 额度 |
| Beam（免费） | Unlimited（`beam-free`） | 免费（`beam:free`，无日限） | 免费 | 免费 | 两侧均不消耗额度 |
| **MiniMax M3.1 Flash Free** | Unlimited（`minimax-m3.1-flash-free`，限时） | 免费（`minimax-m3.1-flash:free`，无日限，限时） | 免费 | 免费 | 两侧均不消耗额度；GOAT 另有付费档（$20，4,230 / 10,600 / 21,200） |

**仅一侧收录**：

| 模型 | Go | GOAT | 说明 |
|---|---|---|---|
| **Ornith 1.5 122B** | ❌ 未收录 | $20（3,180 / 7,960 / 15,900）+ 限时免费档 | **GOAT 独占**（OpenRouter 无此 slug，仅 CC） |
| **LongCat 2.5 Preview Free** | ❌ 已退出正文 | ❌ 未收录 | 两侧均已下架（Zen 侧 `longcat-2.5-preview-free` 同步移除） |
| **Gemini 4 Argon**（原 `gemini-4-argon-contributor` 更名） | $30（50% off 期；440 / 1,080 / 2,120） | ❌ 未收录 | **Go 独占**（GOAT 仅有 3.7/3.8 Flash） |

#### 请求数差异要点

1. **Go 占优（请求更多）**：Kimi K2.7 Code（+25%）、MiniMax M3（+15%）、MiMo-V2.5（+54%）、**MiMo-V2.6-Flash（+131%）**、Muse Spark Contributor（+149%）、Qwen3.7 Plus（+204%）、Qwen3.8 Flash（+38%）、Hy4 preview（+11%）、Grok 4.7（+17%）。
2. **GOAT 占优（请求更多）**：DeepSeek V4.1 Flash（+18%）、GPT 5.6 / 6 Luna（+44% / +43%）、Hy3（+65%）、LongCat 2.0（+12%）、Claude Haiku 5.5（+55%）、MiMo-V2.5-Pro / V2.6-Pro（+75%）、DeepSeek V4 Pro（+90%）、Kimi K3（+78%）、**GLM-5.3 Flash（+49%）**、Step 5 Preview（+144%）。
3. **额度分配策略不同**：Go 按模型分 **$15 / $20 / $30 / $60 / $100** 五档（+ 2 款限时免费不限量）；GOAT 分 **$100 / $80 / $70 / $60 / $50 / $47 / $40 / $33 / $20 / $10** 多档，**且 `planBudgetSteps` 会按日期自动切换档位**（deepseek 与 glm-5.3-flash 的 $100→$80 回落即由该机制驱动）。

### 2.2 月额度（Credits）逐模型对比

> 性价比口径：**月额度 ÷ 月费 $10**（Go 与 GOAT **同价 $10**，可直接比）。Go 侧升档（Teams / Plus）的性价比另见**第四节**。

| 模型 | Go 月额度 | GOAT 月额度 | Go 性价比 | GOAT 性价比 | 胜出 |
|---|---|---|---|---|---|
| **DeepSeek V4.1 Flash** | **$100** | **$100** | **10.0x** | **10.0x** | **持平**（双方同为最高档） |
| **GLM-5.3 Flash** | $60 | **$100** | 6.0x | **10.0x** | **GOAT**（额度 +67%） |
| Ling 3.1 Flash | ❌ 未上架 | **$100** | — | **10.0x** | GOAT 独占 |
| Qwen 3.8 27B | ❌ 未上架 | $70 | — | 7.0x | GOAT 独占 |
| GLM-5.2 | $60 | $70 | 6.5x | 7.0x | GOAT |
| Hy3 | $60 | $70 | 6.0x | 7.0x | **GOAT** |
| Kimi K2.7 Code | $60 | $60 | **8.2x** | 6.0x | **Go**（额度同、请求更宽、单次成本更低） |
| MiniMax M3 | $60 | $47 | 6.0x | 4.7x | Go |
| Qwen 3.7 Plus | $60 | $33 | 6.0x | 3.3x | Go |
| MiMo V2.5 | $60 | $30 | 6.0x | 3.0x | **Go 大幅领先** |
| MiMo V2.6 Flash | **$60** | $20 | **6.0x** | 2.0x | **Go 大优（3x）** |
| Muse Spark 1.3 / 1.2 Contributor | $60 | $20 | 6.0x | 2.0x | **Go 大优（3x）** |
| DeepSeek V4 Flash | ❌ 未上架 | $60 | — | 6.0x | GOAT 独占 |
| DeepSeek V4.1 Flash Fast | ❌ 未上架 | $60 | — | 6.0x | GOAT 独占 |
| **MiniMax M3.1 Flash** | **$20**（3,880 / 9,690 / 19,380） | $20 | **2.0x** | 2.0x | **双方均已上架付费档**（Go 侧 Zen 免费端点已下架） |
| LongCat 2.0 | $60 | $50 | 6.0x | 5.0x | **Go 略优** |
| GLM-5.3 | $15 | $20 | 1.5x | 2.0x | GOAT（**唯一 8x 模型，Plus 升档单位价值 2.0x，见 §四**） |
| Kimi K3 | $15 | $20 | 1.5x | 2.0x | GOAT |
| MiMo V2.5 Pro / V2.6 Pro | $15 | $20 | 1.5x | 2.0x | GOAT |
| Qwen 3.8 Max | $15 | $20 | 1.5x | 2.0x | GOAT |
| DeepSeek V4 Pro | $15 | $20 | 1.5x | 2.0x | GOAT |
| GPT-5.6 Luna / GPT-6 Luna | $15 | $20 | 1.5x | 2.0x | GOAT |
| Grok 4.7 | $15 | $20 | 1.5x | 2.0x | GOAT 额度更高，Go 请求更多 |
| Claude Haiku 5.5 | $15 | $20 | 1.5x | 2.0x | GOAT |
| Step 5 Preview | $15（限时 **$60**） | $20 | 1.5x（限时 **6.0x**） | 2.0x | **限时窗口内 Go 反超 3x** |
| Gemini 4 Argon Contributor | **$30**（限时 **$60**） | ❌ 未收录 | **3.0x**（限时 6.0x） | — | **Go 独占** |
| Hy4 preview | **$30** | $20 | 3.0x | 2.0x | **Go 额度/请求均更优** |
| Qwen3.8 Flash | **$30** | $20 | 3.0x | 2.0x | **Go 额度/请求更优** |
| Ornith 1.5 122B | ❌ 未收录 | **$20** | — | 2.0x | **GOAT 独占**（262K、$0.16/$0.64/$0.02，无推理档位公布） |
| LongCat 2.5 Preview Free | 限时免费不限量 | ❌ 未收录 | — | — | **Go 独占** |
| Beam（免费） | 限时免费不限量 | 免费无日限 | — | — | 两侧均免费 |

### 2.3 内部单价差异（仅列出两平台不同的项）

| 模型 | Go 输入/输出/缓存读 | GOAT 输入/输出/缓存读 | 说明 |
|---|---|---|---|
| Qwen3.7 Plus | $0.40 / $1.60 / **$0.04** | $0.40 / $1.60 / **$0.08** | **GOAT 缓存读贵一倍** |
| Qwen3.8 Flash | **$0.15** / $0.47 / $0.016 | **$0.16** / $0.47 / $0.016 | GOAT 输入贵 6.7% |
| Step 5 Preview | $1.00 / $2.70 / **$0.10** | $1.00 / $2.70 / **$0.05** | GOAT 缓存读便宜一半 |
| MiMo V2.6 Pro | $0.435 / $0.87 / $0.003625 | $0.435 / $0.87 / $0.0036 | 四舍五入差异 |
| 其余共有模型 | — | — | **完全一致**（GLM-5.3/5.2、Kimi K3 / K2.7 Code、LongCat 2.0、DS V4.1 Flash / V4 Pro、MiMo V2.5 系、MiniMax M3、Muse Spark Contributor、Qwen3.8 Max、Hy3、Hy4、Grok 4.7、GPT-6/5.6 Luna、Claude Haiku 5.5） |

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
| **GOAT 更大方** | **GLM-5.3 Flash（$100 vs Go $60）**、GLM-5.2 / Hy3（$70 vs $60）、Kimi K3 / GPT-6 Luna / GPT-5.6 Luna / Claude Haiku 5.5 / Grok 4.7 / MiMo V2.5-Pro / V2.6-Pro / Qwen 3.8 Max / DS V4 Pro / GLM-5.3（$20 vs $15）、Ling 3.1 Flash（$100）、Qwen 3.8 27B（$70）、DS V4.1 Flash Fast（$60） |
| **Go 更大方** | **MiMo-V2.6-Flash / Muse Spark Contributor（$60 vs $20）**、MiMo-V2.5（$60 vs $30）、Qwen3.7 Plus（$60 vs $33）、MiniMax M3（$60 vs $47）、LongCat-2.0（$60 vs $50）、Hy4 preview（$30 vs $20）、Qwen3.8 Flash（$30 vs $20）、**Gemini 4 Argon / LongCat 2.5 Preview Free（GOAT 无对应）** |
| **持平** | **DeepSeek V4.1 Flash（双方均 $100，同为现行最高档 10.0x）** |
| **Go 单次成本更优** | Kimi K2.7 Code（同 $60，请求 6,750 vs 5,420）、Qwen3.7 Plus（缓存读半价）、Step 5 Preview（缓存读 $0.10 vs $0.05 为 GOAT 优，但限时额度 Go 反超） |

### 3.2 P0 决策

1. **主力是 DeepSeek V4.1 Flash** → 两平台**完全等价**（均 **$100** 额度、10.0x）；选 Go 可保留 OpenCode 生态与 Responses 三协议，选 GOAT 则请求数多 18%。
2. **主力是 MiMo-V2.6-Flash / Muse Spark / MiMo-V2.5** → **必须留 Go**（额度 2–3 倍）。
3. **主力是 GLM-5.3 Flash** → **GOAT 明显更划算**（**$100 vs $60，10.0x vs 6.0x**，额度多 67%）。
4. **主力是 GLM-5.3** → GOAT 仅 $20；若坚持留在 OpenCode 生态，**Go Plus 是唯一「升档即省钱」的模型（8x）**——属内部档位话题，见第四节。
5. **需要窄领域独占模型**（Ling 3.1 Flash、Qwen 3.8 Omni Flash、GLM-5.3 FlashX、Step 3.x Flash、Inkling、Jev、MiMo UltraSpeed）→ **GOAT 独有**，Go 无替代。
6. **需要单模型超长上下文 + 高请求量** → Go 的 **Muse Spark（226,600 次/月）** 与 **MiMo-V2.6-Flash（150,400 次/月）** 仍是天花板；GOAT 的请求量天花板是 **Jev（595,000 次/月）**，但为决策模型（非通用编码）。
7. **价格稳定性**：两平台内部价均与 OpenRouter 渠道价格战解耦；**GOAT 独有的 `planBudgetSteps` 会按日期自动切档**（促销窗口的起止由该机制驱动），**引用额度必须带日期**。

---

## 四、OpenCode 内部档位对比（Go $10 / Go Teams $20·成员 / Go Plus $40）

> 三档 **Token 单价完全相同**（docs/go 定价表三档共用 Input / Output / Cached Read / Cached Write），**只差月度额度上限与成员数**。因此档位选择的唯一问题是：**多付的钱换到多少额度？**

### 4.1 三档机制

| 档位 | 月费 | 额度规则 | 成员数 | 官方表述 |
|---|---|---|---|---|
| **Go** | **$10** | 逐模型分档 **$15 / $20 / $30 / $60 / $100** | **单成员** | Lower-cost access |
| **Go Teams** | **$20 / 成员 / 月** | **= Go 档 + $5 / 模型**（固定加数，非倍率） | **每成员独立额度** | Every member gets their own limits, **$5/month higher than Go on every model** |
| **Go Plus** | **$40** | **= Go 档 × 2 / 3 / 4 / 8**（按模型倍率） | **单成员** | Higher usage limits |

> 🔑 **这是三条完全不同的加成逻辑**：Teams 是**加数**（+$5）、Plus 是**乘数**（×2~×8）、Go 是基准。**加数对高额度模型几乎无感、对低额度模型提升明显；乘数反之**——这一点决定了两者的适用场景完全不同。

### 4.2 逐模型额度全表（按 Plus 倍率分组，共 28 款有额度模型）

| Plus 倍率 | 模型 | Go $10 | Teams $20 | Plus $40 |
|:--:|---|---:|---:|---:|
| **8x** | **GLM-5.3** | $15 | $20 | **$120** |
| **4x**（$15 → $60） | Kimi K3.1 Pro | $15 | $20 | $60 |
| | Kimi K3 | $15 | $20 | $60 |
| | Step 5 Preview | $15 | $20 | $60 |
| | MiMo-V2.6-Pro | $15 | $20 | $60 |
| | MiMo-V2.5-Pro | $15 | $20 | $60 |
| | Qwen3.8 Max | $15 | $20 | $60 |
| | DeepSeek V4 Pro | $15 | $20 | $60 |
| | Grok 4.7 | $15 | $20 | $60 |
| | GPT 6 Luna | $15 | $20 | $60 |
| | GPT 5.6 Luna | $15 | $20 | $60 |
| | Claude Haiku 5.5 | $15 | $20 | $60 |
| **4x**（$20 / $30 / $60 档） | MiniMax M3.1 Flash | $20 | $25 | $80 |
| | Hy4 preview | $30 | $35 | $120 |
| | Gemini 4 Argon（50% off 期） | $30 | $35 | $120 |
| | LongCat-2.0 | $60 | $65 | **$240** |
| | Hy3 | $60 | $65 | **$240** |
| **3x** | Qwen3.8 Flash | $30 | $35 | $90 |
| | GLM-5.3-Flash | $60 | $65 | $180 |
| | GLM-5.2 | $60 | $65 | $180 |
| | Kimi K2.7 Code | $60 | $65 | $180 |
| | MiniMax M3 | $60 | $65 | $180 |
| | Qwen3.7 Plus | $60 | $65 | $180 |
| **2x** | DeepSeek V4.1 Flash | **$100** | $105 | $200 |
| | MiMo-V2.6-Flash | $60 | $65 | $120 |
| | MiMo-V2.5 | $60 | $65 | $120 |
| | Muse Spark 1.3 Contributor | $60 | $65 | $120 |
| | Muse Spark 1.2 Contributor | $60 | $65 | $120 |

> 免额度款：**Beam Free**、**Iceman Contributor Free** 三档均标 `Unlimited limited time`，不参与额度比较。
> 倍率分布：**8x × 1 款 / 4x × 16 款 / 3x × 6 款 / 2x × 5 款**——**Plus 的加成重心在 4x（过半模型）**。

### 4.3 单位价值（每 1 美元买到多少额度）

> 口径：**单位价值 = 月额度 ÷ 月费**；**相对 Go** = 该档单位价值 ÷ Go 单位价值（**>1 表示升档后每美元买到更多额度，<1 表示变贵**）。

| 模型档（Go 额度） | Go $10 | Teams $20 | Plus $40 | **Teams 相对 Go** | **Plus 相对 Go** |
|---|---:|---:|---:|:--:|:--:|
| $15 档（4x 模型，如 Kimi K3 / Haiku 5.5） | 1.50 | 1.00 | 1.50 | **0.67x** | **1.00x（持平）** |
| $60 档（4x 模型，如 LongCat / Hy3） | 6.00 | 3.25 | 6.00 | **0.54x** | **1.00x（持平）** |
| $15 档（8x：GLM-5.3） | 1.50 | 1.00 | **3.00** | **0.67x** | **2.00x（翻倍）** |
| $60 档（3x 模型，如 GLM-5.3-Flash / GLM-5.2） | 6.00 | 3.25 | 4.50 | **0.54x** | **0.75x（变贵 25%）** |
| $100 档（2x：DeepSeek V4.1 Flash） | **10.00** | 5.25 | 5.00 | **0.53x** | **0.50x（腰斩）** |
| $60 档（2x：MiMo-V2.6-Flash / Muse Spark Contributor） | 6.00 | 3.25 | 3.00 | **0.54x** | **0.50x（腰斩）** |

**读法**：
- **Go 永远是单位价值基准（1.00x）**，任何升档都不可能在"每美元额度"上超过 Go，只有 Plus 在 8x 模型上能反超（2.00x）。
- **Teams 在所有档位上都是 0.53~0.67x**——付 2 倍钱只多拿 `$5/额度档` 的额度，**额度效率必然下降**。它的价值不在效率，在**成员数与额度隔离**。
- **Plus 的盈亏平衡点是 4x**：4x 模型持平、8x 翻倍、3x 亏 25%、2x 亏 50%。**当前只有 GLM-5.3 一款达到 8x**。

### 4.4 选型结论（P0→P2）

- **P0 单人、想省钱** → **留 Go $10**。除 GLM-5.3 外，升 Plus 全部是「单位成本持平或上升」；升 Teams 则一律上升。
- **P0 主力是 GLM-5.3** → **升 Plus $40**（唯一 2.00x 单位价值的模型，8x 加成）；Teams 只给 $20，不划算。
- **P0 团队多人、各自独立额度** → **选 Teams $20/成员**。**这是 Teams 存在的唯一理由**：`Go / Plus 均限单成员 workspace`，只有 Teams 能让每人拿到独立额度而不互相挤占。⚠️ 但**人均额度效率低于 Go**（0.53~0.67x），人数越多、总成本越高——3 人 Teams = $60/月，已超过 Plus 单人 $40。
- **P1 单人、主力是 2x 档（DS V4.1 Flash / MiMo-V2.6-Flash / Muse Spark / MiMo-V2.5）** → **绝对留 Go**。升 Plus 单位价值腰斩（$100 → 每美元 $5 额度），是所有升档动作里最亏的一档。
- **P1 单人、主力是 3x 档（GLM-5.3-Flash / GLM-5.2 / Kimi K2.7 Code）** → **留 Go 或换 GOAT**（GOAT 的 GLM-5.3-Flash 给 $100），**不要升 Plus**（-25%）。
- **P2 需要 Teams 又要高额度** → **Teams + 按需 credits**（Teams 成员同样受 5h=20% / 周=50% / 月=100% 比例窗口约束，超限可走 Zen 余额按量付费，不自动回落）。

> ⚠️ **两档都不能解决"额度效率"问题**：三档 Token 单价完全相同，**加额度只能靠加钱**。若目标是"同样的钱跑更多 token"，正解是换更便宜的模型（见 [国产大模型官方 API vs OpenRouter 价格对比](/2026/11/04/china-llm-api-vs-openrouter-pricing/)）或走 GOAT（见第一至三节）。
