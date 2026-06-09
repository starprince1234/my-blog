<script setup lang="ts">
import { Menu, X } from '@lucide/vue'
import { ref } from 'vue'

const isOpen = ref(false)

const links = [
  { label: '首页', href: '/' },
  { label: '全部项目', href: '/projects' },
  { label: '工程图谱', href: '/tech' },
]

function closeMenu() {
  isOpen.value = false
}
</script>

<template>
  <header class="fixed left-0 right-0 top-0 z-50 border-b border-zinc-200/80 bg-white/86 backdrop-blur-xl">
    <nav class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="主导航">
      <RouterLink class="group flex items-center gap-3 font-semibold text-zinc-950" to="/#home" @click="closeMenu">
        <span class="grid size-9 place-items-center rounded-lg bg-zinc-950 text-sm text-white shadow-sm">SP</span>
        <span class="hidden sm:inline">starprince</span>
      </RouterLink>

      <div class="hidden items-center gap-1 md:flex">
        <RouterLink
          v-for="link in links"
          :key="link.href"
          class="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          :to="link.href"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <button
        class="grid size-11 place-items-center rounded-lg text-zinc-800 transition hover:bg-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:hidden"
        type="button"
        :aria-expanded="isOpen"
        aria-label="打开或关闭导航"
        @click="isOpen = !isOpen"
      >
        <X v-if="isOpen" class="size-5" aria-hidden="true" />
        <Menu v-else class="size-5" aria-hidden="true" />
      </button>
    </nav>

    <div v-if="isOpen" class="border-t border-zinc-200 bg-white px-4 py-3 shadow-lg md:hidden">
      <RouterLink
        v-for="link in links"
        :key="link.href"
        class="block rounded-lg px-3 py-3 text-base font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
        :to="link.href"
        @click="closeMenu"
      >
        {{ link.label }}
      </RouterLink>
    </div>
  </header>
</template>
