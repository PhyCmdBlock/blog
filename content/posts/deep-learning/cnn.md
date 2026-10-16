---
title: CNN
description: 卷积神经网络
date: 2026-10-16
lastmod: 2026-10-16
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
## 结构

图像识别、语音识别。主要是图像识别

和普通的神经网络几乎是一样的。

但是CNN的网络有一个地方不一样，它会在整个网络前面加一些特殊的层级。每一层里面依次包含Conv层、ReLU层、Pooling层。

在靠近输出的层是熟悉的Affine+ReLU组合，以及输出是Affine+Softmax。

## Conv层（卷积层）
我们普通的神经网络在处理有形状的数据存在一个问题。比如你在输入一个图像的时候，要把二维数据flatten成一个一维的序列，这使得网络把这个二维的关系忽略掉了。这个二维形状本身应当含有重要信息。

对于一般的图像更加，一般图像是3维数据（长、宽、颜色通道）