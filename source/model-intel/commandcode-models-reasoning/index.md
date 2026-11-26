---
title: CommandCode 全模型推理档位速查（2026-11-26）
date: 2026-11-26
---

> CLI 1.93.4 / 105 款模型的推理档位、上下文与网关价。数据抓取日 **2026-11-26**。

[← 返回「模型情报」合集](/model-intel/)

---

> 覆盖 **command-code 网关 Provider API 105 个端点** 与 **CLI 1.93.4 官方目录 105 款**（抓取日 **2026-11-26**）。
> ✅ **档位唯一口径 = CLI 包内 `models.md`**：在线 Provider API 只返回 ID / `context_length` / `supported_endpoints`，**不含价格与推理档位**。
> ✅ **两源完全收敛**：网关 API **105 款 = CLI 1.93.4 目录 105 款，差集 0**，逐 ID 一致，可任选一源。
> **档位说明**：① `deepseek/*` 全线含 **`off`**（可关闭思考）；② `claude-*` / `gpt-*` 多为五档 `low, medium, high, xhigh, max`；③ `Qwen 3.8` 系为 `low, medium, xhigh`（**无 high**）；④ `zai-org/GLM-5.2` 仅 `high, max` 两档。
> 本文档为**当前状态速查**：档位、价格、套餐门槛全部取自 `command-code` **CLI 1.93.4** 包内官方目录与 Provider API（2026-11-26 抓取），不含历史版本对照。

## 数据源与刷新方法

