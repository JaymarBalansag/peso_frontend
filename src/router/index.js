import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {path: '/', redirect: '/login' },
    { path: '/login', name: 'Login', component: () => import('@/views/LoginView.vue') },
    { path: '/dashboard', name: 'Dashboard', component: () => import('@/views/Dashboard.vue') },
    { path: '/korea-applicants', name: 'KoreaApplicants', component: () => import('@/views/KoreaApplicants.vue') },
    { path: '/reports', name: 'Reports', component: () => import('@/views/Reports.vue') },
    { path: '/user-management', name: 'UserManagement', component: () => import('@/views/UserManagement.vue') },
  ],
})

router.beforeEach((to) => {
  const authenticated = Boolean(
    window.sessionStorage.getItem('peso_admin_token')
      || window.localStorage.getItem('peso_admin_token'),
  );
  if (to.name !== 'Login' && !authenticated) return { name: 'Login' };
  if (to.name === 'Login' && authenticated) return { name: 'Dashboard' };
  if (to.name === 'UserManagement') {
    const storedUser = window.sessionStorage.getItem('peso_admin_user')
      || window.localStorage.getItem('peso_admin_user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user?.role !== 'admin') return { name: 'Dashboard' };
  }
});

export default router
