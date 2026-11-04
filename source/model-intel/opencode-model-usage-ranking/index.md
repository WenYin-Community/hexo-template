---
title: OpenCode 模型调用量排名
date: 2026-11-04
---

> 官方调用量周榜、日榜、地理分布与作者份额快照。数据抓取日 **2026-11-04**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据来源：**OpenCode Data（[opencode.ai/data](https://opencode.ai/data)）**，页面顶部显示"**已更新 11月4日, GMT+8 14:32**"（= UTC 06:32），抓取 2026-11-04。
> 口径：本文档**只保留周榜、日榜、前 5 国家每日市场份额、按作者市场份额四项**，均为页面原值；**不做累计用量计算**（不由日榜推周量、不由分项加总推总量、不计算名次间差值）。
> ⚠️ 日榜 **NOV 4 为部分日**（页面更新时间 GMT+8 14:32），仅示当日相对规模，不代表全天。

---

## 一、周榜（滚动 7 日，截至 2026-11-04）

| 排名 | 模型 | 厂商 | Token 调用量 | 周环比（页面口径） |
| :--: | :--- | :--- | :----------: | :--------: |
| 01 | **deepseek-v4.1-flash** | DeepSeek | **133T** | **+4%** |
| 02 | muse-spark-1.3-contributor | Meta | 6.5T | -17% |
| 03 | glm-5.3-flash | Zhipu | 6.0T | -25% |
| 04 | **beam-1.0-501b-a23b** | Reflection | 5.5T | -6% |
| 05 | mimo-v2.6-flash | Xiaomi | 3.2T | -34% |
| 06 | **deepseek-v4.1-flash-1017-op** | DeepSeek | 1.1T | 新 |
| 07 | gpt-6-luna | OpenAI | 947B | -5% |
| 08 | nemotron-3.5-super-vl | NVIDIA | 916B | -36% |
| 09 | deepseek-v4-pro | DeepSeek | 804B | -5% |
| 10 | deepseek-v4.1-flash-1017 | DeepSeek | 701B | -70% |
| 11 | **iceman-contributor** | — | 640B | **+729%** |
| 12 | **flint-40b** | Recursive | 606B | **+146%** |
| 13 | deepseek-v4p1-flash | DeepSeek | 565B | 新 |
| 14 | minimax-m3.1-flash | MiniMax | 552B | **-93%** |
| 15 | nemotron-3.5-lightning | NVIDIA | 539B | +5% |
| 16 | **iceman** | — | 536B | -74% |
| 17 | **pulse-alpha** | — | 444B | 新 |
| 18 | mimo-v2.6-pro | Xiaomi | 427B | -28% |

- `deepseek-v4.1-flash` 以 **133T 居首、周环比 +4%**；页面概览语为"过去 7 天内 DeepSeek V4.1 Flash 以 133T token 领跑，其次是 Muse Spark 1.3 Contributor（6.5T）和 GLM-5.3-Flash（6T）"。
- **榜单模型 ID 变更**：`beam` 已以 **`beam-1.0-501b-a23b`** 出现（原 Reflection 通道改名）；**`iceman-contributor` / `iceman` / `pulse-alpha` / `flint-40b`** 为新进榜的免费或 stealth 端点。
- `minimax-m3.1-flash` 掉至第 14（552B，**-93%**）——其限时免费端点已于 2026-10-21 后下架，量级随之塌缩。
- `deepseek-v4p1-flash` 与 `deepseek-v4.1-flash-1017-op` 为新上榜通道；`mimo-v2.5` 已跌出榜单前 18。

## 二、日榜（NOV 4，单日 · 部分日）

| 排名 | 模型 | 厂商 | 当日 Token |
| :--: | :--- | :--- | :----------: |
| 01 | deepseek-v4.1-flash | DeepSeek | 6.6T |
| 02 | glm-5.3-flash | Zhipu | 254B |
| 03 | muse-spark-1.3-contributor | Meta | 238B |
| 04 | beam-1.0-501b-a23b | Reflection | 192B |
| 05 | mimo-v2.6-flash | Xiaomi | 125B |
| 06 | **pulse-alpha** | — | 101B |
| 07 | deepseek-v4.1-flash-1017 | DeepSeek | 44B |
| 08 | nemotron-3.5-super-vl | NVIDIA | 41B |
| 09 | gpt-6-luna | OpenAI | 36B |
| 10 | deepseek-v4-pro | DeepSeek | 26B |
| 11 | deepseek-v4.1-flash-1017-op | DeepSeek | 24B |
| 12 | nemotron-3.5-lightning | NVIDIA | 21B |
| 13 | iceman-contributor | — | 19B |
| 14 | minimax-m3.1-flash | MiniMax | 19B |
| 15 | flint-40b | Recursive | 17B |
| 16 | qwen3.8-flash | Qwen | 16B |
| 17 | claude-haiku-5-5 | Anthropic | 16B |
| 18 | mimo-v2.6-pro | Xiaomi | 13B |

## 三、前 5 国家每日市场份额（页面"地理分布"，标注 NOV 4 2026）

| 排名 | 国家 / 地区 | Token | 份额 |
| :--: | :--- | ------: | :----: |
| 01 | 中国 | 209T | **16%** |
| 02 | 美国 | 151T | **12%** |
| 03 | 印度 | 73T | **6%** |
| 04 | 德国 | 56T | **4%** |
| 05 | 巴西 | 55T | **4%** |

> 地理分布完整 15 位（第 6 位起）：日本 49T 4%、印度尼西亚 37T 3%、新加坡 32T 2%、法国 31T 2%、俄罗斯 31T 2%、西班牙 29T 2%、越南 28T 2%、荷兰 26T 2%、英国 26T 2%、**中国香港 24T 2%**。

## 四、市场份额统计（按模型作者，NOV 4 2026）

> 来源区块：[opencode.ai/zh/data#market-share](https://opencode.ai/zh/data#market-share)（"按模型作者比较 token 份额"）。

| 排名 | 厂商 | 份额 | Token |
| :--: | :--- | :----: | ----: |
| 1 | **DeepSeek** | **85.1%** | 6.7T |
| 2 | Zhipu（智谱） | 3.4% | 265B |
| 3 | Other（未归类 / stealth） | 3.1% | 246B |
| 4 | Meta | 3.1% | 241B |
| 5 | **Reflection** | 2.4% | 192B |
| 6 | Xiaomi | 1.8% | 139B |
| 7 | NVIDIA | 0.8% | 62B |
| 8 | MiniMax | **0.4%** | 28B |
| 9 | Meituan（美团） | 0.0% | 1.8B |

- **DeepSeek 以 85.1% 居首**（6.7T），由 `deepseek-v4.1-flash` 单模型主导。
- **Reflection 升至第 5**（2.4%，192B），来自 `beam-1.0-501b-a23b`；**MiniMax 仅 0.4%**（28B）——`minimax-m3.1-flash` 免费端点下架后量级持续回落。
- 页面作者份额表的列序为 **DeepSeek / Meta / MiniMax / Xiaomi / Zhipu / Other / NVIDIA / Reflection / Meituan**（StepFun 已退出当日榜）。
- **全站缓存比例 97%**：已缓存 6.3T、未缓存 180.8B。

---

> 引用须署名 **OpenCode Data（opencode.ai/data）**，并抄录页面顶部更新时间 **2026-11-04 GMT+8 14:32**。
