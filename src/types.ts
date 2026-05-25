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
