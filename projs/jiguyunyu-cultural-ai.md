---
title: 「稽古云语」文物智能识别与双后端交互系统
description: 省级大创负责人项目 / 软件创新大赛省三等奖，采用 Java + Python 双后端解耦、VLM 文物识别服务、RAG 多轮对话、UniApp 微信小程序与 Android 客户端的文物智能识别系统。
date: 2026.02 - 2026.07
category: 人工智能 / 软件工程
tags:
  - Vision-Language Model
  - VLM Fine-tuning
  - Dual-Backend
  - Java Spring
  - Python FastAPI
  - UniApp
  - Android
  - RAG
  - ChromaDB
  - Jetpack Compose
githubUrl: https://github.com/starprince1234/Soft_Innovation_Competition
liveUrl: 微信小程序搜索直达 / Android APK 真机演示
role: 项目创始人 & 负责人 / 核心全栈与 AI 算法工程师
award: 省级大创立项 / 全国大学生软件创新大赛省级三等奖
---

# 稽古云语：文物识别与 AI 多轮对话系统

「稽古云语」是我大二下作为项目负责人主导的旗舰项目。

它不是一个单端 Demo，而是一套围绕文物识别、文物知识问答、文物管理和移动端体验构建的软硬件一体化系统：微信小程序、Android App、Java 业务后端、Python AI 推理服务、MySQL、Redis、ChromaDB、对象存储、VLM 推理、RAG 多轮对话、Docker Compose 云端部署。

这个项目同时承载两条比赛线：

- 省级大学生创新创业训练计划立项。
- 全国大学生软件创新大赛省级三等奖。

我在其中承担项目创始人、负责人、核心架构师、全栈工程师和 AI 算法工程师的复合角色。

## 项目起源与双线荣誉

文物识别看起来像一个“拍照识别”功能，但真正要做成可演示、可扩展、可答辩的系统，问题会立刻变复杂：

- 用户要能登录、上传图片、查看识别历史。
- 管理员要能维护文物库、审核考古人员提交的文物。
- 普通用户、考古人员、博物馆管理者要有不同权限。
- 识别结果不能只返回一个标签，还要能进入多轮上下文对话。
- AI 服务不能把大模型推理塞进 Java 主业务线程里。
- 移动端要能现场真机演示，微信小程序要能直接触达用户。

所以我从一开始就没有把它当成一个“模型调用 Demo”。我按中大型软件来设计：先写开发总纲，定义角色权限、数据库 Schema、API 契约、Java/Python 边界、部署方式和测试方式，再推进团队实现。

开发文档中明确了系统目标：在有限周期内完成一套融合 RAG-LLM 与视觉识别模型的文物智能问答与识别平台，覆盖文物拍摄识别、低幻觉多轮对话、文物列表浏览、历史记录、用户反馈、健康检查、安全登出和统一 API 规范。

这正是我从个人开发者转向项目负责人的节点：我不只写功能，而是定义工程边界、组织团队协作、控制交付节奏。

## Dual-Engine Architecture：Java + Python 双后端解耦

「稽古云语」最重要的架构选择，是双后端。

```text
UniApp 小程序 / Android App
        │
        ▼
Java Spring Boot API Gateway
        ├── 用户 / JWT / RBAC
        ├── 文物库 / 收藏 / 反馈 / 团队 / 管理端
        ├── 检测任务状态机
        ├── MySQL / Redis / BOS
        │
        │  X-Internal-Token + REST
        ▼
Python FastAPI Internal AI Service
        ├── /internal/detect/process
        ├── /internal/dialog/responses
        ├── VLMDetector / Qwen3-VL-LoRA
        ├── RAG / ChromaDB / Sentence-BERT
        ├── Qianfan LLM / AI Search
        └── Redis Cache
```

### Java 端：事务性业务主干

Java 后端是 Spring Boot 3.1.6 多模块工程：

```text
JiGuYunYu_Java/
├── jigu-bootstrap       # 启动与装配
├── jigu-api             # Controller + DTO
├── jigu-application     # 应用服务 / UseCase / 事务边界
├── jigu-domain          # 领域模型 + Repository 接口
├── jigu-infrastructure  # JPA / Redis / BOS / PythonClient
└── jigu-common          # 统一响应 / 异常 / 错误码
```

Java 负责稳定的业务系统：

- 用户注册、登录、登出。
- JWT 鉴权与角色权限区分。
- 文物列表、详情、收藏。
- 文物识别任务创建、状态查询、结果查询。
- 对话历史与上下文保存。
- 反馈与截图。
- 管理端用户、文物审核、知识库重建、仪表盘。
- MySQL 持久化、Redis 缓存、BOS/OSS 对象存储。

### Python 端：AI 推理与 RAG 引擎

