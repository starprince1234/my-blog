---
title: 多模态流式智能体系统
description: 中国大学生计算机设计大赛国赛推优作品，基于 FastAPI、Vue 3、Qwen/DashScope、三层记忆、Function Calling 与 WebSocket/SSE 流式引擎构建的 AI-Native 多人协作平台。
date: 2026.03 - 2026.07
category: 人工智能 / 智能体研发
tags:
  - AI Agent
  - Qwen
  - DashScope
  - Function Calling
  - SSE
  - WebSocket
  - Streaming
  - RAG
  - FAISS
  - Vue 3
  - FastAPI
  - Web 全栈
githubUrl: https://github.com/starprince1234/Jishe
liveUrl: https://cbvjgf.art/
role: 队长 & 系统架构师 / 独立全栈开发
---

# Jishe AI 多模态流式智能体系统

线上地址：<https://cbvjgf.art/>

这是我大二下最硬的一块作品。

我和两位同学组队参加“中国大学生计算机设计大赛 - 软件与应用开发赛道”。我担任队长兼主设计师，负责把一个想法从“我们要做 AI 协作”推进到完整系统：后端架构、AI 中控、Agent 路由、记忆系统、工具调用、多模态输入、流式输出、前端交互、部署与验收。

项目最终成功推优国赛，进入全国决赛推荐序列。

这不是套壳聊天框。Jishe 的核心是一个面向多人协作场景的 AI Agent 系统：人类和智能体都被建模为房间参与者，用户通过 `@具体智能体` 触发 Agent，系统根据输入类型与意图选择不同能力链路，并把文本、思考过程、语音和图像结果低延迟推送到 Web 端。

## 项目起源与国赛之路

生成式 AI 爆发以后，很多产品都停在“一个输入框 + 一个回答”上。但真实协作不是这样的。

真实团队里有多人、有上下文、有历史、有文件、有图片、有任务角色，也有“我只想问某个 Agent”的明确意图。如果 AI 不能理解谁在说话、谁被 @、当前房间里发生过什么、之前上传过什么文件，那它只是一个孤立的聊天机器人。

我想做的是：

```text
多人房间 + 智能体成员 + 分层记忆 + 工具调用 + 多模态流式输出
```

于是 Jishe 的架构被定为“智能体成员化”：

- 用户是 participant。
- Agent 也是 participant。
- 消息身份以 `sender_participant_id` 为主干。
- Agent 触发采用 mention-only，不允许默认 AI 乱入。
- 每个 Agent 以自己的参与者身份回复、入库、回放。

这个决定让系统从普通 AI 助手，变成真正的多人协作 Agent 平台。

## 系统总架构

```text
Vue 3 / TypeScript / Pinia / Vite
        │
        │  HTTP / SSE / WebSocket
        ▼
FastAPI Gateway
        │
        ├── Auth / User / Room / Message / File / Dashboard / Admin API
        ├── WebSocket Manager + RabbitMQ Room Event Bus
        │
        ▼
AI Center
        ├── IntentRecognizer
        ├── FeatureRoutingOrchestrator
        ├── ModelSelector
        ├── CostController
        ├── ContextBuilder
        ├── RAGPipeline
        └── AgentRegistry
              ├── ToolCallingAgent
              ├── MultimodalUnderstandingAgent
              ├── ImageGenerationAgent
              ├── GenerationAgent
              ├── SearchAgent
              ├── SummaryAgent
              └── CodeAgent
        │
        ▼
Memory System
        ├── Redis: 实时记忆
        ├── MySQL: 摘要 / 情节 / 参与者事实 / 房间数据
        └── FAISS: 长期语义向量检索
```

技术栈来自源码与文档：

- **后端**：Python、FastAPI、Uvicorn、SQLAlchemy Async、MySQL、Redis、RabbitMQ、FAISS、APScheduler
- **AI**：Qwen / DashScope OpenAI-compatible API，`openai` SDK，Qwen text / omni / image 模型
- **前端**：Vue 3、TypeScript、Vite、Pinia、Vue Router、Axios、Element Plus、markdown-it、DOMPurify
- **实时通信**：WebSocket 房间事件、SSE 直聊流式、RabbitMQ 跨实例广播
- **部署**：Docker Compose、Nginx、GHCR 镜像、GitHub Actions 自动部署、HTTPS 线上站点

