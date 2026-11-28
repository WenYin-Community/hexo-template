---
title: "用 Poppler 排查 AI 为什么漏读 PDF 图表"
author: "G神经营方"
date: 2026-11-28
categories:
  - "AI"
tags:
  - "pdf"
  - "poppler"
  - "文档处理"
---

同一份 PDF 上传后，如果 AI 能复述第一页的文字，却读不出第二页图表里的数值，我会先查文件本身。PDF 的每一页可以保存文字对象、位图或矢量图形。阅读器里看得到一行字，那行字也可能只存在于图片像素里。用一份两页合成样例，可以把这个区别测出来。

<!-- more -->

## 按页检查文字层

下载下文的 `pdf-reading-check.pdf`，在文件所在目录运行以下命令。本次使用 Poppler 26.04.0。macOS 可以用 `brew install poppler`，Debian 或 Ubuntu 对应的软件包是 `poppler-utils`。

```sh
pdfinfo pdf-reading-check.pdf
pdftotext -f 1 -l 1 -nopgbrk pdf-reading-check.pdf -
pdftotext -f 2 -l 2 -nopgbrk pdf-reading-check.pdf -
```

`pdfinfo` 显示 2 页、A4，PDF 版本为 1.4。第一页的文字输出包含校验码 `PDF-K62`。第二页的命令正常退出，标准输出为空。`-f` 和 `-l` 分别指定起止页，页码从 1 开始。`-nopgbrk` 省去换页控制符，便于确认第二页确实没有提取到文字。这里的空输出只描述文本提取结果，需要再查页面内容。

## 确认图表位于第二页的图片中

```sh
pdfimages -list pdf-reading-check.pdf
pdfimages -f 2 -l 2 -png pdf-reading-check.pdf page2
```

清单列出一张图片，位于第 2 页，尺寸是 1240 × 1754 像素。打开提取出的 `page2-000.png`，人眼可以读到 Batch B 的数值和单位是 `37 min`。本次提取文件与下文公开的 PNG 逐字节相同。换用其他版本时，可以直接检查图表里的标签、数值和单位，PNG 编码的差异不影响读图校验。

实际遇到其他 PDF 时，如果 `pdfimages` 没列出图片，页面也可能包含矢量图、轮廓化的文字或其他内容。这时可以先把目标页渲染成一张图，再用肉眼查看。以下命令只渲染第 2 页。

```sh
pdftoppm -f 2 -l 2 -r 150 -png pdf-reading-check.pdf rendered
```

## 用同一道题排查上传链路

先上传原 PDF，请工具分别报告第 1 页校验码，以及第 2 页 Batch B 的数值、单位和页码，读不到就写「无法确认」。如果只答出了校验码，再单独上传提取的 PNG，用同一句关于 Batch B 的问题复测。PDF 漏读但 PNG 答对时，后续可以给该工具单独提交目标页图片。两次都无法确认时，先人工核对图例、标签及单位。把每次输入文件和答案记下来，方便复查错误出在哪一步。这个样例只用于排查当前一次上传和读取过程。

## 合成样例

- [下载两页 PDF](https://ultralinktls.cn/GGOD/assets/pdf-reading-check.pdf)
- [下载第 2 页原始 PNG](https://ultralinktls.cn/GGOD/assets/pdf-reading-check-chart.png)
- [查看原题和逐项核对表](https://ultralinktls.cn/GGOD/guide/chatgpt-claude-pdf-chart)

本文由 G神经营方撰写，两份素材均为自制的免费合成样例。写作时使用了 AI 辅助。文中的输出已用本地命令复现，并对照两页渲染图核对。按投稿规则授权本站刊发和排版，文章著作权归原作者。
