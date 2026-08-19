---
title: 线性表
description: 顺序表、链表
date: 2026-08-19
lastmod: 2026-08-19
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
线性表（**Linear List**）是一种逻辑结构。意思是一堆有限的元素的有序序列。前驱就是某个元素前面的那个元素，后继就是某个元素后面的那个元素。位序1的元素没有前驱，位序n的元素没有后继。

**位序**是指某个元素在这个线性表里面是**第几个**元素（**1~n**），和下标区分。

说简单点，就是一堆元素排一列。

## 线性表需要实现的基本功能
```cpp
void InitList(&L);//初始化
void DestroyList(&L);// 销毁
void IncreaseSize(&L, int len);// 延长len
bool ListInsert(&L, int i, ElemType e);// 插入，i表示位序，取值1~n
bool ListDelete(&L, int i, ElemType &e);// 删除
ElemType GetElem(L, int i);// 按位查找
int LocateElem(L, ElemType e);// 按值查找，返回位序
int Length(L);// 返回长度
bool Empty(L);// 判空
void PrintList(L);// 打印
```

## 顺序表
线性表的顺序存储（**Sequential Storage Structure of Linear List**）。或者“存储结构为顺序存储的线性表”。就是说，顺序表是一个线性表的实现方式，用的方法是在内存里面取一系列连续单元的方法。

说简单点，就是我想实现线性表，那我就内存里面找一块内存直接存元素，内存的顺序天然地决定了数据的顺序。

顺序表本身的实现还可以分成两种：**静态分配**和**动态分配**。静态分配就是分个定死的数组，存满了就没救了，完蛋了，一般不用的。动态分配就是可以根据需要去申请内存，存满了可以括。接下来的代码都以动态分配作为基础。

```cpp
typedef int ElemType;//可修改

// 静态分配方法

// typedef struct {
//     ElemType data[MAXSIZE];
//     int length;
// } seqList;

// 动态分配方法
#define InitSize 10

typedef struct {
	ElemType *data;
	int max_size;
	int length;
} seqList;

// 创
void InitList(seqList &L)
{
	L.data = (ElemType *)malloc(InitSize * sizeof(ElemType));
	L.length = 0;
	L.max_size = InitSize;
}
// 销
void DestroyList(seqList &L)
{
	free(L.data);
}

// 延长len
void IncreaseSize(seqList &L, int len)
{
	ElemType *p = L.data;
	L.max_size += len;
	L.data = (ElemType *)malloc(L.max_size * sizeof(ElemType));
	for (int i = 0; i < L.length; i++) {
		L.data[i] = p[i];
	}
	free(p);
}

// 插入，i表示位序，取值1~n
bool ListInsert(seqList &L, int i, ElemType e)
{
	if (i < 1 || i > L.length + 1 || L.length >= L.max_size) {
		return false;
	}
	for (int j = L.length; j >= i; j--) {
		L.data[j] = L.data[j - 1];
	}
	L.data[i - 1] = e;
	L.length++;
	return true;
}
// 删除
bool ListDelete(seqList &L, int i, ElemType &e)
{
	if (i < 1 || i > L.length) {
		return false;
	}
    e = L.data[i-1];
	for (int j = i; j < L.length; j++) {
        // 旧代码，写反了
        // L.data[j] = L.data[j-1];
		L.data[j-1] = L.data[j];
	}
    L.length--;
    return true;
}

//查询
// 按位查找
ElemType GetElem(seqList L, int i)
{
    return L.data[i-1];
}
// 按值查找，返回位序
int LocateElem(seqList L, ElemType e)
{
    for(int i = 0; i<L.length;i++){
        if(L.data[i] == e){ // 仅适用ElemType为基本类型，否则要重载'=='
            return i+1;
        }
    }
    return 0;//没找到
}

//小工具
// 返回长度
int Length(seqList L)
{
    return L.length;
}
// 判空
bool Empty(seqList L)
{
    if(L.length)
        return false;
    else
        return true;
}
// 打印
void PrintList(seqList L)
{
    for(int i = 0;i<L.length; i++){
        printf("%d ", L.data[i]);
    }
    printf("\n");
}
```

