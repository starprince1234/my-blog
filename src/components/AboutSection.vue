<script setup lang="ts">
import SectionShell from './SectionShell.vue'
</script>

<template>
  <SectionShell
    id="about"
    eyebrow="About"
    title="我不只关心代码能不能跑，也关心它能不能被真正使用。"
    description="这个网站会长期记录我的项目、实验、技术选择和产品复盘。"
  >
    <div class="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <div class="rounded-lg border border-zinc-200 bg-white p-6 shadow-sm">
        <p class="text-lg font-semibold leading-8 text-zinc-950">
          我习惯从真实问题出发做产品：先快速验证需求，再搭建原型，然后持续迭代体验和功能。
        </p>
        <p class="mt-5 leading-8 text-zinc-600">
          过去一段时间，我持续做了很多小产品、工具和实验项目，从需求分析、产品设计、前后端开发、部署上线到后续优化，大部分流程都由我自己完成。这让我逐渐形成了较完整的产品开发闭环能力。
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div class="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 class="font-semibold text-zinc-950">我在寻找什么</h3>
          <p class="mt-3 text-sm leading-7 text-zinc-600">
            我希望持续接触真实问题、真实用户和优秀创作者，在更高质量的反馈中把想法打磨成产品。
          </p>
        </div>
        <div class="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 class="font-semibold text-zinc-950">我的做项目方式</h3>
          <p class="mt-3 text-sm leading-7 text-zinc-600">
            用最短路径验证关键假设，优先上线可访问版本，再通过反馈补齐体验、文档和技术细节。
          </p>
        </div>
        <div class="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 class="font-semibold text-zinc-950">当前关注方向</h3>
          <p class="mt-3 text-sm leading-7 text-zinc-600">
            AI 应用、Web 工具、开发者效率、交互式产品，以及如何把 LLM 能力真正嵌入用户工作流。
          </p>
        </div>
        <div class="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <h3 class="font-semibold text-zinc-950">未来想做什么</h3>
          <p class="mt-3 text-sm leading-7 text-zinc-600">
            做更多能被真实用户使用、愿意持续打开、并且能够不断迭代的产品，而不是停留在演示页面。
          </p>
        </div>
      </div>
    </div>
  </SectionShell>
</template>
