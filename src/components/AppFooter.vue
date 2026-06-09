<script setup lang="ts">
import { GitBranch as Github, Mail } from '@lucide/vue'
import { profile } from '../data/site'
</script>

<template>
  <footer id="footer" class="border-t border-zinc-200 bg-white">
    <div class="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
      <div>
        <p class="text-sm font-semibold text-zinc-950">{{ profile.name }}</p>
        <p class="mt-1 max-w-xl text-sm leading-6 text-zinc-600">
          持续构建、持续复盘，把想法变成可访问、可使用、可维护的产品。
        </p>
      </div>

      <div class="flex items-center gap-3">
        <a
          class="inline-flex size-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          :href="profile.github"
          target="_blank"
          rel="noreferrer"
          aria-label="访问 GitHub"
        >
          <Github class="size-5" aria-hidden="true" />
        </a>
        <a
          class="inline-flex size-11 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          :href="`mailto:${profile.email}`"
          aria-label="发送邮件"
        >
          <Mail class="size-5" aria-hidden="true" />
        </a>
      </div>
    </div>
  </footer>
</template>
