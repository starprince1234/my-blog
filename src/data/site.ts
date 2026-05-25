import type { Project, SkillGroup, TimelineItem } from '../types'

export const profile = {
  name: 'starprince',
  role: '全栈开发者 / AI 产品开发者',
  oneLine: '我喜欢把模糊的想法做成可访问、可使用、可维护的产品，并在真实使用中持续迭代。',
  focus: ['AI 应用', 'Web 产品', '开发者工具', '效率软件', '创意交互'],
  github: '{待补充：GitHub 链接}',
  email: '{待补充：邮箱}',
  social: '{待补充：社交媒体链接}',
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
    slug: 'ai-workflow-assistant',
    name: '{待补充：AI 工作流项目名称}',
    summary: '一个帮助用户在真实工作流中完成 {待补充：核心任务} 的 AI 应用。',
    category: 'AI 应用',
    status: 'live',
    order: 10,
    featured: true,
    hasDetail: true,
    role: '产品设计、前端开发、AI 流程设计、部署上线',
    cycle: '{待补充：开发周期，例如 2 周}',
    accent: '#2563eb',
    tags: ['AI Powered', 'Solo Built', 'Workflow'],
    techStack: ['Vue', 'TypeScript', 'Tailwind CSS', '{待补充：AI/API}'],
    links: {
      live: '{待补充：Live Demo 链接}',
      github: '{待补充：GitHub 链接}',
    },
    media: {
      pattern: 'ai',
      alt: '{待补充：AI 工作流项目截图说明}',
    },
    overview: '这个项目用于解决 {待补充：具体场景} 中效率低、流程分散、结果难复用的问题。',
    problem:
      '我观察到目标用户在 {待补充：场景} 中经常需要反复整理信息、切换工具，并手动完成大量重复判断。',
    solution: '我把核心流程拆成输入、生成、校对、导出几个步骤，让用户可以在一个轻量界面中完成闭环。',
    features: [
      {
        title: '智能生成',
        description: '根据用户输入生成结构化结果。',
        value: '降低从空白开始的成本。',
      },
      {
        title: '结果编辑',
        description: '保留人工校对和二次修改空间。',
        value: '让 AI 输出更适合真实使用。',
      },
      {
        title: '一键导出',
        description: '把生成结果整理成可分享格式。',
        value: '减少复制粘贴和格式清理。',
      },
    ],
    architecture: [
      '前端使用 Vue 3 和 TypeScript 构建，组件按页面区块和复用 UI 拆分。',
      '样式使用 Tailwind CSS，优先保证响应式、可读性和移动端触控体验。',
      'AI 调用与业务逻辑计划收敛到独立服务层，方便后续替换模型或接入 RAG。',
      '部署目标为 Vercel / Cloudflare Pages / 自建服务中的一种，真实地址待补充。',
    ],
    highlights: [
      '从需求拆解到上线独立完成。',
      '支持真实用户通过公网访问，而不是停留在本地 Demo。',
      '围绕一个具体工作流设计，而不是只做聊天入口。',
    ],
    challenges: [
      {
        title: '让 AI 输出稳定可用',
        problem: '早期结果容易格式不一致，用户需要手动修正。',
        process: '通过更明确的结构约束、示例提示和前端校验降低不确定性。',
        result: '输出更接近可直接使用的状态。',
        learning: 'AI 产品不能只追求“能生成”，还要设计校对、修复和兜底路径。',
      },
    ],
    learnings: ['学会把模型能力包装成具体流程。', '更重视产品的错误状态和边界体验。'],
    nextSteps: ['补充真实用户反馈。', '整理 GitHub 文档。', '增加历史记录和模板能力。'],
  },
  {
    slug: 'web-toolkit',
    name: '{待补充：Web 工具项目名称}',
    summary: '一个面向 {待补充：目标用户} 的 Web 工具，用更少步骤完成 {待补充：任务}。',
    category: 'Web 工具',
    status: 'live',
    order: 20,
    featured: true,
    hasDetail: true,
    role: '产品设计、前端开发、后端接口、部署上线',
    cycle: '{待补充：开发周期}',
    accent: '#059669',
    tags: ['Web Tool', 'Responsive', 'Product'],
    techStack: ['Vue', 'TypeScript', 'Tailwind CSS', '{待补充：后端/数据库}'],
    links: {
      live: '{待补充：Live Demo 链接}',
    },
    media: {
      pattern: 'tool',
      alt: '{待补充：Web 工具截图说明}',
    },
    overview: '这是一个轻量 Web 工具，目标是把 {待补充：复杂流程} 简化成清晰、低摩擦的使用路径。',
    problem: '现有方案在 {待补充：痛点 1}、{待补充：痛点 2} 和移动端体验上不够理想。',
    solution: '我用聚焦单任务的产品结构，把核心功能放在首屏，并减少无关配置。',
    features: [
      {
        title: '快速输入',
        description: '把最常用字段前置。',
        value: '用户打开页面就能开始操作。',
      },
      {
        title: '实时反馈',
        description: '操作过程中即时展示状态和结果。',
        value: '降低试错成本。',
      },
      {
        title: '移动端适配',
        description: '针对手机端按钮尺寸、布局和阅读节奏做优化。',
        value: '用户可以随时打开体验。',
      },
    ],
    architecture: [
      '页面采用数据驱动渲染，核心配置集中在独立数据文件。',
      '交互状态尽量保持局部化，避免过早引入复杂全局状态。',
      '响应式布局覆盖手机、平板和桌面。',
    ],
    highlights: ['围绕真实任务压缩操作步骤。', '界面和功能一起迭代。', '上线后可以继续收集使用反馈。'],
    challenges: [
      {
        title: '在简洁和完整之间取舍',
        problem: '功能越加越多后，页面会变得像后台表单。',
        process: '把高频路径放在主流程，低频配置收进次级区域。',
        result: '用户首次打开时不会被选项淹没。',
        learning: '产品设计很多时候是决定先不展示什么。',
      },
    ],
    learnings: ['更理解轻量工具的首屏效率。', '移动端不是缩小桌面端，而是重排任务路径。'],
    nextSteps: ['补充更多使用场景。', '增加示例模板。', '完善可访问性检查。'],
  },
  {
    slug: 'productivity-system',
    name: '{待补充：效率系统项目名称}',
    summary: '一个用于 {待补充：效率场景} 的效率软件 / SaaS 原型。',
    category: '效率软件',
    status: 'in-progress',
    order: 30,
    featured: true,
    hasDetail: true,
    role: '产品规划、前端开发、数据结构设计、部署上线',
    cycle: '{待补充：开发周期}',
    accent: '#d97706',
    tags: ['Productivity', 'SaaS Prototype', 'Iterating'],
    techStack: ['Vue', 'TypeScript', 'Tailwind CSS', '{待补充：数据库/云服务}'],
    links: {
      live: '{待补充：Live Demo 链接}',
      docs: '{待补充：文档链接}',
    },
    media: {
      pattern: 'flow',
      alt: '{待补充：效率系统截图说明}',
    },
    overview: '这个项目尝试把 {待补充：工作流} 变成一个可持续使用的效率系统。',
    problem: '用户经常在多个工具之间切换，信息分散，复盘和追踪成本高。',
    solution: '我设计了一个围绕任务状态、记录和复盘的统一界面，让用户更容易持续使用。',
    features: [
      {
        title: '任务视图',
        description: '按照状态组织当前事项。',
        value: '快速知道下一步该做什么。',
      },
      {
        title: '记录沉淀',
        description: '把过程信息留在同一个上下文。',
        value: '减少遗忘和重复沟通。',
      },
      {
        title: '复盘入口',
        description: '定期整理结果、问题和下一步。',
        value: '让工具不仅服务执行，也服务成长。',
      },
    ],
    architecture: [
      '核心数据模型围绕任务、状态、记录和标签展开。',
      '前端组件按列表、详情、编辑器和状态提示拆分。',
      '后续可以接入 Supabase / PostgreSQL 做鉴权与数据持久化。',
    ],
    highlights: ['从个人真实需求出发。', '兼顾产品流程和数据结构。', '有明确的长期迭代方向。'],
    challenges: [
      {
        title: '定义最小可用功能',
        problem: '效率工具容易陷入“什么都想管”的复杂度。',
        process: '先围绕一个高频闭环做 MVP，再根据使用反馈扩展。',
        result: '项目能更快上线，而不是停在规划文档里。',
        learning: 'MVP 的价值在于验证行为，不是堆功能。',
      },
    ],
    learnings: ['学会用数据结构反推产品边界。', '更重视长期使用时的低摩擦体验。'],
    nextSteps: ['接入持久化存储。', '增加提醒和归档。', '补充公开路线图。'],
  },
  {
    slug: 'interactive-lab',
    name: '{待补充：交互实验项目名称}',
    summary: '一个强调交互体验和创意表达的网页产品 / 实验项目。',
    category: '交互实验',
    status: 'experimental',
    order: 40,
    featured: false,
    hasDetail: true,
    role: '交互设计、前端开发、动效实现、部署上线',
    cycle: '{待补充：开发周期}',
    accent: '#e11d48',
    tags: ['Interactive', 'Creative Coding', 'Animation'],
    techStack: ['Vue', 'TypeScript', 'CSS Animation', '{待补充：其他技术}'],
    links: {
      live: '{待补充：Live Demo 链接}',
      article: '{待补充：复盘文章链接}',
    },
    media: {
      pattern: 'canvas',
      alt: '{待补充：交互实验截图说明}',
    },
    overview: '这个项目用交互和视觉表达探索 {待补充：主题}，重点是让用户在浏览中产生参与感。',
    problem: '普通静态页面很难让用户理解 {待补充：主题/内容} 的动态关系。',
    solution: '我把内容拆成可操作、可反馈的交互单元，用轻量动效增强理解。',
    features: [
      {
        title: '即时交互',
        description: '用户操作后立即看到反馈。',
        value: '提升探索感和记忆点。',
      },
      {
        title: '分层叙事',
        description: '用不同模块逐步展示信息。',
        value: '降低理解复杂概念的门槛。',
      },
      {
        title: '性能控制',
        description: '动效主要使用 transform 和 opacity。',
        value: '兼顾视觉和加载速度。',
      },
    ],
    architecture: [
      '交互逻辑保持组件内聚，避免视觉实验污染基础页面结构。',
      '动效遵守 prefers-reduced-motion，保证可访问性。',
      '核心视觉使用 CSS 和轻量组件完成，减少资源体积。',
    ],
    highlights: ['有个人表达和记忆点。', '动效服务内容理解。', '手机端仍保持可读和可操作。'],
    challenges: [
      {
        title: '控制动效强度',
        problem: '早期动画过多，反而影响阅读。',
        process: '保留页面进入、hover 和局部反馈，把装饰性动画降到最低。',
        result: '页面更稳、更清楚。',
        learning: '好的动效应该让内容更容易被理解，而不是抢走注意力。',
      },
    ],
    learnings: ['交互设计要先服务信息层级。', '性能和审美需要一起考虑。'],
    nextSteps: ['补充真实截图或演示视频。', '整理交互设计复盘。', '增加更多可分享场景。'],
  },
  {
    slug: 'tiny-dev-utility',
    name: '{待补充：轻量开发者工具名称}',
    summary: '一个解决开发过程中某个高频小问题的轻量工具。',
    category: '开发者工具',
    status: 'live',
    order: 50,
    featured: false,
    hasDetail: false,
    accent: '#7c3aed',
    tags: ['Developer Tool', 'Utility'],
    techStack: ['TypeScript', 'Vue'],
    links: {
      live: '{待补充：Live Demo 链接}',
    },
    media: {
      pattern: 'tool',
      alt: '{待补充：开发者工具截图说明}',
    },
  },
  {
    slug: 'old-prototype',
    name: '{待补充：早期原型项目名称}',
    summary: '一个早期探索原型，保留作为阶段性记录。',
    category: '原型探索',
    status: 'paused',
    order: 90,
    featured: false,
    hasDetail: false,
    accent: '#64748b',
    tags: ['Prototype', 'Paused'],
    techStack: ['Vue', '{待补充：其他技术}'],
    media: {
      pattern: 'flow',
      alt: '{待补充：早期原型截图说明}',
    },
  },
]

export const visibleProjects = projects
  .filter((project) => !project.draft && !project.archived)
  .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))

export const featuredProjects = visibleProjects.filter((project) => project.featured)

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
    period: 'Now',
    title: '持续构建个人项目系统',
    description: '把新的想法、实验、工具和复盘沉淀到同一个长期维护的个人主页中。',
    tags: ['Now', 'Portfolio', 'Iteration'],
  },
  {
    period: '2025.04 - 2025.05',
    title: '整理项目数据和案例复盘',
    description: '把项目从“能访问”推进到“能讲清楚为什么做、怎么做、遇到什么挑战”。',
    tags: ['Case Study', 'Writing'],
  },
  {
    period: '2025.03',
    title: '开始系统尝试 AI 应用开发',
    description: '把 AI 能力嵌入真实工作流，重点关注输出稳定性、用户校对和结果复用。',
    tags: ['AI App', 'Workflow'],
  },
  {
    period: '2025.01 - 2025.02',
    title: '完成早期公网项目 MVP',
    description: '从一个具体问题出发，完成需求拆解、前端实现、部署上线和初步优化。',
    tags: ['MVP', 'Deploy', 'Solo Built'],
  },
]
