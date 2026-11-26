---
title: AI 大模型一周汇总：11-19 → 11-26
date: 2026-11-26
---

> 全球模型发布、平台清单、额度与渠道变化的滚动窗口综述。数据抓取日 **2026-11-26**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据窗口：**2026-11-19 → 2026-11-26**（7 天）。抓取时间：**2026-11-26**。
> 数据来源：OpenAI / Anthropic / Google / 智谱 / Kimi / 小米 / MiniMax 官方发布页与定价页、The Verge、OpenCode 官方页与清单 API、CommandCode 官方页与 CLI、OpenRouter 模型与 endpoints API、OpenDesign / Ollama 定价页。
> 口径：模型价格均为**每百万 token 美元价**（除注明人民币者）；折算汇率 **1 USD = 6.7096 CNY**（中国外汇交易中心 2026-11-26 中间价）；涨跌配色**涨 = 红、跌 = 绿**（中国惯例）。
> ⚠️ 平台侧数字均为 **2026-11-26 实测**；OpenRouter 渠道价为抓取时刻快照，**不可跨日沿用**。

---

## 一、本周主线：没有新旗舰发布，平台侧额度与模型结构集中调整

本周（11-19 → 11-26）**没有已开放 API 的新前沿旗舰上线**；行业新闻集中在科研应用与 Agent 产品化，而订阅平台侧发生了三项直接影响采购的变化：

1. **OpenCode Go 模型结构扩容**：31 款文本 → **31 文本 + 3 decision + 3 embedding = 37 ID**；`glm-5.3` 促销结束、额度由 $500 回落 **$200**；`kimi-k3.1-pro` 额度由 $15 上调 **$60**（API 侧）；`longcat-2.5-free` 转付费 **`longcat-2.5`**。
2. **CommandCode CLI 1.93.0 → 1.93.4**：目录 104 → **105 款**（新增 `thinkingmachines/inkling-2-mini`），网关 API 同步 105，差集 0。
3. **OpenDesign 开启 Motion Week**：DeepSeek V4.1 Flash 1017 按官方 API **全天 off-peak 价**计费一周；Go 档年付 $84（$7/月）。

> **一句话**：本周是"**额度重排周**"，不是"模型发布周"。采购决策应立即重算 Go / GOAT / OpenDesign 三家的逐模型额度，而不是沿用上周结论。

## 二、厂商动态

**1. OpenAI（11-20 → 11-24，官方新闻页）**
- **11-24｜GPT-6 models demonstrate intrinsic protein-design capabilities**：内部研究模型在多项蛋白质设计任务上匹配或超过专用模型；与 Onava 的实验室测试中，基于 **GPT-6.2** 设计的蛋白在 5 个靶点上出现结合证据，重设计抗体也保留结合能力。模型输出的推理与代码显示其调用数学、物理、化学与生物学知识。
- **11-24｜Searching for distant planets with Astra**：用 Astra 模型辅助搜寻遥远行星（科学应用）。
- **11-23｜OpenAI and Cisco introduce Shirudo**：与 Cisco 联合发布安全产品 Shirudo。
- **11-22｜Perplexity and Intelligence**：研究文章，讨论困惑度与智能的关系。
- **11-20｜MedChemBench**：药物化学基准发布。

**2. Anthropic（11-23）——Claude Ship 进入"自主提 PR + 修复"阶段**
- The Verge 11-23 报道：Anthropic 为软件工程师推出 **Claude Ship**，可**自行审阅 pull request 并提交修复**。这标志着 Claude Code 类产品从"辅助编码"进一步走向"自主交付"，与本周 OpenCode Go / CommandCode 侧的 Agent 化额度竞争同向。

**3. Meta（11-23 / 11-25）——Muse 进入电商 Agent**
- 11-23：**Meta Muse 可在 Walmart 完成黑色星期五购物**（Agent 代操作）。
- 11-25：The Verge 报道 **Amazon 正与 Meta 谈判，要求终止 Muse 的 AI 购物屏蔽/抓取行为**——Agent 与电商平台的流量博弈开始显性化。

**4. Adobe / 内容产业（11-24）**
- **纽约时报警告摄影师不要更新 Photoshop**（因 AI 功能条款）；AI 生成内容与专业内容平台的摩擦继续。

