---
title: AI 大模型一周汇总
date: 2026-11-04
---

> 开源模型、融资、算力与政策的滚动窗口综述。数据抓取日 **2026-11-04**。

[← 返回「模型情报」合集](/model-intel/)

---

> 数据窗口：**2026-10-16 → 2026-11-04**（距上期 10-16 间隔 19 天，本期合并收录）。抓取时间：**2026-11-04**。
> 数据来源：科技日报、北京市科委 / 中关村管委会、北京市科委、财联社、证券时报、界面新闻、解放日报、IT之家、量子位、钛媒体、Reuters、Financial Times（经 CNA / 腾讯新闻 / 新浪财经转载）、the-decoder、aibriefs.news、newmarketpitch.com、Gitee 官方博客、hashnode、腾讯新闻、Supwil News Digest、Kimi 官方发布页与文档、DeepSeek 官方定价页、OpenCode 官方页与清单 API、CommandCode 官方页与 CLI、OpenRouter 模型与 endpoints API、各厂商官方定价页。
> 口径：模型价格均为**每百万 token 美元价**（除注明人民币者）；**折算汇率 1 USD = 6.7180 CNY**（中国外汇交易中心 2026-11-04 中间价，每轮重取）；涨跌配色**涨 = 红、跌 = 绿**（中国惯例）。
> ⚠️ 平台侧数字为本工作区 **2026-11-04 实测**，不沿用上期；OpenRouter 渠道价为抓取时刻快照，**不可跨日沿用**。

---

## 一、海外旗舰与新品（本期主线）

**1. 🔑 Kimi K3.1 Pro（10-24 发布）——全球最大开源模型，3 万亿级参数 + 1M 上下文**
K3.1 系列的第一个模型，也是月之暗面迄今**能力最强的 3 万亿级参数模型**（2.8T 总参 / 104B 激活 MoE），**1M token 上下文**，继续是**全球参数规模最大的开源模型**。**Artificial Analysis 智能指数 55 分列全球第 4、开源模型第一**（仅次于 Claude Opus 5.5 的 58）。**Terminal-Bench 4.0 得分 65.7%**，超 GPT-6 Astra（58.2%），与 Claude Opus 5.5（66.4%）仅微弱差距；**Kimi Code Bench 3.0 Long-horizon 61.2%**（K3 为 55.95%）。**API 定价 $2 / $10，为 GPT-6 Astra 的五分之一**。同步推出 **Kimi K3.1 Pro Highspeed**（同等智能、输出速度约 **2~3 倍**）。**完整模型权重于 11-04 前发布**——发布即通过 kimi.com、Kimi App、Kimi Work、Kimi Code 与 Kimi API 接入；新接入 **Gmail / Google Drive / Google Calendar**（安全 OAuth，可自动汇总邮件、检索文件、规划日程）。**长程编码与 3D 创作是主打**：官方演示用 Unreal Engine 5.8 + Blender 程序化建模 36M 三角面场景、用 Godot 4.7.2 构建 3D 动作游戏；金融方向在 **Office QA Pro v2 与 SpreadsheetBench v2 两项测评取得全球最佳**（超 Opus 5.5、Fable 5.1、GPT 6 Astra）。

**2. 🔑 Mistral 正式开放 Large 4 权重（10-30）——「Le Chonk」万亿参数**
**1 万亿总参 / 52B 激活**的原生多模态 MoE，**1M 上下文**，在欧洲训练，**可免费下载（商用需单独授权）**，号称最佳开放权重编程与防御性网络安全模型，**对恶意请求拒答率约 96.6%**。

**3. 🔑 DeepSeek V4.1-Flash-1017 开放权重——AA 智力指数升至 45 分，开放权重并列第 2**
较前版**升 6 分**；**Terminal-Bench 4.0 由 31.2 升至 42.3**、**DeepSWE 77.0**，超过 Opus 5（74.0）与 GPT-5.6 Sol。延续「低价 + 开源 + 开放权重」路线。同期 **Search & Fetch API 正式上线**（11-01 起计费，见第三节）。

**4. MiniMax M3.1 Flash 权重开放（10-23）——Agent 成本降约 70%**
约 **23B 激活**（MiniMax 口径总 428B、HF 计 220.5B）的开放权重多模态 MoE，**1M 上下文、五档推理常开**，输入 **$0.15/M**，**Agent 任务综合成本较前代下降约 70%**，**Automation-Bench v1.0.6 居首（62.2）**。同期推出 **Hailuo 2.3** 视频模型。

