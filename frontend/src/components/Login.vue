<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-400 to-pink-300">
    <div class="w-full max-w-md bg-white bg-opacity-20 rounded-xl shadow-lg p-8">
      <div class="flex flex-col items-center mb-6">
        <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
          <span class="text-4xl">🏋️‍♂️</span>
        </div>
        <h1 class="text-3xl font-bold text-white mb-2">GymTastic</h1>
        <h2 class="text-xl font-semibold text-white">Login</h2>
      </div>
      <form @submit.prevent="loginUser">
        <input v-model="form.username" type="text" placeholder="Username" class="w-full mb-4 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
        <input v-model="form.password" type="password" placeholder="Password" class="w-full mb-4 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
        <button class="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold mb-2" :disabled="loading">{{ loading ? 'Logging in...' : 'Login' }}</button>
        <div v-if="error" class="text-red-500 text-center my-2">{{ error }}</div>
        <div class="flex justify-between text-sm text-white mb-4">
          <a href="#" class="hover:underline">Forgot Password?</a>
        </div>
        <div class="flex items-center my-4">
          <div class="flex-grow h-px bg-white"></div>
          <span class="mx-2 text-white">OR</span>
          <div class="flex-grow h-px bg-white"></div>
        </div>
        <button type="button" class="w-full flex items-center justify-center bg-white text-gray-700 py-2 rounded-lg font-semibold border border-gray-300">
          <span class="mr-2">G</span> Continue with Google
        </button>
      </form>
      <div class="text-center mt-4 text-white">
        Don't have an account? <router-link to="/register" class="underline">Register</router-link>
      </div>
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
    console.log("After fetch")
    const data = await response.json()
    if (response.ok && data.token) {
      // Store token (and optionally refresh_token, user_id)
      localStorage.setItem('token', data.token)
      localStorage.setItem('refresh_token', data.refresh_token)
      localStorage.setItem('user_id', data.user_id)
      // Redirect to main page
      router.push('/')
    } else {
      error.value = data.message || 'Login failed.'
    }
  } catch (e) {
    error.value = 'Could not connect to server.'
  } finally {
    loading.value = false
  }
}
</script> 