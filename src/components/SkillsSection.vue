<script setup lang="ts">
import { skillGroups } from '../data/site'
import SectionShell from './SectionShell.vue'
</script>

<template>
  <SectionShell
    id="skills"
    eyebrow="Skills"
    title="技术栈按项目使用场景组织，而不是简单堆名词。"
    description="这些技术不是写在简历上的关键词，而是被用来完成真实产品、原型和工具。"
  >
    <div class="grid gap-5 lg:grid-cols-2">
      <article v-for="group in skillGroups" :key="group.title" class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <h3 class="text-xl font-semibold text-zinc-950">{{ group.title }}</h3>
        <p class="mt-3 text-sm leading-7 text-zinc-600">{{ group.description }}</p>

        <div class="mt-6 space-y-3">
          <div v-for="item in group.items" :key="item.name" class="rounded-lg bg-zinc-50 p-4 ring-1 ring-zinc-100 transition hover:bg-blue-50 hover:ring-blue-100">
            <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <p class="font-semibold text-zinc-950">{{ item.name }}</p>
              <p class="max-w-md text-sm leading-6 text-zinc-600">{{ item.usedIn }}</p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </SectionShell>
</template>
