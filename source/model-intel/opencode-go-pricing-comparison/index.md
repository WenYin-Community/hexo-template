---
title: OpenCode Go 定价与性价比测算
date: 2026-11-04
---

> 内部价、请求数上限、峰谷时段与月等效价值测算。数据抓取日 **2026-11-04**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据来源：OpenCode Go 官方文档 [opencode.ai/docs/go](https://opencode.ai/docs/go/)（**2026-11-04 抓取，11 张表全量解析**）、官方营销页 opencode.ai/zh/go、**OpenCode Data（opencode.ai/data，页面顶部"已更新 11月4日, GMT+8 14:32"）**、**OpenCode Zen / Go 清单 API（Zen 80 款、Go 28 ID）**、**CommandCode Provider API（96 端点）/ CLI 1.88.2 目录（94 款，差集 2 款）**、**OpenRouter 模型与 endpoints API（11-04 抓取，目录 455 款）**、各厂商官方 API 定价页（OpenAI / x.ai / 阿里云百炼 / 月之暗面 / MiniMax / 小米 / 智谱 / DeepSeek / 腾讯）。
> **折算汇率：1 美元 ≈ 6.7180 元人民币**（中国外汇交易中心 2026-11-04 中间价，每轮按实时中间价重取）。所有"性价比"均为月等效价值 ÷ 月订阅费（$10）。
> **现行口径**：**三档订阅**——**Go $10/月**、**Go Plus $40/月**（Higher usage limits）、**Go Teams $20/成员/月**（每成员独立额度，逐模型比 Go 高 $5/月）；**三档 Token 单价完全相同**，仅月度额度上限不同（Plus = Go 的 2x / 3x / 4x / 8x）。正文清单 **30 款**（套餐 API **28 个 ID**；`mimo-v2.5`、`mimo-v2.5-pro` 两款**仅正文列出、API 已不返**；**正文新增 `kimi-k3.1-pro`、`iceman-contributor-free`，`gemini-4-argon-contributor` 更名为 `gemini-4-argon`**）；**Go / Go Plus 仅限单成员 workspace**（带 Go 订阅的 workspace 无法邀请成员）；达额**不自动回落**，但可手动切用免费模型；**Iceman Contributor Free** 与 **Beam Free** 为套餐内不限量限时免费（docs 正文标 "Unlimited limited time"，**官方未公布截止日，不可假定已到期**；Beam Free 另有地区限制与 30 天留存）；**DeepSeek ZDR 有效期至 2026-10-31**（月度续签）。
> ⚠️ **DeepSeek V4.1 Flash 月额度实测为 $80**（Off-Peak / Peak 两档同额度），**为 Go 侧现行最高档**；5h / 周窗口按 20% / 50% 比例 = $16 / $40。

---

## 一、官方使用限制

**额度定义**：官方原文 "Usage limits are defined as monthly dollar amounts"，"Each model has the following usage limits: 5-hour — **20%** of the monthly limit; weekly — **50%**; and monthly — **100%**"。**Token pricing is the same for Go and Go Plus.**

| 月度额度档 | 每 5 小时（20%） | 每周（50%） | 每月（100%） |
|---|---|---|---|
| $15 | $3 | $7.5 | $15 |
| $30 | $6 | $15 | $30 |
| $60 | $12 | $30 | $60 |
| $80 | $16 | $40 | $80 |
| $120（Plus） | $24 | $60 | $120 |
| $240（Plus） | $48 | $120 | $240 |

- 🔑 **额度是"月度美元上限 + 比例窗口"**：窗口额度随模型档位自动按比例生成，不再是各档独立的固定数字。
- 每月额度分层：**$15（旗舰/新模型）**、**$30（中间档）**、**$60（成熟模型，主力档）**、**$80（仅 DeepSeek V4.1 Flash，现行最高）**；两档限时翻倍例外见下。
- **限时翻倍（Limited time）**：**Step 5 Preview** $15 → **$60（4x）**（Plus $60 → **$240**）；**Gemini 4 Argon Contributor** $30 → **$60（2x）**（Plus $120 → **$240**）。翻倍后的窗口额度同样按 20% / 50% / 100% 生成（Step 5 Preview 限时口径 = 1,720 / 4,280 / 8,520 次）。
- **为什么部分模型额度低**（官方 "Why some models have lower usage"）：多数模型靠**批量折扣 + 预留 GPU 容量**换取高月额度；新模型或公开价本身已打折的模型无折扣空间，**其额度只是"略高于直付厂商"**——这是档位差异的唯一解释，不是限速。
- **客户端要求**：① 发送典型 coding agent 流量；② **自带 user agent**（如 `my-coding-agent/1.0`），不要用通用 SDK/HTTP 库名；③ 每个会话发送稳定的 `x-opencode-session` 会话 ID。
  - **已验证客户端**：OpenCode、Hermes（含 PR #101864 的构建）、Claude Code、Codex、ZCode、Pi、jcode（v0.81.6+）、Kilo Code CLI（含 PR #13752，**不覆盖 VS Code 扩展**）。
  - **已知有问题**：DeepSeek Harness、GitHub Copilot Chat、Kimi Code、MiMo Code。
- **超限兜底**：达额度后**不会自动切换模型**；官方提示"You can continue using the free models"（**需手动换模型 ID**）。**唯一自动回落机制**：控制台开启 **Use balance** 后，Go 额度用尽会回退到 Zen 按量余额继续请求（付费）。订阅管理已并入 Zen 控制台。
- **Zen 免费层**：**Zen 共 80 款 = 9 款 `-free` + Big Pickle + 70 付费**。`-free` 清单（API 实测）：`beam-free`、**`crouton-alpha-free`（新收录）**、`deepseek-v4.1-flash-free`、`flint-40b-free`、`glm-5.3-flash-free`、`mimo-v2.6-flash-free`、`nemotron-3.5-lightning-free`、`nemotron-3.5-super-vl-free`、**`pulse-alpha-free`（新收录）**（`deepseek-v4.1-flash-free`、`glm-5.3-flash-free`、`flint-40b-free` 等未列进 docs/zen 免费表，**以 API 清单为准**）。**已下架**：`minimax-m3.1-flash-free`（限时免费结束）、`longcat-2.5-preview-free`、`jev-1.13-free`。Zen 的 `-free` 与 Go 的付费 ID 是两套模型名（`opencode/mimo-v2.6-flash-free` vs `opencode-go/mimo-v2.6-flash`）。
- **API 端点**：全部为 **`https://opencode.ai/inference/go/{openai,anthropic,google}/v1*`**，以 Go 订阅的同一 API key 认证（登录 Zen 控制台复制），按协议分流（端点表 **29 行 = 5 + 5 + 1 + 18**）：

| 协议 | 端点 | 模型（29 款） | SDK |
|---|---|---|---|
| **Responses** | `/inference/go/openai/v1/responses` | Grok 4.7、GPT 6 Luna、GPT 5.6 Luna、Muse Spark 1.3 Contributor、Muse Spark 1.2 Contributor（**5 款**） | `@ai-sdk/openai` |
| **Chat Completions** | `/inference/go/openai/v1/chat/completions` | GLM-5.3-Flash、GLM-5.3、GLM-5.2、**Kimi K3.1 Pro**、Kimi K3、Kimi K2.7 Code、LongCat-2.0、Step 5 Preview、Beam Free、**Iceman Contributor Free**、DeepSeek V4.1 Flash、DeepSeek V4 Pro、MiMo-V2.6-Flash、MiMo-V2.6-Pro、MiMo-V2.5、MiMo-V2.5-Pro、Hy4 preview、Hy3、**MiniMax M3.1 Flash**（**19 款**） | `@ai-sdk/openai-compatible` |
| **Anthropic Messages** | `/inference/go/anthropic/v1/messages` | Claude Haiku 5.5、MiniMax M3、Qwen3.8 Max、Qwen3.8 Flash、Qwen3.7 Plus（**5 款**） | `@ai-sdk/anthropic` |
| **Google** | `/inference/go/google/v1beta/models/gemini-4-argon` | Gemini 4 Argon（**1 款**；原 `gemini-4-argon-contributor` 已更名） | `@ai-sdk/google` |

  - 模型 ID 为短格式（如 `kimi-k3`），OpenCode 配置中写 `opencode-go/kimi-k3`；完整清单 `GET https://opencode.ai/inference/go/v1/models`（**返回 28 个 ID**，与 docs 表格互有出入）。**旧路径 `https://opencode.ai/zen/go/v1/*` 仍返回 200（10-23 实测），属于兼容别名，但文档与配置口径已统一到 `/inference/go/*`**。
  - **✅ 两平台 API 能力已对齐**：Command Code Provider 自 CLI v1.55.0 起同样支持 Responses。
  - ⚠️ **Kimi K3 与 MiniMax M3 走不同协议**：Kimi K3 = Chat Completions，MiniMax M3 = Anthropic Messages；调用 Anthropic 兼容层时注意 `max_tokens` 必填。
- **隐私表（29 款全覆盖）**：

| 留存口径 | 模型 |
|---|---|
| **0 days（ZDR）** | GLM-5.3-Flash、GLM-5.3、GLM-5.2、Kimi K3、Kimi K2.7 Code、LongCat-2.0、MiMo-V2.6-Pro、MiMo-V2.6-Flash、MiMo-V2.5-Pro、MiMo-V2.5、Qwen3.8 Max、Qwen3.8 Flash、Qwen3.7 Plus、MiniMax M3、Hy4 preview、Hy3、**MiniMax M3.1 Flash Free**、LongCat 2.5 Preview Free、Step 5 Preview |
| **0 days\*（DeepSeek）** | DeepSeek V4.1 Flash、DeepSeek V4 Pro（**ZDR 协议按月续签，现行有效期至 2026-10-31**） |
| **30 days（不用于训练）** | Grok 4.7（ZDR 会禁用 Responses 状态化、Files/Collections、Batch）、GPT 6 Luna、GPT 5.6 Luna（滥用监控日志最多 30 天）、**Claude Haiku 5.5**（按 Anthropic Data Policies）、**Beam Free** |
| **训练 Yes / Not ZDR** | **Gemini 4 Argon Contributor**（提示与补全可用于训练未来 Google 模型）、Muse Spark 1.3 Contributor、Muse Spark 1.2 Contributor（Metal 地理使用政策限地区） |

  Zen 落地页另有信用卡手续费 4.4% + $0.30/笔提示。

---

## 二、各模型请求数限制与典型使用模式

数据为每 5 小时 / 每周 / 每月请求数（**Go 档**，Plus 档同名放大 2x/3x/4x/8x）。**现行数值一律以本表为准**。典型 token 组成：docs 当期不再逐模型披露，沿用各模型族已公布口径；**新上架 5 款（Step 5 Preview / Beam Free / Claude Haiku 5.5 / Gemini 4 Argon Contributor / MiniMax M3.1 Flash Free）无口径，标 "—"**。

| 模型 | 每5小时 | 每周 | 每月 | 典型输入 | 典型缓存 | 典型输出 | 月额度 Go | 月额度 Plus |
|---|---|---|---|---|---|---|---|---|
| GLM-5.3-Flash | 6,320 | 15,790 | 31,580 | 1,000 | 55,000 | 200 | $60 | $180（3x） |
| GLM-5.3 | 220 | 540 | 1,080 | 700 | 52,000 | 150 | $15 | $120（8x） |
| GLM-5.2 | 880 | 2,150 | 4,300 | 700 | 52,000 | 150 | $60 | $180（3x） |
| Kimi K3 | 110 | 250 | 490 | 1,050 | 76,500 | 300 | $15 | $60（4x） |
| Kimi K2.7 Code | 1,350 | 3,380 | 6,750 | 870 | 55,000 | 200 | $60 | $180（3x） |
| LongCat-2.0 | 11,400 | 28,600 | 57,200 | 920 | 88,900 | 200 | $60 | $240（4x） |
| LongCat 2.5 Preview Free | Unlimited | Unlimited | Unlimited | — | — | — | Free（限时） | Free（限时） |
| **Step 5 Preview** | 430 | 1,070 | 2,130 | — | — | — | $15（限时 $60） | $60（限时 $240） |
| **Beam Free** | Unlimited | Unlimited | Unlimited | — | — | — | Free（限时、限地区） | Free（限时、限地区） |
| MiMo-V2.6-Flash | 30,100 | 75,200 | 150,400 | 830 | 71,500 | 295 | $60 | $120（2x） |
| MiMo-V2.6-Pro | 3,250 | 8,150 | 16,300 | 790 | 86,000 | 305 | $15 | $60（4x） |
| MiMo-V2.5 | 30,100 | 75,200 | 150,400 | 830 | 71,500 | 295 | $60 | $120（2x） |
| MiMo-V2.5-Pro | 3,250 | 8,150 | 16,300 | 790 | 86,000 | 305 | $15 | $60（4x） |
| MiniMax M3 | 3,200 | 8,000 | 16,000 | 510 | 56,000 | 190 | $60 | $180（3x） |
| Muse Spark 1.3 Contributor | 45,300 | 113,300 | 226,600 | 620 | 71,400 | 300 | $60 | $120（2x） |
| Muse Spark 1.2 Contributor | 45,300 | 113,300 | 226,600 | 620 | 71,400 | 300 | $60 | $120（2x） |
| Qwen3.8 Max | 160 | 400 | 810 | 420 | 66,000 | 200 | $15 | $60（4x） |
| Qwen3.8 Flash | 5,400 | 13,500 | 27,000 | 600 | 58,000 | 200 | $30 | $90（3x） |
| Qwen3.7 Plus | 4,300 | 10,800 | 21,600 | 500 | 57,000 | 190 | $60 | $180（3x） |
| **DeepSeek V4.1 Flash** | **34,670** | **86,670** | **173,330** | 410 | 71,300 | 310 | **$80** | $160（2x） |
| DeepSeek V4 Pro | 1,050 | 2,600 | 5,200 | 750 | 82,000 | 290 | $15 | $60（4x） |
| Hy4 preview | 1,350 | 3,380 | 6,770 | 830 | 71,500 | 295 | $30 | $120（4x） |
| Hy3 | 4,300 | 10,750 | 21,500 | 830 | 71,500 | 295 | $60 | $240（4x） |
| **MiniMax M3.1 Flash Free** | Unlimited | Unlimited | Unlimited | — | — | — | **免费（限时）** | 免费（Unlimited） |
| Grok 4.7 | 169 | 423 | 845 | 390 | 32,500 | 120 | $15 | $60（4x） |
| GPT 6 Luna | 4,230 | 10,560 | 21,130 | 1,000 | 50,000 | 220 | $15 | $60（4x） |
| GPT 5.6 Luna | 2,050 | 5,100 | 10,250 | 1,000 | 50,000 | 220 | $15 | $60（4x） |
| **Claude Haiku 5.5** | 3,850 | 9,620 | 19,230 | — | — | — | $15 | $60（4x） |
| **Gemini 4 Argon Contributor** | 220 | 540 | 1,060 | — | — | — | $30（限时 $60） | $120（限时 $240） |

- **限时档请求数**：Step 5 Preview 限时 4x = **1,720 / 4,280 / 8,520**；Gemini 4 Argon Contributor 限时 2x = **440 / 1,080 / 2,120**。
- **Muse Spark 条款**：以大幅折扣 token 价换取**提示词与补全用于训练未来 Meta 模型**的授权，仅限 Meta 地理使用政策允许地区；上下文 Go 侧未公布，Command Code GOAT 披露为 **1M**。
- **Grok 4.7 双档价**：≤200K / >200K 两个价格段（典型 token 390 / 32,500 / 120）。
- **请求量天花板**：**Muse Spark 226,600 次/月** > **DeepSeek V4.1 Flash / MiMo-V2.5 / MiMo-V2.6-Flash 150,400 ~ 173,330 次/月** > LongCat-2.0 57,200 > GLM-5.3-Flash 31,580。
- ⚠️ **2 款仅正文存在**（`mimo-v2.5`、`mimo-v2.5-pro`）：**API 已不返**（小米官方 API 已于 2026-10-21 10:00 UTC+8 下线），正文四张表仍列——**这两个 ID 已不可调用，勿写进配置**。

---

## 三、Go 内部定价（每百万 Token）

**DeepSeek 系分峰谷价**（Off-Peak = 空闲；Peak = UTC 01:00-04:00、06:00-10:00，即北京时间 9:00-12:00、14:00-18:00；**周末全天按 Off-Peak 价**）。**Go 与 Go Plus 的 Token 单价完全相同，只有 Monthly limit 不同。** 36 行 = 29 款 + 7 行双档拆分（Qwen3.7 Plus / DS V4.1 Flash / DS V4 Pro / Grok 4.7 / GPT 6 Luna / GPT 5.6 Luna / Claude Haiku 5.5）。

| 模型 | 输入 | 输出 | 缓存读取 | 缓存写入 | 月额度 Go / Plus |
|---|---|---|---|---|---|
| GLM-5.3-Flash | $0.15 | $0.50 | $0.03 | - | $60 / $180 |
| GLM-5.3 | $1.40 | $4.40 | $0.26 | - | $15 / $120 |
| GLM-5.2 | $1.40 | $4.40 | $0.26 | - | $60 / $180 |
| Kimi K3 | $3.00 | $15.00 | $0.30 | - | $15 / $60 |
| Kimi K2.7 Code | $0.95 | $4.00 | $0.19 | - | $60 / $180 |
| LongCat-2.0 | $0.30 | $1.20 | $0.006 | - | $60 / $240 |
| LongCat 2.5 Preview Free | Free | Free | Free | - | Unlimited（限时） |
| **Step 5 Preview** | $1.00 | $2.70 | $0.10 | - | $15（限时 $60）/ $60（限时 $240） |
| **Beam Free** | Free | Free | Free | - | Unlimited（限时） |
| MiMo-V2.6-Flash | $0.14 | $0.28 | $0.0028 | - | $60 / $120 |
| MiMo-V2.6-Pro | $0.435 | $0.87 | $0.003625 | - | $15 / $60 |
| MiMo-V2.5 | $0.14 | $0.28 | $0.0028 | - | $60 / $120 |
| MiMo-V2.5-Pro | $0.435 | $0.87 | $0.003625 | - | $15 / $60 |
| MiniMax M3 | $0.30 | $1.20 | $0.06 | - | $60 / $180 |
| Muse Spark 1.3 Contributor | $0.10 | $0.20 | $0.002 | - | $60 / $120 |
| Muse Spark 1.2 Contributor | $0.10 | $0.20 | $0.002 | - | $60 / $120 |
| Qwen3.8 Max | $2.00 | $6.00 | $0.25 | $2.50 | $15 / $60 |
| Qwen3.8 Flash | $0.15 | $0.47 | $0.016 | $0.20 | $30 / $90 |
| Qwen3.7 Plus（≤ 256K） | $0.40 | $1.60 | $0.04 | $0.50 | $60 / $180 |
| Qwen3.7 Plus（> 256K） | $1.20 | $4.80 | $0.12 | $1.50 | $60 / $180 |
| DeepSeek V4.1 Flash（Off-Peak） | $0.15 | $0.60 | $0.003 | - | $80 / $160 |
| DeepSeek V4.1 Flash（Peak） | $0.30 | $1.20 | $0.006 | - | $80 / $160 |
| DeepSeek V4 Pro（Off-Peak） | $0.66 | $1.98 | $0.022 | - | $15 / $60 |
| DeepSeek V4 Pro（Peak） | $1.32 | $3.96 | $0.044 | - | $15 / $60 |
| Hy4 preview | $0.834 | $2.501 | $0.042 | - | $30 / $120 |
| Hy3 | $0.14 | $0.58 | $0.035 | - | $60 / $240 |
| MiniMax M3.1 Flash Free | Free | Free | Free | - | 免费 / 免费 |
| Grok 4.7（≤ 200K） | $2.00 | $6.00 | $0.50 | - | $15 / $60 |
| Grok 4.7（> 200K） | $4.00 | $12.00 | $1.00 | - | $15 / $60 |
| GPT 6 Luna（≤ 272K） | $0.10 | $0.50 | $0.01 | $0.125 | $15 / $60 |
| GPT 6 Luna（> 272K） | $0.20 | $0.75 | $0.02 | $0.25 | $15 / $60 |
| GPT 5.6 Luna（≤ 272K） | $0.20 | $1.20 | $0.02 | $0.25 | $15 / $60 |
| GPT 5.6 Luna（> 272K） | $0.40 | $1.80 | $0.04 | $0.50 | $15 / $60 |
| **Claude Haiku 5.5（≤ 100K）** | **$0.10** | **$0.50** | **$0.01** | **$0.125** | $15 / $60 |
| **Claude Haiku 5.5（> 100K）** | $0.50 | $2.50 | $0.05 | $0.625 | $15 / $60 |
| **Gemini 4 Argon Contributor** | $4.00 | $20.00 | $0.20 | - | $30（限时 $60）/ $120（限时 $240） |

> **内部价三条结构特征**：① **Go 内侧价格区间宽达 200 倍**（MiMo-V2.6-Flash $0.14 → Kimi K3 / Grok 4.7 $15.00 输出）；② **缓存读取普遍是输入价的 2%~10%**（MiMo 系 2%、GLM 系 19%、Kimi K3 10%、MiniMax M3 20%）；③ **仅 Qwen3.8 Max / Qwen3.8 Flash / Qwen3.7 Plus / GPT 6 Luna / GPT 5.6 Luna / Claude Haiku 5.5 收缓存写入费**（其余为 `-`，即不计写入）。

---

## 四、厂商官方 API 定价（每百万 Token）

| 模型 | 输入 | 缓存读取 | 输出 | 缓存写入 | 上下文 | 备注 |
|---|---|---|---|---|---|---|
| **Claude Haiku 5.5** | **$1.00** | $0.10 | **$5.00** | $1.25 | 200K | 海外旗舰档；区域档 +10%（$1.10/$5.50）；8 端点全为一线云官方 |
| **GPT 6 Luna** | **$0.10** | $0.01 | **$0.50** | $0.125 | 1.05M | 2026-09-22 发布；Go 内最低单价 |
| GPT 5.6 Luna | $0.20 | $0.02 | $1.20 | $0.25 | 1M | 批量 5 折；>272K 输入 $0.40 / 输出 $1.80 |
| **GPT 6 Sol** | $2.00 | $0.20 | $10.00 | $2.50 | 1.05M | 复杂编码/Agent 工作流；Go 未上架（Pro 档起） |
| **Claude Opus 5.5** | $4.00 | $0.20 | $20.00 | $5.00 | 1M | 能力追平 Fable 5.1、成本较 Opus 5 低 40%；Go/GOAT 均未上架（Max 档） |
| **Gemini 4 Argon Contributor** | 官方未公布 | — | — | — | — | Contributor 档（数据换折扣），**无独立目录价**；Go 内部价 $4.00/$20.00/$0.20 为现行唯一公开口径 |
| GLM-5.3 | ¥8.00 | ¥2.00 | ¥28.00 | - | 1M | 权重 8/28 已开源；GLM Coding Plan 全量上线 |
| GLM-5.3-Flash | ¥0.80 | ¥0.23 | ¥2.80 | - | 1M | 官方目录价 = GLM-5.3 的 1/10；320B/18B、MIT |
| GLM-5.3-FlashX | ¥2.00 | ¥0.57 | ¥7.00 | - | 1M | 同基座极速档：最高 200 tok/s（约 Flash 的 5 倍），价格 2.5 倍；Go 未上架、GOAT 已收录 |
| GLM-5.2 | ¥8.00 | ¥2.00 | ¥28.00 | - | 1M | 缓存存储限时免费 |
| Kimi K3 | ¥20.00 | ¥2.00 | ¥100.00 | - | 1M | 已接入 AWS Bedrock |
| Kimi K2.7 Code | ¥6.50 | ¥1.30 | ¥27.00 | - | 256K | **HighSpeed 档 ¥13 / ¥54 · 缓存 ¥2.60，262K** |
| **Step 5 Preview** | ¥7.00 | ¥0.35 | ¥20.00 | - | — | 腾讯 TokenHub 代理价；Go 内部 $1.00/$2.70/$0.10 |
| **Beam 1.0（`reflection/beam`）** | $0.25 | 无缓存项 | $1.00 | - | — | OpenRouter 最低位 Nebius；Go 侧 `beam-free` 限时免费 |
| MiMo-V2.5 | ¥1.00 | ¥0.02 | ¥2.00 | 限时免费 | 1M | ⚠️ **已于 2026-10-21 10:00（UTC+8）在小米官方正式下线**，旧 ID 报错；Go / CommandCode / OpenRouter 渠道仍在供（转售存货），**新配置改用 `mimo-v2.6-flash`** |
| MiMo-V2.5-Pro | ¥3.00 | ¥0.025 | ¥6.00 | 限时免费 | 1M | 同上；**替代模型 = `mimo-v2.6-pro`**（参数完全适配，由纯文本转为支持多模态） |
| **MiMo-V2.6-Flash** | ¥1.00 | ¥0.02 | ¥2.00 | 限时免费 | 1M | 官方定价页（**更新 2026-10-08**）已列国内价，与 V2.5 同价；海外 $0.0028/$0.14/$0.28；Batch 5 折 |
| **MiMo-V2.6-Pro** | ¥3.00 | ¥0.025 | ¥6.00 | 限时免费 | 1M | 与 V2.5 Pro 同价；海外 $0.0036/$0.435/$0.87；Batch 5 折 |
| **MiMo-V2.6-Pro-UltraSpeed** | ¥30.00 | ¥0.25 | ¥60.00 | 限时免费 | 1M | 较 V2.5-Pro-UltraSpeed（¥9/¥0.075/¥18）**涨 3.33 倍**；海外 $4.35/$0.036/$8.70；**不支持 Batch**；Go 未上架、GOAT 已收录 |
| MiniMax M3 | ¥2.10 | ¥0.42 | ¥8.40 | - | 1M | ≤512K 输入 5 折（"永久五折"口径维持） |
| Qwen3.8 Max / max-0902 | ¥12.00 | ¥1.20 | ¥36.00 | - | 1M | **max-prime 优速档 ¥24/¥72**；国际版 $14.99/$44.97 |
| Qwen3.8 Flash | ¥0.80 | ¥0.08 | ¥2.70 | - | 1M | 0<≤1M 档 |
| Qwen3.8-Omni-Flash | ¥0.8 档（音视频降价后） | — | — | - | 1M | **原生全模态**：文本/图像/音频/视频输入、1 小时连续音视频；音频输入降幅 >98%、音视频 >93%；**GOAT 已收录（$0.15/$0.47/$0.016），Go 未上架** |
| Qwen3.7 Plus | ¥1.60 | ¥0.16 | ¥6.40 | ¥2.00 | 1M | 原价 8 折 |
| **DeepSeek V4.1 Flash**（官方 ID `deepseek-flash`） | **¥1.00 空闲 / ¥2.00 高峰** | **¥0.02 / ¥0.04** | **¥4.00 空闲 / ¥8.00 高峰** | - | 1M | **MODEL VERSION = `DeepSeek-V4.1-Flash-1017`**；价格/峰谷/并发（flash 2500、pro 500）**全部未变**；周末全天按空闲价；⚠️ **新增 Search / Fetch API $0.75 / 1000 次**——经 DeepSeek Harness / Claude Code / Codex 的服务端工具调用**目前免费，2026-11-01 北京时间 0 点起计费** |
| **DeepSeek V4 Pro**（官方 ID `deepseek-v4-pro`） | ¥4.50 空闲 / ¥9.00 高峰 | ¥0.15 / ¥0.30 | ¥13.50 空闲 / ¥27.00 高峰 | - | 1M | **MODEL VERSION = `DeepSeek-V4-Pro-0813`**；继续按原价服务；官方端点在 OpenRouter 列售（`tag=deepseek`，价随时段浮动） |
| Hy3 | ¥1.00 | ¥0.25 | ¥4.00 | - | 256K | 无峰谷 |
| Hy4 preview | ¥6.00 | ¥0.30 | ¥18.00 | - | 1M | TokenHub 定价；OpenRouter 现为 **4 家完全同价 $0.834/$2.501/$0.042** |

> **定价要点**：
> 1. **DeepSeek 官方端点已在 OpenRouter 列售**（endpoint `tag=deepseek`），价格随官方峰谷实时浮动：10-21 抓取时刻（北京 12:40 前后，工作日午间非高峰）落在**空闲窗口**，`deepseek-v4.1-flash-1017` 线抓到 **$0.15/$0.60 · 缓存 $0.003**。**但该端点并非每条 DeepSeek 线都有**——`deepseek/deepseek-v4-pro` 的 16 渠道中**无 `tag=deepseek`**，官方直供在 Pro 线上缺席。
> 2. **🔑 V4 Pro 缓存：第三方一律高于官方，缓存密集场景必须走官方直连**：OpenRouter 的 `pricing.discount` 字段表示**已折后实付价**（`0.895` = −89.5%），原价 = 折后价 ÷ (1 − discount)；**负值 = 溢价**。11-04 实测 **V4 Pro 缓存读最低为 StreamLake $0.07961（disc 0.451）/ GMICloud $0.07975（disc 0.45）**，折人民币约 **¥0.537**，仍是官方空闲 ¥0.15 的 **3.6 倍**；输入最低 **Relace $0.90（¥6.07，反比官方 ¥4.50 贵 35%）**、输出最低 **Relace $1.50（¥10.11，便宜 25%）**。⚠️ **百度千帆的 −89.5% 深度折扣未复现**（现行 -47.1%，$0.894/$1.788/$0.07406）。**结论：V4 Pro 一律走官方直连（空闲 ¥4.50 / ¥13.50 / ¥0.15）**。**V4.1 Flash 侧仍是例外**：最低三项 **Morph / Relace $0.0350 / Sail Research $0.2500 / CoreWeave $0.0020**，缓存 $0.002 低于官方空闲 $0.003 约 33%。
> 3. **最低位分布（11-04）**：V4.1 Flash 40 渠道——输入 **Morph / Relace $0.0350**、输出 **Sail Research $0.2500**、缓存 **CoreWeave $0.0020**；**V4.1 Flash-1017 为 46 渠道**，输入 + 缓存最低 **Particle AI $0.0250 / $0.0015（flex）**、输出最低 **Sail Research $0.1500**；GLM-5.3-Flash 41 渠道——**Relace $0.0269 / Relace $0.0996 / Darkbloom $0.0120**；GLM-5.3 48 渠道——输入 **Wafer $0.0699（us）**、输出 + 缓存 **Baidu $0.8800 / $0.0520（disc 0.8）**；GLM-5.2 33 渠道——输入 + 缓存 **Wafer $0.0060 / $0.0050（us）**、输出 **Morph $1.4000**；Kimi K3 30 渠道——输入 + 输出 **Relace $0.1900 / $8.9400**、缓存 **Wafer $0.1300（us）**；MiniMax M3.1 Flash 13 渠道——**Tenstorrent $0.0500 / $0.2000 / $0.0050**。明细见 [国产大模型官方 API vs OpenRouter 价格对比](/model-intel/china-llm-api-vs-openrouter-pricing/) 第二节。⚠️ **最低位多为第三方量化通道（fp4/fp8）或限时折扣，采购前须自备质量评测并核对折扣有效期**。
> 4. **Go/GOAT 内部价与渠道波动解耦**：OpenRouter 渠道价高频波动期间，Go 侧 DeepSeek 峰谷内部价、GLM $1.40/$4.40 等透传口径全部未动。

---

## 五、性价比测算（月等效价值 ÷ $10 月费）

单次成本 = 典型输入 token × 输入价 + 典型缓存 token × 缓存价 + 典型输出 token × 输出价；月等效价值 = 月请求数 × 单次成本。**DeepSeek 系按 Off-Peak（空闲 / 周末）价测算**（Peak 口径见注释）。**无典型 token 口径的 5 款按 月额度 ÷ 月请求数反推**（标 ※）。

| 模型 | 月请求 | 单次成本 | 月等效价值 | 性价比 | 备注 |
|---|---|---|---|---|---|
| Kimi K2.7 Code | 6,750 | $0.012077 | $81.52 | **8.2x** | ⚠️ 高于标称 $60 额度 36%，典型 token 口径疑沿用 K2.6 |
| **DeepSeek V4.1 Flash** | 173,330 | $0.000461 | $79.97 | **8.0x** | Go 侧最高档，$80 额度 |
| GLM-5.2 | 4,300 | $0.015160 | $65.19 | **6.5x** | $60 档智能最高的均衡主力 |
| Qwen3.7 Plus | 21,600 | $0.002784 | $60.13 | **6.0x** | |
| LongCat-2.0 | 57,200 | $0.001049 | $60.03 | **6.0x** | |
| MiMo-V2.6-Flash | 150,400 | $0.000399 | $60.01 | **6.0x** | 请求量顶格 |
| MiMo-V2.5 | 150,400 | $0.000399 | $60.01 | **6.0x** | 官方 10-21 下线 |
| Muse Spark 1.3 Contributor | 226,600 | $0.000265 | $60.00 | **6.0x** | 数据换折扣 |
| Muse Spark 1.2 Contributor | 226,600 | $0.000265 | $60.00 | **6.0x** | 数据换折扣 |
| GLM-5.3-Flash | 31,580 | $0.001900 | $60.00 | **6.0x** | 多模态 + 1M |
| Hy3 | 21,500 | $0.002790 | $59.98 | **6.0x** | |
| MiniMax M3 | 16,000 | $0.003741 | $59.86 | **6.0x** | $60 档 Agentic 最高 |
| Qwen3.8 Flash | 27,000 | $0.001112 | $30.02 | **3.0x** | |
| Hy4 preview | 6,770 | $0.004433 | $30.01 | **3.0x** | |
| **MiniMax M3.1 Flash Free** | Unlimited | — | — | **免费** | MiniMax 新一代轻量档、1M、多模态、限时免费 |
| **Gemini 4 Argon Contributor**※ | 1,060 | $0.028302 | $30.00 | **3.0x** | 限时 2x 后 **6.0x**（$60） |
| GLM-5.3 | 1,080 | $0.015160 | $16.37 | **1.6x** | 但 **Plus 8x → 单位成本减半** |
| Kimi K3 | 490 | $0.030600 | $14.99 | **1.5x** | Go 内智能第一 |
| Qwen3.8 Max | 810 | $0.018540 | $15.02 | **1.5x** | |
| MiMo-V2.6-Pro | 16,300 | $0.000921 | $15.01 | **1.5x** | |
| MiMo-V2.5-Pro | 16,300 | $0.000921 | $15.01 | **1.5x** | 官方 10-21 下线 |
| GPT 5.6 Luna | 10,250 | $0.001464 | $15.01 | **1.5x** | |
| Grok 4.7 | 845 | $0.017750 | $15.00 | **1.5x** | 双档价，此处按 ≤200K |
| GPT 6 Luna | 21,130 | $0.000710 | $15.00 | **1.5x** | Go 内最低单价 |
| **Claude Haiku 5.5**※ | 19,230 | $0.000780 | $15.00 | **1.5x** | ≤100K 档 $0.10/$0.50 |
| **Step 5 Preview**※ | 2,130 | $0.007042 | $15.00 | **1.5x** | 限时 4x 后 **6.0x**（$60） |
| DeepSeek V4 Pro | 5,200 | $0.002873 | $14.94 | **1.5x** | |
| **LongCat 2.5 Preview Free** | Unlimited | Free | — | **∞** | 限时 |
| **Beam Free** | Unlimited | Free | — | **∞** | 限时、限地区、留存 30 天 |

> **峰谷口径注释**：DeepSeek 系按 **Off-Peak（空闲 / 周末）** 价测算。**工作日 Peak 时段（北京 9:00-12:00、14:00-18:00）单价为空闲的 2 倍**——同样请求量消耗的月额度翻倍，等同可用请求量减半（V4.1 Flash 173,330 → ≈86,670 次/月、V4 Pro 5,200 → 2,600 次/月）。**周末全天按空闲价。**
> **※ 反推法说明**：Step 5 Preview / Beam Free / Claude Haiku 5.5 / Gemini 4 Argon Contributor **无官方典型 token 口径**，单次成本按 `月额度 ÷ 月请求数` 反推，仅反映"额度换来的平均单次预算"，**不与上表其余行做逐项精度比较**。
> **Muse Spark 使用条款警示**：其低价以"提示词与补全用于训练未来 Meta 模型"为对价，且仅限 Meta 地理政策允许地区；敏感/商业代码项目慎用。**Gemini 4 Argon Contributor 同理**（训练 Yes / Not ZDR）且为 Google 官方口径，**不可用于含客户数据的场景**。

---

### Go Plus（$40/月）性价比测算

> 口径：**Plus 月费为 Go 的 4 倍**（$10 → $40），**Token 单价两档完全相同**。因此 **Plus 的单位成本 = Go 的单位成本 × (4 ÷ 额度倍率)**。倍率由两档月额度（及请求数表）直接求出，29 款全覆盖、无缺口。

| 倍率档 | 款数 | 单位成本（Go = 1.00） | 等价结论 | 模型（Go 月额度 → Plus 月额度） |
|---|---|---|---|---|
| **8x** | 1 | **0.50x（便宜 50%）** | ✅ **唯一明确划算** | **GLM-5.3**：$15 → **$120** |
| **4x** | 14 | **1.00x（持平）** | ⚪ 同单价，仅额度更高 | Kimi K3（$15→$60）、LongCat-2.0（$60→$240）、**Step 5 Preview**（$15→$60）、MiMo-V2.6-Pro、MiMo-V2.5-Pro、Qwen3.8 Max（$15→$60）、DS V4 Pro（$15→$60）、Hy4 preview（$30→$120）、Hy3（$60→$240）、Grok 4.7、GPT 6 Luna、GPT 5.6 Luna、**Claude Haiku 5.5**（$15→$60）、**Gemini 4 Argon**（$30→$120） |
| **3x** | 6 | **1.33x（贵 33%）** | ⚠️ 单位成本上升 | GLM-5.3-Flash（$60→$180）、GLM-5.2、Kimi K2.7 Code、MiniMax M3、Qwen3.8 Flash（$30→$90）、Qwen3.7 Plus |
| **2x** | 5 | **2.00x（贵 100%）** | 🚫 **最不划算** | **DeepSeek V4.1 Flash（$80 → $160）**、MiMo-V2.6-Flash、MiMo-V2.5、Muse Spark 1.3/1.2 Contributor（$60 → $120） |
| 免费 | 2 | — | 两档均 Unlimited | LongCat 2.5 Preview Free、Beam Free |

**关键结论**：

1. **Plus 不是"更便宜"，而是"能跑更久"**——官方原话 Higher usage limits，两档 Token 价共用一张表。**除 GLM-5.3（8x）外，Plus 的单位成本均 ≥ Go**。
2. **🔴 主力模型反而更贵**：调用量榜 Top 主力 **DeepSeek V4.1 Flash、MiMo-V2.6-Flash、Muse Spark 1.3/1.2** 恰好都是 **2x 档**——**若用量集中在这几款，升 Plus 等于单位成本翻倍**。Go 的 $10 更划算。
3. **🟢 GLM-5.3 是唯一升级理由**：$15 → $120（8x），单位成本降至 Go 的 **一半**；且其 AA 智能 59.51 / Agentic 59.10 为 Go 内第一梯队，**适合把 GLM-5.3 当主力（Oracle / Opus 位）且用量大的用户**。
4. **4x 档（15 款）为"持平线"**：单位成本与 Go 相同，价值体现在**额度天花板**（LongCat-2.0 由 11,400 → 45,600 次/5h、GPT 6 Luna 由 4,230 → 16,920 次/5h、Claude Haiku 5.5 由 3,850 → 15,380 次/5h）——**适合长会话、大项目、怕撞窗口限制的场景**。
5. **P0 决策规则**：
   - 用量以 **DS V4.1 Flash / MiMo-V2.6-Flash / Muse Spark** 为主 → **留在 Go（$10）**；
   - 用量以 **GLM-5.3** 为主 → **升 Plus（$40），单位成本腰斩**；
   - 需要**大额度不撞墙**（4x 档模型）→ **Plus，但接受单价持平**；
   - **不要为"省钱"买 Plus**。

---

## 六、模型评分（Artificial Analysis，08-18 快照）

> 来源：artificialanalysis.ai 独立评测（AA 已移除编码指数，仅保留智能/Agentic 两项）。**无更新快照**；Gemini 4 Argon Contributor / Step 5 Preview / Beam / Claude Haiku 5.5 / Qwen3.8 Flash / Hy4 preview / MiniMax M3.1 Flash Free / **Grok 4.7 / MiMo-V2.6 系列 / LongCat-2.0 / DeepSeek V4.1 Flash** 均未收录。
> 参照：Claude Opus 5 = 63.05/59.17，GPT-5.6 Sol = 60.93/57.78，Claude Fable 5 = 62.07/56.59，Claude Sonnet 5 ≈ 55/49.7（非 Go 模型）。

| 模型 | 智能 | Agentic | 性价比 | 评分定位 |
|---|---|---|---|---|
| Kimi K3 | **59.70** | 54.26 | 1.5x | Go 内智能第一 |
| GLM-5.3 | 59.51 | **59.10** | 1.6x（Plus 8x 后最优） | Agentic Go 内最高 |
| Qwen3.8 Max | 58.08 | 58.40 | 1.5x | Agentic 第二 |
| DeepSeek V4 Pro（0813） | 53.20 | 49.56 | 1.5x | 深度推理 |
| GLM-5.2 | 52.64 | 45.7 | **6.5x** | 均衡主力（$60 档最高智能） |
| GPT 5.6 Luna | 52.32 | 46.90 | 1.5x | 第一梯队（$15） |
| MiniMax M3 | 45.40 | 36.1 | 6.0x | $60 中 Agentic 最高 |
| Kimi K2.7 Code | 43.02 | 30.3 | **8.2x** | 性价比第一（$60 档） |
| MiMo-V2.5-Pro | 42.88 | 29.5 | 1.5x | $15 |
| Hy3 | 42.0 | 31.4 | 6.0x | 通用推理 |
| Qwen3.7 Plus | 39.4 | 20.7 | 6.0x | 中下 |
| MiMo-V2.5 | 38.0 | 23.7 | 6.0x | 中下 |
| Muse Spark 1.2 Contributor | — | — | 6.0x | AA Intelligence Index v4.1.1 = 57 |
| Muse Spark 1.3 Contributor | — | — | 6.0x | AA v4.1.1 = 61（max 档 62），Meta 史上最强 |
| GLM-5.3-Flash | **57.5**¹ | — | 6.0x | AA 值由 Command Code GOAT 页披露 |
| **Claude Haiku 5.5 / Step 5 Preview / Gemini 4 Argon / MiniMax M3.1 Flash Free / LongCat-2.0 / Qwen3.8 Flash / Hy4 preview / DeepSeek V4.1 Flash / Grok 4.7 / MiMo-V2.6-Flash / MiMo-V2.6-Pro** | — | — | 1.5 / 1.5 / 3.0 / 免费 / 6.0 / 3.0 / 3.0 / 8.0 / 1.5 / 6.0 / 1.5 | AA 未收录 |

¹ **异口径参照**：Command Code GOAT 页 Intelligence（10-21）为独立评分体系，**不可与 AA 数值混比**，仅用于 Go 内部横向排序：Muse Spark 1.3 48.1 > Grok 4.7 46.4 > MiMo V2.6 Pro 46.3 > Qwen 3.8 Max 45.4 > GLM-5.3 44.8 > **Step 5 Preview 43.7** > Kimi K3 43.6 > **Claude Haiku 5.5 43.4** > GLM-5.3 Flash 41.8 > **DeepSeek V4.1 Flash 39.5** > Mistral Large 4 38.4 > MiMo V2.6 Flash 37.9 > GPT-6/5.6 Luna 37.3 > DeepSeek V4 Pro 36.0。**Gemini 4 Argon / Beam / MiniMax M3.1 Flash / Ornith 1.5 122B 未评分。**

**评分洞察**：

1. **AA 快照停在 08-18**，评分格局未变；GLM-5.3（59.51/59.10）仍为 Go 内 Agentic 最高，Kimi K3（59.70）智能最高。
2. **Muse Spark 为 Meta 模型**：AA 只到 v4.1.1 口径（1.2 = 57、1.3 = 61），叠加数据训练条款，定位"高请求量低成本辅助"，**不适合敏感场景**。
3. **Grok 4.7 单档在役**：Grok 4.6 已退出 docs 正文（仅 API 残留），Go 的 $15 档现只有 4.7（169/423/845 次，500K 上下文，≤200K / >200K 两档价，测算 1.5x）。未入 Go 模型的 AA 智能分可查：GPT-5.6 Sol 60.9、Gemini 3.7 Flash 56.0、Nemotron 3 Ultra 38.3、Kimi K2.5 36.0。
4. **性价比梯队**：**Kimi K2.7 Code 8.2x ≈ DeepSeek V4.1 Flash 8.0x** > **GLM-5.2 6.5x** > **6.0x 梯队（Qwen3.7 Plus / LongCat-2.0 / MiMo-V2.6-Flash / MiMo-V2.5 / Muse Spark 1.3+1.2 / GLM-5.3-Flash / Hy3 / MiniMax M3 / Step 5 Preview 限时 / Gemini 4 Argon 限时）** > 3.0x 档（Qwen3.8 Flash / Hy4 preview / Gemini 4 Argon 常规）> $15 旗舰档 1.5–1.6x。**LongCat 2.5 Preview Free / Beam Free / MiniMax M3.1 Flash Free 为 Unlimited，不参与排序。**

---

## 七、关键发现（现行结论）

1. **订阅价与渠道价解耦**：OpenRouter 渠道价**日内高频波动**——11-04 实测 DeepSeek V4.1 Flash 三项最低 **Morph $0.0350 / CoreWeave $0.0020 / Sail Research $0.2500**（40 渠道）；GLM-5.3 分散在 **Wafer $0.0699 / Baidu $0.8800 / Baidu $0.0520**（48 渠道）；Kimi K3 为 **Relace $0.1900 / Relace $8.9400**（30 渠道）。同期 **Go 内部价与 GOAT 内部价仅额度调整、单价零变动**——订阅平台对渠道价格战免疫，这是 Go 相对"自行接渠道"的核心价值。
2. **额度口径为"月度美元 + 比例窗口"**：5h = 20%、周 = 50%、月 = 100%，**新档位窗口自动按比例生成**；Plus 只放大基数（2x/3x/4x/8x），不改单价与比例。
3. **DeepSeek 侧版本迭代、价格未变**：官方价目表仅 `deepseek-flash`（**MODEL VERSION `DeepSeek-V4.1-Flash-1017`**）与 `deepseek-v4-pro`（**`DeepSeek-V4-Pro-0813`**）两行；V4 Flash / Vision Exp 的模型本体已下线，旧 ID 仍可调用但**由 V4.1-Flash-1017 服务并按 Flash 价计费**（官方注(1) 原文）。Go 侧 **V4.1 Flash 单次成本 $0.000461、34,670 次/5h（173,330/月）、8.0x**，为 Go 内性价比最高档。
4. **GLM 侧三线并行**：GLM-5.3（$15，Agentic 第一，Plus 8x）承担关键决策；GLM-5.3-Flash（$60，6.0x，多模态 + 1M）承担快速辅助；官方另售 **GLM-5.3-FlashX**（同基座、快 5 倍、贵 2.5 倍，Go 未上架）——同一基座按"智能 / 价格 / 速度"拆档售卖。
5. **模型下线与退出需盯 ID**：`MiMo-V2.5` / `MiMo-V2.5-Pro` 官方 **2026-10-14 18:00 起转发至 V2.6 对应 ID、2026-10-21 10:00 正式下线**（Go 侧仍在列，届时报错风险需提前切 ID）；`grok-4.6`、`kimi-k2.6`、`minimax-m2.7`、`qwen3.7-max`、`qwen3.6-plus`、`glm-5.1`、`omen-alpha`、`minimax-m2.5` **仅套餐 API 残留**，docs 四张表已无行、无额度、无请求数。
6. **Zen 免费层 8 款**：`beam-free`、`deepseek-v4.1-flash-free`、**`flint-40b-free`**（新收录，262K，对应 OpenRouter `recursive/flint-v1.0:free`）、`glm-5.3-flash-free`、`jev-1.13-free`、`mimo-v2.6-flash-free`、`nemotron-3.5-lightning-free`、`nemotron-3.5-super-vl-free`；**不自动回落**，需手动切模型 ID。**已下架**：`minimax-m3.1-flash-free`（限时免费结束）、`longcat-2.5-preview-free`。多数附带数据条款（Nemotron 系记录数据、Muse Spark 系训练用户数据），敏感项目慎用。**Jev 1.13** 是其中唯一非语言模型（System One 决策模型，专用 `/v1/systemone`，$0.042 输入 / 输出免费）。
7. **免费格局：Go 侧三条 Unlimited**：**LongCat 2.5 Preview Free**、**Beam Free**（限地区、30 天留存）与 **MiniMax M3.1 Flash Free**（均限时）。**Step 5 Preview（限时 4x）与 Gemini 4 Argon Contributor（限时 2x）为"翻倍档"**——额度、请求数同步翻倍，**若按翻倍后口径测算均升至 6.0x**。结构性优势仍是"国产成熟模型大额度"单一主线。
8. **🔑 Go Plus 的真实价值是额度天花板、不是单价折扣**：两档 Token 单价完全相同，Plus 月费是 Go 的 4 倍而额度放大 **2x/3x/4x/8x**——**仅 GLM-5.3（8x）单位成本腰斩，4x 档 15 款持平，3x 档 6 款贵 33%，2x 档 5 款（含 DS V4.1 Flash、MiMo-V2.6-Flash、Muse Spark）贵 100%**。详见第五节末 Go Plus 专节。
9. **客户端会话头要求**：docs 分 Validated / Problematic 两表——Claude Code / Codex / ZCode 接入无需额外改造（Go 识别原生会话头），**自研客户端必须带 `x-opencode-session` 与独立 user agent**。ZCode 条目已放宽：官方原文 "Our request for `x-opencode-session` remains open, but it is no longer necessary to send that specific header." **Kilo Code CLI 的修复不覆盖 VS Code 扩展**。
10. **🔴 渠道最低位每次抓取即换主、折扣可到期亦可回归**：11-04 实测 **V4 Pro 输入最低 = Relace $0.90（仍贵于官方）、输出最低 = Relace $1.50、缓存最低 = StreamLake $0.07961（disc 0.451）**；**百度千帆 −89.5% 深度折扣未复现，现行 -47.1%（$0.894/$1.788/$0.07406）**，在 `glm-5.3` 上以 **-80% 折后 $0.88 / $0.052 重夺输出 + 缓存双最低位**、在 GLM-5.2 上以 **-55.8% / -72.5%** 在架，但在 `deepseek-v4.1-flash` 上已退出最低位。**GLM-5.2 输入 + 缓存最低 = Wafer $0.006 / $0.005（us，白菜价）、输出最低 = Morph $1.40**。⚠️ 这些低价来自 `pricing.discount` 折后口径，**原价 = 折后价 ÷ (1 − discount)**；同一 provider 可有多条记录（`flex` / 标准 / `fast` / 区域档），必须读 `tag` 区分。**负 discount = 溢价**（StreamLake 的 MiMo V2.5 / V2.5-Pro 为 −0.2，即贵 20%）。渠道"异常低价"具强时效性，**任何最低价都必须连同抓取时刻引用，不做"官方等价质量"推定**。
11. **🟢 Go 订阅对渠道价格战免疫**：docs/go 价目表 36 行**全部为官方价透传口径、无随行就市的调档**（GLM $1.40/$4.40、DS 峰谷、GPT 6 Luna $0.10/$0.50、Claude Haiku 5.5 $0.10/$0.50）——**"渠道崩价 ⇒ 订阅更划算"的直觉不成立**，Go 的价值仍是**额度天花板 + 价格稳定性**。
12. **端点路径已统一**：docs 端点表全部改用 **`https://opencode.ai/inference/go/{openai,anthropic,google}/v1*`**，模型清单为 `.../inference/go/v1/models`；旧 `zen/go/v1/*` 仍返回 200 且 ID 一致（兼容别名），**新配置一律写新路径**。

---

## 八、推荐配置（评分 + 性价比综合）

### Claude Code（四层工作流）

| 层 | 推荐 | 理由 |
|---|---|---|
| Fable（总规划） | GLM-5.2（1M，6.5x） | 评分均衡（52.64/45.7）+ 6.5x + 1M；$60 额度放心用 |
| Opus（深度推理） | GLM-5.2（1M，6.5x） | 主力；备选 GLM-5.3（59.51/59.10 双高，$15 谨慎，**Plus 8x**）/ Kimi K3（智能第一）/ Qwen3.8 Max（Agentic 第二）/ DS V4 Pro（53.20） |
| Sonnet（主力开发） | Kimi K2.7 Code（256K，8.2x） | 性价比第一；复杂编码换 GLM-5.2 |
| Haiku（搜索总结） | **MiMo-V2.6-Flash（6.0x，1M，150,400 次/月）** | **GLM-5.3-Flash（6.0x，多模态，1M）**；Hy3（6.0x）；**Claude Haiku 5.5（$15，1.5x，≤100K 档 $0.10/$0.50）**；备选 Muse Spark 1.2/1.3（6.0x，注意数据条款）、**Step 5 Preview（限时 $60 = 6.0x）**；图像理解用 GLM-5.3-Flash 或 MiniMax M3.1 Flash Free（限时） |

### oh-my-opencode-slim

| Agent | 推荐 | 备选 |
|---|---|---|
| Orchestrator | GLM-5.2 | Kimi K3 / **Step 5 Preview（限时 4x）** |
| Oracle | GLM-5.2 | **GLM-5.3（智能/Agentic 双高，$15 谨慎，Plus 8x 时首选）** / Kimi K3（智能第一）/ Qwen3.8 Max（重大决策）/ DS V4 Pro |
| Librarian | **MiMo-V2.6-Flash（6.0x，1M）** | MiMo-V2.5（同价同请求数）/ Hy3（6.0x 平替）/ GLM-5.3-Flash（1M）/ Claude Haiku 5.5 |
| Explorer | MiMo-V2.6-Flash | MiMo-V2.5 / Hy3 / GLM-5.3-Flash（1M）/ MiniMax M3 |
| Designer | Kimi K2.7 Code | GLM-5.2 / MiniMax M3 |
| Fixer | Kimi K2.7 Code | MiniMax M3 / GLM-5.3-Flash |
| Council | Kimi K3 + GLM-5.2 + Kimi K2.7 Code（质量优先）/ GLM-5.2 + Kimi K2.7 Code + MiniMax M3（平衡） | 省额度：MiMo-V2.6-Flash + Hy3 |

### 使用原则（70/15/10/5）

- **70% 日常开发**：Kimi K2.7 Code（8.2x，$60 额度）；复杂任务切 GLM-5.2（6.5x）
- **15% 架构设计与推理**：GLM-5.2（6.5x，$60，1M）；评分第一梯队（Kimi K3、GLM-5.3 等）留作关键决策
- **10% 搜索与日志分析**：**MiMo-V2.6-Flash（6.0x，1M，请求量顶格）** / **GLM-5.3-Flash（6.0x，多模态，1M）** / Hy3（6.0x）；截图/图像类任务用 GLM-5.3-Flash（多模态）或 MiniMax M3.1 Flash Free（限时，1M、多模态）
- **5% 疑难问题（谨慎）**：Kimi K3（智能最高）/ GLM-5.3（Agentic 第一、编码/安全专项）/ DS V4 Pro（53.20，$15）
  - $15 额度模型性价比 1.5–1.6x，仅在 GLM-5.2 / Kimi K2.7 Code 无法解决时使用。**DeepSeek 系注意错峰**：工作日高峰成本约为空闲 2 倍；**周末全天按空闲价，可放心使用**。
- **运行观察**：**GLM-5.3-Flash（$60，6.0x）为"多模态 + 1M + 高请求量"的最优快速辅助**；**DeepSeek 侧首选 V4.1 Flash（$80、8.0x、34,670 次/5h）**——**另有 4 款可按需试用**——**MiMo-V2.6-Flash**（$60、6.0x、150,400 次/月，可直接替换 MiMo-V2.5）、**MiMo-V2.6-Pro**（$15、1.5x）、**Grok 4.7**（$15、1.5x、单档在役）、**Claude Haiku 5.5**（$15、1.5x，≤100K 档单价与 GPT 6 Luna 同级）。
- **升 Plus 判断**：**仅当主力为 GLM-5.3（8x，单位成本 −50%）或需要 4x 档（15 款）的大额度天花板时才值得升 $40 的 Plus**；主力为 DS V4.1 Flash / MiMo-V2.6-Flash / Muse Spark（均 2x）时**留在 Go**。
