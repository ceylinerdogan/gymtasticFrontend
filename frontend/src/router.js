import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('./components/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('./components/Register.vue')
  },
  {
    path: '/create-profile',
    name: 'CreateProfile',
    component: () => import('./components/CreateProfile.vue')
  },
  {
    path: '/',
    name: 'Main',
    component: () => import('./components/Main.vue')
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('./components/Profile.vue')
  },
  {
    path: '/workouts',
    name: 'Workouts',
    component: () => import('./components/Workouts.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('./components/History.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard for protected routes
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/register', '/create-profile']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = !!localStorage.getItem('token')

  if (authRequired && !loggedIn) {
    return next('/login')
  }
  next()
})

// Helper: fetch with token refresh
export async function fetchWithAuth(url, options = {}) {
  let token = localStorage.getItem('token')
  options.headers = options.headers || {}
  if (token) {
    options.headers['Authorization'] = `Bearer ${token}`
  }
  let response = await fetch(url, options)
  if (response.status === 401 && localStorage.getItem('refresh_token')) {
    // Try to refresh token
    const refreshRes = await fetch('http://localhost:5000/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') })
    })
    if (refreshRes.ok) {
      const data = await refreshRes.json()
      localStorage.setItem('token', data.token)
      // Retry original request with new token
      options.headers['Authorization'] = `Bearer ${data.token}`
      response = await fetch(url, options)
    } else {
      // Refresh failed, logout
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user_id')
      window.location.href = '/login'
      throw new Error('Session expired')
    }
  }
  return response
}

export default router 