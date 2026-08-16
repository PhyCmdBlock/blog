---
title: betterncm
description: 一个桌面端网易云软件的注入插件
date: 2026-05-21
lastmod:
cover: /hero/tt8.webp
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


这是一个桌面端网易云软件的注入插件。
注：作者由于不用网易云音乐了，项目开发优先级下降了。但作者还有一个项目<https://github.com/std-microblock/chromatic>，似乎是想做一个更通用的，但是处于开发阶段，最近commit也停留在3月31日，应该是不能用。

先下载安装器<https://github.com/std-microblock/BetterNCM-Installer>
找个目录放进去，启动，注入网易云
在网易云里面，找到设置按钮底下的betterncm设置，默认插件源是gitcode，现在不能用了，进去把插件源换掉。换了以后，在插件列表里找到`Revived Source`，来丰富插件来源。

---

目前我试了几个插件：
### Inflink-rs
网易云一直不能把自己的播放信息映射到系统，这个插件能够改进这一点，让其他软件（如美化软件、监测软件），可以读取到当前的曲目信息

### RefineNowPlayingText
更有感觉的播放详情页前端设计

---

我的网易云版本比较新，3.1.15,发现几个UI调整插件都装不了（Style Snippet,TinyNCM）然后“纯净分享链接”也用不了。
