---
title: AI 大模型一周汇总：11-15 → 11-22
date: 2026-11-22
---

> 开源模型、旗舰降价、算力与平台清单变化的滚动窗口综述。数据抓取日 **2026-11-22**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据窗口：**2026-11-15 → 2026-11-22**（距上期 11-15 间隔 7 天）。抓取时间：**2026-11-22**。
> 数据来源：OpenAI / Google / 阿里 / 腾讯 / Thinking Machines / 美团 / 微软 官方发布页、经济参考网、aibriefing.io、promptzone.com、theworldofai.org、llmcurrent.com、OpenCode 官方页与清单 API、CommandCode 官方页与 CLI、OpenRouter 模型与 endpoints API。
> 口径：模型价格均为**每百万 token 美元价**（除注明人民币者）；折算汇率 **1 USD = 6.7131 CNY**（中国外汇交易中心 2026-11-20 中间价，11-22 非交易日沿用）；涨跌配色**涨 = 红、跌 = 绿**（中国惯例）。
> ⚠️ 平台侧数字为本工作区 **2026-11-22 实测**，不沿用上期；OpenRouter 渠道价为抓取时刻快照，**不可跨日沿用**。

---

## 一、旗舰模型密集发布（本期主线：旗舰降价 + 轻量模型放量）

**1. 🔑 OpenAI GPT-6.2 Astra / Sol（11-17）——旗舰降价 20%，缓存降 60%**
两款同日发布：**Astra $8 / $40 / 缓存 $0.40**（旗舰，面向复杂工程与科研），**Sol $2 / $10 / 缓存 $0.10**（日常通用，强调更少 token 完成多步工作流）。官方口径：Astra **输入/输出较上代降 20%、缓存降 60%**；两者均获 AI 自我改进评级 High 与网络安全 Critical。**工具调用改走 Responses API，不再支持 Flex 批处理**。同日另有 Astra Pro / Sol Pro 变体。

**2. 🔑 Google Gemini 4 Neon（11-18）——$3 / $15，取代 Argon 与 3.1 Pro**
面向复杂软件工程、知识工作与科研，**百万级上下文、四档思考级别**，官方称 AA 智能指数 **61（总榜第三）**、默认思考档**单任务成本比 Carbon 低 32%**；可指挥 Hydrogen 子代理，但不生成图像/音频。在 Gemini App 中**取代 Argon 和 3.1 Pro**。OpenRouter 上 flex 档实测 **$1.50 / $7.50 / $0.075（-50%）**。
> ⚠️ **Gemini 4 Carbon 将于 12-01 从 $2/$10 翻倍至 $4/$20**——涨价后比 Neon 更贵，低价窗口仅剩月末。

**3. 🔑 阿里 Qwen4-Max（11-16）——2.4 万亿参数 MoE**
1M 上下文、文本+图像+视频输入，**$1.50 / $4.50 / 缓存 $0.075**，官方称单任务平均费用较上代降约 58%；无公开权重，小尺寸开源版承诺后续放出。已同步进入 OpenCode Go 与 CommandCode。

**4. 🔑 腾讯 Hy4 flash（11-16）——¥0.5 / ¥2，单任务成本为 Hy4 的 1/20**
224B 总参 / 12B 激活 MoE，含 **64B Engram 记忆参数**，1.02M 上下文，官方定价 **¥0.50 输入 / ¥2.00 输出**（CommandCode 网关价 $0.07/$0.281/$0.003），承诺开放权重。**上线 7 天即以 40T token 冲上 OpenCode 周榜第 2**（见第三节）。

**5. 其他发布**
- **Thinking Machines Inkling 2 Mini（11-21）**：27B 循环 Transformer，约 20GB 内存可笔记本运行，开源权重。
- **美团开源 LongCat-2.5（11-21）**：1.6 万亿参数原生多模态，全程国产算力训练。
- **微软 Ignite 2026（11-17）**：一次性 7 款模型，MAI Code 2 成 Copilot 默认，Copilot SDK 2.0 改 Rust，MAI-Image-2.7 Flash 约 1 美分。
- **Mistral Pixtral Large 2502（11-20）**、**RadixArk DaisyRose 27B（11-21）**、**华为 openPangu-2.1-Pro（11-15，512K）**。
- **DeepSeek App 能力全面 API 化（11-16）**：联网搜索、文件读取、OCR、语音开放；V4.1 Flash 缓存命中低至 $0.003。

