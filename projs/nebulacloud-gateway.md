---
title: NebulaCloud 微服务 AI 路由网关
description: 大型微服务系统 NebulaCloud 中由我独立负责的 nebula-ai 流量入口子系统，跑通 Git Flow 多人协同、GitHub Actions CI/CD 与开源逆向落地。
date: 2026.05 - 2026.07
category: 云原生 / 系统工程
tags:
  - Microservices
  - API Gateway
  - Cloud Native
  - CI/CD
  - GitHub Actions
  - Git Flow
  - FastAPI / Python
  - Reverse Engineering
  - Traffic Management
githubUrl: https://github.com/MegaFlowAI/NebulaCloud
role: 核心网关开发者 / 架构设计与 DevOps 实践
---

# NebulaCloud 微服务 AI 路由网关：我的工程师成人礼

NebulaCloud 是我加入技术社团后参与建设的大型微服务系统，主仓库由 `Backend/`、`Frontend/`、`nebula-ai/` 等多个子系统组成。我独立负责其中流量最大、安全要求最严苛的子模块 —— `nebula-ai` 中的 API 中转与路由网关 `gateway-api`。它的角色是把所有 OpenAI 兼容、Anthropic 兼容协议的 AI 请求统一接到平台密钥体系下，做认证、配额、限流、路由、容灾、计费、审计与可观测性，所有真实 AI 流量都从这条管道穿过。

这个项目对我个人来说不只是一次代码贡献，而是几个「第一次」叠在一起的工程师成人礼：第一次在多人项目里跑标准的 Git Flow 与 PR Review，第一次写 GitHub Actions Workflows 把 `git push` 变成可观察的 CI/CD 管线，第一次在生产级的开源项目（`new-api`）上做逆向研究并把它变成自己的设计选择，也是第一次让自己写的代码承载真实活跃的高频 AI 调用。出于安全与社团内部约束，演示链接和密钥不公开，下文中的事实全部来自仓库内的真实代码与 workflows。

## 项目背景与微服务架构定位

`gateway-api` 用 FastAPI 写成，独立部署，不和业务 Web 后端共享进程。`apps/gateway-api/app/main.py` 创建 `FastAPI(title="Nebula Gateway API")`，挂上 `RedactionLoggingMiddleware`，按 `settings.api_prefix`（默认 `/api/nebula/gateway`）注册整套 API 路由，并暴露 `/metrics` 渲染 Prometheus 指标。

API 路由通过 `apps/gateway-api/app/api/router.py` 聚合：

- `/healthz`：健康检查，返回 `{ service: "gateway-api", status: "ok" }`。
- `openai_router`：完整的 OpenAI 兼容协议族，覆盖 `/chat/completions`、`/completions`、`/responses`、`/embeddings`、`/images/generations`、`/images/edits`、`/audio/transcriptions`、`/audio/translations`、`/audio/speech`、`/video/generations`、`/realtime` WebSocket、内部 `/internal/usage-summary`、`/internal/providers/health`、`/internal/monitor/realtime`。
- `anthropic_router`：Anthropic 兼容协议，`/messages` 与 `/v1/messages`，做 OpenAI ↔ Anthropic 协议转换后再走同一条上游链路。

`apps/gateway-api/app/core/config.py` 中可以看到这条网关的全部行为开关：`NEBULA_GATEWAY_PROXY_MODE`（mock / upstream）、`NEBULA_GATEWAY_DEFAULT_ROUTE_STRATEGY`（默认 `weighted_random`）、`NEBULA_GATEWAY_RETRY_COUNT=2`、`NEBULA_GATEWAY_RETRY_BACKOFF_MS=150`、`NEBULA_GATEWAY_CIRCUIT_BREAKER_FAILURES=3`、`NEBULA_GATEWAY_CIRCUIT_BREAKER_OPEN_MS=3000`、`NEBULA_GATEWAY_HEALTHCHECK_INTERVAL_MS=10000`、`NEBULA_GATEWAY_HEALTHCHECK_ON_ROUTE=true`、`NEBULA_GATEWAY_AFFINITY_HEADER=x-session-id`、`NEBULA_GATEWAY_GLOBAL_RPM_LIMIT=3000`、`NEBULA_GATEWAY_API_KEY_RPM_LIMIT=360`、计费相关的 base / prompt / completion multiplier 与 `NEBULA_GATEWAY_BILLING_DEFAULT_BALANCE_UNITS=200000` 等。配置看上去普通，但每一项都对应着一种真实生产场景下我必须考虑的失败模式。

