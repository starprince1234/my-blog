<script setup lang="ts">
import { ArrowUpRight, CalendarDays, Clock, Layers3, Sparkles } from '@lucide/vue'
import type { TechCard } from '../../types'

defineProps<{
  card: TechCard
}>()
</script>

<template>
  <article class="group flex h-full flex-col overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
    <div class="border-b border-zinc-100 bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950 p-5 text-white">
      <div class="flex items-start justify-between gap-4">
        <div class="flex flex-wrap gap-2">
          <span class="inline-flex min-h-7 items-center rounded-full bg-white/12 px-3 text-xs font-semibold text-blue-50 ring-1 ring-white/16">
            {{ card.category }}
          </span>
          <span v-if="card.featured" class="inline-flex min-h-7 items-center gap-1 rounded-full bg-blue-400/18 px-3 text-xs font-semibold text-blue-50 ring-1 ring-blue-200/20">
            <Sparkles class="size-3.5" aria-hidden="true" />
            精选
          </span>
        </div>
        <Layers3 class="size-5 shrink-0 text-blue-200" aria-hidden="true" />
      </div>

      <h2 class="mt-6 text-2xl font-semibold tracking-normal text-white">{{ card.title }}</h2>
      <p v-if="card.subtitle" class="mt-3 text-sm leading-6 text-blue-100">{{ card.subtitle }}</p>
    </div>

    <div class="flex flex-1 flex-col p-5 sm:p-6">
      <p class="text-sm leading-7 text-zinc-600">{{ card.description }}</p>

      <div v-if="card.highlights?.length" class="mt-5 space-y-3">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Key Takeaways</p>
        <ul class="space-y-2">
          <li v-for="item in card.highlights.slice(0, 3)" :key="item" class="flex gap-2 text-sm leading-6 text-zinc-700">
            <span class="mt-2 size-1.5 shrink-0 rounded-full bg-blue-600" aria-hidden="true"></span>
            <span>{{ item }}</span>
          </li>
        </ul>
      </div>

      <div class="mt-5 flex flex-wrap gap-2">
        <span v-for="tag in card.tags" :key="tag" class="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          {{ tag }}
        </span>
      </div>

      <div class="mt-auto pt-6">
        <div class="flex flex-wrap gap-x-4 gap-y-2 border-t border-zinc-100 pt-5 text-xs font-medium text-zinc-500">
          <span v-if="card.difficulty" class="text-blue-700">{{ card.difficulty }}</span>
          <span v-if="card.readTime" class="inline-flex items-center gap-1.5">
            <Clock class="size-3.5" aria-hidden="true" />
            {{ card.readTime }}
          </span>
          <span v-if="card.date" class="inline-flex items-center gap-1.5">
            <CalendarDays class="size-3.5" aria-hidden="true" />
            {{ card.date }}
          </span>
        </div>

        <RouterLink
          class="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          :to="`/tech/${card.slug}`"
        >
          阅读详情
          <ArrowUpRight class="size-4" aria-hidden="true" />
        </RouterLink>
      </div>
    </div>
  </article>
</template>