| 数据 | 来源 | 说明 |
|---|---|---|
| 在线模型全名单（**105**） | `GET https://api.commandcode.ai/provider/v1/models` | 官方 Provider API，**2026-11-26 匿名抓取**；返回字段含 `context_length` / `supported_endpoints`，**不含价格与推理档位**；**与 CLI 1.93.4 目录逐 ID 一致，差集 0** |
| 推理能力 / 可选档位 / 网关价 / 套餐下限（**权威**） | `npm pack command-code@latest` → `package/dist/bundled/command-code-knowledge/reference/models.md` | CLI 官方模型目录，含 Id / Name / Context / **Efforts** / $每1M / **Min plan** / Best for；**版本 1.93.4，共 105 款（19,175 字节 / 145 行）**；其中 **78 款有档位、27 款为 `—`** |
| 退役公告 | 同上 → `package/CHANGELOG.md` | 仅作辅助；**1.93.4 包内 CHANGELOG 已不再逐条保留早期模型的增删记录**，不得据版本号倒推上架时间 |
| 档位口径（快照，已过时） | [`pi-commandcode-provider`](https://www.npmjs.com/package/pi-commandcode-provider) | 由旧版 CLI 生成的静态快照；滞后于 CLI，仅作对照，**禁止作为档位依据** |

**刷新方法**：重新执行
```bash
curl -s https://api.commandcode.ai/provider/v1/models          # 在线全模型名单（11-26 = 105 个 ID）
npm view command-code version                                   # CLI 最新版（11-26 = 1.93.4）
```
```bash
mkdir -p /tmp/cc && cd /tmp/cc && npm pack command-code@latest >/dev/null 2>&1
tar xzOf command-code-*.tgz package/dist/bundled/command-code-knowledge/reference/models.md > m.md
tar xzOf command-code-*.tgz package/CHANGELOG.md > c.md
```
> ⚠️ **沙箱注意**：包体约 4.3 MB（1.93.4 实测 4,326,051 字节），**禁止 `tar xzf` 全量解压**（会报「设备上没有空间」）；必须用 `tar xzOf <tgz> <包内路径>` 直接流式取单个文件。

**新模型核实要求**：先 diff Provider API 全名单与本文表内条目，新增端点**直接读 CLI 包内 `models.md` 取档位与价格**；**禁止按同族模型外推**。未列入档位列的模型不代表不推理——见第二节「自动档」。

---

## 一、支持可选推理档位（78 个）

档位值即网关上 `reasoning_effort` 参数接受的拼写（恒等直译）。**价格为 CLI 目录公开的 input/output · cache read（每 1M tokens）**。

| 模型 ID | 名称 | 上下文 | 可选推理档位 | 价格（in/out · cache） | Min plan |
|---|---|---|---|---|---|
| `deepseek/deepseek-v4-pro` | DeepSeek V4 Pro (latest) | 1M | off, high, max | $0.66/$1.98 · cache $0.022 | Go and above |
| `deepseek/deepseek-v4-flash` | DeepSeek V4 Flash (latest) | 1M | off, high, max | $0.15/$0.6 · cache $0.003 | Go and above |
| `deepseek/deepseek-v4-flash-vision-exp` | DeepSeek V4 Flash Vision (exp) | 1M | off, high, max | $0.15/$0.6 · cache $0.003 | Go and above |
| `deepseek/deepseek-v4-flash-fast` | DeepSeek V4 Flash Fast | 1M | low, high, max | $0.28/$0.56 · cache $0.07 | Go and above |
| `deepseek/deepseek-v4.1-flash` | DeepSeek V4.1 Flash (latest) | 1M | off, low, high, max | $0.15/$0.6 · cache $0.003 | Go and above |
| `deepseek/deepseek-v4.1-flash-fast` | DeepSeek V4.1 Flash Fast (latest) | 1M | off, low, high, max | $0.16/$0.58 · cache $0.016 | Go and above |
| `deepseek/deepseek-v4.1-flash-ultrafast` | DeepSeek V4.1 Flash Ultrafast | 1.05M | off, low, high, max | $2.4/$9.6 · cache $0.048 | GOAT and above |
| `moonshotai/Kimi-K3.1-Pro` | Kimi K3.1 Pro | 1.05M | low, high, max | $2/$10 · cache $0.2 | Go and above |
| `moonshotai/Kimi-K3` | Kimi K3 | 1M | low, high, max | $3/$15 · cache $0.3 | Go and above |
| `z-ai/glm-5.3-flash` | GLM-5.3 Flash | 1.05M | low, high, max | $0.15/$0.5 · cache $0.03 | Go and above |
| `z-ai/glm-5.3-flashx` | GLM-5.3 FlashX | 1M | low, high, max | $0.37/$1.25 · cache $0.075 | Go and above |
| `zai-org/GLM-5.3` | GLM-5.3 | 1M | low, high, max | $1.4/$4.4 · cache $0.26 | Go and above |
| `zai-org/GLM-5.2` | GLM-5.2 | 1M | high, max | $1.4/$4.4 · cache $0.26 | Go and above |
| `minimax/minimax-m3.1-flash` | MiniMax M3.1 Flash | 1M | low, medium, high, xhigh, max | $0.15/$0.6 · cache $0.015 | Go and above |
| `MiniMaxAI/MiniMax-M3` | MiniMax M3 | 1M | low, medium, high | $0.3/$1.2 · cache $0.06 | Go and above |
| `Qwen/Qwen4-Max` | Qwen 4 Max | 1M | off, low, high, xhigh | $1.5/$4.5 · cache $0.075 (write $1.875) | Go and above |
| `Qwen/Qwen3.8-Omni-Flash` | Qwen 3.8 Omni Flash | 1M | low, medium, xhigh | $0.15/$0.47 · cache $0.016 | Go and above |
| `Qwen/Qwen3.8-Max-Prime` | Qwen 3.8 Max Prime | 1M | low, medium, xhigh | $4/$12 · cache $0.5 (write $5) | GOAT and above |
| `Qwen/Qwen3.8-Max-0902` | Qwen 3.8 Max 0902 | 1M | low, medium, xhigh | $2/$6 · cache $0.25 | Go and above |
| `Qwen/Qwen3.8-Max` | Qwen 3.8 Max | 1M | low, medium, xhigh | $2/$6 · cache $0.25 (write $2.5) | Go and above |
| `Qwen/Qwen3.8-27B` | Qwen 3.8 27B | 262K | low, medium, xhigh | $0.4/$3 · cache $0.04 | Go and above |
| `Qwen/Qwen3.8-Flash` | Qwen 3.8 Flash | 1M | low, medium, xhigh | $0.16/$0.47 · cache $0.016 | Go and above |
| `stepfun/Step-5-Preview` | Step 5 Preview | 1M | low, medium, high | $1/$2.7 · cache $0.05 | Go and above |
| `tencent/hy4` | Tencent Hy4 | 1.02M | low, medium, high | $0.834/$2.501 · cache $0.042 | Go and above |
| `tencent/hy4-flash` | Tencent Hy4 Flash | 1.02M | off, high | $0.07/$0.281 · cache $0.003 | Go and above |
| `tencent/hy4-preview` | Tencent Hy4 Preview | 1.05M | low, medium, high | $0.834/$2.501 · cache $0.042 | Go and above |
| `nvidia/nemotron-3.5-super-vl` | Nemotron 3.5 Super VL | 262K | low, medium, high | $0.2/$0.5 · cache $0.04 | Go and above |
| `thinkingmachines/inkling-2-mini` | Inkling 2 Mini | 1.05M | off, low, medium, high, max | $0.075/$0.3 · cache $0.015 | Go and above |
| `inclusionai/ling-3.1-flash` | Ling 3.1 Flash | 262K | low, medium, high | $0.3/$0.9 · cache $0.06 | Go and above |
| `inclusionai/ling-3.1-flash-1019` | Ling 3.1 Flash 1019 | 1M | low, medium, high | $0.3/$0.9 · cache $0.06 | Go and above |
| `mistral/mistral-large-4` | Mistral Large 4 | 524K | low, medium, high | $1.36/$4.18 · cache $0.14 | Go and above |
| `stealth/glyph-cluster:free` | Glyph Cluster | 256K | low, medium, high, xhigh | $0/$0 · cache $0 | Go and above |
| `claude-sonnet-5-5` | Claude Sonnet 5.5 | 1M | low, medium, high, xhigh, max | $2/$10 · cache $0.1 (write $2.5) | GOAT and above |
| `claude-sonnet-5` | Claude Sonnet 5 | 1M | low, medium, high, xhigh, max | $2/$10 · cache $0.2 (write $2.5) | Pro and above |
| `claude-sonnet-4-6` | Claude Sonnet 4.6 | 1M | low, medium, high, xhigh, max | $3/$15 · cache $0.3 (write $3.75) | Pro and above |
| `claude-fable-5-2` | Claude Fable 5.2 | 1M | low, medium, high, xhigh, max | $8/$40 · cache $0.2 (write $10) | Max |
| `claude-fable-5-1` | Claude Fable 5.1 | 1M | low, medium, high, xhigh, max | $10/$50 · cache $0.25 (write $12.5) | Max |
| `claude-fable-5` | Claude Fable 5 | 1M | low, medium, high, xhigh, max | $10/$50 · cache $1 (write $12.5) | Max |
| `claude-opus-5-5` | Claude Opus 5.5 | 1M | low, medium, high, xhigh, max | $4/$20 · cache $0.2 (write $5) | Max |
| `claude-opus-5` | Claude Opus 5 | 1M | low, medium, high, xhigh, max | $5/$25 · cache $0.5 (write $6.25) | Max |
| `claude-opus-4-8` | Claude Opus 4.8 | 1M | low, medium, high, xhigh, max | $5/$25 · cache $0.5 (write $6.25) | Max |
| `claude-opus-4-7` | Claude Opus 4.7 | 1M | low, medium, high, xhigh, max | $5/$25 · cache $0.5 (write $6.25) | Max |
| `claude-haiku-5-5` | Claude Haiku 5.5 | 1M | low, medium, high, xhigh, max | $0.1/$0.5 · cache $0.01 (write $0.125) | GOAT and above |
| `gpt-6-astra` | GPT-6 Astra | 1.05M | low, medium, high, xhigh, max | $10/$50 · cache $1 (write $12.5) | Max |
| `gpt-6.2-astra` | GPT-6.2 Astra | 1.05M | low, medium, high, xhigh, max | $8/$40 · cache $0.4 (write $10) | Max |
| `gpt-6.2-sol` | GPT-6.2 Sol | 1.05M | low, medium, high, xhigh, max | $2/$10 · cache $0.1 (write $2.5) | Pro and above |
| `gpt-6.1-sol` | GPT-6.1 Sol | 1.05M | low, medium, high, xhigh, max | $2/$10 · cache $0.1 (write $2.5) | Max |
| `gpt-6.1-terra` | GPT-6.1 Terra | 1.05M | low, medium, high, xhigh, max | $1/$5 · cache $0.05 (write $1.25) | Pro and above |
| `gpt-6-sol` | GPT-6 Sol | 1.05M | low, medium, high, xhigh, max | $2/$10 · cache $0.2 (write $2.5) | Pro and above |
| `gpt-6-luna` | GPT-6 Luna | 1.05M | low, medium, high, xhigh, max | $0.1/$0.5 · cache $0.01 (write $0.125) | Go and above |
| `gpt-5.6-sol` | GPT-5.6 Sol | 1.05M | low, medium, high, xhigh, max | $5/$30 · cache $0.5 (write $6.25) | GOAT and above |
| `gpt-5.6-terra` | GPT-5.6 Terra | 1.05M | low, medium, high, xhigh, max | $2/$12 · cache $0.2 (write $2.5) | Pro and above |
| `gpt-5.6-luna` | GPT-5.6 Luna | 1.05M | low, medium, high, xhigh, max | $0.2/$1.2 · cache $0.02 (write $0.25) | Go and above |
| `gpt-5.5` | GPT-5.5 | 400K | low, medium, high, xhigh | $5/$30 · cache $0.5 (write $0) | Pro and above |
| `gpt-5.4` | GPT-5.4 | 400K | low, medium, high, xhigh | $2.5/$15 · cache $0.25 (write $0) | Pro and above |
| `gpt-5.3-codex` | GPT-5.3 Codex | 400K | low, medium, high, xhigh | $2/$8 · cache $0.5 (write $0) | Pro and above |
| `gpt-5.4-mini` | GPT-5.4 Mini | 400K | low, medium, high | $0.75/$4.5 · cache $0.075 (write $0) | Pro and above |
| `google/gemini-4-carbon` | Gemini 4 Carbon | 1M | low, medium, high | $2/$10 · cache $0.1 | Pro and above |
| `google/gemini-4-neon` | Gemini 4 Neon | 1M | low, medium, high, xhigh | $3/$15 · cache $0.15 | Pro and above |
| `google/gemini-4-argon` | Gemini 4 Argon | 1M | low, medium, high | $2/$10 · cache $0.1 | Pro and above |
| `google/gemini-3.8-flash` | Gemini 3.8 Flash | 1M | low, medium, high | $1.5/$7.5 · cache $0.15 | GOAT and above |
| `google/gemini-3.7-flash` | Gemini 3.7 Flash | 1.05M | low, medium, high | $1.5/$7.5 · cache $0.15 (write $0.08334) | GOAT and above |
| `google/gemini-3.6-flash` | Gemini 3.6 Flash | 1M | low, medium, high | $1.5/$7.5 · cache $0.15 | Pro and above |
| `google/gemini-3.5-flash` | Gemini 3.5 Flash | 1M | low, medium, high | $1.5/$9 · cache $0.15 | Pro and above |
| `google/gemini-3.5-flash-lite` | Gemini 3.5 Flash Lite | 1M | low, medium, high | $0.3/$2.5 · cache $0.03 | Pro and above |
| `google/gemini-3.1-flash-lite` | Gemini 3.1 Flash Lite | 1M | low, medium, high | $0.25/$1.5 · cache $0.03 | Pro and above |
| `sakana/fugu-ultra` | Fugu Ultra | 1M | high, xhigh | $5/$30 · cache $0.5 | Max |
| `meta/muse-spark-1.1` | Muse Spark 1.1 | 1.05M | low, medium, high, xhigh | $1.25/$4.25 · cache $0.15 | Pro and above |
| `meta/muse-spark-1.2` | Muse Spark 1.2 | 1.05M | low, medium, high, xhigh | $1.25/$4.25 · cache $0.15 | GOAT and above |
| `meta/muse-spark-1.2-contributor` | Muse Spark 1.2 Contributor | 1.05M | low, medium, high, xhigh | $0.1/$0.2 · cache $0.002 | Go and above |
| `meta/muse-spark-1.3` | Muse Spark 1.3 | 1.05M | low, medium, high, xhigh, max | $1.25/$4.25 · cache $0.15 | GOAT and above |
| `meta/muse-spark-1.3-contributor` | Muse Spark 1.3 Contributor | 1.05M | low, medium, high, xhigh | $0.1/$0.2 · cache $0.002 | Go and above |
| `meta/muse-spark-open` | Muse Spark Open | 1.05M | low, medium, high | $1.25/$4.25 · cache $0.15 | Go and above |
| `meta/muse-wonder-1.0` | Muse Wonder | 1.05M | low, medium, high, xhigh | $4/$20 · cache $0.2 | Max |
| `meta/muse-ember` | Muse Ember | 1.05M | low, medium, high, xhigh, max | $0.1/$0.5 · cache $0.004 | Go and above |
| `xai/grok-4.5` | Grok 4.5 | 500K | low, medium, high | $2/$6 · cache $0.5 | Go and above |
| `xai/grok-4.6` | Grok 4.6 | 500K | low, medium, high, xhigh | $2/$6 · cache $0.5 | GOAT and above |
| `xai/grok-4.7` | Grok 4.7 | 500K | low, medium, high, xhigh | $2/$6 · cache $0.5 | GOAT and above |

## 二、会推理、深度由 CommandCode 自动选择（27 个）

模型支持推理，但官方 CLI catalog **未公布可选档位**（`Efforts` 列为 `—`），不发送 `reasoning_effort`（发送反而会被网关拒绝）。

| 模型 ID | 名称 | 上下文 | 可选推理档位 | 价格（in/out · cache） | Min plan |
|---|---|---|---|---|---|
| `moonshotai/Kimi-K2.7-Code` | Kimi K2.7 Code | 256K | _自动（官方未公布档位）_ | $0.95/$4 · cache $0.19 | Go and above |
| `moonshotai/Kimi-K2.7-Code-Highspeed` | Kimi K2.7 Code HighSpeed | 262K | _自动（官方未公布档位）_ | $1.9/$8 · cache $0.38 | Go and above |
| `moonshotai/Kimi-K2.6` | Kimi K2.6 | 256K | _自动（官方未公布档位）_ | $0.95/$4 · cache $0.16 | Go and above |
| `moonshotai/Kimi-K2.5` | Kimi K2.5 | 256K | _自动（官方未公布档位）_ | $0.6/$3 · cache $0.1 | Go and above |
| `zai-org/GLM-5.2-Fast` | GLM-5.2 Fast | 1M | _自动（官方未公布档位）_ | $3/$10.25 · cache $0.5 | Go and above |
| `zai-org/GLM-5.1` | GLM-5.1 | — | _自动（官方未公布档位）_ | $1.4/$4.4 · cache $0.26 | Go and above |
| `zai-org/GLM-5` | GLM-5 | 200K | _自动（官方未公布档位）_ | $1/$3.2 · cache $0.2 | Go and above |
| `MiniMaxAI/MiniMax-M2.7` | MiniMax M2.7 | — | _自动（官方未公布档位）_ | $0.3/$1.2 · cache $0.06 | Go and above |
| `MiniMaxAI/MiniMax-M2.5` | MiniMax M2.5 | 200K | _自动（官方未公布档位）_ | $0.3/$1.2 · cache $0.03 | Go and above |
| `ornith/ornith-1.5-122b` | Ornith 1.5 122B | 262K | _自动（官方未公布档位）_ | $0.16/$0.64 · cache $0.02 | Go and above |
| `xiaomi/mimo-v2.6-pro` | MiMo V2.6 Pro | 1.05M | _自动（官方未公布档位）_ | $0.435/$0.87 · cache $0.0036 | Go and above |
| `xiaomi/mimo-v2.6-pro-ultraspeed` | MiMo V2.6 Pro UltraSpeed | 1.05M | _自动（官方未公布档位）_ | $4.35/$8.7 · cache $0.036 | GOAT and above |
| `xiaomi/mimo-v2.6-flash` | MiMo V2.6 Flash | 1.05M | _自动（官方未公布档位）_ | $0.14/$0.28 · cache $0.0028 | Go and above |
| `Qwen/Qwen3.7-Max` | Qwen 3.7 Max | 1M | _自动（官方未公布档位）_ | $2.5/$7.5 · cache $0.5 (write $3.13) | Go and above |
| `Qwen/Qwen3.7-Plus` | Qwen 3.7 Plus | 1M | _自动（官方未公布档位）_ | $0.4/$1.6 · cache $0.08 (write $0.5) | Go and above |
| `Qwen/Qwen3.7-Flash` | Qwen 3.7 Flash | 1M | _自动（官方未公布档位）_ | $0.03/$0.13 · cache $0.006 (write $0.038) | Go and above |
| `Qwen/Qwen3.6-Max-Preview` | Qwen 3.6 Max Preview | — | _自动（官方未公布档位）_ | $1.3/$7.8 · cache $0.26 (write $1.63) | Go and above |
| `Qwen/Qwen3.6-Plus` | Qwen 3.6 Plus | — | _自动（官方未公布档位）_ | $0.5/$3 · cache $0.1 | Go and above |
| `meituan/LongCat-2.0` | LongCat 2.0 | 1.05M | _自动（官方未公布档位）_ | $0.3/$1.2 · cache $0.006 | Go and above |
| `stepfun/Step-3.7-Flash` | Step 3.7 Flash | 256K | _自动（官方未公布档位）_ | $0.2/$1.15 · cache $0.04 | Go and above |
| `stepfun/Step-3.5-Flash` | Step 3.5 Flash | 262K | _自动（官方未公布档位）_ | $0.09/$0.3 · cache $0.02 | Go and above |
| `tencent/hy3-paid` | Tencent Hy3 | 262K | _自动（官方未公布档位）_ | $0.14/$0.58 · cache $0.035 | Go and above |
| `nvidia/nemotron-3-ultra-550b-a55b` | Nemotron 3 Ultra | 1M | _自动（官方未公布档位）_ | $0.6/$2.4 · cache $0.12 | Go and above |
| `thinkingmachines/inkling` | Inkling | 256K | _自动（官方未公布档位）_ | $1/$4.05 · cache $0.17 | Go and above |
| `thinkingmachines/inkling-small` | Inkling Small | 1M | _自动（官方未公布档位）_ | $0.5/$1.2 · cache $0.1 | Go and above |
| `recursive/flint-v1.0:free` | Flint | 262K | _自动（官方未公布档位）_ | $0/$0 · cache $0 | Go and above |
| `claude-haiku-4-5-20251001` | Claude Haiku 4.5 | 200K | _自动（官方未公布档位）_ | $1/$5 · cache $0.1 (write $1.25) | Pro and above |

> 计数核对：**78 + 27 = 105**，与 CLI **1.93.4** 官方目录 105 款一致（`Efforts` 列非 `—` 者 78 款、为 `—` 者 27 款）；**Provider API 实测 105 个 ID，与目录逐 ID 一致（差集 0）**。
> ⚠️ **本期新增 1 款**：`thinkingmachines/inkling-2-mini`（1.05M、$0.075/$0.30、五档含 `off`），使目录从 104 → **105**。其余 ID 未增减。

## 三、免费 / 零消耗端点

| 端点 | 名称 | 上下文 | 可选档位 | 免费机制 | Deals 说明 |
|---|---|---|---|---|---|
| `stealth/glyph-cluster:free` | Glyph Cluster | 256K | low, medium, high, xhigh | 全部请求零消耗 | 每日上限 1,000 次请求「while the stealth preview lasts」 |
| `recursive/flint-v1.0:free` | Flint | 262K | _自动（未公布档位）_ | 全部请求零消耗 | 每日上限 1,000 次请求「while the free tier lasts」 |

> **当前在线免费端点共 2 款**，与 GOAT 页头 `Free 2` 一致。⚠️ **已退出（勿写进配置）**：`minimax/minimax-m3.1-flash:free`、`ornith/ornith-1.5-122b:free`、`stealth/cat-jam:free`、`stealth/pixel-canary`、`stealth/space-bunny-alpha`、`inclusionai/ling-3.0-flash-sante:free`、`inclusionai/ling-3.1-flash:free`（已转付费）。
> ⚠️ **Kimi K2 系列下线预告**：Kimi 官方定价页明示 **K2 系列将于 2026 年 12 月底下线**；CommandCode 目录内的 `Kimi-K2.7-Code` / `-Highspeed` / `Kimi-K2.6` / `Kimi-K2.5` 均属该系列，**长期配置应迁移至 K3 / K3.1 Pro**。
> ⚠️ **GLM-5.4 尚未进入 CommandCode**：智谱官方文档已上线 GLM-5.4（1M / 128K 输出，仅 GLM Coding Plan 用户可用，API 待安全评估），**CC 目录与网关均无该 ID**。

## 四、套餐矩阵与 API（2026-11-26 复核）

**Provider API 三协议齐备**（`https://api.commandcode.ai/provider/v1/`）：

| 端点 | 协议 | 说明 |
|---|---|---|
| `/v1/chat/completions` | OpenAI Chat Completions | 通用兼容 |
| `/v1/responses` | OpenAI Responses | 自 CLI 1.55.0 起支持；**与 OpenCode Go 的套餐 API 协议能力一致** |
| `/v1/messages` | Anthropic Messages | Claude 系与 Qwen / MiniMax 等 |
| `/v1/models` | 目录 | **11-26 返回 105 个 ID**（CLI 1.93.4 目录 105 款，**逐 ID 一致、差集 0**） |

**套餐矩阵（官方 Pricing & Limits 页，2026-11-26）**：

| 套餐 | 月费 | 月额度 | 5 小时窗口 | 每周窗口 | 官方请求量估算 | 最低可用模型层级 |
|---|---|---|---|---|---|---|
| **Go** | $1 | $10 credits | **$2** | **$5** | ~9K | Go（全部开源模型 + 部分 premium，逐模型额度） |
| **GOAT** | $10 | **Up to $100 usage** | **Up to $20** | **Up to $50** | ~75K | + GPT-5.6 Sol、Gemini 3.7/3.8 Flash、Muse Spark 1.2/1.3、Grok 4.6/4.7、Claude Sonnet 5.5 / Haiku 5.5 |
| **Pro** | $20 | **Up to $110 usage** | **Up to $22** | **Up to $55** | ~100K | + Claude Sonnet、GPT-5.4/5.5、Gemini 3.5/3.6 系、GPT-6 Sol、Gemini 4 Argon |
| **Max 10×** | $100 | $150 credits（premium $100 / standard $150 双池） | $45 | $90 | ~230K | + Claude Opus/Fable、GPT-6 Astra、GPT-6.1 Sol、Fugu Ultra、Muse Wonder |
| **Max 20×** | $200 | $300 credits（premium $200 / standard $300） | $90 | $180 | ~370K | 同上 |
| **Team Pro** | $40 | $40 credits | $12 | $24 | ~35K | 团队级共享池 |
| **Provider** | $15 | 按量付费（无月额度） | — | — | — | 全目录（Provider API 通道） |
| **Enterprise** | **$5,000+** | Custom | Custom | Custom | Custom | 自有基础设施部署；**不受滚动窗口约束** |

> **额度机制原文要点**：① 限额以 **credit value 计量，不是请求数**（"Limits are measured in credit value, not request count"）；② 两个滚动窗口从**首次使用起滚动**，非固定时钟；③ **滚动窗口只约束套餐内月度 credits**——按需（on-demand）credits 任何套餐都不受节流，免费/纯余额用量与 Enterprise 池也无窗口上限；④ 达窗口后可继续走按需 credits 或等窗口重置，**不会被硬停**；⑤ 超出额度后可在 Studio > Billing 按模型成本补买 credits，**credits 永不过期、可结转**。

> **Deals（Pricing & Limits 页 Deals 小节实列 8 条）**：
> **免费 2 条**：① `glyph-cluster:free`（**每日最多 1,000 次**，while the stealth preview lasts）；② `flint-v1.0:free`（**每日最多 1,000 次**，while the free tier lasts）——两者请求**不消耗额度**。
> **提额 6 条**：`deepseek-v4.1-flash`（**$10 Go / $100 GOAT / $110 Pro**）、`glm-5.3-flash`（**同上前三档，while capacity lasts**）、`ling-3.1-flash`（**$100 GOAT / $110 Pro**）、`ling-3.1-flash-1019`（**$100 GOAT / $110 Pro**）、`glm-5.3`（**$10 Go / $70 GOAT / $80 Pro**）、`minimax-m3`（**2× usage**）。
> ⚠️ **Deals 计数两页不一致**：GOAT 档位文档页头写 **Deals 3 / Free 2**，Pricing & Limits 页实列 **8 条**。**引用时须写明页源**，不可混用。

> **地理限制（官方 Geo model limits 表）**：**GPT-5.6 Luna（OpenAI）与 Gemini 3.7 / 3.8 Flash（Google）在中国大陆不可用**；被屏蔽时该模型对该区域不可调用，套餐内其余模型不受影响。
> **思考强度调节**：内置 `/effort [level]` + 全局 `effort` / 逐模型 `reasoningEffort`（low→max，**按模型支持**；不支持时提示 "effort isn't supported for that model"）。
> **Provider API 访问**：除 Command Code Go 计划外全部计划有 API 访问（Go 用 Key 调 Provider API 返回 403 `upgrade_required`）；Provider 套餐 $15/月 + **$1.01 卡费** PAYG 无加价、Deals 自动应用；模型命名 `provider/model-slug`（Claude 系无前缀）；流式 usage 自动回传；错误码含 403 `upgrade_required` 与 422 `cmd_zdr_no_providers`。

## 五、逐模型月额度（GOAT 计划页，2026-11-26）

> 单位美元，三张表合计 68 条；**逐模型额度共享同一套餐池，不可相加**。本表与上一节「Deals」的区别：Deals 是临时加成，本表是页面标称额度（已含 Deals 后的现值）。

| 月额度 | 模型 |
|---|---|
| **$100** | DeepSeek V4.1 Flash (latest)、GLM-5.3 Flash、Ling 3.1 Flash、Ling 3.1 Flash 1019 |
| **$70** | GLM-5.2、Tencent Hy3、Qwen 3.8 27B、GLM-5.3 |
| **$60** | DeepSeek V4 Flash (latest)、DeepSeek V4.1 Flash Fast (latest)、Kimi K2.7 Code |
| **$50** | LongCat 2.0 |
| **$47** | MiniMax M3 |
| **$40** | Gemini 3.8 Flash、Gemini 3.7 Flash |
| **$33** | Qwen 3.7 Max、Qwen 3.7 Plus、Qwen 3.6 Plus |
| **$20** | GPT-5.6 Sol、GPT-5.6 Luna、Qwen 3.8 Max、DeepSeek V4 Pro (latest)、Kimi K3.1 Pro、Kimi K3、Mistral Large 4、GPT-6 Luna、Qwen 3.8 Omni Flash、Qwen 3.8 Max Prime、Qwen 3.8 Max 0902、Tencent Hy4 Preview、Tencent Hy4、MiniMax M3.1 Flash、Ornith 1.5 122B、Qwen 3.8 Flash、GLM-5.3 FlashX、DeepSeek V4 Flash Vision (exp)、DeepSeek V4 Flash Fast、DeepSeek V4.1 Flash Ultrafast、Muse Ember、Muse Spark 1.3 / 1.2 / Open、Muse Spark 1.3 / 1.2 Contributor、Kimi K2.7 Code HighSpeed、Grok 4.5 / 4.6 / 4.7、GLM-5.2 Fast、Inkling / Inkling Small、MiMo V2.6 Pro / Flash、Step 5 Preview、Step 3.7 / 3.5 Flash、Nemotron 3 Ultra / 3.5 Super VL、Jev / Jev 1.14.0、Claude Haiku 5.5 |
| **$15** | Qwen 4 Max、Tencent Hy4 Flash、Inkling 2 Mini |
| **$10** | Claude Sonnet 5.5 |

> ⚠️ **DeepSeek 系分时价（GOAT 页内嵌 `timeOfDay` 字段）**：`DeepSeek V4.1 Flash (latest)`、`DeepSeek V4 Flash (latest)`、`DeepSeek V4 Flash Vision (exp)` 均为 **off-peak $0.15/$0.60，peak $0.30/$1.20（01–04 & 06–10 UTC，周一至周五，7h/day，17h/day 为 off-peak）**；`DeepSeek V4 Pro (latest)` 为 **off-peak $0.66/$1.98，peak $1.32/$3.96**（同一窗口）。**额度表内价均为 off-peak 标价**。

> **页头计数（11-26 实测，四套并存）**：GOAT 档位页 `/docs/plans/goat` = **GOAT plan 76 / All plans 107 / Deals 3 / Free 2**；Pricing & Limits 页 `/docs/resources/pricing-limits` 的 Deals 小节实列 **8 条**；**网关 API 105 = CLI 1.93.4 目录 105（差集 0）**。**四个数字互不相同，引用时必须标来源页/源**——`All plans 107` 含 Go 及以上套餐的重复计项，不等于在线端点数。

> **收录与退役口径**：**1.93.4 包内 CHANGELOG（3,821 行）只记功能与修复行**，`Kimi K3.1 Pro`、`GPT-6.1 Terra`、`ornith-1.5-122b`、`ling-3.1-flash-1019` 等均无增删条目——**版本号不可倒推上架时间**，一律以 `models.md` 实际存在为准。本期唯一净增为 `thinkingmachines/inkling-2-mini`。
