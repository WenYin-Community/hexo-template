---
title: "AI 辅助开发踩坑录：跨项目反复出现的 10 类问题"
author: "学姐大人"
date: 2026-06-26
categories:
  - "开发工具"
tags:
  - "ai"
  - "coding-assistant"
  - "pitfalls"
  - "engineering-practices"
  - "code-review"
---

在多项目、长时间使用 AI 编程助手协作开发的过程中，一些**同类型的坑反复出现**——它们跨越技术栈与业务领域，几乎每个项目都要踩一遍。本文汇总其中最高频的 10 类问题，附具体现象、根因与修复方法。

<!-- more -->

## 一、`pkill -f` 会杀掉执行它的 shell 自身

**现象**：执行重启服务的命令后"没有任何输出"，命令像是被中断了，很容易误判为服务本身的问题。

**根因**：`pkill -f "node dist/main.js"` 会匹配**所有命令行字符串包含该模式的进程**——包括执行这条 pkill 的 shell 自己（它的命令行里就含有这个字符串）。

**正确做法**：

```bash
# 方法一：方括号技巧，让模式匹配不到自身
pkill -f "[n]ode dist/main.js"

# 方法二：按端口找 PID
ss -lptn 'sport = :3000'

# 方法三：pkill 与启动命令分两条执行
```

这个坑在至少 8 个不同项目的备忘里出现过，属于"最简单也最容易重复踩"的一类。

## 二、时间与时区处理

三个方向都出过问题：

1. **`toISOString()` 是 UTC 时间**：东八区凌晨 0–8 点执行时，日期会比本地"差一天"——单据日期、打卡记录、编号年月全部受影响；
2. **字符串比较 `' ' < 'T'` 是系统性问题**：`2026-08-30T...`（ISO 格式）与 `2026-08-30 ...`（SQLite datetime 格式）直接做字符串比较，两个方向都会错——曾导致登录限流闸永远查不到记录、订单归因静默丢单、逾期预警提前误报；
3. **`date(completed_at)` 按 UTC 切天**：北京 00:00–08:00 的完工被算进前一天，计件工资统计错位。

**统一方案**：所有业务时间处理走本地时区格式化函数（如 `todayLocal()`），或改用毫秒时间戳比较：

```js
// 统一为同一种字符串格式再比较
const toLocal = (d) => new Date(d).toISOString().slice(0, 19).replace('T', ' ');
```

## 三、批量替换 / 正则改写必须回头验证

批量文本替换的"静默失败"和"误伤"是两个方向的坑：

- 批量 `sed` 把 helper 函数自身的实现替换成了对自身的调用 → **无限递归**（`RangeError: Maximum call stack size exceeded`），112 处建表函数全部失效；
- Python 批量替换因缩进不匹配（4 空格 vs 8 空格）**静默失败**，残留语法错误还照样提交；
- 文本替换误吞相邻行，把 `const status`、函数声明整行弄丢。

**做法**：

1. 用**带断言的替换**（匹配失败立即报错，而不是静默跳过）；
2. 替换后**读回整个文件校验**；
3. 特别检查 helper 自身是否被波及。

## 四、静默失败比报错更危险

- `ValidationPipe({ whitelist: true })` 会把**未挂 class-validator 装饰器的字段静默剔除**——筛选参数、查询条件全部失效，接口不报错但结果不对；
- 前端 `catch(() => null)` 把接口错误吞成 null，UI 照常渲染（错误被完全掩盖）；
- `saveChatMessage` 不检查 `response.ok`，落库失败静默发生，刷新即丢；
- 小程序 toast 与 loading 共享原生气泡，批量上传中的失败提示被立即覆盖，用户完全无感知。

**原则**：凡是"失败后继续跑"的代码路径，必须有明确的错误信号（日志 / 状态返回 / UI 提示），宁可报错也不要静默。

## 五、"构建通过 / URL 可达"不等于功能可用

- 自动化页面走查若只断言 URL 与"无横向溢出"，**白屏页也会全部通过**；
- 构建产物未设置生产环境标识时，打出来的是 Preview 身份、连的是测试后端；
- `vite build` 不会覆盖**未注册路由**的新页面——页面存在但构建图中没有它。

**做法**：断言页面**内容**而非 URL；用真实浏览器验证"能不能用"，而不是"能不能打开"。

## 六、开发环境缓存造成的假象

- `vite` dev server 加载缓存旧模块，源码已改但页面不生效（重启 dev server 解决）；
- 浏览器磁盘缓存旧 JS：`?v=2` 只作用在 HTML 上，`<script src>` 相对路径不带 query → 换端口（新 origin）才生效；
- Prisma 改 schema 后未 `generate` 就 build，报错信息与真实原因完全不匹配。

