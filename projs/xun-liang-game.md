---
title: 国风解谜游戏《寻梁》
description: 中国大学生计算机设计大赛省级二等奖作品，基于 Unity 与 C# 构建的国风解谜 / 叙事游戏，并引入 AIGC 视频、Premiere 剪辑与 Audition 音频处理，跑通“程序 + 技术美术 + 多媒体整合”的现代游戏开发管线。
date: 2026.04 - 2026.07
category: 游戏开发 / AIGC 实践
tags:
  - Unity
  - C#
  - AIGC
  - Adobe PR/AU
  - Sound Design
  - Team Collaboration
  - Game Design
  - Git LFS
githubUrl: https://github.com/programmer2048/BLCU_Project
role: 核心游戏程序员 / 跨界音视频设计师
award: 中国大学生计算机设计大赛省级二等奖
---

# 国风解谜游戏《寻梁》

《寻梁》是我大二下竞赛井喷期里最跨界的一次创作。

它不是一个纯程序项目，而是一个 7 人创意团队共同完成的国风叙事解谜游戏：2 名策划、2 名程序、3 名美工。我们参加的是中国大学生计算机设计大赛数字媒体游戏开发赛道，最终拿到省级二等奖。

我的角色很特殊：核心程序员，同时也是项目里的“粘合剂”。

我负责 Unity / C# 核心逻辑、关卡机制、物理交互、UI 框架和存档流程；当美术与音视频资源出现产能缺口时，我又临时切换成技术美术 / 视频音效师，用 AI 视频生成、Premiere Pro 和 Audition 把剧情转场、音效、配乐、混音接进项目。

这不是“帮忙剪个视频”，而是把 AIGC 作为游戏管线的一部分嵌进团队生产流程。

## 《寻梁》游戏概述

从 Unity 工程的章节资源和创作背景来看，《寻梁》围绕中国古建筑展开：应县木塔、佛光寺、南禅寺、晋祠等古建节点被组织成章节，游戏用叙事、社交、打工小游戏和古建解谜，把玩家带进一次寻找“大梁”、理解木构建筑与榫卯智慧的旅程。

项目的人文核心不是“做一个古风皮肤”，而是把传统建筑的结构之美变成可交互的游戏体验：

- 榫卯拼图：玩家通过拖拽、吸附、拼合理解木构连接。
- 建筑抗震：玩家搭建积木结构，再经历模拟地震考验，理解结构稳定性。
- 古建章节：以应县木塔、佛光寺、南禅寺、晋祠为线索推进。
- 社交叙事：通过手机聊天、家人、老板、同事等关系，让旅程带有人情温度。

工程目录也体现了这种设计：

```text
Assets/
├── 00_Core/                  # 存档、设置、事件、流程管理
├── 01_Gameplay/              # 社交、打工、小游戏
├── 02_Story/                 # 章节配置、剧情节点、古建图像资源
├── 03_Resources/             # 音频、视频、Sprites
├── 04_Scenes/                # Boot / MainUI / Story / MiniGames 等场景
└── 06_Plugins/               # DOTween、Book Page Curl、UOS 等插件
```

## 大团队协作与 Git 资产管理

Unity 项目最容易爆炸的不是代码，而是资产。

7 人团队里，美术会导入图片、PSD、音频、视频、Prefab、Scene；程序会改脚本和场景引用；策划会改流程、剧情和关卡需求。任何一个大型二进制文件冲突，都可能让一天的协作白费。

这个项目使用了 Git LFS 管理大型资产，`.gitattributes` 明确配置：

```text
*.png filter=lfs diff=lfs merge=lfs -text
*.jpeg filter=lfs diff=lfs merge=lfs -text
*.ogg filter=lfs diff=lfs merge=lfs -text
*.fbx filter=lfs diff=lfs merge=lfs -text
*.unity filter=lfs diff=lfs merge=lfs -text
*.asset filter=lfs diff=lfs merge=lfs -text
*.jpg filter=lfs diff=lfs merge=lfs -text
*.psd filter=lfs diff=lfs merge=lfs -text
*.mp3 filter=lfs diff=lfs merge=lfs -text
*.wav filter=lfs diff=lfs merge=lfs -text
*.prefab filter=lfs diff=lfs merge=lfs -text
```

这是一条很现实的游戏开发经验：