线上站点 `cbvjgf.art` 响应头显示 nginx 与 HSTS，说明项目已经跑在真实 HTTPS 环境中。

## Agentic Workflow：智能体工作流

Jishe 的主链路不是直接把用户消息丢给模型，而是一个完整的 Agentic Workflow：

```text
用户输入
  │
  ▼
mention-only 触发检测
  │
  ▼
FeatureRoutingOrchestrator 能力路由
  │
  ├── tool_calling_assistant
  ├── multimodal_assistant
  └── image_generation_assistant
  │
  ▼
MemoryRetrievalPlanner / RAGPipeline
  │
  ▼
ContextBuilder 结构化上下文
  │
  ▼
AgentRegistry 选择 Agent 执行
  │
  ▼
Qwen / DashScope 模型调用
  │
  ▼
WebSocket / SSE 流式回传
  │
  ▼
Agent 以 participant 身份入库
```

### 智能体成员化

在 `backend/app/services/room_agent_router_service.py` 中，核心策略被写死为：

- 只触发被 @ 的 Agent。
- 每条消息最多触发有限数量 Agent。
- 回复必须绑定到目标 Agent 的 `participant_id`。
- 禁止回退到“统一 AI 助手代发”。

这意味着前端历史回放和实时消息看到的是同一个身份模型：用户是用户，Agent 是 Agent，谁说的话就以谁的身份显示。

这是我认为最关键的产品级架构取舍。没有它，多 Agent 会变成“一个机器人假装很多角色”；有了它，Agent 才真正进入协作空间。

## 记忆系统：短期、摘要、长期三层融合

Jishe 的记忆不是简单把全部历史消息塞进 prompt，而是分层处理。

### Layer 1：实时记忆 Redis

`RealtimeMemory` 使用 Redis List 保存最近消息：

- 房间 Key：`memory:realtime:room:{room_id}`
- 私聊 Key：`memory:realtime:user:{user_id}`
- 每个会话最多 50 条
- 24 小时过期
- 用滑动窗口控制上下文长度

这一层解决“刚刚聊过什么”的问题，读取快，适合保持对话连续性。

### Layer 2：摘要记忆 MySQL

`SummaryMemory` 将阶段性对话摘要持久化到 MySQL：

- 按 room / user 保存摘要。
- 按时间倒序取最近摘要。
- 在上下文构建时注入为历史概要。

这一层解决 context overflow：不是把所有旧消息塞进去，而是把长历史压缩成摘要。

### Layer 3：长期语义记忆 FAISS

`VectorMemory` 与 `RAGPipeline` 负责语义检索：

- 文本转 embedding。
- 写入 FAISS index。
- 查询时按相似度 TopK 召回。
- 支持按 room 过滤。

后续迁移中还引入了更细的结构化记忆表：

- `room_memory_episodes`
- `participant_memory_facts`
- `room_artifacts`
- `artifact_chunks`

这让记忆从“聊天历史”升级成“可检索的协作知识”。

### Query 分类驱动检索

`MemoryRetrievalPlannerService` 会先判断问题类型：

- `recap_recent`：最近聊了什么
- `file_purpose`：某个文件 / 图片 / 语音是干嘛的
- `self_history`：我之前说过什么
- `participant_comparison`：谁更有道理
- `general_room_memory`：普通房间记忆

不同问题类型对应不同检索源顺序。这是非常重要的 Agent 工程经验：不是所有问题都该用同一种 RAG。

## Function Calling：工具调用与工具链

Jishe 的工具调用不是把函数名写在 prompt 里，而是做了 OpenAI-compatible tool definition 与执行中心。

### ToolHub

`backend/app/ai_center/tool_hub.py` 定义了三个核心抽象：

