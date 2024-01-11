import { createRouter, createWebHistory } from 'vue-router'
import auth from '@/router/auth.js'
import HomeView from '@/views/HomeView.vue'
import Dashboard from '@/views/Dashboard.vue'
import Profile from '@/views/users/Profile.vue'
let routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/dashboard',
    component: Dashboard,
    meta: {
      requiresAuth: true,
    }
  },
  {
    path: '/user/profile',
    component: Profile,
    meta: {
      requiresAuth: true,
    }
  }
]
routes = routes.concat(auth)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!localStorage.getItem('access_token')) {
      next({
        path: '/login',
        params: { nextUrl: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