- C# 脚本可以正常 review 和 merge。
- 图片、音频、Prefab、Scene 交给 LFS。
- 大型二进制资产不做文本 diff，不赌冲突合并。
- 资源目录按 Gameplay / Story / Resources / Scenes 分层，降低沟通成本。

在团队里，我的价值不只是写代码，而是把策划、美术、程序之间的产物接起来：策划定义玩法，美术产出资源，我把它们落到 Unity 里的可运行系统。

## 核心程序架构：C# & Unity

项目使用 Unity 6000.3.8f1，依赖包括 UGUI、Input System、URP、Timeline、Video、Audio、DOTween、TextMeshPro 等。

### 1. 全局流程状态机

`Assets/00_Core/05_GameFlow/GameState.cs` 定义了全局状态：

```csharp
public enum GameState
{
    None,
    Boot,
    Prologue,
    MainUI,
    Social,
    PartTimeJob,
    Match3,
    Rhythm,
    TravelMap,
    Story,
    MiniGame,
    Album,
    Ending
}
```

这套状态把游戏切成可管理的体验段：启动、序章、主界面、社交、打工、三消、音游、剧情、小游戏、相簿、结局。

`FlowEventSystem` 通过 `EventBus.Subscribe<GameState>(GameEvent.OnGameStateChanged, ...)` 监听状态变化；`EventBus` 支持无参数、单参数、双参数事件，作为各模块解耦通信的基础设施。

### 2. 存档系统与资源循环

`SaveManager` / `SaveSystem` 用 JSON 文件保存数据：

- 存档目录：`Application.persistentDataPath/Saves`
- 存档格式：`.json`
- 全局配置：`GlobalSettings`
- 当前游戏数据：`GameData`

`GameData` 中维护：

- `money`
- `affinity`
- `currentChapter`
- `chapterSubState`
- 已解锁联系人
- 聊天记录
- 朋友圈 / 相册相关数据

这让打工小游戏、章节解锁、社交消息和剧情进度形成一个闭环：玩家在小游戏中赚旅费，旅费用于解锁章节，章节推进又带来新的社交与古建探索。

### 3. 场景过渡与剧情视频

`TransitionManager` 是全局场景过渡控制器：

- 使用 `DontDestroyOnLoad` 常驻。
- 用 `CanvasGroup.DOFade()` 做淡入淡出。
- 使用 `VideoPlayer` + `RenderTexture` + `RawImage` 播放加载 / 转场视频。
- 通过 `SceneManager.LoadSceneAsync()` 异步加载场景。
- 设置 `allowSceneActivation = false` 等待加载完成后再激活。

这正好承接了 AIGC 生成的剧情转场视频：AI 产出的片段不是散落在文件夹里，而是进入 Unity 的转场系统，成为玩家体验的一部分。

### 4. 剧情系统

`StoryManager` 负责章节剧情播放：

- 读取 `ChapterConfig`。
- 支持背景图、角色立绘、对话、选项、视频节点。
- 对话使用打字机效果。
- 支持回顾模式。
- 通过 `chapterSubState` 判断是进入剧情还是直接跳转小游戏。
- 视频节点使用 `VideoPlayer.loopPointReached` 监听结束后继续剧情。

`ChapterConfig` 使用 ScriptableObject，把章节 ID、标题、解锁费用、剧情节点、小游戏场景名、社交更新、下一章 ID 组织在一起。

这套结构让策划可以把剧情和关卡拆成数据，而不是所有流程写死在脚本里。

## 核心玩法与关卡机制

### 榫卯拼图：Mortise & Tenon

`JigsawManager` 与 `JigsawPiece` 组成榫卯拼图系统：

- `JigsawPiece` 实现 `IBeginDragHandler / IDragHandler / IEndDragHandler`。
- 每块拼图记录正确位置。
- 开局用 `ScatterPiece()` 随机打散。
- 拖拽结束时计算与正确位置的距离。
- 小于吸附阈值 `snapDistance` 后自动归位并锁定。
- 全部锁定后 `JigsawManager` 播放胜利流程。

这种机制把“榫卯结构”从概念变成了手感：拖、对、吸附、完成。

### 地震搭建：物理结构解谜

`EarthquakeManager` 与 `BlockInteract` 是最有物理味道的系统。

搭建阶段：

- 方块为 `Kinematic`，不会掉落。
- 鼠标拖拽时切换为 `Dynamic`，用速度追赶鼠标。
- 碰到其他方块会被真实物理挡住。
- 单击旋转，双击翻转。
- 拖拽结束回到 `Kinematic` 固定。

