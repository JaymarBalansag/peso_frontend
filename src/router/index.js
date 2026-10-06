import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue') },
    { path: '/dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue') },
    { path: '/korea-applicants', name: 'KoreaApplicants', component: () => import('@/views/KoreaApplicants.vue') },
  ],
})

export default router
