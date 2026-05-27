---
title: 跨平台时序分析与可视化系统
description: 大创项目技术结晶：将 Python 传感矩阵分析脚本工程化为 Flask / Socket.IO API，并用 Web 与 Flutter 构建覆盖移动端、桌面端和网页端的多端分析平台。
date: 2025 下半年 / 大二上
category: 跨平台应用 / 数据可视化 / 科研工程化
tags:
  - Python
  - Flask
  - Flask-SocketIO
  - Flutter
  - Dart
  - REST API
  - Socket.IO
  - Data Visualization
  - Docker
githubUrl: https://github.com/starprince1234/my-analysis-app
role: 独立软件研发负责人 / 大创技术骨干
---

# 跨平台时序分析与可视化系统

这个项目不是从一个漂亮的产品需求文档开始的。

它的起点是一批科研数据、一组传感矩阵 CSV，以及前人留下来的 Python 分析逻辑：能跑，但更像脚本；能算，但普通用户很难直接使用；能画图，但结果分散在本地文件和手动流程里。

我在大二上学期的大创项目里承担软件开发角色后，做的第一件事不是“再写一个界面”，而是先问：

> 如果算法要真正服务用户，它应该以什么形态存在？

我的答案是：把算法从脚本里解耦出来，做成标准服务；再把服务送到 Web、移动端和桌面端。

## 项目起源：从科研脚本到可用产品

原始问题很典型：科研代码通常面向开发者自己，输入路径、运行参数、图像输出都靠手动控制。对于普通用户来说，这意味着三件事：

- 不知道 CSV 应该放在哪里。
- 不知道哪个脚本对应哪个分析任务。
- 不知道任务进行到哪一步，也不知道结果在哪里看。

我把这个问题拆成产品路径：

```text
上传 CSV → 选择分析任务 → 实时查看进度 → 获取 GIF / PNG / JSON 结果
```

这条路径背后对应了工程重构：

- 把 Python 分析代码拆进 `backend/logic/`。
- 用 Flask 暴露文件上传接口。
- 用 Socket.IO 承载长任务进度推送。
- 用 Web 页面和 Flutter 客户端做可交互入口。
- 用 Docker + Nginx 把服务、静态页面、结果文件组织起来。

项目最终变成了两个核心代码库：

```text
D:\VScodeProjects\新建文件夹 (2)
├── my-analysis-app-web            # Flask 后端 + 原生 Web 前端 + Nginx / Docker
└── my-analysis-app-crossplatform  # Flutter / Dart 跨平台客户端
```

## 架构设计：API-First 的科研工程化

这个系统的核心不是页面，而是边界。

我把底层算法视为纯分析能力，把用户入口视为可替换客户端，中间用 API 和事件协议连接。

```text
CSV 文件
  │
  ▼
POST /api/upload
  │  UUID 重命名，保存到 backend/uploads/
  ▼
filepath
  │
  ├── Web 前端：socket.emit('start_processing', { task, filepath })
  └── Flutter：socket_io_client emit 同名事件
        │
        ▼
Flask-SocketIO 后端
  │
  ├── stress  → create_stress_animation()
  ├── nodule  → create_nodule_evolution_gif()
  └── stats   → run_statistical_analysis()
        │
        ▼
progress_update / task_complete / error
        │
        ▼
Web / Flutter 展示 GIF、PNG、JSON 报告
```

### HTTP 负责入口，Socket.IO 负责过程

本地代码里，后端入口是 `backend/app.py`：

- `POST /api/upload`：上传 `.csv` 文件。
- `start_processing`：Socket.IO 任务事件，启动 `stress`、`nodule`、`stats` 三类分析。
- `progress_update`：长任务进度推送。
- `task_complete`：返回结果 URL。
- `error`：返回错误信息。

这种拆分很重要：上传文件是一次性动作，用 REST API；分析任务耗时长，需要实时进度，用 Socket.IO。它比“点按钮后一直转圈”更接近真实产品体验。

### 算法层与 Web 框架解耦

三类核心算法被拆到独立模块：

```text
backend/logic/
├── stress_analyzer.py   # 应力分析动画
├── nodule_detector.py   # 结节检测演化
└── stats_processor.py   # 统计特征分析
```