**5. 智谱（本周官方文档更新）——GLM-5.4 只向 Coding Plan 开放**
- 智谱文档已将 **GLM-5.4** 列为旗舰模型：首款 **Loop Transformer** 架构、新增视觉理解、智能水平对标 2–3T 级模型，**1M 上下文 / 128K 输出**。
- **但 API 尚未开放**：官方原文「GLM-5.4 已向 GLM Coding Plan 全量用户开放。模型 API 将在完成安全评估后开放。」→ **Go / Zen / CommandCode / OpenRouter 均无该 ID，也无 API 价格**。

**6. Kimi（官方定价页，本周复核）——K3.1 Pro 价格体系确认，K2 系列进入退场倒计时**
- **K3.1 Pro 官方价：输入 ¥13 / 输出 ¥68 / 缓存命中 ¥1.30**，低于 K3 的 ¥20 / ¥100；HighSpeed 档 ¥26 / ¥136。
- **K2 系列 2026-10-31 起停止新用户注册，计划 12 月底全部下线**；`kimi-k2.7-code` / `kimi-k2.6` 均在退场范围。

**7. 小米 / MiniMax（官方定价页，本周复核）**
- 小米 MiMo V2.6 三档价格未变：Flash ¥1/¥2、Pro ¥3/¥6、UltraSpeed ¥30/¥60；V2.5 系仍标注 10-21 下线。
- MiniMax **M3.1 Flash 官方价已在定价页明示**：输入 ¥1 / 输出 ¥4 / 缓存 ¥0.10；M3 ≤512K 永久五折。

## 三、四平台清单与额度变化（2026-11-26 实测）

| 平台 | 当前规模 | 本周变化 |
|---|---|---|
| **OpenCode Go** | **37 ID** = 31 文本（27 付费 + 4 免费）+ 3 decision + 3 embedding | 新增 `hungerg-free`、`jev-1.14`、`gemini-decision-1`、`gpt-6-luna-decision`、`text-embedding-3-small`、`qwen3-embedding-8b`、`gemini-embedding-2`；`longcat-2.5-free` → **`longcat-2.5`（$60 付费）**；`glm-5.3` $500 → **$200**；`kimi-k3.1-pro` $15 → **$60**（API） |
| **OpenCode Zen** | **108 款** = 11 `-free` + Big Pickle + 96 付费 | 新增 `seaglass-alpha-free`；**`tidepool-alpha-free` 退出**；付费区现含 Gemini 4 Carbon / Hydrogen / Neon、GPT-6.2 Astra / Sol 等 |
| **CommandCode** | **105 款 / CLI 1.93.4**（网关 105，差集 0） | 新增 **`thinkingmachines/inkling-2-mini`**；GOAT 页头 **GOAT plan 76 / All plans 107 / Deals 3 / Free 2** |
| **OpenRouter** | **474 款**（`:free` 11 / `:batch` 96 / `~` 别名 19） | 本期窗口内新增 `upstage/solar-pro-4-contributor`、`upstage/solar-mini-4-5`、`xiaomi/mimo-v2.6-flash-mopd`、`thinkingmachines/inkling-2-mini`、`radixark/daisyrose-27b`、`mistralai/pixtral-large-2502` |

**Go 额度重排的三个关键数**：

| 模型 | 11-26 前 | 11-26 现行 | 影响 |
|---|---:|---:|---|
| `glm-5.3` | $500（促销） | **$200**（Plus $400，2x） | 性价比 50.0x → **20.0x**，仍是全目录第一；Plus 单位价值仍腰斩 |
| `kimi-k3.1-pro` | $15（Plus $60，4x） | **$60（Plus $120，2x）** | 从 1.5x 档跃升 **6.0x**，成为 1M 上下文主力 |
| `longcat-2.5` | 免费（`longcat-2.5-free`） | **$60（4x）** | 免费档结束；Console 标 Limited regions，需 Global regions |

> ⚠️ **两处口径冲突，须以 API 为准**：
> - **`kimi-k3.1-pro`**：API 月额度 $60/$120，但 Console 行仍显示 $15/$60 与 147/588 次——**请求数未随额度更新**。
> - **Console Limits Tab** 仍残留 1 行 `GLM-5.2`（792 / 2,370）；API 与 docs 均已无此 ID。
> ⚠️ **Go 新增 decision / embedding 两类**：`$10` 档、按量等价（Plus $40 / Teams $15）、**无需 `x-opencode-session`**，可直接被 RAG 库 / memory provider / 脚本调用。这是 Go 从"编码订阅"扩展到"推理基础设施"的结构性变化。

## 四、调用量榜（OpenCode Data，已更新 11月26日 UTC 03:12 / GMT+8 11:12）

