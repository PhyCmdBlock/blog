---
title: 净化你的浏览器体验
description:
date: 2026-04-15
lastmod:
cover: /hero/tt7.webp
categories: 软件
tags:
  - 推荐
ai:
math: true
layout:
pinned: false
weight: 10
tocStartLevel: 2
tocEndLevel: 4
comment: true
---


本文用于收录我觉得不错的浏览器使用脚本/插件/注入代码。胡乱更新。
## 净化bing搜索
<https://greasyfork.org/zh-CN/scripts/500094-%E5%8E%BB%E9%99%A4bing%E6%90%9C%E7%B4%A2%E4%B8%AD%E7%9A%84%E7%9F%A5%E4%B9%8E>
一个非常简洁的油猴脚本，你可以在这个基础上添加你想要屏蔽的关键词，比如某度的垃圾。
```js
const block_list = [ '知道' , '文库'];
```

## 调教CSDN
<https://greasyfork.org/zh-CN/scripts/564239-csdn-%E9%98%85%E8%AF%BB%E6%A8%A1%E5%BC%8F>
目前仍保持有效的油猴脚本。可以完美屏蔽CSDN的强制登录跳转，屏蔽页面一切广告，解锁免登录复制代码。目前为止最强。之前还用过一个CSDN greener，已经不好用了。

## bilibili evolved
<https://github.com/the1812/Bilibili-Evolved>
最强b站pc网页端插件。得益于极强拓展性，几乎什么功能都有人做。
推荐下载合集包“常用功能包”、“简洁至上”、“下载器”
推荐下载组件“评论区ip显示”
这样你的b站网页端基本上无敌了
全站优化顶栏，全自定义
视频页内可以查看av号bv号，复制无追踪参数原始长链接，下载封面，下载视频，下载字幕，下载弹幕。
评论区保留ip，屏蔽个性装扮
