---
title: AI 大模型一周汇总：11-04 → 11-15
date: 2026-11-15
---

> 开源模型、融资、算力与政策的滚动窗口综述。数据抓取日 **2026-11-15**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据窗口：**2026-11-04 → 2026-11-15**（距上期 11-04 间隔 11 天）。抓取时间：**2026-11-15**。
> 数据来源：Google / Anthropic / Meta / Thinking Machines / 腾讯 / DeepSeek / 月之暗面 / 智谱 官方发布页、the-decoder、llmcurrent.com、ainativeengineering.net、theworldofai.org、bestaiutility.com、OpenCode 官方页与清单 API、CommandCode 官方页与 CLI、OpenRouter 模型与 endpoints API。
> 口径：模型价格均为**每百万 token 美元价**（除注明人民币者）；折算汇率 **1 USD = 6.7152 CNY**（中国外汇交易中心 2026-11-13 中间价，11-15 非交易日沿用）；涨跌配色**涨 = 红、跌 = 绿**（中国惯例）。
> ⚠️ 平台侧数字为本工作区 **2026-11-15 实测**，不沿用上期；OpenRouter 渠道价为抓取时刻快照，**不可跨日沿用**。

---

## 一、海外旗舰与新品（本期主线：从"比榜单"转向"分角色"）

**1. 🔑 Google Gemini 4 Carbon 正式可用（11-10）——与 Argon 分工，入门价 11-30 后翻倍**
在 Gemini API（AI Studio 与 Gemini for business）开放，**入门价 $2 / $10**，**2026-11-30 后恢复 $4 / $20**。Google 明确分工：**Argon 是通用默认**（软件工程与知识工作），**Carbon 专攻长程推理极限**。官方称在 **CursorBench 4.0、Perplexity WANDR、Zapier AutomationBench 均列第一**，**每任务成本比次优外部模型低 2 倍以上**；在 Multimodal Knowledge Agent 基准上排名第二但**平均每任务成本低 6 倍以上**。同期 **Gemini 4 Hydrogen（11-12）** 也进入开放权重序列。

**2. 🔑 Meta Muse Ember（11-09）——$0.10 的"执行型"小模型**
Meta 最小的推理模型，**$0.10 / $0.50**（≤200K 提示），**1M 上下文、最高 512K 输出**，原生支持文本 / 图像 / 音频 / 视频。Meta 的分工表述很直白：**「Muse Wonder 做规划，Muse Ember 接量」**——目前面向高并发 agent 任务最便宜的可用模型之一。

**3. 🔑 Anthropic Claude Fable 5.2 与 Mythos 5.2（11-09）——一个模型拆成两个准入层**
同一底层模型的两种配置，**$8 / $40**，可选 **fast mode $16 / $80（约快 2.5 倍）**。**Fable 面向所有用户，Mythos 仅限通过网络安全与生命科学验证计划的机构**。Anthropic 同时强调 **Opus 5.5 仍是多数编码与知识任务的推荐默认**。

**4. Thinking Machines Inkling 2 Small（11-05 发布 / 11-09 上榜）——594B MoE，Apache 2.0**
594B 参数混合专家模型，**1M 上下文**，承诺测试后释放 **Apache 2.0 权重**。上线即带动 OpenCode 周榜 **+566%**（见第三节）。

**5. 其他模型与能力**
- **腾讯 Hy4（11-04）**正式发布，取代此前的 `hy4-preview` 进入 OpenCode Go 正文（$60 / $65 / $240）。
- **LongCat-2.5（11-02）**发布，1.05M 上下文、多模态；**免费档 `longcat-2.5-free` 同期进入 Go 与 Zen**。
- **Liquid AI LFM3-1.7B（11-06）**开源权重，262K 上下文。
- **Nex-N2.6（11-10）**、**Baidu ERNIE 5.5 Flash Preview（11-10）**、**Ling 3.2 Flash free（11-13）** 陆续上架 OpenRouter。
- **GPT-6 Cyber（11-05）**：仅向审核通过的防御者开放，**ExploitGym 48.5%**。
- **Gemini Omni 1.2 Flash GA（11-05）**：15 秒视频、对话式编辑，720p 价格**降 30% 至 $0.07/秒**。
- **Pika H3 Flex** 开源权重（基于 MiniMax H3 后训练，六步视频+音频）。
- ⚠️ **Gemini 2.5 Pro / 2.5 Flash 将于 2026-12-01 弃用**，流量自动改路由到新模型——**仍写死旧 ID 的项目需在 12 月前迁移**。