Python 服务是 FastAPI 内部服务，面向 Java 暴露 `/internal/*` 接口：

- `GET /internal/health`
- `POST /internal/detect/process`
- `POST /internal/dialog/responses`
- `POST /internal/knowledge/reindex`
- `POST /internal/knowledge/upsert`
- `POST /internal/knowledge/delete`

Python 的职责是大算力和 AI 计算：

- VLM 文物识别。
- RAG 检索。
- Sentence-BERT embedding。
- ChromaDB 向量库。
- 千帆 LLM / AI Search 回答。
- Redis 对话缓存和检索缓存。

### 解耦协议：Internal Token + REST

Java 端通过 `PythonClient` 统一调用 Python，所有内部请求自动携带：

```text
X-Internal-Token: <INTERNAL_TOKEN>
```

`PythonClient` 集中处理：

- baseUrl 拼接。
- 连接 / 读取超时。
- 内部鉴权 Header。
- 统一响应拆包。
- 错误码映射。
- 调用耗时日志。

这让 Controller / Application 层不允许随便拼 URL 调 Python。AI 服务是可替换的内部能力，而不是散落在业务代码里的 HTTP 调用。

## 数据库设计：从用户到文物到对话上下文

项目开发文档和 SQL 初始化脚本定义了核心数据表：

- `users`：用户、密码哈希、角色、状态、登录时间。
- `artifacts`：文物名称、描述、图片、缩略图、标签、地点、年代、审核状态、向量 ID。
- `detection_tasks`：识别任务、图片 URL、状态、识别 label、confidence、bbox、raw result。
- `dialog_records`：多轮对话记录、artifactId、conversationId、turnId、user_query、ai_response、context_snapshot、rag_sources。
- `feedback`：用户反馈、评分、截图 URL、处理状态。
- `user_favorites`：用户收藏。
- `teams` / `user_team_membership`：团队协作关系。

这套 Schema 说明项目不是一次性调用模型，而是把“识别 → 对话 → 收藏 → 历史 → 管理审核”做成长期数据系统。

## VLM Fine-tuning & Deployment：从训练到服务化的闭环

项目文档中提出的 AI/ML 候选路线包含 PaddleDetection / PP-YOLOE+、ERNIE-4.5-VL / 百度千帆、RAG + ChromaDB + Sentence-BERT、千帆 AI Search。最终我选择把视觉链路收敛到一条「自训练 LoRA + 远端推理服务」的双轨路线。

### 训练侧：Qwen3-VL-8B-Thinking + Q-LoRA

训练代码位于独立工程 `qwen3-vl微调/aa/`，由三份文件组成：

- `finetune_qwen3vl.py`：训练主脚本（383 行）。
- `requirements.txt`：依赖锁定。
- `run_finetune.sh`：训练启动脚本。

依赖栈来自 `requirements.txt`：

```
git+https://github.com/huggingface/transformers
accelerate
peft
bitsandbytes
torch
torchvision
pillow
trl
datasets
qwen-vl-utils
```

训练脚本基于 Hugging Face `Trainer` + PEFT LoRA + bitsandbytes 4-bit 量化，关键事实如下：

- **基座模型**：`Qwen/Qwen3-VL-8B-Thinking`，通过 `AutoProcessor` + `Qwen3VLForConditionalGeneration`（不可用时回退 `AutoModelForCausalLM`）加载。
- **量化方案**：`BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4", bnb_4bit_compute_dtype=torch.float16, bnb_4bit_use_double_quant=True)`，配合 `prepare_model_for_kbit_training` 实现 Q-LoRA。
- **LoRA 配置**：`r=64`、`lora_alpha=16`、`lora_dropout=0.05`、`bias="none"`、`task_type="CAUSAL_LM"`，`target_modules` 默认 `q_proj,k_proj,v_proj,o_proj,gate_proj,up_proj,down_proj` 全注意力 + FFN 投影。
- **优化器**：`paged_adamw_32bit`，`max_length=2048`。
- **数据格式**：`./dataset/museum_data_api/train_data.jsonl`，每条样本 `{image, question, answer}`，被组装成 Qwen3-VL 多轮 `messages`：user 含 `{"type": "image"}` + `{"type": "text"}`，assistant 含目标回答。`clean_answer` 会把字符串化的 list（如 `"['english ']"`）反解析为干净文本。
- **图像路径修复**：`fix_path` 处理 `/Volumes/lenovo/...` 的源路径，回退到 `dataset/museum_data_api/images`、`dataset/museum_data_hf/images`、`dataset/images` 三个目录按 basename 寻找，找不到即丢弃，保证只用真实可读的样本进训练。
- **数据整理器**：自定义 `QwenVLDataCollator`。它会调 `processor.apply_chat_template` 生成文本，然后修复 Qwen3-VL-Thinking 模板会偶发多塞 `<|image_pad|>` 的问题——按 `<|vision_start|><|image_pad|><|vision_end|>` 块从尾部成对剔除多余 token，确保文本里的图像占位符数量与实际图片数量严格一致。
- **训练参数**（来自 `run_finetune.sh`）：

  ```bash
  python finetune_qwen3vl.py \
      --model_name_or_path Qwen/Qwen3-VL-8B-Thinking \
      --data_path ./dataset/museum_data_api/train_data.jsonl \
      --output_dir ./qwen3vl_finetuned \
      --num_train_epochs 3 \
      --per_device_train_batch_size 2 \
      --gradient_accumulation_steps 8 \
      --learning_rate 1e-4 \
      --weight_decay 0.01 \
      --warmup_ratio 0.03 \
      --logging_steps 5 \
      --save_steps 50 \
      --save_total_limit 2 \
      --fp16 True \
      --remove_unused_columns False \
      --report_to none
  ```

  脚本同时设置 `HF_ENDPOINT=https://hf-mirror.com`，解决国内拉取 Qwen3-VL 权重的连通性问题；并标注 24GB VRAM 下 8B 模型搭配 LoRA 的可行批量。
