---
title: 线性表
description: 顺序表、链表
date: 2026-08-19
lastmod: 2026-09-25
cover: /hero/tt7.webp
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
tocEndLevel: 5
comment: true
---


线性表（**Linear List**）是一种逻辑结构。意思是一堆有限的元素的有序序列。前驱就是某个元素前面的那个元素，后继就是某个元素后面的那个元素。位序1的元素没有前驱，位序n的元素没有后继。

**位序**是指某个元素在这个线性表里面是**第几个**元素（**1~n**），和下标区分。

说简单点，就是一堆元素排一列。

## 顺序表
线性表的顺序存储（**Sequential Storage Structure of Linear List**）。或者“存储结构为顺序存储的线性表”。就是说，顺序表是一个线性表的实现方式，用的方法是在内存里面取一系列连续单元的方法。

说简单点，就是我想实现线性表，那我就内存里面找一块内存直接存元素，内存的顺序天然地决定了数据的顺序。

顺序表本身的实现还可以分成两种：**静态分配**和**动态分配**。静态分配就是分个定死的数组，存满了就没救了，完蛋了，一般不用的。动态分配就是可以根据需要去申请内存，存满了可以括。接下来的代码都以动态分配作为基础。
### 动态静态
#### 静态分配模式
```cpp
#define MaxSize 50
typedef struct {
    ElemType data[MAXSIZE];
    int length;
} seqList;
```
静态就是定死了，直接定义数组，数组长度就是定好的maxsize。然后记录一个length表示有多少元素。
这一种顺序表的初始化很简单，就直接把length搞成0：
```cpp
void InitList(SqList &L){
	L.length=0;
}
```
#### 动态分配模式
```cpp
#define InitSize 100
typedef struct {
	ElemType *data;
	int MaxSize;
	int length;
} seqList;
```
为了能够动态，我们就需要让这些存储空间能被创建和消除。那就得把存储放在堆里。所以需要指针data去指向那一片空间的开头。然后我们需要MaxSize记录目前这片空间有多少大。length依旧记录实际存了多少元素。之后都按照动态的写。

### 初始化
```cpp
void InitList(seqList &L)
{
	L.data = (ElemType *)malloc(InitSize * sizeof(ElemType));
	L.length = 0;
	L.MaxSize = InitSize;
}
```
对刚才那3个成员分别初始化。先去开一块空间，那就是malloc，malloc会开你指定数量字节的内存空间，然后给你返回头部指针。C++这里要强转类型。开多少呢，就开初始大小个数据元素的大小，也就是`InitSize * sizeof(ElemType)`。

### 插入
```cpp
// L，i是即将插入的位序（1起），e是需要插入的元素
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
```
返回值是bool，代表操作状态
**合法条件**：什么时候你插入不了？这些条件下状态为0,失败。
1. 插入的位置超出可达范围，原本有length个元素，加一个到length+1个元素，你只能在1到length+1这些位序里面选。
2. 现有存储空间满了，满了还怎么插。在这里的写法中，会直接返回false，不会自动扩展，根据需要可以修改。

如果能插，就开始。由于物理上是顺序存储，你需要插入就得把之后的元素往后移动，腾出位置来放。必须从尾巴开始移动，否则会覆盖。新位置已经拓展到length下标，此处放置原来的最后元素（之前在length-1）.插入的位序是i，下标是i-1,所以最后一次移动是i-1的需要移动到i处。最后i-1腾出来了，把元素e放到i-1的地方。length需要更新，+1.操作成功执行，返回1.

> [!note] 时间复杂度
> 最好：表尾，一个都不移动 O(1)
> 最坏：表头，全都移动 O(n)
> 平均：期望为 O(n)

### 删除
```cpp
// L，i是即将删除的位序（1起），e是即将被删除的元素，提供数据传出
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
```
返回值是bool，代表操作状态
**合法条件**：删除和插入是反过来，不可能会遇到存满的情况，只会遇到没东西删的情况。不不过这种情况会被下标合法范围给筛掉。目前能选的只有1到length可删，其他不行。这个情况操作失败，返回0.