- **周榜**：`deepseek-v4.1-flash` **156T（-17%）**；**`hy4-flash` 56T（+198%）**；`beam-1.0-501b-a23b` 4.5T；`muse-spark-1.3-contributor` 4.1T；**`glm-5.3` 4.1T（+76%）**；`glm-5.3-flash` 3.5T（-57%）；**`hungerg` 2.9T（新）**；`tidepool-alpha` 2.5T（+686%）。
- **日榜（NOV 25）**：`deepseek-v4.1-flash` **27T**、`hy4-flash` 10T、`hungerg` 1.5T、`muse-spark-1.3-contributor` 705B、`beam` 694B。
- **作者份额（NOV 26）**：**DeepSeek 63.9%**、**Tencent 22.6%**、Other 6.4%、Zhipu 2.2%、Meta 1.6%、Reflection 1.6%、Xiaomi 1.1%、NVIDIA 0.5%、**MiniMax 0.1%**。
- **国家份额（前 5）**：中国 **20%（319T）**、美国 11%（181T）、印度 5%（77T）、德国 4%（68T）、巴西 4%（65T）。**全站缓存比例 96%**（已缓存 54T / 未缓存 2.1T）。
- **解读**：`hy4-flash` 的 +198% 与 `hungerg` 的新上榜，说明**免费/低价端点仍是榜单最大变量**；`glm-5.3` 的 +76% 与 Go 侧促销结束同步，**下周需观察额度回落是否导致用量下滑**。

## 五、OpenRouter 渠道格局（11-26 endpoints 实测）

> 全部为 **2026-11-26 抓取**的每百万 token 美元价；`disc` = `pricing.discount`（折后实付价，原价 = 折后 ÷ (1 − disc)）。

| 模型 | 渠道数 | 最低输入 | 最低输出 | 最低缓存读 | 备注 |
| :--- | :--: | :--- | :--- | :--- | :--- |
| deepseek/deepseek-v4.1-flash | **39** | **$0.051**（Wafer） | **$0.336**（DeepInfra，disc 0.30） | **$0.002**（CoreWeave） | 三项全低于官方空闲价 |
| deepseek/deepseek-v4-pro | 12 | $0.888（Relace） | $1.508（Relace） | $0.075（StreamLake，disc 0.484） | **输入/缓存贵于官方** |
| z-ai/glm-5.3 | **49** | **$0.0699**（Wafer） | $1.40（Wafer） | $0.0689（Wafer） | 输入极低、输出仍官方价 |
| z-ai/glm-5.3-flash | 42 | **$0.0356**（Relace） | **$0.0815**（Relace） | $0.0075（Pareto） | 三项均低 70%–80% |
| moonshotai/kimi-k3 | 28 | **$0.153**（Wafer） | **$9.00**（KT） | $0.10（KT） | 输入套利、输出不套利 |
| moonshotai/kimi-k3.1-pro | **32** | **$0.2403**（Relace） | **$6.20**（Decart，disc 0.38） | $0.124（Decart） | 渠道数继续增加 |
| moonshotai/kimi-k2.7-code | 7 | **$0.60**（CoreWeave） | **$3.00**（CoreWeave） | $0.12（CoreWeave） | K2 系列 12 月底下线 |
| minimax/minimax-m3.1-flash | 11 | **$0.075**（Inferact） | **$0.30**（Inferact） | $0.0075 | 约官方五折 |
| xiaomi/mimo-v2.6-flash | 8 | **$0.10**（Darkbloom） | **$0.28**（Darkbloom） | $0.0028 | 与官方价几乎持平 |
| tencent/hy4 | 3 | **$0.417**（Tencent，disc 0.50） | **$1.2505** | $0.021 | 折后恰为 Go/CC 目录价一半 |
| qwen/qwen4-max | 1 | **$1.425**（Alibaba，disc 0.05） | **$4.275** | $0.07125 | 仅 Alibaba 一家 |

