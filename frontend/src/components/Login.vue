<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-purple-400">
    <div class="w-[90%] max-w-[360px] bg-white rounded-[32px] px-6 py-8">
      <div class="flex flex-col items-center mb-6">
        <div class="w-14 h-14 mb-3">
          <img src="/gymtastic.jpg" alt="GymTastic Logo" class="w-full h-full object-contain" />
        </div>
        <h1 class="text-xl font-bold text-gray-800 mb-0.5">GymTastic</h1>
        <h2 class="text-gray-500 text-sm">Login</h2>
      </div>

      <form @submit.prevent="loginUser" class="space-y-4">
        <!-- Username Input -->
        <div class="space-y-1">
          <label class="block text-sm text-gray-600">Username</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span class="text-purple-600">👤</span>
            </div>
            <input 
              v-model="form.username" 
              type="text" 
              class="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm" 
              required 
            />
          </div>
        </div>

        <!-- Password Input -->
        <div class="space-y-1">
          <label class="block text-sm text-gray-600">Password</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <span class="text-purple-600">🔒</span>
            </div>
            <input 
              v-model="form.password" 
              :type="showPassword ? 'text' : 'password'" 
              class="w-full pl-10 pr-10 py-2.5 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm" 
              required 
            />
            <button 
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3 flex items-center"
            >
              <span class="text-purple-600">{{ showPassword ? '👁️' : '👁️‍🗨️' }}</span>
            </button>
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <!-- Login Button -->
        <button 
          class="w-full bg-purple-600 text-white py-2.5 rounded-lg font-medium hover:bg-purple-700 transition-colors text-sm"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <!-- Divider -->
        <div class="relative py-2">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-xs">
            <span class="px-3 bg-white text-gray-500">OR</span>
          </div>
        </div>

        <!-- Google Login Button -->
        <button 
          type="button" 
          class="w-full flex items-center justify-center bg-white py-2.5 rounded-lg border border-gray-200 text-sm"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" class="w-4 h-4 mr-2" />
          Continue with Google
        </button>

        <!-- Register Link -->
        <div class="text-center text-sm text-gray-600">
          Don't have an account? 
          <router-link to="/register" class="text-purple-600 font-medium">
            Register
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_BASE_URL } from '../config/environment.js'

const form = ref({
  username: '',
  password: ''
})
const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const router = useRouter()

const loginUser = async () => {
  error.value = ''
  loading.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: form.value.username,
        password: form.value.password
      })
    })
    const data = await response.json()
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user_id', data.user_id)
      router.push('/')
    } else {
      error.value = data.message || 'Login failed. Please check your credentials.'
    }
  } catch (e) {
    error.value = 'Could not connect to server. Please try again later.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-box-shadow: 0 0 0px 1000px white inset;
  transition: background-color 5000s ease-in-out 0s;
}
</style> 