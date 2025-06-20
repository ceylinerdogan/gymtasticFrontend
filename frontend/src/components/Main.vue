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
                              <div class="text-xs text-gray-500 dark:text-gray-400">
                {{ stats.streak === 1 ? 'Day Streak' : 'Days Streak' }}
              </div>
              <div v-if="stats.streak > 0" class="text-xs text-green-600 font-medium mt-1">
                Keep it up! 💪
              </div>
              <div v-else class="text-xs text-gray-400 mt-1">
                Start your streak today! 🚀
              </div>
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
            <div class="text-sm text-gray-500 dark:text-gray-400">Progress (4+ days = 100%)</div>
            <div class="text-sm font-semibold text-purple-600 dark:text-purple-400">{{ stats.weeklyProgress }}%</div>
          </div>
          <div class="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" 
                 :style="{ width: stats.weeklyProgress + '%' }"></div>
          </div>
          <div v-if="stats.weeklyProgress === 100" class="text-xs text-green-600 font-medium mt-2">
            🎉 Goal achieved! 4+ workout days this week!
          </div>
          <div v-else class="text-xs text-gray-500 mt-2">
            {{ Math.ceil(stats.weeklyProgress / 25) }}/4 workout days this week
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

// Refresh streak and weekly progress (call this when returning from workout)
const refreshStreak = async () => {
  console.log('🔄 Refreshing streak and weekly progress calculation...')
  await fetchWorkoutHistoryAndCalculateStreak()
}

// Debug function to show current workout history
const debugWorkoutHistory = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/workouts/history`)
    if (response.ok) {
      const data = await response.json()
      const workoutHistory = data.history || data.workout_sessions || data.sessions || data || []
      
      console.log('🐛 DEBUG: Raw workout history from API:')
      console.table(workoutHistory.map((w, i) => ({
        index: i,
        workout_type: w.workout_type,
        date: w.date || w.start_time || w.created_at,
        duration: w.duration,
        completed: w.completed,
        exercises: w.exercises?.length || 0
      })))
      
      alert(`Found ${workoutHistory.length} workouts. Check console for details.`)
    }
  } catch (error) {
    console.error('Debug error:', error)
    alert('Error fetching workout history for debug')
  }
}

// Make debug function available globally for testing
if (typeof window !== 'undefined') {
  window.debugWorkoutHistory = debugWorkoutHistory
}

// Calculate workout streak from history
const calculateStreakFromHistory = (workoutHistory) => {
  if (!workoutHistory || workoutHistory.length === 0) return 0

  // Get unique workout dates (completed workouts only)
  const workoutDates = workoutHistory
    .filter(session => {
      // Consider a workout valid if it's completed OR has exercises
      return session.completed === true || (session.exercises && session.exercises.length > 0) || session.duration > 0
    })
    .map(session => {
      const dateStr = session.date || session.start_time || session.created_at || session.end_time
      if (!dateStr) return null
      
      // Get just the date part (YYYY-MM-DD) in local timezone
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    })
    .filter(date => date !== null)

  // Remove duplicates and sort dates (most recent first)
  const uniqueDates = [...new Set(workoutDates)].sort((a, b) => new Date(b) - new Date(a))
  
  if (uniqueDates.length === 0) return 0

  console.log('🔥 Raw workout history:', workoutHistory.map(w => ({
    date: w.date || w.start_time || w.created_at,
    completed: w.completed,
    exercises: w.exercises?.length || 0,
    duration: w.duration
  })))
  console.log('🔥 Unique workout dates (sorted):', uniqueDates)

  // Calculate streak - count consecutive days with workouts
  let streak = 0
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  
  console.log('📅 Today is:', todayStr)
  console.log('🔥 Checking for consecutive workout days...')
  
  // Start from today and count backwards
  let currentDate = new Date(todayStr + 'T00:00:00')
  
  while (true) {
    const currentDateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`
    
    console.log(`🔍 Checking date: ${currentDateStr}`)
    
    // Check if this date has a workout
    if (uniqueDates.includes(currentDateStr)) {
      streak++
      console.log(`✅ Workout found on ${currentDateStr}, streak: ${streak}`)
    } else {
      console.log(`❌ No workout on ${currentDateStr}, streak ends at: ${streak}`)
      break
    }
    
    // Move to previous day
    currentDate.setDate(currentDate.getDate() - 1)
    
    // Safety check to avoid infinite loop (limit to 365 days)
    if (streak > 365) {
      console.log('⚠️ Streak over 365 days, stopping calculation')
      break
    }
  }

  console.log(`🎯 Final calculated streak: ${streak} days`)
  return streak
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

