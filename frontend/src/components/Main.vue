<template>
  <div class="main-bg dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 dark:bg-gradient-to-b dark:from-gray-900 dark:to-gray-800 min-h-screen flex justify-center items-start py-6 transition-all duration-300 transition-all duration-300">
    <div class="w-full max-w-md mx-auto px-2">
      <!-- Header Section -->
      <div class="flex flex-col items-center mb-6">
        <div class="mb-3 flex justify-center">
          <img src="/gymtastic.jpg" alt="GYM-Tastic Logo" class="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white dark:border-gray-600 dark:border-gray-600" />
        </div>
        <div class="bg-white dark:bg-gray-800 dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 dark:bg-opacity-90 rounded-xl px-6 py-4 shadow-md w-full text-center mb-2 transition-colors duration-300 transition-colors duration-300">
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white dark:text-white mb-1">Welcome back,<br />{{ userName }}!</h1>
          <p class="text-gray-500 dark:text-gray-300 dark:text-gray-300 text-base font-medium">Ready to crush your fitness goals?</p>
        </div>
        <div class="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-2 mb-2"></div>
      </div>

      <!-- Today's Overview -->
      <div class="mb-8">
        <div class="bg-white dark:bg-gray-800 bg-opacity-90 dark:dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 rounded-2xl p-6 shadow-lg transition-colors duration-300 transition-colors duration-300">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white dark:text-white mb-4">Today's Overview</h2>
          <div class="grid grid-cols-1 gap-4 mb-4">
            <div class="text-center">
              <div class="text-2xl mb-1">{{ getStreakEmoji(stats.streak) }}</div>
              <div class="text-3xl font-bold" :class="getStreakColor(stats.streak)">{{ stats.streak }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400">{{ getStreakText(stats.streak) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Start Workout -->
      <div class="mb-8">
        <div class="flex gap-3">
          <!-- Start Workout Button -->
          <button @click="startWorkout" class="flex-1 bg-gradient-to-r from-purple-600 to-pink-500 text-white rounded-xl py-4 px-6 flex items-center justify-between shadow-lg hover:from-purple-700 hover:to-pink-600 transition-all">
            <div class="flex items-center">
              <span class="text-2xl mr-4">🏋️‍♂️</span>
              <div class="text-left">
                <div class="font-bold text-lg">Start Workout</div>
                <div class="text-sm opacity-90">AI-Powered Form Detection</div>
              </div>
            </div>
            <span class="text-2xl">›</span>
          </button>
          
          <!-- Premium Button -->
          <button @click="showPremiumPopup" class="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl py-4 px-4 flex items-center justify-center shadow-lg hover:from-yellow-500 hover:to-orange-600 transition-all">
            <span class="text-2xl">👑</span>
          </button>
        </div>
      </div>

      <!-- Premium Popup Modal -->
      <div v-if="isPremiumPopupVisible" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click="closePremiumPopup">
        <div class="bg-white dark:bg-gray-800 rounded-2xl max-w-md mx-4 p-6 shadow-2xl transform transition-all" @click.stop>
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <span class="text-3xl">👑</span>
            </div>
            <h2 class="text-2xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              Upgrade to Premium
            </h2>
            <p class="text-gray-600 dark:text-gray-300 mt-2">
              Unlock premium features and take your fitness to the next level!
            </p>
          </div>

          <!-- Premium Features -->
          <div class="space-y-4 mb-6">
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 rounded-full flex items-center justify-center">
                <span class="text-lg">💪</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">3 Additional Exercises</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Access to premium exercise library</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-3">
              <div class="w-10 h-10 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-800 dark:to-pink-800 rounded-full flex items-center justify-center">
                <span class="text-lg">🎙️</span>
              </div>
              <div>
                <h3 class="font-semibold text-gray-900 dark:text-white">Voice Feedback</h3>
                <p class="text-sm text-gray-500 dark:text-gray-400">Real-time audio coaching and tips</p>
              </div>
            </div>
          </div>

          <!-- Pricing -->
          <div class="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 mb-6">
            <div class="text-center">
              <div class="text-3xl font-bold text-gray-900 dark:text-white">$9.99<span class="text-lg font-normal text-gray-500 dark:text-gray-400">/month</span></div>
              <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">Cancel anytime</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <button class="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-yellow-500 hover:to-orange-600 transition-all transform hover:scale-105">
              Subscribe Now
            </button>
            <button @click="closePremiumPopup" class="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      <!-- Weekly Progress -->
      <div class="mb-8">
        <h2 class="text-lg font-bold text-gray-900 dark:text-white dark:text-white mb-4 flex items-center">
          <span class="mr-2">📊</span> Weekly Progress
        </h2>
        <div class="bg-white dark:bg-gray-800 dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 dark:bg-opacity-90 rounded-xl p-4 shadow-md transition-colors duration-300 transition-colors duration-300">
          <div class="flex justify-between mb-2">
            <div class="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-400">
              {{ getWeeklyProgressText() }}
            </div>
            <div class="text-sm font-semibold" :class="getWeeklyProgressColor()">
              {{ stats.weeklyProgress }}%
              {{ stats.weeklyProgress === 100 ? '🎉' : '' }}
            </div>
          </div>
          <div class="w-full h-3 bg-gray-200 dark:bg-gray-700 dark:bg-gray-700 rounded-full overflow-hidden">
            <div class="h-full rounded-full transition-all duration-500" 
                 :class="stats.weeklyProgress === 100 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'"
                 :style="{ width: stats.weeklyProgress + '%' }"></div>
          </div>
          <div class="mt-4 grid grid-cols-7 gap-2">
            <div v-for="day in weekProgress" :key="day.date" class="text-center">
              <div class="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-400">{{ formatDayName(day.date) }}</div>
              <div class="w-8 h-8 mx-auto mt-1 rounded-full flex items-center justify-center"
                   :class="day.completed ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white' : 'bg-gray-200 dark:bg-gray-600 dark:bg-gray-600'">
                {{ day.completed ? '✓' : '' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Motivation Section -->
      <div class="text-center mb-20">
        <div class="bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-gray-700 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg border border-white dark:border-gray-600 transition-colors duration-300 dark:border-gray-600 transition-colors duration-300">
          <div class="text-3xl mb-3">{{ currentMotivation.emoji }}</div>
          <h3 class="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            {{ currentMotivation.title }}
          </h3>
          <p class="text-gray-600 dark:text-gray-300 dark:text-gray-300 text-base leading-relaxed">
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

// Premium popup state
const isPremiumPopupVisible = ref(false)

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

// Get emoji based on streak length
const getStreakEmoji = (streak) => {
  if (streak === 0) return '💤'
  if (streak === 1) return '🌱'
  if (streak >= 2 && streak <= 6) return '🔥'
  if (streak >= 7 && streak <= 13) return '⭐'
  if (streak >= 14 && streak <= 29) return '💪'
  if (streak >= 30) return '👑'
  return '🔥'
}

// Get color class based on streak length
const getStreakColor = (streak) => {
  if (streak === 0) return 'text-gray-400 dark:text-gray-500'
  if (streak === 1) return 'text-green-500 dark:text-green-400'
  if (streak >= 2 && streak <= 6) return 'text-orange-500 dark:text-orange-400'
  if (streak >= 7 && streak <= 13) return 'text-yellow-500 dark:text-yellow-400'
  if (streak >= 14 && streak <= 29) return 'text-purple-500 dark:text-purple-400'
  if (streak >= 30) return 'text-pink-500 dark:text-pink-400'
  return 'text-pink-500 dark:text-pink-400'
}

// Get text based on streak length
const getStreakText = (streak) => {
  if (streak === 0) return 'No Current Streak'
  if (streak === 1) return 'Day Streak - Great Start!'
  if (streak >= 2 && streak <= 6) return 'Day Streak - Building Momentum!'
  if (streak >= 7 && streak <= 13) return 'Day Streak - On Fire!'
  if (streak >= 14 && streak <= 29) return 'Day Streak - Unstoppable!'
  if (streak >= 30) return 'Day Streak - Champion!'
  return 'Day Streak'
}

// Get weekly progress text based on completion
const getWeeklyProgressText = () => {
  const workoutDays = weekProgress.value.filter(day => day.completed).length
  
  if (stats.value.weeklyProgress === 100) {
    return `Goal Achieved! (${workoutDays}/4+ days)`
  } else if (workoutDays === 0) {
    return 'Weekly Goal: 4 workout days'
  } else {
    return `Progress: ${workoutDays}/4 days this week`
  }
}

// Get weekly progress color based on completion
const getWeeklyProgressColor = () => {
  if (stats.value.weeklyProgress === 100) {
    return 'text-green-600 dark:text-green-400'
  } else if (stats.value.weeklyProgress >= 75) {
    return 'text-yellow-600 dark:text-yellow-400'
  } else {
    return 'text-purple-600 dark:text-purple-400'
  }
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

// Premium popup functions
const showPremiumPopup = () => {
  isPremiumPopupVisible.value = true
}

const closePremiumPopup = () => {
  isPremiumPopupVisible.value = false
}

// Calculate workout streak from history data
const calculateWorkoutStreak = (workoutHistory) => {
  if (!workoutHistory || workoutHistory.length === 0) return 0
  
  // Sort workouts by date (most recent first)
  const sortedWorkouts = workoutHistory
    .map(session => ({
      ...session,
      date: new Date(session.date || session.start_time || session.created_at)
    }))
    .filter(session => !isNaN(session.date.getTime()))
    .sort((a, b) => b.date - a.date)

  if (sortedWorkouts.length === 0) return 0

  // Get unique dates (ignore time, only consider days)
  const workoutDates = new Set()
  sortedWorkouts.forEach(session => {
    const dateString = session.date.toISOString().split('T')[0]
    workoutDates.add(dateString)
  })

  const uniqueDates = Array.from(workoutDates).sort((a, b) => new Date(b) - new Date(a))
  
  let streak = 0
  const today = new Date()
  const todayString = today.toISOString().split('T')[0]
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayString = yesterday.toISOString().split('T')[0]

  // Check if there's a workout today or yesterday to start the streak
  if (uniqueDates.includes(todayString)) {
    streak = 1
  } else if (uniqueDates.includes(yesterdayString)) {
    streak = 1
  } else {
    return 0 // No recent workouts
  }

  // Count consecutive days
  const startDate = uniqueDates.includes(todayString) ? today : yesterday
  
  for (let i = 1; i < uniqueDates.length; i++) {
    const currentDate = new Date(uniqueDates[i])
    const expectedDate = new Date(startDate)
    expectedDate.setDate(expectedDate.getDate() - i)
    
    const currentDateString = currentDate.toISOString().split('T')[0]
    const expectedDateString = expectedDate.toISOString().split('T')[0]
    
    if (currentDateString === expectedDateString) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// Get motivational message based on streak
const getStreakMotivation = (streak) => {
  if (streak === 0) {
    return {
      emoji: '🚀',
      title: 'Start Your Journey!',
      message: 'Every great journey begins with a single step. Start your first workout today and begin building your streak!'
    }
  } else if (streak === 1) {
    return {
      emoji: '🌱',
      title: 'Great Start!',
      message: 'You\'ve started your fitness journey! Keep going tomorrow to build momentum and create a habit.'
    }
  } else if (streak >= 2 && streak <= 6) {
    return {
      emoji: '🔥',
      title: 'Building Momentum!',
      message: `Amazing! You\'ve worked out ${streak} days in a row. You\'re building a powerful habit that will transform your life!`
    }
  } else if (streak >= 7 && streak <= 13) {
    return {
      emoji: '⭐',
      title: 'You\'re On Fire!',
      message: `Incredible! ${streak} days of consistency! You\'re proving to yourself that you can achieve anything you set your mind to.`
    }
  } else if (streak >= 14 && streak <= 29) {
    return {
      emoji: '💪',
      title: 'Unstoppable Force!',
      message: `Wow! ${streak} days straight! You\'re not just working out, you\'re building discipline and mental strength that extends beyond fitness.`
    }
  } else if (streak >= 30) {
    return {
      emoji: '👑',
      title: 'Fitness Champion!',
      message: `Legendary! ${streak} days of dedication! You\'re an inspiration and proof that consistency creates extraordinary results. Keep ruling your fitness kingdom!`
    }
  }
}

// Fetch user stats with streak and weekly progress calculation
const fetchUserStats = async () => {
  try {
    // Fetch workout history to calculate streak and weekly progress
    const historyRes = await fetchWithAuth(`${API_BASE_URL}/api/workouts/history`)

    let calculatedStreak = 0
    let calculatedWeeklyProgress = 0
    
    // Calculate streak and weekly progress from history data
    if (historyRes.ok) {
      const historyData = await historyRes.json()
      const workoutHistory = historyData.history || historyData.workout_sessions || historyData.sessions || historyData || []
      
      // Calculate streak
      calculatedStreak = calculateWorkoutStreak(workoutHistory)
      
      // Calculate weekly progress
      const weeklyData = calculateWeeklyProgress(workoutHistory)
      calculatedWeeklyProgress = weeklyData.progress
      weekProgress.value = weeklyData.days
      
      console.log(`Weekly Progress: ${weeklyData.progress}% (${weeklyData.uniqueWorkoutDays} unique workout days this week)`)
    }

    // Set calculated values (no backend stats API needed)
    stats.value = {
      weeklyProgress: calculatedWeeklyProgress,
      streak: calculatedStreak,
      points: 0 // Points calculation can be added later if needed
    }

    // Update motivation based on streak
    const streakMotivation = getStreakMotivation(calculatedStreak)
    if (streakMotivation) {
      currentMotivation.value = streakMotivation
    }

  } catch (error) {
    console.error('Error fetching workout history for stats calculation:', error)
    // Set default values if history fetch fails
    stats.value = {
      weeklyProgress: 0,
      streak: 0,
      points: 0
    }
  }
}

// Fetch recommended workouts - now using local fallback data
const fetchRecommendedWorkouts = async () => {
  try {
    // Use local fallback workouts instead of API call
    recommendedWorkouts.value = [
      {
        id: 1,
        name: 'Burn Your Fat',
        type: 'Cardio',
        duration: 20,
        difficulty: 'Beginner'
      },
      {
        id: 2,
        name: 'Do Cardio!',
        type: 'Cardio',
        duration: 35,
        difficulty: 'Intermediate'
      },
      {
        id: 3,
        name: 'Gain Muscle',
        type: 'Strength',
        duration: 45,
        difficulty: 'Advanced'
      }
    ]
    console.log('Using local recommended workouts')
  } catch (error) {
    console.error('Error setting up recommended workouts:', error)
    recommendedWorkouts.value = []
  }
}

// Calculate weekly progress from workout history
const calculateWeeklyProgress = (workoutHistory) => {
  if (!workoutHistory || workoutHistory.length === 0) {
    return { progress: 0, days: [] }
  }

  // Get current week dates (Monday to Sunday)
  const today = new Date()
  const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
  const monday = new Date(today)
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1))
  monday.setHours(0, 0, 0, 0)

  const weekDays = []
  const workoutDatesThisWeek = new Set()

  // Generate week days and check for workouts
  for (let i = 0; i < 7; i++) {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    const dayString = day.toISOString().split('T')[0]
    
    // Check if user worked out on this day
    const hasWorkout = workoutHistory.some(session => {
      const sessionDate = new Date(session.date || session.start_time || session.created_at)
      if (isNaN(sessionDate.getTime())) return false
      const sessionDateString = sessionDate.toISOString().split('T')[0]
      return sessionDateString === dayString
    })

    if (hasWorkout) {
      workoutDatesThisWeek.add(dayString)
    }

    weekDays.push({
      date: dayString,
      completed: hasWorkout
    })
  }

  // Calculate progress: 100% if 4+ different days, otherwise proportional
  const uniqueWorkoutDays = workoutDatesThisWeek.size
  const progress = uniqueWorkoutDays >= 4 ? 100 : Math.round((uniqueWorkoutDays / 4) * 100)

  return {
    progress,
    days: weekDays,
    uniqueWorkoutDays
  }
}

// Calculate weekly progress from workout history (no longer needed as separate function)
const fetchWeeklyProgress = async () => {
  // This function is now redundant since weekly progress is calculated in fetchUserStats
  // Keep it for compatibility but make it do nothing
  console.log('Weekly progress is now calculated in fetchUserStats')
}

const rotateMotivation = () => {
  // If we have a streak-based motivation, occasionally show it, otherwise use regular rotation
  const streakMotivation = getStreakMotivation(stats.value.streak)
  
  // 70% chance to show streak motivation if available, 30% chance for regular quotes
  if (streakMotivation && Math.random() > 0.3) {
    currentMotivation.value = streakMotivation
  } else {
    const currentIndex = motivationalQuotes.findIndex(quote => 
      quote.title === currentMotivation.value.title && 
      quote.emoji === currentMotivation.value.emoji
    )
    const nextIndex = currentIndex >= 0 ? (currentIndex + 1) % motivationalQuotes.length : 0
    currentMotivation.value = motivationalQuotes[nextIndex]
  }
}

onMounted(async () => {
  try {
    // Fetch user profile
    const res = await fetchWithAuth(`${API_BASE_URL}/api/users/profile`)
    if (res.ok) {
      const data = await res.json()
      userName.value = data.profile?.full_name || '[User Name]'
    }

    // Fetch all data (fetchUserStats now handles both streak and weekly progress)
    await Promise.all([
      fetchUserStats(),
      fetchRecommendedWorkouts()
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

.dark .main-bg {
  background: linear-gradient(180deg, #111827 0%, #1f2937 100%);
}
</style> 