`gateway-api` 不直接读业务数据库表，它通过 `apps/gateway-api/app/core/db.py::ensure_gateway_schema()` 在启动时自我登记自己需要的表：`nebula_gateway_api_keys`、`nebula_users`、`nebula_organizations`、`nebula_projects`、`nebula_project_members`、`nebula_billing_accounts`、`nebula_billing_holds`、`nebula_billing_ledger`、`nebula_provider_routes` 等，并对历史结构做 `ALTER TABLE … ADD COLUMN IF NOT EXISTS` 的兼容升级。这种自治结构让网关可以在多人协作中独立演进，不必等业务 Backend 同步迁移。

## 工程师的成人礼：Git Flow 与多人协同

NebulaCloud 主仓库使用 GitHub 多分支 Git Flow，工作流配置直接落在 `.github/workflows/` 下：

- `Frontend.yml` 与 `Backend.yml` 监听 `master`（生产）与 `test`（测试）两条分支，按 `github.ref` 分别选择 `restart_prod` 或 `restart_test`、`build_prod` 或 `build_test` 的 Make 目标，并切换 `PROD_*` 与 `TEST_*` 两套 Secrets。
- `NebulaAI-Test.yml` 把 `nebula-ai/**` 路径专门隔离出来：`pull_request → test` 仅做构建校验（不推送镜像、不部署），`push → test` 才会真正构建并通过 SSH 部署到测试服务器；同时强校验 `nebula-ai/VERSION` 必须是 `x.y.z` 语义化版本号，否则直接失败。
- `CodeReview.yml` 限定 `pull_request → master` 且 `head_ref == 'test'` 才触发 `qodo-ai/pr-agent`，自动执行 `auto_review`、`auto_describe`、`auto_improve`，把回复语言锁定为 `zh-CN`，对 Bot 发起的 PR 直接跳过。
- `CodeQualityAnalysis.yml` 在每个 PR 上跑 `Done-0/fuck-u-code` 静态分析，自动把代码质量报告以 PR comment 的形式更新或追加。

放在工程师视角看，这套结构实际上是把分支模型变成纪律：

1. 我的所有改动必须先开 feature 分支，merge 到 `test` 之前需要走 PR；PR 一旦打开，CI 会强制做镜像构建校验，跑代码质量分析，并由 PR Agent 写出中文 review 评论，逼着我把 commit 拆干净、把 description 写到位。
2. `test` 分支落地后，`NebulaAI-Test.yml` 自动把代码 `scp` 到测试服务器、做 `docker compose up -d --build` 重启，整条链路依赖 `TEST_REMOTE_HOST / TEST_REMOTE_PORT / TEST_REMOTE_USER / TEST_SSH_PRIVATE_KEY / TEST_DEPLOY_TARGET / NEBULA_AI_TEST_ENV_FILE` 等 Secrets，且在执行前 fail-fast 校验它们是否齐全。
3. 准备发布到 `master` 时再开第二轮 PR，PR Agent 自动 review 一次 + 人工 Code Review 一次，merge 才会把改动推进到生产链路。

这套约束教会我一件事：在多人项目里写代码，不只是写好功能，而是要让整个团队都能快速、安全、可追溯地把它推上生产。

## 云原生实践：GitHub Workflows 与自动化运维

`NebulaAI-Test.yml` 是我落地 CI/CD 的主战场，它把一次 push 拆成 9 个可观察的步骤：

1. `actions/checkout@v4` 拉代码。
2. 计算 release 目录 `${TEST_DEPLOY_TARGET}/nebula-ai-releases/${run_id}-${run_attempt}`，同时记录 stable 目录 `${TEST_DEPLOY_TARGET}/nebula-ai`。
3. 读取 `nebula-ai/VERSION`，校验语义化版本，并基于 commit SHA 计算 `test-<short_sha>` 镜像 tag。
4. 校验所有部署 Secrets 必须存在，缺一个就直接 fail。
5. 通过 `appleboy/ssh-action@v1.2.0` 在测试服务器上 `mkdir -p` 出 release 与 stable 目录。
6. 跑一次空 SSH 连通性预检，确保私钥真的能登到目标机。
7. 用 `appleboy/scp-action@v0.1.7` 把 `nebula-ai/` 整体上传到 release 目录，`strip_components: 1`，`overwrite: true`。
8. 远端切换工作目录到 docker-compose 所在位置，写入 `nebula-ai/.env`（来自 `NEBULA_AI_TEST_ENV_FILE` Secret），运行 `docker compose -f docker-compose.yml up -d --build`，更新 stable 软链或目录指针。
9. 拉一次 `docker compose ps` 与 `/healthz`，把状态回写日志，方便事后追溯。

