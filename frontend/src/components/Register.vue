<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-400 to-pink-300">
    <div class="w-full max-w-md bg-white bg-opacity-20 rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
      <form @submit.prevent="registerUser">
        <input v-model="form.full_name" type="text" placeholder="Full name" class="w-full mb-4 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
        <input v-model="form.email" type="email" placeholder="Email address" class="w-full mb-4 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
        <input v-model="form.username" type="text" placeholder="Username" class="w-full mb-4 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
        <input v-model="form.password" type="password" placeholder="Create password (8+ characters)" class="w-full mb-4 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
        <input v-model="form.confirmPassword" type="password" placeholder="Confirm password" class="w-full mb-4 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
        <select v-model="form.gender" class="w-full mb-4 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required>
          <option disabled value="">Select Gender</option>
          <option>Female</option>
          <option>Male</option>
          <option>Other</option>
        </select>
        <input v-model="form.birth_date" type="date" placeholder="Date of Birth" class="w-full mb-4 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
        <div class="flex gap-2 mb-4">
          <input v-model.number="form.height" type="number" step="0.01" placeholder="Height (m)" class="w-1/2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
          <input v-model.number="form.weight" type="number" step="0.1" placeholder="Weight (kg)" class="w-1/2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
        </div>
        <input v-model="form.fitness_goal" type="text" placeholder="Fitness Goal" class="w-full mb-4 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
        <input v-model="form.activity_level" type="text" placeholder="Activity Level" class="w-full mb-4 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" required />
        <button class="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold mb-2" :disabled="loading">{{ loading ? 'Registering...' : 'Create Account' }}</button>
        <div v-if="error" class="text-red-500 text-center my-2">{{ error }}</div>
        <div v-if="success" class="text-green-500 text-center my-2">Registration successful! You can now <router-link to='/login' class='underline'>login</router-link>.</div>
        <div class="flex items-center my-4">
          <div class="flex-grow h-px bg-white"></div>
          <span class="mx-2 text-white">OR</span>
          <div class="flex-grow h-px bg-white"></div>
        </div>
        <button type="button" class="w-full flex items-center justify-center bg-white text-gray-700 py-2 rounded-lg font-semibold border border-gray-300 mb-2">
          <span class="mr-2">G</span> Sign up with Google
        </button>
      </form>
      <div class="text-center mt-4 text-white">
        Already have an account? <router-link to="/login" class="underline">Login</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const form = ref({
  full_name: '',
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
  gender: '',
  height: '',
  weight: '',
  birth_date: '',
  fitness_goal: '',
  activity_level: ''
})

const loading = ref(false)
const error = ref('')
const success = ref(false)

const registerUser = async () => {
  error.value = ''
  success.value = false
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match.'
    return
  }
  loading.value = true
  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: form.value.full_name,
        username: form.value.username,
        password: form.value.password,
        email: form.value.email,
        gender: form.value.gender,
        height: form.value.height,
        weight: form.value.weight,
        birth_date: form.value.birth_date,
        fitness_goal: form.value.fitness_goal,
        activity_level: form.value.activity_level
      })
    })
    if (response.ok) {
      success.value = true
      // Optionally, reset the form
      form.value = {
        full_name: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        gender: '',
        height: '',
        weight: '',
        birth_date: '',
        fitness_goal: '',
        activity_level: ''
      }
    } else {
      const data = await response.json()
      error.value = data.message || 'Registration failed.'
    }
  } catch (e) {
    error.value = 'Could not connect to server.'
  } finally {
    loading.value = false
  }
}
</script> 