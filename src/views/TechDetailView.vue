<script setup lang="ts">
import { ArrowLeft, CalendarDays, CheckCircle2, Clock, GitBranch, Route } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '../components/EmptyState.vue'
import { techCards } from '../data/techCards'

const route = useRoute()
const card = computed(() => techCards.find((item) => item.slug === route.params.slug))
</script>

<template>
  <section v-if="card" class="bg-[#fafafa] pt-24">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <RouterLink class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950" to="/tech">
        <ArrowLeft class="size-4" aria-hidden="true" />
        返回工程图谱
      </RouterLink>

      <div class="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <article class="min-w-0">
          <header class="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <div class="bg-gradient-to-br from-zinc-950 via-zinc-900 to-blue-950 p-6 text-white sm:p-8">
              <div class="flex flex-wrap gap-2">
                <span class="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-blue-50 ring-1 ring-white/16">{{ card.category }}</span>
                <span v-if="card.difficulty" class="rounded-full bg-blue-400/18 px-3 py-1 text-xs font-semibold text-blue-50 ring-1 ring-blue-200/20">{{ card.difficulty }}</span>
              </div>
              <h1 class="mt-6 text-4xl font-semibold tracking-normal text-white sm:text-5xl">{{ card.title }}</h1>
              <p v-if="card.subtitle" class="mt-4 text-lg leading-8 text-blue-100">{{ card.subtitle }}</p>
            </div>
            <div class="p-6 sm:p-8">
              <p class="text-lg leading-8 text-zinc-600">{{ card.description }}</p>
              <div class="mt-5 flex flex-wrap gap-2">
                <span v-for="tag in card.tags" :key="tag" class="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                  {{ tag }}
                </span>
              </div>
            </div>
          </header>

          <div v-if="card.content" class="case-content">
            <section>
              <h2>适用场景</h2>
              <p>{{ card.content.scenario }}</p>
            </section>

            <section>
              <h2>架构目标</h2>
              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <div v-for="goal in card.content.goals" :key="goal" class="flex gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4">
                  <CheckCircle2 class="mt-0.5 size-5 shrink-0 text-blue-700" aria-hidden="true" />
                  <span class="text-sm font-semibold leading-6 text-zinc-800">{{ goal }}</span>
                </div>
              </div>
            </section>

            <section v-if="card.architecture?.length">
              <h2>架构拆分</h2>
              <div class="mt-4 grid gap-4 md:grid-cols-2">
                <div v-for="node in card.architecture" :key="node.name" class="rounded-lg border border-zinc-200 bg-white p-5">
                  <h3>{{ node.name }}</h3>
                  <p>{{ node.role }}</p>
                  <div class="mt-4 flex flex-wrap gap-2">
                    <span v-for="tool in node.tools" :key="tool" class="rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                      {{ tool }}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            <section v-if="card.routes?.length">
              <h2>推荐域名分工</h2>
              <div class="mt-4 grid gap-3">
                <div v-for="item in card.routes" :key="item.domain" class="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                  <code class="rounded-md bg-zinc-100 px-2.5 py-1 text-sm font-semibold text-zinc-900">{{ item.domain }}</code>
                  <span class="text-sm leading-6 text-zinc-600">{{ item.role }}</span>
                </div>
              </div>
            </section>

            <section v-for="section in card.content.sections" :key="section.title">
              <h2>{{ section.title }}</h2>
              <p v-if="section.body">{{ section.body }}</p>
              <ul v-if="section.items?.length">
                <li v-for="item in section.items" :key="item">{{ item }}</li>
              </ul>
            </section>

            <section>
              <h2>架构落地路径</h2>
              <ol class="mt-4 space-y-3">
                <li v-for="(step, index) in card.content.deploymentFlow" :key="step" class="flex gap-3 text-zinc-700">
                  <span class="grid size-7 shrink-0 place-items-center rounded-full bg-zinc-950 text-xs font-bold text-white">{{ index + 1 }}</span>
                  <span class="leading-7">{{ step }}</span>
                </li>
              </ol>
            </section>

            <section>
              <h2>后续扩展</h2>
              <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="item in card.content.expansion" :key="item" class="rounded-md bg-zinc-100 px-2.5 py-1 text-sm font-semibold text-zinc-700">
                  {{ item }}
                </span>
              </div>
            </section>

            <section v-if="card.content.notes?.length">
              <h2>注意事项</h2>
              <ul>
                <li v-for="item in card.content.notes" :key="item">{{ item }}</li>
              </ul>
            </section>
          </div>

          <EmptyState v-else class="mt-6" title="详情内容整理中" description="这张技术卡片暂时只有摘要，后续会补充完整结构化内容。" />
        </article>

        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div class="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-zinc-950">卡片信息</h2>
            <dl class="mt-5 space-y-4 text-sm">
              <div>
                <dt class="font-semibold text-zinc-500">分类</dt>
                <dd class="mt-1 text-zinc-900">{{ card.category }}</dd>
              </div>
              <div v-if="card.date">
                <dt class="font-semibold text-zinc-500">整理日期</dt>
                <dd class="mt-1 inline-flex items-center gap-2 text-zinc-900">
                  <CalendarDays class="size-4 text-zinc-500" aria-hidden="true" />
                  {{ card.date }}
                </dd>
              </div>
              <div v-if="card.readTime">
                <dt class="font-semibold text-zinc-500">阅读时间</dt>
                <dd class="mt-1 inline-flex items-center gap-2 text-zinc-900">
                  <Clock class="size-4 text-zinc-500" aria-hidden="true" />
                  {{ card.readTime }}
                </dd>
              </div>
              <div v-if="card.stack?.length">
                <dt class="font-semibold text-zinc-500">涉及工具链</dt>
                <dd class="mt-2 flex flex-wrap gap-2">
                  <span v-for="tool in card.stack" :key="tool" class="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {{ tool }}
                  </span>
                </dd>
              </div>
            </dl>

            <div class="mt-6 grid gap-3 border-t border-zinc-100 pt-5 text-sm text-zinc-600">
              <p class="inline-flex items-center gap-2">
                <GitBranch class="size-4 text-blue-700" aria-hidden="true" />
                前端主站与后端服务解耦
              </p>
              <p class="inline-flex items-center gap-2">
                <Route class="size-4 text-blue-700" aria-hidden="true" />
                主域名和子域名职责分离
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section v-else class="mx-auto max-w-3xl px-4 py-32 text-center">
    <h1 class="text-3xl font-semibold text-zinc-950">没有找到这张技术卡片</h1>
    <p class="mt-4 text-zinc-600">请回到工程图谱选择一个可用条目。</p>
    <RouterLink class="btn-primary mt-8" to="/tech">返回工程图谱</RouterLink>
  </section>
</template>
