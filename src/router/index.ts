import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import ProjectsView from '../views/ProjectsView.vue'
import TechDetailView from '../views/TechDetailView.vue'
import TechView from '../views/TechView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/projects',
      name: 'projects',
      component: ProjectsView,
    },
    {
      path: '/projects/:slug',
      name: 'project-detail',
      component: ProjectDetailView,
    },
    {
      path: '/tech',
      name: 'tech',
      component: TechView,
    },
    {
      path: '/tech/:slug',
      name: 'tech-detail',
      component: TechDetailView,
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 88,
      }
    }

    return { top: 0 }
  },
})
