export type ProjectStatus = 'live' | 'in-progress' | 'paused' | 'experimental' | 'archived'
export type ProjectMediaPattern = 'ai' | 'tool' | 'flow' | 'canvas'

export interface ProjectLink {
  live?: string
  github?: string
  docs?: string
  article?: string
}

export interface ProjectMedia {
  image?: string
  alt?: string
  pattern?: ProjectMediaPattern
}

export interface ProjectFeature {
  title: string
  description: string
  value?: string
}

export interface ProjectChallenge {
  title: string
  problem: string
  process: string
  result: string
  learning: string
}

export interface Project {
  slug: string
  name: string
  summary: string
  category: string
  status: ProjectStatus
  order?: number
  featured?: boolean
  draft?: boolean
  archived?: boolean
  hasDetail?: boolean
  role?: string
  cycle?: string
  accent?: string
  tags?: string[]
  techStack?: string[]
  links?: ProjectLink
  media?: ProjectMedia
  overview?: string
  problem?: string
  solution?: string
  features?: ProjectFeature[]
  architecture?: string[]
  highlights?: string[]
  challenges?: ProjectChallenge[]
  learnings?: string[]
  nextSteps?: string[]
}

export interface SkillGroup {
  title: string
  description: string
  items: {
    name: string
    usedIn: string
  }[]
}

export interface TimelineItem {
  period: string
  title: string
  description: string
  tags: string[]
}

export type TechCardDifficulty = '入门' | '进阶' | '高级' | '生产级'

export interface TechContentBlock {
  title: string
  body?: string
  items?: string[]
}

export interface TechDomainRoute {
  domain: string
  role: string
}

export interface TechArchitectureNode {
  name: string
  role: string
  tools: string[]
}

export interface TechCard {
  id: string
  title: string
  subtitle?: string
  description: string
  category: string
  tags: string[]
  difficulty?: TechCardDifficulty
  readTime?: string
  date?: string
  slug: string
  featured?: boolean
  highlights?: string[]
  stack?: string[]
  architecture?: TechArchitectureNode[]
  routes?: TechDomainRoute[]
  content?: {
    scenario: string
    goals: string[]
    sections: TechContentBlock[]
    deploymentFlow: string[]
    expansion: string[]
    notes?: string[]
  }
}