// Calculate weekly progress from workout history
const calculateWeeklyProgress = (workoutHistory) => {
  if (!workoutHistory || workoutHistory.length === 0) {
    return { progress: 0, weekDays: [] }
  }

  // Get start of current week (Sunday)
  const today = new Date()
  const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
  const startOfWeek = new Date(today)
  startOfWeek.setDate(today.getDate() - currentDay)
  startOfWeek.setHours(0, 0, 0, 0)

  console.log('📅 Current week starts:', startOfWeek.toDateString())

  // Get unique workout dates from this week
  const thisWeekWorkouts = workoutHistory
    .filter(session => {
      // Consider a workout valid if it's completed OR has exercises or duration
      const isValid = session.completed === true || (session.exercises && session.exercises.length > 0) || session.duration > 0
      if (!isValid) return false

      const dateStr = session.date || session.start_time || session.created_at || session.end_time
      if (!dateStr) return false
      
      const workoutDate = new Date(dateStr)
      return workoutDate >= startOfWeek && workoutDate <= today
    })
    .map(session => {
      const dateStr = session.date || session.start_time || session.created_at || session.end_time
      const date = new Date(dateStr)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    })

  // Get unique workout days this week
  const uniqueWorkoutDays = [...new Set(thisWeekWorkouts)]
  const workoutDaysCount = uniqueWorkoutDays.length

  console.log('📊 This week\'s workout days:', uniqueWorkoutDays)
  console.log('📊 Total workout days this week:', workoutDaysCount)

  // Calculate progress: 4+ days = 100%, otherwise proportional
  let progress = 0
  if (workoutDaysCount >= 4) {
    progress = 100
  } else {
    progress = Math.round((workoutDaysCount / 4) * 100)
  }

  console.log(`📊 Weekly progress: ${workoutDaysCount}/4 days = ${progress}%`)

  // Generate week days for visual display
  const weekDays = []
  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(startOfWeek)
    dayDate.setDate(startOfWeek.getDate() + i)
    
    const dayStr = `${dayDate.getFullYear()}-${String(dayDate.getMonth() + 1).padStart(2, '0')}-${String(dayDate.getDate()).padStart(2, '0')}`
    
    weekDays.push({
      date: dayStr,
      completed: uniqueWorkoutDays.includes(dayStr)
    })
  }

  return { progress, weekDays }
}

// Fetch workout history and calculate streak + weekly progress
const fetchWorkoutHistoryAndCalculateStreak = async () => {
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/workouts/history`)
    
    if (response.ok) {
      const data = await response.json()
      const workoutHistory = data.history || data.workout_sessions || data.sessions || data || []
      
      // Calculate streak from actual workout history
      const calculatedStreak = calculateStreakFromHistory(workoutHistory)
      
      // Calculate weekly progress from workout history
      const weeklyData = calculateWeeklyProgress(workoutHistory)
      
      // Update the streak and weekly progress
      stats.value.streak = calculatedStreak
      stats.value.weeklyProgress = weeklyData.progress
      weekProgress.value = weeklyData.weekDays
      
      console.log('📊 Workout history loaded:', workoutHistory.length, 'sessions')
      console.log('🔥 Calculated streak:', calculatedStreak)
      console.log('📊 Calculated weekly progress:', weeklyData.progress + '%')
      
    } else {
      console.error('Failed to fetch workout history for streak calculation')
    }
  } catch (error) {
    console.error('Error fetching workout history for streak:', error)
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

// Note: Weekly progress is now calculated from workout history in fetchWorkoutHistoryAndCalculateStreak

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
      fetchWorkoutHistoryAndCalculateStreak()
    ])
  } catch (error) {
    console.error('Error fetching data:', error)
  }

  // Start the motivation rotation
  motivationInterval = setInterval(rotateMotivation, 300000) // 300000ms = 5 minutes
  
  // Listen for workout completion events to refresh streak
  window.addEventListener('workoutCompleted', async () => {
    console.log('🎯 Workout completed! Refreshing streak...')
    await refreshStreak()
  })
  
  // Also refresh when page becomes visible (user returns from camera page)
  document.addEventListener('visibilitychange', async () => {
    if (!document.hidden) {
      console.log('📱 Page is visible again, refreshing streak...')
      await refreshStreak()
    }
  })
})

onUnmounted(() => {
  if (motivationInterval) {
    clearInterval(motivationInterval)
  }
  
  // Clean up event listeners
  window.removeEventListener('workoutCompleted', refreshStreak)
  document.removeEventListener('visibilitychange', refreshStreak)
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