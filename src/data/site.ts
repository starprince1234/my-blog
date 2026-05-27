import type { Project, SkillGroup, TimelineItem } from '../types'

export const profile = {
  name: 'starprince',
  role: '全栈开发者 / AI 产品开发者',
  oneLine: '我喜欢把模糊的想法做成可访问、可使用、可维护的产品，并在真实使用中持续迭代。',
  focus: ['AI 应用', 'Web 产品', '开发者工具', '效率软件', '创意交互'],
  github: 'https://github.com/starprince1234',
  email: '2320809136@qq.com',
  social: '',
}

export const stats = [
  { value: 'Ship', label: '把想法推进到上线' },
  { value: 'Iterate', label: '持续复盘和优化' },
  { value: 'Full-stack', label: '从界面到部署闭环' },
]

export const statusLabels = {
  live: '已上线',
  'in-progress': '开发中',
  paused: '暂停维护',
  experimental: '实验项目',
  archived: '已归档',
} as const

export const projects: Project[] = [
  {
    slug: 'niuke-scrape-agent-plugin',
    name: '基于 Playwright 的 API 拦截式牛客网自动化抓取引擎 / Niuke Scrape Agent Plugin',
    summary:
      '智能体大赛的核心数据源插件。通过 Playwright + API Hooking 直接抓取牛客面经底层 JSON，完成无头浏览器特征对抗、登录态复用、守护线程优雅退出与首次公网部署。',
    category: '人工智能 / 爬虫与安全',
    status: 'archived',
    order: -1.5,
    featured: false,
    hasDetail: true,
    role: '插件主开发者 & 基础设施部署工程师',
    cycle: '2025.11 - 2025.12，大二上期末智能体开发比赛项目',
    accent: '#0ea5e9',
    tags: ['Playwright', 'API Hooking', 'Cookie Lifecycle', 'Multi-threading', 'VPS Deployment', 'AI Agent Plugin'],
    techStack: ['Python', 'Playwright', 'asyncio', 'Threading', 'JSON', 'VPS', 'Environment Variables'],
    links: {
      github: 'https://github.com/starprince1234/niuke_scrape',
    },
    media: {
      pattern: 'flow',
      alt: '牛客网面经自动化抓取引擎的响应级 API Hooking、登录态复用和公网部署流程',
    },
    overview:
      'niuke_scrape 是我在 COZE 智能体开发比赛中独立负责的核心数据源插件。它不是普通爬虫，而是面向 Agent 的高稳定性数据管道：用 Playwright 驱动 Chromium，通过响应级 API 拦截直接抓取牛客底层 JSON，避免脆弱 DOM 解析；再用 Cookie / storage_state 复用登录态、守护线程监听停止指令、优雅落盘已抓取数据，并首次把业务代码部署到 VPS 上，完成公网交付。',
    problem:
      '智能体比赛需要持续喂给 Agent 大量真实、结构化、可复用的面经数据，但牛客页面前端结构会变、正文会折叠、部分内容依赖异步加载，单纯抓 HTML 不稳定也不完整。与此同时，登录态不能每次重登，抓取过程中还要允许中断并保留已有结果，因此插件必须同时解决“数据完整性、会话复用、可中断性与可部署性”四个问题。',
    solution:
      "我把插件设计成网络层数据管道：启动 Playwright 时注入 `--disable-blink-features=AutomationControlled` 和自定义 UA，降低自动化痕迹；通过 `page.on('response', ...)` 直接监听包含 `moment / discuss / interview` 的接口响应，把 `response.json()` 里的 `data -> list / content` 直接解析成结构化记录；登录态通过 `get_cookies.py` 导出 Cookie 和 storage state 复用；再借助后台守护线程监听 stop 指令，并在退出前统一写入 JSON / TXT。为了交付给 COZE 平台，我还首次把它部署到 VPS 上，跑通了 venv、环境变量与公网运行流程。",
    features: [
      {
        title: '响应级 API Hooking',
        description: "通过 `page.on('response')` 监听牛客底层接口，直接消费 JSON，而不是从 DOM 里反向扒文本。",
        value: '字段完整、结构稳定、抗前端改版。',
      },
      {
        title: '无头浏览器特征对抗',
        description: '在 Chromium 启动参数中加入 `--disable-blink-features=AutomationControlled`，再叠加定制 UA，降低自动化标记。',
        value: '把自动化浏览器伪装成更接近真实用户的访问环境。',
      },
      {
        title: '登录态生命周期管理',
        description: '通过 `get_cookies.py` 本地手动登录导出 Cookie，并用 `NOWCODER_COOKIES_FILE` / storage_state 复用。',
        value: '免重登、免图形、适合云端长期运行。',
      },
    ],
    architecture: [
      'auto_spider.py 与 nowcoder_spider.py 共同承担抓取入口，前者负责自动导航与批量抓取，后者保留早期滚动式抓取逻辑。',
      '浏览器以 Playwright Chromium 启动，注入 `--disable-blink-features=AutomationControlled`、`--no-first-run` 和 `--disable-default-apps`，并设置伪装 UA。',
      "核心数据捕获点是 `page.on('response', handle_response)`，只处理 URL 命中 `/api/sparta/discuss/moment`、`/api/sparta/detail/moment-data/detail/`、`/moment` 与 `discuss` 关键词的响应。",
      '数据解析会从 `data` 中识别单条内容、列表或数组，并提取 `id`、`title`、`content`、`createdAt`、`userBrief` 与 `frequencyData`。',
      '`userBrief` 负责用户昵称、教育信息、专业、工作年限和认证信息；`frequencyData` 负责点赞、评论、浏览与分享等统计字段。',
      '`setup_stop_listener()` 用 daemon thread 监听 stop / quit / exit / s / q，主循环在滚动和点击时持续检查 `should_stop`。',
      '`save_data()` 将抓取结果按时间戳写入 `data/output/` 下的 JSON 与 TXT，退出时确保数据优雅落盘。',
      'Cookie 与 storage state 路径通过 `NOWCODER_COOKIES_FILE`、`NOWCODER_STORAGE_STATE_PATH`、`NOWCODER_OUTPUT_DIR` 与 `NOWCODER_HEADLESS` 统一配置，便于本地与 VPS 复用。',
      'README 明确指出当前项目没有 Dockerfile / docker-compose，部署时通过环境变量和平台 Secret 管理敏感信息。',
    ],
    highlights: ['无头浏览器特征抹除', '响应级 API 拦截 (Hook)', '登录态持久化复用', '守护线程优雅降级', '首次公网部署上线'],
    challenges: [
      {
        title: '避开脆弱的 DOM 解析',
        problem: '牛客页面内容会折叠、懒加载和改版，直接抓 DOM 很容易漏字段、丢结构，甚至一改版就失效。',
        process: '把抓取点下沉到响应层，监听面经相关接口，直接消费结构化 JSON。',
        result: '抓到的不是“页面文本”，而是可以直接喂给 Agent 的干净知识记录。',
        learning: '数据抓取真正稳的方式不是盯页面，而是盯数据流。',
      },
      {
        title: '让抓取任务可以被温和中断',
        problem: '长时间抓取如果只能强杀进程，已采集的数据很容易丢失。',
        process: '用后台 daemon thread 监听 stop 指令，主循环持续检查停止标志，并在退出前统一保存。',
        result: '用户可以随时停止，而不是依赖 Ctrl+C 硬断。',
        learning: '爬虫系统也需要事务感：可以中断，但不能随便丢结果。',
      },
      {
        title: '第一次把工具交到公网环境',
        problem: '比赛插件不能只停在本地，必须能被平台调用。',
        process: '在 VPS 上跑通 venv、环境变量和部署流程，让业务代码具备公网可用性。',
        result: '插件具备了真正交付给智能体平台的工程形态。',
        learning: '第一次公网部署，不只是上线一个脚本，而是开始理解运维、隔离和可复现。',
      },
    ],
    learnings: [
      '理解了响应级拦截比 DOM 解析更适合作为稳定数据管道。',
      '掌握了 Playwright、Cookie 导出、storage_state 复用与无头浏览器调参的实战组合。',
      '学会了把“用户可中断”当成数据安全设计的一部分。',
      '第一次完成面向真实公网的 VPS 部署，建立了后续全栈上线的工程直觉。',
      '这个项目成为我后续所有公网部署与高阶全栈项目的起源石。',
    ],
    nextSteps: ['把响应拦截逻辑进一步抽成可复用的 Agent 插件框架。', '补充更多对牛客接口结构变化的兼容测试。', '把登录态与部署流程整理成更完整的运行手册。'],
  },
  {
    slug: 'nebulacloud-gateway',
    name: 'NebulaCloud 微服务 AI 路由网关 / NebulaCloud API Gateway',
    summary:
      '微服务架构下的高并发 AI API 转发网关。深度学习并重构成熟开源系统（new-api），首次跑通 Git Flow 团队协作、GitHub Actions 自动化 CI/CD 运维管线，经受了高并发真实流量洗礼。',
    category: '云原生 / 系统工程',
    status: 'in-progress',
    order: -4,
    featured: true,
    hasDetail: true,
    role: '核心网关研发 & DevOps 实践者',
    cycle: '2026.05 - 2026.07，大二下技术社团 NebulaCloud 子模块 nebula-ai',
    accent: '#2563eb',
    tags: ['工业级团队协同', '云原生 DevOps', '逆向开源重构', '真实高并发流量'],
    techStack: ['API Gateway', 'FastAPI / Python', 'PostgreSQL', 'Redis', 'ClickHouse', 'Docker Compose', 'GitHub Actions', 'Git Flow', 'Reverse Engineering', 'Prometheus', 'OpenAI / Anthropic 协议兼容'],
    links: {
      github: 'https://github.com/MegaFlowAI/NebulaCloud',
    },
    media: {
      pattern: 'flow',
      alt: 'NebulaCloud nebula-ai 网关的多渠道路由、限流计费、熔断容灾和 GitHub Actions CI/CD 管线',
    },
    overview:
      'NebulaCloud 是我加入技术社团参与建设的大型微服务系统，主仓库由 Backend、Frontend 与 nebula-ai 等多个子系统组成。我独立负责 nebula-ai 中流量最大、安全要求最严苛的子模块 gateway-api，承接所有 OpenAI 兼容与 Anthropic 兼容的 AI 流量，并完成认证、配额、限流、路由、容灾、计费、审计与可观测性。',
    problem:
      '社团 AI 平台对外暴露统一 API 时，需要一个能扛住真实活跃流量的入口：要按平台密钥鉴权、按用户 / 项目 / 模型做配额与白名单、对多家上游做路由与容灾、做 token 级计费、对日志做脱敏、对部署做版本控制和回滚。任何一处漏洞都会变成账户穿透或上游雪崩。',
    solution:
      '我用 FastAPI 写了 nebula-ai/gateway-api：在主入口加 RedactionLoggingMiddleware 与 Prometheus 中间件；把请求拆成 OpenAI、Anthropic 两条兼容协议族；通过 provider_router 实现 weighted_random / weighted_round_robin / hash 三种调度，叠加 priority 分组与 affinity 头粘连；用 circuit_breaker + provider_runtime_state 做熔断；用 limiter + billing_service 做 RPM 限流与 token 预扣计费；并把 Git Flow 与 GitHub Actions 串成 PR 校验、test 部署、master 上线的完整管线。',
    features: [
      {
        title: 'OpenAI / Anthropic 双协议兼容入口',
        description: 'apps/gateway-api/app/api 同时承接 /chat/completions、/responses、/embeddings、/images、/audio、/video、/realtime 与 /v1/messages 等接口。',
        value: '让平台密钥同时服务 OpenAI 客户端与 Anthropic 客户端，不再被特定 SDK 绑死。',
      },
      {
        title: '多通道路由与容灾',
        description: 'provider_router 按 priority 分组、按 dispatch_strategy 做 weighted_random / WRR / hash 调度，配合 circuit breaker 与失败 provider 排除集做 failover。',
        value: '在某家 LLM Provider 抖动时自动切换到下一条线路，对调用方近乎无感。',
      },
      {
        title: 'GitHub Actions 全链路 CI/CD',
        description: 'NebulaAI-Test、Backend、Frontend、CodeReview、CodeQualityAnalysis 五个 workflow 串起 PR 构建校验、SSH 部署、PR Agent 自动 review 与代码质量评论。',
        value: '把一次 git push 转化为一条可观察、可降级、可回溯的发布管线。',
      },
    ],
    architecture: [
      'gateway-api 入口在 apps/gateway-api/app/main.py：FastAPI(title="Nebula Gateway API") + RedactionLoggingMiddleware + Prometheus 指标中间件，按 settings.api_prefix（默认 /api/nebula/gateway）注册路由，并暴露 /metrics。',
      'apps/gateway-api/app/api/router.py 聚合 /healthz、openai_compat 与 anthropic_compat 两条 router，OpenAI 兼容覆盖 chat / completions / responses / embeddings / images / audio / video / realtime 与 internal 监控接口。',
      'apps/gateway-api/app/services/auth_service.py::require_api_key 串联 global RPM 限流、Bearer / x-api-key 提取、find_active_key 校验、API Key 过期与用户 / 组织 / 项目 / 成员 ACTIVE 状态校验、单 key RPM 限流、endpoint 与 IP 白名单。',
      'apps/gateway-api/app/services/provider_router.py 通过 priority 分组 + dispatch_strategy（weighted_random / weighted_round_robin / hash）选择上游，hash 模式用 sha256(session_affinity_key) 做粘连，failover 时把失败 provider 加入 excluded_provider_ids。',
      'apps/gateway-api/app/circuit_breaker/service.py 与 services/provider_runtime_state.can_attempt 形成熔断保护，配合 NEBULA_GATEWAY_CIRCUIT_BREAKER_FAILURES=3 与 NEBULA_GATEWAY_CIRCUIT_BREAKER_OPEN_MS=3000 的默认阈值。',
      'apps/gateway-api/app/limiter/global_limiter.py 用 (namespace, YYYYMMDDHHMM) 做按分钟桶限流，全局 RPM 默认 3000，单 API key RPM 默认 360，配合 monitor/metrics.py 的 rate_limit_hits_total 计数器。',
      'apps/gateway-api/app/quota/billing_service.py 在请求前 preauthorize hold token，请求成功后 finalize_success 用真实 prompt_tokens / completion_tokens 与 prompt / completion multiplier 写入 nebula_billing_ledger，失败时 finalize_failure 释放 hold。',
      'apps/gateway-api/app/security/logging_middleware.py::RedactionLoggingMiddleware 对 Authorization / x-api-key / 含 key/token/secret/password 的字段做 redact_secret，IP 走 redact_ip，再用 gateway_request_redacted 结构化日志输出。',
      'apps/gateway-api/app/core/db.py::ensure_gateway_schema 在启动时自治创建 nebula_gateway_api_keys、nebula_users、nebula_organizations、nebula_projects、nebula_billing_accounts / holds / ledger、nebula_provider_routes 等表，并用 ADD COLUMN IF NOT EXISTS 做兼容升级。',
      '.github/workflows/NebulaAI-Test.yml 监听 nebula-ai/** 路径：PR → test 仅做 docker build 校验，push → test 校验 nebula-ai/VERSION 语义化版本、用 appleboy/scp-action 上传代码、appleboy/ssh-action 远程 docker compose up -d --build 部署。',
      '.github/workflows/Backend.yml 与 Frontend.yml 监听 master / test 双分支，按 github.ref 切换 PROD_* / TEST_* Secrets，分别调用 make build_prod/restart_prod 与 make build_test/restart_test。',
      '.github/workflows/CodeReview.yml 通过 qodo-ai/pr-agent 自动跑 auto_review / auto_describe / auto_improve，限制 head_ref == "test" 与目标分支 master 才生效；CodeQualityAnalysis.yml 用 Done-0/fuck-u-code 在每个 PR 上输出代码质量评论。',
      'nebula-ai/new-api-main 完整内嵌开源 new-api 源码作为逆向参考，但 gateway-api 的多通道调度、熔断、计费等逻辑都是基于这份阅读独立重写。',
    ],
    highlights: ['工业级团队协同', '云原生 DevOps', '逆向开源重构', '真实高并发流量', 'OpenAI + Anthropic 双协议兼容', '生产级日志脱敏'],
    challenges: [
      {
        title: '从单兵作战到工程协同的认知跨越',
        problem: '过去做项目可以直接 push 到 main，加入 NebulaCloud 后所有改动都需要走 PR、过 CI、被 PR Agent 与人共同 review，最后才会出现在 test 与 master 分支上。',
        process: '把 Git Flow 写进自己的工作节奏：feature/* 分支开发，PR → test 触发 nebula-ai 构建校验 + 代码质量分析，PR → master 触发 PR Agent 中文 review；每条 commit 严格对应一个 todo，避免一次 PR 改太多。',
        result: '我开始用 PR description、CI artifacts、review 评论说话，而不是用「我在本地能跑」说话；一次 master 部署可以被任何同学回放出每一个改动来源。',
        learning: '工程协同的纪律不是写在文档里，而是写在 .github/workflows/ 与分支保护规则里。',
      },
      {
        title: '把代码推送变成可观察的部署管线',
        problem: '社团之前依赖手动部署：远程登录服务器、git pull、docker compose up，谁都不知道线上跑的是哪条 commit，回滚也只能靠记忆。',
        process: '为 nebula-ai 写 NebulaAI-Test.yml：强校验 VERSION 语义化版本、Secrets 完整性、SSH 连通性，用 scp-action 上传 release 目录，再用 ssh-action 跑 docker compose up -d --build；同时让 Backend / Frontend workflow 共用同一套 PROD/TEST Secrets 模式。',
        result: '现在每条进入 test 的 commit 都能精确对应到远端 nebula-ai-releases/{run_id}-{run_attempt}/ 目录与 test-<sha> 镜像 tag，回滚可以复现到任意一次部署。',
        learning: 'CI/CD 不是用 yaml 写得多漂亮，而是要求自己把所有“手动会出错的步骤”全都搬进 workflow。',
      },
      {
        title: '逆向 new-api，自研产生级网关',
        problem: 'new-api 是社区里成熟的 AI 网关，社团希望直接拿来用，但它的代码风格、协议假设、配额模型与 NebulaCloud 自己的 PostgreSQL Schema 并不兼容，硬接会带来大面积耦合。',
        process: '把 nebula-ai/new-api-main 整段引入仓库作为只读参考；用 FastAPI 重写 gateway-api，重新设计 provider / route / billing / 熔断 / 限流 / 健康检查 / 协议兼容这些核心子系统；保留 new-api 的设计精华，但所有数据模型都对齐 NebulaCloud 的 nebula_* 表。',
        result: 'gateway-api 拿到 new-api 的「多通道 + 容灾 + token 计费」核心理念，但代码、Schema、可观测性、CI/CD 全是 NebulaCloud 自家风格，可以独立演进，也可以独立 docker compose 起一套。',
        learning: '阅读优秀开源项目的最高用法是把它当教材，而不是当依赖。',
      },
      {
        title: '让限流、熔断、计费、日志在真实流量下站得住',
        problem: '上线后的真实活跃流量会暴露各种问题：上游 LLM 抖动、客户端忘关 retry、有人用大 prompt 攻击预算、日志里漏出 API key。',
        process: '全局 RPM 默认 3000、单 key 默认 360；3 次失败 + 3 秒冷却的熔断；preauthorize hold + finalize success/failure 的两阶段计费；RedactionLoggingMiddleware 对 Authorization / 含 key 字段做脱敏，IP 走 redact_ip；Prometheus 计数器同步暴露 auth_fail_total / rate_limit_hits_total / http_requests_(error_)total。',
        result: '上游异常被熔断挡住、暴力客户端被 RPM 挡住、token 永远不会被超扣、日志可以放心接入审计系统；线上一旦出现告警，能直接从 /metrics 与脱敏日志反推出原因。',
        learning: '生产级系统不是把功能写完就行，而是要先想清楚“它失败时会怎样”，再把失败路径变成代码里的默认行为。',
      },
    ],
    learnings: [
      '理解了大型微服务里 API Gateway 的真实定位：流量入口 + 安全屏障 + 协议适配器 + 计费 + 可观测性中心。',
      '把 Git Flow、PR Review、CI 校验、PR Agent 中文 review 与 Code Quality 报告内化成日常工作节奏。',
      '在 GitHub Actions 上写出真正能跑生产部署的 workflow：Secrets 校验、语义化版本、SSH/SCP、docker compose、回滚目录、状态回写。',
      '用 FastAPI、PostgreSQL、Redis、ClickHouse 的组合实现可治理的 token 计费、限流、熔断和审计日志。',
      '掌握了把开源项目作为知识源的方法：读源码 → 抽象问题 → 在自己的 Schema 与场景下重写实现。',
    ],
    nextSteps: ['把限流 / 熔断 / 健康检查从单实例内存升级到 Redis-backed 分布式实现。', '为 /realtime WebSocket 与多模态接口补充更系统化的端到端可观测性看板。', '把 PR 流程升级为 trunk-based + protected branches，并接入更精细的 CODEOWNERS 规则。'],
  },
  {
    slug: 'oil-insight-fintech',
    name: '油擎洞察 - 多因子油价预测与 AI 金融研报系统 / Oil Price Prediction & FinTech Agent',
    summary:
      '花旗杯金融创新应用大赛推优国赛项目。作为总策划，我打通了“多因子机器学习预测 → AI 自动化金融研报生成 → 交互式金融分析师智能体”的全栈量化与大模型混合管线。',
    category: '金融科技 / 机器学习 / 生成式 AI',
    status: 'in-progress',
    order: -3,
    featured: true,
    hasDetail: true,
    role: '项目总策划 & 首席系统架构师 / 全栈开发',
    cycle: '2026.05 - 2026.08，大二下花旗杯推优国赛项目',
    accent: '#b45309',
    tags: ['花旗杯推优国赛', '量化预测 + 大模型', '独立全栈架构', 'AI 金融分析师'],
    techStack: ['Quantitative ML', 'XGBoost', 'RidgeCV', 'Hybrid Stacking', 'Bayesian Optimization', 'FastAPI / Python', 'OpenAI-compatible LLM', 'Next.js / React', 'Recharts', 'Docker / Nginx'],
    links: {
      live: 'https://lyn91r.cn/',
      github: 'https://github.com/starprince1234/Hua_Qi_Bei',
      docs: 'https://github.com/starprince1234/Hua_Qi_Bei',
    },
    media: {
      pattern: 'flow',
      alt: '油擎洞察的上传表格、多因子机器学习预测、风险区间、行业传导、AI 金融研报和金融分析师 Agent 管线',
    },
    overview:
      '油擎洞察是我以总策划兼系统主架构师身份主导的金融科技平台，项目冲刺“花旗杯”金融创新应用大赛并已推优国赛。系统围绕国际油价波动建立多因子机器学习预测模型，并把模型输出、风险区间、行业冲击、因子解释和知识图谱路径组织为 LLM Context Pack，自动生成结构化金融研报。',
    problem:
      '传统油价预测项目容易停留在“一个涨跌数字”：模型能给出收益率，却无法解释风险区间、因子贡献、行业传导和业务含义。金融场景还要求结果可审计、报告口径稳定、上传数据可治理、模型服务可替换，单纯脚本或聊天式 LLM 都无法满足。',
    solution:
      '我设计了 Quant + GenAI 双引擎架构：离线训练侧采用 XGBoost + RidgeCV + Linear Regression 的 Hybrid Stacking 模型，并用 0.05/0.50/0.95 分位数 XGBoost 输出风险带；在线服务侧采用 FastAPI 编排“上传 → 校验修复 → 特征工程 → 远端模型推理 → 后处理 → SHAP/行业/图谱解释 → LLM 受约束研报”，前端用 Next.js + Recharts 展示预测路径与报告。',
    features: [
      {
        title: '多周期量化预测核心',
        description: '针对 1D、3D、7D、14D、30D 五个周期分别训练模型组，目标列为 Brent close 不同窗口涨跌幅。',
        value: '让油价预测从单点判断升级为多时间尺度风险判断。',
      },
      {
        title: '分位数风险区间',
        description: '额外训练 0.05、0.50、0.95 三个 XGBoost 分位数模型，并在推理阶段修正 quantile crossing。',
        value: '不仅预测方向，还给出上下界风险带。',
      },
      {
        title: 'LLM 金融研报生成',
        description: 'ReportService 通过白名单 Context Pack、Schema 校验、字段命中校验、重试和模板降级控制 LLM 输出。',
        value: '让大模型只能围绕量化事实写报告，降低幻觉风险。',
      },
    ],
    architecture: [
      '技术报告定义双轨因子工厂：EIA / FRED / CFTC 等官方数值指标负责库存、宏观、价差和情绪变量；GDELT + RAG + LLM 负责把地缘政治、OPEC 会议、制裁、运输中断等事件转化为可回测的 Geo_Risk_Index / Supply_Shock_Index。',
      '目标变量为 Brent 原油 K 日累计对数收益率 r(t,K)=ln(P(t+K)/P(t))*100%，K 覆盖 1、3、7、14、30 个交易日；报告样本覆盖 2014-2025 年 4,018 条观测。',
      '训练工程 huaqibei-main/src/model.py 使用 pandas、numpy、xgboost、sklearn 与 joblib，定义 DATA_FILES / TARGET_COLS 映射 1D、3D、7D、14D、30D 多周期因子表。',
      'Layer 1 基模型包含 XGBoost Regressor 与 RidgeCV；Layer 2 使用 LinearRegression(fit_intercept=False) 对 OOF 预测线性加权。',
      'StackingModel.create_oof_predictions 使用 TimeSeriesSplit，保证 train_idx < val_idx，减少时间序列信息泄露。',
      '对包含“库存 / Inventory”的供需类特征自动注入 XGBoost monotone_constraints，将业务先验纳入模型结构。',
      'param_optimizer.py 使用 BayesianOptimization 搜索 max_depth、learning_rate、subsample、colsample_bytree，并按 60/20/20 做时序训练、验证、测试分割。',
      'backtest.py 提供 Walk-Forward 与 rolling-window 回测，统计 R²、RMSE、MAE、方向命中率和误差分布。',
      '技术报告记录 7D 核心模型测试集 R²=0.7005、RMSE=0.84%、MAPE=8.24%、方向准确率=62.1%；Walk-Forward 平均 R²=0.689、平均方向准确率=61.8%、Sharpe≈1.29、最大回撤≈-2.18%。',
      '分位数风险模型输出 0.05 / 0.50 / 0.95，报告记录 7D 90% 置信区间实际覆盖率 89.2%、平均风险区间宽度约 ±4.8%。',
      'FastAPI 编排层注册 /api/v1/upload、/api/v1/predict、/api/v1/report，并通过 ModelClient 统一调用远端模型服务或 OpenAI-compatible 模式。',
      'FeatureService 执行 DataValidator → AsofAligner → LagBuilder → InteractionBuilder，把上传表格治理成模型可消费的特征向量。',
      'Predict 路由将 FeatureService、ModelClient、PostprocessService、RiskService、IndustryService、ShapService、FactorReasonService、GraphQuery、ReportService 与 AIInsightService 串成完整推理链。',
      'ReportService.build_context_pack 仅放行 prediction、risk_analysis、top_drivers、industry_impact、knowledge_graph_paths 五类字段；LLM 失败时回退规则模板。',
      '前端为 Next.js 16 + React 19 + TypeScript + Tailwind CSS 4 + Framer Motion + Recharts，负责上传、预测参数配置、风险路径图、因子贡献图和结构化报告呈现。',
      '部署侧包含 Docker / Nginx / 环境变量说明，LLM_PROVIDER 支持 openai、siliconflow、xf_maas 等 OpenAI 兼容协议。',
    ],
    highlights: ['花旗杯推优国赛', 'Hybrid Stacking', '分位数风险带', '受约束 LLM 研报', 'AI 金融分析师演进', 'Total Architect'],
    challenges: [
      {
        title: '让机器学习预测具备金融解释力',
        problem: '单一收益率预测无法回答“为什么”和“影响谁”，不适合金融科技竞赛展示和业务决策语境。',
        process: '把模型输出拆成预测路径、风险等级、行业冲击、因子贡献、知识图谱路径和报告章节，并由 FastAPI 编排统一返回。',
        result: '系统从模型 Demo 变成可上传、可预测、可解释、可汇报的金融分析平台。',
        learning: 'FinTech 项目的核心不是模型孤立准确，而是让模型输出进入可审计的业务工作流。',
      },
      {
        title: '防止 LLM 把研报写成幻觉作文',
        problem: '大语言模型如果直接自由生成，容易引入外部新闻、未经验证的原因或不符合量化结果的判断。',
        process: '使用结构化 Context Pack、字段白名单、ConstrainedReportOutput、量化 token 命中校验、二次重试和规则模板 fallback。',
        result: '报告生成既有自然语言可读性，又保留了结构化数据约束和失败兜底。',
        learning: '生成式 AI 在金融场景里必须被数据契约约束，而不是只靠提示词“自觉”。',
      },
      {
        title: '把离线训练脚本接成在线系统',
        problem: '训练模型、上传数据、推理服务、报告生成和前端可视化分属不同层，任何一处协议不稳都会导致演示断链。',
        process: '用 OpenAPI/README 文档约束接口，以 ModelClient 和 ReportService 收口外部服务，以 Docker/Nginx 与环境变量管理部署差异。',
        result: '系统形成“用户上传表格 → 模型推理 → 解释联动 → AI 研报 → Web 展示”的端到端闭环。',
        learning: '总策划的价值在于把算法、后端、前端、部署、文档和演示拉成同一条主线。',
      },
    ],
    learnings: [
      '掌握了面向金融时间序列的训练纪律：TimeSeriesSplit、时序 train/val/test 分割、Walk-Forward 回测和方向命中率评估。',
      '实践了 XGBoost 非线性建模、RidgeCV 正则化基线、Stacking 元学习器和分位数回归风险带。',
      '理解了 LLM 在金融报告中的正确位置：不是替代量化模型，而是把模型事实翻译成可阅读、可追问、可审计的表达。',
      '以总策划身份完成技术路线、系统架构、算法部署、全栈上线和演示材料统一，训练了跨学科项目统筹能力。',
    ],
    nextSteps: ['接入交互式 AI 金融分析师 Agent，让用户围绕预测报告、历史数据和因子贡献进行多轮问答。', '将上传文件、报告章节和知识图谱路径纳入 RAG 上下文，提升追问可解释性。', '补齐公开可展示的模型评测图表、更多回测样例和生产级报告 PDF 导出。'],
  },
  {
    slug: 'jiguyunyu-cultural-ai',
    name: '稽古云语 - 文物识别与 AI 多轮对话系统 / JiGuYunYu AI',
    summary:
      '省级大创负责人项目 / 软创省三等奖。采用 Java + Python 双后端解耦架构，接入文物领域 VLM 推理服务与 RAG 多轮对话，提供微信小程序与 Android 实机多端体验。',
    category: '人工智能 / 软件工程',
    status: 'live',
    order: -2,
    featured: false,
    hasDetail: true,
    role: '项目创始人 & 负责人 / 核心全栈与 AI 算法工程师',
    cycle: '2026.02 - 2026.07，大二下省级大创与软创项目',
    accent: '#0f766e',
    tags: ['省级大创负责人', '软件创新大赛省三', 'Qwen3-VL Q-LoRA 微调', '双后端解耦', '微信小程序已上线'],
    techStack: ['Qwen3-VL-8B-Thinking', 'Q-LoRA / PEFT', 'bitsandbytes 4-bit', 'Python FastAPI', 'Java Spring Boot', 'UniApp', 'Android / Kotlin', 'ChromaDB', 'RAG', 'Docker Compose'],
    links: {
      github: 'https://github.com/starprince1234/Soft_Innovation_Competition',
      docs: 'https://github.com/starprince1234/Soft_Innovation_Competition/tree/JPY',
      article: 'https://github.com/starprince1234/Soft_Innovation_Competition/tree/JZC',
    },
    media: {
      pattern: 'ai',
      alt: '稽古云语文物识别、AI 多轮问答、Java + Python 双后端和微信小程序 / Android 多端体验',
    },
    overview:
      '稽古云语是我以项目负责人身份主导的文物智能识别与 AI 对话系统，项目获得省级大创立项，并斩获全国大学生软件创新大赛省级三等奖。系统包含 UniApp 微信小程序、Android 客户端、Java Spring Boot 业务后端与 Python FastAPI AI 内部服务，围绕文物拍照识别、文物库浏览、收藏、反馈、管理审核与 RAG 多轮问答形成完整产品闭环。',
    problem:
      '文物识别项目不能只停留在模型 Demo：真实用户需要拍照上传、识别任务轮询、识别结果关联文物库、基于文物继续追问、收藏和历史记录；管理员还需要审核文物、管理用户和知识库。若把所有能力塞进一个后端，事务业务和大模型推理会互相拖累，部署、权限和性能边界都会混乱。',
    solution:
      '我设计了 Java + Python 双后端解耦架构：Java 负责用户、JWT、RBAC、MySQL 事务、BOS 对象存储、文物/收藏/反馈/检测任务/对话历史等业务主干；Python 作为内部 AI 服务，通过 X-Internal-Token 保护的 /internal/* 接口承载 VLM 文物识别、ChromaDB RAG、Sentence-BERT embedding、Redis 缓存和千帆/本地降级对话。两端通过 PythonClient 统一调用，保持高内聚低耦合。',
    features: [
      {
        title: '双后端解耦',
        description: 'Java Spring Boot 对外提供 /api/v1 业务接口，Python FastAPI 只暴露 /internal/detect/process 与 /internal/dialog/responses 等内部能力。',
        value: '让事务系统和模型推理系统各司其职，便于独立扩容和部署。',
      },
      {
        title: '文物 VLM 识别',
        description: 'Python VLMDetector 将图片转 base64，调用 OpenAI-compatible VLM 服务，按文物专家提示词输出 name/confidence/category/era/description。',
        value: '把垂直文物识别从泛化视觉能力变成可接入业务的结构化结果。',
      },
      {
        title: '多端交付',
        description: 'UniApp 小程序覆盖鉴识、宝库、问答、我的；Android 端使用 Kotlin + Jetpack Compose + Retrofit/OkHttp 实现同类核心链路。',
        value: '评委可以扫码或真机上手，而不是只看演示截图。',
      },
    ],
    architecture: [
      'Java 后端为 Maven 多模块 Spring Boot 3.1.6 工程，包含 jigu-bootstrap、jigu-api、jigu-application、jigu-domain、jigu-infrastructure、jigu-common。',
      'Java API 层包含 Auth、User、Artifact、Detect、Dialog、Favorite、Feedback、Admin、Team 等 Controller，统一返回 ApiResponse / PageResponse。',
      'DetectService 将图片 base64 上传 BOS、创建 detection_tasks、异步调用 Python，并维护 PENDING → PROCESSING → COMPLETED / FAILED 状态机。',
      'PythonClient 是 Java 调 Python 的唯一入口，统一注入 X-Internal-Token、设置超时、拆包 InternalResponse，并将错误映射为业务异常。',
      'Python AI 服务使用 FastAPI + Uvicorn + Pydantic，内部接口需 X-Internal-Token，可选 INTERNAL_IP_WHITELIST。',
      'Python Composition Root 会根据配置选择 VLMDetector 或 YoloDetector stub，选择 QianfanHttpClient 或 stub，并装配 ChromaStore、RedisCache、SentenceEmbedding、DetectUseCase、DialogUseCase。',
      'VLMDetector 通过 VLM_BASE_URL / VLM_API_KEY / VLM_MODEL_NAME 接入 OpenAI-compatible 文物识别模型，对应自训练 qwen3-vl-lora 适配器与已部署的 qwen3.5-35b-a3b-archaeology 服务。',
      '视觉模型由独立训练工程 finetune_qwen3vl.py + run_finetune.sh 产出：基座 Qwen/Qwen3-VL-8B-Thinking，bitsandbytes NF4 4-bit 量化，PEFT LoRA r=64 / alpha=16 / dropout=0.05，target_modules 覆盖 q/k/v/o + gate/up/down，paged_adamw_32bit 优化器。',
      '训练数据为博物馆 VQA jsonl（image/question/answer），通过 fix_path 自愈 /Volumes/lenovo 路径与 dataset/* 兜底搜索，clean_answer 反解字符串化列表，QwenVLDataCollator 修复 Qwen3-VL-Thinking 模板偶发的 <|image_pad|> 错配。',
      '训练超参：3 epochs、per_device batch 2、grad accum 8、lr 1e-4、warmup_ratio 0.03、fp16、HF_ENDPOINT 切到 hf-mirror，输出 ./qwen3vl_finetuned/ LoRA 适配器与 processor。',
      'DialogUseCase 实现 Redis 对话缓存、ChromaDB 本地检索、Sentence-BERT embedding、千帆 web_summary 融合、contextHistory 多轮上下文和 rag_sources 结构化返回。',
      '部署使用 Docker Compose 编排 MySQL、Redis、Java、Python、Nginx，并在生产 compose 中支持 VLM SSH tunnel 与 Chroma/Sentence Transformer 缓存卷。',
    ],
    highlights: ['省级大创负责人', '软件创新大赛省三', '双后端解耦', 'Qwen3-VL-8B Q-LoRA 自训练', '文物 VLM 推理部署', '微信小程序已上线', 'Android 真机演示'],
    challenges: [
      {
        title: '设计 Java + Python 双引擎边界',
        problem: '文物识别既有用户、权限、收藏、审核等事务业务，又有 VLM 推理、RAG、向量库和外部大模型调用，单体后端会导致职责混杂。',
        process: '将 Java 设计为对外业务 API 与事务中枢，将 Python 设计为内部 AI Engine；所有跨服务调用通过 PythonClient 和 X-Internal-Token 统一收口。',
        result: '业务接口、数据库事务和模型推理可以独立演进，也能在 Docker Compose 中分别健康检查和部署。',
        learning: 'AI 产品架构的关键是把确定性业务和不确定性推理服务拆开。',
      },
      {
        title: '把 VLM 输出变成业务可用结果',
        problem: '视觉语言模型天然输出文本，格式可能不稳定；业务侧却需要文物名称、置信度、类别、年代和简介等结构化字段。',
        process: '为 VLMDetector 编写文物专家提示词，要求严格 JSON 输出，并实现 JSON 直读、Markdown JSON 提取、文本内 JSON 提取和非结构化兜底。',
        result: '模型输出可以进入 detection_tasks、文物匹配和结果页展示链路，而不是停留在自然语言回答。',
        learning: '模型部署不是调用 API，而是设计可容错的模型-业务协议。',
      },
      {
        title: '在 24GB 卡上把 Qwen3-VL-8B 调成文物专家',
        problem: '通用 VLM 不知道文物语义，全参数微调又远超单卡显存预算，且 Qwen3-VL-Thinking 的 chat template 会偶发多塞 <|image_pad|>，与真实图像数对不上直接训练就会崩。',
        process: '采用 bitsandbytes NF4 4-bit 量化 + PEFT LoRA（r=64，覆盖 q/k/v/o + gate/up/down）做 Q-LoRA；自写 fix_path / clean_answer 修复路径与字符串化列表答案；写 QwenVLDataCollator 精准剥离多余 <|vision_start|><|image_pad|><|vision_end|> 块，并强制 processor 走 non-batch 路径，最后用 pad_sequence 自拼批并把 pad 位置 label 设 -100。',
        result: '一份 run_finetune.sh 即可跑出 ./qwen3vl_finetuned LoRA 适配器，对应线上 qwen3-vl-lora 模型，被 VLMDetector 直接消费，覆盖文物识别真实场景。',
        learning: 'LLM 微调真正难的不是超参，而是数据修复、模板对齐和 collator 行为；这些 bug 不写出来，模型永远训不上。',
      },
      {
        title: '多端体验与长任务协调',
        problem: '小程序和 Android 都需要发起识别任务、轮询状态、展示结果、进入 AI 问答；VLM 推理和对话可能耗时较长。',
        process: '前端统一 createTask/status/result 链路；Android 设置较长 OkHttp read/call timeout；Java 和 Python 的超时、任务状态、缓存和降级共同保障体验。',
        result: '系统能支持微信小程序搜索/扫码体验，也能支持 Android APK 现场真机演示。',
        learning: '多端产品的稳定性来自协议、超时、状态机和错误兜底，而不是单一 UI。',
      },
    ],
    learnings: [
      '从个人开发者转为项目负责人，掌握了开发文档、API 合同、角色权限、数据库 Schema 和团队协作节奏。',
      '实践了 Java Spring Boot 多模块工程、领域分层、JPA、Redis、JWT、BOS 对象存储和统一响应体系。',
      '实践了 Python FastAPI 内部服务、VLM 推理接入、ChromaDB RAG、Sentence-BERT embedding 和 Redis 缓存。',
      '基于 Qwen3-VL-8B-Thinking + Q-LoRA 完成了文物垂直域 VLM 微调：4-bit NF4 量化、PEFT LoRA、自定义 collator 修复模板 image_pad 错配。',
      '理解了 VLM 私有化/远端部署的现实约束：模型服务地址、API Key、SSH 隧道、GPU 推理超时和业务降级。',
      '完成了 UniApp 微信小程序、Android 原生客户端、Java 后端、Python AI 服务的中大型系统整合。',
    ],
    nextSteps: ['基于 ./qwen3vl_finetuned LoRA 适配器补充公开可展示的文物识别评测指标。', '把 Q-LoRA 训练流程、数据修复策略与 collator 踩坑整理为独立技术报告。', '完善小程序上线材料、APK 演示包和答辩讲解脚本。'],
  },
  {
    slug: 'jishe-agent',
    name: 'Jishe AI 多模态流式智能体系统 / Jishe AI Agent',
    summary:
      '计算机设计大赛国赛推优作品，自主架构的多模态 AI Agent 系统，深度实现智能体记忆、Function Calling 工具调用，以及文本、语音、图像的低延迟流式呈现。',
    category: '人工智能 / 智能体研发',
    status: 'live',
    order: -1,
    featured: true,
    hasDetail: true,
    role: '队长 & 系统架构师 / 独立全栈开发',
    cycle: '2026.03 - 2026.07，大二下计算机设计大赛国赛推优项目',
    accent: '#7c3aed',
    tags: ['国赛推优作品', 'AI Agent 研发', '极致流式体验', '团队大主脑'],
    techStack: ['AI Agent', 'Qwen / DashScope', 'Function Calling', 'SSE 流式传输', 'WebSocket', 'FastAPI', 'Vue 3', 'FAISS'],
    links: {
      live: 'https://cbvjgf.art/',
      github: 'https://github.com/starprince1234/Jishe',
    },
    media: {
      pattern: 'ai',
      alt: 'Jishe AI 多模态流式智能体系统的登录、房间协作、Agent 流式回复与多模态交互界面',
    },
    overview:
      'Jishe 是我作为队长主导设计并实现的 AI 原生多人协作平台，项目成功推优国赛。系统采用 FastAPI + Vue 3 前后端分离架构，以“智能体成员化”为核心，将 Agent 建模为房间参与者，通过 mention-only 触发、三层记忆、Function Calling、多模态理解、图像生成和 WebSocket / SSE 流式引擎，支撑真实多人协作场景。',
    problem:
      '普通 AI 聊天框无法处理多人协作里的身份、上下文、历史、文件、多媒体和角色边界。用户需要的不只是一个回答，而是能在房间里被 @、能记住上下文、能调用工具、能理解图片音频视频、能流式回应并以独立身份沉淀进历史的 Agent。',
    solution:
      '我将系统拆成 AI Center、Memory System、Agent Registry、WebSocket Engine 和 Vue 前端五条主线：AI Center 负责意图识别、能力路由、模型选择和成本控制；记忆系统融合 Redis、MySQL、FAISS；ToolHub 承载 OpenAI-compatible Function Calling；WebSocket 与 SSE 负责多端低延迟流式呈现；Agent 作为 participant 入库与回放。',
    features: [
      {
        title: '智能体成员化',
        description: '把 Agent 建模为房间参与者，使用 sender_participant_id 作为消息身份主干，并通过 @具体智能体 mention-only 触发。',
        value: '让 Agent 从“统一机器人”升级为可协作、可追踪的房间成员。',
      },
      {
        title: '分层记忆与 RAG',
        description: 'Redis 保存最近 50 条实时记忆，MySQL 保存摘要、情节和参与者事实，FAISS 承载长期语义检索。',
        value: '避免 context overflow，同时保持对话连续性和长期知识召回。',
      },
      {
        title: '多模态流式引擎',
        description: '支持 SSE 直聊流式、WebSocket 房间流式、reasoning/answer/audio chunk、图片生成和图像/音频/视频理解。',
        value: '把 AI 输出从等待式响应变成实时协作体验。',
      },
    ],
    architecture: [
      '后端使用 FastAPI + Uvicorn，路由覆盖 auth、user、room、chat、file、ai、agent、dashboard、admin 等模块。',
      '前端使用 Vue 3 + TypeScript + Vite + Pinia + Element Plus，useWebSocket 负责心跳、重连和事件分发。',
      'LLM 主链路为 Qwen / DashScope OpenAI-compatible API，配置包含 qwen3.5-plus、qwen3.5-omni-flash、qwen-image-plus-2026-01-09。',
      'AI Center 包含 IntentRecognizer、FeatureRoutingOrchestrator、ModelSelector、CostController、ContextBuilder、RAGPipeline 和 AgentRegistry。',
      'AssistantProfileRegistry 将能力拆成 tool_calling_assistant、multimodal_assistant、image_generation_assistant 三条链路。',
      'ToolHub 使用 OpenAI-compatible tool definition，内置 mcp_fetch_url 工具，并将执行结果转成 role=tool 消息继续模型多轮推理。',
      'StreamingResponse 以 text/event-stream 输出 SSE，WebSocket 使用 ai_stream、ai_stream_end、agent_status、agent_error 事件驱动房间流式体验。',
      '部署侧使用 Docker Compose + Nginx + GHCR 镜像 + GitHub Actions 自动部署，线上 cbvjgf.art 以 HTTPS 提供访问。',
    ],
    highlights: ['国赛推优作品', 'AI Agent 研发', 'Function Calling', '三层记忆 RAG', '文本/语音/图像流式体验', '队长主架构'],
    challenges: [
      {
        title: '让 Agent 真正成为协作成员',
        problem: '如果所有 AI 回复都来自一个统一助手，群聊历史会丢失身份边界，多个智能体也无法被准确追踪。',
        process: '设计 participant 主干，把 human 和 agent 放进同一参与者体系，用 mention-only 控制触发，并强制 Agent 回复以自身 participant_id 入库。',
        result: '实时消息和历史回放都能保持同一身份模型，Agent 像真实成员一样参与协作。',
        learning: '多 Agent 产品的关键不是角色名，而是身份、触发、持久化和回放的一致性。',
      },
      {
        title: '在有限上下文内保留长期记忆',
        problem: '多人房间会快速积累大量消息、文件和事实，直接塞入 prompt 会溢出且噪声极高。',
        process: '构建 Redis 实时窗口、MySQL 摘要/情节/参与者事实、FAISS 长期向量检索，并用 QueryClassifier 决定检索源顺序。',
        result: '系统可以针对“刚才聊了什么”“某个文件是干嘛的”“我之前说过什么”等不同问题选择不同记忆路径。',
        learning: 'Agent 记忆不是越多越好，而是按问题类型选择最小有效上下文。',
      },
      {
        title: '多模态低延迟流式呈现',
        problem: '生成式 AI 的体验很容易卡在等待：文本不能实时出现，思考与答案混在一起，语音 chunk 难播放，图片结果难统一展示。',
        process: '后端拆出 reasoning_delta、answer_delta、audio_delta；WebSocket 广播 ai_stream；前端按 stream key 增量聚合 content/reasoning/audio_base64，并将 PCM 包装成 WAV 播放。',
        result: '房间内所有用户都能看到 Agent 的实时思考、逐字答案、语音结果与最终消息落库。',
        learning: 'AI-Native 体验的核心是吞吐链路：模型流、服务端事件、网络协议、前端状态必须同时设计。',
      },
    ],
    learnings: [
      '全面打通了 AI Agent + Web 全栈的工程闭环。',
      '掌握了 Function Calling 的工具 Schema、执行器、tool role 消息和多轮工具循环。',
      '理解了 Agent 记忆管理：短期窗口、摘要压缩、长期向量检索、结构化事实和文件切片。',
      '实践了 SSE、WebSocket、reasoning delta、answer delta、audio base64 chunk 的低延迟前端渲染。',
      '以队长身份主导国赛级项目架构，训练了从技术路线、系统边界到交付验收的统筹能力。',
    ],
    nextSteps: ['完善更多可插拔工具执行器。', '强化多模态 RAG 的评测集与召回指标。', '为国赛演示补充更完整的端到端压测与可观测性看板。'],
  },
  {
    slug: 'xun-liang-game',
    name: '国风解谜游戏《寻梁》 / Xun Liang Game',
    summary:
      '计算机设计大赛省二等奖作品。作为 7 人团队核心程序员，我主导 Unity/C# 核心逻辑开发，并跨界利用 AI 视频生成及 Adobe PR/AU 完成多媒体音视频资源的生产与整合。',
    category: '游戏开发 / AIGC 实践',
    status: 'archived',
    order: -0.5,
    featured: true,
    hasDetail: true,
    role: '核心游戏程序员 / 跨界音视频设计师',
    cycle: '2026.04 - 2026.07，大二下游戏赛道竞赛项目',
    accent: '#b45309',
    tags: ['省二等奖', '7人跨学科协作', '技术美术(TA)跨界', 'AIGC 赋能管线'],
    techStack: ['Unity 6000', 'C#', 'UGUI / TextMeshPro', 'DOTween', 'Git LFS', 'AIGC', 'Premiere / Audition'],
    links: {
      github: 'https://github.com/programmer2048/BLCU_Project',
    },
    media: {
      pattern: 'canvas',
      alt: '国风解谜游戏《寻梁》的 Unity 场景、古建章节、榫卯拼图、地震物理解谜和 AIGC 剧情转场',
    },
    overview:
      '《寻梁》是一个围绕中国传统古建筑展开的国风叙事解谜游戏，最终获得中国大学生计算机设计大赛省级二等奖。Unity 工程中包含应县木塔、佛光寺、南禅寺、晋祠等章节资源，以及榫卯拼图、地震搭建、三消、音游、侍女修复等玩法系统。我负责大量 Unity / C# 核心逻辑，并在美术与音视频产能紧张时引入 AIGC + PR/AU 管线补足剧情转场和声音资产。',
    problem:
      '7 人跨学科团队需要在有限时间内完成游戏设计、程序、UI、音频、剧情视频和大量美术资产。Unity 项目里大型二进制资源容易冲突，古建主题又要求玩法、叙事和文化表达同时成立。作为程序主力，我必须把策划、美术和音视频资源转化为可运行系统，并在关键资源缺口处跨界补位。',
    solution:
      '我搭建了以 GameState、EventBus、SaveManager、TransitionManager、StoryManager 为主干的 Unity 运行框架，承接章节、存档、转场、剧情和小游戏；用 Git LFS 管理 png/jpg/mp3/wav/fbx/unity/asset/prefab 等大型资产；同时用 AI 视频生成、Premiere 剪辑和 Audition 音频处理，把剧情转场、BGM 和环境音纳入 Unity 播放链路。',
    features: [
      {
        title: '国风章节与剧情系统',
        description: '用 ChapterConfig ScriptableObject 组织章节 ID、标题、解锁费用、剧情节点、小游戏场景和社交更新，StoryManager 支持对话、选项、视频与回顾模式。',
        value: '让古建叙事和关卡流程从硬编码变成可配置内容。',
      },
      {
        title: '物理与解谜关卡',
        description: '实现榫卯拼图、地震搭建、找不同、侍女修复、三消与音游等系统，涵盖拖拽、碰撞、吸附、状态判定和胜负流程。',
        value: '把传统建筑结构从文本说明转化为手感和交互。',
      },
      {
        title: 'AIGC 多媒体管线',
        description: '通过 AI 视频生成补齐剧情转场，再用 Premiere / Audition 做剪辑、降噪、混音和声场处理，并接入 VideoPlayer、BGMManager 和剧情节点。',
        value: '在美术人力紧张时，用技术美术方式补足内容生产。',
      },
    ],
    architecture: [
      'Unity 版本为 6000.3.8f1，项目依赖 Input System、URP、Timeline、UGUI、Video、Audio、DOTween、TextMeshPro 等模块。',
      'GameState 枚举管理 Boot、Prologue、MainUI、Social、PartTimeJob、Match3、Rhythm、Story、MiniGame、Album、Ending 等全局阶段。',
      'EventBus 支持无参、单参、双参发布订阅，让流程、货币、社交、剧情、小游戏、图鉴、结局等模块解耦通信。',
      'SaveManager / SaveSystem 使用 JsonUtility 将 GameData 持久化到 Application.persistentDataPath/Saves，保存旅费、好感、章节进度、社交记录和解锁状态。',
      'TransitionManager 使用 DOTween、CanvasGroup、VideoPlayer、RenderTexture 和 SceneManager.LoadSceneAsync 实现场景异步加载与视频转场。',
      'StoryManager 读取 ChapterConfig，支持背景、角色、对话打字机、选项、视频节点、回顾模式和剧情结束后跳转小游戏。',
      'JigsawPiece 使用 Unity EventSystem 拖拽接口实现拼图拖动、随机打散、距离吸附和锁定，JigsawManager 统计完成数量并播放胜利流程。',
      'EarthquakeManager 将搭建阶段方块从 Kinematic 切到 Dynamic，使用 Perlin Noise 模拟地震横纵波，并按高度、中心偏移和稳定速度判定结构是否过关。',
      '项目通过 .gitattributes 配置 Git LFS 管理 unity、asset、prefab、png、jpg、psd、mp3、wav、fbx 等大型二进制资产。',
    ],
    highlights: ['省二等奖', '7人跨学科协作', '技术美术(TA)跨界', 'AIGC 赋能管线', '古建数字化传承'],
    challenges: [
      {
        title: '在多工种协作中做 Bridge Builder',
        problem: '策划、美术和程序节奏不同，游戏机制、剧情节点、音视频资源和 Unity 场景很容易脱节。',
        process: '用 ChapterConfig、StoryManager、TransitionManager 和事件总线把策划内容、美术素材、场景跳转与小游戏系统接成统一流程。',
        result: '团队可以把素材和剧情逐步接入 Unity，而不是每次改动都重写流程代码。',
        learning: '游戏程序员的价值不只是实现功能，还要把不同工种的产物变成可运行体验。',
      },
      {
        title: '让古建结构变成可交互谜题',
        problem: '传统建筑主题如果只做图文展示，很难让玩家真正理解木构与榫卯的结构美。',
        process: '设计榫卯拼图吸附机制和地震搭建物理系统，让玩家通过拖拽、旋转、碰撞和稳定性判定理解结构。',
        result: '文化主题进入了玩家手上的操作，而不只是停留在旁白里。',
        learning: '好的数字化传承要把知识变成互动，而不是把科普包装成游戏背景。',
      },
      {
        title: 'AIGC 降维打击传统制作管线',
        problem: '美工与音视频人力紧张，剧情转场和声音氛围容易成为短板。',
        process: '用 AI 视频生成快速产出转场素材，再通过 Premiere 做节奏剪辑，用 Audition 做降噪、混音和声场处理，最后接入 Unity VideoPlayer / AudioSource。',
        result: '一个程序员临时补上了多媒体生产链路，让项目在有限时间内拥有完整音画包装。',
        learning: 'AIGC 不是替代美术，而是让懂工程的人能更快打通“素材生成 → 后期处理 → 引擎落地”的管线。',
      },
    ],
    learnings: [
      '熟悉了 Unity 3D/2D 游戏开发闭环：场景、UI、存档、事件、剧情、物理、音视频、插件和构建。',
      '理解了多学科游戏团队的协作方式：策划定义体验，美术提供资产，程序把一切接成可运行系统。',
      '掌握了 Git LFS 在 Unity 大型二进制资产管理中的实际价值。',
      '实践了 AIGC in Game Dev：用 AI 快速生成叙事素材，再通过 PR/AU 做工业化整理。',
      '更确信自己可以在团队里同时承担工程实现者、技术美术和资源整合者的角色。',
    ],
    nextSteps: ['整理可公开演示视频与截图。', '补充更完整的关卡编辑工具。', '将 AIGC 视频与音频生产流程沉淀为团队管线文档。'],
  },
  {
    slug: 'mini-makers',
    name: 'Makershub 社团小程序 / Mini Makers',
    summary: '大一寒假启蒙作，为创客社团量身定制的微信小程序前端，开启了我的全栈开发之旅。',
    category: '微信小程序',
    status: 'archived',
    order: 1,
    featured: false,
    hasDetail: true,
    role: '前端开发 / 独立开发',
    cycle: '2025.02，大一上寒假，一周左右完成主要前端骨架',
    accent: '#00adb5',
    tags: ['启蒙之作', '社团服务', '快速自学', '微信小程序'],
    techStack: ['微信小程序', 'WXML / WXSS', 'JavaScript', 'Flex 布局', '自定义组件'],
    links: {
      github: 'https://github.com/starprince1234/mini_makers',
    },
    media: {
      pattern: 'flow',
      alt: 'Mini Makers 微信小程序首页、社团工作台和移动端表单界面',
    },
    overview:
      'Mini Makers 是我在大一上学期寒假为 Makershub 创客空间开发的微信小程序前端。它围绕社团成员和部门管理的真实需求，搭建了登录注册、首页功能入口、个人中心、协会工作台、活动宣传、任务发布、学年安排等页面。',
    problem:
      '社团日常管理里有很多分散流程：活动宣传、任务发布、值班签到、项目跟进、个人信息和部门协作。如果这些入口都散落在群聊和表格里，成员很难快速找到自己要做的事。',
    solution:
      '我用微信小程序把常用操作收敛到一个移动端入口：普通成员从首页和“我的”进入常用功能，社团成员通过“协会工作”进入宣传部、基管部、项目部、运维部等部门工作流，并为后续后端接口接入预留请求结构。',
    features: [
      {
        title: '社团首页入口',
        description: '用轮播图、公告栏和功能按钮网格组织申请借物、申请场地、项目立项、协会活动、查看项目、近期赛事等入口。',
        value: '让成员打开小程序就能找到高频操作。',
      },
      {
        title: '协会工作台',
        description: '为宣传部、基管部、项目部、运维部设计独立入口，并保留值班签到、扫除签到、远程控制和值班申请等常用功能。',
        value: '把社团管理从群聊推进到结构化工作流。',
      },
      {
        title: '宣传与任务流程',
        description: '实现学年工作安排、发布任务、活动宣传发布、秀米链接提交等页面，覆盖宣传部的核心协作路径。',
        value: '把真实部门需求拆成可操作的移动端表单。',
      },
    ],
    architecture: [
      '使用微信小程序原生技术栈：WXML 负责页面结构，WXSS 负责移动端样式，JavaScript 管理页面状态、跳转和接口请求。',
      '在 app.json 中注册 14 个页面，形成“登录注册 → 首页入口 → 我的 / 协会工作 → 部门工作流”的页面结构。',
      '封装 components/navBar 自定义导航栏，支持返回、回首页、编辑、消息图标和不同主题配置，适配小程序状态栏与胶囊按钮。',
      '通过 rpx、vw、vh、Flex 布局和图标资源完成手机端界面适配，并在提交记录中处理过 iOS 滑动穿透、iPad 宽高比等真机问题。',
      '多个页面使用 wx.request 预留登录注册、用户信息、权限等级、活动发布、任务提交等接口，为后续后端接入留出边界。',
    ],
    highlights: ['启蒙之作', '社团服务', '快速自学', '真实用户场景', '从空白模板到可交付前端'],
    challenges: [
      {
        title: '第一次从 0 学小程序并交付页面',
        problem: '当时还没有完整前端经验，需要同时理解 WXML、WXSS、页面生命周期、组件通信和微信开发者工具。',
        process: '从空白模板开始拆页面，先打通首页、登录注册和个人中心，再逐步补齐部门工作流和表单页面。',
        result: '一周左右完成主要前端骨架，并形成可继续接后端的页面结构。',
        learning: '学会在真实需求里边做边学，而不是等“完全学会”才开始。',
      },
      {
        title: '移动端真机适配',
        problem: '模拟器正常不代表真机正常，首页底部栏、iOS 滑动穿透和 iPad 宽高比都暴露出适配问题。',
        process: '不断在设备表现和样式之间来回调试，使用固定入口、禁止穿透和布局微调解决问题。',
        result: '页面在更多移动端场景下保持可用，而不是只停留在模拟器截图。',
        learning: '前端工程的难点常常在细节验证，真实设备是最诚实的评审。',
      },
    ],
    learnings: [
      '第一次理解组件化：把重复出现的顶部导航抽成可配置组件，而不是每个页面复制一份。',
      '第一次把产品路径和代码结构联系起来：用户入口、成员身份、部门权限和表单流程都需要被清晰组织。',
      '第一次意识到 API 对接边界：即使先做前端，也要提前为登录、注册、用户信息和内容提交预留接口。',
      '更确信技术学习最有效的方式是对准真实问题，快速做出能被使用的版本。',
    ],
    nextSteps: ['整理小程序截图。', '把早期占位接口复盘为更完整的前后端协作设计。', '继续把这个项目作为技术时间线的起点展示。'],
  },
  {
    slug: 'multi-terminal-snake',
    name: '三端同服实时联机贪吃蛇 / Multi-terminal Snake Game',
    summary:
      '大一下学期硬核实践，基于 Java 后端与 JSON 状态接口，实现 Web 端状态同步，并独立开发 Android、Desktop 两个原生贪吃蛇客户端。',
    category: '全栈开发 / 网络游戏',
    status: 'archived',
    order: 2,
    featured: false,
    hasDetail: true,
    role: '独立全栈开发',
    cycle: '2025.06，大一下学期 Java 实践项目',
    accent: '#16a34a',
    tags: ['实时状态同步', '一端多用', '跨平台实践', 'Java'],
    techStack: ['Java Servlet', 'Gson / JSON', 'HTML5 Canvas', 'Android Java', 'Java Swing', '前后端分离'],
    links: {
      github: 'https://github.com/starprince1234/java_snakegame',
    },
    media: {
      pattern: 'canvas',
      alt: '多端贪吃蛇项目的 Java 后端、Web Canvas、Android 原生界面和 Swing 桌面端',
    },
    overview:
      '这是我在大一下学期学习 Java 时主动扩展出来的硬核练习：不满足于普通控制台作业，而是把贪吃蛇拆成 Web 端 Java 状态同步后端、Canvas 浏览器客户端、Android 原生客户端和 Java Swing 桌面端。当前本地源码中，Web 端使用 Servlet + JSON + 150ms 轮询同步，Android 与 Desktop 是独立原生客户端。',
    problem:
      '传统 Java 贪吃蛇通常只训练循环、数组和键盘输入，但无法触碰真实工程里的状态边界、网络接口、跨端渲染和移动端适配。我希望把一个小游戏做成系统设计练习，逼自己理解状态在哪里、输入怎么流动、终端如何渲染。',
    solution:
      '我将 Web 端的游戏状态放到 Java 后端，由 GameEngine 定时推进蛇身、食物、碰撞和分数；浏览器通过 JSON 接口提交方向、暂停、重启等意图，并用 Canvas 根据服务端状态重绘。同时，我用同一套游戏状态思想分别实现 Android Custom View 客户端和 Swing 桌面端客户端。',
    features: [
      {
        title: 'Java 状态同步后端',
        description: 'SnakeServlet 暴露 /snake 接口，GameEngine 使用 ScheduledExecutorService 每 150ms 推进游戏状态，并通过 Gson 输出 JSON。',
        value: '把游戏世界从浏览器中抽离出来，由服务端维护权威状态。',
      },
      {
        title: 'Web Canvas 客户端',
        description: '浏览器端使用 Canvas 绘制 30x30 棋盘、蛇身、食物、分数、暂停层和 Game Over 覆层，并通过 fetch 提交控制命令。',
        value: '前端只负责输入和渲染，体现前后端分离。',
      },
      {
        title: 'Android 与 Desktop 原生端',
        description: 'Android 端用 AppCompatActivity、Handler 和自定义 View 绘制；Desktop 端用 JFrame、JPanel、KeyListener 和 Swing Timer 实现。',
        value: '同一套规则在不同终端下重写交互和渲染。',
      },
    ],
    architecture: [
      'Web 模块是 Maven WAR 项目，依赖 jakarta.servlet-api 与 Gson，入口页面配置在 WEB-INF/web.xml，欢迎页为 static/html/index.html。',
      'SnakeServlet 在 ServletContext 中保存全局 GameEngine，GET 返回 GameState JSON，POST 根据 action=direction/pause/restart 修改状态。',
      'GameEngine 维护 snakeBody、foodPosition、score、gameOver 和 currentDirection，并负责边界碰撞、自碰撞、食物生成、反向移动保护。',
      'Web 前端 game.js 使用 fetch + setTimeout 形成 150ms 状态轮询，并用 isRequestPending 避免网络请求堆积。',
      'Android 模块使用 Gradle Kotlin DSL、Java 8、AppCompat、ConstraintLayout，自定义 GameView 在 Canvas 上绘制蛇和食物，并用 SharedPreferences 保存最佳分。',
      'Desktop 模块使用 Java Swing，JFrame 承载 JPanel，javax.swing.Timer 以 50ms 节拍驱动移动和 repaint。',
    ],
    highlights: ['实时状态同步', '一端多用', '跨平台实践', 'Java 后端状态机', '从课堂作业升级成系统设计'],
    challenges: [
      {
        title: '从单机循环升级为服务端状态机',
        problem: '如果所有逻辑都写在浏览器里，项目只是一个网页小游戏，无法练到后端状态管理和前后端边界。',
        process: '将 Web 端规则集中到 Java GameEngine，Servlet 负责接收控制意图和返回 JSON 状态，Canvas 只根据状态渲染。',
        result: 'Web 端形成了“输入 → 后端状态机 → JSON → Canvas 重绘”的闭环。',
        learning: '实时系统的第一步不是技术选型，而是定义谁拥有权威状态。',
      },
      {
        title: '用轮询暴露实时同步问题',
        problem: '当前 Web 端不是 WebSocket，而是 fetch 轮询；如果请求重叠或刷新节拍不稳定，画面就会卡顿或滞后。',
        process: '在前端加入 isRequestPending 请求锁，并让前端刷新节拍与后端 150ms 状态推进节拍保持一致。',
        result: '轮询版本可以稳定演示状态同步，也清楚暴露出下一步升级 WebSocket 推送的必要性。',
        learning: 'WebSocket 的价值不是概念炫酷，而是它能减少轮询开销并让服务端主动推送状态。',
      },
      {
        title: '跨端不是复制，而是重写交互物理',
        problem: 'Web 有键盘和固定 Canvas，Android 是竖屏触控，Desktop 是窗口与键盘事件，不能简单复用同一套 UI。',
        process: 'Android 动态计算游戏区和方向键尺寸，Desktop 使用 Swing Timer 和 KeyListener，Web 使用 Canvas 与 DOM 控制按钮。',
        result: '三个终端都保留同一套游戏规则，但拥有符合自身平台的输入和渲染方式。',
        learning: '跨平台工程的核心是抽象规则，尊重终端差异。',
      },
    ],
    learnings: [
      '掌握了 Java 后端 Servlet、JSON 序列化、定时任务和基础状态机设计。',
      '理解了事件驱动模型：键盘、按钮、Handler、Timer、HTTP 请求都可以视为输入事件。',
      '第一次把“游戏状态同步”拆成状态模型、更新节拍、输入协议和渲染层。',
      '理解了 WebSocket 的适用场景：当前源码是轮询实现，下一步自然演进是用长连接替代 GET 状态轮询。',
      '建立了前后端分离意识：客户端提交意图，服务端维护状态，终端只负责渲染。',
    ],
    nextSteps: ['将 Web 端轮询升级为真正的 WebSocket 状态推送。', '把 Android 与 Desktop 接入同一服务端协议。', '补充多人房间、玩家 ID 和断线重连机制。'],
  },
  {
    slug: 'time-series-analysis-app',
    name: '跨平台时序分析与可视化系统 / Multi-Platform Time-Series Analysis App',
    summary:
      '大创项目技术结晶，将原生 Python 时序分析算法封装为 Flask / Socket.IO 服务，并使用 Web 与 Flutter 构建覆盖移动端、桌面端与网页端的多端分析平台。',
    category: '跨平台应用 / 数据可视化 / 科研工程化',
    status: 'in-progress',
    order: 3,
    featured: false,
    hasDetail: true,
    role: '独立软件研发负责人 / 大创技术骨干',
    cycle: '2025 下半年，大二上学期大创项目',
    accent: '#7c3aed',
    tags: ['大创技术结晶', '算法产品化', '跨平台五端架构', '自学 Dart / Flutter'],
    techStack: ['Python', 'Flask', 'Flask-SocketIO', 'Flutter', 'Dart', 'REST API', 'Socket.IO', '数据可视化'],
    links: {
      github: 'https://github.com/starprince1234/my-analysis-app',
    },
    media: {
      pattern: 'ai',
      alt: '跨平台时序分析系统的 Web 上传、实时进度、分析结果与 Flutter 多端客户端',
    },
    overview:
      '这是我在大创项目中主导的软件工程化工作：把原本偏脚本形态的 Python 传感矩阵分析逻辑，封装成 Flask / Socket.IO 后端服务，并分别构建原生 Web 前端和 Flutter 跨平台客户端。系统围绕 96 通道时序 CSV 数据，支持应力分析 GIF、结节检测 GIF、统计特征聚类图和 JSON 报告。',
    problem:
      '科研分析代码往往能算但不好用：用户不知道如何上传数据、如何选择算法、任务是否还在运行、结果文件在哪里。我的任务是把这些“本地脚本能力”重构成普通用户可以通过浏览器或客户端使用的产品路径。',
    solution:
      '我将算法拆成独立 logic 模块，用 POST /api/upload 处理 CSV 上传，用 Socket.IO 事件启动长任务并推送进度，再通过 Web 与 Flutter 两套客户端展示 GIF、PNG 和 JSON 报告。部署层用 Docker Compose 与 Nginx 组织前端、后端、Socket.IO 和结果文件访问。',
    features: [
      {
        title: 'CSV 上传与任务编排',
        description: '通过 Flask 的 POST /api/upload 接收 CSV，使用 UUID + secure_filename 保存文件，再以 filepath 作为后续分析任务输入。',
        value: '把手动路径输入改成标准上传流程。',
      },
      {
        title: '三类科研分析任务',
        description: '支持应力分布动画、结节检测演化和统计特征分析，覆盖 GIF、PNG 与 JSON 报告三类输出。',
        value: '让算法结果直接进入可视化交付形态。',
      },
      {
        title: 'Flutter 多端客户端',
        description: '使用 provider、http、socket_io_client、file_picker 构建跨平台客户端，并保留 Android、iOS、Web、Windows、macOS、Linux 平台工程。',
        value: '探索一套业务 UI 多端运行的工程边界。',
      },
    ],
    architecture: [
      'Web 后端使用 Flask 3.1.2 与 Flask-SocketIO 5.5.1，REST 负责文件上传，Socket.IO 负责 start_processing、progress_update、task_complete、error 等长任务事件。',
      '算法层拆分为 backend/logic/stress_analyzer.py、nodule_detector.py、stats_processor.py，通过 progress_callback 上报进度，避免算法函数直接耦合 Web 框架。',
      '应力分析将 MAT_0 到 MAT_95 重塑为 12x8 矩阵，生成 2D 热图、3D 曲面、等高线和统计信息，并用 Pillow 合成 GIF。',
      '结节检测使用 GaussianMixture、形态学 closing 和 regionprops，基于 SN 时间序列生成结节演化 GIF。',
      '统计分析使用 FFT 提取频域特征，StandardScaler 标准化，KMeans 聚类，并输出 PNG 图与 JSON 报告。',
      'Web 前端是原生 HTML/CSS/JavaScript，使用 fetch 上传文件，Socket.IO Client 监听进度和结果。',
      'Flutter 客户端使用 ChangeNotifier + provider 管理状态，通过 http.MultipartRequest 上传 CSV，通过 socket_io_client 接收任务进度与结果。',
      '部署侧使用 Docker Compose 编排 Flask 后端和 Nginx，Nginx 提供静态前端、反向代理 /api/ 与 /socket.io，并直接暴露 /results/ 结果文件。',
    ],
    highlights: ['大创技术结晶', 'Legacy 算法 API 化', 'Socket.IO 实时进度', 'Flutter 五端架构', '科研代码产品化'],
    challenges: [
      {
        title: '把科研脚本改造成服务接口',
        problem: '原始算法更像本地脚本：路径、参数、输出都依赖开发者手动控制，普通用户无法直接使用。',
        process: '将分析逻辑拆进 backend/logic，以 CSV 上传和 task 事件作为统一入口，用 filepath 连接上传文件和后续长任务。',
        result: '用户只需要上传 CSV 并选择任务，就能得到 GIF、PNG 或 JSON 报告。',
        learning: '算法产品化的关键不是换 UI，而是先把输入、输出和任务生命周期标准化。',
      },
      {
        title: '长任务进度可观测',
        problem: 'matplotlib 多帧渲染 GIF 是耗时任务，如果没有实时反馈，页面会像卡死一样。',
        process: '在算法函数中注入 progress_callback，由 Flask-SocketIO 推送 progress_update、task_complete 和 error。',
        result: 'Web 和 Flutter 客户端都可以实时显示进度条，并在任务完成后展示结果。',
        learning: '科研计算要产品化，必须让长任务变得可观察、可反馈、可恢复。',
      },
      {
        title: '跨平台客户端的网络与 UI 边界',
        problem: 'Web、Android、Windows 等终端访问后端的地址和文件选择机制不同，不能简单写死 localhost。',
        process: 'Flutter 端通过 --dart-define=BACKEND_URL 注入后端地址，Web 用 bytes 上传，桌面 / 移动端用 path 上传，并用 InteractiveViewer 支持缩放和平移。',
        result: '同一套 Flutter UI 可以面向 Android、iOS、Web、Windows、macOS、Linux 平台工程扩展。',
        learning: '跨平台不是消灭差异，而是把差异收敛到配置、插件和平台通道里。',
      },
    ],
    learnings: [
      '掌握了 Python 后端工程化：Flask 路由、文件上传、Socket.IO 长任务事件、Docker 化部署。',
      '理解了科学计算服务化：pandas / numpy 处理数据，matplotlib / Pillow 生成可交付图像，scikit-learn / scikit-image 承载分析算法。',
      '自学并实践 Flutter / Dart：provider 状态管理、http multipart 上传、socket_io_client 实时通信、file_picker 跨平台文件选择。',
      '形成 API-First 思维：算法层、接口层、Web UI、Flutter UI、部署层可以独立演进。',
      '从“写功能”转向“规划多端系统”：关注部署、复现、环境变量、上传目录、结果目录和跨端访问。',
    ],
    nextSteps: ['增加交互式 Plotly / WebGL 可视化。', '为分析任务加入队列和任务历史。', '补充鉴权、结果访问控制和更严格的 CORS 白名单。'],
  },
  {
    slug: 'xiaotiao-ecommerce',
    name: 'BigtallPlus 跨境电商平台 / Xiaotiao E-Commerce',
    summary:
      '“小挑”参赛项目技术底座，独立二开并部署上线的跨境电商平台，基于 WordPress FSE 与 WooCommerce，支持真实商品展示、购物车、结账、会员登录和公网域名访问。',
    category: '跨境电商 / 商业落地',
    status: 'live',
    order: 0,
    featured: false,
    hasDetail: true,
    role: '全栈开发负责人 / 运维负责人',
    cycle: '2026.02 - 2026.07，大二下竞赛井喷期',
    accent: '#233a95',
    tags: ['生产级部署', '真实上线域名', '跨境出海适配', '商业闭环'],
    techStack: ['WordPress', 'WooCommerce', 'PHP', 'Full Site Editing', 'theme.json', 'Nginx', 'SiteGround CDN', 'SEO'],
    links: {
      live: 'https://bigtallplus.com/',
      github: 'https://github.com/starprince1234/xiaotiao_dianshang',
    },
    media: {
      pattern: 'tool',
      alt: 'BigtallPlus 跨境电商平台首页、商品列表、购物车、结账和会员登录链路',
    },
    overview:
      'BigtallPlus 是我为“小挑”创业竞赛团队交付的跨境电商站点。项目基于 WordPress Full Site Editing 区块主题与 WooCommerce 进行品牌化二次开发，覆盖首页、商品归档、单品页、购物车、结账页、登录注册、Mega Menu 和多套色板，并已部署到 https://bigtallplus.com/ 真实公网域名。',
    problem:
      '创业竞赛不能只停留在商业计划书和截图里，团队需要一个可演示、可访问、可承载商品和购物流程的真实电商平台。时间紧、比赛密集，我必须选择能快速支撑商业验证的技术路线，并完成部署、安全配置和线上可用性验证。',
    solution:
      '我选择 WordPress + WooCommerce 作为商业底座，在成熟 CMS / 电商生态上做 BigTallPlus 品牌化覆盖层：用 theme.json 管理全局视觉，用 templates 和 patterns 覆盖商品、购物车、结账等页面，用 PHP 钩子接入 Ultimate Member 登录注册，用 CSS / JS 调整 Mega Menu，并通过 SiteGround / SFTP 将主题发布到独立域名。',
    features: [
      {
        title: '商品与购物链路',
        description: '基于 WooCommerce 模板与区块实现商品归档、单品页、Add to cart、购物车、结账、订单摘要和支付入口。',
        value: '把竞赛项目从展示页推进到可体验的商业闭环。',
      },
      {
        title: '品牌化 FSE 主题',
        description: '通过 theme.json、templates、parts、patterns、styles 构建 BigTallPlus 视觉覆盖层，保留 WordPress 站点编辑能力。',
        value: '让非技术成员也能在后台继续维护内容和商品。',
      },
      {
        title: '真实线上部署',
        description: '站点上线到 bigtallplus.com，HTTPS 可访问，响应头显示 nginx、SiteGround CDN / Cache 链路。',
        value: '完成从本地主题到公网服务的跨越。',
      },
    ],
    architecture: [
      '项目是 WordPress 区块主题目录，不是 React / Next.js / Vue 项目；源码即主题文件，无独立前端构建流程。',
      '主题基于 TemplateHouse 的 Grocery and Organic Store v1.0.4 二次整理，保留 GPL 与 FSE 升级路径。',
      'theme.json v3 统一色板、字体、布局、字号和区块默认样式；styles/ 提供 11 套全局风格变体。',
      'templates/ 覆盖 front-page、archive-product、single-product、cart、checkout、search、sitemap、404 等关键页面。',
      'WooCommerce 负责商品、购物车、结账、支付入口和订单数据，主题侧通过 WooCommerce Blocks 定制页面结构和视觉。',
      'functions.php 中的 btplus_ 命名空间负责 Ultimate Member 登录/注册页面自动创建、短代码注入和登录跳转控制。',
      'Mega Menu 不修改插件源码，通过 CSS / JS 覆盖层实现多级飞出菜单、移动端回退和宽高同步。',
      '部署层使用 SiteGround 主机与 SFTP 上传主题目录，线上由 nginx / SiteGround CDN / Cache 提供访问；仓库通过 .env.example 与 smtp-config.example.php 隔离敏感配置。',
    ],
    highlights: ['生产级部署', '真实上线域名', '跨境出海适配', '商业闭环', '竞赛井喷期快速交付'],
    challenges: [
      {
        title: '在竞赛压力下选择最快商业路径',
        problem: '从零写电商系统风险高，商品、购物车、结账、用户和后台管理都需要时间验证。',
        process: '选择 WordPress + WooCommerce 作为底座，把开发精力集中在品牌化、模板覆盖、登录注册、菜单体验和部署上。',
        result: '在有限时间内交付了可访问、可演示、可维护的跨境电商站点。',
        learning: '商业项目不是炫技，关键是用正确生态最快完成可信交付。',
      },
      {
        title: '把主题二开做成可回退覆盖层',
        problem: '直接魔改插件或基础主题会导致后续升级和回滚困难。',
        process: '保留基础主题结构，用 btplus_ 函数、theme.json、patterns、styles 和独立 CSS / JS 形成覆盖层。',
        result: '二开点集中、可审查、可迁移，也降低了改动影响插件核心逻辑的风险。',
        learning: '成熟生态里的工程能力，很多时候体现在边界控制和可回退设计。',
      },
      {
        title: '从代码交付走向运维交付',
        problem: '真实上线涉及域名、HTTPS、主机、缓存、SFTP、SMTP、密钥隔离和线上巡检，不是上传文件这么简单。',
        process: '通过 SiteGround 主机上线站点，保持 .env、SMTP、SFTP、数据库 dump 等敏感信息不入仓，并验证 HTTPS、缓存和站点可访问性。',
        result: 'bigtallplus.com 能在公网真实访问，并具备基本电商页面和运营信息。',
        learning: '生产级交付必须同时关心代码、服务器、域名、安全和维护流程。',
      },
    ],
    learnings: [
      '完成从本地 Demo 到真实公网商业站点的跨越。',
      '理解了 WordPress FSE、theme.json、Block Patterns、WooCommerce Blocks 的组合方式。',
      '掌握了商品、购物车、结账、会员登录等电商关键链路的工程边界。',
      '建立了运维意识：域名、HTTPS、CDN/cache、SFTP、SMTP、密钥隔离和上线检查都属于交付的一部分。',
      '在竞赛井喷期训练了高压下快速选型、快速交付和多线并行的能力。',
    ],
    nextSteps: ['补充结构化数据与更完整的国际 SEO。', '为支付、物流和订单邮件配置编写运维 runbook。', '增加自动化部署与上线前检查清单。'],
  },
]