## 链表
线性表的链式存储。或者“存储结构为链式存储的线性表”。数据存储是离散的，一个元素存进一个结点，结点分散在内存的各个角落，用指针联系起来。

### 单链表
#### 带头结点/不带头结点
一般我们会选择带一个不存数据的头结点。
首先，会有一个指针来代表一个链表，这个指针会指向第一个节点。
比如说L就是一个指向第一个结点的指针：
```cpp
Linklist L;
```
头结点是什么？就是这个L指针指向的第一个节点。但是这个第一个节点是一个特殊的节点，它不存放数据，只是作为一个起点使用，它的下一个结点才是真正意义上的第一个数据结点。

为什么要这样？因为便于很多操作的进行。现在我们来看看没有头结点插入数据会怎么样。在链表的大部分地方插入节点的操作都是一致的，让前一个结点指向新的，让新的指向原来前一个节点指向的。但是如果要在第一个位置插入一个节点，因为L指针并不属于一个节点，你就需要进行特殊处理，专门为这种情况写一个逻辑。你需要修改这个L本身，和其他的操作逻辑并不统一。如果你有那么一个没有数据的头结点在，L指针不需要动，一直定死了，就是指向这个没数据的头结点。插入第一个数据的时候，操作流程也和在其他位置插入的方法是一样的。
![3a35131af50b4d22f9bd20981c76d86d.jpg](https://img.alsbb.top/2026/08/b753ddb9339498713bf8d6281bfe6554.jpg)


#### 声明
```cpp
typedef int ElemType;
typedef struct LNode {
	ElemType data;
	struct LNode *next;
} LNode, *Linklist;
```
`LNode`代表链表的一个节点。其中`data`是数据域，`next`是指针域。

`typedef`语法注意一下，这里面这个struct声明时自带了一个名字：`struct LNode`，这是因为在结构体内部他需要有一个指向自己这种结构体类型的指针，必须提前设置好一个名字`struct LNode`，否则到定义指针的位置`struct LNode`还没出现，编译器是不认识的。

然后结构体定完了以后，后面进行了类型定义，直接把`struct LNode`设置了别名`LNode`来称呼。逗号后面加了个`*Linklist`，表示把这个结点结构体的指针也设置了别名`Linklist`。设置这个别名的目的是为了能够用更直接的类型来看待一个链表的初始指针。

#### 初始化
```cpp
bool InitList(Linklist &L)
{
    L=(LNode *)malloc(sizeof(LNode));
    if(L==NULL){
        return false;
    }
    L->next = NULL;
    return true;
}
```
`L=(LNode *)malloc(sizeof(LNode));`去申请了一块结点的内存空间，并让L指向了这块空间。这个就是头结点。L的指向以后都不会变了。

由于申请内存是有可能失败的，所以检查一下是不是真的分到内存了，没分到直接返回`false`。分到了继续，把头结点的指针赋成`NULL`，现在这个链表便是空的。

#### 后插
在一个结点的后面插入结点。
```cpp
bool InsertNextNode(LNode *p, ElemType e)
{
	if (p == NULL) {
		return false;
	}
	LNode *s = (LNode *)malloc(sizeof(LNode));
	if (s == NULL) { // 忘记了
		return false;
	}
	s->data = e; // 忘记了
	s->next = p->next;
	p->next = s;
	return true; // 忘记了
}
```
这个函数会直接获得一个结点，你就只管插入就好。

如果说你获得的这个结点就不存在呢？所以你要做`NULL`判断。

申请新内存，存放要插入的数据。不要忘记检查内存申请有没有成功。

申请到内存以后，把数据放进新结点的数据域。

然后的顺序一定是先把被插的结点的next信息先转移到新结点的next上，再把旧next指向新结点。否则信息丢失了。

#### 前插
在给定结点前面插入新结点。
```cpp
bool InsertPriorNode(LNode *p, ElemType e){
	if (p == NULL) {
		return false;
	}
	LNode *s = (LNode *)malloc(sizeof(LNode));
	if (s == NULL) {
		return false;
	}
	s->data = p->data;
    s->next = p->next;
	p->data = e;
    p->next =s;
    return true;
}
```
这里有个问题：我又不知道给的这个结点前面是谁，怎么能插？都改不了前面那个结点的指针。

实际上你不需要知道。这里做了一招偷梁换柱，先在这个p结点的**后面**插入结点，然后把p的数据移到后面结点里面！于是原来那个p结点的位置就可以给新的结点用了。没有把p结点原先的那块内存留给p，但是效果上就是达到目的了。实质上等于：后插+交换。
![57aa8a654cead62be147304f117d818d.jpg](https://img.alsbb.top/2026/08/aead4d9feaeb330d7485d719a6d9de4f.jpg)
#### 删除
```cpp
bool DeleteNode(LNode *p){
    if(p==NULL){
        return false;
    }
    LNode *q = p->next;
    p->data=q->data;
    p->next=q->next;
    free(q); // 忘记了
    return true;
}
```
这次只告诉你了一个结点的信息！处理方法和前插是一样的，你直接把后面结点的信息把本结点覆盖掉就好了。q指向下一个结点。一定要记得释放本结点的内存！！！！！

其实这里是有一个明显的问题的，那就是这个函数无法删除链表末尾最后一个结点。最后一个结点指向NULL，NULL根本不是一个结点，怎么能让NULL来覆盖它呢？而且要删除的话，一定要修改上一个结点的next，使其指向NULL，修改未知结点无法绕过了。这时你别无他法，只能从头开始遍历链表。

所以这也能看到单链表的缺陷，如果是双链表（可以反向追溯），就没这事情。


#### 按位查找
```cpp
LNode *GetElem(Linklist L, int i)
{
	if (i < 0) { // 忘记了
		return NULL;
	}
	LNode *p = L;
	int j = 0;
	while (p != NULL && j < i) {
		p = p->next;
		j++;
	}
	return p;
}
```
小于0的非法值记得排除。
这个甚至支持找到头结点，i=0代表头结点，循环一次都不进，而p初始指向头结点，所以返回的就是头结点。
如果i太大，超出长度，在过程中p就变成NULL了，退出循环，返回的也是p，也就是返回NULL，也没问题。

#### 插入
有了上面那些写好的函数，可以让插入操作变得非常简单，只要把两个函数组合起来，边界条件甚至都已经自动考虑了。
```cpp
bool ListInsert(Linklist &L, int i, ElemType e){
    LNode *p = GetElem(L,i-1);
    return InsertNextNode(p,e);
}
```
在链表的第i个位置插入结点，可以分成2个步骤：
1. 找到链表的第i-1个结点。
2. 在这个结点后插。
这两个函数内部已经自带完全的边界条件过滤，可以正确实现非法值的处理。


#### 删除
```cpp
bool ListDelete(Linklist &L, int i, ElemType &e){
	LNode *p = GetElem(L, i - 1);
    if(p == NULL){
        return false;
    }
	LNode *q = p->next;
	if (q == NULL) {
		return false;
	}
	e = q->data;
    p ->next = q->next;
    free(q);
    return true;
}
```
先把`i-1`处的结点拿到。如果这里都NULL，直接退出。然后获取`i`处结点。如果NULL，说明没有能删除的。都不是的话，就可以开始删除：转移数据到e，然后指针直接跨越q结点，最后释放q内存。

#### 按值查找
```cpp
// 按值查找
LNode *LoacteElem(Linklist L, ElemType e)
{
	LNode *p = L->next;
	while (p != NULL && p->data != e) {
		p = p->next;
	}
	return p;
}
```
注意，`LNode *p = L->next;`这个必须是从第一个数据结点开始。如果是`LNode *p = L;`就错了，因为头结点数据域没东西，你把它纳入搜索范围就错了。

这个循环只有两种退出情况：pNULL了，返回p的NULL，代表没找到，对的；p数据域匹配了，那返回p，就是要找的这个结点，也是对的。



### 双链表

**TODO:**