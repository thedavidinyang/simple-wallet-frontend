import { createRouter, createWebHistory } from 'vue-router'
import { setAuth } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue'),
    },

    {
      path: '/register',
      name: 'register',
      component: () => import('../views/register.vue'),
      meta: { guest: true },
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('../views/Dashboard.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/creditwallet',
      name: 'creditwallet',
      component: () => import('../views/creditwallet.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/signout',
      name: 'signout',
      beforeEnter: (to, from, next) => {
        setAuth(null)
        import('@pnotify/core').then(({ alert }) => {
          alert({
            title: 'Signed Out',
            text: 'You have been signed out successfully.',
            delay: 1500,
            type: 'success',
          })
        })
        next({ name: 'login' })
      },
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('token')

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Not authenticated, redirect to login
    next({ name: 'login' })
  } else if (to.meta.guest && isAuthenticated) {
    // Already authenticated, redirect to dashboard
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
