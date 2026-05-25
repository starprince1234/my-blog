# starprince Personal Site

一个使用 Vue 3、TypeScript、Vite 和 Tailwind CSS 构建的长期个人主页 / 作品集网站。它用于持续记录项目、技术栈、产品思考、实验原型和从想法到上线的构建过程。

## 本地运行

本项目当前不需要任何环境变量，也不会创建本地 `.env` 文件。如后续接入表单、API 或数据库，请先在 Doppler 中配置变量，并同步更新 `.env.example` 骨架。

```bash
npm install
doppler run -- npm run dev
```

如果当前机器还没有绑定 Doppler：

```bash
doppler login
doppler setup
doppler status
```

## 内容维护

- 个人身份、CTA、联系方式：编辑 `src/data/site.ts` 中的 `profile`。
- 项目数据：编辑 `src/data/site.ts` 中的 `projects`。
- 首页精选项目：给项目设置 `featured: true`。
- 项目排序：调整 `order`，数值越小越靠前。
- 隐藏草稿：设置 `draft: true`。
- 归档项目：设置 `archived: true` 或 `status: 'archived'`。
- 轻量项目：设置 `hasDetail: false`，只展示卡片和外部链接。
- 技术栈：编辑 `skillGroups`，建议把技能和实际项目关联起来。
- 时间线 / Now：编辑 `timeline`。

项目截图目前支持两种方式：提供 `media.image` 使用真实截图，或使用 `media.pattern` 生成占位视觉。替换真实项目截图时，建议放入 `src/assets/` 或 `public/`，优先使用 WebP，并补充清晰的 `media.alt`。

## 部署说明

项目已包含 `vercel.json` 和 `public/_redirects`，用于支持 Vue Router 的项目详情页刷新和直接访问。部署到 Vercel 或 Cloudflare Pages 时，构建命令使用：

```bash
npm run build
```

输出目录：

```bash
dist
```