能删，那么就先把要被删的数据救出来，放进e，因为是引用，所以会传出去。
然后就开始删。后面的数据往前覆盖，就能把这个被删的东西覆盖掉，必须从删的位置开始往后。

最后就是长度要更新，-1.操作成功执行，返回1.

> [!note] 时间复杂度（和插入一样的）
> 最好：表尾，一个都不移动 O(1)
> 最坏：表头，全都移动 O(n)
> 平均：期望为 O(n)

### 按值查找
```cpp
int LocateElem(seqList L, ElemType e)
{
    for(int i = 0; i<L.length;i++){
        if(L.data[i] == e){ // 仅适用ElemType为基本类型，否则要重载'=='
            return i+1;
        }
    }
    return 0;//没找到
}
```
函数会用你给的元素数据，从头开始一个个找是不是一样的，找到即返回。

做法就是字面上，从头开始，一个个遍历，如果对应位置和e一样了，就返回位序。位序是下标+1,所以i+1。
循环走了一遍没返回，就说明没有找到，返回0.因为位序不可能是0,所以可以0.

### 拓展长度\*
```cpp
// 把L延长len的长度
void IncreaseSize(seqList &L, int len)
{
	ElemType *p = L.data;
	
	L.MaxSize += len;
	L.data = (ElemType *)malloc(L.MaxSize * sizeof(ElemType));
	
	for (int i = 0; i < L.length; i++) {
		L.data[i] = p[i];
	}
	
	free(p);
}
```
由于数据结构特性和内存管理特性，必须舍弃现在的这些内存，重新开一篇新的。
基本逻辑：开新的->复制数据->删旧的
首先，留下旧区域的头部指针。
随后maxsize加len，拿新的maxsize去malloc，把指针给了data。
然后for循环把length这些数据都复制过去（data现在是新的，之前留了个旧的指针）。
最后，把旧指针那些free了。
### 其他简单内容
```cpp
// 销
void DestroyList(seqList &L)
{
	free(L.data);
}

//查询
// 按位查找
ElemType GetElem(seqList L, int i)
{
    return L.data[i-1];
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
线性表的链式存储实现。或者“存储结构为链式存储的线性表”。数据存储是离散的，一个元素存进一个结点，结点分散在内存的各个角落，用指针联系起来。
### 基本结构定义
#### 结点
链表嘛，每个结点都是一个部分，我们要搞一个结点自己专门的数据结构。命名为`LNode`，即List Node。
```cpp
typedef struct LNode {
	ElemType data;
	struct LNode *next;
} LNode;
```
其中`data`是数据域，`next`是指针域。
> [!important] 注意
> 这里面这个struct声明时自带了一个名字：`struct LNode`，这是因为在LNode这个结构体内部，他需要有一个指向自己这种结构体类型的指针，必须提前设置好一个名字`struct LNode`，否则到定义指针的位置`struct LNode`还没出现，编译器是不认识的。

每个结点都可以画成这样：
![image.png](https://img.alsbb.top/2026/09/585dea4604de0cded1fe56055fd60738.png)
next会指向下一个结点。如果没了那next就是个NULL（用`^`表示）。

#### 头指针
用一个L来指向第一个结点，这样才能让链表开始。所以这个指针应该和next一样，也是指向LNode数据类型的指针。可以把这个头指针（`LNode*`）也给一个类型，作为整个链表的一个化身：
```cpp
typedef LNode *Linklist;
```
这样以后可以用Linklist创建那个L头指针了。
### 带虚拟头结点/不带虚拟头结点
一般我们会选择带一个不存数据的虚拟头结点。
结点是什么？就是头指针指向的第一个节点。但是这个第一个节点是一个特殊的节点，它不存放数据，只是作为一个起点使用，它的下一个结点才是真正意义上的第一个数据结点。

为什么要这样？因为便于很多操作的进行。现在来看看没有虚拟头结点插入数据会怎么样。在链表的大部分地方插入节点的操作都是一致的，让前一个结点指向新的，让新的指向原来前一个节点指向的。但是如果要在第一个位置插入一个节点，因为L指针并不是一个节点的next，而是一个独立的指针，你就需要进行特殊处理，专门为这种情况写一个逻辑。你需要修改这个L本身，和其他的操作逻辑并不统一。如果有那么一个没有数据的虚拟头结点在，L指针不需要动，一直就会定死了，就是指向这个没数据的头结点。插入第一个数据的时候，操作流程也和在其他位置插入的方法是一样的。
![3a35131af50b4d22f9bd20981c76d86d.jpg](https://img.alsbb.top/2026/08/b753ddb9339498713bf8d6281bfe6554.jpg)




### 单链表实现
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
初始化要干两件事，一是把头指针搞好，二是把第一个头结点搞好。

`L=(LNode *)malloc(sizeof(LNode));`去申请了一块结点的内存空间，并让头指针L指向了这块空间。这块空间就是头结点。L的指向以后都不会变了。

由于申请内存是有可能失败的，所以检查一下是不是真的分到内存了，没分到直接返回`false`。分到了继续初始化这个头结点，把头结点的next指针赋成`NULL`，现在这个链表便是空的。

#### 求表长
在搞一些复杂的操作之前，先看看如何做到遍历操作
```cpp
int Length(LinkList L) {
    int len=0;                //计数变量，初始为0
    LNode *p=L;
    while(p->next!=NULL) {
        p=p->next;
        len++;                //每访问一个结点，计数加1
    }
    return len;
}
```
首先我们搞一个指向节点的指针`p`（`LNode*`类型），来标示现在访问的位置，先指向头结点，也就是把L赋值过来。

接下来的循环是关键：`p->next!=NULL`表示，p的下一个不是null，而是有元素的。p在整个循环中，会从头结点移动到最后一个结点，整个移动次数刚好就是链表的长度。p的移动方式是直接把p改成现在这个结点的next。每一次移动附带一次len计数器++。
> [!note] 时间复杂度
> $O(n)$

#### 按位查找
```cpp
// 给一个位序，返回指向该结点的指针
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
**合法条件**：会给一个位序，我们把位序为0定义为找头结点，此外的位序只能在1到总长之间。所以小于0肯定是不行的，先返回个null回去。至于大于总长，因为不知道总长是多少，这个排除只能在后面搞。
依然先搞p指针，初始为头结点（L）。j表示目前到达的位序，初始为头结点（0）。