## 二、国内动态与平台清单

**1. 四平台清单（11-22 实测）**

| 平台 | 上期（11-15） | 本期（11-22） |
|---|---|---|
| OpenCode Go | 30 ID / 正文 32 款 | **31 ID / 正文 31 款（差集归零）** |
| OpenCode Zen | 86 款 | **105 款**（11 `-free` + Big Pickle + 93 付费） |
| CommandCode | 98 款 / CLI 1.89.1 | **104 款 / CLI 1.93.0**（差集 0，77 有档 + 27 无档） |
| OpenRouter | 470 款 | **476 款**（`:free` 11 / `:batch` 92 / `~` 19） |

- **Go 新增** `qwen4-max`、`hy4-flash-free`；**退出** `glm-5.2` 与 `mimo-v2.5` 系 —— **docs 正文与 API 首次逐款一致（31/31）**。
- **Zen 大幅扩张 19 款**，`-free` 11 个：`beam-free`（回归）、`hy4-flash-free`、`flint-40b-free`、`jev-1.13-free`、`tidepool-alpha-free`、`longcat-2.5-free` 等；`glm-5.3-flash-free`、`minimax-m3.1-flash-free`、`inkling-2-small-free`、`glyph-cluster-free` 退出。
- **CommandCode 新增 7 款**：`gpt-6.2-astra`（Max 档）、`gpt-6.2-sol`（Pro 及以上）、`google/gemini-4-neon`（Pro 及以上）、`Qwen/Qwen4-Max`、`tencent/hy4`、`tencent/hy4-flash`、`recursive/flint-v1.0:free`；**移除** `thinkingmachines/inkling-2-small:free`。
- **GOAT 页头**：GOAT plan **75** / All plans **106** / Deals **3** / Free **2**（免费档现为 Flint + Glyph Cluster）。**GLM-5.3 额度仍为 $70**。

**2. 🔑 docs/go 结构性改版**
官方页从 **11 张表缩为 5 张**——逐模型价目表、请求数表、端点表**不再公开**，改为指向需登录的 **Console Go 页**。正文明确：三档 Token 单价相同、5h = 月额度 20%、**周窗口 = 50% 且每周一 00:00 UTC 重置**、达限额可开 **Extra Usage**、响应头 `opencode.allowance` 回报计入额度。
> ⚠️ **Go Teams 细则更新**：**$20/成员/月、2 成员起（最低 $40/月）**，第二席位覆盖下一个加入者免费，期中加入收 $20 获全额，服务账号不覆盖；**可用 workspace credit 支付订阅/续费/升级**。
> ⚠️ **时效项**：`GLM-5.3` 更高额度窗口 **11-22 到期**；`Gemini 4 Argon` 50% 折扣 **11-30 到期**；`Beam Free` 限时且**中国含港澳不可用**。

**3. 调用量榜（OpenCode Data，"已更新 11月22日 GMT+8 21:18"）**
- 周榜：**`deepseek-v4.1-flash` 175T（-5%）**；**`hy4-flash` 40T 新上榜即第 2**；glm-5.3-flash 5.8T（-35%）；**`glm-5.3` 4.5T（+621%）第 6**；`tidepool-alpha` 新第 9；`minimax-m3.1-flash` -85% 跌至第 10。
- 日榜（NOV 21）：deepseek-v4.1-flash 22T、hy4-flash 8.5T、glm-5.3 817B。
- **作者份额格局反转**：**DeepSeek 64.3%（12T）**、**Tencent 23.8%（4.5T）首次进榜即第 2**、Zhipu 3.3%、Other 3.2%、Reflection 1.9%、Meta 1.6%、Xiaomi 1.1%、NVIDIA 0.6%、**MiniMax 0.2%**（从 3.1% 回落）。
- 国家份额：**中国 300T 19%**、美国 177T 11%、印度 77T 5%、德国 66T 4%、巴西 64T 4%。缓存比例 97%（已缓存 4.5T / 未缓存 140.7B）。

