---
title: 面向对象程序设计-文档作业-cin
description: W0401-cin成员函数的使用
date: 2026-10-12
lastmod: 2026-10-12
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
## EOF
eof不是一个文件末尾存放的字符。它是一个系统的反馈，当你读一个文件读完所有的字符的时候，程序仍然尝试读取，那么系统会给他一个EOF。比较多的情况是EOF被定义为-1,一定定义为负的int。

### Windows控制台下按Ctrl+Z
如果前面有字符，加这个`^Z`，控制台会理解为char`0x1A`，并输入该字符。然后截断该行输入，该行后续输入(包括`\n`)将不再提供给程序，最后一个输入的字符就是`0x1A`，直到新行开始才会有新的输入。

如果是新行直接^Z回车，控制台认为整个输入已经结束，文件到达末尾。程序如果尝试进行输入，会返回一个EOF。

## cin.get()
### 读一个字符
```cpp
int get();                    // 不传参数：直接返回字符值，读不到则返回 EOF
std::istream& get(char& c);    // 传入字符变量：把字符写进 c，返回输入流自身
```

### 读一些字符
```cpp
std::istream& get(char* s, std::streamsize n, char delim);
std::istream& get(char* s, std::streamsize n);  // 省略分隔符的重载，按 '\n' 停止
```
- s是目标字符串，n是最大写入字符数量（包括尾零，所以实际上会最大读取n-1个实际字符），delim是中止字符。
- 遇到delim字符就停止读取，且**不去**把这个字符取走，**留在**输入流。
- 写入字符数量达到最大以后，自动停止读取，没读的字符也不动，留在输入流。
## cin.getline()
读一些字符。
```cpp
std::istream& getline(char* s, std::streamsize n, char delim);
std::istream& getline(char* s, std::streamsize n);  // 省略分隔符的重载，按 '\n' 停止
```
- s是目标字符串，n是最大写入字符数量（包括尾零，所以实际上会最大读取n-1个实际字符），delim是中止字符。
- 遇到delim字符就停止读取，且**会**把这个字符取走，**不留在**输入流。
- 写入字符数量达到最大以后，自动停止读取，**认定读取失败，将failbit置1,需要手动置0.** 没读的字符也不动，留在输入流。

## cin.eof()
返回eofbit的值。
```cpp
bool eof() const;             // 返回 true 或 false；不读取字符
```
> *提示：成员函数最后加const表示成员函数不会修改所在对象*

eofbit这个位是1就代表文件已经结束。任何包含尝试读取、查看的函数如果发现继续读取读到的是EOF，都会去置eofbit。没人尝试读，即使下面一个就是EOF，那么eofbit也不会是1.

老师代码：
```cpp
while (!cin.eof())
   if ((c=cin.get())!=' ')
	  cout.put(c);
```
该代码存在错误。因为在最后一个字符被读取以后，由于还没有人去尝试继续往下得到eof，目前eofbit还是0,所以cin.eof()还是0,循环依旧进行一轮，会读取一个EOF（此时eofbit才被置1）并把EOFput出来,然后循环才退出。

如果想要做到预期的行为：
```cpp
while (cin.get(c)) {
    if (c != ' ') cout.put(c);
}
```
在循环条件里调用了一次get，c获取到字符，eofbit也一定是被正确看过了，EOF不会被put出来。

## cin.putback()
往缓冲区中放回一个字符。
```cpp
std::istream& putback(char c); // 参数是要放回的字符；返回输入流自身
```
比如缓冲区已经有`abc\n`,get2次，第一次读'a'，第二次读'b'，缓冲区剩了`c\n`。此时`putback(2)`会让缓冲区变成`2c\n`，再`putback(1)`会让缓冲区变成`12c\n`。可见是还原上一步的读取。再`putback(0)`会失败，因为这之前根本没读过，置`badbit`。

- 某些只读缓冲区不允许putback成不一样的字符，必须原模原样，否则置badbit。

- putback()在eofbit被置的情况下放回，会把eofbit还原。
- 前一次读取就是失败的，置过了failbit，那么无法正常回退。


## cin.ignore()
丢弃缓冲区的字符。
```cpp
std::istream& ignore(
    std::streamsize n = 1,                      // 默认最多丢弃 1 个字符
    int delim = std::char_traits<char>::eof()   // 默认不使用普通字符作为分隔符
);
```

往后一直取出缓冲区的字符并扔掉，如果数量达到n，或者遇到了delim字符，就停止扔。delim字符算在n里，遇到的delim才停的情况也会把delim字符扔掉。