---
title: SSH连接远程主机
description: 如何使用Secure Shell连接远程主机
date: 2026-07-15
lastmod: 2026-08-17
cover: /hero/tt7.webp
categories:
  - 软件
tags:
  - linux
  - shell
ai:
math: false
layout:
pinned: false
weight: 10
tocStartLevel: 2
tocEndLevel: 4
comment: true
---
## WSL连我平板上的Debian
### Debian的bash内
1. 安装包前工作
```sh
sudo apt update && sudo apt upgrade
```
 
2. 安装包
```sh
sudo apt install openssh-server
```
3. 修改端口（如果你的是一个独立的机器，那不用改）
> 由于容器没有root权限，不能开在22端口，需要修改为其他端口，我们开在2222端口

修改`/usr/etc/ssh/sshd_config`。`#Port 22`改成`Port 2222`

4. 启动ssh服务
```sh
sudo /etc/init.d/ssh start
```
可以通过`ps aux | grep sshd`来看看有没有真启动

5. 设置密码（如果你的是一个独立的机子，那不用管）
```sh
passwd
```
### 平板上其他操作
1. 查看手机在局域网内IP（192.168.1.105）
可以在`设置-WLAN`，选择已连接的网络看详细信息
也可以在容器的bash内`ifconfig`
2. 查看用户名是什么（tiny），可以直接`whoami`
### WSL设置
可以在开始菜单搜索`WSL settings`
`网络`一栏
`网络模式`由默认的`NAT`修改为`Mirrored
`主机地址环回`由默认的`关`修改为`开`
进行`应用`，会重启WSL
### WSL的shell内
（可选）测试连接
```sh
nc -zv 192.168.1.105 2222
```
进行ssh连接
```sh
ssh -p 2222 tiny@192.168.1.105
```
如果是第一次连接，会跳出
```
The authenticity of host '[192.168.1.105]:2222 ([192.168.1.105]:2222)' can't be established. ED25519 key fingerprint is: SHA256:xxx This key is not known by any other names. Are you sure you want to continue connecting (yes/no/[fingerprint])?
```
这不是一个错误，在第一次连接设备的时候都会有，`yes`即可
输入刚才设置的密码则连接上
## WSL连手机termux

### termux的shell内
1. 安装包前工作
```sh
pkg update && pkg upgrade
```
 
2. 安装包
```sh
pkg install openssh
```
这不是一个规范的包，由termux提供，包含了ssh客户端和服务端2套东西
2. 启动ssh服务
```sh
sshd
```
可以通过`ps aux | grep sshd`来看看有没有真启动
> 由于termux没有root权限，不能开在22端口，开在8022端口，这一点配置里有的，可以去看`/data/data/com.termux/files/usr/etc/ssh/sshd_config`。openssh这个包是termux修改过的，所以早就写好了。
2. 设置密码
```sh
passwd
```
> Termux 是运行在 Android 上的用户态 Linux，**没有 root 权限**，也没有传统的 `/etc/passwd` 文件管理，有自己一套独立的用户体系
> 手机上打开app不验证，也没有sudo
> ssh的时候要用
### 手机上其他操作
1. 查看手机在局域网内IP（192.168.1.103）
可以在`设置-WLAN`，选择已连接的网络看详细信息
也可以在termux的shell内`ifconfig`
2. 查看termux的用户名是什么（u0_a368），有多种方法查询，可以直接在termux的shell内`whoami`
### WSL设置
和前面一样的，只要设置过一次就好了
可以在开始菜单搜索`WSL settings`
`网络`一栏
`网络模式`由默认的`NAT`修改为`Mirrored
`主机地址环回`由默认的`关`修改为`开`
进行`应用`，会重启WSL
### WSL的shell内
（可选）测试连接
```sh
nc -zv 192.168.1.103 8022
```
进行ssh连接
```sh
ssh -p 8022 u0_a368@192.168.1.103
```
如果是第一次连接，会跳出
```
The authenticity of host '[192.168.1.103]:8022 ([192.168.1.103]:8022)' can't be established. ED25519 key fingerprint is: SHA256:8sf22/Z6m4Ozg8yDwcj9y2qqx0t4OiWvlkzngwUX7Uw This key is not known by any other names. Are you sure you want to continue connecting (yes/no/[fingerprint])?
```
这不是一个错误，在第一次连接设备的时候都会有，`yes`即可
输入刚才设置的密码则连接上

