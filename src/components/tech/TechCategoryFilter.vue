<script setup lang="ts">
import { Search, X } from '@lucide/vue'
import type { TechCardDifficulty } from '../../types'

defineProps<{
  categories: string[]
  tags: string[]
  difficulties: TechCardDifficulty[]
  resultCount: number
  activeFilterCount: number
}>()

const searchQuery = defineModel<string>('searchQuery', { required: true })
const activeCategory = defineModel<string>('activeCategory', { required: true })
const activeTag = defineModel<string>('activeTag', { required: true })
const activeDifficulty = defineModel<TechCardDifficulty | '全部'>('activeDifficulty', { required: true })

const emit = defineEmits<{
  reset: []
}>()
</script>

<template>
  <section class="rounded-lg border border-zinc-200 bg-white p-4 shadow-sm sm:p-5" aria-label="技术卡片筛选">
    <div class="relative">
      <Search class="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-zinc-400" aria-hidden="true" />
      <input
        v-model="searchQuery"
        class="min-h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 px-10 text-base text-zinc-950 outline-none transition placeholder:text-zinc-400 focus:border-blue-400 focus:bg-white focus:ring-4 focus:ring-blue-100"
        type="search"
        placeholder="搜索架构、工具、标签..."
      />
      <button
        v-if="searchQuery"
        class="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
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
          <option v-for="category in categories" :key="category">{{ category }}</option>
        </select>
      </label>

      <label class="grid gap-2 text-sm font-semibold text-zinc-700">
        标签
        <select v-model="activeTag" class="filter-select">
          <option>全部</option>
          <option v-for="tag in tags" :key="tag">{{ tag }}</option>
        </select>
      </label>

      <label class="grid gap-2 text-sm font-semibold text-zinc-700">
        难度
        <select v-model="activeDifficulty" class="filter-select">
          <option>全部</option>
          <option v-for="difficulty in difficulties" :key="difficulty">{{ difficulty }}</option>
        </select>
      </label>
    </div>

    <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p class="text-sm text-zinc-600">
        共 {{ resultCount }} 张卡片<span v-if="activeFilterCount">，已应用 {{ activeFilterCount }} 个筛选条件</span>
      </p>
      <button
        v-if="activeFilterCount"
        class="inline-flex min-h-10 items-center justify-center rounded-lg border border-zinc-200 px-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        type="button"
        @click="emit('reset')"
      >
        清除筛选
      </button>
    </div>
  </section>
</template>