**5. OpenAI 时隔 6 年再开源推理模型**
**gpt-oss-120b / gpt-oss-20b**，**Apache 2.0**；120b 版本性能与 o4-mini 相当、可在**单张 H100** 运行，20b 版本**仅需 16GB 内存**（支持手机部署），支持配置推理投入、完整思维链与智能体能力。同日（10-29）**Pro 订阅 100 / 200 / 500 三档用量上限全部翻倍、价格不变**，部分档位另获 API 额度。同期公开 **722 篇**内部前沿模型数学研究手稿。

**6. DeepSeek 旧 ID 退役与 Search & Fetch 收费**
官方明示 `deepseek-v4-flash-vision-exp` 等旧 ID「仍被接受，但对应模型**已退役**，请求由 `DeepSeek-V4.1-Flash-1017` 服务并按 Flash 价计费」。**Search & Fetch API 正式上线**：Search / Fetch 均 **$0.75 / 1000 次成功请求**；经 DeepSeek Harness / Claude Code / Codex 的**服务端工具调用同样命中**——11-01 起的收费窗口已生效，重度工具调用的成本核算必须补上这一项。

## 二、国内动态

**1. 🔑 DeepSeek 第二轮融资约 1055 亿元人民币，投后估值约 6155 亿元（11-01 起媒体披露）**
近 **30 家**投资方；**腾讯、宁德时代仍为两大股东**；新进者含**长鑫存储与董事长朱小明、中芯国际**，以及 vivo、美的、立讯精密、吉利、携程、小红书等产业链；**中国移动 / 中国电信 / 中金 / 中信证券 / 国寿各投约 20~80 亿元**，**国家 AI 产业基金再直投约 10 亿元**。6 月首轮约 500 亿元，**累计融资已超 1500 亿元**。⚠️ 上述数字为媒体报道、**非公司确认**。

**2. 🔑 智谱 GLM 5.2 开源（7440 亿参数 MoE）**
**7440 亿总参 / 400 亿激活**，原生支持 **1M tokens** 超长上下文，**MIT 协议**允许企业完全私有化部署；提供 **BF16、FP8、Q4_K_M、UD-IQ2 四大量化版本**，可搭配 vLLM / SGLang 部署，适配 Hermes / OpenClaw 等智能体后端。

**3. 阿里 Qwen-AgentWorld——首个语言世界模型**
提供 **35B-A3B** 与 **397B-A17B** 两种规模，**单一模型覆盖 7 类环境**（MCP、Search、Terminal、SWE、Web、OS、Android），可实现跨领域知识迁移。在 **AgentWorldBench** 上，397B 版本整体模拟质量**超越 GPT-5.4、Claude Opus 4.8 与 Gemini 3.1 Pro**。

**4. 月之暗面与智谱的估值与收入对照**
月之暗面 **7 月完成融资估值 2300 亿元人民币**，Pre-IPO 洽谈中 **3300 亿元**；智谱**年化收入 18 亿美元**（年底指引 30 亿），高于 Kimi 与 DeepSeek 的各 10 亿美元，Kimi 目标为 20 亿美元。⚠️ 均为市场口径估算。

**5. 🔑 小米 MiMo-V2.5 系列于 2026-10-21 10:00（UTC+8）正式下线**
旧 ID 直接报错。**OpenRouter 侧 V2.5 系仍在转售存货**，但 **CommandCode 网关与 CLI 目录已于 10-23 双双移除**；Go 套餐的 docs 正文虽仍列该两款，**套餐 API 已不返回**——存量用完即止，新配置一律改 V2.6 系。

**6. 智谱港股剧烈波动（10-30 → 11-04）**
02513.HK 区间 **-8.68%、振幅 17.20%**，最低 421.00 / 最高 512.50 港元；**11-04 单日 +9.91% 收 485.80 港元**（成交额 33.16 亿港元）。同期 A 股「人工智能大模型」板块区间 +0.27%、「DeepSeek 概念股」+1.08%。

**7. 工具与 Agent 生态**
**OpenCoWork 1.0** —— 开源桌面多智能体协作平台，Agent 可直接进入本地工作区读取项目文件、执行 Shell、审阅 Git 变更、接入 MCP；支持会话级模型选择，**每日免费额度 MiniMax $10 / Kimi $5**。**Grok Build 0.2.60** 聚焦会话恢复、上下文压缩与 MCP 工具输出三大痛点。