- `BaseToolExecutor`
- `ToolExecutionContext`
- `ToolExecutionResult`

内置工具 `mcp_fetch_url` 可以抓取网页并提取文本摘要。工具定义使用 OpenAI-compatible 结构：

```json
{
  "type": "function",
  "function": {
    "name": "mcp_fetch_url",
    "description": "Fetch webpage content and return a compact plain-text summary."
  }
}
```

模型返回 `tool_calls` 后，ToolHub 会：

1. 解析工具名与 JSON 参数。
2. 选择注册的 executor。
3. 执行工具。
4. 将结果编码成 `role=tool` 消息。
5. 继续下一轮模型调用。

### ToolCallingAgent

`ToolCallingAgent` 是工具链主入口，支持：

- 普通流式聊天
- Web search / web extract 触发
- Responses API 工具链
- 内置 ToolHub 循环
- DocMind MCP SDK 文档处理路径
- PPT / Word 生成 fast-path
- code interpreter / image search / web_search_image 相关工具路径

它最多执行 4 轮工具调用循环，避免无限调用，同时保留工具结果进入下一轮模型上下文。

这个模块是我对 Agent “会使用工具”这件事最深的工程实践：工具调用不是一行配置，而是模型、Schema、执行器、错误兜底、超时、回退和最终回复的完整闭环。

## 多模态与能力路由

Jishe 的能力路由由 `FeatureRoutingOrchestrator` 决定：

- `image_generate` → `image_generation_assistant`
- `multimodal_understand` → `multimodal_assistant`
- `smart_chat / tool_calling` → `tool_calling_assistant`
- `auto` 模式下：先看图片生成意图，再看是否有媒体输入，最后回落到工具调用

### 多模态理解

`MultimodalUnderstandingAgent` 支持 image / audio / video 输入：

- 用户上传媒体文件。
- 前端生成 `media_contexts`。
- 后端收集有效媒体 URL。
- 调用 Qwen Omni 类模型进行理解。
- 可选输出语音。

### 图像生成

`ImageGenerationAgent` 调用 `qwen-image-plus-2026-01-09`：

- 接收文本提示词。
- 可接收 `size`、`negative_prompt`。
- 调用 DashScope multimodal-generation。
- 返回图片 URL。
- 以 Markdown 图片格式渲染到聊天里。

这让 Jishe 不只是“能理解图片”，还可以主动生成图像。

## Streaming Engine：文本、思考、语音的实时流式引擎

Jishe 有两条流式链路。

### 1. 直聊 SSE 流式

`backend/app/api/ai.py` 中，`POST /api/ai/chat` 支持 `stream=true`：

- 后端创建 `asyncio.Queue`。
- LLM 的 reasoning / answer delta 被放入队列。
- `StreamingResponse` 以 `text/event-stream` 返回。
- 响应头包含 `X-Accel-Buffering: no`，避免代理缓冲。

前端 `AgentChatView.vue` 使用 `fetch()` + `ReadableStream`：

- `response.body.getReader()` 读取 chunk。
- `TextDecoder` 解码。
- 按 `\n\n` 切 SSE event block。
- 解析 `data:` JSON。
- `phase=reasoning` 时先显示“思考中”。
- `phase=answer` 到来后清空占位并逐字追加答案。

这是典型的 Web 端低延迟生成式体验。

### 2. 房间 WebSocket Agent 流式

多人房间里，Agent 回复不是 HTTP 请求返回，而是通过 WebSocket 广播：

- `ai_stream`：推送 reasoning / answer / audio chunk。
- `ai_stream_end`：结束流。
- `agent_status`：thinking / running 等状态。
- `agent_error`：错误反馈。

前端 `useWebSocket.ts` 负责连接、心跳、断线重连和事件分发；`chat.ts` 用 `upsertAiStreamDelta()` 按 stream key 创建或更新占位消息：

- reasoning chunk 追加到 `reasoning_content`
- answer chunk 追加到 `content`
- audio chunk 追加到 `audio_base64`
- stream end 后将消息置为非 streaming

