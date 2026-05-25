<script setup lang="ts">
import { ArrowUpRight, GitBranch as Github } from '@lucide/vue'
import { computed } from 'vue'
import type { Project } from '../types'
import { statusLabels } from '../data/site'
import ProjectVisual from './ProjectVisual.vue'

const props = defineProps<{
  project: Project
}>()

const tags = computed(() => props.project.tags ?? [])
const techStack = computed(() => props.project.techStack ?? [])
const hasDetail = computed(() => props.project.hasDetail !== false)
const statusLabel = computed(() => statusLabels[props.project.status])
</script>

<template>
  <article class="group overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
    <ProjectVisual :project="project" />

    <div class="p-5 sm:p-6">
      <div class="flex flex-wrap items-center gap-2">
        <span class="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{{ statusLabel }}</span>
        <span class="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600">{{ project.category }}</span>
      </div>

      <h3 class="mt-5 text-xl font-semibold text-zinc-950">{{ project.name }}</h3>
      <p class="mt-3 min-h-20 text-sm leading-7 text-zinc-600">{{ project.summary }}</p>

      <div class="mt-4 flex flex-wrap gap-2">
        <span v-for="tag in tags" :key="tag" class="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          {{ tag }}
        </span>
      </div>

      <div v-if="techStack.length" class="mt-5 border-t border-zinc-100 pt-5">
        <p class="text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Tech Stack</p>
        <p class="mt-2 text-sm leading-7 text-zinc-700">{{ techStack.join(' / ') }}</p>
      </div>

      <div class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <RouterLink
          v-if="hasDetail"
          class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:col-span-1"
          :to="`/projects/${project.slug}`"
        >
          详情
          <ArrowUpRight class="size-4" aria-hidden="true" />
        </RouterLink>
        <a
          v-if="project.links?.live"
          class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          :href="project.links.live"
          target="_blank"
          rel="noreferrer"
        >
          Live
          <ArrowUpRight class="size-4" aria-hidden="true" />
        </a>
        <a
          v-if="project.links?.github"
          class="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          :href="project.links.github"
          target="_blank"
          rel="noreferrer"
        >
          <Github class="size-4" aria-hidden="true" />
          GitHub
        </a>
        <span
          v-if="!hasDetail && !project.links?.live && !project.links?.github"
          class="inline-flex min-h-11 items-center justify-center rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-500 sm:col-span-3"
        >
          整理中
        </span>
      </div>
    </div>
  </article>
</template>