## 二、国内动态

**1. 腾讯 Hy4 正式版进入商用**
`hy4` 已在 OpenCode Go 正文（$60 / $65 / $240，Go 侧请求数 5,400 / 13,520 / 27,040），并在 OpenRouter 以 `tencent/hy4` 上架；此前长期以 `hy4-preview` 提供。CommandCode 侧仍只有 `tencent/hy4-preview`（$20 额度）。

**2. LongCat-2.5 与免费档策略**
美团 LongCat-2.5 发布后同时开出 `longcat-2.5-free`（Go 与 Zen 各有入口），旧版以 `meituan/LongCat-2.0` 名义保留。**免费档通常只维持数周**，不宜写入长期配置。

**3. 百度在 OpenRouter 上密集上架并打深度折扣**
`baidu/ernie-5.5-flash-preview:free`、`baidu/ernie-light-dt-1.0-intl`（11-10）上架；同时百度千帆在 DeepSeek 与 GLM 系上**开出 -83% ~ -88% 的深度折扣**（见第四节），是本期渠道价格的最大变量。

**4. Kimi K3.1 Pro 第三方渠道从 2 家暴增至 24 家**
官方直供之外，Relace、Decart、Wafer 等 22 家在一个月内接入，**输入最低降至 $0.2232（官方的 11%）**、输出最低 $6.1（-39% 折后）。K2 系列仍按官方计划于**12 月底全线下线**。

## 三、平台与订阅侧（本工作区 11-15 实测）

**1. 四平台清单**

| 平台 | 上期（11-04） | 本期（11-15） |
|---|---|---|
| OpenCode Go | 28 ID（正文 30 款） | **30 ID（正文 32 款）** |
| OpenCode Zen | 80 款 | **86 款**（11 款 `-free` + Big Pickle + 74 付费） |
| CommandCode 网关 | 96 款 | **98 款**（CLI **1.89.1** 目录 98，**差集 0**） |
| OpenRouter 目录 | 455 款 | **470 款**（`:free` 14 / `:batch` 86 / `~` 19） |

- **Go 正文新增 2 款**：`hy4`（正式版）、`longcat-2.5-free`（免费）；**无移除**（MiMo-V2.5 系仍只在正文）。
- **Zen `-free` 由 9 增至 11 款**：新增 `iceman-free`、`inkling-2-small-free`、`longcat-2.5-free`，且 **`minimax-m3.1-flash-free` 重新上线**；**退出** `crouton-alpha-free`、`pulse-alpha-free`。
- **CommandCode 新增 6 款**：`deepseek-v4.1-flash-ultrafast`（$2.4/$9.6）、`google/gemini-4-carbon`、`meta/muse-ember`、`thinkingmachines/inkling-2-small:free`、`claude-fable-5-2`，以及 `gpt-5.6-sol` 补齐档位。
- **⚠️ Beam 1.0 退役**（CLI 1.89.0 CHANGELOG: `retire the free Beam 1.0 model`）——Go / Zen / CC / OR 四侧免费档同步退出。

**2. CommandCode 额度与 Deals**
- **GOAT 页头：GOAT plan 72 / All plans 100 / Deals 3 / Free 2**（上期 72 / 98 / 5 / 4）。
- **免费档仅剩 2 个**：`glyph-cluster:free`、`thinkingmachines/inkling-2-small:free`。
- **Deals 3 条**：上述两个免费 + `minimax-m3` 2× usage。**laguna-s-2.1-free、crouton-alpha-free、beam-free 全部退出**。
- **额度表 62 条**（上期 60）：**GLM-5.3 从 $20 涨到 $70**（3.5 倍）、新增 `DS V4.1 Flash Ultrafast` $20 与 `Muse Ember` $20。
- **套餐矩阵未变**：Go $1/$10、GOAT Up to $100、Pro Up to $110、Max 10× $150、Max 20× $300。

**3. 调用量榜（OpenCode Data，页面顶部"已更新 11月15日 UTC 09:17"）**
- 周榜：**`deepseek-v4.1-flash` 168T（+2%）**；**`minimax-m3.1-flash` 8.6T 跃居第 2**（免费端点回归）；glm-5.3-flash 8.1T（+11%）；**`inkling-2-small` 5.8T（+566%）第 4**；`glm-5.3` +143% 至第 15；`longcat-2.5` 新上榜第 16。
- **作者份额**：DeepSeek **78.9%**（7.9T）／Other 6.1%／Zhipu 4.3%／**MiniMax 3.1%（从 0.4% 回升）**／Reflection 2.6%／Meta 2.3%／Xiaomi 1.6%。
- **国家份额**：中国 **259T 18%**、美国 166T 11%、印度 75T 5%、德国 62T 4%、巴西 60T 4%。全站缓存比例 **97%**（已缓存 163T / 未缓存 4.7T）。

