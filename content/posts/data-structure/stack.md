---
title: 栈
description: stack
date: 2026-09-20T09:52:40
lastmod: 2026-10-10T09:52:40
cover:
categories:
  - 数据结构与算法
tags:
  - cpp
ai:
math: true
layout:
pinned: false
weight: 10
tocStartLevel: 2
tocEndLevel: 4
comment: true
---
一种特殊的**线性表**，只不过插入删除只能在一端进行。LIFO
## 判断某种出栈顺序合不合法
设立一个空栈，按照给定的**进栈顺序**依次进栈，并在每一步去尝试能不能出掉那个出栈顺序里的下一个元素，不能就继续进栈，出现问题就说明不合法。

比如说进栈是abcde，给你一个出栈的bedca。那你去一个个进，先进a，不能出b，再进b，能出b，那就出掉b，剩a，不能出e，进c，进d，都不能出e，进了e，能出e，那就出掉e，剩d，能出d，出d，剩c，能出c，出c，剩a，能出a，出a，结束，是正确的出栈顺序。

## 合法出栈顺序个数
卡特兰数描述：$\frac{1}{n+1} C_{2n}^n$ 代表n个不同元素进栈的合法出栈顺序总个数

*TODO：卡特兰数数学原理（组合数学）*

## 顺序栈实现
就是一个顺序表，使用静态数组实现。元素从下标低的地方一个个堆到下标高的地方。外加一个top指针记录栈顶下标。栈空的时候top是-1.为了方便，不演示顺序表的扩张操作，满了就报错。
```cpp
#define MaxSize 50

typedef struct{
    Elemtype data[MaxSize];
    int top;
}SqStack;

void InitStack(SqStack &S){
    S.top = -1;
}
```
### 判断栈空
根据上面的原理，栈空时top为-1.
```cpp
bool StackEmpty(SqStack S){
    if(S.top == -1){
        return true;
    }else{
        return false;
    }
}
```


### 入栈
```cpp
bool Push(SqStack &S,Elemtype x){
    if(S.top == MaxSize-1){
        return false;
    }
    S.data[++S.top] = x;
    return true;
}
```
入栈的时候top+1然后在top这里放入东西。如果top已经顶到数组下标最大值，入栈操作失败。
### 出栈
```cpp
bool Pop(SqStack &S, Elemtype &x){
    if(S.top==-1){
        return false;
    }
    x = S.data[S.top--];
    return true;
}
```
出栈的时候，把top位置的值传出去，然后top-1即可，这个过程中并没有把出掉的栈的数据覆盖掉。如果top已经顶到-1,那就出栈失败

### 读栈顶
和出栈Pop几乎一模一样，唯一的区别是不会让top-1.
```cpp
bool GetTop(SqStack S, Elemtype &x){
    if(S.top == -1){
        return false;
    }
    x = S.data[S.top];
    return true;
}
```

### 另外一种设计：top指向将入栈的地方
那这样栈空top为0，top已经超出下标范围入栈失败，top到0出栈失败。出入栈的操作顺序也会改变，入栈先放再加，出栈先减再拿。

## 共享栈实现
可以从2个方向入栈，各自作为一个栈，但共用同一个静态数组，可以提高这个静态数组内存的使用率。

2个top，top0从-1开始，top1从maxsize开始。
判满就看top0+1是不是等于top1，这意味着两个栈顶挨在一起了。

## 链栈
用链式存储来搞的栈，和单链表基本没区别，就是限定了只能在虚拟头结点后插入删除。
```cpp
typedef int ElemType;
typedef struct LinkNode {
	ElemType data;
	struct LinkNode *next;
} LiStack;
```

严蔚敏教材推荐链栈**不带虚拟头结点**。这里用不到top，栈顶就是头结点。
```cpp
void InitStack(LiStack *&S)
{
	S = NULL;
}
bool StackEmpty(const LiStack *S)
{
	return S == NULL;
}
```

用Listack的指针做head指针。无头结点的话，S初始指向NULL。

```cpp
bool Push(LiStack *&S, ElemType x)
{
	LiStack *p = (LiStack *)malloc(sizeof(LiStack));
	if (p == NULL) {
		return false;
	}
	p->data = x;
	p->next = S;
	S = p;
	return true;
}
```

先申请一个节点的空间。判断一下有没有申请成功。然后填充这个空间，数据填成x，next指针指向原来的头结点。现在把头结点更新成新申请的这个空间指针。这个入栈其实就是无虚拟头结点的头插操作。
```cpp
bool Pop(LiStack *&S, ElemType &x)
{
	if (StackEmpty(S)) {
		return false;
	}
	LiStack *p = S;
	x = p->data;
	S = p->next;
	free(p);
	return true;
}
```
栈空就无法出栈。p是当前头结点，也就是栈顶。qu取出数据到x，更新头指针S为头结点的next。最后要释放这个空间。

```cpp
bool GetTop(const LiStack *S, ElemType &x)
{
	if (StackEmpty(S)) {
		return false;
	}
	x = S->data;
	return true;
}
```
和出栈一样，就是不会改变链表结构，不改头指针不释放空间。

```cpp
void DestroyStack(LiStack *&S)
{
	while (S != NULL) {
		LiStack *p = S;
		S = p->next;
		free(p);
	}
}
```
比顺序栈多一个释放步骤。

*TODO：应用*