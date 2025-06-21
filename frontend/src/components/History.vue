<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 dark:from-gray-900 dark:to-gray-800 pb-20 px-4 transition-all duration-300">
    <div class="pt-6 pb-4">
      <h2 class="text-2xl font-bold text-white dark:text-gray-100 text-center mb-2">Workout History</h2>
      <p class="text-white dark:text-gray-300 text-center opacity-90">Track your fitness journey</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white dark:border-gray-300"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-500 bg-opacity-20 dark:bg-red-600 dark:bg-opacity-30 rounded-lg p-4 mx-4 mb-4">
      <p class="text-white dark:text-gray-200 text-center">{{ error }}</p>
      <button @click="fetchWorkoutHistory" class="w-full mt-2 bg-white dark:bg-gray-700 bg-opacity-20 dark:bg-opacity-50 text-white dark:text-gray-200 py-2 rounded-lg transition-colors duration-300">
        Retry
      </button>
    </div>

    <!-- History List -->
    <div v-else class="space-y-6 px-2">
      <div 
        v-for="session in workoutHistory" 
        :key="session.id"
        class="group bg-white dark:bg-gray-800 bg-opacity-80 dark:bg-opacity-90 rounded-2xl shadow-xl border border-white dark:border-gray-600 border-opacity-40 dark:border-opacity-30 p-5 transition-all duration-200 hover:shadow-2xl hover:scale-[1.01]"
      >
        <!-- Main Session Info -->
        <div class="flex items-center gap-4 mb-4">
          <!-- Icon/Avatar -->
          <div class="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center text-3xl font-bold"
               :class="getWorkoutIconBg(session.workout_type || session.workout_name)">
            <span>{{ getWorkoutIcon(session.workout_type || session.workout_name) }}</span>
          </div>
          <!-- Details -->
          <div class="flex-1 min-w-0 flex flex-col justify-center">
            <div class="flex items-center justify-between gap-4 w-full">
              <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ session.workout_type || session.workout_name || 'Workout Session' }}</h3>
              <span class="flex flex-col items-end text-base text-gray-700 dark:text-gray-300 font-semibold min-w-[100px]">
                <span>{{ formatDateOnly(session.date || session.start_time || session.created_at) }}</span>
                <span>{{ formatTimeOnly(session.date || session.start_time || session.created_at) }}</span>
              </span>
            </div>
            <div class="flex items-center gap-3 mt-2">
              <div class="flex items-center text-purple-700 dark:text-purple-300 font-semibold text-sm bg-purple-100 dark:bg-purple-800 rounded px-2 py-1">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                {{ formatDuration(session.duration) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Exercise Names -->
        <div v-if="session.exercises && session.exercises.length > 0" class="border-t border-gray-200 dark:border-gray-600 pt-4">
          <h4 class="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 flex items-center">
            <span class="mr-2">🏃‍♂️</span>
            Exercises Performed
          </h4>
          
          <!-- Exercise Names List -->
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="exerciseName in getUniqueExercises(session.exercises)" 
              :key="exerciseName"
              class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 dark:bg-purple-800 text-purple-700 dark:text-purple-300"
            >
              <span class="mr-1">{{ getExerciseIcon(exerciseName) }}</span>
              {{ exerciseName }}
            </span>
          </div>
          
        </div>

        <!-- No Exercise Data -->
        <div v-else class="border-t border-gray-200 dark:border-gray-600 pt-4">
          <div class="text-center text-gray-500 dark:text-gray-400 text-sm py-2">
            <span class="mr-2">📊</span>
            No detailed exercise data available for this session
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="workoutHistory.length === 0 && !loading" class="text-center py-16">
        <div class="text-7xl mb-4">📈</div>
        <h3 class="text-2xl font-bold text-white dark:text-gray-200 mb-2">No Workout History</h3>
        <p class="text-white dark:text-gray-300 opacity-80 mb-6">Start your first workout to see your progress here!</p>
        <button @click="$router.push('/workouts')" class="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all">
          Start Workout
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchWithAuth } from '../router'
import { API_BASE_URL } from '../config/environment.js'

const workoutHistory = ref([])
const loading = ref(true)
const error = ref('')

const fetchWorkoutHistory = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/workouts/history`)
    
    if (response.ok) {
      const data = await response.json()
      workoutHistory.value = data.history || data.workout_sessions || data.sessions || data || []
    } else {
      const errorData = await response.json()
      error.value = errorData.message || 'Failed to load workout history'
    }
  } catch (e) {
    error.value = 'Could not connect to server'
  } finally {
    loading.value = false
  }
}

const formatDate = (dateString) => {
  if (!dateString) return 'Unknown date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDuration = (duration) => {
  if (!duration) return 'N/A'
  if (typeof duration === 'number') {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}m ${seconds}s`
  }
  if (typeof duration === 'string') {
    return duration.includes('min') ? duration : `${duration} min`
  }
  return duration.toString()
}

const formatDateOnly = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const formatTimeOnly = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Icon and color helpers
const getWorkoutIcon = (name) => {
  if (!name) return '🏋️‍♂️'
  const n = name.toLowerCase()
  if (n.includes('cardio')) return '🏃‍♂️'
  if (n.includes('muscle') || n.includes('strength')) return '💪'
  if (n.includes('fat') || n.includes('burn')) return '🔥'
  return '🏋️‍♂️'
}

const getWorkoutIconBg = (name) => {
  if (!name) return 'bg-purple-200 text-purple-700'
  const n = name.toLowerCase()
  if (n.includes('cardio')) return 'bg-pink-200 text-pink-700'
  if (n.includes('muscle') || n.includes('strength')) return 'bg-yellow-200 text-yellow-700'
  if (n.includes('fat') || n.includes('burn')) return 'bg-orange-200 text-orange-700'
  return 'bg-purple-200 text-purple-700'
}

const getExerciseIcon = (exerciseName) => {
  if (!exerciseName) return '🏃‍♂️'
  const name = exerciseName.toLowerCase()
  if (name.includes('squat')) return '🏋️‍♀️'
  if (name.includes('plank')) return '🤸‍♂️'
  if (name.includes('lunge')) return '🦵'
  if (name.includes('cardio')) return '🏃‍♂️'
  if (name.includes('push')) return '💪'
  return '🏃‍♂️'
}

// Exercise analysis helpers
const getUniqueExercises = (exercises) => {
  if (!exercises || !Array.isArray(exercises)) return []
  const unique = new Set(exercises.map(e => e.exercise_name || 'Unknown'))
  return Array.from(unique)
}

const getAverageAccuracy = (exercises) => {
  if (!exercises || !Array.isArray(exercises) || exercises.length === 0) return 0
  const validAccuracies = exercises
    .map(e => e.accuracy || 0)
    .filter(accuracy => accuracy > 0)
  if (validAccuracies.length === 0) return 0
  const sum = validAccuracies.reduce((acc, accuracy) => acc + accuracy, 0)
  return Math.round(sum / validAccuracies.length)
}

const getCorrectFormCount = (exercises) => {
  if (!exercises || !Array.isArray(exercises)) return 0
  return exercises.filter(e => e.correct_form === true).length
}

const formatExerciseTime = (timestamp) => {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

onMounted(() => {
  fetchWorkoutHistory()
})
</script>

<style scoped>
.group:hover {
  box-shadow: 0 8px 32px 0 rgba(80, 0, 120, 0.18);
  background: rgba(255,255,255,0.92);
}

.dark .group:hover {
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
  background: rgba(55, 65, 81, 0.95);
}
</style> 