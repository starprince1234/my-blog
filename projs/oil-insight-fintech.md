---
title: 「油擎洞察」多因子机器学习油价预测与 AI 研报系统
description: 花旗杯金融创新应用大赛推优国赛项目，打通多因子量化预测、结构化风险解释、LLM 自动研报与交互式金融分析师演进路线。
date: 2026.05 - 2026.08
category: 金融科技 / 机器学习 / 生成式 AI
tags:
  - Quantitative Finance
  - Machine Learning
  - LLM Report Generation
  - Financial Agent
  - Full-stack Web
  - FastAPI
githubUrl: https://github.com/starprince1234/Hua_Qi_Bei
liveUrl: https://lyn91r.cn/
role: 项目总策划 & 首席系统架构师 / 全栈开发
award: 花旗杯金融创新应用大赛推优国赛 / 全国决赛圈
---

# 「油擎洞察」：把冷冰冰的油价预测变成可追问的金融判断

「油擎洞察」不是一个只输出涨跌数字的模型 Demo。它的目标是把国际油价的多因子波动机制拆成一条可操作的数据链路：用户上传油价与宏观因子表格，系统完成数据校验、特征治理、机器学习推理、风险区间还原、行业冲击映射、解释层联动，最后把结构化结果交给大语言模型生成金融研报。

我在这个项目中承担总策划兼系统主架构师角色，负责技术路线设计、Technical Report 梳理、算法部署、前后端上线与演示视频制作。对我来说，这个项目最有价值的地方，是它把 Quant 的确定性和 GenAI 的表达力放到同一条生产链里：模型负责给出可审计的数字，LLM 负责把数字翻译成金融业务能读懂、能质疑、能继续追问的语言。

## 项目愿景：传统量化与 LLM 的奇妙化学反应

传统量化预测很容易停在一行结果上：未来 7 日收益率、中位价格、置信区间、风险等级。它对算法工程师有意义，但对业务用户不够友好。用户真正想知道的是：为什么这个结果可信？哪些因素推高或压低风险？航空、航运、化工等行业分别会受到什么传导影响？如果要做汇报，能不能直接生成一份结构清晰、口径稳定的分析材料？

因此我把系统设计成「定量预测 + 定性研报」的双引擎：

- 定量侧由多周期机器学习模型输出点预测与 0.05 / 0.50 / 0.95 分位数风险区间。
- 解释侧把 SHAP/代理贡献、行业冲击、知识图谱路径和因子筛选理由整理为结构化 Context Pack。
- 生成侧通过 OpenAI-compatible LLM 接口生成受约束金融报告，并在失败时回退到规则模板，保证演示与接口稳定。

这样，预测不再是孤立数字，而是一份能被阅读、被追问、被用于决策讨论的金融分析对象。

## 多因子机器学习模型（Quantitative Kernel）

技术报告把因子生产拆成两条轨道：一条是 EIA、FRED、CFTC 等官方数值指标，覆盖库存、宏观、价差与市场情绪；另一条是 GDELT 全球事件数据库 + 轻量 RAG + LLM 的事件因子工厂，用来量化地缘冲突、OPEC 会议、制裁、霍尔木兹海峡等稀疏文本风险。LLM 不直接预测价格，而是先把事件判断为多空方向、强度和置信度，再聚合为日度冲击分数，并通过半衰期衰减函数转化为连续特征，例如 Geo_Risk_Index 与 Supply_Shock_Index。

模型训练工程位于 `huaqibei-main/src`。核心文件 `model.py` 将油价预测拆成 1D、3D、7D、14D、30D 五个周期，每个周期读取对应的因子表，目标列分别是 Brent close 在不同窗口下的涨跌幅。报告中的目标变量定义为 K 日累计对数收益率：`r(t,K)=ln(P(t+K)/P(t))*100%`，K 覆盖 1、3、7、14、30 个交易日。选择对数收益率而非绝对价格，是为了获得时间可加性、更接近平稳序列，并降低非平稳价格趋势对模型的干扰。

模型内核采用 Hybrid Stacking：

- Layer 1 是两类基模型：`xgboost.XGBRegressor` 捕捉非线性因子关系，`RidgeCV` 承担线性基准与正则化稳定器。
- Layer 2 使用 `LinearRegression(fit_intercept=False)` 对 XGBoost 与 Ridge 的 OOF 预测做线性加权，形成最终点预测。
- 交叉验证使用 `TimeSeriesSplit`，保证训练索引早于验证索引，避免时间序列泄露。
- 供需类特征如果包含库存 / Inventory，会写入 XGBoost `monotone_constraints`，把业务先验编码进模型。
- 风险区间由三组额外的 XGBoost 分位数模型给出，目标函数为 `reg:quantileerror`，分位点为 0.05、0.50、0.95，对应 90% 风险区间。

`param_optimizer.py` 为 XGBoost 加入贝叶斯优化：先按 60% / 20% / 20% 做时序训练、验证、测试分割，再用 `BayesianOptimization` 搜索 `max_depth`、`learning_rate`、`subsample`、`colsample_bytree`。`backtest.py` 进一步提供 Walk-Forward 与 rolling-window 回测，统计 R²、RMSE、MAE、方向命中率等指标。

