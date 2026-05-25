<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'
import { featuredProjects } from '../data/site'
import ProjectCard from './ProjectCard.vue'
import SectionShell from './SectionShell.vue'
</script>

<template>
  <SectionShell
    id="projects"
    eyebrow="Projects"
    title="精选项目，展示我最近最想被看到的作品。"
    description="首页只放一部分重点项目。更多工具、实验、原型和归档项目，会持续沉淀到完整项目库里。"
  >
    <div class="grid gap-6 md:grid-cols-2">
      <ProjectCard v-for="project in featuredProjects" :key="project.slug" :project="project" />
    </div>
    <div class="mt-8">
      <RouterLink class="btn-secondary" to="/projects">
        查看全部项目
        <ArrowUpRight class="size-4" aria-hidden="true" />
      </RouterLink>
    </div>
  </SectionShell>
</template>
