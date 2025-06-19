<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-400 to-pink-300">
    <div class="w-full max-w-md bg-white bg-opacity-20 rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">Create Account</h2>
      <form @submit.prevent="registerUser" novalidate>
        <div class="mb-4">
          <input 
            v-model="form.full_name" 
            type="text" 
            placeholder="Full name" 
            class="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" 
            required
            oninvalid="this.setCustomValidity('Please enter your full name')"
            oninput="this.setCustomValidity('')"
          />
        </div>
        <div class="mb-4">
          <input 
            v-model="form.email" 
            type="email" 
            placeholder="Email address" 
            class="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" 
            required
            oninvalid="this.setCustomValidity('Please enter a valid email address')"
            oninput="this.setCustomValidity('')"
          />
        </div>
        <div class="mb-4">
          <input 
            v-model="form.username" 
            type="text" 
            placeholder="Username" 
            class="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" 
            required
            oninvalid="this.setCustomValidity('Please enter a username')"
            oninput="this.setCustomValidity('')"
          />
        </div>
        <div class="mb-4">
          <input 
            v-model="form.password" 
            type="password" 
            placeholder="Create password (8+ characters)" 
            class="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" 
            required
            minlength="8"
            oninvalid="this.setCustomValidity('Password must be at least 8 characters long')"
            oninput="this.setCustomValidity('')"
          />
        </div>
        <div class="mb-4">
          <input 
            v-model="form.confirmPassword" 
            type="password" 
            placeholder="Confirm password" 
            class="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" 
            required
            oninvalid="this.setCustomValidity('Please confirm your password')"
            oninput="this.setCustomValidity('')"
          />
        </div>
        <div class="mb-4">
          <select 
            v-model="form.gender" 
            class="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" 
            required
            oninvalid="this.setCustomValidity('Please select your gender')"
            oninput="this.setCustomValidity('')"
          >
            <option value="">Select Gender</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </div>
        <div class="mb-4">
          <input 
            v-model="form.birth_date" 
            type="date" 
            placeholder="Date of Birth" 
            class="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" 
            required
            oninvalid="this.setCustomValidity('Please enter your date of birth')"
            oninput="this.setCustomValidity('')"
          />
        </div>
        <div class="flex gap-2 mb-4">
          <input 
            v-model.number="form.height" 
            type="number" 
            step="0.01" 
            placeholder="Height (m)" 
            class="w-1/2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" 
            required
            oninvalid="this.setCustomValidity('Please enter your height')"
            oninput="this.setCustomValidity('')"
          />
          <input 
            v-model.number="form.weight" 
            type="number" 
            step="0.1" 
            placeholder="Weight (kg)" 
            class="w-1/2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" 
            required
            oninvalid="this.setCustomValidity('Please enter your weight')"
            oninput="this.setCustomValidity('')"
          />
        </div>
        <div class="mb-4">
          <select 
            v-model="form.fitness_goal" 
            class="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" 
            required
            oninvalid="this.setCustomValidity('Please select your fitness goal')"
            oninput="this.setCustomValidity('')"
          >
            <option value="">Select Fitness Goal</option>
            <option value="lose_weight">Lose Weight</option>
            <option value="gain_muscle">Gain Muscle</option>
            <option value="maintain">Maintain</option>
            <option value="improve_fitness">Improve Fitness</option>
            <option value="burn_fat">Burn Fat</option>
          </select>
        </div>
        <div class="mb-4">
          <select 
            v-model="form.activity_level" 
            class="w-full px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" 
            required
            oninvalid="this.setCustomValidity('Please select your activity level')"
            oninput="this.setCustomValidity('')"
          >
            <option value="">Select Activity Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <button 
          type="submit" 
          class="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold mb-2" 
          :disabled="loading"
        >
          {{ loading ? 'Registering...' : 'Create Account' }}
        </button>
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
import { API_BASE_URL } from '../config/environment.js'

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

const validateForm = () => {
  if (!form.value.full_name) {
    error.value = 'Please enter your full name'
    return false
  }
  if (!form.value.email) {
    error.value = 'Please enter your email address'
    return false
  }
  if (!form.value.username) {
    error.value = 'Please enter a username'
    return false
  }
  if (!form.value.password) {
    error.value = 'Please enter a password'
    return false
  }
  if (form.value.password.length < 8) {
    error.value = 'Password must be at least 8 characters long'
    return false
  }
  if (!form.value.confirmPassword) {
    error.value = 'Please confirm your password'
    return false
  }
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return false
  }
  if (!form.value.gender) {
    error.value = 'Please select your gender'
    return false
  }
  if (!form.value.birth_date) {
    error.value = 'Please enter your date of birth'
    return false
  }
  if (!form.value.height) {
    error.value = 'Please enter your height'
    return false
  }
  if (!form.value.weight) {
    error.value = 'Please enter your weight'
    return false
  }
  if (!form.value.fitness_goal) {
    error.value = 'Please select your fitness goal'
    return false
  }
  if (!form.value.activity_level) {
    error.value = 'Please select your activity level'
    return false
  }
  return true
}

const formatDateForServer = (dateString) => {
  if (!dateString) return ''
  
  // Convert from YYYY-MM-DD to ISO timestamp format
  const date = new Date(dateString)
  return date.toISOString()
}

const registerUser = async () => {
  error.value = ''
  success.value = false
  
  if (!validateForm()) {
    return
  }

  loading.value = true
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
        birth_date: formatDateForServer(form.value.birth_date),
        fitness_goal: form.value.fitness_goal,
        activity_level: form.value.activity_level
      })
    })
    if (response.ok) {
      success.value = true
      // Reset the form
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
      error.value = data.message || 'Registration failed. Please try again.'
    }
  } catch (e) {
    error.value = 'Could not connect to server. Please check your internet connection and try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Hide default browser validation messages */
input:invalid {
  box-shadow: none;
}

/* Custom validation message styling */
input:invalid:not(:placeholder-shown) {
  border-color: #ef4444;
}

select:invalid:not(:focus) {
  border-color: #ef4444;
}
</style> 