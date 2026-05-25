<script setup lang="ts">
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <a class="skip-link" href="#main">跳到主要内容</a>
  <AppHeader />
  <main id="main">
    <RouterView />
  </main>
  <AppFooter />
</template>