PR 阶段则只做轻量级 dry-run：分别构建 `apps/console-api/Dockerfile.test`、`apps/gateway-api/Dockerfile`、`apps/admin-web/Dockerfile.ci` 与 `apps/admin-web/Dockerfile.test`，把 Vite 前端 dist 从构建容器里拷出来，再打成运行容器，但不会推到注册表也不会上线。

跑通这条 pipeline 之后我对「云原生」这件事的认知突然变得具体：CI/CD 不是 buzzword，它是一组可重复、可观察、可降级的命令；任何一条 `git push` 实际上都在远端机器上跑 `docker build`、`scp`、`ssh`、`docker compose`，每一步都有可能失败，每一步都需要被 Secret、超时、重试和健康检查保护。

## 逆向开源，重构生产级网关

`nebula-ai/new-api-main/` 在仓库里完整地保留了开源 AI 网关 `new-api` 的源码，我把它当作一份「带有真实流量经验的设计参考」。我不直接复用它的二进制或代码，而是把它当作输入，回答几个我作为初次架构师必须回答的问题：

- 多通道路由怎么挑？`new-api` 有按通道权重和优先级路由的实现，我在 `app/services/provider_router.py::resolve_openai_route` 里用自己的方式重写：先按 `priority` 倒序分组，再在最高优先级组里按 `dispatch_strategy` 选择 `weighted_random` / `weighted_round_robin` / `hash`；hash 模式用 `x-session-id` 计算 `sha256` 决定 sticky 路由，使同一个会话能优先粘到同一上游，配合 `_select_weighted_round_robin` 的 GCD 风格调度算法平滑分配权重。
- 上游不健康怎么办？我在 `provider_runtime_state.can_attempt` 与 `circuit_breaker/service.py` 之间封装了简单熔断：默认 `gateway_circuit_breaker_failures=3`，被熔断后 `gateway_circuit_breaker_open_ms=3000` 内不再尝试；`gateway_healthcheck_on_route=true` 时每条路由请求都先调用 `ensure_provider_health(provider.id)` 主动探活，结合 `gateway_healthcheck_interval_ms=10000` 节流，防止健康探测自己变成压测。
- 协议怎么屏蔽？`api/openai_compat.py::_proxy_json_with_failover` 把 OpenAI 流式与非流式调用统一成「pre-auth → resolve route → upstream call → 标准化响应 → finalize success/failure」六段，中间所有失败状态都聚拢到 `excluded_provider_ids`，并通过 `time.sleep(max(retry_backoff_ms, 0) * (attempt + 1) / 1000)` 做指数性退避；同样的形态被 `_proxy_multipart_with_failover` 复用到 audio / image 编辑等 multipart 场景。`api/anthropic_compat.py` 则在最外层接 Anthropic native `x-api-key` 与 Bearer 两种鉴权，把上游响应里的 `usage.input_tokens / output_tokens` 翻译成内部 token 计费口径。
- Token 用量怎么收？`quota/billing_service.py::preauthorize` 在每次请求前先估算 `hold_units`，从 PostgreSQL 的 `nebula_billing_accounts` 拿账户余额减去 `reserved_units`，对照配额（每日 / 每月 / 总量）做 hold；请求成功后 `finalize_success` 用真实 `prompt_tokens` 与 `completion_tokens`、加上 prompt / completion multiplier 写入 `nebula_billing_ledger`，失败则 `finalize_failure` 释放 hold。组合 `_estimate_units` 与 `token_estimate_from_text`，在没有可信 usage 的场景里也可以做出合理的预扣。

这种「读源码 → 抽象问题 → 用自己的代码回答」的过程，比单纯搬运任何一个开源项目都更让我成长。我现在能用具体术语说清楚「为什么做 weighted_round_robin 而不是 hash-only」、「为什么用 token-bucket 风格的 RPM 限流而不是 sliding window」，因为我都试过、调过、被自己的实现教训过。

## 高并发真实流量的洗礼

把网关挂到社团真实业务上之后，我开始第一次直面高并发系统下「鉴权、限流、计费、日志、可观测性」这些字眼真正的重量。

