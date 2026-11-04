---
title: "CommandCode 全模型推理档位速查"
author: "学姐大人"
date: 2026-11-04
categories:
  - "ai-model-intel"
tags:
  - "commandcode"
  - "推理档位"
  - "cli"
---

> 覆盖 **command-code 网关 Provider API 96 个端点** 与 **CLI 1.88.2 官方目录 94 款**（抓取日 **2026-11-04**）。
> ✅ **档位唯一口径 = CLI 包内 `models.md`**：在线 Provider API 只返回 ID / `context_length` / `supported_endpoints`，**不含价格与推理档位**。
> ⚠️ **两源差集 2 款**：`inclusionai/ling-3.1-flash-1019`、`stealth/crouton-alpha` **已在网关 API 上线，但 CLI 1.88.2 目录尚未收录**（档位与价格官方未公布）。**建档位以 CLI 为准，判可用以网关 API 为准**。
> **档位说明**：① `deepseek/*` 全线含 **`off`**（可关闭思考）；② `claude-*` / `gpt-*` 多为五档 `low, medium, high, xhigh, max`；③ `Qwen 3.8` 系为 `low, medium, xhigh`（**无 high**）；④ `zai-org/GLM-5.2` 仅 `high, max` 两档。
> 本文档为**当前状态速查**：档位、价格、套餐门槛全部取自 `command-code` **CLI 1.88.2** 包内官方目录与 Provider API（2026-11-04 抓取），不含历史版本对照。

## 数据源与刷新方法

