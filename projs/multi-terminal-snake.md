---
title: 多端联机网络贪吃蛇
description: 大一下 Java 硬核实践：从控制台作业跳出来，拆出 Java 状态同步后端、Web Canvas 客户端、Android 原生客户端和 Java Swing 桌面端的跨端贪吃蛇系统。
date: 2025-06-09
category: 全栈开发 / 网络游戏
tags:
  - Java
  - Servlet
  - JSON
  - Android
  - Swing
  - HTML5 Canvas
  - 前后端分离
  - 实时状态同步
githubUrl: https://github.com/starprince1234/java_snakegame
role: 独立全栈开发
---

# 多端联机网络贪吃蛇

大一下学 Java 的时候，我没有满足于“写一个控制台贪吃蛇交作业”。

控制台能跑，说明语法过关；但我真正想知道的是：如果把一个小游戏拆成**服务端状态机 + 多个客户端渲染层**，会发生什么？如果 Web、Android、Desktop 三个完全不同的终端都要表达同一个游戏世界，代码应该怎么组织？状态在哪里更新？输入怎么传回？画面怎么跟上？

于是我做了这个硬核实践：一个以 Java 为核心的跨端贪吃蛇系统。

> 源码校准：当前本地项目中，Web 端已经实现了 Java Servlet 后端 + JSON 状态接口 + Canvas 客户端轮询同步；Android 与 Desktop 端是独立原生客户端，复用了同一套蛇身、食物、方向、碰撞和分数模型。项目中 `pom.xml` 引入了 `javax.websocket-api`，但当前可见源码没有真正的 WebSocket Endpoint，因此本文按本地文件实际实现描述，不伪造不存在的长连接代码。

## 项目起源与硬核故事

学校里的 Java 练习往往从控制台开始：输入、循环、判断、输出。它能训练语法，但很难触碰真实工程里的问题。

我当时给自己加了三个约束：

1. **不能只做单机控制台**：必须有图形界面，必须能被真实操作。
2. **不能只做一个终端**：Web、Android、Desktop 三端都要跑出自己的体验。
3. **不能只写页面**：Web 端要有 Java 后端托管游戏状态，前端只负责输入和渲染。

这让一个简单的贪吃蛇变成了系统设计题：

- 后端需要维护权威游戏状态。
- 客户端需要把方向、暂停、重启这类输入提交给服务端。
- 服务端需要定时推进游戏世界。
- 前端需要持续获取状态并绘制画面。
- 不同终端需要在不同 UI 框架下实现同一套游戏规则。

它不再是“蛇怎么动”的问题，而是“一个实时系统怎么把状态、输入、渲染拆开”的问题。

## 系统架构与数据流

本地目录由三个子项目组成：

```text
D:\VScodeProjects\新建文件夹
├── java_snakegame_web      # Java Web 后端 + HTML5 Canvas 客户端
├── java_snakegame_android  # Android 原生 Java 客户端
└── java_snakegame_desktop  # Java Swing 桌面端客户端
```

### Web 端数据流

```text
键盘输入 / 按钮点击
        │
        ▼
static/js/game.js
        │  POST /snake?action=direction|pause|restart
        ▼
SnakeServlet
        │
        ▼
GameEngine  —— ScheduledExecutorService 每 150ms 推进状态
        │
        ▼
GameState（snakeBody / foodPosition / score / gameOver）
        │
        ▼
GET /snake 返回 JSON
        │
        ▼
Canvas drawGame(state) 重绘蛇、食物、分数、Game Over 覆层
```

Web 端采用的是前后端分离思路：

- `SnakeServlet` 暴露 `/snake`，负责接收控制指令和返回 JSON 状态。
- `GameEngine` 是服务端状态机，使用 `ScheduledExecutorService` 每 150ms 调用 `updateGameState()`。
- `GameState` 是跨前后端传输的状态模型，包含蛇身坐标、食物坐标、分数、游戏结束状态。
- `static/js/game.js` 使用 `fetch()` 获取状态和发送控制命令，再用 Canvas 绘制画面。

虽然这不是最终形态的 WebSocket 长连接，但它已经把最关键的架构拆开了：**服务端拥有状态，客户端负责输入与渲染**。这正是后来理解 WebSocket、事件驱动和实时同步的入口。

## 三端技术细节

### 1. Java Web 后端：Servlet + Gson + 定时状态机

路径：`java_snakegame_web/src/main/java/com/example/snake`

技术实现：

- Maven WAR 项目，`pom.xml` 中配置 Java 8 编译、`jakarta.servlet-api`、`gson`。
- `SnakeServlet` 使用 `@WebServlet("/snake")` 注册接口。
- `ServletContext` 中保存全局 `GameEngine`，保证 Web 端请求访问的是同一个游戏状态。
- `doGet()` 返回当前 `GameState` JSON。
- `doPost()` 根据 `action` 参数处理暂停、方向切换、重启。
- `Gson` 将 Java 对象序列化成前端可消费的 JSON。

核心状态机：

- 棋盘尺寸：`30 x 30`。
- 游戏节拍：`ScheduledExecutorService.scheduleAtFixedRate(..., 150ms)`。
- 方向控制：`Direction.UP / DOWN / LEFT / RIGHT`。
- 反向移动保护：禁止蛇直接从 UP 切 DOWN、LEFT 切 RIGHT。
- 碰撞检测：边界碰撞、自身碰撞。
- 食物生成：随机生成，避开蛇身。

### 2. Web 客户端：HTML5 Canvas + Fetch 状态同步

路径：`java_snakegame_web/src/main/webapp/static`

Web 端不是把规则写死在浏览器里，而是围绕服务端状态做渲染：

