---
title: Verilog语言
description: 简明的verilog，拒绝垃圾讲课
date: 2026-10-13
lastmod: 2026-10-13
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
> [!note] 半成品
> 本文尚未完工。

verilog实际上不是一个编程语言。它属于Hardware Description Language即HDL，硬件描述语言，说简单的就是这个语言能够决定电路长成什么样，而不需要你真的去面包板上把那些逻辑门插好，你只需要在这里面写个代码，硬件的形状就能出来。至于怎么做到的先别管，反正这是verilog的最初认知。
## module
你就把它当作一个有输入输出引脚的芯片。这个芯片的功能、布线完全由你在module里写了什么决定。

module是一种模板。说明完芯片怎么长以后，你可以到处使用，随心创建一个芯片出来，每个芯片都长得和你定义的一样。这个感觉类似于你在C++里声明了一个类，然后在别的地方创建对象（使用实例），而不是定义了一个函数去调用。

### 怎么写
这是一个module的样子：
```verilog
module my_gate(iA,iB,oC);
    input iA, iB;
    output oC;
    
    and and_inst(oC,iA,iB);
    
endmodule
```
其中，`module my_gate(iA,iB,oC);`和`endmodule`包括了一个区块。就跟大括号一样，这里面的是module的内容。my_gate就跟类名一样，是这个模块的名字。括号里的是这个模块的几个引脚，是与外接连接的端口。

```verilog
input iA, iB;
output oC;
```
声明了这些引脚的形态，是输入还是输出。

```cpp
and and_inst(oC,iA,iB);
```
这便是实现与门的核心逻辑。但是，这其实就是一次对模块的使用，我们并没有自己写一个表示”与“的逻辑，而是使用了现成的模块。`and`是模块名，这个模块是verilog内置的。`and_inst`是这个模块实例化以后的名字（就好像某个类的对象的名字），`(oC,iA,iB)`就把这个与门的引脚和我们自己定义的模块的引脚连接起来了。oC、iA、iB都连接到这只与门上，这只与门便可以发挥作用。


这种写法其实就是脱裤子放屁。但是我们可以用很多这样的门，在我们自己定义的模块内部进行”接线“，来实现各种纯逻辑计算（组合逻辑）。这种放几个门的写法就是”结构化描述“/”门级描述“。

### 数据流描述
```verilog
module logic_gates_2(iA,iB,oAnd,oOr,oNot);
    input iA, iB;
    output oAnd,oOr,oNot;

    assign oAnd = iA & iB;
    assign oOr  = iA | iB;
    assign oNot = ~iA;
endmodule
```
内部出现了一种语句：`assign`。
这个`assign`叫”连续赋值“。我们知道赋值是一次性的，数据过来，但是这个`assign`会在实例存在的过程中一直生效，里面任何一个量的值改变都会引起计算。可以理解为，assign就是强制让这些量永远满足一个关系，不管他们怎么变。

### wire和reg
这是两种量的类型。wire表示导线，连接线。可以理解为这个量是电路里的一条导线，导线上的值完全依赖一个驱动的输出，输出是什么导线就是什么。reg名字上叫作寄存器，更像变量的特性，在过程中reg里的值会保留，除非主动改变，否则不会发生变化。

所以这里也可以看出assign只能用于wire的赋值，只有wire是可以这样被一直赋值的，reg不能。

模块的那些接口都是一个量，在不定义类型时，默认为wire类型。
```verilog
input iA, iB;
output oC;
```
所以事实上这里面iA,iB,oC都是wire类型.iA和iB由使用模块实例的地方提供输入作为驱动。oC由模块里自己实现的来做驱动。

如果要让接口是reg类型则需要手动指定，比如下面的这个3个输出都是reg类型。
```verilog
module logic_gates_3(iA,iB,oAnd,oOr,oNot);
    input iA, iB;
    output reg oAnd,oOr,oNot;

    always @(*)
    begin
        oAnd = iA & iB;
        oOr  = iA | iB;
        oNot = ~iA;
    end
endmodule
```
这个代码后面的东西之后再研究，时序逻辑的时候继续深入。
### 数据位宽
```verilog
module selector41(
    input [3:0] iC0,
    input [3:0] iC1,
    input [3:0] iC2,
    input [3:0] iC3,
    input iS1,
    input iS0,
    output [3:0] oZ
);
    assign oZ = iS1 ? (iS0 ? iC3 : iC2)
                     : (iS0 ? iC1 : iC0);
endmodule
```
`input [3:0] iC0;`表示这个iC0不是单根wire，而是4根线组成的总线，可承载4位二进制。




