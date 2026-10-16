# Hugo 博客
框架：[Hugo](https://gohugo.io/)  

主题：[aiovtue](https://daily.yybb.us/posts/hugo-theme/aiovtue/hugotheme-aiovtue/)  

成品网站：[爱丽丝邦邦！](https://alsbb.top/)  

本仓库fork自<https://github.com/AIOVTUE/hugo-theme-aiovtue>。

## 本地开发

本项目统一使用 npm 管理依赖，保留并提交 `package-lock.json`。
请先安装 Node.js 22 或更高版本（包含 npm）及 Hugo Extended。

首次克隆或需要按锁文件重新安装依赖时执行：

```sh
npm ci
```

启动本地预览（包含草稿）：

```sh
npm run dev
```

构建网站前先停止预览服务器，再执行：

```sh
npm run build
```

构建产物位于 `public/`。新增或更新依赖使用 `npm install`，并提交更新后的
`package.json` 和 `package-lock.json`。部署平台的构建命令统一设置为 `npm run build`。

双系统迁移及 Linux 接续说明：[LINUX-HANDOFF.md](LINUX-HANDOFF.md)。Windows 在 D:\Projects\blog-website 中使用 npm run dev。

## 文章头图

文章 front matter 中的 `cover` 优先使用手动指定的图片，`cover: false` 则隐藏头图。
未填写 `cover` 或值为空时，从 `hugo.toml` 的 `[params].defaultCovers` 候选列表中，
按文章 URL 路径做稳定的伪随机分配。同一篇文章在列表、详情和搜索中使用同一张头图，
刷新页面或重新构建也保持一致；修改文章路径或候选列表后，分配结果可能改变。

可在 `defaultCovers` 中增删图片路径。设为 `[]` 或移除该配置时，恢复使用 `defaultCover`。
