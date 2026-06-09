<script setup lang="ts">
import { computed, ref } from 'vue'
import EmptyState from '../components/EmptyState.vue'
import TechCategoryFilter from '../components/tech/TechCategoryFilter.vue'
import TechCardGrid from '../components/tech/TechCardGrid.vue'
import { selectedTechColumnName, techCards, techCategories, techTags } from '../data/techCards'
import type { TechCardDifficulty } from '../types'

const searchQuery = ref('')
const activeCategory = ref('全部')
const activeTag = ref('全部')
const activeDifficulty = ref<TechCardDifficulty | '全部'>('全部')

const difficulties = computed<TechCardDifficulty[]>(() =>
  Array.from(new Set(techCards.map((card) => card.difficulty).filter(Boolean) as TechCardDifficulty[])),
)

const filteredCards = computed(() => {
  const query = searchQuery.value.trim().toLowerCase()

  return techCards
    .filter((card) => activeCategory.value === '全部' || card.category === activeCategory.value)
    .filter((card) => activeTag.value === '全部' || card.tags.includes(activeTag.value))
    .filter((card) => activeDifficulty.value === '全部' || card.difficulty === activeDifficulty.value)
    .filter((card) => {
      if (!query) return true

      const haystack = [
        card.title,
        card.subtitle,
        card.description,
        card.category,
        card.difficulty,
        ...(card.tags ?? []),
        ...(card.stack ?? []),
        ...(card.highlights ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      return haystack.includes(query)
    })
})

const activeFilterCount = computed(
  () =>
    Number(Boolean(searchQuery.value.trim())) +
    Number(activeCategory.value !== '全部') +
    Number(activeTag.value !== '全部') +
    Number(activeDifficulty.value !== '全部'),
)

function resetFilters() {
  searchQuery.value = ''
  activeCategory.value = '全部'
  activeTag.value = '全部'
  activeDifficulty.value = '全部'
}
</script>

<template>
  <section class="relative overflow-hidden bg-[#fafafa] pt-24">
    <div class="hero-grid" aria-hidden="true"></div>
    <div class="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div class="max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">Engineering Atlas</p>
        <h1 class="mt-3 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">{{ selectedTechColumnName }}</h1>
        <p class="mt-5 text-lg leading-8 text-zinc-600">
          这里沉淀独立开发中的架构判断、部署路径、工具链取舍和踩坑复盘。每张卡片都尽量从一次实践中提炼出可复用的工程方案。
        </p>
      </div>

      <div class="mt-10">
        <TechCategoryFilter
          v-model:search-query="searchQuery"
          v-model:active-category="activeCategory"
          v-model:active-tag="activeTag"
          v-model:active-difficulty="activeDifficulty"
          :categories="techCategories"
          :tags="techTags"
          :difficulties="difficulties"
          :result-count="filteredCards.length"
          :active-filter-count="activeFilterCount"
          @reset="resetFilters"
        />
      </div>

      <TechCardGrid v-if="filteredCards.length" class="mt-8" :cards="filteredCards" />
      <EmptyState
        v-else
        class="mt-8"
        title="没有找到匹配的技术卡片"
        description="可以换一个关键词，或者清除分类、标签和难度筛选后再看。"
      />
    </div>
  </section>
</template>
