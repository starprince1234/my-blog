<script setup lang="ts">
import { timeline } from '../data/site'
import SectionShell from './SectionShell.vue'
</script>

<template>
  <SectionShell
    id="timeline"
    eyebrow="Now"
    title="我正在持续构建和整理。"
    description="这里记录当前状态、项目推进节奏和一些阶段性的学习节点。"
  >
    <div class="relative space-y-5">
      <div class="absolute bottom-0 left-4 top-0 hidden w-px bg-zinc-200 sm:block" aria-hidden="true" />
      <article v-for="item in timeline" :key="item.period" class="relative rounded-lg border border-zinc-200 bg-white p-5 shadow-sm sm:ml-12">
        <span class="absolute -left-[2.85rem] top-6 hidden size-4 rounded-full border-4 border-white bg-blue-600 shadow-sm sm:block" aria-hidden="true" />
        <p class="text-sm font-semibold text-blue-700">{{ item.period }}</p>
        <h3 class="mt-2 text-lg font-semibold text-zinc-950">{{ item.title }}</h3>
        <p class="mt-3 leading-7 text-zinc-600">{{ item.description }}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <span v-for="tag in item.tags" :key="tag" class="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
            {{ tag }}
          </span>
        </div>
      </article>
    </div>
  </SectionShell>
</template>
