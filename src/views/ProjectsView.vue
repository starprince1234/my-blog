<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import { computed, ref, watch } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import ProjectCard from '../components/ProjectCard.vue'
import { projectCategories, projects, projectTags, statusLabels } from '../data/site'
import type { ProjectStatus } from '../types'

const searchQuery = ref('')
const activeCategory = ref('全部')
const activeTag = ref('全部')
const activeStatus = ref<ProjectStatus | '全部'>('全部')
const visibleCount = ref(9)

const statusOptions = computed<ProjectStatus[]>(() =>
  Array.from(new Set(projects.filter((project) => !project.draft).map((project) => project.status))),
)

const filteredProjects = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return projects
    .filter((project) => !project.draft && !project.archived)
    .filter((project) => activeCategory.value === '全部' || project.category === activeCategory.value)
    .filter((project) => activeTag.value === '全部' || (project.tags ?? []).includes(activeTag.value))
    .filter((project) => activeStatus.value === '全部' || project.status === activeStatus.value)
    .filter((project) => {
      if (!query) return true

      const haystack = [
        project.name,
        project.summary,
        project.category,
        project.role,
        ...(project.tags ?? []),
        ...(project.techStack ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999))
})

const visibleProjects = computed(() => filteredProjects.value.slice(0, visibleCount.value))
const hasMore = computed(() => visibleCount.value < filteredProjects.value.length)
const activeFilterCount = computed(
  () =>
    Number(Boolean(searchQuery.value.trim())) +
    Number(activeCategory.value !== '全部') +
    Number(activeTag.value !== '全部') +
    Number(activeStatus.value !== '全部'),
)

watch([searchQuery, activeCategory, activeTag, activeStatus], () => {
  visibleCount.value = 9
})

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = '全部'
  activeTag.value = '全部'
  activeStatus.value = '全部'
}
</script>

<template>
  <section class="bg-[#fafafa] pt-24">
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">All Projects</p>
        <h1 class="mt-3 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">项目库</h1>
        <p class="mt-5 text-lg leading-8 text-zinc-600">
          这里会持续收纳我做过的产品、工具、实验和原型。不是每个项目都同样完整，有些有详细复盘，有些只是一个可访问的小工具。
        </p>
      </div>

      <div class="mt-10 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
        <div class="relative">
          <Search class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
          <input
            v-model="searchQuery"
            class="min-h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-10 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
            type="search"
            placeholder="搜索项目名称、标签、技术栈..."
          />
          <button
            v-if="searchQuery"
            class="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950"
            type="button"
            aria-label="清空搜索"
            @click="searchQuery = ''"
          >
            <X class="size-4" aria-hidden="true" />
          </button>
        </div>

        <div class="mt-5 grid gap-4 lg:grid-cols-3">
          <label class="grid gap-2 text-sm font-semibold text-zinc-700">
            分类
            <select v-model="activeCategory" class="filter-select">
              <option>全部</option>
              <option v-for="category in projectCategories" :key="category">{{ category }}</option>
            </select>
          </label>

          <label class="grid gap-2 text-sm font-semibold text-zinc-700">
            标签
            <select v-model="activeTag" class="filter-select">
              <option>全部</option>
              <option v-for="tag in projectTags" :key="tag">{{ tag }}</option>
            </select>
          </label>

          <label class="grid gap-2 text-sm font-semibold text-zinc-700">
            状态
            <select v-model="activeStatus" class="filter-select">
              <option>全部</option>
              <option v-for="status in statusOptions" :key="status" :value="status">
                {{ statusLabels[status] }}
              </option>
            </select>
          </label>
        </div>

        <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p class="text-sm text-zinc-600">
            共 {{ filteredProjects.length }} 个项目<span v-if="activeFilterCount">，已应用 {{ activeFilterCount }} 个筛选条件</span>
          </p>
          <button
            v-if="activeFilterCount"
            class="inline-flex min-h-10 items-center justify-center rounded-lg border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
            type="button"
            @click="resetFilters"
          >
            清除筛选
          </button>
        </div>
      </div>

      <div v-if="visibleProjects.length" class="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <ProjectCard v-for="project in visibleProjects" :key="project.slug" :project="project" />
      </div>
      <EmptyState
        v-else
        class="mt-8"
        title="没有找到匹配的项目"
        description="可以换一个关键词，或者清除分类、标签和状态筛选后再看。"
      />

      <div v-if="hasMore" class="mt-10 flex justify-center">
        <button class="btn-secondary" type="button" @click="visibleCount += 9">加载更多项目</button>
      </div>
    </div>
  </section>
</template>