## 三、产业、算力与安全

**1. 🔑🔑 英伟达「49% 算力红线」（11-03，FT 报道）——出口管制从「芯片跨境」延伸到「算力服务跨境」**
英伟达近期通过销售与各地区团队**口头**向全球数据中心与云计算客户传达：**未来新签算力服务合同中，至少 51% 的服务必须出售给非中国企业**，中国客户占比原则上压缩至 **49% 以内**。适用范围**覆盖全球、不限亚洲机房**，**仅约束未来新签合约、存量租赁不追溯**，且未提供书面文件。英伟达未直接确认该比例，对外表述强调「采用美国芯片建设的数据中心和云服务是美国模型与应用开发商参与全球竞争的重要基础」。政策评论者 Chris McGuire 批评该阈值——既然受管制芯片不能直接卖给中国企业，通过海外数据中心远程租用算力理应也不被允许，**合理阈值应是零**。

- **稀缺度定价**：一套 B300 机柜国际市场售价约 **60 万美元**，而 10 月中国非正式市场成交价高达 **1850 万元人民币**（约 280 万美元），**溢价约 4.67 倍**。
- **政策脉络连贯**：7 月起英伟达已通过新版「白名单」将获准采购 AI 芯片的亚洲客户数量**削减逾半**，重点审查专营 GPU 出租的云服务商（实地检查机房、核实合同、追踪最终用户）——**白名单收缩堵住采购端，49% 红线在租赁端收口**。
- **受压最直接的三类主体**：依赖海外算力租赁的中小 AI 公司（可用算力减少、价格与排队周期上升）、东南亚 / 中东的第三方算力服务商（新加坡机构称在美国以外难找足够非中国客户，或被迫缩减数据中心规模）、靠价差转租算力的中间商与转售渠道。已在海外自建集群的头部厂商受影响相对有限。
- ⚠️ **仍未明确**：51% / 49% 的统计口径（算力容量、GPU 卡时、营收还是客户数量）尚无统一标准，且因口头传达，各区域落地节奏可能存在差异。

**2. Saudi Aramco 收购 HUMAIN 49% 股权（11-01）**
PIF 保留 51%。Aramco 将于 2026 年投入约 **99 亿里亚尔（26 亿美元）现金**，并以 AI、算力与数字资产及人才出资。HUMAIN（2025 年 5 月成立）构建数据中心、高性能云与模型（含多模态阿拉伯语 LLM **ALLaM**）的全栈，计划 **2030 年前约 3GW** AI 数据中心产能。Aramco 称自 2023 年以来已实现约 **113 亿美元**「技术实现价值」。

**3. 四巨头共同支持 robots.txt 的 AI 训练偏好信号**
Google、Microsoft、OpenAI、Anthropic 共同支持经 **IETF AIPREF** 工作组推进的共享 `robots.txt` 策略 token（**`usage_ai-training`**），让站点一次性声明内容是否可用于基础生成模型训练。**Google** 称若站点使用该共享退出项且未单独指定 Google-Extended，将按 Google-Extended disallow 处理，**目标 2027 年支持**；**Microsoft** 计划 **2027-02-01** 起遵守新的训练 / grounding 偏好并逐步废止旧的 NoArchive / NoCache 语义；**OpenAI** 表示「未来数月内」落地。

**4. 基础模型公司估值榜（newmarketpitch，11-03 更新）**
Anthropic **$965B**、OpenAI **$852B** 领跑；**DeepSeek $85.0B~$105.0B**（按已披露融资倒算），**MoonshotAI $35.0B~$50.0B**；其后为 Safe Superintelligence $35~60B、PrometheusAI $39.0B~$43.0B、**ReflectionAI $26.0B~$30.0B**、Cohere $25.5B、MistralAI $24.4B~$26.0B、**TypeSafeAI（决策模型）$7.1B~$7.9B**、StepFun $5.8B~$7.2B。

## 四、平台与订阅侧（本工作区 11-04 实测）

**1. 🔑 OpenCode Go 新增第三档订阅：Go Teams（$20 / 成员 / 月）**
官方原话「Every member gets their own limits, **$5/month higher than Go on every model**」——**逐模型额度 = Go 档 + $5**（DeepSeek V4.1 Flash $100 → $105、GLM-5.3-Flash $60 → $65、Kimi K3 $15 → $20），**每成员独立计额**，是团队场景下比 Go Plus $40 更划算的选项。三档 Token 单价完全相同，Plus / Teams 买的是更高的额度上限。

