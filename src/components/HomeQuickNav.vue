<script setup lang="ts">
import { ArrowUp, Circle, Layers3, Mail, MessageCircle, UserRound, Wrench } from '@lucide/vue'

const links = [
  { label: '顶部', href: '#home', icon: ArrowUp },
  { label: '关于我', href: '#about', icon: UserRound },
  { label: '精选项目', href: '#projects', icon: Layers3 },
  { label: '技术栈', href: '#skills', icon: Wrench },
  { label: '时间线', href: '#timeline', icon: Circle },
  { label: '联系', href: '#contact', icon: Mail },
  { label: '尾部', href: '#footer', icon: MessageCircle },
]
</script>

<template>
  <nav class="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 xl:block" aria-label="首页快捷跳转">
    <div class="rounded-lg border border-zinc-200 bg-white/90 p-2 shadow-sm backdrop-blur">
      <a
        v-for="link in links"
        :key="link.href"
        class="group flex min-h-11 items-center justify-center gap-2 rounded-lg px-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 2xl:justify-start"
        :href="link.href"
        :aria-label="link.label"
      >
        <component :is="link.icon" class="size-4 text-zinc-400 transition group-hover:text-blue-700" aria-hidden="true" />
        <span class="hidden 2xl:inline">{{ link.label }}</span>
      </a>
    </div>
  </nav>
</template>
