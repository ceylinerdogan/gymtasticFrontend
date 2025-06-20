<template>
  <div class="main-bg dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 min-h-screen flex justify-center items-start py-6 transition-all duration-300">
    <div class="w-full max-w-md mx-auto px-2">
      <!-- Header Section -->
      <div class="flex flex-col items-center mb-6">
        <div class="mb-3 flex justify-center">
          <img src="/gymtastic.jpg" alt="GYM-Tastic Logo" class="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-600" />
        </div>
        <div class="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 rounded-xl px-6 py-4 shadow-md w-full text-center mb-2 transition-colors duration-300">
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white mb-1">Welcome back,<br />{{ userName }}!</h1>
          <p class="text-gray-500 dark:text-gray-300 text-base font-medium">Ready to crush your fitness goals?</p>
        </div>
        <div class="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 mb-2"></div>
      </div>

      <!-- Today's Overview -->
      <div class="mb-8">
        <div class="bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-2xl p-6 shadow-lg transition-colors duration-300">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4">Today's Overview</h2>
          <div class="grid grid-cols-1 gap-4 mb-4">
            <div class="text-center">
              <div class="text-2xl mb-1">🔥</div>
              <div class="text-3xl font-bold text-pink-500">{{ stats.streak }}</div>
                              <div class="text-xs text-gray-500 dark:text-gray-400">Day Streak</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Start Workout -->
      <div class="mb-8">
        <button @click="startWorkout" class="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl py-4 px-6 flex items-center justify-between shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all">
          <div class="flex items-center">
            <span class="text-2xl mr-4">🏋️‍♂️</span>
            <div class="text-left">
              <div class="font-bold text-lg">Start Workout</div>
              <div class="text-sm opacity-90">AI-Powered Form Detection</div>
            </div>
          </div>
          <span class="text-2xl">›</span>
        </button>
      </div>

      <!-- Recommended Workouts -->
      <div v-if="recommendedWorkouts.length > 0" class="mb-8">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="mr-2">💪</span> Recommended for You
        </h2>
        <div class="space-y-3">
          <div v-for="workout in recommendedWorkouts" :key="workout.id" 
               class="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 rounded-xl p-4 shadow-md flex items-center justify-between cursor-pointer hover:bg-opacity-100 dark:hover:bg-opacity-100 transition-all"
               @click="startWorkoutWithId(workout.id)">
            <div class="flex items-center">
              <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 flex items-center justify-center mr-4">
                <span class="text-xl">{{ getWorkoutEmoji(workout.type) }}</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">{{ workout.name }}</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">{{ workout.duration }} mins • {{ workout.difficulty }}</p>
              </div>
            </div>
            <span class="text-gray-400 dark:text-gray-300">›</span>
          </div>
        </div>
      </div>

      <!-- Weekly Progress -->
      <div class="mb-8">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
          <span class="mr-2">📊</span> Weekly Progress
        </h2>
        <div class="bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 rounded-xl p-4 shadow-md transition-colors duration-300">
          <div class="flex justify-between mb-2">
            <div class="text-sm text-gray-500 dark:text-gray-400">Progress</div>
            <div class="text-sm font-semibold text-purple-600 dark:text-purple-400">{{ stats.weeklyProgress }}%</div>
          </div>
          <div class="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
                 :style="{ width: stats.weeklyProgress + '%' }"></div>
          </div>
          <div class="mt-4 grid grid-cols-7 gap-2">
            <div v-for="day in weekProgress" :key="day.date" class="text-center">
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ formatDayName(day.date) }}</div>
              <div class="w-8 h-8 mx-auto mt-1 rounded-full flex items-center justify-center"
                   :class="day.completed ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-600'">
                {{ day.completed ? '✓' : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Motivation Section -->
      <div class="text-center mb-20">
        <div class="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg border border-white dark:border-gray-600 transition-colors duration-300">
          <div class="text-3xl mb-3">{{ currentMotivation.emoji }}</div>
          <h3 class="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {{ currentMotivation.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
            {{ currentMotivation.message }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '../router'
import { API_BASE_URL } from '../config/environment.js'

const userName = ref('[User Name]')
const router = useRouter()

// Data refs
const stats = ref({
  weeklyProgress: 0,
  streak: 0,
  points: 0
})
const recommendedWorkouts = ref([])
const weekProgress = ref([])

// Motivational quotes array
const motivationalQuotes = [
  {
    emoji: '🔥',
    title: 'Stay Consistent!',
    message: 'Every workout counts towards your goals. Start your session now!'
  },
  {
    emoji: '💪',
    title: 'Push Your Limits!',
    message: 'The only bad workout is the one that didn\'t happen. Let\'s make it count!'
  },
  {
    emoji: '⭐',
    title: 'You\'ve Got This!',
    message: 'Small steps every day lead to massive changes over time.'
  },
  {
    emoji: '🎯',
    title: 'Focus on Progress!',
    message: 'Don\'t compare yourself to others. Compare yourself to who you were yesterday.'
  },
  {
    emoji: '🌟',
    title: 'Make It Happen!',
    message: 'Your future self will thank you for the effort you put in today.'
  }
]

const currentMotivation = ref(motivationalQuotes[0])
let motivationInterval

// Get emoji based on workout type
const getWorkoutEmoji = (type) => {
  const emojiMap = {
    'full_body': '💪',
    'cardio': '🏃',
    'strength': '🏋️‍♂️',
    'flexibility': '🧘‍♂️',
    'hiit': '🔥'
  }
  return emojiMap[type] || '💪'
}

// Format date to day name
const formatDayName = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0)
}

// Start workout with specific ID
const startWorkoutWithId = (workoutId) => {
  router.push(`/camera?workout=${workoutId}`)
}

// Start default workout
const startWorkout = () => {
  router.push('/camera')
}

// Fetch user stats
const fetchUserStats = async () => {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/users/stats`)
    if (res.ok) {
      const data = await res.json()
      stats.value = {
        weeklyProgress: data.weekly_progress || 0,
        streak: data.workout_streak || 0,
        points: data.total_points || 0
      }
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
  }
}

// Fetch recommended workouts
const fetchRecommendedWorkouts = async () => {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/workouts/recommended`)
    if (res.ok) {
      const data = await res.json()
      recommendedWorkouts.value = data.workouts || []
    }
  } catch (error) {
    console.error('Error fetching recommended workouts:', error)
  }
}