然后进入循环，和刚才求表长有一些区别，这里`p != NULL && j < i`表示，p只有自己不是null的时候才能往下走。等到p是null了才不行，因为待会要返回p，返回null是正确行为。刚才求表长是等到p的next是null就不能往下走了，因为那个是统计结点数量，p是null根本不是一个结点。

循环一次都不进，而p初始指向头结点，所以返回的就是头结点。

如果i等于总长，那么就会往下走总长次，最后p会停在最后一个位置，返回最后一个结点的指针；i太大，超出总长，在过程中p就变成NULL了，退出循环，返回的也是p，也就是返回NULL，代表找不到，符合预期。
> [!note] 时间复杂度
> $O(n)$

#### 按值查找
```cpp
// 给一个值，返回第一个符合的结点的指针
LNode *LoacteElem(Linklist L, ElemType e)
{
	LNode *p = L->next;
	while (p != NULL && p->data != e) {
		p = p->next;
	}
	return p;
}
```
`LNode *p = L->next;`和上面的不一样，刚才从头结点开始，这个必须是从第一个数据结点开始，因为头结点数据域没东西，调用数据域是未定义行为，你把它纳入搜索范围就错了。
循环的条件是`p !=NULL`，也就是说一遍找下来没找到就会进入NULL以后退出返回p的NULL，代表没找到。如果p数据域匹配了，那返回的p就是要找的这个结点的指针。


> [!note] 时间复杂度
> $O(n)$


#### 插入
这是原本的写法：
```cpp
bool ListInsert(LinkList &L,int i,ElemType e){
    LNode *p=L;                //指针p指向当前扫描到的结点
    int j=0;                   //记录当前结点的位序，头结点是第0个结点
    while(p!=NULL&&j<i-1){     //循环找到第 i-1 个结点
        p=p->next;
        j++;
    }
    if(p==NULL)                //i 值不合法
        return false;
    LNode *s=(LNode*)malloc(sizeof(LNode));
    s->data=e;
    s->next=p->next;           //图2.5中操作步骤①
    p->next=s;                 //图2.5中操作步骤②
    return true;
}
```

