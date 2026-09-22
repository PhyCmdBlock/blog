# Linux 接续说明：Windows / Linux 共用 NTFS 博客

## 用户目标和已完成工作（2026-09-15）

用户要求把 C:\Dev\blog-website 复制到 D:\Projects\blog-website，Windows 和双系统 Linux 共用文章及源码；依赖按系统隔离。用户已弃用 pnpm，统一 npm。请继续完成 Linux 侧实际配置、自动挂载和验证，无需重新询问是否采用此方案。

- 当前正式工作副本：Windows D:\Projects\blog-website。C 盘原目录完整保留作为迁移备份，之后请只编辑 D 盘，避免分叉。
- 已复制源码、.git 历史、隐藏文件和 Git 忽略的本地文章/Obsidian 数据。node_modules 用 npm ci 重新安装；public 重新构建；未复制旧 .hugo_build.lock。
- Windows Node v22.23.2、npm 10.9.8、Hugo Extended v0.165.0。
- Windows npm ci、npm run build、npm run dev 已成功，开发地址 http://localhost:1313/。
- origin 为 https://github.com/PhyCmdBlock/blog.git，main 跟踪 origin/main。git push --dry-run origin HEAD:main 成功；没有执行实际提交或推送。
- package.json / package-lock.json 和 Cloudflare 构建逻辑保持原样。仓库中已无 pnpm 锁文件和配置。
- scripts/linux-npm.sh 是 Linux 专用安全入口：检查 node_modules 为挂载点且不是 NTFS/FUSE/FAT，再调用 npm；默认设置系统本地 Hugo 缓存。尚未在实际 Linux 上运行验证。

## Linux 实机配置结果（2026-09-15）

- 系统为 Arch Linux，日常用户为 `alice`。共享分区是 `/dev/nvme1n1p3`，UUID `C7B1202569059EDD`，由 `/etc/fstab` 以 `ntfs3` 挂载到 `/mnt/shared`；项目路径为 `/mnt/shared/Projects/blog-website`。
- 已安装系统 Node.js v22.23.2、npm 12.0.2、Hugo Extended v0.165.0。Node 与 Hugo 和 Windows 版本一致；Arch 当前仓库的 npm 比 Windows 新。`scripts/linux-npm.sh` 会显式使用 `/usr/bin/node` 和 `/usr/bin/npm`，避免误用 Codex Desktop 自带的 Node 运行时。
- Linux 依赖目录为 `/home/alice/.local/share/blog-website/node_modules`（ext4），已 bind mount 到 `/mnt/shared/Projects/blog-website/node_modules`。Windows 原有依赖没有删除，只在 Linux 挂载期间被遮住。
- `/etc/fstab` 已增加以下持久挂载，原文件备份为 `/etc/fstab.blog-website.bak`：

```fstab
/home/alice/.local/share/blog-website/node_modules /mnt/shared/Projects/blog-website/node_modules none bind,nofail,x-systemd.requires-mounts-for=/mnt/shared 0 0
```

- 已实际卸载并按 `/etc/fstab` 重新挂载成功。已通过 `npm ci`、sharp 0.35.3 WebP→PNG 实际处理、`npm run build`（77 页）以及开发首页 HTTP 200 验证。

## Cloudflare 约束

当前部署原本正常，保留 npm run build，输出 public。scripts/build.mjs 在 CF_PAGES=1 时下载 Linux amd64 Hugo Extended 0.163.3，保持此逻辑及 hugo.toml 的生产 baseURL。不要把 Linux 桌面挂载检查加入通用 npm 生命周期，否则会影响 CI。Windows 构建通过不等于线上部署已验证；本次没有触发 Cloudflare 部署。

## Linux 配置步骤（留作恢复参考）

1. 读取本文件、检查 git status，确认实际 D 盘 NTFS 设备 UUID、挂载路径、Linux 用户、发行版。不要假设设备名或 /mnt/data 已存在。不要格式化分区。
2. 将该 NTFS 分区稳定挂载，确保普通用户读写和 Git 可用。Windows 应完整关机并关闭快速启动，不在休眠状态跨系统写盘。
3. 安装兼容的 Node 22（至少 22.12）与 npm，以及 Hugo Extended；优先与 Windows 版本一致。保留 Cloudflare 固定版本。
4. 在 Linux 原生文件系统创建用户拥有的 ~/.local/share/blog-website/node_modules。先用 findmnt 确认该目录不在 NTFS/FUSE/FAT 上。不要把 Windows node_modules 内容复制进去。
5. 把此目录 bind mount 到共享项目/node_modules。该操作遮住 Windows 依赖，不删除它们。先确认没有指向该目录的进程。示例（替换实际项目路径）：

```bash
project=/实际挂载点/blog-website
mkdir -p "$HOME/.local/share/blog-website/node_modules"
mkdir -p "$project/node_modules"
sudo mount --bind "$HOME/.local/share/blog-website/node_modules" "$project/node_modules"
findmnt -T "$project/node_modules"
cd "$project"
bash scripts/linux-npm.sh ci
bash scripts/linux-npm.sh run dev
```

6. 配置持久 bind mount（fstab 或 systemd mount），源使用实际绝对路径，不使用 ~ 或 $HOME；保证 NTFS 先挂载、bind mount 后挂载。测试重启/重新挂载后依赖仍正确隔离，不要仅写配置就认定成功。
7. Linux 日常统一使用 bash scripts/linux-npm.sh ci / run dev / run build。未挂载前绝不能执行 npm ci 或删除 node_modules，否则会清掉 Windows 的依赖。不要 sudo npm。依赖锁文件修改后，两边分别重新安装。
8. 可进一步隔离 resources/_gen 缓存；public 和 resources/_gen 是可再生成内容，绝不能因此删除文章、static 或原始 assets。先停止服务，再处理 .hugo_build.lock；两个系统轮流启动，共用 public 可接受。
9. 验证 Linux 开发页 HTTP 200、生产构建、sharp 实际图片处理、git status/diff 与 git push --dry-run。不要实际推送或触发线上部署，除非用户要求发布。
10. 检查 Linux NTFS 上 Git 的文件权限/大小写表现；当前共享 .git/config 是 filemode=false、symlinks=false、ignorecase=true。不要为了 Linux 任意改成 Windows 不兼容设置。不要配置全局 safe.directory=*；仅在确有必要时信任实际项目路径。

## Windows 日常使用

```powershell
cd D:\Projects\blog-website
npm run dev
# 停止开发服务后构建
npm run build
```

Windows 直接使用 npm，不运行 Linux shell 包装脚本。Windows 的 node_modules 保存在 NTFS 项目目录；Linux 的 bind mount 不会在 Windows 生效。

## 验证范围和已知情况

安装时 npm 报告 1 个 high 级依赖漏洞；为保持现有部署依赖未自动运行 npm audit fix，后续应单独评估。迁移不改变账号凭据，Linux 需另行配置自己的 GitHub 认证（不要复制 Windows 凭据）。跨系统统一编辑器使用 LF，避免大小写不同但含义相同的文件名。
