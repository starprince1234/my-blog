---
title: 基于 Playwright 的 API 拦截式牛客网自动化抓取引擎 (AI Agent 核心插件)
description: 智能体大赛的核心数据源插件。采用无头浏览器特征绕过技术、响应级 API Hooking 拦截、半自动化登录态生命周期管理及多线程优雅退出机制，并首次完成公网 VPS 部署。
date: 2025.11 - 2025.12 (大二上)
category: 人工智能 / 爬虫与安全
tags: [Playwright, API Hooking, Cookie Lifecycle, Multi-threading, VPS Deployment, AI Agent Plugin]
githubUrl: https://github.com/starprince1234/niuke_scrape
role: 插件主开发者 & 基础设施部署工程师
highlights: [无头浏览器特征抹除, 响应级 API 拦截 (Hook), 登录态持久化复用, 守护线程优雅降级, 首次公网部署上线]
---

## 赛题起源与 AI 数据饥渴（Background & Problem）

在 COZE 智能体开发比赛里，Agent 的上限并不取决于“会不会回答”，而取决于它能否持续接入高质量、结构化、可复用的真实数据。牛客网面经页恰好是一个高密度、强时效、强结构化的知识源，但页面内容更新快、前端结构也会变化，因此我没有把它当成普通的网页采集题，而是把它当成一个面向 AI Agent 的核心数据源插件来做：目标不是抓“页面”，而是稳定产出可以喂给智能体的干净 JSON。

## 网络级 API 拦截（Advanced API Interception）

这个项目最关键的决定，是放弃 DOM 解析，直接在网络层做响应拦截。代码里通过 `page.on('response', handle_response)` 监听所有响应，再只筛选真正承载面经数据的接口，例如 `'/api/sparta/discuss/moment'`、`'/api/sparta/detail/moment-data/detail/'`、`'/moment'`、`'discuss'` 与 `'moment-data'` 相关请求。拿到 `response.json()` 后，直接解析 `data -> list / content` 路径，抽取 `id`、`title`、`content`、`createdAt`、`userBrief`、`frequencyData` 等字段。

这条路线的价值很直接：

- 数据完整，避免前端 DOM 只展示摘要、折叠正文或异步懒加载导致的信息丢失。
- 结构稳定，页面样式、组件树、文案层级变化时，底层 API 往往更稳。
- 字段天然结构化，点赞数、浏览量、教育信息、工作经历等都能直接入库。

对 AI Agent 来说，这比“爬到一段网页文本”更像是在构建一个可反复消费的知识管道。

## 指纹防检测与 Session 管理（Anti-Detection & Auth Lifecycle）

在浏览器启动参数里，我加入了 `--disable-blink-features=AutomationControlled`，配合自定义 UA，把自动化痕迹尽量压低到普通用户浏览器的观感里。项目不是暴力对抗，而是把“像真人”这件事做成浏览器默认姿态。

登录态管理则被拆成两段：

- `get_cookies.py` 负责本地手动登录，浏览器打开牛客网登录页后，用户在图形界面完成认证，再把 `page.context.cookies()` 导出到 `runtime/nowcoder_cookies.json`。
- 主抓取脚本在启动时通过 `NOWCODER_COOKIES_FILE` 复用 cookie；README 里还保留了 `gen_state_local.py` / `NOWCODER_STORAGE_STATE_PATH` 的 storage state 方案，形成“手动一次、后续复用”的会话生命周期。

这让项目在无头或云端运行时不需要反复重登，既降低摩擦，也减少了人为操作带来的不稳定。

## 异步守护线程与优雅落盘（Concurrency & Safety）

抓取逻辑里我没有把终止控制绑死在主循环上，而是用后台守护线程单独监听控制台输入。`setup_stop_listener()` 会起一个 daemon thread，持续等待 `stop / quit / exit / s / q`，一旦收到指令，就把 `self.should_stop` 置位，主循环在滚动、点击和等待过程中都会检查这个标志。

这样做的好处是：

- 主协程不会被输入阻塞。
- 用户可以随时中止任务，而不是强杀进程。
- `save_data()` 会在退出前把已经抓到的面经安全写入 JSON / TXT。

在 `finally` 中关闭浏览器与 Playwright，保证中断时也尽量完整回收资源。这是我第一次把“退出时不要丢数据”当成系统设计的一部分，而不是事后补丁。

## DevOps 的第一次碰撞（Deployment Significance）

这个项目的历史意义，远大于一个抓取工具本身。它是我第一次为了把一个 AI Agent 插件真正交付出去，去完整接触 VPS、Venv、环境变量隔离和公网部署流程。为了能让 COZE 平台调用，我第一次把业务代码放到服务器上跑通，第一次认真处理本地与云端的配置边界，也第一次意识到：一个项目从“能跑”到“能上线”，中间隔着的是工程化、可维护性和部署纪律。

也正因为这个项目，我真正走进了后面所有公网部署、高阶全栈和微服务项目的工程底座。

## 关键技术事实

- 主入口：`auto_spider.py`、`nowcoder_spider.py`
- 反检测：`--disable-blink-features=AutomationControlled` + 自定义 UA
- 响应拦截：`page.on('response', ...)`
- 数据字段：`id`、`title`、`content`、`createdAt`、`userBrief`、`frequencyData`
- 会话复用：`get_cookies.py`、`NOWCODER_COOKIES_FILE`、`NOWCODER_STORAGE_STATE_PATH`
- 停止机制：后台 daemon thread + `stop / quit / exit / s / q`
- 输出：`data/output/` 下的 JSON 与 TXT