**2. 🔑 Go 价目表新增两类分档**
① **上下文分段定价**——MiniMax M3（≤512K / >512K）、Qwen 3.7 Plus（≤256K / >256K）、Grok 4.7（≤200K / >200K）、GPT 6 Luna 与 GPT 5.6 Luna（≤272K / >272K）、Claude Haiku 5.5（≤100K / >100K）；② **分时价**——DeepSeek V4.1 Flash 与 V4 Pro 各拆 Off-Peak / Peak 两行（V4 Pro：off-peak $0.66/$1.98、peak $1.32/$3.96）。另 **Gemini 4 Argon 50% off**（$4→$2 / $20→$10 / $0.20→$0.10）。

**3. 清单规模（11-04 实测）**

| 平台 | 上期（10-16） | 本期（11-04） |
|---|---|---|
| OpenCode Go | 37 ID（正文 29 款） | **28 ID（正文 30 款）** |
| OpenCode Zen | 86 款 | **80 款**（9 款 `-free` + Big Pickle + 70 付费） |
| CommandCode 网关 | 92 款 | **96 款**（CLI **1.88.2** 目录 94，差集 2 款为网关独有） |
| OpenRouter 目录 | 465 款 | **455 款** |

- **Go 正文新增 3 款**：`kimi-k3.1-pro`、**`iceman-contributor-free`**、**`gemini-4-argon`**（原 `gemini-4-argon-contributor` 更名）；**LongCat 2.5 Preview Free 退出正文**。
- **Go 退出套餐 8 款**：`glm-5.1`、`grok-4.6`、`kimi-k2.6`、`minimax-m2.5`、`minimax-m2.7`、`omen-alpha`、`qwen3.6-plus`、`qwen3.7-max`。
- **CommandCode 新增 4 款**：`gpt-6.1-terra`、`inclusionai/ling-3.1-flash-1019`、`moonshotai/Kimi-K3.1-Pro`、`stealth/crouton-alpha`；**移除 4 款**：`minimax-m3.1-flash:free`、`ornith-1.5-122b:free`、`xiaomi/mimo-v2.5`、`xiaomi/mimo-v2.5-pro`。
- **Zen `-free` 新增 2 款**：`crouton-alpha-free`、`pulse-alpha-free`；**移除 3 款**：`jev-1.13-free`、`minimax-m3.1-flash-free`、`longcat-2.5-preview-free`。

**4. 额度调整**
- **OpenCode Go**：`deepseek-v4.1-flash` **$80 → $100**（Go 侧现行最高档，Plus $200）；`glm-5.3-flash` $60（Plus $180）；**新增 `kimi-k3.1-pro` $15**（Plus $60、Teams $20）。
- **CommandCode GOAT**：**`deepseek-v4.1-flash` 与 `glm-5.3-flash` 月度额度均升至 $100**；新增 **`ling-3.1-flash-1019` $100**、**`kimi-k3.1-pro` $20**。**Deals 5 条**（免费 4：laguna-s-2.1-free、glyph-cluster:free、crouton-alpha-free、beam:free；付费 1：minimax-m3 2× usage 50% off）。⚠️ **两平台的 `deepseek-v4.1-flash` 现同为 $100，但 `glm-5.3-flash` 仍不同（Go $60 vs GOAT $100）——不可混用同一数字**。

**5. 调用量榜（OpenCode Data，页面顶部"已更新 11月4日 GMT+8 14:32"）**
- 周榜：**`deepseek-v4.1-flash` 133T（+4%）登顶**；muse-spark-1.3-contributor 6.5T（-17%）、glm-5.3-flash 6.0T（-25%）、**`beam-1.0-501b-a23b` 5.5T（-6%，模型 ID 由 `beam` 改名）**、mimo-v2.6-flash 3.2T（-34%）；**`deepseek-v4.1-flash-1017-op` 1.1T 新上榜**；**`iceman-contributor` 640B（+729%）**、**`flint-40b` 606B（+146%）**、`minimax-m3.1-flash` 552B（**-93%**）、**`pulse-alpha` 444B 新上榜**。
- **市场份额（#market-share）**：**DeepSeek 85.1%**（6.7T）／Zhipu 3.4%／Other 3.1%／Meta 3.1%／**Reflection 2.4%（新进作者榜）**／Xiaomi 1.8%／NVIDIA 0.8%／**MiniMax 0.4%**／Meituan 0.0%。**StepFun 已退出当日作者榜**。
- **前 5 国家**：中国 209T **16%**、美国 151T **12%**、印度 73T **6%**、德国 56T **4%**、巴西 55T **4%**（第 15 位中国香港 24T 2%）。全站缓存比例 **97%**（已缓存 6.3T / 未缓存 180.8B）。

