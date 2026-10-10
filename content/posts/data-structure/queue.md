---
title: 队列
description: queue
date: 2026-10-10
lastmod: 2026-10-10
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
队列也是一种特殊的线性表。只能在一端输入，只能在另外一端输出，先进先出，FIFO。

队头：删除的一端
队尾：加入的一端

## 顺序存储：循环队列
front代表队头，如果队列不空，那么front指向真实的队头元素。rear代表队尾，始终指向真实的队尾元素的后一个，也就是入队即将加入的位置。

### 数据结构设计
如果你按照普通顺序表来搞，元素出队出队，最后front和rear都会到达顺序表的终点，此时fornt=rear，但是实际上这个顺序表的前面部分都没存东西，并没有真正的满。为了利用前面的空间，需要使用循环队列，绕圈。
```cpp
#define MaxSize 50
typedef struct{
    ElemType data[MaxSize];
    int front,rear;
}SqQueue;

void InitQueue(SqQueue &Q){
    Q.rear=Q.front=0;
}
```
一开始，front和rear都在0.
### 判空
```cpp
bool isEmpty(SqQueue Q){
    if(Q.rear == Q.front){
        return true;
    }else{
        return false;
    }
}
```
在循环队列这种形式下，front=rear就已经可以用来判断队空了。
### 入队
```cpp
bool EnQueue(SqQueue &Q, ElemType x){
    if((Q.rear+1)%MaxSize==Q.front)
        return false;
    Q.data[Q.rear] = x;
    Q.rear = (Q.rear+1)%MaxSize;
    return true;
}
```
`(Q.rear+1)%MaxSize`这种写法代表循环队列里的“下一个”。判满是什么呢？如果用尽这个MaxSize个元素，你会发现最后rear又会指回到front，这样的话就和队空的判断条件一样了，无法区分！为了能够区分队空和队满，需要牺牲一个元素的空间不用，让rear还差一个位置到front的情况作为队满的情况。此外还有使用size数据成员（存储队列元素个数）和tag数据成员（tag区分上一步是删除还是插入，以此来判断应当是队满还是队空），但是牺牲一个空间是最常用的做法。

入队，首先判满，满了无法入队。然后x存入rear位置，rear往下走。
### 出队
```cpp
bool DeQueue(SqQueue &Q, ElemType &x)
{
	if (Q.rear == Q.front)
		return false;
	x = Q.data[Q.front];
	Q.front = (Q.front + 1) % MaxSize;
	return true;
}
```
出队，首先判空，空了没法出队。然后把front位的数据取出，然后front往下走。
### 链式存储：链式队列
使用链表方式就不用去想环状结构了，出队即删，入队即建。
### 数据结构设计
不带虚拟头结点比较麻烦，链式队列一般都用带虚拟头结点的。在这种情况下，front指向虚拟头结点，rear指向真实队尾结点。真实队头结点是front的下一个。front不会发生改变。

```cpp
typedef struct LinkNode {
	ElemType data;
	struct LinkNode *next;
} LinkNode;
typedef struct{
	LinkNode *front, *rear;
} LinkQueue;

void InitQueue(LinkQueue Q)
{
	Q.front=Q.rear=(LinkNode*)malloc(sizeof(LinkNode));
    Q.front->next=NULL;
}
```

经典的结点数据结构，然后队列就只包含两个指向结点的front和rear指针。
### 入队
```cpp
void EnQueue(LinkQueue &Q, ElemType x){
    LinkNode *s = (LinkNode*)malloc(sizeof(LinkNode));
    s->data=x;
    s->next=NULL;
    Q.rear->next=s;// 链表插入操作
    Q.rear=s;// 更新rear指针
}
```
入队，就是在rear后面加一个结点，先申请一个新结点空间，然后把数据x填入，next一定是null。然后完成链表操作，队尾结点的next指向新的s，形成连接，然后把队尾指针更新成新的。
### 出队
```cpp
bool DeQueue(LinkQueue &Q, ElemType &x){
    if(Q.front==Q.rear)
        return false;
    LinkNode *p=Q.front->next;//指向真实队头结点，也就是要删掉的
    x=p->data;
    Q.front->next = p->next; //删除
    if(Q.rear==p){
        Q.rear=Q.front;
    }
    free(p);
    return true;
}
```
如果是空，不能出。p指向真实队头结点，也就是要删掉的。导出数据到x，并执行链表链接上的删除（头结点next跳过p）。重要的是，如果删除的这个结点刚刚好也是rear指向的（也就是把一个元素的队列删空了），那么原来的rear指向的p就失效了，需要处理，让rear重新指向虚拟头结点。然后才能释放p这里的内存。