报告抽取出的实证结果显示，样本覆盖 2014-2025 年 4,018 条交易日观测；7D 是最优核心周期，测试集 R² 达到 0.7005，RMSE 为 0.84%，MAPE 为 8.24%，方向准确率为 62.1%。在 Walk-Forward 回测中，7D 模型跨四个阶段的平均 R² 为 0.689，平均方向准确率为 61.8%，Sharpe Ratio 约 1.29，最大回撤约 -2.18%。这组结果支撑了项目里“周度周期最适合承接库存、OPEC 政策和地缘事件信息消化”的业务判断。

模型输出不是直接扔给前端，而是经过价格还原与一致性修正：预测收益率会被还原为 USD/桶价格路径；如果分位数发生 crossing，则按中位数附近的上下界进行修正，避免风险带在展示层出现违反金融直觉的交叉。报告还将 0.05 分位数用于动态止损、风险区间宽度用于仓位控制、极端分位用于压力测试；7D 模型 90% 置信区间实际覆盖率约 89.2%，平均风险区间宽度约 ±4.8%。

## 数据-模型-LLM 协同研报管线（The Data-LLM Pipeline）

服务端工程位于 `huaqibei-backup-20260524/backend/huaqibei/oil-risk-orchestrator`。它不是把训练脚本直接塞进 Web，而是做了清晰的编排层：FastAPI 对外提供 `/api/v1/upload`、`/api/v1/predict`、`/api/v1/report`，模型层通过 JSON 契约或 OpenAI-compatible 模式解耦调用。

完整链路如下：

1. 用户在 Next.js 前端上传 `.csv / .xlsx / .xls / .parquet` 因子文件。
2. `UploadService` 解析表格，并调用数据校验与缺失修复逻辑，生成可复用的 `file_id`。
3. `FeatureService` 依次执行 `DataValidator → AsofAligner → LagBuilder → InteractionBuilder`，把上传数据治理成模型可消费的特征向量。
4. `ModelClient` 统一封装远端模型服务调用、超时、重试和格式归一化。
5. `PostprocessService` 把模型收益率分布还原成价格路径，并生成多周期预测摘要。
6. `RiskService / IndustryService / ShapService / FactorReasonService / GraphQuery` 生成风险等级、行业冲击、因子贡献、因子筛选理由和知识图谱传导路径。
7. `ReportService.build_context_pack` 只把白名单字段传给 LLM：`prediction`、`risk_analysis`、`top_drivers`、`industry_impact`、`knowledge_graph_paths`。
8. LLM 输出必须通过章节 Schema 与字段命中校验，失败后重试；仍失败则 `_rule_based_report` 模板回退。

这条管线的重点是让 LLM 不凭空写研报。它只能站在量化模型和解释模块已经给出的事实之上，把「收益率、价格区间、风险等级、因子贡献、行业传导」翻译成银行团队更容易阅读的段落。定量数据是骨架，生成式 AI 是表达层，两者互相约束，而不是互相替代。

前端由 Next.js 16、React 19、Tailwind CSS 4、Framer Motion 与 Recharts 构成。`ResultDisplay.tsx` 渲染中位价格、上下界曲线、行业冲击、因子贡献与报告卡片，前端不是简单展示 JSON，而是把模型结果组织成可以汇报的金融风险界面。

## 演进方向：端到端 AI 金融分析师（FinTech Agent）

当前系统已经具备自动研报生成能力，下一步是将报告从「一次性输出」升级为「可追问对象」。正在接入的 Financial Analyst Agent 会围绕同一套预测结果、历史因子、行业路径和报告章节构建多轮问答上下文，让用户可以继续追问：

- 为什么 7 日风险区间变宽？
- 航空和化工行业的冲击路径有何差异？
- 哪些宏观因子对当前结论影响最大？
- 如果 Brent 当前价格变化，模型报告口径应该如何调整？

从架构上看，这个 Agent 不应该脱离已有数据管线单独回答。更合理的做法是把预测结果、报告章节、因子贡献、知识图谱路径和上传文件摘要组成可检索上下文，结合 RAG 与会话记忆，让大模型变成一个 24 小时在线的宏观分析师。它可以解释模型，但不能越过模型伪造事实；它可以生成观点，但观点必须回到结构化数据与可审计链路。

## 我的角色与总策划领导力

这个项目训练的是一种比单点编码更复杂的能力：如何把金融业务、机器学习、Web 工程、LLM 生成和竞赛表达统一成一个能跑通的系统。

作为总策划，我做的不是简单分配任务，而是持续维护项目的主线：

- 把油价预测问题拆成多周期收益率预测、分位数风险带、行业传导和研报生成几个可交付模块。
- 用 Technical Report、接口文档和演示材料统一团队表达，确保评审看到的是完整产品，而不是散落的脚本。
- 在算法侧推动 XGBoost + Ridge + Stacking + 分位数回归的训练与部署闭环。
- 在工程侧打通 FastAPI 编排后端、Next.js 可视化前端、Docker/Nginx 部署与 OpenAI-compatible LLM 接口。
- 在展示侧完成高质量演示视频与项目讲解，把复杂链路压缩成评委能快速理解的金融科技故事。

「油擎洞察」对我的意义，是一次从算法实现者到 Total Architect 的跃迁：我不仅要让模型预测，还要让数据可上传、接口可调用、报告可审计、前端可演示、团队可讲清楚。这正是 Quant & GenAI 跨界项目最迷人的地方：理性模型给出边界，生成式智能让边界被看见、被解释、被继续追问。
