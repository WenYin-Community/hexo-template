---
title: "PHP 8 下维护老系统（续）：chanzhiEPS 与 SourceBans++"
author: "学姐大人"
date: 2026-10-03
categories:
  - "开发工具"
tags:
  - "php"
  - "php8"
  - "legacy"
  - "migration"
  - "sourcebans"
---

> 本文是《[PHP 8 下维护老系统](/2026/10/03/php8-legacy-system-migration/)》的续篇，记录 chanzhiEPS 与 SourceBans++ 两个老系统的移植与修复。

## 十七、附二：chanzhiEPS 的 PHP 8.4+ 移植

同一时期还把一个老建站/电商系统从 PHP 5 时代搬到 PHP 8.4+。体量和写法都和 Discuz 不同，但踩的坑高度重合。

**先抛开旧文档，从代码事实重写项目说明。** 旧文档里有 8 处事实是错的：模块数是 44 不是 45、前后台权限配置在 `system/config/front.php` 与 `admin.php` 并按 `RUN_MODE` 加载、前台视图在 `www/template/`、主题样式在 `www/theme/<template>/<theme>/style.less` 由 `ui` 模块调 lessc 编译、扩展只有模块内 `ext/`、仓库既没有 Composer autoload 也没有自动化测试。**改老系统之前先花半天确认文档说的对不对，比直接动手省时间。**

**又是 `char(32)` 装不下 bcrypt。** 安装时管理员创建失败，根因还是密码列按 md5 长度设计、而代码已改用 bcrypt（60 字符）。改 `varchar(255)` 并补一条 `upgrade5.2.1.sql`——这个月已经是第二次踩同一个坑（第一次在 Discuz 2.5）。

**`error` 控制器与 PHP 内置 `Error` 类冲突。** 类名直接不可用，只能重命名成 `errorControl`，同时让路由支持 `<module>Control` 的类名约定。

**PHP 8.4/8.5 的弃用项一串。** 编译期扫描出 **39 处**：`E_STRICT` 常量、`trigger_error(E_USER_ERROR)`、`exit(header(...))`、反引号运算符、分号形式的 `case`、隐式 nullable、可选参数位于必选参数之前、动态属性、`preg_match` 传 null 参数。另外移动端模板里**未加括号的嵌套三元表达式在 PHP 8 起是致命错误**——这个只有 `php -l` 扫得到，跑起来才报就晚了。

**升级流程里 lessc 报错。** 主题编译时把颜色类型标记当数字相乘，PHP 8 直接 TypeError；另有浮点取模的隐式转换。两处修完，`5.2_php8 → 5.2.1 → 5.2.2` 的升级链路才跑通。

**CLI 工具全挂。** `xrcli` 还引用着 `E_STRICT`、且缺 `DS` 常量；`check.php` 的 config 存根触发动态属性弃用。两个都要把退出码修回 0，否则自动化链路会一直以为失败。

**主题调试的几轮反复值得记**：首页那圈紫色其实是轮播 `.carousel-caption` 的背景、不是主题色溢出；头部左右被裁切是没按 1170px 容器居中；改完 CSS 浏览器还显示旧样式，需要重新编译主题并更新 `customVersion` 强制刷新。

**验证结果**：PHP 8.5.12 下 **1208 个 PHP 文件 `php -l` 全过**（0 语法错误、0 编译期弃用），含演示数据全新安装成功、管理员密码以 bcrypt 完整存储，前后台主要页面 200 且无 Deprecated/Warning。顺手删掉了内置的在线主题市场（入口、页面、API、菜单、权限、语言一并清），按主站视觉规范新建了一套紫色模板与主题。

**一个环境前提**：本机没有 `php` 命令，所有 `php -l` / `check.php` / `xrcli` 的验证都得在 podman 容器里跑——所以第一阶段的文档只能靠读脚本内部的依赖逻辑来确认用法，不能凭"文档这么写"。

## 附四：SourceBans++ 的两个空值与 ID 语义坑

线上一个 SourceBans++ 后台页面报 `Warning: Undefined array key 0`，用 Podman 在本地复现：MySQL 5.7 + PHP 8.5-fpm + nginx 三个容器（host 网络），数据库直接导入生产快照，rootless podman 绑不了 80 就用 8082。

**第一处：查询无结果时直接下标取值。** `GetRow` 没有匹配行返回 `null`，代码却直接 `$web_group[0]`；编辑「服务器管理组」时 `sb_groups` 里没有同 id 记录，于是触发告警。改成 `isset($web_group[0]) ? intval($web_group[0]) : 0`。

**第二处：同一个 `id` 被当成三套组表的键。** 页面用 `type` 区分「网页管理组 / 服务器管理组 / 服务器组」，但代码仍拿 `$_GET['id']` 去查用户表：`type=srv&id=1` 命中了用户 `ruojiner`，标题显示错人；`type=web&id=2` 查无用户返回 `null`，`str_replace` 收到 `null` 又产生 3 条 Deprecated。修法是按 `type` 从 `sb_srvgroups` / `sb_groups` 取 `name`，并用 `?? ''` 兜底。

**本地复现的两个前提**，缺一个就会误判：

- `display_errors=Off` 时 HTTP 200 不代表没有诊断——`E_ALL` 告警只进容器 stderr，必须查 `podman logs`；
- 容器用 UTC、宿主是 GMT+8 时，`podman logs --since` 的时间边界不可靠。定位到最后一条诊断的行号后 `tail -n +N` 更稳。

**还要先做基线对照。** `type=web&id=2` 的 3 条 Deprecated 在第一次修复前后都存在，如果不先复测隔离，很容易算到本次改动头上。

顺带补了一份权限模型文档：网页管理组是整数位掩码、服务器管理组是 SourceMod 字母串 + immunity、服务器组只用于打包服务器（`flags` 恒 0）；`srv_flags` 是 `admins.srv_flags . sb_srvgroups.flags` 拼接，不是覆盖。**老系统的「同名不同表」比函数 bug 更常见，先把 ID 属于哪张表写清楚，再改代码。**

## 总结

这两个案例和 Discuz、Delphi 的坑高度重合，但有两件事更突出：

- **改老系统之前先核对文档**——chanzhiEPS 的旧文档有 8 处事实错误，按文档直接动手会白干半天；
- **同一个 ID 可能属于三套表**——SourceBans++ 的组管理与用户查询共用 `$_GET['id']`，`type` 不同、表不同，空值兜底和按类型取字段必须一起改。

编码与错误可见性的经验可以回看主篇：[PHP 8 下维护老系统：静默失效、致命错误与编码约束](/2026/10/03/php8-legacy-system-migration/)。
