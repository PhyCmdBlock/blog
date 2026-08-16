---
title: 如何阻止WPS自动启动
description:
date: 2026-02-12
lastmod:
cover: /hero/tt4.webp
categories: 软件
tags:
  - windows
  - 计划任务
  - 文件权限
ai:
math: true
layout:
pinned: false
weight: 10
tocStartLevel: 2
tocEndLevel: 4
comment: true
---

> [!tip]
> 本文内容基于Windows系统



# 问题

众所周知，wps会在后台留下愚蠢的后台进程wpscloudsvr.exe，开机自启，这个进程会在右下角产生广告弹窗，推销WPS会员，而且找不到可以禁止它自启的设置。

经过我的研究，发现WPS会在系统的任务计划中添加自启动的任务。但是直接删除治标不治本，每次关闭WPS主界面后，WpsUpdateLogonTask_username和WpsUpdateTask_username这两个任务会马上复原，无论是删除、修改、用空文件欺骗，都没有用。另一个发现是，WPS创建任务的名义（也就是任务文件的创建者）是用户自己。

# 解决方案

于是，接下来我想出了这个绝杀方法-假文件夹：

## 步骤

1. 在WPS所有进程都没有运行的状态下，在“任务计划程序”中把所有WPS创建的任务删除。
2. 用管理员打开Windows命令行。
3. 进入C:\Windows\System32\Tasks目录。
4. 创建与WPS反复维护的两个任务同名的文件夹。

```cmd
mkdir "C:\Windows\System32\Tasks\WpsUpdateTask_10338"
mkdir "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338"
```

5. 为两个文件夹加上“系统文件”和“只读”的属性（第一道防线）。

```cmd
attrib +s +r "C:\Windows\System32\Tasks\WpsUpdateTask_10338"
attrib +s +r "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338"
```

6. 现在开始对文件夹的权限进行管理。

```cmd
# 禁用继承
icacls "C:\Windows\System32\Tasks\WpsUpdateTask_10338" /inheritance:r
# 授予SYSTEM用户完全控制权
icacls "C:\Windows\System32\Tasks\WpsUpdateTask_10338" /grant "SYSTEM":(OI)(CI)F
# 拒绝CREATE OWNER的完全控制权
icacls "C:\Windows\System32\Tasks\WpsUpdateTask_10338" /deny "CREATOR OWNER":(OI)(CI)F
# 拒绝Administators的删除权限
icacls "C:\Windows\System32\Tasks\WpsUpdateTask_10338" /deny "Administrators":(OI)(CI)D


# 另一个文件夹同理
icacls "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338" /inheritance:r
icacls "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338" /grant "SYSTEM":(OI)(CI)F
icacls "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338" /deny "CREATOR OWNER":(OI)(CI)F
icacls "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338" /deny "Administrators":(OI)(CI)D
```

## cmd命令流程

```cmd
Microsoft Windows [版本 10.0.26100.7623]
(c) Microsoft Corporation。保留所有权利。

C:\Windows\System32>cd tasks

C:\Windows\System32\Tasks>mkdir "C:\Windows\System32\Tasks\WpsUpdateTask_10338"

C:\Windows\System32\Tasks>mkdir "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338"

C:\Windows\System32\Tasks>attrib +s +r "C:\Windows\System32\Tasks\WpsUpdateTask_10338"

C:\Windows\System32\Tasks>attrib +s +r "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338"

C:\Windows\System32\Tasks>icacls "C:\Windows\System32\Tasks\WpsUpdateTask_10338" /inheritance:r
已处理的文件: C:\Windows\System32\Tasks\WpsUpdateTask_10338
已成功处理 1 个文件; 处理 0 个文件时失败

C:\Windows\System32\Tasks>icacls "C:\Windows\System32\Tasks\WpsUpdateTask_10338" /grant "SYSTEM":(OI)(CI)F
已处理的文件: C:\Windows\System32\Tasks\WpsUpdateTask_10338
已成功处理 1 个文件; 处理 0 个文件时失败

C:\Windows\System32\Tasks>icacls "C:\Windows\System32\Tasks\WpsUpdateTask_10338" /deny "CREATOR OWNER":(OI)(CI)F
已处理的文件: C:\Windows\System32\Tasks\WpsUpdateTask_10338
已成功处理 1 个文件; 处理 0 个文件时失败

C:\Windows\System32\Tasks>icacls "C:\Windows\System32\Tasks\WpsUpdateTask_10338" /deny "Administrators":(OI)(CI)D
已处理的文件: C:\Windows\System32\Tasks\WpsUpdateTask_10338
已成功处理 1 个文件; 处理 0 个文件时失败

C:\Windows\System32\Tasks>icacls "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338" /inheritance:r
已处理的文件: C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338
已成功处理 1 个文件; 处理 0 个文件时失败

C:\Windows\System32\Tasks>icacls "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338" /grant "SYSTEM":(OI)(CI)F
已处理的文件: C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338
已成功处理 1 个文件; 处理 0 个文件时失败

C:\Windows\System32\Tasks>icacls "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338" /deny "CREATOR OWNER":(OI)(CI)F
已处理的文件: C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338
已成功处理 1 个文件; 处理 0 个文件时失败

C:\Windows\System32\Tasks>icacls "C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338" /deny "Administrators":(OI)(CI)D
已处理的文件: C:\Windows\System32\Tasks\WpsUpdateLogonTask_10338
已成功处理 1 个文件; 处理 0 个文件时失败

C:\Windows\System32\Tasks>
```

这样便能够阻止wps在被关闭后维护自启动任务，WPS将遇到无法创建、修改文件的困难。