**记忆点**：改了没生效 → 先怀疑缓存，再怀疑代码。

## 七、npm 新安装脚本安全策略

较新的 npm 默认**拦截依赖的 install/postinstall 脚本**：

```bash
# 单包放行（包名作为位置参数放在前面）
npm install -g --allow-scripts=<package>

# 常驻白名单（注意：是白名单，会拦掉其他包）
# ~/.npmrc
allow-scripts=<package>
```

注意 `~/.npmrc` 的 `allow-scripts=` 是**白名单**语义——写了 A 包，B 包的安装脚本也会被拦（bcrypt / esbuild / prisma 都受影响）。常驻方案建议只放行确实需要的单个包。

## 八、数据库层高频陷阱

- **Decimal 序列化成字符串**：`1200` 变成 `"1200.00"`，前端数字输入组件与算术全部出错；
- **`COUNT(*)` 返回 BigInt**：JSON 序列化直接崩溃；
- **MySQL 列名大小写不敏感**：`userId` 与 `userid` 同时出现即报重复列，迁移中途失败；
- **`varchar(191)` 存不下富文本**：公告/公文正文会超长被拒，且 TEXT 列不能有默认值。

**做法**：金额字段在序列化层统一还原为数字；COUNT 结果显式转 Number；命名规范里提前规避大小写歧义；富文本列从一开始就上 TEXT。

## 九、卸载 agent 插件后的连锁失效

卸载一个提供 `orchestrator` 的 agent 插件（oh-my-opencode-slim）后，主程序直接不可用：

- **`Agent not found: "build"`**：插件删了，但四个内置 agent 仍是 `disable: true`，没有任何东西再提供 `orchestrator`——必须手动启用 `build/explore/general/plan`；
- **默认模型指向已不存在的模型**：`model` 写的是插件提供的 `magpie/deveco-code/GLM-5.3`，启动时被自动移除，字段变空——要同步改成仍存在的 provider/model；
- **卸载范围远不止插件注册**：npm 缓存（本例 335M）、`~/.cache`、`~/.local/share`、opencode storage、技能目录、shell rc 里的环境变量段落，逐项清理后全盘 `*插件名*` 扫描确认；
- **技能市场检索是字面/弱语义匹配**：搜 `goal` 返回 344 条无关结果，搜「持续运行」多是监控类——要换 `goal-driven`、`autonomous loop agent`、`long running task` 这类英文功能词；
- **装完的技能不能直接用**：`references/goals.md` 全是占位示例，必须先替换成真实目标，否则拆出来的任务是错的。

**做法**：卸载「提供核心能力的插件」前，先确认主程序的内置能力是否被禁用、默认配置是否指向插件；卸载后跑一次最小可用性验证（`debug agents` + 一条真实请求）。

## 十、给 agent 加「全局提示词」时的框架约束

想给一个 agent 框架（picoclaw）接入另一套提示词体系（dsh-purge），评估下来发现：**能接的是「内容」，接不了的是「机制」**。

- **hook 改 system prompt 会被指纹比对回滚**：框架在每轮请求前校验 system message 指纹，hook 改过就强制恢复原始消息并打 warning。照搬另一套框架的注入方式行不通，只能走原生的 PromptContributor / bootstrap 文件追加；
- **身份 contributor 的优先级可能高到无法覆盖**：`kernel.identity` 优先级 1000，任何 contributor 都越不过——「替换人设」这个语义在该框架里不成立，最多只能追加；
- **`AGENT.md` 会静默覆盖 `AGENTS.md`**：`loadAgentDefinition()` 读到 `AGENT.md` 直接 return，`AGENTS.md` 连 warning 都不打。自定义指令必须合并进同一个 PromptPart 末尾，另立一个 part 会让模型当成两份文档，还会破坏 cache 前缀；
- **改配置对运行中实例不生效**：`ContextBuilder` 持有构造时的配置快照，`gateway_restart_required` 只是个提示。把可变数据放独立文件、加入 `sourcePaths()`，靠 mtime 在下一轮自动重建，才能做到「改一次全局生效、不用重启」；
- **测试要隔离真实用户配置**：`Path()` 直接指向 home，测试会读到本机真实文件。用 `t.Setenv("PICOCLAW_HOME", t.TempDir())`，并且 `Path()` 不要做缓存。

**做法**：接入前先读框架的 prompt 构建链路（contributor 优先级、缓存失效条件、指纹校验），能走的只有「原生扩展点」；不要假设另一个框架的注入方式可以平移。

## 总结

这 10 类问题的共同点：**它们都不在"正常路径"上，跑通一次就不会再注意到，直到在生产环境以更难排查的形态暴露**。把它们固化成检查清单，在代码审查与验收时逐条对照，比每次重新踩一遍划算得多。
