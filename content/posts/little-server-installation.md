---
title: 安装一台Linux小主机
description: 一次我安装一台迷你主机作为家庭服务器的过程
date: 2026-08-13
lastmod: 2026-08-18
cover: /hero/tt7.webp
categories:
  - 系统
tags:
  - linux
ai:
math: false
layout:
pinned: false
weight: 10
tocStartLevel: 2
tocEndLevel: 4
comment: true
---

本文将记录一次我安装一台迷你主机作为家庭服务器的过程，我在上面第一次安装了Linux系统。
> [!note] 本文是一篇记录
> 不是一个教程。
## 准备阶段
### 硬件设备
我在京东上面买了一个准系统（不自带内存和硬盘）迷你主机，然后买了一个256GB固态硬盘（预算有限，这点够用）。

几个月前，我的同学送了我一根32GB的ddr4 SO-DIMM内存条，一直以来没想到怎么用，刚刚好这一次我的小主机的内存插槽就是ddr4 SO-DIMM，非常方便。最有意思的是，虽然这个主机的CPU声称只支持最多16GB的内存，但是我插上去后发现32GB完全没问题，全部识别。

将上面的内存和固态硬盘插进主机内部，然后连接电源线，HDMI到显示屏，键盘以及我的多功能启动盘。

我的启动盘就是之前装Windows的时候搞好的。[点此查看。](/posts/windows-installation)现在里面有一个[Ubuntu-server24.04LTS的iso](https://ubuntu.com/download/server)。

开机。理论上他默认从u盘启动，不是的话连续按F7.然后进入ventoy，选择Ubuntu，启动。
## 安装Ubuntu-server系统
### GRUB菜单
> [!note] GRUB
> 即`GRand Unified Bootloader`，是BIOS之后运行的第一个程序，用于选择启动的系统。

![image.png](https://img.alsbb.top/2026/08/4047a5c8b6603f24ee31acf0a5bdcb4a.png)

选择`Ubuntu Server with the HWE kernel`。
> [!note] ai解释HWE
> HWE = Hardware Enablement（硬件支持更新），意思是这个内核版本会跟随 Ubuntu 的长期支持版本更新，对新硬件的兼容性更好。
> 
> 你的 G3S 用的是 Intel N95（Alder Lake-N 架构），属于较新的平台，HWE 内核能提供更好的驱动支持，尤其是显卡和电源管理方面。
> 
> 安装完成后，系统会自动更新到更新的 HWE 内核版本，省去你手动折腾的麻烦。

总之，如果你的硬件兼容性比较差，比较老，追求100%的稳定，那就第一种；如果硬件新，第二种没问题且更好。
### 选择安装的系统类型
> 接下来的我没拍图，就用文字代替
```
Choose the type of installation

Choose the base for the installation.

(X) Ubuntu Server
    The default install contains a curated set of packages that provide a comfortable experience for operating your server.

( ) Ubuntu Server (minimized)
    This version has been customized to have a small runtime footprint in environments where humans are not expected to log in.

Additional options

[ ] Search for third‑party drivers
    This software is subject to license terms included with its documentation. Some is proprietary. Third‑party drivers should not be installed on systems that will be used for FIPS or the real‑time kernel.

[ Help ]
```
选择`Ubuntu Server`，而不是minimized，因为提供了更完整的工具，便于人登录上去使用。
### 网络配置
```
Network configuration

Configure at least one interface this server can use to talk to other machines, and which preferably provides sufficient access for updates.

NAME      TYPE   NOTES
[ enp3s0   eth    not connected     ▶ ]
disabled  autoconfiguration failed
e0:51:d8:21:fe:21 / Realtek Semiconductor Co., Ltd. / RTL8111/8168/8411 PCI Express Gigabit Ethernet Controller (RTL8111/8168 PCI Express Gigabit Ethernet controller)

[ wlp1s0   wlan   not connected     ▶ ]
disabled
84:1d:e8:42:06:81 / Realtek Semiconductor Co., Ltd. / RTL8821CE 802.11ac PCIe Wireless Network Adapter

[ Create bond ▶ ]
```

> [!note] 网络接口的标准化名称
> - **`enp3s0`（有线网卡）**：
>     - **`en`** = **E**ther**n**et，以太网，就是网线连接的方式。
>     - **`p3`** = 位于 PCI 总线（扩展槽）的 **3** 号位置。
>     - **`s0`** = 位于该 PCI 设备的 **0** 号插槽。
> - **`wlp1s0`（无线网卡）**：
>     - **`wl`** = **W**ire**l**ess LAN，WLAN，就是连接无线网络的连接方式。
>     - **`p1`** = 位于 PCI 总线（扩展槽）的 **1** 号位置。
>     - **`s0`** =位于该 PCI 设备的 **0** 号插槽。

有网线的把网线插好，当然你也可以选择在这个界面连接Wi-Fi。总之先把网络连好再说。

### 网络代理
```
Proxy configuration

If this system requires a proxy to connect to the internet, enter its details here.

Proxy address:

If you need to use a HTTP proxy to access the outside world, enter the proxy information here. Otherwise, leave this blank.
The proxy information should be given in the standard form of "http://[user][:pass]@host[:port]/".
```
个人不需要，直接跳过。这个是用在那种公司机构内网中的服务器的。那种内网通常会搞一个代理服务器才能访问外网，那样的话就得配置这个。

### Ubuntu的镜像源配置
```
Ubuntu archive mirror configuration

If you use an alternative mirror for Ubuntu, enter its details here.

Mirror address: http://cn.archive.ubuntu.com/ubuntu/
You may provide an archive mirror to be used instead of the default.

This mirror location passed tests.

Hit:1 http://mirrors.tuna.tsinghua.edu.cn/ubuntu noble InRelease
Get:2 http://mirrors.tuna.tsinghua.edu.cn/ubuntu noble‑updates InRelease [126 kB]
Get:3 http://mirrors.tuna.tsinghua.edu.cn/ubuntu noble‑backports InRelease [126 kB]
Fetched 252 kB in 2s (115 kB/s)
Reading package lists...
```

Ubuntu的资源的官方源在国外，需要各种镜像源来加速。这里它自动测速发现清华源快，自己选了。

`Reading package lists...`不动没关系，只要你看到底下的done可以选，那就下一步。

### 安装程序更新版本
```
Installer update available

Version 24.04.4.1 of the installer is now available (24.04.4 is currently running).

You can read the release notes for each version at:
https://github.com/canonical/subiquity/releases

If you choose to update, the update will be downloaded and the installation will continue from here.

[ Update to the new installer ]
[ Continue without updating ]
[ Back                        ]
```
小版本更新，这个一般不用管，安装的时候用不着搞这么多事情，选择`[ Continue without updating ]`跳过。


### 如何使用存储设备
```
Guided storage configuration

Configure a guided storage layout, or create a custom one:

(X) Use an entire disk
    [ INTEL_SSDPEKKN256G8_PHHH94630031256B_1      local disk 238.474G ▾ ]

[X] Set up this disk as an LVM group
    [ ] Encrypt the LVM group with LUKS
        Passphrase:

        Confirm passphrase:

        [ ] Also create a recovery key
            The key will be stored as "~/recovery‑key.txt" in the live system and will be copied to /var/log/installer/ in the target system.

( ) Custom storage layout
```
> [!note] ai解释
> **🎯 为什么要取消 LVM？**
> LVM（逻辑卷管理） 相当于在硬盘和分区之间加了一层“虚拟化”。虽然灵活，但对于你只有 1 块 256GB 硬盘 的家用服务器来说，它带来的只有复杂性，没有任何实际好处。
> 
> 如果保留 LVM，系统安装好后，你执行 `df -h` 会看到 `/dev/mapper/ubuntu--vg-ubuntu--lv `这样的复杂设备名。如果以后硬盘出问题，恢复数据的难度会比标准分区高。
> 
> 取消 LVM 后，安装程序会自动创建最简单的标准分区方案：一个 EFI 系统分区（引导用）、一个 swap 交换分区（虚拟内存）、一个根分区 /（存放所有系统和数据）。简单、透明、好维护。
> 
> **LVM的好处**
> - **空间不够了？动态扩容！** 假设以后系统盘（`/`）快满了，而你发现数据盘还有很多空余。你不需要重装系统，只需要用几条命令把空闲空间划拨给系统盘，**立刻生效，不需要停机**。
> - **加硬盘像加内存**：服务器用了几年，硬盘满了。你买一块新硬盘插上去，加进卷组，池子瞬间变大，旧数据不用迁移。

也就是说，如果你的服务器盘位充足，而且存储的数据大小比较大，经常在动态配置硬盘的，建议你开启LVM，能够很便捷灵活地调配硬盘空间。但是在我这种能力有限的小主机上，关闭LVM，使用传统分区可以让管理和数据恢复更直接。

### 分区配置
```
Storage configuration

FILE SYSTEM SUMMARY
MOUNT POINT    SIZE     TYPE      DEVICE TYPE
[ /            237.42G  new ext4  new partition of local disk ▸ ]
[ /boot/efi    1.049G   new fat32 new partition of local disk ▸ ]

AVAILABLE DEVICES
DEVICE
[ Generic_Flash_Disk_8004D286‑0:0                     TYPE        SIZE
partition 1 existing, already formatted as exfat, not mounted  local disk  58.593G ▸
partition 2 existing, unused                                 58.561G ▸
                                                             32.000M ▸
[ Create software RAID (md) ▸ ]
[ Create volume group (LVM) ▸ ]

USED DEVICES
DEVICE
[ INTEL_SSDPEKKN256G8_PHHH94630031256B_1 TYPE SIZE
partition 1 new, primary ESP, to be formatted as fat32, mounted at /boot/efi local disk 238.474G ▸
partition 2 new, to be formatted as ext4, mounted at / 237.422G ▸
```
这个界面不需要动，这个分区方案是目前最合适的。

### 第一个用户
```
Profile configuration

Enter the username and password you will use to log in to the system. You can configure SSH access on a later screen, but a password is still needed for sudo.

Your name:

Your server's name:
    The name it uses when it talks to other computers.

Pick a username:

Choose a password:

Confirm your password:
```

`Your name`，显示用的名字，只是一个标签，随便写。

`Your server's name`，机器的设备名称，显示在网络连接等等地方，能被其他设备看到。

`Pick a username`，用户的实际用户名，出现在shell的prompt内，ssh时使用的实际用户名。不能使用`root`。

`Choose a password`用户的登录密码。

### Ubuntu Pro
```
Upgrade to Ubuntu Pro                                                                                [ Help ]

Upgrade this machine to Ubuntu Pro for security updates on a much wider range of packages, until 2034. Assists with FedRAMP, FIPS, STIG, HIPAA and other compliance or hardening requirements.

[ About Ubuntu Pro ▸ ]

( ) Enable Ubuntu Pro

(X) Skip for now

    You can always enable Ubuntu Pro later using the 'pro attach' command.
```
Ubuntu pro的推广，一项付费的拓展服务，一般是给企业级生产环境的，不需要，跳过。

### SSH
```
SSH configuration

You can choose to install the OpenSSH server package to enable secure remote access to your server.

[X] Install OpenSSH server

[X] Allow password authentication over SSH

[ Import SSH key ▸ ]

AUTHORIZED KEYS
No authorized key
```

ssh一定要装。

这个密码登录先开着，ssh公钥稍后再导入。可以之后再配置，用不着安装的时候来搞这些东西。

### 预装snap包
```
Featured server snaps

These are popular snaps in server environments. Select or deselect with SPACE, press ENTER to see more details of the package, publisher and versions available.

[ ] microk8s		canonical	Kubernetes for workstations and appliances
[ ] nextcloud		nextcloud	Nextcloud Server – A safe home for all your data
[ ] wekan		xet7		Open‑source kanban
[ ] canonical‑livepatch	canonicalv	Canonical Livepatch Client
[ ] rocketchat‑server	rocketchat	Rocket.Chat server
[ ] mosquitto		mosquitto	Eclipse Mosquitto MQTT broker
[ ] etcd		canonical	Resilient key‑value store by CoreOS
[ ] powershell		safairre	PowerShell for every system!
[ ] sabnzbd		safairre	Sabnzbd – The automated Usenet download tool
[ ] wormhole		snapcrafters	Set things from one computer to another, safely
[ ] aws‑cli		aws		Universal Command Line Interface for Amazon Web Services
[ ] scli		softlayer	Python based SoftLayer API Tool.
[ ] doctl		digitalocean	The official DigitalOcean command line interface
[ ] keepalived		keepalived‑project	High availability VRRP/BFD and load‑balancing for Linux
[ ] prometheus		canonical	The Prometheus monitoring system and time series database
[ ] lxd			canonical	LXD – container and VM manager
```
安装系统的时候安装Ubuntu的snap软件包。同样，一个都不用装，用不着安装的时候来搞这些东西。

### 进入安装

屏幕会跑一会
然后你会看到
```
Installation complete!

【一堆日志】

[ View full log ]
[ Reboot Now ]
```

拔掉启动U盘（无需担心，程序在内存中运行，且已经不需要从U盘中读取内容了）。

然后选择`Reboot Now`。
### 系统启动
```
Ubuntu 24.04.4 LTS g3s‑server tty1

g3s‑server login: [  29.658999] cloud‑init[1101]: Cloud‑init v. 25.2‑0ubuntu1~24.04.1 running 'modules:config' at Thu, 13 Aug 2026 11:32:32 +0000, up 29.62 seconds.
[  21.659663] cloud‑init[1101]: Generating locales (this might take a while)...
[  21.698701] cloud‑init[1101]:    en_US.UTF‑8... done
[  21.698971] cloud‑init[1101]: Generation complete.
[  29.668791] cloud‑init[1101]: Cloud‑init v. 25.2‑0ubuntu1~24.04.1 running 'modules:final' at Thu, 13 Aug 2026 11:32:34 +0000, up 22.57 seconds.
ci‑info: no authorized SSH keys fingerprints found for user alice.
ci‑info: no authorized SSH keys fingerprints found for user root.
<14‑Aug 13 11:32:34 cloud‑init> -----BEGIN SSH HOST KEY FINGERPRINTS-----
<14‑Aug 13 11:32:34 cloud‑init> 256 SHA256:xxxx root@g3s‑server (ECDSA)
<14‑Aug 13 11:32:34 cloud‑init> 256 SHA256:xxxx root@g3s‑server (ED25519)
<14‑Aug 13 11:32:34 cloud‑init> 3072 SHA256:xxxx root@g3s‑server (RSA)
<14‑Aug 13 11:32:34 cloud‑init> -----END SSH HOST KEY FINGERPRINTS-----
ecdsa‑sha2‑nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBxxxx root@g3s‑server
ssh‑ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBxxxx root@g3s‑server
ssh‑rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQxxxx root@g3s‑server
-----BEGIN SSH HOST KEY KEYS-----
ecdsa‑sha2‑nistp256 AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBxxxx root@g3s‑server
ssh‑ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIBxxxx root@g3s‑server
ssh‑rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQxxxx root@g3s‑server
-----END SSH HOST KEY KEYS-----
[  23.058869] cloud‑init[1233]: Cloud‑init v. 25.2‑0ubuntu1~24.04.1 finished at Thu, 13 Aug 2026 11:32:34 +0000, Datasource DataSourceNone. Up 23.05 seconds

```
其中，`Cloud-init finished`代表系统已经成功启动。

按一下回车键，应该会出现登录提示，可以尝试登录一下。

如果能够登录，且网络连接良好，你就可以把外设全部拔掉，留下电源线和网线，用你自己常用的操作系统SSH上去使用机器。可以去路由器里给主机分配一个固定的IP地址。