- **训练产物**：`./qwen3vl_finetuned/`，由 `trainer.save_model` 写入 LoRA adapter，`processor.save_pretrained` 写入对应的 tokenizer / processor，可直接被推理服务挂载或合并。
- **干跑模式**：`--dry_run` 仅检查数据加载与图片可达性，不加载模型。我用它在引入新批数据时先验证 `(image, question, answer)` 三元组是否完整、图片路径能否落到真实文件。

整条训练链路解决的不是“能不能跑通 demo”，而是“小算力下让 Qwen3-VL 在文物垂域产出可控、结构化、可被业务消费的回答”。

### 推理侧：VLMDetector + 远端模型服务

业务侧通过 `VLMDetector` 对接训练或部署好的视觉模型：

- 通过 `VLM_BASE_URL`、`VLM_API_KEY`、`VLM_MODEL_NAME` 注入模型服务。
- 默认模型名为 `qwen3-vl-lora`，与训练产物名义对齐。
- 文档 `vlm服务使用.md` 记录了已部署的 `Qwen3.5-35B-A3B-FP8` 文物考古学家模型，外部模型名为 `qwen3.5-35b-a3b-archaeology`。
- 请求方式为 OpenAI-compatible `/chat/completions`。
- 输入包含文本提示词和 `image_url`，图片可以是 base64 data URL。
- 输出被要求严格 JSON 化：文物名称、置信度、类别、年代、描述。

识别提示词不是泛泛地问“这是什么”，而是明确要求模型以中国文物鉴定专家身份判断：

- 是否包含文物。
- 文物名称。
- 类别和大致年代。
- 置信度。
- 50 字以内描述。

### 训练 → 服务的衔接

训练产物 `./qwen3vl_finetuned/` 输出 LoRA adapter，可以被远端推理框架挂载到 Qwen3-VL-8B-Thinking 上，对外暴露成 `qwen3-vl-lora` 这条 OpenAI 兼容接口。生产环境再叠一层 `vlm-tunnel` 把远端 VLM API 通过 SSH 隧道安全转发到 Compose 服务网络内，配合 `VLMDetector` 完成「私有化模型服务接入 → 业务侧统一调用 → 失败回退到 YoloDetector stub」的完整链路。

所以这不是“仓库里只有调用、没有训练”的拼装项目：训练脚本、量化方案、LoRA 超参、数据修复、模板对齐、推理服务、SSH 隧道、回退检测器，整条 VLM 微调与产品化路径都有真实落地代码。

## 检测链路：从图片到识别结果

识别流程由 Java 和 Python 分工完成。

### Java 创建任务

`DetectController` 提供：

- `POST /api/v1/detect/tasks`
- `GET /api/v1/detect/tasks/{taskId}/status`
- `GET /api/v1/detect/results/{taskId}`

`DetectService` 的任务状态机：

```text
PENDING → PROCESSING → COMPLETED / FAILED
```

创建任务时：

1. 接收前端传来的 base64 图片。
2. 上传到 BOS/OSS。
3. 创建 `DetectionTask`。
4. 异步调用 Python `/internal/detect/process`。
5. Python 返回 detections 后取置信度最高的结果。
6. 写入 label、confidence、bbox、rawResult。
7. 根据 label 匹配 APPROVED 文物库，返回 artifactId。

### Python 执行推理

`DetectUseCase` 的图片解析优先级：

1. `image_base64`：最稳定，不依赖对象存储可访问性。
2. BOS/OSS 下载。
3. HTTP URL 下载。