`services/auth_service.py::require_api_key` 是每个请求的第一道关卡，按顺序穿过：

1. `check_global_limit()` 控制全网关 RPM ≤ 3000。
2. 从 `Authorization: Bearer …` 或 Anthropic `x-api-key` 中提取 raw key。
3. `find_active_key` 命中数据库后，`validate_api_key_record` 检查过期时间（支持 ISO8601 与 unix 时间戳）、用户 / 组织 / 项目 / 项目成员的 `ACTIVE` 状态，任何一处不符合就返回 401。
4. `check_api_key_limit(record.id)` 控制单 key RPM ≤ 360。
5. `enforce_endpoint_policy` 与 `enforce_ip_policy` 做端点白名单与 IP 白名单。
6. 模型请求会再走 `ensure_model_allowed` 与 `ensure_model_protocol_supported`，限定 key 的 `model_allowlist` 与协议（OpenAI / Anthropic）。

只要有一关失败，`monitor/metrics.py` 里的 `auth_fail_total` 与 `rate_limit_hits_total` Prometheus 计数器就 +1，主入口又额外维护 `http_requests_total` 与 `http_requests_error_total`，所有数字最终汇到 `/metrics`，由 NebulaCloud 的可观测性栈拉走。

`limiter/global_limiter.py` 用的是简单的「按分钟时间桶 + 锁」方案：`(namespace, YYYYMMDDHHMM)` 作为键，每分钟自动滚动，全局命名空间和 `key:<id>` 命名空间各自独立，但共用一份内存 + 互斥锁。这种实现在单实例下足够用，多实例时由上层依赖 `NEBULA_GATEWAY_REDIS_URL` 与 `cache/local_cache.py` 升级到分布式版本。

`security/logging_middleware.py::RedactionLoggingMiddleware` 是真正让我感到「我在写工业级代码」的部分：每个请求都被打成结构化日志，`Authorization`、`x-api-key`、`proxy-authorization` 用 `redact_secret` 做脱敏；body / response 里只要键名包含 `key / token / secret / password` 就整条 mask；客户端 IP 通过 `redact_ip` 做匿名化处理；最后用 `LOGGER.info("gateway_request_redacted", extra=…)` 输出，给链路追踪、SIEM 与审计都留好钩子。我第一次理解到「写日志」这件事在生产网关里不是 `print`，而是和合规、隐私、安全事件分析直接绑定的工程行为。

跑过几次真实高峰后，几个抽象概念对我来说终于具体起来：

- **限流不是给攻击者用的**：超过 RPM 的几乎都是自家客户端忘了关 retry；正确的做法是返回 429 + `Retry-After`，让他们意识到错误，而不是让网关自己背锅。
- **熔断救的是上游而不是用户**：触发熔断的瞬间用户体感是「报错」，但只有在熔断保护下，上游不健康节点才有机会重新启动；3 次失败 + 3 秒冷却已经能让上游 LLM Provider 在波动中喘过气来。
- **计费必须 pre-auth**：先 hold 后 settle 是唯一靠谱的方式。直接按 response usage 扣费会被人用大 prompt + 大 max_tokens 的并发请求穿透账户。
- **日志必须脱敏后再写**：`Authorization`、`x-api-key`、Body 中的 key / token，被一次错误日志泄漏的代价就够把 API key 全部轮换。`RedactionLoggingMiddleware` 是平台敢于把日志接入 ELK 的前提。

## 我的角色与下一步

在这条网关上，我同时扮演了三种身份：

- **核心后端开发者**：写 FastAPI 路由、协议适配、限流、熔断、计费、日志中间件、Prometheus 指标，是 `apps/gateway-api/` 主要贡献者。
- **DevOps 实践者**：维护 `NebulaAI-Test.yml`、`CodeReview.yml`、`CodeQualityAnalysis.yml`，把 `nebula-ai/VERSION`、Docker Compose、`.env` 模板和 SSH 部署捏成一条可观察的发布管线。
- **平台研究员**：把 `new-api` 当作教材逆向阅读，独立做出 NebulaCloud 自己的多通道路由、熔断、计费和模型白名单设计。

下一步我希望把这条网关继续推到更生产级的形态：用 Redis-backed 限流取代纯内存计数器、把上游健康检查接入更系统化的探活 / 缓存方案、给 `/realtime` WebSocket 加更多生产可观测性、把 PR 流程升级为 trunk-based + protected branches，让整个团队都能在更高的护栏下继续把 NebulaCloud 推向更大的真实流量。