这些函数通过 `progress_callback` 上报进度，而不是直接依赖 Flask 或 Socket.IO。这样做的价值是：算法层只关心输入 CSV、输出图像 / 报告；Web 层只关心上传、事件和结果返回。

这就是我在这个项目里真正学到的“工程化”：不是把代码塞进框架，而是把职责边界切清楚。

## Web 端：Flask + Socket.IO + 原生前端

Web 端不是复杂框架堆叠，而是非常直接的全栈闭环。

### 后端能力

技术栈来自 `backend/requirements.txt`：

- Flask 3.1.2
- Flask-SocketIO 5.5.1
- Gunicorn + eventlet
- pandas / numpy
- matplotlib / Pillow
- scikit-learn / scikit-image

后端提供了三个分析任务：

#### 1. 应力分析动图

`stress_analyzer.py` 读取 `MAT_0` 到 `MAT_95` 共 96 个传感通道，将每一帧重塑为 `12 x 8` 矩阵，并生成：

- 2D 热图
- 3D 曲面图
- 等高线图
- Max / Min / Mean / Std Dev 统计信息

最后用 Pillow 把多帧 PNG 合成为 GIF。

#### 2. 结节检测演化

`nodule_detector.py` 使用：

- Gaussian Mixture Model 识别异常区域
- `skimage.morphology.closing` 做形态学闭运算
- `regionprops` 提取区域特征
- 面积、圆度、强度趋势构成演化图

这个模块要求 CSV 除了 `MAT_*` 之外，还包含 `SN` 时间序列列。

#### 3. 统计特征分析

`stats_processor.py` 对 96 个传感通道做：

- FFT 频域特征提取
- StandardScaler 标准化
- KMeans 聚类
- PNG 聚类图输出
- JSON 报告输出

这一步把“看图”推进到“可解释的统计报告”。

### 前端交互

`frontend/index.html` 与 `frontend/js/main.js` 组成 Web 页面：

- 选择 `.csv` 文件。
- `fetch('/api/upload')` 上传文件。
- 上传成功后显示三个任务按钮。
- 通过 Socket.IO 发送 `start_processing`。
- 实时更新进度条。
- 根据结果类型展示 GIF、PNG 或 JSON 报告。

整个页面没有引入前端框架，反而让数据流非常清楚：DOM → API → Socket.IO → 结果渲染。

### 部署组织

项目使用 Docker Compose 编排：

- `backend`：Flask / Socket.IO 服务，Gunicorn + eventlet 单 worker 运行。
- `nginx`：提供静态前端，反向代理 `/api/` 与 `/socket.io`，并直接暴露 `/results/` 文件。
- `backend/uploads/` 保存上传 CSV。
- `backend/results/` 保存 GIF / PNG / JSON 结果。

这让项目从“本地脚本”进一步变成“可以被部署和复现的服务”。

## Flutter 跨平台端：一套 UI，多个终端

Web 端跑通后，我继续追问：如果用户不只在浏览器里用呢？

于是我自学 Dart 和 Flutter，在 `my-analysis-app-crossplatform` 中实现了跨平台客户端。项目结构包含：

```text
android/
ios/
linux/
macos/
web/
windows/
lib/
```

这意味着它具备 Flutter 的多端构建能力：Android、iOS、Web、Windows、macOS、Linux 都有平台工程骨架。当前重点验证的是 Android、Web、Windows 等可运行路径。

### Flutter 技术栈

来自 `pubspec.yaml`：

- `provider`：应用状态管理。
- `http`：CSV Multipart 上传。
- `socket_io_client`：接收后端进度与结果事件。
- `file_picker`：跨平台文件选择。
- `http_parser`：指定上传文件 Content-Type。

### 客户端状态层

核心状态在 `lib/app_state.dart`：

- `BACKEND_URL` 通过 `--dart-define` 注入，默认 `http://localhost:5000`。
- `pickAndUploadFile()` 使用 `FilePicker` 选择 CSV。
- Web 平台用 `MultipartFile.fromBytes`，非 Web 平台用 `MultipartFile.fromPath`。
- 上传成功后保存 `serverFilepath`。
- `startProcessing(taskType)` 通过 Socket.IO 发送任务。
- 监听 `progress_update`、`task_complete`、`error` 更新 UI 状态。