## 四、OpenRouter 渠道格局（11-15 endpoints 实测）

> 全部为 **2026-11-15 17:50 CST endpoints API 实测值**（每百万 token 美元价，括号内为渠道数）。

| 模型 | 渠道数 | 最低输入 | 最低输出 | 最低缓存读 |
| :--- | :--: | :--- | :--- | :--- |
| deepseek/deepseek-v4.1-flash | 36 | **$0.0507**（Baidu，-83.1%） | **$0.2028**（Baidu） | **$0.001014**（Baidu） |
| deepseek/deepseek-v4-pro | 15 | **$0.2079**（Baidu，-87.7%） | **$0.4157**（Baidu） | **$0.01722**（Baidu） |
| z-ai/glm-5.3 | 49 | **$0.0699**（Wafer us） | **$1.40**（Wafer us） | **$0.0689**（Wafer us） |
| z-ai/glm-5.3-flash | 42 | **$0.0399**（Relace） | **$0.0784**（Relace） | **$0.012**（Darkbloom） |
| z-ai/glm-5.2 | 34 | **$0.0066**（Relace） | **$0.594**（Baidu，-86.5%） | **$0.006**（Wafer us） |
| moonshotai/kimi-k3 | 27 | **$0.153**（Wafer fast） | **$9.50**（Chutes） | **$0.13**（Wafer us） |
| **moonshotai/kimi-k3.1-pro** | **24**（上期 2） | **$0.2232**（Relace） | **$6.10**（Decart，-39%） | **$0.122**（Decart） |
| minimax/minimax-m3.1-flash | 13 | **$0.075**（Inferact） | **$0.30**（Inferact） | **$0.0075**（Inferact） |
| minimax/minimax-m3 | 8 | **$0.224**（DeepInfra flex） | **$0.88**（DeepInfra flex） | **$0.0448**（DeepInfra flex） |
| xiaomi/mimo-v2.6-flash | 8 | **$0.10**（Darkbloom） | **$0.224**（GMICloud，-20%） | **$0.0024**（GMICloud） |
| xiaomi/mimo-v2.6-pro | 5 | **$0.3262**（GMICloud，-25%） | **$0.6525**（GMICloud） | **$0.003**（GMICloud） |
| **meta/muse-ember**（新） | 2 | $0.10（Google Vertex） | $0.50 | $0.004 |
| **thinkingmachines/inkling-2-small**（新） | 6 | **$0.15**（PrimeIntellect） | **$0.50** | **$0.0285**（DeepInfra） |
| **google/gemini-4-carbon**（新） | 7 | **$1.00**（Google AI Studio flex，-50%） | **$5.00** | **$0.05** |
| **anthropic/claude-fable-5.2**（新） | 5 | $8.00（Google Vertex） | $40.00 | $0.20 |

- 🔑 **本期最大变量是百度千帆的深度折扣回归**：`deepseek-v4.1-flash` 与 `deepseek-v4-pro` **三项最低全部由 Baidu 持有**（-83.1% / -87.7%）。
- 🔑 **V4 Pro 结论反转**：折人民币为 **¥1.396 / ¥0.1156 / ¥2.792**，对官方空闲 ¥4.50 / ¥0.15 / ¥13.50 分别便宜 **69% / 23% / 79%**——**缓存首次跌破官方**，此前"一律官方直连"的结论不再成立。
- ⚠️ **深度折扣通常数周即到期**：Baidu 在 V4.1 Flash 上的 -82.1% 曾在 10 月下旬退出、11-15 又以 -83.1% 回归，**采购前必须重核 `discount` 字段**。
- **Kimi K3.1 Pro 渠道数翻 12 倍**（2 → 24），输入最低已降至官方的 11%；但**输出仍是官方价的 61%**，套利空间主要在输入侧。
- **GLM 系缓存让利普遍收窄**：GLM-5.3 缓存最低由 Morph $0.047 改为 Wafer $0.0689；GLM-5.3-Flash 输入价回涨 48%（$0.0269 → $0.0399）。
