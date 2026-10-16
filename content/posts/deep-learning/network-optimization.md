---
title: 神经网络优化方法
description:
date: 2026-10-16T15:25:27
lastmod: 2026-10-16T15:25:27
cover:
categories:
  - 深度学习
tags:
  - 
ai:
math: true
layout:
pinned: false
weight: 10
tocStartLevel: 2
tocEndLevel: 4
comment: true
---
这个随机梯度下降法（SGD）是为了让损失函数取得尽可能小的值。解决这个问题的过程叫最优化。SGD是最优化的方法的其中之一。还有其他的方法。

optimizer：优化器

我们可以把不同的优化器封装成类，然后都提供update这样统一的方法，这样要就只需要更换优化器就可以实现切换最优化方法。
SGD的问题是，在面对非均向的损失函数的时候，效率很低，容易在变化剧烈的地方走过头，回过头来调整。

## Momentum优化器

动量。
加入了一个速度的概念，梯度先作用在速度上，再让速度作用在参数上。$\alpha \boldsymbol{v}$的这个系数代表摩擦，使得不受力的时候会停下来。
$$
\begin{align*}
\boldsymbol{v} &\leftarrow \alpha \boldsymbol{v} - \eta \frac{\partial L}{\partial \boldsymbol{W}} \\
\boldsymbol{W} &\leftarrow \boldsymbol{W} + \boldsymbol{v}
\end{align*}
$$
## AdaGrad优化器
Adaptive Gradient
h收集以前所有梯度值的平方和。然后把$1/\sqrt{h}$乘SGD里的学习率，这样实际的学习率会越来越低。
$$
\begin{align*}
\boldsymbol{h} &\leftarrow \boldsymbol{h} + \frac{\partial L}{\partial \boldsymbol{W}} \odot \frac{\partial L}{\partial \boldsymbol{W}} \\
\boldsymbol{W} &\leftarrow \boldsymbol{W} - \eta \frac{1}{\sqrt{\boldsymbol{h}}} \frac{\partial L}{\partial \boldsymbol{W}}
\end{align*}
$$

## Adam优化器
融合AdaGrad与Momentum的特点。但是书讲起来这个方法比较复杂。*TODO：决定是否研究其原理*


## 优化器没有最好的
目前为止，一共有了`SDG`、`Momentum`、`AdaGrad`、`Adam`4种优化器。

不是说后面的就一定优于前面的，要根据具体的去选择。




不可以把权重初始值设定为0,这样反向传播的时候，所有的权重都会进行相同的更新。为了瓦解权重的对称结构，我们使用高斯分布（自然分布）来给权重赋初值。


初值赋的小，可以抑制过拟合，提高泛化能力，这在之后他才会讲。


梯度消失。

在这一次，我们使用随机生成的权重，随机生成的输入数据，输入使用sigmoid作为激活函数的神经网络，观察每一层的激活值。我们发现，几乎都是靠近0和1,中间的值很少。

这是为什么呢，这是因为sigmoid的一个特性：
![image.png](https://img.alsbb.top/2026/10/d528ac83448c02ba3260adbe45325556.png)
可以发现，sigmoid在两侧逐渐平缓，靠近0和1，导数值也很小。sigmoid函数会让输出一次又一次地向0和1靠拢，这会导致在后续的反向传播的时候，因为sigmoid的导数值小，梯度也慢慢减小，最后传到前面直接消失，最开始的几层根本学不到东西，这就是梯度消失。层数越多，梯度越容易消失。


如果把随机生成的权重的标准差采用0.01，情况又不一样，所有的激活值全都集中在0.5.这是因为初始的随机值分配的标准差太小，几乎都分布在0.5，这样每一层都基本上不变。没有梯度消失的问题。但是这整个网络的行为几乎一致，那么多层神经网络就没有什么意义，“表现力受限”。


怎么解决呢？Xavier初始值。
如果前一层的节点数为 n，则初始值使用标准差为$\frac{1}{\sqrt{n}}$的分布。
采用这个分布的时候，激活值有了更有广度的分布，进行学习的效果就会更好。


这个Xavier初始值是以激活函数为线性函数为基础推导出来的。sigmoid函数在中心近似于线性函数，所以适用这个初始值。

对于ReLU激活函数，其对应的初始值是He初始值。



batch normalization


增大学习率
不依赖初始值
抑制过拟合


思路是直接强制调整各层的激活值来确保其拥有合适的广度。需要在affine层和激活函数层间，插入batch norm层。

以学习使用的minibatch 为单位，按minibatch进行正规化。首先就是标准化，对齐到0,统一方差，就是概率统计那一套，然后使用两个参数进行缩放平移：
$$
y_i \leftarrow \gamma \hat{x}_i + \beta
$$
$\gamma$和$\beta$都是内置参数，会使用反向传播随着学习而变化。内部机制比较复杂。



## 正则化

用于对抗过拟合：

权值衰减。对学习过程中出现的过大权重进行惩罚。具体做法是在损失函数的最后加一个$\lambda$乘权重的L2范数的平方（各个权重平方和再开根再平方，就是各个权重的平方和）。$\lambda$是用于控制正则化强度的参数。也就是$\frac12\lambda \boldsymbol{W}^2$ .二分之一是为了在反向传播的时候求导方便。

dropout。网络很复杂的时候，权值衰减的作用有限。dropout会随机挑选隐藏层的神经元删除（禁止进行正向传播）。

## 超参数
各层神经元数量、batch大小、学习率、权值衰减等

调超参数会再分出来一部分数据，用作验证数据，独立于训练数据和测试数据之外。

实践性的方法：
设定超参数的范围，然后随机找，跑一下训练数据学习，使用验证数据看看精度，然后逐步缩小范围。

另外偏理论一点的可以用贝叶斯最优化