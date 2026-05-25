<script setup lang="ts">
defineProps<{
  title: string
  description: string
}>()
</script>

<template>
  <div class="rounded-lg border border-dashed border-zinc-300 bg-white p-8 text-center">
    <h3 class="text-lg font-semibold text-zinc-950">{{ title }}</h3>
    <p class="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-600">{{ description }}</p>
  </div>
</template>
