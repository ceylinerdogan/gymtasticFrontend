<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 pb-20 px-4">
    <!-- Header Section -->
    <div class="pt-8 pb-6 text-center">
      <div class="text-6xl mb-4">💪</div>
      <h1 class="text-3xl font-bold text-white mb-2">Welcome back, {{ userName }}!</h1>
      <p class="text-white opacity-90">Ready to crush your fitness goals?</p>
    </div>

    <!-- Quick Action Cards -->
    <div class="space-y-4 mb-8">
      <!-- Start Workout Card -->
      <div @click="startWorkout" class="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-30 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:bg-opacity-30 active:scale-[0.98]">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center">
              <span class="text-2xl text-white">🏋️‍♂️</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Start Workout</h3>
              <p class="text-white opacity-80">Real-time pose detection</p>
            </div>
          </div>
          <div class="text-white opacity-60">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- Browse Workouts Card -->
      <div @click="browseWorkouts" class="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-30 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:bg-opacity-30 active:scale-[0.98]">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center">
              <span class="text-2xl text-white">📋</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Browse Workouts</h3>
              <p class="text-white opacity-80">Choose from available programs</p>
            </div>
          </div>
          <div class="text-white opacity-60">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>

      <!-- View History Card -->
      <div @click="viewHistory" class="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-30 cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:bg-opacity-30 active:scale-[0.98]">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center">
              <span class="text-2xl text-white">📊</span>
            </div>
            <div>
              <h3 class="text-xl font-bold text-white">Workout History</h3>
              <p class="text-white opacity-80">Track your progress</p>
            </div>
          </div>
          <div class="text-white opacity-60">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Exercises Section -->
    <div class="mb-8">
      <h3 class="text-xl font-bold text-white mb-4 text-center">Featured Exercises</h3>
      <div class="grid grid-cols-3 gap-3">
        <div class="bg-white bg-opacity-20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div class="text-3xl mb-2">🏋️</div>
          <div class="text-white font-semibold text-sm">Squat</div>
          <div class="text-white opacity-70 text-xs">Lower Body</div>
        </div>
        <div class="bg-white bg-opacity-20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div class="text-3xl mb-2">🧘</div>
          <div class="text-white font-semibold text-sm">Plank</div>
          <div class="text-white opacity-70 text-xs">Full Body</div>
        </div>
        <div class="bg-white bg-opacity-20 rounded-xl p-4 text-center backdrop-blur-sm">
          <div class="text-3xl mb-2">🚶</div>
          <div class="text-white font-semibold text-sm">Lunge</div>
          <div class="text-white opacity-70 text-xs">Lower Body</div>
        </div>
      </div>
    </div>

    <!-- Motivation Section -->
    <div class="text-center">
      <div class="bg-white bg-opacity-20 rounded-2xl p-6 backdrop-blur-sm border border-white border-opacity-30">
        <div class="text-4xl mb-3">🔥</div>
        <h3 class="text-lg font-bold text-white mb-2">Stay Consistent!</h3>
        <p class="text-white opacity-90 text-sm">Every workout counts towards your goals. Start your session now!</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '../router'
import { API_BASE_URL } from '../config/environment.js'

const userName = ref('[User Name]')
const router = useRouter()

const startWorkout = () => {
  router.push('/camera')
}

const browseWorkouts = () => {
  router.push('/workouts')
}

const viewHistory = () => {
  router.push('/history')
}

onMounted(async () => {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/users/profile`)
    if (res.ok) {
      const data = await res.json()
      userName.value = data.profile?.full_name || '[User Name]'
    }
  } catch (e) {}
})
</script> 