- **`deepseek-v4.1-flash` 仍是渠道套利最充分的旗舰**：输入 $0.051 仅为官方 $0.15 的 34%、输出 $0.336 为官方 $0.60 的 56%、缓存 $0.002 为官方 $0.003 的 67%。
- **`deepseek-v4-pro` 结论与 V4.1 Flash 相反**：输入 +32%、缓存 +235%，仅输出便宜 25%——**缓存密集型场景必须官方直连**。
- **`glm-5.3` 的 49 家渠道里，最低输入与最低输出不在同一 provider**：$0.0699 输入来自 Wafer，$1.40 输出仍为官方价；**按输入/输出比例选渠道，不能只看单一最低值**。
- **`kimi-k3.1-pro` 渠道数 32 家**：输入最低 $0.2403（官方 ¥13 ≈ $1.94 的 12%），输出最低 $6.20（官方 ¥68 ≈ $10.14 的 61%）。
- **`hy4` 的 Tencent 直供带 50% discount**：折后 $0.417/$1.2505 正是 Go/CC 内部价的一半；**原价 $0.834/$2.501**。

## 六、订阅平台：OpenDesign / Ollama

**OpenDesign（open-design.ai/pricing，11-26）**
- **Go $10**（首月 $8；年付 $84 = $7/月）；**Go Plus $20**（$168/年 = $14/月）；**Go Pro $100**（$840/年 = $70/月）；**Go Max $200**（$1,680/年 = $140/月）。
- **月总额度**：Go **$220**（Coding Plan $220 + Top Models $0）、Plus **$310**（$290 + $20）、Pro **$780**（$660 + $120）、Max **$1,410**（$1,110 + $300）。
- **本期促销 = Motion Week**：**DeepSeek V4.1 Flash 1017 按官方 API 全天 off-peak 价计费一周**；官方明示「不是额外额度，共享额度与重置时间不变」——Go 档 credit 在 off-peak 费率下最多跑出 **$60/周** 的 V4.1 Flash 等值用量。
- **Coding Plan 逐模型额度（Go）**：V4.1 Flash Eco **266,933 次/7 天 / $220**、V4.1 Flash **145,600 / $120**、V4 Flash 36,700 / $60、MiMo V2.6 Flash 20,675 / $15、GLM-5.3 Flash 18,000 / $60、M3.1 Flash 16,300 / $60、MiMo V2.6 Pro 6,650 / $15、Hy4 Preview 3,920 / $60、Kimi K2.7 Code 3,750 / $60、V4 Pro 3,120 / $60。

**Ollama（ollama.com/pricing，11-26）**
- 档位与价格未变：**Pro $20 含 $60/月**（年付 $200 = $16.67/月）、**Max $100 含 $300**、**Team $500 含 $1,000 共享**；**无 5 小时 / 无每周窗口**，超出按同价 PAYG。
- **峰谷定义已明确写进页面**：**工作日 12:00–18:00 UTC 为 peak，其余时段与周末全天为 off-peak**；DeepSeek 系保留双档（peak = off-peak × 2）。
- **逐模型 26 款**：新增/保留 `beam`、`hy4`、`kimi-k3.1-pro`；`minimax-m3` 仍为 **$0.60/$2.40/$0.12**，是官方价（$0.30/$1.20/$0.06）的 **2 倍**，为 Ollama 表内最明显的溢价项。

## 七、下周关注（P0 → P2）

- **P0｜12-01：Gemini 4 Argon 价格翻倍**——Go 内部 $2/$10/$0.10 → **$4/$20/$0.20**（`cost.multipliers` 已带 `date.gte 2026-12-01`），额度不变，等同请求量腰斩；OpenRouter 的 50% 折扣也同步到期。
- **P0｜Go 的 `glm-5.3` / `kimi-k3.1-pro` 额度是否稳定**——本周 API 已改、Console 未同步；下周需再抓一次确认是否还有二次调整。
- **P1｜GLM-5.4 API 开放**——目前仅 Coding Plan；一旦开放 API，Go / CommandCode / OpenRouter 是否跟进，将决定 GLM 系的下一轮性价比。
- **P1｜Kimi K2 系列 12 月底下线**——`kimi-k2.7-code` 的渠道价与 Go 额度都将失去长期意义，提前规划迁移到 `kimi-k3` / `kimi-k3.1-pro`。
- **P2｜`hungerg` 身世与额度**——周榜新第 7（2.9T），Go 侧已有 `hungerg-free`；厂商未标，需观察是否转付费或长期免费。
- **P2｜OpenDesign Motion Week 结束后的 DeepSeek 计费**——促销周结束后恢复工作日峰谷（页面口径：peak 为 off-peak 2 倍），届时 Coding Plan 的实际可用量会下降。

---

> 引用须署名对应来源；OpenCode 榜单数据须注明 **OpenCode Data（opencode.ai/data）** 与页面更新时间 **2026-11-26 UTC 03:12（GMT+8 11:12）**。
