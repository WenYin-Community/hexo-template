---
title: OpenCode 模型调用量排名（2026-11-22 快照）
date: 2026-11-22
---

> 官方周榜、日榜、前 5 国家份额与作者份额快照，引自 OpenCode Data。数据抓取日 **2026-11-22**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据来源：**OpenCode Data（[opencode.ai/data](https://opencode.ai/data)）**，页面内嵌 `updatedAt` = **2026-11-22T14:17:16Z**，即「**已更新 11月22日, GMT+8 22:17**」，抓取 2026-11-22。
> 口径：本文档**只保留周榜、日榜、前 5 国家每日市场份额、按作者市场份额四项**，均为页面原值；**不做累计用量计算**（不由日榜推周量、不由分项加总推总量、不计算名次间差值）。
> ⚠️ 周榜 = 页面「7 天」口径（滚动 7 日）；日榜 = 页面「昨天」口径（NOV 21 单日）；国家与作者份额 = 页面「NOV 22」当日口径。页面另有「New Models / 独立用户 / 会话成本 / 缓存比例」等区块，按本工作区口径不纳入本文档。
> 🔑 **数据获取方式已升级**：榜单虽为客户端渲染，但 **SSR HTML 内嵌完整 RSC 数据**（`updatedAt` / `leaderboard.{daily,weekly}` / `country` / `cacheRatio` / `siteWide.authors`），**`curl -sL` + 正则即可完整还原四张表，无需浏览器**。字段单位 = **B（十亿 token）**，故 175999 = 176T。

---

## 一、周榜（滚动 7 日，截至 2026-11-22）

| 排名 | 模型 | 厂商 | Token 调用量 | 周环比（页面口径） |
| :--: | :--- | :--- | :----------: | :--------: |
| 01 | **deepseek-v4.1-flash** | DeepSeek | **176T** | **-4%** |
| 02 | **hy4-flash** | Tencent | **40.4T** | **新** |
| 03 | glm-5.3-flash | Zhipu | 5.8T | -35% |
| 04 | beam-1.0-501b-a23b | Reflection | 5.0T | -15% |
| 05 | muse-spark-1.3-contributor | Meta | 4.7T | -23% |
| 06 | **glm-5.3** | Zhipu | 4.5T | **+626%** |
| 07 | inkling-2-small | Thinking Machines | 4.4T | -34% |
| 08 | mimo-v2.6-flash | Xiaomi | 3.0T | -10% |
| 09 | **tidepool-alpha** | — | 1.4T | **新** |
| 10 | minimax-m3.1-flash | MiniMax | 1.4T | -85% |
| 11 | iceman | — | 1.2T | +57% |
| 12 | gpt-6-luna | OpenAI | 1.1T | +6% |
| 13 | deepseek-v4-pro | DeepSeek | 963B | -4% |
| 14 | nemotron-3.5-super-vl | NVIDIA | 952B | -55% |
| 15 | nemotron-3.5-lightning | NVIDIA | 731B | +1% |
| 16 | deepseek-v4.1-flash-1017 | DeepSeek | 485B | -69% |
| 17 | flint-40b | Recursive | 451B | -11% |
| 18 | claude-haiku-5-5 | Anthropic | 419B | -5% |

- **`hy4-flash` 上线 7 天即以 40.4T 稳居第 2**（腾讯 11-16 发布，Go / Zen 开出 `hy4-flash-free` 免费档），是本周期最大变量，**贡献了 Tencent 在作者份额榜的第 2 位**。
- **`glm-5.3` +626% 至第 6**（4.5T）——与 Go 侧「$500 更高额度」促销、GOAT 侧额度 $70 同步。
- **`minimax-m3.1-flash` -85% 跌至第 10**（1.4T），免费端点转付费后退潮；`inkling-2-small` -34%、`deepseek-v4.1-flash-1017` -69%。
- `tidepool-alpha` 新上榜第 9（1.4T），页面未标厂商。

## 二、日榜（NOV 21，单日）

| 排名 | 模型 | 厂商 | 当日 Token | 日环比 |
| :--: | :--- | :--- | :----------: | :--: |
| 01 | deepseek-v4.1-flash | DeepSeek | **22.3T** | -11% |
| 02 | **hy4-flash** | Tencent | **8.5T** | +6% |
| 03 | glm-5.3 | Zhipu | 817B | -19% |
| 04 | beam-1.0-501b-a23b | Reflection | 738B | -4% |
| 05 | muse-spark-1.3-contributor | Meta | 613B | -9% |
| 06 | glm-5.3-flash | Zhipu | 467B | -23% |
| 07 | tidepool-alpha | — | 420B | -3% |
| 08 | mimo-v2.6-flash | Xiaomi | 350B | -17% |
| 09 | iceman | — | 247B | +22% |
| 10 | gpt-6-luna | OpenAI | 131B | -22% |
| 11 | deepseek-v4-pro | DeepSeek | 119B | -13% |
| 12 | nemotron-3.5-lightning | NVIDIA | 115B | -5% |
| 13 | nemotron-3.5-super-vl | NVIDIA | 97B | -17% |
| 14 | flint-40b | Recursive | 71B | -7% |
| 15 | longcat-2.5 | Meituan | 66B | -11% |
| 16 | minimax-m3.1-flash | MiniMax | 53B | -17% |
| 17 | claude-haiku-5-5 | Anthropic | 48B | -21% |
| 18 | qwen3.8-flash | Qwen | 40B | -26% |

> 单日榜仍由 **DeepSeek** 领跑（22.3T），**`hy4-flash` 8.5T 居次**；第 3 名起已降至千亿级（`glm-5.3` 817B）。

## 三、前 5 国家每日市场份额（页面「地理分布」，NOV 22 2026）

| 排名 | 国家 / 地区 | Token | 份额 |
| :--: | :--- | ------: | :----: |
| 01 | 中国 | **300.1T** | **19.0%** |
| 02 | 美国 | 176.7T | **11.2%** |
| 03 | 印度 | 77.3T | 4.9% |
| 04 | 德国 | 66.1T | 4.2% |
| 05 | 巴西 | 63.6T | 4.0% |

> 第 6 位起：日本 60.8T 3.8%、俄罗斯 47.7T 3.0%、印度尼西亚 42.6T 2.7%、新加坡 37.8T 2.4%、法国 36.4T 2.3%、**中国香港 34.6T 2.2%**、西班牙 34.3T 2.2%、越南 31.8T 2.0%、荷兰 30.0T 1.9%、英国 29.6T 1.9%。
> 页面共列 **127 个国家 / 地区**；**中国台湾 15.2T 1.0%（第 25）**、**中国澳门 0.61T（第 109）**。

## 四、市场份额统计（按模型作者，NOV 22 2026）

> 来源区块：[opencode.ai/zh/data#market-share](https://opencode.ai/zh/data#market-share)（"按模型作者比较 token 份额"）。

| 排名 | 厂商 | 份额 | Token |
| :--: | :--- | :----: | ----: |
| 1 | **DeepSeek** | **64.3%** | **13.2T** |
| 2 | **Tencent（腾讯）** | **23.8%** | **4.9T** |
| 3 | Zhipu（智谱） | 3.3% | 686B |
| 4 | Other（未归类 / stealth） | 3.3% | 671B |
| 5 | Reflection | 1.9% | 395B |
| 6 | Meta | 1.5% | 318B |
| 7 | Xiaomi | 1.1% | 216B |
| 8 | NVIDIA | 0.6% | 120B |
| 9 | **MiniMax** | **0.2%** | 36B |

- 🔑 **腾讯首次进入作者榜并直取第 2（23.8%）**——由 `hy4-flash` 免费档放量驱动；**DeepSeek 份额为 64.3%**（此前长期在 78.9% 水平）。
- **MiniMax 从 3.1% 跌至 0.2%**，`minimax-m3.1-flash` 免费档转付费是直接原因。
- 页面「缓存比例」区块：**最高 97.2%**（`deepseek-v4.1-flash`，已缓存 170.2T / 未缓存 4.9T / 合计 175.1T），**最低 94.1%**（`mimo-v2.6-flash`）；`minimax-m3.1-flash` 同为 97.2%，`glm-5.3` 95.3%，`glm-5.3-flash` 94.2%。

---

> 引用须署名 **OpenCode Data（opencode.ai/data）**，并抄录页面顶部更新时间 **2026-11-22 GMT+8 22:17（UTC 14:17）**。