## 五、OpenRouter 渠道格局（11-04 endpoints 实测）

> 全部为 **2026-11-04 15:20 CST endpoints API 实测值**（每百万 token 美元价）；括号内为渠道数。

| 模型 | 渠道数 | 最低输入 | 最低输出 | 最低缓存读 |
| :--- | :--: | :--- | :--- | :--- |
| deepseek/deepseek-v4.1-flash | **40** | **$0.035**（Morph / Relace） | **$0.25**（Sail Research） | **$0.002**（CoreWeave） |
| deepseek/deepseek-v4.1-flash-1017 | **46** | **$0.025**（Particle AI flex） | **$0.15**（Sail Research） | **$0.0015**（Particle AI flex） |
| deepseek/deepseek-v4-pro | 15 | **$0.90**（Relace） | **$1.50**（Relace） | **$0.07961**（StreamLake，disc 0.451） |
| z-ai/glm-5.3 | 48 | **$0.0699**（Wafer us） | **$0.88**（Baidu，disc 0.8） | **$0.052**（Baidu，disc 0.8） |
| z-ai/glm-5.3-flash | 41 | **$0.0269**（Relace） | **$0.0996**（Relace） | **$0.012**（Darkbloom） |
| z-ai/glm-5.2 | 33 | **$0.006**（Wafer us） | **$1.40**（Morph） | **$0.005**（Wafer us） |
| moonshotai/kimi-k3 | 30 | **$0.19**（Relace） | **$8.94**（Relace） | **$0.13**（Wafer us） |
| moonshotai/kimi-k3.1-pro | 2 | $2（Moonshot 官方） | $10（Moonshot 官方） | $0.20（Moonshot 官方） |
| minimax/minimax-m3.1-flash | 13 | **$0.05**（Tenstorrent） | **$0.20**（Tenstorrent） | **$0.005**（Tenstorrent） |
| minimax/minimax-m3 | 13 | **$0.224**（DeepInfra flex） | **$0.88**（DeepInfra flex） | **$0.0448**（DeepInfra flex） |
| xiaomi/mimo-v2.6-flash | 7 | **$0.10**（Darkbloom） | **$0.224**（GMICloud，disc 0.2） | **$0.0024**（GMICloud，disc 0.2） |
| xiaomi/mimo-v2.6-pro | 4 | **$0.348**（GMICloud，disc 0.2） | **$0.696**（GMICloud，disc 0.2） | **$0.0032**（GMICloud，disc 0.2） |

- **输入端出现新低价段**：`glm-5.2` 最低输入 **$0.006**、缓存 **$0.005**（Wafer us，较官方 $1.4 / $0.26 低 99.6% / 98%）；`minimax-m3.1-flash` 的 **Tenstorrent $0.05 / $0.2 / $0.005 三项通吃**，是当前国产模型中单价最低的一档。
- **V4.1 Flash 缓存最低位易主**：**Baidu 的 -82.1% 折扣已退出该位**，改由**无折扣的 CoreWeave $0.002** 持有，缓存让利由 -64% 收窄至 **-33%**。
- **百度千帆折扣重新在架**：`glm-5.3` 以 **-80%** 重夺输出 + 缓存双最低位；`glm-5.2` 为 `fp8` -55.8% / `fast` -72.5%；`deepseek-v4-pro` 为 -47.1%。**折扣到期与回归双向可逆，不可跨期沿用。**
- **`kimi-k3.1-pro` 尚无第三方渠道**，OpenRouter 仅 Moonshot 官方 2 条记录（常规 $2/$10 与 highspeed $4/$20）——**无任何折让空间**。
- **V4 Pro 仍是唯一"第三方输入价也贵于官方"的模型**：输入最低 ¥6.05 比官方空闲 ¥4.50 **贵 34%**、缓存最低 ¥0.535 是官方 ¥0.15 的 **3.6 倍**，仅输出便宜 25% → **一律走官方直连**。