测试阶段：

- 所有方块切换为 `Dynamic`。
- 设置重力、质量、阻尼和连续碰撞检测。
- 地面刚体使用 Perlin Noise 模拟横波 + 纵波。
- 小球也进入动态物理。
- 最终按高度、水平偏移和速度稳定性判断胜负。

这套机制非常适合传统建筑主题：玩家不是看一段“古建抗震”的说明，而是亲手搭结构，再看它能不能撑住。

### 打工系统：三消与音游

为了把旅费、章节解锁和主线探索连接起来，项目设计了打工小游戏。

三消系统：

- `M3_GameManager` 维护状态、得分、耐心值、计时和暂停。
- `M3_Board` 生成 `6 x 8` 棋盘。
- 支持障碍物、炸弹、匹配检测、掉落补充、飞行动画。
- 得分转化为旅费，并写入 `GameData`。

音游系统：

- `RhythmGameManager` 读取谱面 JSON。
- 使用 `AudioSettings.dspTime` 做音频同步。
- 支持 tap / hold / trap note。
- 用 Combo、Perfect / Good / Miss、分数和结算奖励组织体验。
- 得分按比例转成旅费。

这些系统让游戏不只是古建参观，而是带有完整资源循环和玩法节奏的作品。

### 侍女修复与多阶段玩法

`MaidGameManager` 管理一个多阶段修复玩法：

- Phase 1：收集图标与修复对象。
- Phase 2：蓝图合成与进度推进。
- Phase 3：刮擦 / 擦除 / 装饰相关玩法预留与实现。
- 阶段解锁由 `phaseUnlocked` 控制。

这种结构让一个章节内部也能形成阶段式目标，而不是单一小游戏。

## 跨界破局：AIGC 视频与音效工程

这个项目最大的个人突破，是我不再只站在“程序组”边界里。

当美术人力紧张、剧情转场和音频资源需要快速补位时，我把 AIGC 和 Adobe 工具接进游戏管线：

- 用 AI 视频生成工具快速产出剧情转场素材。
- 用 Premiere Pro 做镜头筛选、节奏剪辑、转场合成和导出。
- 用 Audition 做噪声处理、环境音叠加、音量平衡和声场处理。
- 把处理后的 `mp4`、`mp3`、`wav` 导入 Unity 的 `Assets/03_Resources/04_Videos` 与 `Assets/03_Resources/03_Audio`。
- 再由 `TransitionManager`、`StoryManager`、`BGMManager` 统一接入游戏体验。

工程里可以看到多段视频资源：`Header.mp4`、`loading.mp4`、`ending.mp4`，以及大量具有场景氛围的音频文件，例如《山西古建之旅：高速车窗外的古韵回响》《木工坊斗拱榫卯之趣》《晋祠星空下的心跳对白》等。

这就是 AIGC 对传统游戏管线的降维打击：当团队没有足够美术 / 音频人力时，程序员可以用生成式 AI 快速补足第一版素材，再用专业剪辑与音频工具把它们变成可用资产。

我在这个过程中扮演的是 Bridge Builder：理解策划想要的情绪，理解美术资源的格式限制，也理解 Unity 里资源如何播放、如何加载、如何跟剧情节点对齐。

## 我的收获

《寻梁》让我第一次完整体验了多学科游戏团队的协作压力。

我学到的不只是 Unity C#：

- **游戏程序架构**：状态机、事件总线、存档系统、场景管理、剧情配置、小游戏循环。
- **物理交互**：Rigidbody2D、Collider2D、拖拽、旋转、连续碰撞检测、稳定性判定。
- **UI 与反馈**：UGUI、TextMeshPro、按钮绑定、胜负面板、打字机、资源提示。
- **音视频管线**：VideoPlayer、RenderTexture、RawImage、BGMManager、转场视频、背景音乐。
- **团队资产管理**：Git LFS 管理 Unity 大型资产，减少二进制冲突。
- **AIGC in Game Dev**：用 AI 视频生成缩短叙事资产制作周期，用 PR / AU 做二次工业化处理。

最重要的是，我看到了技术在创意团队中的另一种价值：程序员不只是“等资源的人”，也可以成为连接策划、美术、音频、引擎的中枢。

《寻梁》最终获得省级二等奖，对我来说它证明了一件事：当技术理解艺术、当 AI 进入管线、当程序员愿意跨界，小游戏也能承载文化表达和工程深度。