- `index.html` 提供 `600 x 600` 的 `canvas#gameCanvas`。
- `game.js` 使用 `canvas.getContext('2d')` 绘制网格、蛇、食物、分数、暂停层和 Game Over 覆层。
- `fetchGameState()` 通过 `GET /snake` 获取状态。
- `sendDirection()`、`sendPauseState()`、`restartGame()` 通过 `POST /snake` 发送输入。
- `gameLoop()` 使用 `setTimeout(..., 150)` 驱动前端刷新。
- `isRequestPending` 请求锁避免前一次状态请求未完成时叠加新请求。
- `localStorage` 保存最高分、音乐开关和音量。

这里最关键的工程意识是：**前端不直接决定游戏世界，只消费后端状态并提交意图**。

### 3. Android 端：原生 Java + Custom View + Handler 游戏循环

路径：`java_snakegame_android/app/src/main`

Android 端使用原生 Java 实现：

- `MainActivity extends AppCompatActivity`。
- `GameView extends View`，重写 `onDraw(Canvas canvas)` 手动绘制蛇和食物。
- `GameEngine` 维护本地状态机，棋盘为 `18 x 24`，适配手机竖屏。
- `Handler.postDelayed(..., 200)` 驱动 Android 端游戏循环。
- 方向按钮通过 `btn_up / btn_down / btn_left / btn_right` 控制方向。
- `SharedPreferences` 保存 Best Score。
- `DisplayMetrics` 动态计算游戏区域和方向按钮尺寸，适配不同屏幕。

Android 端让我第一次直面移动端问题：屏幕尺寸不是固定的，触控按钮需要足够大，游戏区域和控制区域必须一起算，而不是简单把桌面版缩小。

### 4. Desktop 端：Java Swing + JFrame/JPanel + Timer

路径：`java_snakegame_desktop/Code/SnakeGame/src/SnakeGame.java`

桌面端使用 Java Swing：

- `SnakeGame extends JFrame` 创建窗口。
- `GamePanel extends JPanel implements KeyListener` 负责绘制和键盘输入。
- `javax.swing.Timer` 以 `50ms` 节拍驱动游戏循环。
- 使用 `Graphics` 绘制蛇身、食物、分数、Game Over 文案。
- 使用数组 `x[] / y[]` 存储蛇身坐标。
- 空格键在 Game Over 后重开窗口。

这个版本更接近传统桌面游戏开发：事件监听、定时器、重绘、窗口生命周期都集中在一个 Java 程序中。

## 核心攻关与技术挑战

### 1. 状态同步：先把“权威状态”从前端抽出来

贪吃蛇看起来简单，但实时游戏的第一原则是：必须明确谁拥有权威状态。

在 Web 端，我把游戏状态放在 Java 后端：

- 服务端每 150ms 更新蛇的位置。
- 客户端只发送方向、暂停、重启等意图。
- 客户端持续拉取 `GameState` 并重绘。

这让我第一次理解：前后端分离不是“前端一个项目，后端一个项目”这么简单，而是**状态所有权的边界划分**。

### 2. 延迟与节拍：轮询不是终点，但足够暴露问题

Web 端当前实现使用 `fetch + setTimeout` 轮询，而不是 WebSocket。这个选择暴露了实时系统的关键问题：

- 请求太慢时，前端不能继续堆请求，所以需要 `isRequestPending`。
- 前端刷新节拍要和后端状态推进节拍接近，否则画面会抖或滞后。
- 暂停时既要停前端循环，也要通知后端停止状态推进。

这也是我后来理解 WebSocket 价值的原因：如果要继续升级，下一步应该把 `GET /snake` 轮询改为服务端主动推送状态，把方向输入改为双向消息协议。

### 3. JSON 协议：跨语言 / 跨平台的最小公共层

Web 后端用 `Gson` 输出的状态结构非常直接：

```json
{
  "snakeBody": [[15, 15], [14, 15]],
  "foodPosition": [8, 20],
  "score": 3,
  "gameOver": false
}
```

这个结构足够让任何终端渲染：Web 可以画 Canvas，Android 可以画 `Canvas`，Desktop 可以画 `Graphics`。真正跨端的关键不是 UI 一样，而是状态模型一致。

### 4. 多端适配：同一个游戏，不同的交互物理

三端的差异非常明显：

- Web 端用键盘方向键，画布固定为 `600 x 600`。
- Android 端用屏幕按钮，必须动态计算控件尺寸。
- Desktop 端用 Swing 窗口和键盘事件，追求更高刷新频率。

这让我意识到：跨平台不是复制代码，而是抽象规则、重写交互。

## 我的收获与成长

这个项目是我从“会写 Java 语法”走向“理解系统”的关键一步。

我学到的不只是 Swing、Android、Servlet 或 Canvas，而是更底层的工程思想：

- **网络编程意识**：客户端不必拥有全部逻辑，可以通过接口向服务端提交意图。
- **事件驱动模型**：键盘、按钮、定时器、Handler、Servlet 请求，本质都是事件进入系统。
- **游戏状态同步**：实时系统的核心是状态模型、更新节拍和输入协议。
- **前后端分离**：Web 端只渲染和发送控制，Java 后端维护权威状态。
- **多终端适配**：同一个游戏规则，在 Web、Android、Desktop 上需要不同的交互设计。
- **架构诚实感**：源码里没有实现 WebSocket，就不能在作品集中硬说已经实现；但这个版本清楚暴露了为什么下一步应该走向 WebSocket。

这不是一个完美项目，但它很硬核：它把我从课堂 Java 推到了网络、渲染、移动端、桌面端和系统边界的交叉路口。

从那以后，我看项目不再只看“功能有没有做完”，而会先问：状态在哪里？输入怎么流动？谁负责渲染？系统怎么同步？

这就是它对我的价值。
