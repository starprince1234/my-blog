<script setup lang="ts">
import type { TechCard } from '../../types'
import TechCardItem from './TechCard.vue'

defineProps<{
  cards: TechCard[]
}>()
</script>

<template>
  <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    <TechCardItem v-for="card in cards" :key="card.id" :card="card" />
  </div>
</template>
