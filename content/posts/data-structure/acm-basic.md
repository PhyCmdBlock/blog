---
title: ACM形式算法题的注意事项
description:
date: 2026-08-24T10:56:31
lastmod: 2026-08-24T10:56:31
cover:
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
## 加速cin/cout

```cpp
ios::sync_with_stdio(false);
cin.tie(nullptr);
cout.tie(nullptr);
```

在main的最前面写这3行：
`ios::sync_with_stdio(false);`：关闭cin/cout与scanf/printf的同步，代价是之后只能使用cin/cout；
`cin.tie(nullptr);cout.tie(nullptr);`：取消cin 和cout的绑定，减少不必要的缓冲区刷新。`nullptr`是空指针关键字。

同时要注意不要使用endl，这个也会对缓冲区进行刷新。

## 未知行数读取
这种处理方法是可以把含空格行读入的
```cpp
string line;
while (getline(cin, line)) {
	// 处理读入的line行。line行不含\n
}
```
getline函数返回的是流对象的引用。到达文件末尾的时候，while里执行一下getline，结果读到eof，eofbit置1,返回的cin流对象被解释为bool的值时会变成0,退出循环。