export const visibleProjects = projects
  .filter((project) => !project.draft && !project.archived)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

export const featuredProjects = visibleProjects.filter((project) => project.featured).slice(0, 4)

export const projectCategories = Array.from(new Set(visibleProjects.map((project) => project.category)))

export const projectTags = Array.from(new Set(visibleProjects.flatMap((project) => project.tags ?? []))).sort()

export const skillGroups: SkillGroup[] = [
  {
    title: '前端开发',
    description: '把产品想法变成清晰、响应式、可访问的界面。',
    items: [
      { name: 'Vue 3', usedIn: '用于个人站、工具产品和项目详情页架构' },
      { name: 'TypeScript', usedIn: '用于约束项目数据、组件 props 和业务状态' },
      { name: 'Tailwind CSS', usedIn: '用于快速构建响应式 UI 和统一视觉语言' },
      { name: 'Vue Router / Nuxt', usedIn: '用于页面组织、动态路由和后续内容扩展' },
    ],
  },
  {
    title: '后端与云服务',
    description: '围绕真实上线目标组织接口、数据和部署。',
    items: [
      { name: 'Node.js / API', usedIn: '{待补充：关联项目}' },
      { name: 'PostgreSQL / Supabase', usedIn: '{待补充：关联项目}' },
      { name: 'Vercel / Cloudflare', usedIn: '{待补充：部署项目}' },
      { name: 'Docker', usedIn: '{待补充：容器化项目}' },
    ],
  },
  {
    title: 'AI / LLM 应用',
    description: '把模型能力设计成可控、可校对、可复用的产品流程。',
    items: [
      { name: 'OpenAI API / LLM API', usedIn: '{待补充：AI 项目}' },
      { name: 'Prompt Engineering', usedIn: '用于稳定输出结构和任务流程' },
      { name: 'RAG / Agent Workflow', usedIn: '{待补充：探索项目}' },
      { name: 'AI Coding Tools', usedIn: '用于加速原型、测试和文档整理' },
    ],
  },
  {
    title: '产品与设计',
    description: '从问题、用户路径、MVP 到上线迭代形成闭环。',
    items: [
      { name: '原型设计', usedIn: '用于快速验证页面结构和核心路径' },
      { name: '用户流程设计', usedIn: '用于减少操作步骤和认知负担' },
      { name: '项目复盘', usedIn: '用于沉淀挑战、取舍和下一步计划' },
      { name: '内容系统', usedIn: '用于长期维护项目、笔记和个人主页' },
    ],
  },
]

