---
title: OpenCode 模型调用量排名（2026-11-15 快照）
date: 2026-11-15
---

> 官方调用量周榜、日榜、地理分布与作者份额快照。数据抓取日 **2026-11-15**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据来源：**OpenCode Data（[opencode.ai/data](https://opencode.ai/data)）**，页面顶部显示「**已更新 11月15日, UTC 09:17**」，抓取 2026-11-15。
> 口径：本文档**只保留周榜、日榜、前 5 国家每日市场份额、按作者市场份额四项**，均为页面原值；**不做累计用量计算**（不由日榜推周量、不由分项加总推总量、不计算名次间差值）。
> ⚠️ 日榜 **NOV 15 为部分日**（页面更新于 UTC 09:17），仅示当日相对规模，不代表全天。

---

## 一、周榜（滚动 7 日，截至 2026-11-15）

| 排名 | 模型 | 厂商 | Token 调用量 | 周环比（页面口径） |
| :--: | :--- | :--- | :----------: | :--------: |
| 01 | **deepseek-v4.1-flash** | DeepSeek | **168T** | **+2%** |
| 02 | **minimax-m3.1-flash** | MiniMax | 8.6T | — |
| 03 | glm-5.3-flash | Zhipu | 8.1T | +11% |
| 04 | **inkling-2-small** | Thinking Machines | 5.8T | **+566%** |
| 05 | muse-spark-1.3-contributor | Meta | 5.6T | -18% |
| 06 | beam-1.0-501b-a23b | Reflection | 5.3T | -7% |
| 07 | mimo-v2.6-flash | Xiaomi | 3.1T | -13% |
| 08 | nemotron-3.5-super-vl | NVIDIA | 2.0T | -25% |
| 09 | deepseek-v4.1-flash-1017 | DeepSeek | 1.5T | **+99%** |
| 10 | gpt-6-luna | OpenAI | 971B | -14% |
| 11 | deepseek-v4-pro | DeepSeek | 921B | -6% |
| 12 | deepseek-v4.1-flash-1017-op | DeepSeek | 837B | -2% |
| 13 | iceman | — | 693B | +71% |
| 14 | nemotron-3.5-lightning | NVIDIA | 644B | -7% |
| 15 | glm-5.3 | Zhipu | 593B | **+143%** |
| 16 | **longcat-2.5** | Meituan | 578B | 新 |
| 17 | muse-ember-1.0 | Meta | 490B | -72% |
| 18 | flint-40b | Recursive | 457B | -21% |

- `deepseek-v4.1-flash` 以 **168T 领跑、周环比 +2%**。
- **`minimax-m3.1-flash` 从第 14 位（552B）跃升至第 2（8.6T）**——Zen 侧 `minimax-m3.1-flash-free` 免费端点**重新上线**，量级随之暴涨。
- **`inkling-2-small` 以 +566% 冲进第 4**（5.8T），同期 CommandCode 上线 `thinkingmachines/inkling-2-small:free` 免费档。
- `glm-5.3` +143% 至第 15，与 GOAT 侧额度由 $20 升至 **$70** 同步。
- `muse-ember-1.0`（Meta 新模型）虽 -72% 但仍在第 17；`longcat-2.5` 新上榜第 16。
- **已退出前 18**：`longcat-2.0`、`mimo-v2.5` 系、`minimax-m2.x` 系。

## 二、日榜（NOV 15，单日 · 部分日）

| 排名 | 模型 | 当日 Token |
| :--: | :--- | :----------: |
| 01 | deepseek-v4.1-flash | **7.8T** |
| 02 | glm-5.3-flash | 418B |
| 03 | inkling-2-small | 417B |
| 04 | minimax-m3.1-flash | 308B |
| 05 | beam-1.0-501b-a23b | 260B |
| 06 | muse-spark-1.3-contributor | 228B |
| 07 | mimo-v2.6-flash | 144B |
| 08 | nemotron-3.5-super-vl | 55B |
| 09 | deepseek-v4.1-flash-1017-op | 46B |
| 10 | gpt-6-luna | 42B |
| 11 | iceman | 39B |
| 12 | deepseek-v4.1-flash-1017 | 38B |
| 13 | nemotron-3.5-lightning | 33B |
| 14 | deepseek-v4-pro | 33B |
| 15 | deepseek-v4p1-flash-spot | 29B |
| 16 | flint-40b | 23B |
| 17 | longcat-2.5 | 20B |
| 18 | mimo-v2.6-pro | 16B |

## 三、前 5 国家每日市场份额（页面「地理分布」，标注 NOV 15 2026）

| 排名 | 国家 / 地区 | Token | 份额 |
| :--: | :--- | ------: | :----: |
| 01 | 中国 | 259T | **18%** |
| 02 | 美国 | 166T | **11%** |
| 03 | 印度 | 75T | **5%** |
| 04 | 德国 | 62T | **4%** |
| 05 | 巴西 | 60T | **4%** |

> 第 6 位起：日本 56T 4%、俄罗斯 40T 3%、印度尼西亚 40T 3%、新加坡 35T 2%、法国 34T 2%、西班牙 32T 2%、越南 30T 2%、**中国香港 30T 2%**、荷兰 28T 2%。

## 四、市场份额统计（按模型作者，NOV 15 2026）

> 来源区块：[opencode.ai/zh/data#market-share](https://opencode.ai/zh/data#market-share)（"按模型作者比较 token 份额"）。

| 排名 | 厂商 | 份额 | Token |
| :--: | :--- | :----: | ----: |
| 1 | **DeepSeek** | **78.9%** | 7.9T |
| 2 | Other（未归类 / stealth） | 6.1% | 610B |
| 3 | Zhipu（智谱） | 4.3% | 430B |
| 4 | **MiniMax** | **3.1%** | 315B |
| 5 | Reflection | 2.6% | 260B |
| 6 | Meta | 2.3% | 230B |
| 7 | Xiaomi | 1.6% | 160B |
| 8 | NVIDIA | 0.9% | 88B |
| 9 | Meituan（美团） | 0.2% | 22B |

- **DeepSeek 仍以 78.9% 居首**（7.9T），较 11-04 的 85.1% 有所回落，被 Other（6.1%）与 MiniMax（3.1%）分走。
- **MiniMax 从 0.4% 回到 3.1%**——`minimax-m3.1-flash` 免费端点回归直接带动份额回升。
- **全站缓存比例 97%**：已缓存 163T、未缓存 4.7T。

---

> 引用须署名 **OpenCode Data（opencode.ai/data）**，并抄录页面顶部更新时间 **2026-11-15 UTC 09:17**。
