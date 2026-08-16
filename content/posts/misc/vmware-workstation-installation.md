---
title: VMware Workstation安装
description: 记录VMware Workstation
date: 2026-02-11
lastmod:
cover: /hero/tt2.webp
categories: 软件
tags:
  - 虚拟机
  - linux
  - 碎片笔记
ai:
math: true
layout:
pinned: false
weight: 10
tocStartLevel: 2
tocEndLevel: 4
comment: true
---
[这里下载](https://www.vmware.com/products/desktop-hypervisor/workstation-and-fusion)
他会让你跳转到broadcom登录，你去注册个账号，随便填信息，然后去[这里](https://support.broadcom.com/group/ecx/productfiles?subFamily=VMware%20Workstation%20Pro&displayGroup=VMware%20Workstation%20Pro%2017.0%20for%20Windows&release=17.6.3&os=&servicePk=undefined&language=EN&freeDownloads=true)下载。
不用新版是因为这个人提到了：

> [!info] 来自知乎的评论
> 现在点进去之后默认是17.6版本，记得先点一下那个版本，选17.5以下的，千万不要选17.6或者之后的，因为17.6开始博通砍掉了unity这个很好用的功能（可以让虚拟机里面的程序在实体机任务栏里面显示）

这个网站非常慢，不是网络问题，尽量少跳转，所以把链接放在上面

---

用VMware创建Linux虚拟机，设置共享文件夹，但再开机就没了？
解决方法：
运行sudo vmhgfs-fuse .host:/ /mnt/hgfs -o allow_other -o uid=1000 -o gid=1000
然后就有了
