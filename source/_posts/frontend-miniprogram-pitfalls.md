---
title: "前端工程踩坑笔记：Vue 3、小程序与 Canvas 小游戏"
date: 2026-07-31
categories:
  - "开发工具"
tags:
  - "vue"
  - "element-plus"
  - "taro"
  - "uni-app"
  - "miniprogram"
  - "canvas"
  - "frontend"
---

本文汇总 Vue 3 中后台前端、Taro/uni-app 小程序以及 Canvas 小游戏开发中积累的踩坑记录，覆盖**构建与缓存、Element Plus 组件、接口数据层、小程序容器限制**四个方向。

<!-- more -->

## 一、构建与缓存：改了没生效先怀疑缓存

- **vite dev server 加载缓存旧模块**：源码已改但页面不生效（表现为 `setupState` 缺新变量提示），重启 dev server 即恢复；
- **浏览器磁盘缓存旧 JS**：`?v=2` 只作用在 HTML 引用上，`<script src>` 相对路径不带 query，改端口（新 origin）才会重新加载；
- **vite dev server 只监听 IPv6 `[::1]`**：用 `127.0.0.1` 连不上，要用 `localhost` 访问；反向亦然（Next.js dev 也有同款问题）；
- **`vite build` 不覆盖未注册路由的新页面**：新页面写了但没注册路由时，构建图中根本没有它的编译产物——用 `vue-tsc` 逐文件编译或临时入口可在构建前发现。

## 二、Element Plus 使用细节

- **表格右侧留白**：所有列都设固定 width 时总宽小于容器宽度，EP 不会自动拉伸——组件层补一个弹性列即可一次修复多个模块；
- **整行着色**：需用 `:deep(.el-table__row.retention-row > td.el-table__cell)` 才能压过 hover 规则；
- **`el-radio-button` 用 `value` 写法**（与新版 EP 一致，避免 label 语义踩坑）；
- **`el-sub-menu` 白底浅灰文字不可读**、激活项在子菜单内时点击行为与直觉相反（自动展开 vs 收起），需要实测确认；
- 夜间模式要写入 localStorage，否则刷新即丢。

## 三、接口数据层：三个高频问题

**1. 翻页不清空旧列表**——翻页时数据叠加到几十条；**旧响应覆盖新响应**——快速连续筛选时，先前请求的响应后到达覆盖最新结果。修复：请求序号守卫，丢弃过期响应：

```js
let seq = 0;
async function load(params) {
  const my = ++seq;
  const data = await fetchList(params);
  if (my !== seq) return; // 过期响应直接丢弃
  render(data);
}
```

**2. `catch(() => null)` 吞错**——接口错误被静默吞成 null，UI 照常显示空列表，问题排查困难。**错误必须可视化**。

**3. 权限判断前置**——财务角色专属接口对其他角色会 403 弹错，应"无权限不发请求"，而不是发出去再弹报错。

## 四、小程序与 H5 容器限制

- **`Taro.request` 默认 60s 超时**，批量操作必须显式设置；上传用裸 `Taro.uploadFile` 绕过统一 client 时，token 为空会发出 `Bearer null`；
- **toast 与 loading 共享原生气泡**：批量上传中单个失败提示会被 `finally` 里的 loading 立即覆盖，用户完全看不到失败——失败信息要汇总后展示；
- **uni-app H5 的 rpx 编译陷阱**：postcss 会把 `rpx` 留成 `%?192?%` 占位符，运行时换算未执行时 `192rpx` 直接渲染成 192px，界面放大 2 倍。修法：自定义 postcss 插件按 375 基准编译期换算，且**必须排在官方插件之前**；`@import url()` 内联的外部 CSS 会绕过插件，注意顺序；
- **容器白名单限制**：某些小游戏容器只允许 jpg/css/gif/svg/png/js/json/html/woff2/webp/woff 后缀——**mp3 不允许**，音频方案被迫整删；同时禁行内 onclick、禁外部字体；
- **`@types/*` 被作为隐式类型入口**：deprecated 的 stub 包（如 `@types/minimatch@6`）被 tsc 当入口报错时，在 tsconfig 显式声明 `types` 列表即可。

## 五、Canvas 小游戏的坐标与渲染

强制横屏后的**触摸坐标错位**是重灾区：

```css
/* transform-origin: center 取的是布局中心，旋转后坐标系原点改变 */
.rotate-wrapper {
  transform: translate(-50%, -50%) rotate(90deg);
}
```

教训：**用代码公式反推触摸点会得到"闭环自洽"的假通过**——输入换算公式与被测渲染公式用同一套错误假设时，测试全绿但实际点击错位。必须按**显示位置实测**验证。

其他关键点：

- **`await requestFullscreen()` 可能挂起**：全屏门不隐藏、界面卡死——应先切 UI、全屏并行请求，不要串行等待；
- **rAF 未运行时同步派发的 TouchEvent 会被吞掉**，且 CDP 不合成 click 事件，自动化测试需分步派发 + 补发 click；
- 结果卡直接渲染 canvas 比 `<img src=dataURL>` 兼容性更好；
- 异形屏安全区在老 Chrome 内核（Chrome 61 基线）不识别 `env()`，需三层回退：纯数值 → `constant()` → `var(--safe-area-inset-*, env(...))`；
- 缺一行 `requestAnimationFrame` 主循环，游戏就卡在倒计时画面——Canvas 游戏没有"报错"，只有"不动"。

## 六、移动页开发约定

- 移动页不用卡片（el-card），单列布局、按钮 ≥44px、底部留 72px 给 TabBar；
- `isMobile` 判断要用 ResizeObserver + resize + orientationchange 三事件，只取一次会失效；
- 全局非 border-box 时，`calc(100vw - 32px)` 在窄屏会因 padding 溢出（登录卡片被撑出屏幕）。

## 七、资源优化实测数据

小游戏资源压缩的实测结论（可作参考）：

- PNG 无损压缩只省 5.6%，转 **webp q85 省 96%**；
- wav 降 22050Hz 单声道省 34%，转 mp3 再省 72%；
- `ffprobe` 的 duration 头部估算不准（146.5s vs 实际 130.7s），完整性校验要按**解码帧数**比对。

## 总结

前端侧的高频问题集中在两点：**缓存态的假象**（构建缓存、浏览器缓存、共享的原生气泡）与**坐标/时序的错位**（触摸换算、响应乱序、全屏挂起）。共同对策是：验证以真实用户路径为准，测试脚本自身也要被怀疑。