### 跨端 UI 与交互

`lib/main.dart` 使用 `ChangeNotifierProvider` 注入 `AppState`，页面由几张卡片组成：

- 上传 CSV
- 选择分析任务
- 处理进度
- 结果展示
- 系统缩放 / DPI 信息

主页面使用 `InteractiveViewer`，支持缩放和平移。这对数据分析类界面很重要：桌面端可以查看大图，移动端也能通过缩放查看细节。

### 原生能力探索

Flutter 客户端还通过 `MethodChannel` 预留 / 调用原生 DPI 或缩放信息：

```dart
MethodChannel('com.example.myapp/native_scale_control')
```

这说明它不只是“把网页换成 Flutter”，而是在探索 Flutter 与原生平台能力之间的边界。

## 核心技术挑战与攻关

### 1. Legacy 算法代码的 API 化重构

难点不是把 Flask 跑起来，而是把脚本变成服务：

- 输入必须标准化：只允许 CSV，且必须包含 `MAT_0` 到 `MAT_95`。
- 文件必须安全保存：使用 `secure_filename` 和 UUID 避免重名覆盖。
- 输出必须可访问：生成的 GIF / PNG 放到 `results/`，由 Nginx 直接提供。
- 算法不能绑死 Web 框架：通过 `progress_callback` 把进度上报抽象出来。

这一步让我从“调用函数”进入到“设计接口”。

### 2. 长任务进度与用户反馈

应力动画和结节检测都不是瞬时任务。尤其是 matplotlib 多帧渲染 GIF 时，如果前端没有实时反馈，用户只能看到页面卡住。

我用 Socket.IO 把任务过程拆成事件：

- `progress_update`：实时进度。
- `task_complete`：结果完成。
- `error`：错误反馈。

这让科研计算从黑盒变成可观察流程。

### 3. 大数据量时序图表渲染

96 通道、几十帧、多视图绘图，对 Web 与移动端都不是轻量内容。

后端选择先生成 GIF / PNG，而不是让前端实时绘制全部矩阵：

- Web 和 Flutter 都只负责展示结果文件。
- 重计算留在 Python 后端。
- matplotlib 每帧完成后关闭 figure，减少图像渲染过程中的内存压力。

这是一种务实的产品化取舍：先保证用户能稳定拿到结果，再考虑更复杂的交互式可视化。

### 4. Flutter 多端网络适配

Flutter 客户端需要面对不同终端的网络差异：

- Web / Windows 通常可以访问 `localhost:5000`。
- Android 模拟器访问宿主机要使用 `10.0.2.2`。
- 真机需要局域网 IP。
- 部署时通过 `--dart-define=BACKEND_URL=...` 注入生产后端地址。

这些细节让我意识到，跨平台不是“一套代码自动解决所有问题”，而是“一套业务逻辑 + 每个平台明确配置边界”。

## 我的收获与成长

这个项目极大扩展了我的工程版图。

我学到的不只是 Flask 或 Flutter，而是科研代码产品化的一整套路径：

- **Python 后端工程化**：把脚本拆成模块，把算法包装成 API。
- **科学计算服务化**：用 pandas / numpy / scikit-learn / matplotlib 承载分析任务，并通过 Web 服务交付结果。
- **实时任务可观测性**：用 Socket.IO 给长任务提供进度事件，而不是让用户盲等。
- **跨平台客户端研发**：用 Flutter / Dart 构建 Android、Web、Windows、macOS、Linux、iOS 的统一客户端基础。
- **部署意识**：用 Docker Compose 和 Nginx 把前端、后端、结果文件访问整合起来。
- **架构思维**：算法、API、Web UI、Flutter UI、部署层各司其职，任何一层都可以独立替换。

这也是我从“代码编写者”向“多端系统规划者”转变的节点：我开始不只关心功能能不能写出来，而是关心它能不能被用户访问、能不能跨端运行、能不能被部署、能不能被复现。

把科研脚本变成产品，是一次真正的工程化训练。
