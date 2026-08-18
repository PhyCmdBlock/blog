---
title: Shell入门
description:
date: 2026-07-12
lastmod:
cover: /hero/tt9.webp
categories: Missing-Semester-2026
tags:
  - linux
  - bash
  - shell
ai:
math: true
layout:
pinned: false
weight: 10
tocStartLevel: 2
tocEndLevel: 4
comment: true
---


> 本文章未经过可读性提升

[讲义](https://missing-semester-cn.github.io/2026/course-shell/)

## 课堂内容
终端 里有 shell
Linux默认bash，现在有Zsh，与bash兼容


自动化

编程语言

组合程序

开源软件都离不开shell
prompt 是最前面那串东西
```
alice@ubuntu:~$
```
alice表示用户名
ubuntu表示机器
~表示主目录
$表示不是root用户

参数解析：字符串，空白字符分割如空格tab，第一个是程序名，后面每一个是参数。可以用双引号来让一个参数含有空白字符

可以用转义符

man 跟另一个程序的名字，会解释怎么用

很多程序后面加--help可以获得简明版的解释

cd
change directory

后面加路径

很多程序都是默认在当前工作目录下运行的

正斜杠/开头表示绝对路径
相对路径是不用/开头的路径，解析基于当前工作目录
相对路径里会用到：.当前路径，一种引用当前位置的方法
..父级目录，往上走一层
可以包在/之间，一次一次
../..：往上走2层
~代表主目录
~/..会到达/home


ZOxide 更方便的工具跳目录

cd 后打了一部分了，按个tab，会给你展示可能的目标，如果没有歧义，会直接补全






shell怎么找程序？获取名字以后，在PATH（环境变量）里面找
环境变量 在shell中设置的变量，存映射关系，名称到字符串

可以echo $PATH查看这个
```
alice@ubuntu:/$ echo $PATH
/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games:/snap/bin:/snap/bin
```
用冒号分隔的路径，按顺序找程序，多个程序会用第一个找到的


可以用which来看看怎么找的

which会遍历PATH，输出首次找到的位置

愿意的话把程序的路径当作程序名字也可以

which -a可以看所有的同名程序


ls 列出目录下的东西

cat打出文件的内容

sort按字典序排序文件每一行来输出

uniq输出文件里不重复的行（去重的输出），只会消除连续的重复行

sort -u，排序的同时去重

head -n10 data输出前10行
tail 输出后10行

grep搜索工具，查找文本
grep 3 data
输出所有含有3的行
搜索模式不只有简单文本，可以正则表达式

-r代表recursive，会层层深入当前目录下的文件夹，全部纳入操作范围

-l表示只打印匹配到内容的文件名，而不是具体的行

sed“可编程的行编辑器”，可以编写sed命令来实现简单的自动化编辑文件的工作

替换操作
sed -i 's/被替换/替换目标/g' \*/\*.md
substitute  global
\*/\*.md由shell展开，把一切符合规则的路径填到这个参数上
这个被替换是可以用正则表达式的


正则表达式regular expressions/通配符globs表达式
描述模式
通配符较简单，正则表达式很复杂
shell的路径上，只支持通配符表达式

find 查找文件
```bash
find ~/Downloads -type f -name "*.zip" -mtime +30
```
`-type f` 类型为文件，区别于目录
`-mtime +30` 修改时间在30天以前

```bash
find ~/Downloads -type f -size +100M -exec ls -lh {} \;
```

对每一个符合条件的路径执行：ls -lh {}，{}代表这个路径要被填入的位置，`\;`代表-exec后命令参数列表的结束，以便继续为find写参数

这是find命令的特殊写法，并不是一个通用的逻辑

ctrl c可以取消当前操作，直接跳到新行，可以杀程序

```bash
find . -name "*.md" -exec grep -l "TODO" {} \;
```


FD工具


find默认有-r，会搜目录下全部文件
-maxdepth 可以指定深度


awk解析文件 ，按照空白字符分割每一行，按照指定程序去执行
`-F,`这可以让awk成为一个csv解析器


管道|
运行左边的，把输出作为输入给右边的

重定向输入输出
`>`表示把左边的输出给写入右边的文件里，而不是打印出来。如果原来有内容，这会覆盖文件原有内容。可以使用`>>`进行追加而不是覆盖
`<`表示把右边的文件作为输入给左边的程序

bash甚至指出条件判断
if xxx; then xxx; xxx; fi
xxx程序成功退出则看作真
比如说grep，返回0就代表成功，具体的返回情况在man里面都可以找到，exit status


```bash
while xxx; do xx;xx; done 
```


```bash
for varname in a b c d; do echo "$varname"; done
```

```bash
for varname in $(seq 1 10); do echo "$varname"; done
```
用括号可以把一个命令的输出作为参数填入

有一个程序，`test` 或者`[`，用来写逻辑判断的，可以放在if的判断处，让逻辑表达式变成一个程序的返回值

```bash
if [ "aaa" = "aaa" ]; then echo "aaa"; else echo "bbb"; fi
```
```bash
if [ -f data.txt ] .......
```
test的-f表示去看看这个文件存不存在，存在就成功退出

双中括号是什么？？没深入`if [[ ....`
cd,|,>,<,if,while,for都不是程序，是bash一部分

可以把bash命令写进文件，可以执行
.sh
从上到下一个个执行

```bash
#!/bin/sh
```
这叫shebang（hash# bang!）
意思是把文件内容作为输入给/bin/sh去执行

运行可执行文件时候，shell会去检查这个文件有没有执行权限，没有告知操作系统可以执行，就会permission denied
要能执行，需要用chmod改权限
```bash
chmod +x run.sh
```

执行可执行文件前面要加`./`，否则他不知道这个是一个当前目录下的可执行文件
```bash
./run.sh
run.sh #错误，去PATH找，没找到
```

## 课后练习
1. 本课程要求你使用类 Unix 的 Shell，如 Bash 或 ZSH 。若你在 Linux 或 macOS 上，无需额外设置。若你在 Windows 上，请确认你用的不是 `cmd.exe` 或 `PowerShell`；你可以使用 [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/) 或 Linux 虚拟机来获得 Unix 风格的命令行工具。要确认当前 Shell 是否合适，可运行 `echo $SHELL`；若输出类似 `/bin/bash` 或 `/usr/bin/zsh` ，就说明没问题。

```
alice@Arisu:/mnt/e/tmp/learn-bash$ echo $BASH
/bin/bash
```
    
2. `ls` 的 `-l` 选项（flag）作用是什么？运行 `ls -l /` 并观察输出。每一行最前面的 10 个字符分别代表什么？（提示：`man ls`）

作用是列出详细信息
```
alice@Arisu:/mnt/e/tmp/learn-bash$ ls -l /
total 2836
lrwxrwxrwx   1 root root       7 Apr 20 16:46 bin -> usr/bin
drwxr-xr-x   2 root root    4096 Apr 20 16:46 boot
drwxr-xr-x   8 root root    3160 Jul 11 21:53 dev
drwxr-xr-x  97 root root    4096 Jul 11 23:57 etc
drwxr-xr-x   3 root root    4096 Jul 11 18:46 home
-rwxr-xr-x   1 root root 2836528 Jun 26 05:27 init
lrwxrwxrwx   1 root root       7 Apr 20 16:46 lib -> usr/lib
lrwxrwxrwx   1 root root       9 Apr 20 16:46 lib64 -> usr/lib64
drwx------   2 root root   16384 Jul 11 18:32 lost+found
drwxr-xr-x   2 root root    4096 Apr 21 02:05 media
drwxr-xr-x   7 root root    4096 Jul 11 18:32 mnt
drwxr-xr-x   2 root root    4096 Apr 21 02:05 opt
dr-xr-xr-x 372 root root       0 Jul 11 21:53 proc
drwx------   4 root root    4096 Jul 11 18:34 root
drwxr-xr-x   8 root root     160 Jul 11 22:03 run
lrwxrwxrwx   1 root root       8 Apr 20 16:46 sbin -> usr/sbin
drwxr-xr-x   2 root root    4096 Jul 11 18:32 snap
drwxr-xr-x   2 root root    4096 Apr 21 02:05 srv
dr-xr-xr-x  13 root root       0 Jul 11 21:53 sys
drwxrwxrwt   3 root root    4096 Jul 11 23:08 tmp
drwxr-xr-x  12 root root    4096 Apr 21 02:05 usr
drwxr-xr-x  13 root root    4096 Jul 11 18:32 var
```


代表类型+文件权限


3. 在命令 `find ~/Downloads -type f -name "*.zip" -mtime +30` 中，`*.zip` 是一个 「glob」。什么是 glob ？新建一个测试目录并创建一些文件，试试 `ls *.txt` 、`ls file?.txt` 、`ls {a,b,c}.txt` 等模式。参见 Bash 手册中的 [Pattern Matching](https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html) 。
通配符
`ls *.txt` ：匹配任何以`.txt`结尾的文件
`ls file?.txt`:匹配任何`file+一个字符+.txt`的文件
`ls {a,b,c}.txt`：展开，分别去`ls``a.txt``b.txt``c.txt`


4. `'单引号'`、`"双引号"` 和 `$'ANSI 引号'` 有什么区别？写一条命令，输出一个同时包含字面量 `$` 、`!` 和换行符的字符串。参见 [Quoting](https://www.gnu.org/software/bash/manual/html_node/Quoting.html) 。
```
alice@Arisu:/mnt/e/tmp/learn-bash$ echo '$!\n'
$!\n
alice@Arisu:/mnt/e/tmp/learn-bash$ echo "$!\n"
\n
alice@Arisu:/mnt/e/tmp/learn-bash$ echo $'$!\n'
$!

alice@Arisu:/mnt/e/tmp/learn-bash$
```
单引号，就是说里面东西都是字面意思，没有特殊意义
双引号，部分解析，不转义，`$`会去解析变量，`!`会去找历史命令并填充到对应位置
`$''`，不解析，但转义

5. Shell 有三条标准流：stdin（0）、stdout（1）、stderr（2）。运行 `ls /nonexistent /tmp` ，把 stdout 和 stderr 分别重定向到两个文件。你将如何把两者都重定向到同一个文件？参见 [Redirections](https://www.gnu.org/software/bash/manual/html_node/Redirections.html) 。
```
alice@Arisu:/mnt/e/tmp/learn-bash$ ls /nonexistent /tmp > out.txt
ls: cannot access '/nonexistent': No such file or directory
alice@Arisu:/mnt/e/tmp/learn-bash$ cat out.txt
/tmp:
greet.sh
story.txt
alice@Arisu:/mnt/e/tmp/learn-bash$ ls /nonexistent /tmp 2> errout.txt
/tmp:
greet.sh  story.txt
alice@Arisu:/mnt/e/tmp/learn-bash$ cat errout.txt
ls: cannot access '/nonexistent': No such file or directory
alice@Arisu:/mnt/e/tmp/learn-bash$ ls /nonexistent /tmp > allout.txt 2>&1
alice@Arisu:/mnt/e/tmp/learn-bash$ cat allout.txt
ls: cannot access '/nonexistent': No such file or directory
/tmp:
greet.sh
story.txt
```
6. `$?` 保存上一条命令的退出状态（0 表示成功）。`&&` 仅在前一条成功时执行后一条；`||` 仅在前一条失败时执行后一条。写一个一行命令：仅当 `/tmp/mydir` 不存在时才创建它。参见 [Exit Status](https://www.gnu.org/software/bash/manual/html_node/Exit-Status.html) 。
```
ls /tmp/mydir || mkdir /tmp/mydir
```
    
7. 为什么 `cd` 必须是 Shell 内建命令，而不能是独立程序？（提示：想想子进程能影响和不能影响父进程的哪些状态。）
一个进程不可以去修改其他进程的工作目录
    
8. 写一个脚本，接收文件名参数（`$1`），用 `test -f` 或 `[ -f ... ]` 检查该文件是否存在，并根据结果输出不同提示。参见 [Bash Conditional Expressions](https://www.gnu.org/software/bash/manual/html_node/Bash-Conditional-Expressions.html) 。
```sh
#! /bin/sh
if [ -f "$1" ]; then echo "it exists"; else echo "it does not exist"; fi

```
9. 把上一题完成的脚本保存为文件（如 `check.sh`）。先运行 `./check.sh somefile` ，会发生什么？然后执行 `chmod +x check.sh` 再试一次。为什么这一步是必须的？（提示：比较 `chmod` 前后的 `ls -l check.sh` 输出）
不能运行，加个可以执行的权限
如果你在WSL的挂载目录下创建文件，默认自带rwx3个权限，但这不是原生的表现
    
10. 在脚本的 `set` 选项（flag）里加入 `-x` 会发生什么？写个简单脚本试试并观察输出。参见 [The Set Builtin](https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html) 。
```
alice@Arisu:~/hello-linux$ ./check.sh 11.txt
+ [ -f 11.txt ]
+ echo it exists
it exists
```
在执行每条命令前，把这个命令的真实样子输出一遍，会把里面没展开的东西展开，什么`$`，`!`，`*`都会替换成实际的内容
11. 写一条命令，把文件复制为带当天日期的备份文件名（例如 `notes.txt` → `notes_2026-01-12.txt`）。（提示：`$(date +%Y-%m-%d)`）参见 [Command Substitution](https://www.gnu.org/software/bash/manual/html_node/Command-Substitution.html) 。


```sh
#! /bin/sh

cp "$1" "${1%.*}_$(date +%Y-%m-%d).${1##*.}"

```
这个没考虑到程序的工作目录可能与文件不一样
```sh
#! /bin/sh

# 1. 获取文件所在的目录（如果 $1 是 notes.txt，这里得到 "."）
dir=$(dirname "$1")

# 2. 获取纯文件名（不含路径，例如 "notes.txt"）
file=$(basename "$1")

# 3. 剥离扩展名（得到 "notes"）
base="${file%.*}"

# 4. 剥离主体，单独拿扩展名（得到 "txt"）
ext="${file##*.}"

# 5. 拼接最终路径：目录/主体_日期.扩展名
cp "$1" "${dir}/${base}_$(date +%Y-%m-%d).${ext}"
```


12. 修改讲义中的「复现偶尔才会失败的测试」脚本（flaky test），使它能够从命令行参数接收测试命令，而不是在脚本中写死 `cargo test my_test`。（提示：`$1` 或 `$@`）参见 [Special Parameters](https://www.gnu.org/software/bash/manual/html_node/Special-Parameters.html) 。
将这个命令改成`"$@"`。不能改成`"$*"`前面这个是分开来，每一个参数带引号，后面这种是合起来，整个一个字符串带引号，那就变成一个参数了。更不能使用`$*`不带双引号
```bash
#!/bin/bash
set -euo pipefail

# Start CPU stress in background
stress --cpu 8 &
STRESS_PID=$!

# Setup log file
LOGFILE="test_runs_$(date +%s).log"
echo "Logging to $LOGFILE"

# Run tests until one fails
RUN=1
while "$@" > "$LOGFILE" 2>&1; do
    echo "Run $RUN passed"
    ((RUN++))
done

# Cleanup and report
kill $STRESS_PID
echo "Test failed on run $RUN"
echo "Last 20 lines of output:"
tail -n 20 "$LOGFILE"
echo "Full log: $LOGFILE"
```
    
13. 使用管道找出你「home 目录」中最常见的 5 种文件扩展名。（提示：组合 `find` 、`grep` / `sed` / `awk`、`sort`、`uniq -c` 以及 `head`）
```sh
find ~ -type f | sed 's|.*/||' | awk -F. 'NF>1 {print $NF}' | sort | uniq -c | sort -nr | head -5
```
- `find ~ -type f`列出所有是文件的东西
- `sed 's|.*/||'` `|`也可以当分隔符，或者你可以这样写：`sed 's/.*\///'`，由于是单引号，shell会把这个字符串原封不动给sed看，sed获得的是`s/.*\///`，sed自己会进行转义，知道第二个正斜杠是转义的，不是分割符。这里面使用了正则表达式是匹配模式：`.*/`，意为贪婪地匹配到最后一个斜杠。对于字符串`/home/alice/hello-linux/test_x.sh`，正则先把整个字符串吃掉，然后发现最后是`h`，不是`/`，于是开始回溯，最后吐到倒数第一个`/`的时候，满足了。现在他吞掉了`/home/alice/hello-linux/`这些内容。然后sed将这些内容进行替换，替换为空，也就是删除。于是剩下了`test_x.sh`
- `awk -F. 'NF>1 {print $NF}'`让awk把文件名按照`.`分开来，`-F`加一个符号就指定了分隔符是什么。`NF`是内部变量，表示总共切了几段，然后`NF>1`这个地方是一个`pattern`（`awk options 'pattern {action}' file`），这个`pattern`表示这一行满足什么条件才去执行`action`，所以，没有拓展名的行因为只切了一个段，`NF>1`不会满足，不会执行操作。满足了后，开始执行`print $NF`,`print`就是输出，`$`加数字相当于是切出来第几个段，`$NF`就是最后一段，所以把被`.`分割的段的最后一段输出了
- `sort | uniq -c`一定先排序再去重，排序是为了把一样的东西聚集到一起。`-c`代表进行统计，并且把数字放在项目的前面。
- `sort -nr` `-n`按照数字排序而非默认的字典序；`-r`reverse降序排序，这样最多的就在上面
- `head -5`取最上面的5个，也即最多的5个
``
    
14. `xargs` 会把 stdin 的每一行转换为命令参数。结合 `find` 和 `xargs`（不要用 `find -exec`），找出目录中所有 `.sh` 文件，并用 `wc -l` 统计每个文件行数。加分项：正确处理文件名中的空格。（提示：`-print0` 和 `-0`）参见 `man xargs` 。
```
alice@Arisu:~/hello-linux$ find . -name "*.sh"
./test_x_2.sh
./crlf_test.sh
./date.sh
./flaky_test.sh
./test_program.sh
./check.sh
./test_x.sh
alice@Arisu:~/hello-linux$ find . -name "*.sh" | xargs -n1 wc -l
6 ./test_x_2.sh
1 ./crlf_test.sh
4 ./date.sh
24 ./flaky_test.sh
24 ./test_program.sh
4 ./check.sh
10 ./test_x.sh
alice@Arisu:~/hello-linux$ touch "a file with space.sh"
alice@Arisu:~/hello-linux$ find . -name "*.sh" | xargs -n1 wc -l
6 ./test_x_2.sh
1 ./crlf_test.sh
4 ./date.sh
24 ./flaky_test.sh
wc: ./a: No such file or directory
wc: file: No such file or directory
wc: with: No such file or directory
wc: space.sh: No such file or directory
24 ./test_program.sh
4 ./check.sh
10 ./test_x.sh
```
可以看到，目前无法正确处理含空格文件名
```sh
find . -name "*.sh" -print0 | xargs -0 -n1 wc -l
```
- `-print0`：让 `find` 输出的每个文件名后跟一个空字符（`\0`）而不是换行符。
- `-0`：告诉 `xargs` 使用空字符作为输入分隔符，而不是空白符。

15. 使用 `curl` 获取 [课程网站](https://missing.csail.mit.edu/) 的 HTML，并通过 `grep` 统计列出了多少讲。（提示：找出每讲课程名称在那份 HTML 中的共性；用 `curl -s` 关闭进度输出。）
```sh
curl -s https://missing.csail.mit.edu/ | grep -c "<a href=\"/2026/.*/\">"
```
输出为9
`"<a href=\"/2026/.*/\">"`是正则`.*`是任意内容。其中引号加了转义。
`-c`代表对找到的结果进行计数

16. [`jq`](https://jqlang.github.io/jq/) 是处理 JSON 的强大工具。用 curl 获取示例数据 https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json，再用 jq 提取 version 大于 6 的人员姓名。（提示：先 `jq` . 看结构；再试 `jq '.[] | select(...) | .name'`）

```sh
curl -s https://microsoftedge.github.io/Demos/json-dummy-data/64KB.json | jq '.[] | select(.version > 6) | .name'
```

17. `awk` 可以按列值过滤行并改写输出。例如，`awk '$3 ~ /pattern/ {$4=""; print}'` 会只输出第三列匹配 `pattern` 的行，并省略第四列。请写一个 `awk` 命令：只输出第二列大于 100 的行，并交换第一列和第三列。可用这条命令测试：`printf 'a 50 x\nb 150 y\nc 200 z\n'`
```sh
printf 'a 50 x\nb 150 y\nc 200 z\n' | awk '$2 > 100 {print $3, $2, $1}'
```
逗号分隔：`awk` 在用逗号分隔的 `print` 中默认以空格作为输出字段分隔符（OFS），所以输出格式自然保持空格分隔


18. 拆解讲义中的 [SSH 日志处理管道](https://missing-semester-cn.github.io/2026/course-shell/#shell-%E8%AF%AD%E8%A8%80bash)：每一步分别做了什么？然后仿照它构建一个管道，从 `~/.bash_history`（或 `~/.zsh_history`）中找出你最常使用的 Shell 命令。
命令原文：
```sh
ssh myserver 'journalctl -u sshd -b-1 | grep "Disconnected from"' \
  | sed -E 's/.*Disconnected from .* user (.*) [^ ]+ port.*/\1/' \
  | sort | uniq -c \
  | sort -nk1,1 | tail -n10 \
  | awk '{print $2}' | paste -sd,
```
`ssh myserver ''`连接服务器
`''`内：`journalctl -u sshd -b-1 | grep "Disconnected from"`
	`journalctl -u sshd -b-1`:查看上一次系统启动（上次开机）时，SSH 服务（sshd）产生的所有日志。
	`grep "Disconnected from"`从日志里面找到含有这样的行
这样的行，给了
`sed -E ''`  `-E`use extended regular expressions in the script，使用扩展正则表达式
	`s/.*Disconnected from .* user (.*) [^ ]+ port.*/\1/`
		以`2026-07-12 10:00:00 Disconnected from 192.168.1.1 user John Doe 10.0.0.1 port 22`为例
		`s`，替换
		正则表达式部分
			`.*`匹配任意字符，匹配`2026-07-12 10:00:00 `
			`Disconnected from `匹配`Disconnected from `
			`.*`匹配任意字符，匹配`192.168.1.1`
			` user `，匹配` user `
			`(.*)`，第一个捕获组，匹配`John Doe`
			` `，匹配` `
			`[^ ]+`，匹配一个或多个由非空格字符组成的字符串，匹配`10.0.0.1`
			` `，匹配` `
			`port`，匹配`port`
			`.*`匹配任意字符，匹配` 22`
		替换目标部分
			`\1`表示第一个捕获组，即`John Doe`
	总的来说，通过特定规则，把用户名给筛出来，并把这整一行给替换成用户名了
	`2026-07-12 10:00:00 Disconnected from 192.168.1.1 user John Doe 10.0.0.1 port 22`->`John Doe`
这样的用户名，给了
`sort | uniq -c` 排序去重统计数量
这样的数量+用户名，给了
`sort -nk1,1`
	`-n`对数字排序
	`-k1,1`排序依赖的键是从1到1,也就是只对第一个值（出现次数）进行排序
这样的有序的数量+用户名，给了
`tail -n10`，最后10个
这样的10个最多数量的数量+用户名，给了
`awk '{print $2}'`，按照空白字符分列，第一列是数量，第二列是用户名，只输出用户名，数量丢掉了
这样的10行10个用户名，给了
`paste -sd,`
	`-s` 多行合并为一行
	`-d,`使用逗号作为分隔符
最终输出的是，尝试访问服务器并访问失败的人尝试使用的用户名中出现数量最多的10个名字，一行输出，用逗号分隔

仿照他构建：

```sh
cat ~/.zsh_history ~/.bash_history 2>/dev/null \
  | sed -E 's/^:[0-9]+:[0-9]+;//' \
  | sort \
  | uniq -c \
  | sort -nk1,1 \
  | tail -n10 \
  | awk '{$1=""; print substr($0,2)}' \
  | paste -sd,
```


## ai给出的关于pattern的介绍
> ### 1. 第一套：通配符（Glob / Pathname Expansion）
> **处理者**：**Shell（终端）本身**。  
> **使用场景**：**匹配文件名**，帮你批量选中文件。  
> **发生时机**：在命令被运行**之前**，Shell 先把这些符号展开成具体的文件名。
> 
> - `*` 代表 **任意长度的任意字符**。
> - `?` 代表 **任意单个字符**。
> - `[abc]` 代表 **匹配括号内的单个字符**。
> 
> **举例**：
> 你输入 `ls *.txt`，Shell 在调用 `ls` 之前，先把 `*.txt` 变成了 `11.txt notes.txt`。`ls` 根本看不见 `*`，它只收到两个具体的文件名。
> 
> **特别注意**：你在 `[ -f "$1" ]` 里看到的 `-f`，**不是**通配符，那是 `test` 命令自己定义的“选项参数”（用来检测文件是否存在），别混为一谈。
> 
> 
> ### 2. 第二套：正则表达式（Regex）
> **处理者**：**专门的文本处理程序**（如 `grep`、`sed`、`awk`、Python/Perl 语言）。  
> **使用场景**：**匹配文本内容**（在文件内部、字符串内部找东西）。  
> **发生时机**：当程序（如 `grep`）收到参数后，由程序内部解析。
> 
> - `*` 代表 **前面的字符重复 0 次或无数次**。
> - `.` 代表 **任意单个字符**。
> - `.*` 连起来才是正则里的“通配符”（代表任意内容）。
> 
> **举例**：
> 你输入 `grep "a.*b" file.txt`。Shell 把 `"a.*b"` 原样传给 `grep`。`grep` 再去文件里找“以 a 开头，以 b 结尾”的行。
> **此时 Shell 不会展开 `.*`**，因为它在引号里，Shell 直接把它当普通字符串扔给 `grep`。
> 
> 
> ### 3. 第三套：Shell 参数扩展（Parameter Expansion，即 `${1%.*}`）
> **处理者**：**Shell（终端）本身**。  
> **使用场景**：**修改变量/字符串的值**（比如删掉文件名的后缀）。  
> **发生时机**：在执行命令**之前**，Shell 先对变量进行加工，把加工后的结果传给命令。
> 
> **规则**：
> - `%` 表示**从尾部**删除。
> - `#` 表示**从头部**删除。
> - 这里的 `*` 和 `?` 规则**借用**了通配符的逻辑（`*` 表示任意字符），但**它匹配的是变量内部的内容，而不是磁盘上的文件名**。
> 
> **举例**：`${1%.*}`，Shell 在运行 `cp` 之前，把 `$1` 从尾巴开始删掉 `.txt`，变成了 `11`，然后再传给 `cp`。


## 其他

- `2>/dev/null`表示把`stderr`全部扔掉，不写进文件，也不在屏幕上显示。
