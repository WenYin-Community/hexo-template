---
title: "企业级后台开发踩坑实录：NestJS + Prisma + MySQL"
date: 2026-06-29
categories:
  - "开发工具"
tags:
  - "nestjs"
  - "prisma"
  - "mysql"
  - "backend"
  - "concurrency"
  - "security"
---

本文汇总多个中后台系统（OA、进销存、ERP 类）开发过程中积累的服务端踩坑记录，技术栈为 NestJS + Prisma + MySQL 8 + Redis。内容集中在**参数校验、并发事务、序列化、数据库结构管理与安全**五个方向。

<!-- more -->

## 一、参数校验：静默剔除是最隐蔽的敌人

`ValidationPipe({ whitelist: true })` 会把**没有挂 class-validator 装饰器的 DTO 字段静默剔除**——接口不报错，参数却全部丢失：

```ts
// 以下字段的装饰器缺失或不全时，参数会被静默丢掉
export class BatchStockPageDto {
  @IsOptional() @IsInt()
  goodsId?: number;

  @IsOptional() @IsNumber()   // 注意：布尔类用 @IsNumber 而非 @IsInt
  onlyAvailable?: number;
}
```

同源问题还有：

- **查询 DTO 写成 `interface` 不走管道**：query 参数保持字符串类型，直接传给 Prisma 的 `take` 导致 500——查询 DTO 必须是 `class`；
- **数字字段缺 `@Min(0)`**：出库单数量传 `-100`，审核后库存反向增加、绕过负库存校验——DTO 要加下界，审核入口还应按单据方向复验符号；
- **分页参数缺边界**：`limit=0`、深分页要加 `@Min(1)` / `@Max(10000)`。

## 二、并发与事务：从"双跑入账"到 CAS

**审核并发双跑**是最严重的一类事故：状态检查放在事务开头、落标记却无条件 update，同单并发请求会导致库存只扣一次、而账户/积分/流水入账两次；跨单并发则丢失更新导致超卖。

修复模式：

```ts
// 用条件更新抢占状态，失败即返回 409
const r = await tx.bill.updateMany({
  where: { id, examine: 0 },
  data: { examine: 1, examineAt: now },
});
if (r.count === 0) throw new ConflictException('单据状态已变更');
```

其他同主题的坑：

- **扣卡 TOCTOU**：余量校验与扣减之间无事务/行锁，`quantity = quantity - $1` 无 `WHERE quantity >= $1` 守卫 → 并发/双击超扣成负。修复：同事务 + 预占守卫；
- **单号并发生成撞唯一约束**：原用"当日实例数 +1"，删除记录后新号撞上残留旧号。改为 `max(序号)+1` + 6 位随机 + 查重重试；
- **流水号在事务内用原子 increment**：`findFirst` 后单条原子 `increment`，靠 InnoDB 行锁串行化，实测并发 4 次得 4/5/6/7 无重复无空洞；
- **自研 SQLite 适配层"UPDATE 后按原 WHERE 回查"极脆弱**：WHERE 含状态谓词时更新后回查失败，出现"UPDATE 已执行但流水未动"的静默半执行——根治方案是改用 `UPDATE ... RETURNING id`。

## 三、序列化陷阱

- **Prisma Decimal 序列化成字符串**：`Float → Decimal` 后报文从 `1200` 变成 `"1200.00"`，`el-input-number` 等数字组件直接异常。在全局 `transform.interceptor.ts` 加 `normalizeDecimals()` 统一还原；
- **`COUNT(*)` 返回 BigInt**：JSON 序列化直接崩，报表接口报错；
- **业务错误走 HTTP 200 + `code!==0` 时响应体 `data` 被丢弃**：前端拿不到错误详情里的数字（如信用超额的各项金额），只能正则解析后端文案——正确做法是给错误对象补 `data` 字段。

## 四、数据库结构管理

