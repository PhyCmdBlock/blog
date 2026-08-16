---
title: 文件或U盘被进程占用
description:
date: 2026-02-19
lastmod:
cover: /hero/tt6.webp
categories: 系统
tags:
  - windows
  - 碎片笔记
ai:
math: true
layout:
pinned: false
weight: 10
tocStartLevel: 2
tocEndLevel: 4
comment: true
---
> [!tip]
> 本文内容基于Windows系统



对于删除文件时发现被占用，你可以：

1. 打开资源监视器
2. 到cpu那一栏，然后在“关联的句柄”里去找要删除的文件，确认是哪个程序在用，如果没事情，就可以结束进程，再删除文件

弹出移动存储介质（如U盘）说设备正在使用中，也一样，直接在关联的句柄里搜盘符。

---

程序需要访问系统管理的资源的时候，需要从系统那里拿到一个“句柄”，作为操作时使用的索引，系统会记录下所有的这些信息，并认为持有句柄的程序正在使用对应资源，所以你能在资源监视器里找到正持有关联这个文件的句柄的程序。
