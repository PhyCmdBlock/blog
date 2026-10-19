---
title: 神经网络
description:
date: 2026-10-14T09:08:35
lastmod: 2026-10-14T09:08:35
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
> [!note] 不适合阅读
> 本文更像一个草稿，只对我自己有意义。


引入激活函数。

在感知机里面，决定输出是1还是0的，是计算结果大于0还是小于等于0。这本身就是一个函数。
$$
h(x)=
\begin{cases}
0 & (x \le 0) \\
1 & (x > 0)
\end{cases}
$$
因此，感知机可以表达为
$$
y = h(w_1x_1+w_2x_2 + b)
$$
激活函数这个名字，意思便是他决定了神经元是如何激活的。

## 阶跃函数
刚才这种函数叫作阶跃函数。在python里可以如下实现：

```python
def step_function(x):
	y = x > 0
	return y.astype(int)
```
这个函数可以接受一个numpy的数组。x>0会生成一个bool类型的数组y，每个元素的true/false代表x的元素是不是大于0.但是这个bool类型的数组不是我们要的，我们需要一个0和1的数组，那很简单，进行类型转换，astype函数即可做到，元素都被转换为了`int`型（原书的`np.int`已经被numpy废弃！）。

可以写的更短,且更通用：
```python
def step_function(x):
    return (x > 0).astype(int)
```
或
```python
def step_function(x):
	return np.array(x>0, dtype=np.int)
```
## sigmoid激活函数


$$
h(x) = \frac{1}{1+exp(-x)}
$$
python实现：
```python
def sigmoid(x):
	return 1 / (1 + np.exp(-x))
```
x是numpy数组的时候，np.exp()和里面的负号依然可以正常计算。之后的加法和触发是numpy的广播功能的体现，标量会被广播计算，应用于数组的每一个元素。


## sigmoid和阶跃
更平滑，而不是突然变化。

