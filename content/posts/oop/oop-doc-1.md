---
title: 面向对象程序设计-文档作业-cout
description: W0401-cout成员函数的使用
date: 2026-10-12
lastmod: 2026-10-12
cover:
categories:
tags:
  - 
ai:
math: false
layout:
pinned: false
weight: 10
tocStartLevel: 2
tocEndLevel: 4
comment: true
---
## cout.put()
- 方便理解的声明形式：
```cpp
std::ostream& put(char c);
```
- **含义**：输出一个字符。
- put会返回流对象的引用，cout.put(xx)会返回cout。这个特性使得它可以链式调用，连续输出。
- 此类输出无视宽度（width）和填充(fill)
## cout.write()
- 方便理解的声明形式：
```cpp
std::ostream& write(const char* s, std::streamsize n);
```
- **含义**：从给定的字符指针s起，输出n个字符。
- write会返回流对象的引用，cout.write(xx)会返回cout。这个特性使得它可以链式调用，连续输出。
- 此类输出无视宽度（width）和填充(fill)
- write完全不管什么尾零，什么越界，他就读n个字符的内存，字符是什么就输出什么。所以不严谨的使用可能会造成各种UB。