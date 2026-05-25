<script setup lang="ts">
import { ArrowUpRight, GitBranch as Github, Mail, MessageCircle } from '@lucide/vue'
import { featuredProjects, profile, statusLabels } from '../data/site'
import SectionShell from './SectionShell.vue'
</script>

<template>
  <SectionShell
    id="contact"
    eyebrow="Contact"
    title="如果你想快速了解我，先看项目，再来聊天。"
    description="这里保留邮箱、GitHub、社交媒体和一些项目入口。隐私内容可以后续按需要替换。"
  >
    <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div class="rounded-lg bg-zinc-950 p-6 text-white shadow-sm">
        <h3 class="text-2xl font-semibold">联系我</h3>
        <p class="mt-4 leading-8 text-zinc-300">
          欢迎直接看项目，也欢迎交流 AI 产品、Web 工具、开发者效率和从 0 到 1 的想法。
        </p>

        <div class="mt-8 space-y-3">
          <a class="contact-link" :href="`mailto:${profile.email}`">
            <Mail class="size-5" aria-hidden="true" />
            {{ profile.email }}
          </a>
          <a class="contact-link" :href="profile.github" target="_blank" rel="noreferrer">
            <Github class="size-5" aria-hidden="true" />
            {{ profile.github }}
          </a>
          <a v-if="profile.social" class="contact-link" :href="profile.social" target="_blank" rel="noreferrer">
            <MessageCircle class="size-5" aria-hidden="true" />
            {{ profile.social }}
          </a>
        </div>
      </div>

      <div class="grid gap-3 sm:grid-cols-2">
        <a
          v-for="project in featuredProjects"
          :key="project.slug"
          class="group rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
          :href="project.links?.live ?? `/projects/${project.slug}`"
          target="_blank"
          rel="noreferrer"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-sm font-semibold text-zinc-950">{{ project.name }}</p>
              <p class="mt-2 text-sm leading-6 text-zinc-600">{{ project.category }} · {{ statusLabels[project.status] }}</p>
            </div>
            <ArrowUpRight class="size-5 shrink-0 text-zinc-400 transition group-hover:text-blue-700" aria-hidden="true" />
          </div>
        </a>
      </div>
    </div>
  </SectionShell>
</template>