但是我们发现可以拆开来：
```cpp
LNode *p=L;                //指针p指向当前扫描到的结点
int j=0;                   //记录当前结点的位序，头结点是第0个结点
while(p!=NULL&&j<i-1){     //循环找到第 i-1 个结点
	p=p->next;
	j++;
}
```
这一部分其实就是刚才的查找，只不过查的是i-1这个结点.
```cpp
if(p==NULL)                //i 值不合法
	return false;
LNode *s=(LNode*)malloc(sizeof(LNode));
s->data=e;
s->next=p->next;           //图2.5中操作步骤①
p->next=s;                 //图2.5中操作步骤②
```
这一部分才是真正的插入操作。
下面，写两种插入操作，然后和按位查找拼在一起。解释理解部分在后面有。
##### 后插
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
这个函数会直接获得一个结点的指针p，直接把那个元素搞进这个结点的下一个就好了。

如果说你获得的这个结点就不存在呢？因为实际上按位查找是可能返回null的。所以你要做`NULL`判断。

插入新结点，就需要先给新结点申请新内存，用s指针去指这一块地方。要检查内存申请有没有成功。

接下来3句最为关键：
`s->data = e;`
好理解，把要插的数据放进新结点的数据域。
`s->next = p->next;`
新结点s的next继承前面结点p的next。就是让旧结点p先把链表的连接信息转交给前面结点s。
`p->next = s;`
前面结点的next正式指向新结点s。

`s->data = e;`放哪里都没关系，因为只是对新结点数据域操作，什么时候干都一样；但是后面两句顺序一定不能反，一定是先把被插的结点的next信息先转移到新结点的next上，再把旧next指向新结点。否则链表的连接信息就会丢失。

> [!note] 时间复杂度
> 这个后插操作都没找东西，时间复杂度直接是$O(1)$

