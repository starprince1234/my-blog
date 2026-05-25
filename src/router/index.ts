import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProjectDetailView from '../views/ProjectDetailView.vue'
import ProjectsView from '../views/ProjectsView.vue'

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
