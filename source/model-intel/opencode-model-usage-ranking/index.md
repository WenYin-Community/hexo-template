---
title: OpenCode 模型调用量排名（2026-11-26 快照）
date: 2026-11-26
---

> 官方调用量周榜、日榜、地理分布与作者份额快照。数据抓取日 **2026-11-26**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据来源：**OpenCode Data（[opencode.ai/data](https://opencode.ai/data)）**，页面内嵌 `updatedAt` = **2026-11-26T03:12:14Z**，即「**已更新 11月26日, UTC 03:12**」（GMT+8 11:12），抓取 2026-11-26。
> 口径：本文档**只保留周榜、日榜、前 5 国家每日市场份额、按作者市场份额四项**，均为页面原值；**不做累计用量计算**（不由日榜推周量、不由分项加总推总量、不计算名次间差值）。
> ⚠️ 周榜 = 页面「7 天」口径（滚动 7 日）；日榜 = 页面「昨天」口径（NOV 25 单日）；国家与作者份额 = 页面「NOV 26」当日口径。页面另有「New Models / 独立用户 / 会话成本 / 缓存比例」等区块，按本工作区口径不纳入本文档。
> 🔑 **数据获取方式**：榜单页面为客户端渲染，但 **SSR HTML 内嵌完整榜单卡片与表格**，`curl -sL` + 解析即可还原周榜、国家、作者份额；**日榜需点击「昨天」后读取**（本轮用浏览器点击取得）。字段单位 = **B（十亿 token）**，故 156T = 156,000B。

---

## 一、周榜（滚动 7 日，截至 2026-11-26）

| 排名 | 模型 | 厂商 | Token 调用量 | 周环比（页面口径） |
| :--: | :--- | :--- | :----------: | :--------: |
| 01 | **deepseek-v4.1-flash** | DeepSeek | **156T** | **-17%** |
| 02 | **hy4-flash** | Tencent | **56T** | **+198%** |
| 03 | beam-1.0-501b-a23b | Reflection | 4.5T | -19% |
| 04 | muse-spark-1.3-contributor | Meta | 4.1T | -21% |
| 05 | **glm-5.3** | Zhipu | 4.1T | **+76%** |
| 06 | glm-5.3-flash | Zhipu | 3.5T | -57% |
| 07 | **hungerg** | — | 2.9T | **新** |
| 08 | **tidepool-alpha** | — | 2.5T | **+686%** |
| 09 | mimo-v2.6-flash | Xiaomi | 2.5T | -27% |
| 10 | iceman | — | 1.6T | +58% |
| 11 | gpt-6-luna | OpenAI | 1.0T | -13% |
| 12 | deepseek-v4-pro | DeepSeek | 874B | -13% |
| 13 | nemotron-3.5-lightning | NVIDIA | 720B | -7% |
| 14 | nemotron-3.5-super-vl | NVIDIA | 651B | -43% |
| 15 | flint-40b | Recursive | 437B | -10% |
| 16 | claude-haiku-5-5 | Anthropic | 384B | -15% |
| 17 | minimax-m3.1-flash | MiniMax | 368B | -91% |
| 18 | qwen3.8-flash | Qwen | 366B | -17% |

- **`hy4-flash` 以 56T 稳居第 2，周环比 +198%**——腾讯 11-16 发布后，Go / Zen 的 `hy4-flash-free` 免费档持续放量，Tencent 作者份额升至 **22.6%**。
- **`deepseek-v4.1-flash` 仍以 156T 居首，但环比 -17%**；第二至第五名合计仍不足其 1/2。
- **`glm-5.3` +76% 至第 5（4.1T）**，与 Go 侧额度调整至 $200 同期；`glm-5.3-flash` -57% 退至第 6。
- **`hungerg` 新上榜即第 7（2.9T）**，页面未标厂商；Go 侧对应新免费档 `hungerg-free`。
- **`minimax-m3.1-flash` 连续第二周塌缩（-91%，368B）**，免费端点转为 $20 付费档后量级持续回落。

## 二、日榜（NOV 25，单日）

| 排名 | 模型 | 厂商 | 当日 Token | 日环比 |
| :--: | :--- | :--- | :----------: | :--: |
| 01 | deepseek-v4.1-flash | DeepSeek | **27T** | — |
| 02 | **hy4-flash** | Tencent | **10T** | — |
| 03 | **hungerg** | — | 1.5T | — |
| 04 | muse-spark-1.3-contributor | Meta | 705B | — |
| 05 | beam-1.0-501b-a23b | Reflection | 694B | — |
| 06 | glm-5.3-flash | Zhipu | 615B | — |
| 07 | mimo-v2.6-flash | Xiaomi | 439B | — |
| 08 | glm-5.3 | Zhipu | 427B | — |
| 09 | tidepool-alpha | — | 395B | — |
| 10 | iceman | — | 235B | — |
| 11 | gpt-6-luna | OpenAI | 196B | — |
| 12 | deepseek-v4-pro | DeepSeek | 149B | — |
| 13 | nemotron-3.5-super-vl | NVIDIA | 119B | — |
| 14 | nemotron-3.5-lightning | NVIDIA | 110B | — |
| 15 | claude-haiku-5-5 | Anthropic | 71B | — |
| 16 | qwen3.8-flash | Qwen | 70B | — |
| 17 | kimi-k3.1-pro | Moonshot | 68B | — |
| 18 | flint-40b | Recursive | 65B | — |

> 日榜仍由 **DeepSeek 领跑（27T）**，`hy4-flash` 10T 居次；第 3 名起降至万亿以下（`hungerg` 1.5T）。页面切换「昨天」后**不显示日环比**，故本表不填该列。

## 三、前 5 国家每日市场份额（页面「地理分布」，NOV 26 2026）

| 排名 | 国家 / 地区 | Token | 份额 |
| :--: | :--- | ------: | :----: |
| 01 | 中国 | **319T** | **20%** |
| 02 | 美国 | 181T | **11%** |
| 03 | 印度 | 77T | 5% |
| 04 | 德国 | 68T | 4% |
| 05 | 巴西 | 65T | 4% |

> 第 6 位起：日本 63T 4%、俄罗斯 51T 3%、印度尼西亚 43T 3%、新加坡 39T 2%、法国 37T 2%、**中国香港 37T 2%**。
> 页面按国家/地区列示，**中国港澳台分别统计**；本表只取前 5，不合并、不推算总量。

## 四、市场份额统计（按模型作者，NOV 26 2026）

> 来源区块：[opencode.ai/zh/data#market-share](https://opencode.ai/zh/data#market-share)（"按模型作者比较 token 份额"）。

| 排名 | 厂商 | 份额 |
| :--: | :--- | :----: |
| 1 | **DeepSeek** | **63.9%** |
| 2 | **Tencent（腾讯）** | **22.6%** |
| 3 | Other（未归类 / stealth） | 6.4% |
| 4 | Zhipu（智谱） | 2.2% |
| 5 | Meta | 1.6% |
| 6 | Reflection | 1.6% |
| 7 | Xiaomi | 1.1% |
| 8 | NVIDIA | 0.5% |
| 9 | **MiniMax** | **0.1%** |

- **DeepSeek 63.9% + Tencent 22.6% 合计 86.5%**，头部两家继续集中；`hy4-flash` 是 Tencent 份额的唯一驱动力。
- **MiniMax 降至 0.1%**（`minimax-m3.1-flash` 免费档转付费后的持续退潮）。
- 页面「缓存比例」区块：**全站 96%**（已缓存 54T / 未缓存 2.1T）。

---

> 引用须署名 **OpenCode Data（opencode.ai/data）**，并抄录页面顶部更新时间 **2026-11-26 UTC 03:12（GMT+8 11:12）**。