| 数据 | 来源 | 说明 |
|---|---|---|
| 在线模型全名单（**96**） | `GET https://api.commandcode.ai/provider/v1/models` | 官方 Provider API，**2026-11-04 匿名抓取**；返回字段含 `context_length` / `supported_endpoints`，**不含价格与推理档位**；与 CLI 1.88.2 目录差集 2 款（`inclusionai/ling-3.1-flash-1019`、`stealth/crouton-alpha` 网关独有） |
| 推理能力 / 可选档位 / 网关价 / 套餐下限（**权威**） | `npm pack command-code@latest` → `package/dist/bundled/command-code-knowledge/reference/models.md` | CLI 官方模型目录，含 Id / Name / Context / **Efforts** / $每1M / **Min plan** / Best for；**版本 1.88.2，共 94 款（17,296 字节 / 134 行）** |
| 收录版本 / 退役事件 | 同上 → `package/CHANGELOG.md` | 各模型进入官方目录的 CLI 版本、以及退役公告（见第四节） |
| 档位口径（快照，已过时） | [`pi-commandcode-provider`](https://www.npmjs.com/package/pi-commandcode-provider) | 由旧版 CLI 生成的静态快照；滞后于 CLI，仅作对照，**禁止作为档位依据** |

**刷新方法**：重新执行
```bash
curl -s https://api.commandcode.ai/provider/v1/models          # 在线全模型名单（11-04 = 96 个 ID）
npm view command-code version                                   # CLI 最新版（11-04 = 1.88.2）
```
```bash
mkdir -p /tmp/cc && cd /tmp/cc && npm pack command-code@latest >/dev/null 2>&1
tar xzOf command-code-*.tgz package/dist/bundled/command-code-knowledge/reference/models.md > m.md
tar xzOf command-code-*.tgz package/CHANGELOG.md > c.md
```
> ⚠️ **沙箱注意**：包体约 4.2 MB（1.88.2 实测 4,185,427 字节）且解压后远超 /tmp 配额，**禁止 `tar xzf` 全量解压**（会报「设备上没有空间」）；必须用 `tar xzOf <tgz> <包内路径>` 直接流式取单个文件。先 `tar tzf | grep models.md` 确认路径。

**新模型核实要求**：先 diff Provider API 全名单与本文表内条目，新增端点**直接读 CLI 包内 `models.md` 取档位与价格**；**禁止按同族模型外推**。注意：**未列入下表档位列的模型，不代表不推理**——见第二节「自动档」。

<!-- more -->

---

## 一、支持可选推理档位（67 个）

档位值即网关上 `reasoning_effort` 参数接受的拼写（恒等直译）。**价格为 CLI 目录公开的 input/output · cache read（每 1M tokens）**。

| 模型 ID | 名称 | 上下文 | 可选推理档位 | 价格（in/out · cache） | Min plan |
|---|---|---|---|---|---|
| `claude-sonnet-5-5` | **Claude Sonnet 5.5** | 1,000,000 | low, medium, high, xhigh, max | **$2/$10 · $0.2（wr $2.5）** | **GOAT and above** |
| `claude-sonnet-5` | Claude Sonnet 5 | 1,000,000 | low, medium, high, xhigh, max | $2/$10 · $0.2（wr $2.5） | Pro and above |
| `claude-sonnet-4-6` | Claude Sonnet 4.6 | 1,000,000 | low, medium, high, xhigh, max | $3/$15 · $0.3（wr $3.75） | Pro and above |
| `claude-fable-5-1` | Claude Fable 5.1 | 1,000,000 | low, medium, high, xhigh, max | $10/$50 · $0.25（wr $12.5） | Max |
| `claude-fable-5` | Claude Fable 5 | 1,000,000 | low, medium, high, xhigh, max | $10/$50 · $1（wr $12.5） | Max |
| `claude-opus-5` | Claude Opus 5 | 1,000,000 | low, medium, high, xhigh, max | $5/$25 · $0.5（wr $6.25） | Max |
| `claude-opus-5-5` | Claude Opus 5.5 | 1,000,000 | low, medium, high, xhigh, max | $4/$20 · $0.2（wr $5） | Max |
| `claude-opus-4-8` | Claude Opus 4.8 | 1,000,000 | low, medium, high, xhigh, max | $5/$25 · $0.5（wr $6.25） | Max |
| `claude-opus-4-7` | Claude Opus 4.7 | 1,000,000 | low, medium, high, xhigh, max | $5/$25 · $0.5（wr $6.25） | Max |
| `deepseek/deepseek-v4.1-flash` | DeepSeek V4.1 Flash | 1,000,000 | off, low, high, max | $0.15/$0.6 · $0.003 | Go and above |
| `deepseek/deepseek-v4.1-flash-fast` | **DeepSeek V4.1 Flash Fast** | 1,000,000 | off, low, high, max | **$0.16/$0.58 · $0.016** | Go and above |
| `deepseek/deepseek-v4-pro` | DeepSeek V4 Pro (latest) | 1,000,000 | off, high, max | $0.66/$1.98 · $0.022 | Go and above |
| `deepseek/deepseek-v4-flash` | DeepSeek V4 Flash (latest) | 1,000,000 | off, high, max | $0.15/$0.6 · $0.003 | Go and above |
| `deepseek/deepseek-v4-flash-fast` | DeepSeek V4 Flash Fast | 1,000,000 | low, high, max | $0.28/$0.56 · $0.07 | Go and above |
| `deepseek/deepseek-v4-flash-vision-exp` | DeepSeek V4 Flash Vision (exp) | 1,000,000 | off, high, max | $0.15/$0.6 · $0.003 | Go and above |
| `moonshotai/Kimi-K3` | Kimi K3 | 1,000,000 | low, high, max | $3/$15 · $0.3 | Go and above |
| `moonshotai/Kimi-K3.1-Pro` | **Kimi K3.1 Pro** | 1,048,576 | low, high, max | $2/$10 · $0.2 | Go and above |
| `z-ai/glm-5.3-flashx` | GLM-5.3 FlashX | 1,000,000 | low, high, max | $0.37/$1.25 · $0.075 | Go and above |
| `z-ai/glm-5.3-flash` | GLM-5.3 Flash | 1,048,576 | low, high, max | $0.15/$0.5 · $0.03 | Go and above |
| `zai-org/GLM-5.3` | GLM-5.3 | 1,000,000 | low, high, max | $1.4/$4.4 · $0.26 | Go and above |
| `zai-org/GLM-5.2` | GLM-5.2 | 1,000,000 | high, max | $1.4/$4.4 · $0.26 | Go and above |
| `MiniMaxAI/MiniMax-M3` | MiniMax M3 | 1,000,000 | low, medium, high | $0.3/$1.2 · $0.06 | Go and above |
| `Qwen/Qwen3.8-Omni-Flash` | Qwen 3.8 Omni Flash | 1,000,000 | low, medium, xhigh | $0.15/$0.47 · $0.016 | Go and above |
| `Qwen/Qwen3.8-Max-0902` | Qwen 3.8 Max 0902 | 1,000,000 | low, medium, xhigh | $2/$6 · $0.25 | Go and above |
| `Qwen/Qwen3.8-Max` | Qwen 3.8 Max | 1,000,000 | low, medium, xhigh | $2/$6 · $0.25（wr $2.5） | Go and above |
| `Qwen/Qwen3.8-27B` | Qwen 3.8 27B | 262,144 | low, medium, xhigh | $0.4/$3 · $0.04 | Go and above |
| `Qwen/Qwen3.8-Flash` | Qwen 3.8 Flash | 1,000,000 | low, medium, xhigh | $0.16/$0.47 · $0.016 | Go and above |
| `tencent/hy4-preview` | Tencent Hy4 Preview | 1,048,576 | low, medium, high | $0.834/$2.501 · $0.042 | Go and above |
| `sakana/fugu-ultra` | Fugu Ultra | 1,000,000 | high, xhigh | $5/$30 · $0.5 | Max |
| `meta/muse-spark-1.3` | Muse Spark 1.3 | 1,048,576 | low, medium, high, xhigh, max | $1.25/$4.25 · $0.15 | GOAT and above |
| `meta/muse-spark-1.3-contributor` | Muse Spark 1.3 Contributor | 1,048,576 | low, medium, high, xhigh | $0.1/$0.2 · $0.002 | Go and above |
| `meta/muse-spark-1.2` | Muse Spark 1.2 | 1,048,576 | low, medium, high, xhigh | $1.25/$4.25 · $0.15 | GOAT and above |
| `meta/muse-spark-1.2-contributor` | Muse Spark 1.2 Contributor | 1,048,576 | low, medium, high, xhigh | $0.1/$0.2 · $0.002 | Go and above |
| `meta/muse-spark-1.1` | Muse Spark 1.1 | 1,048,576 | low, medium, high, xhigh | $1.25/$4.25 · $0.15 | Pro and above |
| `xai/grok-4.6` | Grok 4.6 | 500,000 | low, medium, high, xhigh | $2/$6 · $0.5 | GOAT and above |
| `xai/grok-4.7` | Grok 4.7 | 500,000 | low, medium, high, xhigh | $2/$6 · $0.5 | GOAT and above |
| `stepfun/Step-5-Preview` | Step 5 Preview | 1,000,000 | low, medium, high | $1/$2.7 · $0.05 | Go and above |
| `xai/grok-4.5` | Grok 4.5 | 500,000 | low, medium, high | $2/$6 · $0.5 | Go and above |
| `google/gemini-3.8-flash` | Gemini 3.8 Flash | 1,000,000 | low, medium, high | $1.5/$7.5 · $0.15 | GOAT and above |
| `google/gemini-3.7-flash` | Gemini 3.7 Flash | 1,048,576 | low, medium, high | $1.5/$7.5 · $0.15（wr $0.08334） | GOAT and above |
| `google/gemini-3.6-flash` | Gemini 3.6 Flash | 1,000,000 | low, medium, high | $1.5/$7.5 · $0.15 | Pro and above |
| `google/gemini-3.5-flash` | Gemini 3.5 Flash | 1,000,000 | low, medium, high | $1.5/$9 · $0.15 | Pro and above |
| `google/gemini-3.5-flash-lite` | Gemini 3.5 Flash Lite | 1,000,000 | low, medium, high | $0.3/$2.5 · $0.03 | Pro and above |
| `google/gemini-3.1-flash-lite` | Gemini 3.1 Flash Lite | 1,000,000 | low, medium, high | $0.25/$1.5 · $0.03 | Pro and above |
| `gpt-6-astra` | GPT-6 Astra | 1,050,000 | low, medium, high, xhigh, max | $10/$50 · $1（wr $12.5） | Max |
| `gpt-6.1-sol` | **GPT-6.1 Sol** | 1,050,000 | low, medium, high, xhigh, max | **$2/$10 · $0.1（wr $2.5）** | **Max** |
| `gpt-6.1-terra` | **GPT-6.1 Terra** | 1,050,000 | low, medium, high, xhigh, max | $1/$5 · $0.05（wr $1.25） | Pro and above |
| `gpt-6-sol` | GPT-6 Sol | 1,050,000 | low, medium, high, xhigh, max | $2/$10 · $0.2（wr $2.5） | Pro and above |
| `gpt-6-luna` | GPT-6 Luna | 1,050,000 | low, medium, high, xhigh, max | $0.1/$0.5 · $0.01（wr $0.125） | Go and above |
| `gpt-5.6-sol` | GPT-5.6 Sol | 1,050,000 | low, medium, high, xhigh, max | $5/$30 · $0.5（wr $6.25） | GOAT and above |
| `gpt-5.6-terra` | GPT-5.6 Terra | 1,050,000 | low, medium, high, xhigh, max | $2/$12 · $0.2（wr $2.5） | Pro and above |
| `gpt-5.6-luna` | GPT-5.6 Luna | 1,050,000 | low, medium, high, xhigh, max | $0.2/$1.2 · $0.02（wr $0.25） | Go and above |
| `gpt-5.5` | GPT-5.5 | 400,000 | low, medium, high, xhigh | $5/$30 · $0.5（wr $0） | Pro and above |
| `gpt-5.4` | GPT-5.4 | 400,000 | low, medium, high, xhigh | $2.5/$15 · $0.25（wr $0） | Pro and above |
| `gpt-5.4-mini` | GPT-5.4 Mini | 400,000 | low, medium, high | $0.75/$4.5 · $0.075（wr $0） | Pro and above |
| `gpt-5.3-codex` | GPT-5.3 Codex | 400,000 | low, medium, high, xhigh | $2/$8 · $0.5（wr $0） | Pro and above |
| `claude-haiku-5-5` | **Claude Haiku 5.5** | 1,000,000 | low, medium, high, xhigh, max | $0.1/$0.5 · $0.01（wr $0.125） | **GOAT and above** |
| `google/gemini-4-argon` | **Gemini 4 Argon** | 1,000,000 | low, medium, high | $2/$10 · $0.1 | **Pro and above** |
| `mistral/mistral-large-4` | **Mistral Large 4** | 524,288 | low, medium, high | $1.36/$4.18 · $0.14 | Go and above |
| `Qwen/Qwen3.8-Max-Prime` | **Qwen 3.8 Max Prime** | 1,000,000 | low, medium, xhigh | $4/$12 · $0.5（wr $5） | **GOAT and above** |
| `nvidia/nemotron-3.5-super-vl` | **Nemotron 3.5 Super VL** | 262,144 | low, medium, high | $0.2/$0.5 · $0.04 | Go and above |
| `inclusionai/ling-3.1-flash` | **Ling 3.1 Flash** | 262,144 | low, medium, high | $0.3/$0.9 · $0.06 | Go and above |
| `meta/muse-spark-open` | **Muse Spark Open** | 1,048,576 | low, medium, high | $1.25/$4.25 · $0.15 | Go and above |
| `meta/muse-wonder-1.0` | **Muse Wonder** | 1,048,576 | low, medium, high, xhigh | $4/$20 · $0.2 | **Max** |
| `stealth/glyph-cluster:free` | **Glyph Cluster** | 262,144 | low, medium, high, xhigh | $0/$0 · $0 | Go and above |
| `minimax/minimax-m3.1-flash` | **MiniMax M3.1 Flash** | 1,000,000 | low, medium, high, xhigh, max | $0.15/$0.6 · $0.015 | Go and above |
| `reflection/beam:free` | **Beam 1.0** | 1,050,000 | low, medium, high, xhigh, max | $0/$0 · $0 | Go and above |

## 二、会推理、深度由 CommandCode 自动选择（27 个）

模型支持推理，但官方 CLI catalog **未公布可选档位**（`Efforts` 列为 `—`），不发送 `reasoning_effort`（发送反而会被网关拒绝）。

| 模型 ID | 名称 | 上下文 | 可选推理档位 | 价格（in/out · cache） | Min plan |
|---|---|---|---|---|---|
| `claude-haiku-4-5-20251001` | Claude Haiku 4.5 | 200,000 | _自动（官方未公布档位）_ | $1/$5 · $0.1（wr $1.25） | Pro and above |
| `inclusionai/ling-3.1-flash-1019` | **Ling 3.1 Flash 1019** | 1,000,000 | _自动（官方未公布档位）_ | $0.3/$0.9 · $0.06 | Go and above |
| `stealth/crouton-alpha` | **Crouton Alpha** | 1,000,000 | _自动（官方未公布档位）_ | 免费（$0/$0） | Go and above |
| `MiniMaxAI/MiniMax-M2.7` | MiniMax M2.7 | — | _自动（官方未公布档位）_ | $0.3/$1.2 · $0.06 | Go and above |
| `MiniMaxAI/MiniMax-M2.5` | MiniMax M2.5 | 200,000 | _自动（官方未公布档位）_ | $0.3/$1.2 · $0.03 | Go and above |
| `moonshotai/Kimi-K2.7-Code` | Kimi K2.7 Code | 256,000 | _自动（官方未公布档位）_ | $0.95/$4 · $0.19 | Go and above |
| `moonshotai/Kimi-K2.7-Code-Highspeed` | Kimi K2.7 Code HighSpeed | 262,000 | _自动（官方未公布档位）_ | $1.9/$8 · $0.38 | Go and above |
| `moonshotai/Kimi-K2.6` | Kimi K2.6 | 256,000 | _自动（官方未公布档位）_ | $0.95/$4 · $0.16 | Go and above |
| `moonshotai/Kimi-K2.5` | Kimi K2.5 | 256,000 | _自动（官方未公布档位）_ | $0.6/$3 · $0.1 | Go and above |
| `zai-org/GLM-5.2-Fast` | GLM-5.2 Fast | 1,000,000 | _自动（官方未公布档位）_ | $3/$10.25 · $0.5 | Go and above |
| `zai-org/GLM-5.1` | GLM-5.1 | — | _自动（官方未公布档位）_ | $1.4/$4.4 · $0.26 | Go and above |
| `zai-org/GLM-5` | GLM-5 | 200,000 | _自动（官方未公布档位）_ | $1/$3.2 · $0.2 | Go and above |
| `xiaomi/mimo-v2.6-flash` | MiMo V2.6 Flash | 1,048,576 | _自动（官方未公布档位）_ | $0.14/$0.28 · $0.0028 | Go and above |
| `xiaomi/mimo-v2.6-pro` | MiMo V2.6 Pro | 1,048,576 | _自动（官方未公布档位）_ | $0.435/$0.87 · $0.0036 | Go and above |
| `xiaomi/mimo-v2.6-pro-ultraspeed` | MiMo V2.6 Pro UltraSpeed | 1,048,576 | _自动（官方未公布档位）_ | $4.35/$8.7 · $0.036 | GOAT and above |
| `Qwen/Qwen3.7-Max` | Qwen 3.7 Max | 1,000,000 | _自动（官方未公布档位）_ | $2.5/$7.5 · $0.5（wr $3.13） | Go and above |
| `Qwen/Qwen3.7-Plus` | Qwen 3.7 Plus | 1,000,000 | _自动（官方未公布档位）_ | $0.4/$1.6 · $0.08（wr $0.5） | Go and above |
| `Qwen/Qwen3.7-Flash` | Qwen 3.7 Flash | 1,000,000 | _自动（官方未公布档位）_ | $0.03/$0.13 · $0.006（wr $0.038） | Go and above |
| `Qwen/Qwen3.6-Max-Preview` | Qwen 3.6 Max Preview | — | _自动（官方未公布档位）_ | $1.3/$7.8 · $0.26（wr $1.63） | Go and above |
| `Qwen/Qwen3.6-Plus` | Qwen 3.6 Plus | — | _自动（官方未公布档位）_ | $0.5/$3 · $0.1 | Go and above |
| `meituan/LongCat-2.0` | LongCat 2.0 | 1,048,576 | _自动（官方未公布档位）_ | $0.3/$1.2 · $0.006 | Go and above |
| `stepfun/Step-3.7-Flash` | Step 3.7 Flash | 256,000 | _自动（官方未公布档位）_ | $0.2/$1.15 · $0.04 | Go and above |
| `stepfun/Step-3.5-Flash` | Step 3.5 Flash | 262,000 | _自动（官方未公布档位）_ | $0.09/$0.3 · $0.02 | Go and above |
| `tencent/hy3-paid` | Tencent Hy3 | 262,144 | _自动（官方未公布档位）_ | $0.14/$0.58 · $0.035 | Go and above |
| `nvidia/nemotron-3-ultra-550b-a55b` | Nemotron 3 Ultra | 1,000,000 | _自动（官方未公布档位）_ | $0.6/$2.4 · $0.12 | Go and above |
| `thinkingmachines/inkling` | Inkling | 256,000 | _自动（官方未公布档位）_ | $1/$4.05 · $0.17 | Go and above |
| `thinkingmachines/inkling-small` | Inkling Small | 1,000,000 | _自动（官方未公布档位）_ | $0.5/$1.2 · $0.1 | Go and above |
| `poolside/laguna-s-2.1-free` | Laguna S 2.1 | 256,000 | _自动（官方未公布档位）_ | 免费（$0/$0） | Go and above |
| `ornith/ornith-1.5-122b` | **Ornith 1.5 122B** | 262,144 | _自动（官方未公布档位）_ | $0.16/$0.64 · $0.02 | Go and above |

> 计数核对：**67 + 27 = 94**，与 CLI **1.88.2** 官方目录 94 款一致（`Efforts` 列非 `—` 者 67 款、为 `—` 者 27 款）；**Provider API 实测 96 个 ID**，差集为上述 2 款网关独有端点（CLI 目录未收录）。
> ⚠️ **本表分档一律以 CLI `Efforts` 列为准**：在线免费端点中，`glyph-cluster:free`、`reflection/beam:free` 官方公布了可选档位；`poolside/laguna-s-2.1-free` 未公布档位（列于本节）。

## 三、免费 / 零消耗端点

| 端点 | 名称 | 上下文 | 可选档位 | 免费机制 | Deals 说明 | 10-23 状态 |
|---|---|---|---|---|---|---|
| `poolside/laguna-s-2.1-free` | Laguna S 2.1 | 256K | _自动（未公布档位）_ | 全部请求零消耗 | 「while capacity lasts」 | ✅ API 在线 |
| `stealth/glyph-cluster:free` | Glyph Cluster | 256K | low, medium, high, xhigh | 全部请求零消耗 | 每日上限 100 次请求「while the stealth preview lasts」 | ✅ API 在线 |
| **`reflection/beam:free`** | **Beam 1.0** | **1.05M** | **low, medium, high, xhigh, max** | **全部请求零消耗** | **无每日请求上限「while capacity lasts」** | ✅ API 在线（CLI 1.85.0 起收录） |
| **`stealth/crouton-alpha`** | **Crouton Alpha** | **1M** | **_未公布_** | **全部请求零消耗** | **无每日请求上限「while the stealth preview lasts」** | ✅ API 在线（CLI 目录未收录） |

> **当前在线免费端点共 4 款**（Laguna S 2.1 + Glyph Cluster + Beam 1.0 + **Crouton Alpha**）；**GOAT 计划页页头计数 Free 4 与此一致**。
> ⚠️ **已退出免费清单（切勿再写进配置）**：**`minimax/minimax-m3.1-flash:free`**（限时免费已结束，已自网关 API 与 CLI 1.87.3 目录移除；付费 slug `minimax/minimax-m3.1-flash` 仍在）、**`ornith/ornith-1.5-122b:free`**（免费截止 2026-10-21 23:00 PT，已自网关 API 与 CLI 目录移除；付费 slug `ornith/ornith-1.5-122b` 仍在）、**`stealth/cat-jam:free`**（已下架）、`stealth/pixel-canary`（2026-09-30 退役）、`stealth/space-bunny-alpha`（已自网关 API 与 CLI 目录移除）、`inclusionai/ling-3.0-flash-sante:free`（已移除）、`inclusionai/ling-3.1-flash:free`（**已转付费 ID `ling-3.1-flash`**，$0.3/$0.9 · $0.06，含 GOAT $100 / Pro $110 加成额度）。OpenCode **Zen 侧的 `ling-3.0-flash-fin-free` 与 OpenRouter 侧同名系列不受此影响（各自独立清单）**。

## 四、最新收录 / 退役端点档位（CLI 1.88.2 官方目录）

来源：`command-code` **CLI 1.88.2** 包内 `dist/bundled/command-code-knowledge/reference/models.md`；「最早收录版本」由同包 `CHANGELOG.md` 逐条反查（取**最早出现该模型的版本号**），**不是改动记录**。

| 模型 ID | 名称 | 上下文 | 可选推理档位 | 网关价（in/out · cache读） | 最低套餐 | CLI 最早收录 |
|---|---|---|---|---|---|---|
| `moonshotai/Kimi-K3.1-Pro` | **Kimi K3.1 Pro** | 1.05M | low, high, max | $2/$10 · $0.2 | Go and above | **1.88.0** |
| `gpt-6.1-terra` | **GPT-6.1 Terra** | 1.05M | low, medium, high, xhigh, max | $1/$5 · $0.05（wr $1.25） | Pro and above | **1.88.0** |
| `inclusionai/ling-3.1-flash-1019` | **Ling 3.1 Flash 1019**（网关已上线，**CLI 目录未收录**） | 1M | — | $0.3/$0.9 · $0.06 | Go and above | — |
| `stealth/crouton-alpha` | **Crouton Alpha**（stealth 免费端点，**CLI 目录未收录**） | 1M | — | 免费（$0/$0） | Go and above | — |
| `ornith/ornith-1.5-122b` | **Ornith 1.5 122B**（限时免费档 `:free` 免费期已结束，已自目录移除） | 262K | — | $0.16/$0.64 · $0.02 | Go and above | **1.86.0** |
| `minimax/minimax-m3.1-flash` | **MiniMax M3.1 Flash**（限时免费档 `:free` 已自目录移除） | 1M | low, medium, high, xhigh, max | $0.15/$0.6 · $0.015 | Go and above | **1.85.0** |
| `reflection/beam:free` | **Beam 1.0** | 1.05M | low, medium, high, xhigh, max | 免费（$0/$0） | Go and above | **1.85.0** |
| ~~`stealth/cat-jam:free`~~ | Cat Jam（**已下架并自目录移除**） | 1.05M | low, medium, high, xhigh, max | 免费（$0/$0） | — | 1.84.0 尚在目录 → **1.85.0 目录移除** |
| `gpt-6.1-sol` | **GPT-6.1 Sol** | 1.05M | low, medium, high, xhigh, max | $2/$10 · $0.1（wr $2.5） | **Max** | **1.71.0** |
| `inclusionai/ling-3.1-flash` | **Ling 3.1 Flash**（原 `:free`，**已转付费**） | 262K | low, medium, high | $0.3/$0.9 · $0.06 | Go and above | **1.70.0** |
| `claude-sonnet-5-5` | **Claude Sonnet 5.5** | 1M | low, medium, high, xhigh, max | $2/$10 · $0.2（wr $2.5） | **GOAT and above** | **1.68.0** |
| `deepseek/deepseek-v4.1-flash-fast` | DeepSeek V4.1 Flash Fast | 1M | low, high, max | $0.16/$0.58 · $0.016 | Go and above | **1.67.0** |
| ~~`stealth/pixel-canary`~~ | Pixel Canary（**已退役并自目录移除**） | 262K | low, medium, xhigh | 免费（$0/$0） | — | 1.66.0 收录 → **1.73.1 公告退役 → 1.74.1 目录移除** |
| ~~`stealth/space-bunny-alpha`~~ | Space Bunny Alpha（**已下架并自目录移除**） | 1M | low, medium, high, max | 免费（$0/$0） | — | 1.65.0 收录 → **已自目录移除** |
| ~~`inclusionai/ling-3.0-flash-sante:free`~~ | Ling 3.0 Flash Sante（**已移除**） | 262K | 未公布 | 免费（$0/$0） | — | 早期收录 → **已自目录移除** |
| `typesafe / Jev` | Jev | 32K | — | $0.042/$0.00 · $0.00 | Go and above | 1.62.1（`typesafe/jev` 支持 headless + Provider API） |
| `xiaomi/mimo-v2.6-*` | MiMo V2.6 系列 | 1.05M | — / 见正文 | $0.14/$0.28 ～ $4.35/$8.7 | Go / GOAT and above | 1.62.0 |
| `stepfun/Step-5-Preview` | Step 5 Preview | 1M | low, medium, high | $1/$2.7 · $0.05 | Go and above | 1.60.0 |
| `xai/grok-4.7` | Grok 4.7 | 500K | low, medium, high, xhigh | $2/$6 · $0.5 | GOAT and above | 1.59.0 |
| `deepseek/*` 全线 | DeepSeek 系列含 **`off`** 档（可关闭思考） | — | + `off` | — | Go and above | 1.73.3 |
| CLI 能力 | **`cmd acp`**（ACP Agent，可接入 Zed 等 ACP 客户端）+ 内置 `/acp` mod | — | — | — | — | 1.74.0 |
| `meituan/LongCat-2.0` | LongCat 2.0 | 1.05M | _自动_ | $0.3/$1.2 · $0.006 | Go and above | 1.42.0（免费）→ **1.58.0 转付费** |
| `z-ai/glm-5.3-flashx` | GLM-5.3 FlashX | 1M | low, high, max | $0.37/$1.25 · $0.075 | Go and above | 1.56.2 |
| `Qwen/Qwen3.8-Omni-Flash` | Qwen 3.8 Omni Flash | 1M | low, medium, xhigh | $0.15/$0.47 · $0.016 | Go and above | 1.56.0 |
| `deepseek/deepseek-v4.1-flash` | DeepSeek V4.1 Flash | 1M | low, high, max | $0.15/$0.6 · $0.003 | Go and above | 1.51.0（Beta） |
| `gpt-6-astra` | GPT-6 Astra | 1.05M | low, medium, high, xhigh, max | $10/$50 · $1（wr $12.5） | Max | 1.49.0 |
| `deepseek/deepseek-v4-flash-fast` | DeepSeek V4 Flash Fast | 1M | low, high, max | $0.28/$0.56 · $0.07 | Go and above | CHANGELOG **未单列**（仅见于目录 `models.md`） |

> **收录版本口径**：表内版本号为 CHANGELOG 中**最早出现该模型的条目**。⚠️ CHANGELOG 只记 feature 行，**未单列的模型不得倒推版本**（如 `deepseek-v4-flash-fast`）。**当前 CLI 1.88.2，官方目录共 94 款**；Provider API 在线 96 端点，差集 2 款为网关独有的 `inclusionai/ling-3.1-flash-1019`、`stealth/crouton-alpha`（CLI 目录未收录）。1.85.0 **新增 Beam 1.0 free 与 MiniMax M3.1 Flash（含限时免费档），同版移除 `stealth/cat-jam:free`**；1.86.0 **新增 Ornith 1.5 122B（含限时免费档）**；1.87.x 为功能与修复版（`/btw` 侧问指令、permission mode aliases、BYOK 包更新）；**1.88.0 起新增 Kimi K3.1 Pro 与 GPT-6.1 Terra，同版移除 MiniMax M3.1 Flash 与 Ornith 1.5 122B 两个限时免费档及 `xiaomi/mimo-v2.5` 系（目录 96 → 94 款）**；1.88.0–1.88.2 另有后台任务改用免费模型、更新器改进与安装目录替换不中断会话等修复。

> **档位口径补充**：① `Min plan = Go and above` 指 **Command Code 自家 Go 档（$1/月）**即可用（GOAT/Pro/Max 同样可用）——与本报告另一处「GOAT 独占」（指 OpenCode Go 未上架）口径不同，勿混用；② CLI 目录同时给出全部 94 款的网关价与套餐下限，**可作 [OpenCode Go vs CommandCode GOAT 对比](/2026/11/04/opencode-go-vs-commandcode-goat/) 与价格对比文档的价格交叉校验源**；③ **未公布档位 ≠ 不推理**，只是不让调用方指定 `reasoning_effort`；④ CLI 目录末注原文：「Rates are the advertised price list resolved from the billing source of truth (**promos are already baked in**)」——**表内价格已含 Deals 折后价**。

## 五、CommandCode 套餐矩阵与 API（11-04 复核）

**Provider API 三协议齐备**（`https://api.commandcode.ai/provider/v1/`）：

| 端点 | 协议 | 说明 |
|---|---|---|
| `/v1/chat/completions` | OpenAI Chat Completions | 通用兼容 |
| `/v1/responses` | OpenAI Responses | 自 CLI 1.55.0 起支持；**与 OpenCode Go 的套餐 API 协议能力一致** |
| `/v1/messages` | Anthropic Messages | Claude 系与 Qwen / MiniMax 等 |
| `/v1/models` | 目录 | **11-04 返回 96 个 ID**（CLI 1.88.2 目录 94 款，差集 2 款为网关独有的 `ling-3.1-flash-1019`、`crouton-alpha`） |

**套餐矩阵（11-04，官方 Pricing & Limits 页）**：

| 套餐 | 月费 | 月额度 | 5 小时窗口 | 每周窗口 | 官方请求量估算 | 最低可用模型层级 |
|---|---|---|---|---|---|---|
| **Go** | $1 | $10 credits | **$2** | **$5** | ~9K | Go（全部开源模型 + 部分 premium，逐模型额度） |
| **GOAT** | $10 | **$70 usage** | $14 | $35 | ~75K | + GPT-5.6 Sol、Gemini 3.7/3.8 Flash、Muse Spark 1.2/1.3、Grok 4.6/4.7、Claude Sonnet 5.5 / Haiku 5.5 |
| **Pro** | $20 | **$80 usage** | $16 | $40 | ~100K | + Claude Sonnet、GPT-5.4/5.5、Gemini 3.5/3.6 系、GPT-6 Sol、Gemini 4 Argon |
| **Max 10×** | $100 | $150 credits（premium $100 / standard $150 双池） | $45 | $90 | ~230K | + Claude Opus/Fable、GPT-6 Astra、GPT-6.1 Sol、Fugu Ultra、Muse Wonder |
| **Max 20×** | $200 | $300 credits（premium $200 / standard $300） | $90 | $180 | ~370K | 同上 |
| **Team Pro** | $40 | $40 credits | $12 | $24 | ~35K | 团队级共享池 |
| **Provider** | $15 | 按量付费（无月额度） | — | — | — | 全目录（Provider API 通道） |
| **Enterprise** | **$5,000+** | Custom | — | — | Custom | 自有基础设施部署；**不受滚动窗口约束** |

> **额度机制原文要点**：① 限额以 **credit value 计量，不是请求数**（"Limits are measured in credit value, not request count"）；② 两个滚动窗口从**首次使用起滚动**，非固定时钟；③ **滚动窗口只约束套餐内月度 credits**——按需（on-demand）credits 任何套餐都不受节流，免费/纯余额用量与 Enterprise 池也无窗口上限；④ 达窗口后可继续走按需 credits 或等窗口重置，**不会被硬停**；⑤ 超出额度后可在 Studio > Billing 按模型成本补买 credits，**credits 永不过期、可结转**。

> **Deals（11-04，GOAT 计划页内嵌数据；页头计数 Deals 5 / Free 4）**：
> 1. **`laguna-s-2.1-free` free** —— 「while capacity lasts」；
> 2. **`glyph-cluster:free` free** —— 每日上限 100 次请求「while the stealth preview lasts」；
> 3. **`crouton-alpha-free` free** —— 「while the stealth preview lasts」；
> 4. **`beam:free` free** —— **无每日请求上限**「while capacity lasts」；
> 5. **`minimax-m3` 2× usage**（50% off） —— 每份 credit 用得更久（目录价 $0.30/$1.20 · $0.06）。
>
> **额度加成 Deals**：GOAT 页内嵌 `creditDeal` 字段当前**无 `liveAtBuild=true` 的条目**——`deepseek-v4.1-flash` 的 $100 促销（through Oct 21st）与 `mistral-large-4` 的 $40 促销（through Oct 20th）均已到期，**现行额度分别转为常态 $100 与 $20**。
>
> ⚠️ **已退出 Deals 清单（切勿再写进配置）**：`minimax-m3.1-flash:free` 与 `ornith-1.5-122b:free`（限时免费结束，已自网关与 CLI 目录移除）、`mimo-v2.5` / `mimo-v2.5-pro` up to 99% off（已自网关 API 与 CLI 目录移除）、`jev-free`（免费期已于 2026-09-24 结束）。`kimi-k3` 额度加成已于 2026-10-07 到期（GOAT 由 $60 回落 $20）；`grok-4.7` 40% off 已到期；`GPT-6 Luna` 的 $0.10/$0.50 已成为常规目录价。

> **地理限制（官方 Geo model limits 表）**：**GPT-5.6 Luna（OpenAI）、Gemini 3.7 Flash 与 Gemini 3.8 Flash（Google）在中国大陆不可用**；被屏蔽时该模型对该区域不可调用，套餐内其余模型不受影响。

"> **逐模型月额度实测（11-04，GOAT 计划页额度表三张共 60 条，单位 $）**：
> **$100** DeepSeek V4.1 Flash (latest)、**GLM-5.3 Flash**、Ling 3.1 Flash、**Ling 3.1 Flash 1019**｜
> **$70** GLM-5.2、Tencent Hy3、Qwen 3.8 27B｜
> **$60** DeepSeek V4 Flash (latest)、DeepSeek V4.1 Flash Fast (latest)、Kimi K2.7 Code｜
> **$50** LongCat 2.0｜
> **$47** MiniMax M3｜
> **$40** Gemini 3.8 Flash、Gemini 3.7 Flash｜
> **$33** Qwen 3.7 Max、Qwen 3.7 Plus、Qwen 3.6 Plus｜
> **$20**（起步档）DeepSeek V4 Pro (latest)、Kimi K3.1 Pro、Kimi K3、GPT-5.6 Sol、GPT-5.6 Luna、GPT-6 Luna、Qwen 3.8 Max / Max 0902 / Max Prime / Omni Flash / 3.8 Flash、Tencent Hy4 Preview、GLM-5.3、GLM-5.3 FlashX、GLM-5.2 Fast、DS V4 Flash Vision (exp)、DS V4 Flash Fast、MiMo V2.6 Flash / V2.6 Pro、Muse Spark 1.2 / 1.2 Contributor / 1.3 / 1.3 Contributor / Open、Kimi K2.7 Code HighSpeed、Grok 4.5 / 4.6 / 4.7、Step 5 Preview、Step 3.7 / 3.5 Flash、Inkling / Inkling Small、Nemotron 3 Ultra / 3.5 Super VL、Jev / Jev 1.14.0、Claude Haiku 5.5、Mistral Large 4、MiniMax M3.1 Flash、Ornith 1.5 122B｜
> **$10** MiMo V2.6 Pro UltraSpeed、Claude Sonnet 5.5。

> ⚠️ **DeepSeek 系分时价（GOAT 页内嵌 `timeOfDay` 字段）**：`DeepSeek V4.1 Flash (latest)`、`DeepSeek V4 Flash (latest)`、`DeepSeek V4 Flash Vision (exp)` 均为 **off-peak $0.15/$0.60，peak $0.30/$1.20（01–04 & 06–10 UTC，周一至周五，7h/day，17h/day 为 off-peak）**；`DeepSeek V4 Pro (latest)` 为 **off-peak $0.66/$1.98，peak $1.32/$3.96**（同一窗口）。**额度表内价均为 off-peak 标价**。

> **页头计数（11-04）**：GOAT 页 **GOAT plan 72 款 / All plans 98 / Deals 5 / Free 4**；Pricing & Limits 页 **All 102 / Free 6**——**两页互相不一致**（Pricing & Limits 页计数滞后），且与网关 API 96、CLI 1.88.2 目录 94 均不同，属页面计数口径差异，引用时须标来源页。
