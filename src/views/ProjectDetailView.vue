<script setup lang="ts">
import { ArrowLeft, ArrowUpRight, BookOpen, FileText, GitBranch as Github } from '@lucide/vue'
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import EmptyState from '../components/EmptyState.vue'
import ProjectVisual from '../components/ProjectVisual.vue'
import { projects, statusLabels } from '../data/site'

const route = useRoute()
const project = computed(() => projects.find((item) => item.slug === route.params.slug && !item.draft))
const techStack = computed(() => project.value?.techStack ?? [])
const tags = computed(() => project.value?.tags ?? [])
const hasCaseStudy = computed(() => {
  const item = project.value
  if (!item) return false

  return Boolean(
    item.overview ||
      item.problem ||
      item.solution ||
      item.features?.length ||
      item.architecture?.length ||
      item.highlights?.length ||
      item.challenges?.length ||
      item.learnings?.length ||
      item.nextSteps?.length,
  )
})
</script>

<template>
  <section v-if="project" class="bg-[#fafafa] pt-24">
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <RouterLink class="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-950" to="/projects">
        <ArrowLeft class="size-4" aria-hidden="true" />
        返回项目库
      </RouterLink>

      <div class="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <article class="min-w-0">
          <div class="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <ProjectVisual :project="project" />
            <div class="p-6 sm:p-8">
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in tags" :key="tag" class="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                  {{ tag }}
                </span>
              </div>
              <h1 class="mt-5 text-4xl font-semibold tracking-normal text-zinc-950 sm:text-5xl">{{ project.name }}</h1>
              <p class="mt-5 text-lg leading-8 text-zinc-600">{{ project.summary }}</p>
            </div>
          </div>

          <div v-if="hasCaseStudy" class="case-content">
            <section v-if="project.overview">
              <h2>项目概览</h2>
              <p>{{ project.overview }}</p>
            </section>

            <section v-if="project.problem">
              <h2>为什么做这个项目？</h2>
              <p>{{ project.problem }}</p>
            </section>

            <section v-if="project.solution">
              <h2>解决方案</h2>
              <p>{{ project.solution }}</p>
            </section>

            <section v-if="project.features?.length">
              <h2>核心功能</h2>
              <div class="grid gap-4 md:grid-cols-3">
                <div v-for="feature in project.features" :key="feature.title" class="rounded-lg border border-zinc-200 bg-white p-5">
                  <h3>{{ feature.title }}</h3>
                  <p>{{ feature.description }}</p>
                  <p v-if="feature.value" class="mt-3 text-sm font-semibold text-blue-700">{{ feature.value }}</p>
                </div>
              </div>
            </section>

            <section v-if="project.architecture?.length">
              <h2>技术实现</h2>
              <ul>
                <li v-for="item in project.architecture" :key="item">{{ item }}</li>
              </ul>
            </section>

            <section v-if="project.highlights?.length">
              <h2>项目亮点</h2>
              <ul>
                <li v-for="item in project.highlights" :key="item">{{ item }}</li>
              </ul>
            </section>

            <section v-if="project.challenges?.length">
              <h2>遇到的挑战</h2>
              <div class="space-y-4">
                <div v-for="challenge in project.challenges" :key="challenge.title" class="rounded-lg border border-zinc-200 bg-white p-5">
                  <h3>{{ challenge.title }}</h3>
                  <p><strong>问题描述：</strong>{{ challenge.problem }}</p>
                  <p><strong>解决过程：</strong>{{ challenge.process }}</p>
                  <p><strong>最终结果：</strong>{{ challenge.result }}</p>
                  <p><strong>学到的东西：</strong>{{ challenge.learning }}</p>
                </div>
              </div>
            </section>

            <section v-if="project.learnings?.length">
              <h2>学到的东西</h2>
              <ul>
                <li v-for="item in project.learnings" :key="item">{{ item }}</li>
              </ul>
            </section>

            <section v-if="project.nextSteps?.length">
              <h2>未来计划</h2>
              <ul>
                <li v-for="item in project.nextSteps" :key="item">{{ item }}</li>
              </ul>
            </section>
          </div>

          <EmptyState
            v-else
            class="mt-6"
            title="这个项目暂时只有基础信息"
            description="有些轻量工具和实验项目不会单独写完整复盘。后续如果它继续迭代，我会补充背景、技术实现和复盘。"
          />
        </article>

        <aside class="lg:sticky lg:top-24 lg:self-start">
          <div class="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 class="text-lg font-semibold text-zinc-950">项目信息</h2>
            <dl class="mt-5 space-y-4 text-sm">
              <div>
                <dt class="font-semibold text-zinc-500">项目分类</dt>
                <dd class="mt-1 text-zinc-900">{{ project.category }}</dd>
              </div>
              <div>
                <dt class="font-semibold text-zinc-500">当前状态</dt>
                <dd class="mt-1 text-zinc-900">{{ statusLabels[project.status] }}</dd>
              </div>
              <div v-if="project.role">
                <dt class="font-semibold text-zinc-500">我的角色</dt>
                <dd class="mt-1 leading-6 text-zinc-900">{{ project.role }}</dd>
              </div>
              <div v-if="project.cycle">
                <dt class="font-semibold text-zinc-500">开发周期</dt>
                <dd class="mt-1 text-zinc-900">{{ project.cycle }}</dd>
              </div>
              <div v-if="techStack.length">
                <dt class="font-semibold text-zinc-500">技术栈</dt>
                <dd class="mt-2 flex flex-wrap gap-2">
                  <span v-for="tech in techStack" :key="tech" class="rounded-md bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
                    {{ tech }}
                  </span>
                </dd>
              </div>
            </dl>

            <div class="mt-6 grid gap-3">
              <a v-if="project.links?.live" class="btn-primary justify-center" :href="project.links.live" target="_blank" rel="noreferrer">
                Live Demo
                <ArrowUpRight class="size-4" aria-hidden="true" />
              </a>
              <a v-if="project.links?.github" class="btn-secondary justify-center" :href="project.links.github" target="_blank" rel="noreferrer">
                <Github class="size-4" aria-hidden="true" />
                GitHub
              </a>
              <a v-if="project.links?.docs" class="btn-secondary justify-center" :href="project.links.docs" target="_blank" rel="noreferrer">
                <BookOpen class="size-4" aria-hidden="true" />
                Docs
              </a>
              <a v-if="project.links?.article" class="btn-secondary justify-center" :href="project.links.article" target="_blank" rel="noreferrer">
                <FileText class="size-4" aria-hidden="true" />
                复盘文章
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </section>

  <section v-else class="mx-auto max-w-3xl px-4 py-32 text-center">
    <h1 class="text-3xl font-semibold text-zinc-950">没有找到这个项目</h1>
    <p class="mt-4 text-zinc-600">请回到项目库选择一个可用项目。</p>
    <RouterLink class="btn-primary mt-8" to="/projects">返回项目库</RouterLink>
  </section>
</template>