然后调用 `DetectorPort`。当 `VLM_BASE_URL` 已配置时，使用 `VLMDetector`；否则回退到 `YoloDetector` stub，方便本地链路测试。

这体现了工程韧性：真实模型可以接入，mock 模型也能跑通 CI / 演示链路。

## RAG 多轮对话：从识别结果到深度讲解

识别只是入口。真正的体验是用户拿到结果后继续追问。

对话链路由 Java `DialogService` 与 Python `DialogUseCase` 共同完成：

- Java 端创建 conversationId 和 turnId。
- 前端传入 contextHistory。
- Java 调 Python `/internal/dialog/responses`。
- Python 端先查 Redis 对话缓存。
- 再用 Sentence-BERT 生成 query embedding。
- 通过 ChromaDB 检索本地文物知识 topK chunks。
- 根据阈值过滤、去重、排序。
- 拼接 system prompt、识别上下文、RAG 资料、历史对话和用户问题。
- 调用千帆 LLM / web_summary。
- 合并本地 RAG 来源与网页检索来源。
- 写入 Redis 检索缓存和对话缓存。
- Java 端把 AI 回复、rag_sources、context_snapshot 存入 MySQL。

这让用户可以围绕某件文物持续追问，而不是每轮都像第一次见面。

## Omnichannels：微信小程序 + Android + Web 联调页

### UniApp 微信小程序端

小程序工程是 UniApp + Vue 3 + Pinia：

- `build:mp-weixin` 构建微信小程序。
- `build:h5` 构建 H5。
- 页面包括：鉴识、识别记录、收藏、设置、登录、注册、结果、宝库、问答、反馈、个人中心、文物详述。
- TabBar 包含：鉴识 / 宝库 / 问答 / 我的。
- 首页支持拍照或上传图片，调用 `detectApi.createTask`，再轮询任务状态并跳转结果页。
- 问答页支持基于 artifactId 的多轮上下文对话。
- 结果页支持收藏、分享和向 AI 提问。

这条线的价值是“微信即入口”：评委和用户不需要安装复杂环境，可以直接现场使用。

### Android 原生端

Android 端使用 Kotlin + Jetpack Compose：

- Retrofit + OkHttp 调 Java API。
- Coil 加载图片。
- Navigation Compose 管理路由。
- `BuildConfig.API_BASE_URL` 可通过 Gradle 参数注入。
- 页面包括登录、首页、文物详情、检测、聊天、历史、收藏、反馈、管理员页面等。

Android 端不是简单 WebView，而是原生 Compose 客户端，适合现场 APK 真机演示。

## Production Multi-Client Deploy：部署与工程完整性

项目提供本地和云端两套部署材料。

本地 Docker Compose：

- MySQL 8
- Redis 7
- Java Spring Boot
- Python FastAPI
- mock VLM
- Nginx

生产 Compose 中还包含 `vlm-tunnel`：通过 SSH 隧道把远端 VLM API 安全转发到服务网络里，配合 `VLM_BASE_URL`、`VLM_API_KEY`、`VLM_MODEL_NAME` 完成私有化模型服务接入。

环境变量设计也很完整：

- `JWT_SECRET`
- `INTERNAL_TOKEN`
- `VLM_BASE_URL`
- `VLM_API_KEY`
- `VLM_MODEL_NAME`
- `QIANFAN_API_KEY`
- `BOS_ACCESS_KEY`
- `BOS_SECRET_KEY`
- `VECTOR_BACKEND`
- `CHROMA_COLLECTION`

这让我从“能跑”推进到“可部署、可复现、可安全配置”。

## 我的收获与领袖蜕变

「稽古云语」是我从个人开发者升级为项目负责人的关键项目。

我学到的不只是某个框架，而是项目掌控力：

- **架构师深度**：设计 Java + Python 双后端，把事务业务和 AI 推理彻底解耦。
- **AI 算法工程**：接入文物垂直 VLM，设计识别 prompt，处理结构化 JSON 输出和推理降级。
- **RAG 工程化**：用 ChromaDB、Sentence-BERT、Redis 缓存和千帆 LLM 组合出可用的多轮问答链路。
- **多端交付**：微信小程序、Android App、Web 联调页共同覆盖评委扫码和现场真机演示。
- **团队领导力**：撰写规范化开发文档，定义角色、权限、数据库、API、部署和测试标准。
- **工程安全意识**：内部服务 token、IP 白名单、JWT 黑名单、Secret 环境变量、Docker 数据卷、生产密钥不入仓。

这个项目证明了一件事：我不仅能写一个功能，也能把一个复杂系统拆成清晰边界，组织团队，把 AI 模型、业务后端、移动客户端和部署体系合成一个能参赛、能演示、能扩展的产品。

这是我目前最能代表“项目负责人 + AI 工程师 + 全栈架构师”三重身份的旗舰作品。