##### 前插
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
    s->next = p->next;
    p->next =s;
    
    s->data = p->data;
	p->data = e;
    return true;
}
```
前面的步骤和后插是一模一样的，，申请新结点空间，指针s，检查申请成功没。接下来不一样，和后插刚好反过来。

这里有个问题：我又不知道给的这个结点前面是谁，怎么能插？都改不了前面那个结点的指针。

实际上你不需要知道。这里做了一招偷梁换柱，先在这个p结点的**后面**插入结点，然后把p的数据移到后面结点里面！于是原来那个p结点的位置就可以给新的结点用了。没有把p结点原先的那块内存留给p，但是效果上就是达到目的了。实质上等于：后插+数据域交换。
![57aa8a654cead62be147304f117d818d.jpg](https://img.alsbb.top/2026/08/aead4d9feaeb330d7485d719a6d9de4f.jpg)
```cpp
s->next = p->next;
p->next = s;
```
和后插完全一致的指针操作，先把前面结点的信息给过来，新的结点指向之前的信息，然后前面结点正式指向新结点。
```cpp
s->data = p->data;
p->data = e;
```
这是差异之处，先把p的数据转移到新结点里，这样p的地盘空出来，把新数据放进老结点p里。成功实现了形式上的前插。在存储形式上仍然是后插。
> [!note] 时间复杂度
> $O(n)$

##### 现在实现插入只要调函数
一般，单链表的插入操作都使用后插（用前插的话你插入最后一个结点怎么办呢？用后插的话，因为有头结点，所以插第一个结点就方便了）

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
这是原本的写法：
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


和插入那里一样，可以拆成2个部分，一个是找结点，一个是执行删除操作。这里已经把getelem函数用进去了。可以写一个删除结点的函数，但是你很快会发现问题，往下：
##### 删除结点
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
由于给的p是想让你删的结点，我们没办法让前面的结点的next改变，也就是不能按照后插的那种逻辑，只能用前插的逻辑来实现删除。

q获取下一个结点的指针，然后用下一个结点的数据覆盖掉当前结点的数据，然后让本结点跳过q，指向q的next。形式上我们把p的数据删掉了，但是存储形式上，其实是把q这个结点扔掉了，p的结点用来存q了而已。一定要记得释放q的内存！！！！！

明显的问题出现了，那就是由于前插的局限性，这个函数无法删除链表末尾最后一个结点。最后一个结点指向NULL，NULL根本不是一个结点，怎么能让NULL来覆盖它呢？而且要删除的话，一定要修改上一个结点的next，使其指向NULL，修改未知结点无法绕过了。这时你别无他法，只能从头开始遍历链表。

所以这也能看到单链表的缺陷，如果是双链表（可以反向追溯），就没这事情。

##### 现在实现插入只能调1个函数
所以说，只能按照原来的写法走。原来的写法是找到了要删的结点的前面一个结点p，然后下面要干的就是删掉p后面这个结点。
```cpp
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
```
getelem可能返回null，那就是p根本不存在，直接false退出。

给p的下一个结点一个指针q，q是我们要删的结点。

找p结点的时候，p不是null就好。但是我们要删p后面的结点啊，所以如果p后面根本没有结点，或者说q是null的话，也就没什么好删了，也是直接false退出。

接下来就可以开始删除：转移数据到e，e可以借助引用传出；然后p的next直接跳过q结点，指向q的next；最后释放q内存。


##### 我的看法
这是按照一套网课的教法写的。实际上我觉得也可以写成2个函数，因为前面插入的时候调用的是后插函数。那我这里也应该调用后删函数，这里这个删除自身的函数确实是用不了的。只不过后删函数有点奇怪，单独写成函数也确实没有什么意义。



#### 单链表的构建
单链表的操作已经实现了，现在有数据，怎么让数据变成一个链表？

答案是不断地进行插入。两种方法：头插法、尾插法。

头插法就是把已有的数据按照**倒序**一个个插入到头结点之后。这样最终的顺序是正序的。

尾插法就是记录最后一个结点的指针，不断在最后一个结点后正序插入结点。

利用头插法，**可以实现链表的逆置**。
### 双链表

双链表就是在单链表的基础上加了一个指针域prior，指向前一个结点：
```cpp
typedef int ElemType;
typedef struct DNode {
	ElemType data;
	struct DNode *prior, *next;
} DNode, *Dinklist;
```
双链表一样有一个不存数据的头结点。链表指针永远指向头结点，头结点的prior永远指向NULL，next指向第一个数据结点。

其他的操作和单链表基本相同，就是多维护一个prior指针。前插操作可以简化为先用prior找到前一个结点，然后做后插操作。

注意被操作结点为最后一个结点的特殊情况，此时后面没有结点，不需要维护后面一个结点的prior指针。

### 循环链表

在普通的链表基础上加一个特性：尾结点的next不再指向NULL，而是指向头结点（单/双链表）；头结点的prior不再指向NULL，而是指向尾结点（双链表）。这会让整个链表形成环状结构，使得你可以更加灵活地访问其中的元素。

#### 判空
如果`L->next == L`成立，那就是空

#### 判断p是头结点还是尾结点
如果`p == L`,（L一直指向的是头结点）那就是头结点；如果`p -> next == L`（只有尾结点的下一个是头结点），那就是尾结点。

### 静态链表
一种特殊的单链表实现：开辟一块连续的内存空间作为结点数组，大小固定，然后每个结点的next都是一个数组下标，不是一个真正的指针，指向下一个结点对应的数组下标，最后一个结点的next存为-1,代表后面没有元素。空元素可以在next处用特殊数据进行标记，比如空元素的next都是-2,以便后续的识别。
```cpp
typedef struct{
	int data;
	int next;
} SLinkList[MaxSize];
```
（定义了一种类型，名字叫`SlinkList`,实际上是一个由没有名字的结点结构体组成的数组。）

初始化的时候会把0作为头结点，next-1,剩下所有结点next都是-2.

插入结点的时候，需要扫描一遍所有的结点空间，发现一个next是-2的，那就代表这里是空的，拿来作为新结点的存放位置，这相当于之前`malloc`的操作。


## 如何选择顺序表和链表？

如果数据长度可预估，需要进行大量查询操作，用数据表。

如果数据长度不可预估，需要进行大量插入删除操作，用链表。
