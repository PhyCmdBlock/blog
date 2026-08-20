---
title: STL
description: C++ Standard Template Library/C++标准模板库
date: 2026-08-20
lastmod: 2026-08-20
cover: /hero/tt4.webp
categories:
  - 数据结构与算法
tags:
  - cpp
ai:
math: false
layout:
pinned: false
weight: 10
tocStartLevel: 2
tocEndLevel: 4
comment: true
---
> [!note] 半成品
> 本文尚未完工，发上来是为了排在一起，我自己看起来舒服

之前准备学校比赛，看了点STL，主要参考的是[这篇](https://io.zouht.com/154.html)

所以这里也基本上不需要再多写了。就写一些方便理解、方便查阅的东西好了。

## 语法解释
```cpp
vector<int> arr(10);
```
在[高程](/posts/apl/apl-9)这里已经学过了类和对象的一点点概念了。在那里我们声明了一个`Time`类，可以用类似于`Time t1(2026,8,20);`的方式来定义一个`Time`对象。

这个其实也差不多，只是加入了一个叫模板的东西。`vector`是**类模板**，用于构造一个具体的类。`vector<int>`填入了模板参数`int`，告诉了类模板这个数据类型是个`int`，整个`vector<int>`就是一个具体的**类**了。既然是类，你就可以用同样的方式去构造一个对象。`vector<int> arr(10)`就是定义了一个`vector<int>`类的对象`arr`。10作为参数传入构造函数，初始化这个arr对象，长度为10.

## 容器列表
### vector
动态数组。对应于数据结构理论中，线性表中的**顺序表**。头文件`vector`.

#### 尾部操作
- `.push_back(元素)`
- `.pop_back()`
#### 获取长度
`.size()`
#### 清空
`.clear()`
#### 判空
`.empty()`
#### 改变长度
`.resize(新长度, [默认值])`

