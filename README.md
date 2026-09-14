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