export const timeline: TimelineItem[] = [
  {
    period: '大一上寒假 · 2025.01 - 2025.02',
    title: '完成早期公网项目 MVP',
    description: '从一个具体问题出发，完成需求拆解、前端实现、部署上线和初步优化。',
    tags: ['MVP', 'Deploy', 'Solo Built'],
  },
  {
    period: '大一上寒假 · 2025.02',
    title: '开发首个微信小程序，开启技术探索之路',
    description:
      '为了解决 Makershub 创客空间日常管理与活动展示需求，我零基础自学微信小程序开发，在一周内独立完成 Mini Makers 小程序前端。这不仅是我第一个落地并交付给真实用户使用的作品，更是我自学网页开发、走向独立开发者之路的起点。',
    tags: ['独立前端开发', '微信小程序', '启蒙之作'],
  },
  {
    period: '大一下 · 2025.03',
    title: '开始系统尝试 AI 应用开发',
    description: '把 AI 能力嵌入真实工作流，重点关注输出稳定性、用户校对和结果复用。',
    tags: ['AI App', 'Workflow'],
  },
  {
    period: '大一下 · 2025.04 - 2025.05',
    title: '整理项目数据和案例复盘',
    description: '把项目从“能访问”推进到“能讲清楚为什么做、怎么做、遇到什么挑战”。',
    tags: ['Case Study', 'Writing'],
  },
  {
    period: '大一下 · 2025.06',
    title: '自主设计并实现三端实时联机网络游戏，突破传统 Java 课程边界',
    description:
      '在大一下学期学习 Java 期间，我自主立项并设计了一套跨 Web、Android、Desktop 的贪吃蛇实践。Web 端由 Java Servlet 后端维护状态并通过 JSON 接口同步给 Canvas 客户端，Android 与 Desktop 端分别用原生 View 和 Swing 实现同一套游戏规则。这个项目让我深入理解了网络接口、定时状态机、事件驱动、前后端分离和多终端适配等底层架构思想，极大拓宽了我的工程视野。',
    tags: ['独立全栈开发', 'Java', '跨平台实践'],
  },
  {
    period: '大二上 · 2025.09 - 2025.12',
    title: '大创项目技术负责人，主导时序分析算法的多端跨平台产品化',
    description:
      '在大创项目中，我承担了将 Python 原生时序分析代码工程化的重任。通过 Flask / Socket.IO 将底层算法逻辑封装为标准上传接口和长任务事件协议，解耦前后端；同时横向拓宽技术栈，自学 Flutter / Dart 实现 Web、Android、Windows 等多端客户端架构，探索“一套代码，多端部署”的工程实践，完成了从代码编写者到多端系统规划者的蜕变。',
    tags: ['大创项目', '跨平台架构', '科研工程化'],
  },
  {
    period: '大二上期末 · 2025.11 - 2025.12',
    title: '技术破局：研发智能体大赛数据源插件并首战公网部署',
    description:
      '以插件主开发者 & 基础设施部署身份参加智能体开发大赛，独立负责牛客网高并发自动化抓取插件。我基于 Playwright 实现了绕过检测的无头浏览器指纹对抗，独创性地在网络层对目标 API 进行 Response Hook 拦截，直接捕获纯净数据元，并利用多线程守护实现进程中断时的数据优雅落盘。该项目作为 COZE 智能体核心工具上线，并推动我首次独立在 VPS 云服务器上跑通公网部署与环境变量配置，为大二下一系列中大型微服务和双后端解耦项目的全面上线奠定了决定性的工程底座。',
    tags: ['Playwright', 'API Hook', 'VPS Deployment', 'Cookie Lifecycle'],
  },
  {
    period: '大二下 · 2026.02 - 2026.07',
    title: '狂飙与井喷：全面迎战各项竞赛，技术向生产力转化',
    description:
      '进入大二下学期，我的技术积累迎来井喷式爆发。半年里，我密集参与包括“小挑”在内的多项高水平学科与创新创业竞赛，开始以技术主脑身份多线并行作战：一边拆商业需求，一边写代码，一边上线真实服务。其中，我为出海项目独立二开并部署了跨境电商网站 bigtallplus.com，把 WordPress / WooCommerce 主题、会员登录、商品展示、购物车、结账和 SiteGround 线上部署串成完整商业链路。这个阶段让我从“做项目”切换到“扛交付”，在高压下训练了快速选型、生产级运维、商业架构和公网交付能力。',
    tags: ['Competition Explosion', '生产级部署', '商业落地'],
  },
  {
    period: '大二下 · 2026.02 - 2026.07',
    title: '领袖之姿：主导省级大创与软创项目《稽古云语》全栈研发',
    description:
      '以项目负责人身份，我撰写规范化开发文档，主导研发「稽古云语」文物智能识别与对话系统。我设计并实现 Java + Python 双后端解耦架构：Java 负责用户、鉴权、文物库、收藏、反馈和任务状态机，Python 负责 VLM 文物识别、RAG 检索与多轮 AI 对话；同时推动 UniApp 微信小程序和 Android 原生应用落地，支持微信搜索直达与现场真机演示。该项目作为省级大创负责人项目立项，并斩获全国大学生软件创新大赛省级三等奖，集中展现了我的架构设计、AI 工程研发与团队统筹能力。',
    tags: ['省级大创负责人', '软创省三', '双后端架构'],
  },
  {
    period: '大二下 · 2026.03 - 2026.07',
    title: '主导设计国赛级 AI Agent 系统，攻克多模态流式交互技术',
    description:
      '作为队长，我主导了参加“中国大学生计算机设计大赛（软件与应用开发赛道）”的项目设计与全栈实现。我独立架构了一套 AI Agent 智能体系统，攻克了上下文记忆机制、函数/工具调用（Function Calling）逻辑，并在 Web 端实现了文字、思考过程、流式音频语音与图像结果的多模态低延迟同步呈现。项目成功在公网部署到 cbvjgf.art，并凭借智能体成员化、三层记忆 RAG、工具调用和流式体验，成功推优国赛，成为我竞赛井喷期的黄金里程碑。',
    tags: ['国赛推优', 'AI Agent', '队长主架构'],
  },
  {
    period: '大二下 · 2026.04 - 2026.07',
    title: '打破学科边界：主导 7 人团队国风解谜游戏《寻梁》开发',
    description:
      '作为核心程序，我参与 7 人跨学科团队（策划、美术、程序），冲刺中国大学生计算机设计大赛数字媒体游戏开发赛道。除负责 Unity 关卡交互、剧情流程、物理解谜和核心逻辑的 C# 编写外，我还敏锐地将 AIGC 引入游戏工作流，客串技术美术与音效师：通过 AI 视频生成工具快速产出剧情转场，并利用 Premiere 和 Audition 独立完成高质量音画剪辑、混音与降噪。在多工种高频协作中展现出工程管线掌控力，最终团队斩获省级二等奖。',
    tags: ['省级二等奖', 'Unity', 'AIGC 游戏管线'],
  },
  {
    period: '当前 · 2026.05',
    title: '持续构建个人项目系统',
    description: '把新的想法、实验、工具和复盘沉淀到同一个长期维护的个人主页中。',
    tags: ['Now', 'Portfolio', 'Iteration'],
  },
  {
    period: '大二下 · 2026.05 - 2026.07',
    title: '工程师的成人礼：主导 NebulaCloud 高并发 AI 微服务网关开发',
    description:
      '加入技术社团并参与大型微服务系统 NebulaCloud 建设，独立负责其中最核心、高并发的 AI 路由与 API 转发中转站模块（nebula-ai）。在此项目中，我经历了向专业软件工程师的蜕变：首次引入并践行规范的 Git Flow 多人协作与 PR 审查机制；自主编写 GitHub Actions Workflows，跑通了云原生 CI/CD 自动化构建、镜像打包与持续部署管线；通过逆向解构优秀开源项目 new-api，设计并实现了多通道容灾与动态限流算法。该项目作为社团公共基础设施上线，承载了真实活跃的高频流量，彻底打通了我的云原生与大型分布式系统工程视野。',
    tags: ['核心网关研发', 'DevOps 实践', 'Git Flow', '逆向开源'],
  },
  {
    period: '大二下 · 2026.05 - 2026.08',
    title: '领跑 FinTech：主导设计国赛级机器学习预测与 AI 研报平台',
    description:
      '作为总策划与首席全栈架构师，我全权主导了“花旗杯金融创新应用大赛”推优国赛项目《油擎洞察》的系统设计与全栈落地。我规划并实现多因子驱动机器学习预测与大语言模型协同工作流：用户上传复杂因子表格，系统在后端触发 ML 模型推理，生成多周期收益率预测、分位数风险区间、行业冲击和因子解释，再将结构化结果无缝流转给大模型，实时生成深度金融分析研报并在 Web 端呈现。同时，我正为其部署交互式 AI 金融分析师 Agent 系统。从 Technical Report 技术路线撰写，到算法部署、前后端上线和演示视频制作，我跑通了“量化预测 + AI Agent + 生产级 Web”的极客闭环，并在顶尖金融科技大赛中斩获全国决赛资格。',
    tags: ['花旗杯推优国赛', '量化预测+大模型', '总策划', 'AI 金融分析师'],
  },
]