## 三、OpenRouter 渠道格局（11-22 endpoints 实测）

> 全部为 **2026-11-22 21:35 CST endpoints API 实测值**（每百万 token 美元价，括号内为渠道数）。

| 模型 | 渠道数 | 最低输入 | 最低输出 | 最低缓存读 |
| :--- | :--: | :--- | :--- | :--- |
| deepseek/deepseek-v4.1-flash | 37 | **$0.0498**（Baidu，-83.4%） | **$0.1992**（Baidu） | **$0.000996**（Baidu） |
| **deepseek/deepseek-v4-pro** | **13** | **$0.66079**（Baidu，**-60.9%**） | **$1.32158**（Baidu） | **$0.05474**（Baidu） |
| z-ai/glm-5.3 | 46 | **$0.0699**（Wafer us） | **$1.40**（Wafer us） | **$0.0689**（Wafer us） |
| z-ai/glm-5.3-flash | 39 | **$0.0463**（Relace） | **$0.0729**（Relace） | **$0.012**（Darkbloom） |
| z-ai/glm-5.2 | 30 | **$0.007**（Wafer us） | **$0.594**（Baidu，-86.5%） | **$0.006**（Wafer us） |
| moonshotai/kimi-k3 | 29 | **$0.153**（Wafer fast） | **$9.50**（Chutes） | **$0.12**（Io Net） |
| moonshotai/kimi-k3.1-pro | 28 | **$0.2403**（Relace） | **$6.00**（Decart，-40%） | **$0.12**（Decart） |
| minimax/minimax-m3.1-flash | 13 | **$0.135**（StreamLake，-10%） | **$0.54**（StreamLake） | **$0.0135**（StreamLake） |
| minimax/minimax-m3 | 7 | **$0.224**（DeepInfra flex） | **$0.88** | **$0.0448** |
| xiaomi/mimo-v2.6-flash | 7 | **$0.10**（Darkbloom） | **$0.28**（Darkbloom） | **$0.0028**（Darkbloom） |
| xiaomi/mimo-v2.6-pro | 4 | **$0.387**（DeepInfra，-10%） | **$0.783** | **$0.00324** |
| **openai/gpt-6.2-astra**（新） | 5 | $8.00（OpenAI） | $40.00 | $0.40 |
| **google/gemini-4-neon**（新） | 5 | **$1.50**（AI Studio flex，-50%） | **$7.50** | **$0.075** |

- 🔑 **V4 Pro 结论再度反转**：Baidu 折扣由 -87.7% **退坡至 -60.9%**，折人民币 **¥4.435 / ¥0.3675 / ¥8.872** vs 官方空闲 ¥4.50 / ¥0.15 / ¥13.50 —— 输入几乎持平（便宜 1.4%）、**缓存贵 145%**、仅输出便宜 34%。→ **缓存密集型场景重新回到官方直连**。
- ⚠️ 这是「折扣到期与回归双向可逆」的第三次实证（11-04 直连 → 11-15 三项全低 → 11-22 又反转）。**每轮必须重抓 `discount`，不可沿用上期结论。**
- **V4.1 Flash 折扣稳定**（-83.4%），三项最低仍由 Baidu 独占，对官方空闲价一致便宜 67%。
- **MiniMax M3.1 Flash 最低位由 Inferact 换为 StreamLake**，价格明显上涨（$0.075 → $0.135）；**MiMo V2.6 Flash 三项全归 Darkbloom**。
- **Kimi K3.1 Pro 渠道 28 家**，输入最低 $0.2403 为官方价 12%，但输出仍 $6.00，套利主要在输入侧。
