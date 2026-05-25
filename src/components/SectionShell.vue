<script setup lang="ts">
defineProps<{
  eyebrow: string
  title: string
  description?: string
}>()
</script>

<template>
  <section class="section-shell">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="mb-10 max-w-3xl">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">{{ eyebrow }}</p>
        <h2 class="mt-3 text-3xl font-semibold tracking-normal text-zinc-950 sm:text-4xl">{{ title }}</h2>
        <p v-if="description" class="mt-4 text-base leading-8 text-zinc-600 sm:text-lg">{{ description }}</p>
      </div>
      <slot />
    </div>
  </section>
</template>
