---
title: 投稿说明
date: 2026-10-18 12:00:00
comments: false
author: "学姐大人"
---

欢迎向玟茵开源社区知识库投稿。这里收的是**实践里真踩过的坑**，不是转载聚合，也不是产品介绍。

## 怎么投稿

### 方式一：邮件投稿

把写好的 Markdown 文档作为附件，发邮件到下面任一地址即可：

- **admin@wenyinos.com**
- **ruojiner@hotmail.com**

邮件标题建议写成 `[投稿] 文章标题`；正文里简单说明两件事：文章讲什么、是不是首发。收到后一般会在 7 天内回复。

### 方式二：Fork 仓库并提交 PR

适合熟悉 Git 和 GitHub 的开发者。仓库地址：

<https://github.com/WenYin-Community/hexo-template>

#### 1. Fork 仓库

打开上面的仓库，点击右上角 **Fork**，把仓库复制到自己的 GitHub 账号下。

也可以直接打开：<https://github.com/WenYin-Community/hexo-template/fork>

#### 2. 克隆自己的 Fork

把 `<你的用户名>` 换成你的 GitHub 用户名：

```bash
git clone https://github.com/<你的用户名>/hexo-template.git
cd hexo-template
```

#### 3. 安装依赖

需要 Node.js 18+，推荐 Node.js 20：

```bash
npm ci
```

如果 `npm ci` 报锁文件错误，改用 `npm install`，但不要提交 `node_modules/`。

#### 4. 新建分支

分支名建议用 `post/` 开头，后面跟文章主题的英文短名：

```bash
git checkout -b post/your-topic
```

#### 5. 新建文章

```bash
npx hexo new post "文章标题"
```

Hexo 会在 `source/_posts/` 下生成 Markdown 文件。建议把文件名改成英文短名，例如：

```bash
mv "source/_posts/文章标题.md" source/_posts/your-topic.md
```

文件名只影响文章 URL，页面标题仍由 front matter 里的 `title` 决定。英文短名能让链接更干净，也方便别人引用。

#### 6. 填写 Front-matter

打开刚创建的 `.md` 文件，开头至少包含：

```markdown
---
title: "文章标题"
author: "你的署名"
date: 2026-10-22
categories:
  - "开发工具"
tags:
  - "linux"
  - "troubleshooting"
---
```

- `title`：文章标题
- `author`：署名或笔名
- `date`：`YYYY-MM-DD`
- `categories` / `tags`：按内容填写，标签尽量复用已有主题词

正文从 front matter 的第二个 `---` 之后开始写。建议开头先写一段摘要，然后在单独一行插入 Hexo 的 more 摘要标记（HTML 注释形式），这样首页只显示摘要。

#### 7. 写正文和放图片

- 用 Markdown 写，代码块标注语言
- 报错信息贴原文，不要只写“报错了”
- 命令、路径、版本号、实际现象尽量写全
- 图片放到 `source/images/`，正文用相对路径引用：

```markdown
![图片说明](images/your-image.png)
```

- 不要提交 `public/`、`db.json`、`node_modules/`，这些是生成物或本地依赖

#### 8. 本地预览

```bash
npm run clean
npm run build
npm run server
```

打开 <http://localhost:4000> 检查首页、文章页、代码块和图片。确认无误后按 `Ctrl+C` 停止预览。

#### 9. 提交并推送

```bash
git add source/_posts/your-topic.md source/images/your-image.png
git commit -m "content: add your topic"
git push -u origin post/your-topic
```

只提交文章和图片，不要把 `public/`、`db.json`、`node_modules/` 加进去。

#### 10. 创建 Pull Request

1. 打开你的 Fork 页面，GitHub 通常会自动提示 **Compare & pull request**
2. 确认以下分支设置：
   - base repository：`WenYin-Community/hexo-template`
   - base branch：`main`
   - head repository：你的 Fork
   - compare branch：`post/your-topic`
3. PR 标题建议：`content: 添加《文章标题》`
4. PR 描述写清楚：
   - 文章讲什么
   - 是否首发
   - 本地 `npm run build` 是否通过
   - 如有预览截图，贴一张
5. 点击 **Create pull request**

维护者会在 PR 里 review，可能需要你修改。继续在同一个分支提交并 push，PR 会自动更新。合并后由维护者统一发布上线。

#### 不想装环境？用 GitHub 网页直接改

1. Fork 仓库
2. 在你 Fork 的 `source/_posts/` 目录点 **Add file → Create new file**
3. 文件名填 `your-topic.md`，粘贴 front matter 和正文
4. 页面底部选择 **Create a new branch for this commit**，分支名填 `post/your-topic`
5. 提交后回到仓库首页，点 **Compare & pull request**，按上面的方式填写 PR

网页方式不能本地预览，提交前请仔细检查 Markdown 格式和图片路径。

## 收什么

- 开发实践与踩坑记录：系统、后端、前端、桌面、移动、AI 都收
- 工具与环境的配置、排查、迁移经验
- 开源项目的打包、发布与长期维护
- 其他对开发者有实际帮助的内容

## 不收什么

- 站内已经有的主题（投稿前请先用站内搜索确认）
- 单纯的产品软文、课程推广
- 由 AI 生成、未经实际验证的"综述"与"指南"

## 格式要求

- 用 **Markdown（.md）**；邮件投稿作为附件发送，PR 投稿直接放进 `source/_posts/`
- 文件开头写清标题、日期、分类、标签
- 代码块标注语言；报错信息贴原文
- 技术描述尽量具体：命令、路径、版本号、实际现象，比"注意配置"这类话有用得多
- 邮件投稿请单独附上图片，或使用可长期访问的图片地址；PR 投稿把图片放到 `source/images/` 并在正文引用

## 关于署名

默认以投稿人署名。邮件投稿可以在邮件里说明笔名；PR 投稿请在 front matter 的 `author` 字段填写署名。文章版权归作者所有，投稿即视为授权本站发布与后续排版调整。

## 一点建议

如果你不确定写什么，最有价值的一类稿子是：**你花了两小时才查明白、而别人可能也要花两小时的那个问题**。把现象、根因、修法和验证方式写清楚，就已经是一篇好文章了。
