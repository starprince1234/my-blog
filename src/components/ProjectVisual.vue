<script setup lang="ts">
import { computed } from 'vue'
import type { Project } from '../types'

const props = defineProps<{
  project: Project
}>()

const pattern = computed(() => props.project.media?.pattern ?? 'tool')
const image = computed(() => props.project.media?.image)
const accent = computed(() => props.project.accent ?? '#2563eb')
</script>

<template>
  <div class="project-visual" :style="{ '--accent': accent }">
    <div class="visual-window">
      <div class="visual-topbar">
        <span />
        <span />
        <span />
      </div>
      <div class="visual-body">
        <img v-if="image" class="visual-image" :src="image" :alt="project.media?.alt ?? `${project.name} 项目截图`" loading="lazy" />
        <template v-else-if="pattern === 'ai'">
          <div class="visual-orbit" />
          <div class="visual-card large" />
          <div class="visual-card small" />
          <div class="visual-line" />
        </template>
        <template v-else-if="pattern === 'tool'">
          <div class="visual-toolbar" />
          <div class="visual-grid">
            <span v-for="item in 9" :key="item" />
          </div>
        </template>
        <template v-else-if="pattern === 'flow'">
          <div class="visual-flow">
            <span v-for="item in 4" :key="item" />
          </div>
          <div class="visual-progress" />
        </template>
        <template v-else>
          <div class="visual-canvas">
            <span v-for="item in 5" :key="item" />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
