---
title: OpenCode 模型调用量排名（2026-11-22 快照）
date: 2026-11-22
---

> 官方调用量周榜、日榜、地理分布与作者份额快照。数据抓取日 **2026-11-22**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据来源：**OpenCode Data（[opencode.ai/data](https://opencode.ai/data)）**，页面顶部显示「**已更新 11月22日, GMT+8 21:18**」，抓取 2026-11-22。
> 口径：本文档**只保留周榜、日榜、前 5 国家每日市场份额、按作者市场份额四项**，均为页面原值；**不做累计用量计算**（不由日榜推周量、不由分项加总推总量、不计算名次间差值）。
> ⚠️ 周榜 = 页面「7 天」口径（滚动 7 日）；日榜 = 页面「昨天」口径（NOV 21 单日）。页面另有「New Models / 独立用户 / 会话成本 / 缓存比例」等区块，按本工作区口径不纳入本文档。

---

## 一、周榜（滚动 7 日，截至 2026-11-22）

| 排名 | 模型 | 厂商 | Token 调用量 | 周环比（页面口径） |
| :--: | :--- | :--- | :----------: | :--------: |
| 01 | **deepseek-v4.1-flash** | DeepSeek | **175T** | **-5%** |
| 02 | **hy4-flash** | Tencent | **40T** | **新** |
| 03 | glm-5.3-flash | Zhipu | 5.8T | -35% |
| 04 | beam-1.0-501b-a23b | Reflection | 5.0T | -16% |
| 05 | muse-spark-1.3-contributor | Meta | 4.7T | -23% |
| 06 | **glm-5.3** | Zhipu | 4.5T | **+621%** |
| 07 | inkling-2-small | Thinking Machines | 4.4T | -34% |
| 08 | mimo-v2.6-flash | Xiaomi | 3.0T | -11% |
| 09 | **tidepool-alpha** | — | 1.4T | **新** |
| 10 | minimax-m3.1-flash | MiniMax | 1.4T | -85% |
| 11 | iceman | — | 1.2T | +54% |
| 12 | gpt-6-luna | OpenAI | 1.1T | +5% |
| 13 | deepseek-v4-pro | DeepSeek | 957B | -5% |
| 14 | nemotron-3.5-super-vl | NVIDIA | 947B | -56% |
| 15 | nemotron-3.5-lightning | NVIDIA | 725B | +1% |
| 16 | deepseek-v4.1-flash-1017 | DeepSeek | 485B | -69% |
| 17 | flint-40b | Recursive | 447B | -12% |
| 18 | claude-haiku-5-5 | Anthropic | 417B | -5% |

- **`hy4-flash` 上线 7 天即以 40T 冲至第 2**（腾讯 11-16 发布，Go / Zen 开出 `hy4-flash-free` 免费档），是本期最大变量。
- **`glm-5.3` +621% 至第 6**（4.5T）——与 Go 侧「更高额度」活动、GOAT 侧额度 $70 同步。
- **`minimax-m3.1-flash` -85% 跌至第 10**（1.4T），免费端点退潮后回落；`inkling-2-small` -34%、`deepseek-v4.1-flash-1017` -69%。
- `tidepool-alpha` 新上榜第 9。

## 二、日榜（NOV 21，单日）

| 排名 | 模型 | 当日 Token |
| :--: | :--- | :----------: |
| 01 | deepseek-v4.1-flash | **22T** |
| 02 | **hy4-flash** | **8.5T** |
| 03 | glm-5.3 | 817B |
| 04 | beam-1.0-501b-a23b | 738B |
| 05 | muse-spark-1.3-contributor | 613B |
| 06 | glm-5.3-flash | 467B |
| 07 | tidepool-alpha | 420B |
| 08 | mimo-v2.6-flash | 350B |
| 09 | iceman | 247B |
| 10 | gpt-6-luna | 131B |
| 11 | deepseek-v4-pro | 119B |
| 12 | nemotron-3.5-lightning | 115B |
| 13 | nemotron-3.5-super-vl | 97B |
| 14 | flint-40b | 71B |
| 15 | longcat-2.5 | 66B |
| 16 | minimax-m3.1-flash | 53B |
| 17 | claude-haiku-5-5 | 48B |
| 18 | qwen3.8-flash | 40B |

## 三、前 5 国家每日市场份额（页面「地理分布」，NOV 22 2026）

| 排名 | 国家 / 地区 | Token | 份额 |
| :--: | :--- | ------: | :----: |
| 01 | 中国 | **300T** | **19%** |
| 02 | 美国 | 177T | **11%** |
| 03 | 印度 | 77T | **5%** |
| 04 | 德国 | 66T | **4%** |
| 05 | 巴西 | 64T | **4%** |

> 第 6 位起：日本 61T 4%、俄罗斯 48T 3%、印度尼西亚 43T 3%、新加坡 38T 2%、法国 36T 2%、**中国香港 35T 2%**、西班牙 34T 2%。

## 四、市场份额统计（按模型作者，NOV 22 2026）

> 来源区块：[opencode.ai/zh/data#market-share](https://opencode.ai/zh/data#market-share)（"按模型作者比较 token 份额"）。

| 排名 | 厂商 | 份额 | Token |
| :--: | :--- | :----: | ----: |
| 1 | **DeepSeek** | **64.3%** | 12T |
| 2 | **Tencent（腾讯）** | **23.8%** | **4.5T** |
| 3 | Zhipu（智谱） | 3.3% | 627B |
| 4 | Other（未归类 / stealth） | 3.2% | 606B |
| 5 | Reflection | 1.9% | 358B |
| 6 | Meta | 1.6% | 291B |
| 7 | Xiaomi | 1.1% | 198B |
| 8 | NVIDIA | 0.6% | 109B |
| 9 | **MiniMax** | **0.2%** | 32B |

- 🔑 **腾讯首次进入作者榜并直取第 2（23.8%）**——由 `hy4-flash` 免费档放量驱动；DeepSeek 从 78.9% 回落到 **64.3%**。
- **MiniMax 从 3.1% 跌至 0.2%**，`minimax-m3.1-flash` 免费档退潮是直接原因。
- 页面「缓存比例」区块显示 **97%**（已缓存 4.5T / 未缓存 140.7B），按模型从 97%（deepseek-v4.1-flash）到 94%（glm-5.3-flash、mimo-v2.6-flash）。

---

> 引用须署名 **OpenCode Data（opencode.ai/data）**，并抄录页面顶部更新时间 **2026-11-22 GMT+8 21:18**。
