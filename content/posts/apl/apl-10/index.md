---
title: 高程整理(10)
description: 其他
date: 2026-06-15
lastmod:
cover: /posts/apl-10/cover.png
categories: 高级语言程序设计
tags:
  - cpp
ai:
math: true
layout:
pinned: false
weight: 100
tocStartLevel: 2
tocEndLevel: 4
comment: true
---

**其他**

>零散的一些东西，不能被归入哪个大主题
---
## 头文件
- 用于多源文件项目的公共信息传递。正如前面的课程所说，一个源程序需要使用函数，要使用全局变量，都是需要在前面声明的，每一个源程序都这样去声明一样的东西，会很麻烦且维护性差，那么就可以把一样的东西都写到头文件里去
- 头文件里可以含有：
	- 符号常量
	- 常变量
	- 函数、全局变量的extern、结构体、类 的声明
	- 不能放全局变量的定义
- 不建议在头文件里面把类似`#include <iostream>`啊，`using namespace std;`啊这种都写进去，每次引一下自己的头文件就好了。这样看似快，但是违背了权限最小化原则，把很多东西在不知道的情况下放了出来。
- `#include <xxx>`会优先在系统目录里找，找不到报错；`#include "xxx"`优先在当前文件夹找，找不到去系统目录找，找不到报错。
- 头文件里的`#pragma once`代表让这个头文件只能被#include一次
### 一些头文件说明
- C++ 原生没有字符串变量，用字符数组来模拟。`#include<string>` 是一个封装，里面的是新增的string类。
- `cstdio`和`cmath`两个库在Visual Studio中被`iostream`包含，可以缺省，其他的要加。


## 格式化代码
[clang-format介绍](https://tongji-high-level-language-programming.github.io/Website/reading/#clang-format-%E7%9B%B8%E5%85%B3%E7%AE%80%E4%BB%8B)
- 一个设置仅对一个解决方案有效。不同解决方案要反复设置
- 每次保存代码都会自动给你格式化
- `Ctrl+K+F`将选中代码格式化
- `Ctal+K+D`将全部代码格式化

## vs的调试功能
先设置断点，代表你想在什么地方的之后开始看看程序在搞什么，方便定位位置
f5直接按，进入调试
f10往下运行一句，f11可以进入函数看看函数里面怎么运行的，系统函数要自己去设置才能看。

## 输入输出重定向
```cmd
程序.exe 0<in.dat 1>a.txt 2>&1
```
- 这个数字012分别代表：标准输入，标准输出，错误输出（错误的日志之类的）
- 2>&1代表把错误输出也输出在1输出的东西后面。这个实际上是让错误和普通输出同时输出，不是在整个程序的标准输出结束以后再追加错误输出。

## 字符串输入大汇总

- [`cin >> str1 >> str2;`](/posts/apl/apl-2/#string1)
- [`cin.get(str,n,'\n')`](/posts/apl/apl-2/#string2)
- [`cin.getline(str,n,'\n')`](/posts/apl/apl-2/#string3)
- [`scanf("%s%s",&str1,&str2)`](/posts/apl/apl-3/#string4)
- [`gets(str)/gets_s(str)`](/posts/apl/apl-3/#string5)
- [`fgets(str,n,stdin)`](/posts/apl/apl-3/#string6)
## 字符输入大汇总
- [`cin >> ch1 >> ch2;`](/posts/apl/apl-2/#char1)
- [`cin.get()/cin.get(ch)`](/posts/apl/apl-2/#char2)
- [`scanf("%c%c",ch1,ch2)`](/posts/apl/apl-3/#char3)
- [`getchar()`](/posts/apl/apl-3/#char4)
- [`_getch()`](/posts/apl/apl-3/#char5)
- [`_getche()`](/posts/apl/apl-3/#char6)

## 其他
- x86就是32位的意思，只是最早IntelCPU叫什么8086,叫习惯了
- ASCII码表考试会给出。ASCII 码要记的就 4 个：
	32/0x20 ' '
	48/0x30 '0'
	65/0x41 'A'
	97/0x61 'a'
- GB2312 的使用必然导致扩展 ASCII 码的那些符号用不了，所以在 GB2312 里面又对那些符号重新定义了一些新的编码。
- 分解浮点数位数的时候，因为浮点数存在误差，可能比实际数小，为了让这个误差不影响数位上实际的数字，在最初的浮点数后面+1e6（也可以是其他小于要处理问题精度、大于数据类型精度的数字）
- sin函数的参数是弧度制的
- 少用`pow(x,y)`！如果你确定求幂，底数指数都是整数，用循环迭代，不要用pow。pow为了支持浮点数进行运算，从实现方式来讲肯定是`exp(y*log(x))`这种，用的泰勒展开式来逼近，可能有误差。
- 对于高精度的计算，不推荐使用C/C++，应当使用matlab/Python，专门用来搞科学计算。
- `#define 符号常量标识符 符号常量` 会把标识符出现的地方全部替换成后面的符号常量。
- vs有的时候编译不太对，右键项目清理或者重新生成，就好了
- 绝大部分的架构（x86,x64,ARM,RISC-V）都是小端序，也就是在一个类型的数据中，把低位存到前面来，人的阅读要倒过来。但是数据之间的顺序还是正常的。