这条链路解决多人协作的关键问题：AI 的每个流式片段都能被房间所有在线用户看到。

### 3. 语音流式与播放

后端 Qwen 请求支持 `modalities = ["text", "audio"]`，并从流式 delta 中解析：

- `audio_delta`
- `audio_format`

`RoomAgentRouterService` 将音频 base64 解码，必要时把 PCM16 包成 WAV，并持久化为音频文件。

前端 `MessageItem.vue` 支持两种音频来源：

- 已持久化的 `audio_url`
- 流式累积的 `audio_base64`

如果是无 WAV 头的 PCM，会在前端用 `wrapPcm16AsWav()` 包装成 Blob，再生成 `ObjectURL` 播放。

这不是简单 TTS 按钮，而是从模型流式音频到前端播放器的完整吞吐链路。

## 前端体验：AI-Native 的协作界面

前端是 Vue 3 + TypeScript + Vite + Pinia：

- `useWebSocket.ts`：WebSocket 连接、心跳、指数退避重连。
- `stores/chat.ts`：消息列表、AI streaming placeholder、reasoning/content/audio delta 聚合。
- `MessageItem.vue`：Markdown、图片、音频、思考面板、streaming 状态展示。
- `AgentChatView.vue`：直连 AI 对话、模型选择、多模态文件上传、SSE 读取、语音输入、TTS 播放。
- `AiConfigPanel.vue`：模式选择（auto / smart_chat / multimodal_understand / image_generate）。
- `AgentCreationWizardModal.vue`：智能体创建向导，支持不同 preset 和模型配置。

界面层并不是后端能力的简单按钮，而是在处理真实的 AI-Native 交互问题：

- 生成没完成时怎么显示？
- 思考内容和最终答案怎么分离？
- 音频 chunk 到来时如何合并？
- 图片消息如何兼容 URL、上传文件 ID 和 blob？
- WebSocket 断线后如何恢复？

这些细节决定了 AI 产品是否真的“顺”。

## 部署与工程化

Jishe 不是只在本地跑。

项目有完整 Docker / CI/CD 文档：

- `backend/docker-compose.yml`：本地全栈启动。
- `backend/docker-compose.prod.yml`：生产部署。
- `backend/docker/Dockerfile.ci`：后端镜像。
- `chatroom-frontend/Dockerfile.ci`：前端镜像。
- `.github/workflows/auto-deploy.yml`：自动部署。

部署流包括：

1. 检测 backend / frontend 改动路径。
2. 构建并推送 GHCR 镜像。
3. 使用 digest 做不可变部署。
4. SSH 到服务器更新 compose。
5. 执行健康检查。
6. 失败自动回滚。

线上 `https://cbvjgf.art/` 可访问，登录页显示“合智 · CoMind”，并展示“多 Agent 路由 / RAG 记忆 / 实时协作”。

## 我的收获与成长

Jishe 是我从全栈开发者迈向 AI-Native Engineer 的节点。

我真正掌握的不只是“调用大模型 API”，而是一整套智能体系统工程：

- **Agentic Workflow**：意图识别、能力路由、模型选择、成本控制、上下文构建、Agent 执行。
- **Function Calling**：工具 Schema、工具执行器、tool role 消息、模型多轮工具循环、超时和回退。
- **Memory Engineering**：Redis 实时记忆、MySQL 摘要记忆、FAISS 长期语义检索、查询分类驱动的检索策略。
- **Multimodal AI**：图片、音频、视频输入理解，文本生成图像，语音输出。
- **Streaming Systems**：SSE、WebSocket、文本 delta、reasoning delta、audio base64 chunk、前端增量渲染。
- **Team Leadership**：以队长身份定义系统主架构、拆任务、做技术取舍，把项目推到国赛层级。

这个项目让我明白：AI 工程的难点不在“把 prompt 写得更长”，而在于把模型放进一个可用、可控、可扩展、可观测的系统。

我不只是写了一个 AI 功能。我设计了一套 AI 协作平台的骨架。

这就是 Jishe 对我的意义。