- **富文本列建成 `varchar(191)`**（约 60 汉字）存不下正文，seed 数据直接 P2000 报错。注意 `TEXT` 列**不能有默认值**，须在代码里显式赋值；
- **MySQL 列名大小写不敏感**：`userId` 与 `userid` 同时出现报重复列，迁移中途失败（踩了两次）——命名上刻意避开（如统一用 `uid`/`userCode`）；
- **`prisma migrate dev` 在无建库权限的账号下不可用**（无法创建 shadow database），正确流程是：

```bash
prisma migrate diff --from-schema-datasource --to-schema-datamodel --script
# 落进 prisma/migrations/ 后
prisma migrate deploy && prisma generate
```

- **数据库落后 schema 会引发大面积 500**：`prisma db push` 前先用 `migrate diff` 离线核对纯增量，删表需 `--accept-data-loss`，操作前先快照备份；
- **schema 漂移**：多处副本（schema.sql、ensure-app-tables、migrations）没有单一事实源，出现过"生产库缺列 → 特定查询 500"的事故。任何"从仓库重建库"的环境（CI/灾备）都会大面积失败。

## 五、安全

- **SQL 列名拼接注入**：多处 INSERT/UPDATE 把客户端 JSON 的键名直接拼进 SQL 标识符（表名有白名单、列名没有）。修复：建列名白名单注册表，白名单外的键静默丢弃并告警；
- **跨租户越权**：`distributor_id` 全取自 query/body，从不与会话中的租户比对；不传参时 WHERE 为空直接返回全部数据。原则：租户维度一律取自会话，客户端传参只做校验；
- **路由前缀判断 bug**：`pathname.startsWith('/api/distributor')` 会意外放行 `/api/distributors`（复数形式）；
- **审计绕过**：日志落库判断用了含 query 的完整 URL，请求带 `?/auth/login` 即不落库——应使用 `req.path`；
- **`@Roles` 漏挂**：报表接口缺角色限制，任何登录用户可读财务汇总；扫描脚本只匹配方法级装饰器会漏掉类级 `@Roles('admin')`；
- **时间安全比较**：内部令牌判断用 `===`（非常量时间）→ 应改 `crypto.timingSafeEqual`；
- **验证码的"人类可读、机器不可提取"**：SVG 验证码曾在文本节点中明文包含答案（正则秒解，PoC 100% 破解）→ 改七段数码管**几何绘制**（无文本节点）+ 安全随机数。

## 六、nginx 限流 503 排查实录

**现象**：外网偶发 503；排查路径：

```bash
grep "limiting requests" /var/log/nginx/error.log
# 有输出才是限流；否则查 connect() failed / no live upstreams
```

**根因**：旧限流配置用 10 次/分的 `auth_zone` 覆盖了整个 `/api/auth/` 路径。在 NAT 共享出口场景下，**整个内网共用一个出口 IP**，全组织共享额度，第 7 次登录即 503；且 `$binary_remote_addr` 不看 X-Forwarded-For。

修复与配套措施：

- 登录独占 `auth_zone`，profile/menus/captcha 归 `api_zone`，超限返回 429；
- `location = /api/auth/login` 改 `^~` 防止带斜杠后缀绕过；
- 前置 CDN/WAF 时必须配 `set_real_ip_from` + `real_ip_header X-Forwarded-For` + `real_ip_recursive on`，否则限流桶永远数的是代理 IP；
- **原则**：IP 维度只当粗粒度防洪，精确风控必须带账号维度；
- `proxy_set_header Connection "upgrade"` 硬编码会让 `keepalive 64` 失效（每请求新建 TCP）→ 改用 `map $connection_upgrade`；
- 校验 nginx 配置时非 root 绑 80 端口失败是权限问题而非配置错误，用高位端口可完成完整加载验证。

复现手法：本地 nginx 沙箱 + 环回源 IP（127.0.0.2~127.0.0.4），旧配置第 7 次请求起稳定复现 503。

## 总结

企业后台的坑集中在两个词：**静默**与**并发**。参数静默丢失、序列化静默变形、状态静默漂移都是"不报错的错误"；而并发问题（双跑、TOCTOU、丢失更新）则必须靠条件更新、原子操作与事务边界来根治，靠"小心操作"是防不住的。