// Fetch weekly progress
const fetchWeeklyProgress = async () => {
  try {
    const res = await fetchWithAuth(`${API_BASE_URL}/api/users/weekly-progress`)
    if (res.ok) {
      const data = await res.json()
      weekProgress.value = data.days || []
    }
  } catch (error) {
    console.error('Error fetching weekly progress:', error)
  }
}

const rotateMotivation = () => {
  const currentIndex = motivationalQuotes.indexOf(currentMotivation.value)
  const nextIndex = (currentIndex + 1) % motivationalQuotes.length
  currentMotivation.value = motivationalQuotes[nextIndex]
}

onMounted(async () => {
  try {
    // Fetch user profile
    const res = await fetchWithAuth(`${API_BASE_URL}/api/users/profile`)
    if (res.ok) {
      const data = await res.json()
      userName.value = data.profile?.full_name || '[User Name]'
    }

    // Fetch all data
    await Promise.all([
      fetchUserStats(),
      fetchRecommendedWorkouts(),
      fetchWeeklyProgress()
    ])
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  // Start the motivation rotation
  motivationInterval = setInterval(rotateMotivation, 300000) // 300000ms = 5 minutes
})

onUnmounted(() => {
  if (motivationInterval) {
    clearInterval(motivationInterval)
  }
})
</script>

<style scoped>
.main-bg {
  background: linear-gradient(180deg, #c084fc 0%, #f472b6 100%);
}

.dark .main-bg {
  background: linear-gradient(180deg, #111827 0%, #1f2937 100%);
}
</style> 