---
title: ACM形式算法题的注意事项
description:
date: 2026-08-24
lastmod: 2026-08-24
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