## 使用公钥登录（免密）
### 生成密钥对

```
alice@Arisu:~$ cd .ssh/
alice@Arisu:~/.ssh$ ls -la
total 20
drwx------  3 alice alice 4096 Jul 14 01:21 .
drwxr-x--- 21 alice alice 4096 Jul 13 19:41 ..
drwx------  2 alice alice 4096 Jul 12 14:23 agent
-rw-------  1 alice alice 2098 Jul 14 01:21 known_hosts
-rw-------  1 alice alice 1262 Jul 14 01:17 known_hosts.old
```
此时wsl内还没有生成过公私钥对，我们需要生成一对
```sh
ssh-keygen -a 100 -t ed25519 -C "wsl"
```
`-a`指定**KDF（密钥派生函数）的迭代轮数**，默认是16次，用来抗暴力破解的
`-t`指定**数字签名算法**。`ed25519`是一种较新的算法，有很多优点
`-C`给密钥加的标签

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/home/alice/.ssh/id_ed25519):
Enter passphrase for "/home/alice/.ssh/id_ed25519" (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /home/alice/.ssh/id_ed25519
Your public key has been saved in /home/alice/.ssh/id_ed25519.pub
The key fingerprint is:
SHA256:htFxnxnNp1JSTXyZB71YrsjcRRpjIpEw1mJXd1ENsUc wsl
The key's randomart image is:
+--[ED25519 256]--+
|       ++.=..==@E|
|      .+.B ooB=BO|
|      o + . *oXo=|
|       o    .o.= |
|      . S o o.o  |
|       .   + o   |
|                 |
|                 |
|                 |
+----[SHA256]-----+
```
首先会问你存哪个文件，括号内是默认的，我们回车一下就默认去存
然后问你passphrase，这个是用来保护密钥的，对于我连本地的设备不需要，搞得很麻烦，所以直接2个回车跳过，这会让私钥明纹存储
然后他告诉你，私钥在`/home/alice/.ssh/id_ed25519`，公钥在`/home/alice/.ssh/id_ed25519.pub`
fingerprint，指纹，是对公钥做了一次SHA256,便于你去比对这个公钥一不一样，这不是一个机密信息，可以公开无需打码
randomart image，有时指纹容易核对错误，就给你这个图，对比一下图一不一样就知道公钥一不一样，同样，也不是机密信息
```
alice@Arisu:~/.ssh$ ls -la
total 28
drwx------  3 alice alice 4096 Jul 14 15:34 .
drwxr-x--- 21 alice alice 4096 Jul 13 19:41 ..
drwx------  2 alice alice 4096 Jul 12 14:23 agent
-rw-------  1 alice alice  387 Jul 14 15:34 id_ed25519
-rw-r--r--  1 alice alice   85 Jul 14 15:34 id_ed25519.pub
-rw-------  1 alice alice 2098 Jul 14 01:21 known_hosts
-rw-------  1 alice alice 1262 Jul 14 01:17 known_hosts.old
```
可以看到，密钥对已经生成
```sh
ssh-copy-id -p 2222 tiny@192.168.1.105
```
### 将公钥给服务器
生成密钥对以后，执行这个，来把我们的公钥给服务器
```
/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/alice/.ssh/id_ed25519.pub"
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
tiny@192.168.1.105's password:

Number of key(s) added: 1

Now try logging into the machine, with: "ssh -p 2222 'tiny@192.168.1.105'"
and check to make sure that only the key(s) you wanted were added.
```
在这一步你需要输入服务器上账户的密码验证身份，然后你的公钥就被复制过去了，这以后你就不需要再输入服务器上账户的密码了，可以试一下
```
alice@Arisu:~/.ssh$ ssh -p 2222 'tiny@192.168.1.105'
tiny@localhost:~$
```
可以看到，没有要求输入密码，直接进

Windows上没有这个`ssh-copy-id`，比较省心的方法，同时也是最朴素的方法，是直接复制粘贴到服务器的`~/.ssh/authorized_keys`。
## 为每个服务器存储各自的配置
ssh连接服务器的时候会逐个尝试你的所有公钥
然后每一次写端口、写ip也比较麻烦
你可以在`~/.ssh`下创建`config`文件，如下配置：
```config
Host pad
    HostName 192.168.1.105
    User tiny
    Port 2222
    IdentityFile ~/.ssh/id_ed25519
```
`Host`开头，后面那个是你给这服务器取的名字
`HostName`服务器地址
`User`登录时用的账户
`Port`ssh进入的端口
`IdentityFile` 要使用的私钥（自动对应公钥）

## 安全又方便的passphrase和ssh-agent
### 为什么要passphrase
前文连接本地设备的时候，我说不需要设置passphrase。passphrase是什么呢？是对存储在你设备上的私钥进行加密的一串口令，相当于加密密码的密码。不设passphrase，你的私钥是以明文形式存储在设备上的。任何能读取`~/.ssh`的程序都可以搞到你的私钥，而这是很危险的。此时我们需要passphrase保护私钥。在生成密钥对的时候不忽略，就可以启用passphrase。在使用这种密钥去登录服务器的时候，会让你先输入passphrase，这不是服务器的验证步骤，而是本地的验证步骤，在内存中将加密的私钥解密，然后用于ssh连接。
```
alice@Arisu:~/.ssh$ ssh pad
Enter passphrase for key '/home/alice/.ssh/id_ed25519_secure':
```
如果需要更改passphrase，可以：
```sh
ssh-keygen -p -f ~/.ssh/id_ed25519
```
`-p`代表修改密码
### ssh-agent让你只用输一次passphrase
但是每一次都输passphrase还是太要操作了
我们可以用ssh-agent输入passphrase，这和直接没有passphrase是不一样的，那种是直接硬盘上明文存储，谁都能读，这种是有个程序帮你操作，用的时候才把passphrase加载到内存里面，硬盘上是加密的，攻击内存和直接读硬盘是不一样的

启动ssh-agent
```sh
eval "$(ssh-agent)"
```
给他添加需要托管的密钥
```sh
ssh-add ~/.ssh/id_ed25519_secure
```
会让你输一次passphrase
```
Enter passphrase for /home/alice/.ssh/id_ed25519_secure:
Identity added: /home/alice/.ssh/id_ed25519_secure (wsl_secure)
```
之后只要这个终端不关就不用输了。
```
alice@Arisu:~/.ssh$ ssh pad
tiny@localhost:~$
```
可以用这个命令看看托管了几个密钥
```sh
ssh-add -l
```
### 在shell配置文件中自动启动ssh-agent
每次用那2个命令启动ssh-agent也非常麻烦。那就把2条命令放进`.bashrc`/`.zshrc`里。
```sh
ssh-add -l >/dev/null 2>&1 || ssh-add "$HOME/.ssh/id_ed25519"
```
如果你启用了Powerlevel10k的instant prompt，一定要把ssh-agent的命令放在它前面。
这样，每次你全新启动终端，都会先让你输入passphrase。之后你进行ssh连接，这个密钥的私钥都可以被解锁。
## 禁止密码登录
这是一个进一步加强安全性的方法
理论上说，公私钥这一套安全体系难以攻破，但是系统账户的账户密码却容易被攻破。如果我们已经把所有需要的公钥都给了服务器，那么我们就可以关闭密码登录的大门，以后只看公钥。
在服务器上修改`/etc/ssh/sshd_config`，设置`PasswordAuthentication`为`no`，这样除了有密钥对的谁都进不来，极大提高远程主机的安全性。
当然，这不影响使用passphrase的，passphrase只是一个本地的验证。
## 端口转发
可以把在服务器上开的服务（`localhost:8888`）直接在你自己的机器上访问（`http://localhost:9999`），直接访问
在你自己的机器上执行
```sh
ssh -fN -L 9999:localhost:8888 pad
```
`-f`在后台运行
`-N`这次ssh连接不执行任何命令，不要开shell
`-L`端口转发的信息`[bind_address:]port:host:hostport`

如果服务是常驻的，可以在config里可以加上一句
`LocalForward 9999 localhost:8888`

可以试一下，先在服务器（我的平板）上开个服务先
![9e8bc32d8d05b9aa5a2869bc9fb5c095.jpg](https://img.alsbb.top/2026/08/36e01345778ce4834ac7c876cd25a041.jpg)

你就会发现你连去的机子上可以访问`127.0.0.1:9999`
![image.png](https://img.alsbb.top/2026/08/cc847952776530893d9d1f99dd8f2246.png)


（为什么我这里是用Windows里的浏览器访问的，因为我刚刚给WSL的网络模式调成mirroed了，如果是nat你得在WSL才能访问）




