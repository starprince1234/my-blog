<script setup lang="ts">
import { ArrowDown, GitBranch as Github, Mail, Rocket } from '@lucide/vue'
import { profile, stats } from '../data/site'
</script>

<template>
  <section id="home" class="relative isolate overflow-hidden bg-[#fafafa] pt-28 sm:pt-32">
    <div class="hero-grid" aria-hidden="true" />
    <div class="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-12 px-4 pb-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
      <div class="reveal">
        <p class="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-700 shadow-sm">
          <Rocket class="size-4 text-blue-700" aria-hidden="true" />
          starprince 的个人主页
        </p>

        <h1 class="mt-7 max-w-4xl text-5xl font-semibold tracking-normal text-zinc-950 sm:text-6xl lg:text-7xl">
          你好，我是
          <span class="text-blue-700">{{ profile.name }}</span>
        </h1>

        <p class="mt-6 text-xl font-medium leading-8 text-zinc-800 sm:text-2xl">
          {{ profile.role }}
        </p>
        <p class="mt-5 max-w-2xl text-base leading-8 text-zinc-600 sm:text-lg">
          {{ profile.oneLine }}
        </p>

        <div class="mt-6 flex flex-wrap gap-2">
          <span v-for="item in profile.focus" :key="item" class="rounded-md bg-white px-3 py-2 text-sm font-medium text-zinc-700 shadow-sm ring-1 ring-zinc-200">
            {{ item }}
          </span>
        </div>

        <div class="mt-9 flex flex-col gap-3 sm:flex-row">
          <RouterLink class="btn-primary" to="/#projects">
            查看精选项目
            <ArrowDown class="size-4" aria-hidden="true" />
          </RouterLink>
          <RouterLink class="btn-secondary" to="/projects">
            全部项目
            <ArrowDown class="size-4" aria-hidden="true" />
          </RouterLink>
          <a class="btn-secondary" :href="profile.github" target="_blank" rel="noreferrer">
            <Github class="size-4" aria-hidden="true" />
            访问 GitHub
          </a>
          <a class="btn-secondary" :href="`mailto:${profile.email}`">
            <Mail class="size-4" aria-hidden="true" />
            联系我
          </a>
        </div>
      </div>

      <div class="reveal delay-100">
        <div class="hero-panel">
          <div class="hero-panel-header">
            <span />
            <span />
            <span />
          </div>
          <div class="space-y-5 p-5 sm:p-6">
            <div class="rounded-lg bg-zinc-950 p-5 text-white">
              <p class="text-sm text-blue-200">Build loop</p>
              <div class="mt-5 grid grid-cols-2 gap-3">
                <div class="rounded-lg bg-white/10 p-4">
                  <p class="text-2xl font-semibold">Idea</p>
                  <p class="mt-2 text-sm leading-6 text-zinc-300">从真实问题出发</p>
                </div>
                <div class="rounded-lg bg-white/10 p-4">
                  <p class="text-2xl font-semibold">MVP</p>
                  <p class="mt-2 text-sm leading-6 text-zinc-300">快速验证路径</p>
                </div>
                <div class="rounded-lg bg-white/10 p-4">
                  <p class="text-2xl font-semibold">Ship</p>
                  <p class="mt-2 text-sm leading-6 text-zinc-300">部署到公网</p>
                </div>
                <div class="rounded-lg bg-white/10 p-4">
                  <p class="text-2xl font-semibold">Iterate</p>
                  <p class="mt-2 text-sm leading-6 text-zinc-300">根据反馈迭代</p>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-3">
              <div v-for="stat in stats" :key="stat.label" class="rounded-lg border border-zinc-200 bg-white p-4">
                <p class="text-2xl font-semibold text-zinc-950">{{ stat.value }}</p>
                <p class="mt-2 text-xs leading-5 text-zinc-500">{{ stat.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