但两者都是上下界在1和0,且x值越大，激活函数值越大（输入的值越大，产生的影响越大）
![image.png](https://img.alsbb.top/2026/10/93e94da928b8789497e23bd0bebd91e4.png)

![image.png](https://img.alsbb.top/2026/10/d528ac83448c02ba3260adbe45325556.png)


### 为什么使用非线性函数

阶跃函数和sigmoid都是非线性函数。如果使用线性函数，那么神经网络的多层就失去意义了。无论怎么加层，在数学上，都是可以有等效的单层网络与之等效。

## ReLU函数
Rectified Linear Unit

python实现：
```python
def relu(x):
    return np.maximum(0, x)
```
0和x之间的最大值。
![image.png](https://img.alsbb.top/2026/10/a1b8e1bd35b650afbf9e9830fe15dc82.png)

## 矩阵乘法

A是2\*3矩阵，B是3\*2矩阵.
进行矩阵乘法的方法是`np.dot(A, B)`.这个矩阵乘法就是线性代数里那个乘法

如果矩阵型号不匹配会导致numpy报错。

`ValueError: shapes (2,3) and (2,2) not aligned: 3 (dim 1) != 2 (dim 0)`（矩阵的第一维和矩阵的第零维不一样）

实际上，可以和一维数组进行矩阵乘法，它把一维数组当作一个列向量操作的。

## 神经网络内积

![image.png](https://img.alsbb.top/2026/10/1ae00293fbdae8c6347129a1fc139d7e.png)

整个x部分是一个向量`[x1,x2]`。整个y部分也是一个向量`[y1,y2,y3]`
省略偏置和激活函数，我们看权重是怎么搞的。


$$
\begin{pmatrix}
x_1 & x_2
\end{pmatrix}
\begin{pmatrix}
1 & 3 & 5 \\
2 & 4 & 6
\end{pmatrix} =
\begin{pmatrix}
y_1 & y_2 & y_3
\end{pmatrix}
$$

```python
X = np.array([1, 2])
W = np.array([[1, 3, 5], [2, 4, 6]])
Y = np.dot(X, W)
```


## 符号规定
输入层：$x_1$
- 右下角的1表示，这是输入层（第0层）的第1个神经元。
权重：$w^{(1)}_{12}$
- 右上角的1表示，这是第1层的（在约定中，权重的归属是目标层，也就是说这个权重是使用第0层神经元的数字乘，然后获得第1层神经元的数字，那么它属于第1层神经元）权重。
- 右下角第一个数字1表示，目标层的第1个神经元。
- 右下角第二个数字2表示，来源于前一层的第2个神经元。
偏置：$b^{(1)}_1$
- 右上角的1表示，这是第1层的偏置（归属的解释同权重）。
- 右下角的1表示，目标层的第1个神经元。
- 右下角不可能有第2个下标，因为前面一层只可能有一个偏置神经元。
中间层：$a^{(1)}_1$ 
- 右上角的1表示，这是第1层的神经元。
- 右下角的1表示，这是这一层的第1个神经元。
输出层：$y_1$
- 右下角的1表示，这是输出层的第1个神经元。




输入层到第1层：

$\bf{A}^{(1)} = \bf{X}\bf{W}^{(1)}+B^{(1)}$


即：

$$
\big(a_1^{(1)}\quad a_2^{(1)}\quad a_3^{(1)}\big)=\big(x_1\quad x_2\big)
\begin{pmatrix}
w_{11}^{(1)} & w_{21}^{(1)} & w_{31}^{(1)} \\
w_{12}^{(1)} & w_{22}^{(1)} & w_{32}^{(1)}
\end{pmatrix}
+
\big(b_1^{(1)}\quad b_2^{(1)}\quad b_3^{(1)}\big)
$$

激活函数。激活函数处理以后的神经元用z表示。其他和a一样。


对于输出层的激活函数，在回归问题中，我们一般使用`identity_function()`，表示为$\sigma()$,即恒等函数，这是为了和之前的处理统一。
在分类问题中，使用`softmax`函数。
$$ y_k = \frac{\exp(a_k)}{\sum_{i=1}^{n}\exp(a_i)} $$
```python
def softmax(a):
	exp_a = np.exp(a)
	sum_exp_a = np.sum(exp_a)
	y = exp_a / sum_exp_a
	return y
```

这个可能会产生溢出问题。可以在e的指数里面同时加一个常数，这不会影响结果的正确性。加入的常数可以帮助解决溢出的问题。比如可以减去输入信号里的最大值。
```python
def softmax(a):
	c = np.max(a)
	exp_a = np.exp(a - c) # 溢出对策
	sum_exp_a = np.sum(exp_a)
	y = exp_a / sum_exp_a
	return y
```

softmax函数为什么可以用于分类？因为加起来是1.这样可以把输出结果解释为概率。

如果说你不需要其他的结果，只取一个最大概率的作为结果，那么softmax函数也是可以省略的

接下来是书作者搞的一个手写数字的识别。这些代码可以在我的deeplearning代码库里看到。`deeplearning/dlfs/dataset`下，`mnist.py`用于下载数据，里面另外还提供了一个加载数据集的函数，可供调用。

`dlfs/ch03/mnist_show.py`是一个用来检查数据下载的对不对的代码，会打开手写数字的图片。

`dlfs/ch03/neuralnet_mnist.py`是使用已保存的权重与偏置（`dlfs/ch03/sample_weight.pkl`），对数据集的test部分进行预测，并评判准确率的代码。
`dlfs/ch03/neuralnet_mnist_batch.py`和`dlfs/ch03/neuralnet_mnist.py`几乎一样，唯一的区别是加入了批次的概念，进行批处理，每次处理batch_size个图像，有助于更快地运行。

学习


训练数据和测试数据。
用训练数据训练模型，用测试数据评价模型能力。
目的：模型的泛化能力。能够正确处理学习过程中从未出现过的数据。
过拟合。


损失函数。loss function
离答案偏的越多，越大。
常用均方误差，交叉熵误差

均方误差MSE(L2损失)
单个输出的均方误差：k是输出数据的维数。t是训练数据。
$$E = \frac{1}{2}\sum_{k}(y_k - t_k)^2$$
```python
def mean_squared_error(y, t):
	return 0.5 * np.sum((y-t)**2)
```
在分类里面把正确答案的tk设为1,其他的tk设为0,叫作one-hot表示

交叉熵误差
$$E = -\sum_{k} t_k \ln y_k$$
有时对数会写成log，但就是ln。
“交叉熵误差的值是由正确解标签所对应的输出结果决定的。”

```python
def cross_entropy_error(y, t):
	delta = 1e-7
	return -np.sum(t * np.log(y + delta))
```
加个小量是为了防止y=0的时候算不了ln。


mini-batch训练
$$E = -\frac{1}{N}\sum_{n}\sum_{k} t_{nk} \log y_{nk}$$
一个批次的数据量为n，我们把整个批次的数据的平均损失函数作为学习指标。

从整个数据集选一部分出来，作为整体的近似。

为什么使用损失函数？为什么不用识别精度作为目标函数？
识别精度的颗粒度太粗了，损失函数可以在识别结果相同的同时，体现出模型微小的变化。损失函数连续变化，可以求梯度，识别精度会有不连续、阶跃的部分。

sigmoid相比阶跃函数的优势就是，连续，灵敏，可求导。





数值微分

现在想要让计算机求导。
高数里面那种公式求导，标准讲叫解析性求导，不含误差，但是很难求。
数值微分：用微小的差分去求导。就是导数定义式里让h比较小，直接算那个式子。
数值微分含有误差。我们可以用f(x+h)和f(x-h)来求中心差分来减小误差。
```python
def numerical_diff(f, x):
	h = 1e-4 # 0.0001
	return (f(x+h) - f(x-h)) / (2*h)
```

梯度
由全部变量的偏导数汇总而成的向量。
```python
def numerical_gradient(f, x):
	h = 1e-4 # 0.0001
	
	grad = np.zeros_like(x) # 生成和 x 形状相同，所有元素都为0的数组
	for idx in range(x.size):
		tmp_val = x[idx]
		# f(x+h) 的计算
		x[idx] = tmp_val + h
		fxh1 = f(x)
		
		# f(x-h) 的计算
		x[idx] = tmp_val - h
		fxh2 = f(x)
		
		grad[idx] = (fxh1 - fxh2) / (2*h)
		x[idx] = tmp_val # 还原值
	return grad
```

负梯度会指向各点处函数值下降最快的方向。



可以利用梯度的特性让损失函数下降。使用梯度函数来让损失函数找到最小值。
一般在深度学习里面，梯度法指的是梯度下降。

向着梯度方向更新参数：
$$
\begin{aligned}
x_0 &= x_0 - \eta \frac{\partial f}{\partial x_0} \\
x_1 &= x_1 - \eta \frac{\partial f}{\partial x_1}
\end{aligned}
$$
yita是学习率，决定一次学习中要走多少。
yita太大和太小都不合适，一般会在学习的过程中自动动态改变。
```python
def gradient_descent(f, init_x, lr=0.01, step_num=100):
	x = init_x
	for i in range(step_num):
		grad = numerical_gradient(f, x)
		x -= lr * grad
	return x
```
step_num指定学习多少次，lr指定学习率。

学习率这种参数需要人工设定初始值，属于超参数。

可能会遇到局部的极小值而不是最小值，这时候就会陷入学习的停滞，被困在这个局部的槽里面了。


随机选择的minibatch，因此叫作“随机梯度下降法”(SGD)



经过反复学习，确实可以让loss越来越低。但是这只是对于这个minibatch而言的。我们需要定期对训练数据和测试数据记录识别精度。epoch是一个单位，指的是整个训练数据都被使用一轮。每经过一个epoch，记录一次。比如minibatch的批次大小是100,训练数据总共10000，那么可以分成100个minibatch，对于每个minibatch做SGD，做100次SGD，就是一个epoch。




误差反向传播法

数值微分算梯度，计算复杂度高，非常的耗费时间，为了降低计算量，我们使用误差反向传播法。



”从左到右“进行计算：正向传播。而与之相反的叫 反向传播。



反向传播基于链式法则。

链式法则就是那个求导的链式法则。
假如一个x，经过一个结点f，进行计算f(x)，获得了y。那么如果我要求后面的东西关于前面某个数据的偏导，在遇到这个结点f的时候，数据到这里是E，那么我可以让E乘上$\frac{\partial y}{\partial x}$，然后继续往回传播。基于链式法则，这样子的偏导在中间都可以约掉，最终就是后面的一个量关于前面某个量的偏导。

下面的图展示了这个过程的原理。

![c2bd87eff26a1ff88bc5c96a462a8947.jpg](https://img.alsbb.top/2026/10/3d5758bbce26a40b8fd3974e087adbe0.png)


很容易发现，一些反向传播需要保存当时这个地方进来的其他值。

我们可以把每个运算都实现成一个类，提供forward和backward2个类，对象自己会存储到时候反向传播需要的量。forward接受前面层进来的结果，进行正常计算，传给下一层。backward的时候从后面层传入部分偏导结果，进行本层运算的偏导数叠加，再传递回前面层。


加法可以实现一个加法层，乘法也可以实现一个乘法层。`dlfs/ch05/layer_naive.py`

神经网络里面还有激活函数，所以激活函数也得做一个前后向传播层的类。`dlfs/common/layers.py`之`class Relu`和`class sigmoid`

注：sigmoid的反向传播，sigmoid对x的导数最后被精简为y(1-y)，可以数学上证明一下。


下面要去处理神经网络里面矩阵乘法的那些部分了，它们怎么搞出反向传播来呢？这就是Affine层的实现。（矩阵的乘积运算可以被看作仿射变换，因此这个名字）

Affine层全是矩阵，之前都是标量，标量偏导起来熟悉，但是矩阵的偏导：
$$
\frac{\partial L}{\partial \boldsymbol{X}} = \frac{\partial L}{\partial \boldsymbol{Y}} \cdot \boldsymbol{W}^\mathrm{T}
$$
$$
\frac{\partial L}{\partial \boldsymbol{W}} = \boldsymbol{X}^\mathrm{T} \cdot \frac{\partial L}{\partial \boldsymbol{Y}}
$$
或者说
$$
\frac{\partial \boldsymbol{Y}}{\partial \boldsymbol{X}} = \boldsymbol{W}^\mathrm{T}
$$
$$
\frac{\partial \boldsymbol{Y}}{\partial \boldsymbol{W}} = \boldsymbol{X}^\mathrm{T}
$$
暂时没想到好的直观理解方式（*TODO*）。从型号上这个转置是完美匹配的，但为什么是这个X和W本身，需要看逐个元素的推导。总之可以记住。


另外，这个偏置是一维的，但实际上是加到每个数据上的。所以在求偏导的时候每个数据都和这个偏置有关。需要把每个数据的同一个地方传下来的值加起来，作为这个位置对偏置的偏导。`self.db = np.sum(dout, axis=0)`体现这一点。

`dlfs/common/layers.py`之`class Affine`。

现在介绍softmax层

此处再解释了推理和学习两个阶段。实际上推理的时候我们只对那个最大值感兴趣，所以一般不用softmax层。但是学习阶段需要softmax层。

由于softmax以后一般就是直接开始求损失（交叉熵损失），所以干脆把这两个东西合在一起，叫softmax-with-loss层。

这个层稍微有点复杂的。过程都省略，最后告诉你从损失函数求导到softmax前的原输出层，偏导等于$y_i-t_i$，$y_i$是softmax的输出，$t_i$是one-hot的训练数据，你会发现这个值刚好就是当前网络的输出和标准答案的差距。

为什么是刚刚好这样？不是偶然的，是为了得到这样的结果特意使用了交叉熵误差。如果输出层使用恒等函数，损失函数就得使用平方和误差，然后就又可以得出$y_i-t_i$这样的结果了。

`dlfs/common/layers.py`之`class SoftWithLoss`。



现在来看一下使用了反向传播的神经网络的全貌

首先是原本的输入数据，前向传播，我们从输入层输入数据。然后来到了网络第一层，经过Affine1层，再经过一层激活函数（ReLU层），然后来到了网络第二层，还是经过Affine2层，再经过一层和、激活函数层（ReLU层），一直搞搞搞，最后一层是输出层，经过了Affine层以后，不是直接进入激活函数层，因为激活函数和损失函数合成了Softmax-with-loss层，进入。最后得到了loss。然后，开始反向传播，按照上面完全相反的顺序，回到之前的每一个W、B里的参数，取得偏导，使用偏导和学习率，对参数进行梯度下降，完成一次学习。

这样，反向传播就正式运用于神经网络。但这也不代表数值微分没用了，它还能用来你写代码的时候检查你的反向传播写的对不对。这个确认数值微分和误差反向传播的梯度结果是否一致的过程叫梯度确认。
