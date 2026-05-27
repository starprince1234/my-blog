<script setup lang="ts">
import { GitBranch as Github, Mail, MessageCircle } from '@lucide/vue'
import { profile } from '../data/site'
import SectionShell from './SectionShell.vue'
</script>

<template>
  <SectionShell
    id="contact"
    eyebrow="Contact"
    title="如果你想快速了解我，先看项目，再来聊天。"
    description="这里保留邮箱、GitHub 和社交媒体入口。"
  >
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
  </SectionShell>
</template>
