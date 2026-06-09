import type { TechCard } from '../types'

export const selectedTechColumnName = '工程图谱'

export const techCards: TechCard[] = [
  {
    id: 'indie-fullstack-hybrid-cloud',
    title: '独立开发者的混合云部署架构',
    subtitle: 'Vercel + Cloudflare + Doppler + VPS 的生产级上云方案',
    description:
      '将前端主站托管到全球 CDN，把后端 API、数据库和自建服务放到 VPS，通过 Cloudflare 统一域名解析、Doppler 管理密钥，形成高可用、低维护、可扩展的个人全栈部署架构。',
    category: '部署架构',
    tags: ['Vercel', 'Cloudflare', 'Doppler', 'VPS', 'Coolify', 'Docker', 'Umami'],
    difficulty: '生产级',
    readTime: '8 min',
    date: '2026-06-09',
    slug: 'indie-fullstack-hybrid-cloud',
    featured: true,
    highlights: [
      '前端主站与后端服务解耦，降低单点故障风险',
      'Cloudflare 统一承接 DNS、SSL、安全防护与子域名解析',
      'Doppler 管理密钥，避免敏感信息落入本地或 Git 仓库',
      'Vercel 与 GitHub 集成，实现前端 Push 即部署',
      'VPS 通过 Docker / Coolify 承载 API、数据库和自建服务',
    ],
    stack: ['Vue / React / Next.js', 'GitHub', 'Vercel', 'Cloudflare', 'Doppler', 'VPS', 'Docker', 'Coolify', 'Umami'],
    architecture: [
      {
        name: '前端主站',
        role: '承载博客、作品集、营销页和静态内容，优先走 CDN 与边缘节点。',
        tools: ['Vercel', 'Cloudflare Pages'],
      },
      {
        name: '域名与安全入口',
        role: '统一管理 DNS、SSL、CDN、安全防护和主域名 / 子域名解析。',
        tools: ['Cloudflare DNS', 'Cloudflare SSL', 'WAF'],
      },
      {
        name: '密钥管理',
        role: '把数据库连接串、API Key、统计脚本 ID 等配置托管到云端，并注入运行环境。',
        tools: ['Doppler', 'doppler run', 'Secret Sync'],
      },
      {
        name: '后端与自建服务',
        role: '承载 API、数据库、站点统计、后台服务和未来可扩展的内部工具。',
        tools: ['VPS', 'Docker', 'Coolify', 'Nginx / Caddy'],
      },
    ],
    routes: [
      { domain: 'example.com / www.example.com', role: '前端主站与个人品牌入口' },
      { domain: 'api.example.com', role: '后端 API 与业务接口' },
      { domain: 'analytics.example.com', role: 'Umami 等站点统计服务' },
      { domain: 'admin.example.com', role: '后台管理或内部工具，可按需启用' },
    ],
    content: {
      scenario:
        '适合个人博客、独立开发项目、小型全栈应用和作品集网站。它的目标不是把所有服务塞进一台服务器，而是把访问量最大的展示层、需要状态的后端层、以及敏感配置管理拆到各自更合适的位置。',
      goals: ['主站高可用', '前后端职责分离', '敏感信息安全管理', '后端服务可扩展', '部署流程自动化', '运维复杂度可控'],
      sections: [
        {
          title: '为什么不把前端和后端放在同一台服务器',
          body:
            '个人项目经常从一台 VPS 开始，但如果主站、API、数据库、统计服务都绑定在同一个运行环境里，服务器维护、内存异常或网络波动都会直接影响主站访问。更稳妥的做法是让前端主站保持静态化和边缘化，让 VPS 专注处理需要状态、数据库和后台能力的服务。',
          items: [
            '主站访问不依赖后端服务器是否在线，服务器维护时博客仍可访问。',
            '前端流量由 Vercel / Cloudflare Pages 和 CDN 承担，不消耗 VPS 带宽。',
            '后端 API 可以独立扩容、重启、迁移，不牵动主站部署。',
          ],
        },
        {
          title: 'Cloudflare 的角色',
          body:
            'Cloudflare 是这套架构的统一入口。域名从注册商购买后，可以把 DNS 托管切换到 Cloudflare，再由 Cloudflare 负责主域名、www、api、analytics 等记录的解析，同时提供 SSL、CDN 和基础安全防护。',
          items: [
            '主域名指向前端托管平台，子域名指向 VPS 或后端入口。',
            'SSL 与 CDN 由 Cloudflare 统一处理，减少各平台之间的证书配置成本。',
            '需要验证 Vercel 域名时，可以先使用 DNS Only，验证通过后再按实际情况开启代理。',
          ],
        },
        {
          title: 'Doppler 的角色',
          body:
            'Doppler 负责把密钥从代码仓库和本地文件中移走。开发时通过 doppler run 注入变量，线上通过集成同步到 Vercel 或 Cloudflare Pages。这样代码只读取环境变量名称，不接触真实密钥。',
          items: [
            '本地不创建真实 .env 文件，降低误提交和本机泄露风险。',
            '开发、测试、生产环境可以使用不同配置，避免生产密钥污染本地环境。',
            '新增环境变量时，只维护 example 骨架，并提醒开发者到 Doppler 控制台录入真实值。',
          ],
        },
        {
          title: 'Vercel、GitHub 与 Monorepo',
          body:
            '前端项目导入 Vercel 后，GitHub push 会自动触发构建和发布。若仓库是 Monorepo，需要在 Vercel 设置 Root Directory，例如 frontend，并让构建只关注前端目录。',
          items: [
            'GitHub 作为代码源，Vercel 作为前端构建和托管平台。',
            'push 到目标分支后自动构建，减少手动上传和服务器登录。',
            'Monorepo 场景下通过 Root Directory 隔离前端构建边界。',
          ],
        },
        {
          title: 'Docker / Coolify 与 VPS',
          body:
            'VPS 更适合承载后端 API、数据库和自建服务。Docker 让服务可复制、可迁移；Coolify 则进一步降低部署成本，提供 GitHub 绑定、Base Directory、Watch Paths、反向代理和证书申请等能力。',
          items: [
            '后端服务可以打包成镜像，通过子域名暴露给前端调用。',
            'Coolify 的 Base Directory 适合 Monorepo 后端目录，Watch Paths 可避免无关变动触发重构建。',
            'Umami、PostgreSQL、Redis 等自建服务可以作为独立服务运行在 VPS 上。',
          ],
        },
        {
          title: 'Umami 的价值',
          body:
            '个人博客的统计系统更关注轻量、隐私友好和可自主管理。Umami 可以自建在 VPS 上，脚本体积小，不依赖复杂 Cookie 同意流程，适合记录访问来源、页面浏览和基础事件。',
          items: ['轻量，不明显影响主站加载速度。', '隐私友好，适合个人站和作品集。', '可自建，数据掌握在自己的服务器和数据库里。'],
        },
      ],
      deploymentFlow: [
        '购买域名和 VPS，确认服务器所在区域、备案需求和安全组策略。',
        '将域名 DNS 托管切换到 Cloudflare，由 Cloudflare 管理主域名和子域名解析。',
        '在 Doppler 中建立项目，并区分 Development -> dev_personal 与 Production -> prd 配置。',
        '把 GitHub 仓库导入 Vercel；Monorepo 项目设置 Root Directory，只构建前端目录。',
        '在 Vercel 绑定 example.com / www.example.com，并按提示在 Cloudflare 配置 CNAME 或 A 记录。',
        '在 VPS 上部署 Docker / Coolify / Nginx / Caddy，后端服务通过 api.example.com 暴露。',
        '把 Umami、数据库和其他自建服务部署到 VPS，通过 analytics.example.com 等子域名访问。',
      ],
      expansion: ['评论系统', '点赞系统', '留言板', '后台 API', '数据库服务', '文章阅读统计', '自建工具服务'],
      notes: [
        '不要在本地创建真实 .env 文件，Docker Compose 也应通过 Doppler 注入到宿主进程的变量传递给容器。',
        'Cloudflare 通配符子域名可以降低重复 DNS 配置成本，但需要结合证书、代理状态和服务暴露策略谨慎使用。',
        'VPS 安全组建议只开放必要端口，其他服务通过反向代理统一收口。',
      ],
    },
  },
]

export const featuredTechCards = techCards.filter((card) => card.featured)

export const techCategories = Array.from(new Set(techCards.map((card) => card.category)))

export const techTags = Array.from(new Set(techCards.flatMap((card) => card.tags))).sort()
