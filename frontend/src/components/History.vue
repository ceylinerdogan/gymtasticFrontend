<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 pb-20 px-4">
    <div class="pt-6 pb-4">
      <h2 class="text-2xl font-bold text-white text-center mb-2">Workout History</h2>
      <p class="text-white text-center opacity-90">Track your fitness journey</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-500 bg-opacity-20 rounded-lg p-4 mx-4 mb-4">
      <p class="text-white text-center">{{ error }}</p>
      <button @click="fetchWorkoutHistory" class="w-full mt-2 bg-white bg-opacity-20 text-white py-2 rounded-lg">
        Retry
      </button>
    </div>

    <!-- History List -->
    <div v-else class="space-y-4 px-2">
      <div 
        v-for="session in workoutHistory" 
        :key="session.id"
        class="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-30"
      >
        <div class="mb-3">
          <h3 class="text-lg font-bold text-white">{{ session.workout_type || session.workout_name || 'Workout Session' }}</h3>
          <p class="text-white opacity-70 text-sm">{{ formatDate(session.date || session.start_time || session.created_at) }}</p>
        </div>
        
        <div class="bg-white bg-opacity-10 rounded-lg p-3 text-sm">
          <div class="text-white opacity-70 text-xs uppercase tracking-wide mb-1">Duration</div>
          <div class="text-white font-bold">{{ formatDuration(session.duration) }}</div>
        </div>

        <!-- Exercise Performance (if available) -->
        <div v-if="session.exercises && session.exercises.length > 0" class="mt-3 pt-3 border-t border-white border-opacity-20">
          <div class="text-white opacity-70 text-xs uppercase tracking-wide mb-2">Exercises Completed</div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="exercise in session.exercises.slice(0, 3)" 
              :key="exercise.id"
              class="bg-purple-600 text-white text-xs px-2 py-1 rounded-full"
            >
              {{ exercise.name }}
            </span>
            <span 
              v-if="session.exercises.length > 3"
              class="bg-gray-600 text-white text-xs px-2 py-1 rounded-full"
            >
              +{{ session.exercises.length - 3 }} more
            </span>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="workoutHistory.length === 0 && !loading" class="text-center py-12">
        <div class="text-6xl mb-4">📊</div>
        <h3 class="text-xl font-bold text-white mb-2">No Workout History</h3>
        <p class="text-white opacity-80 mb-4">Start your first workout to see your progress here</p>
        <button @click="$router.push('/')" class="bg-purple-600 text-white px-6 py-2 rounded-lg font-semibold">
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
  
  // If duration is in seconds
  if (typeof duration === 'number') {
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}m ${seconds}s`
  }
  
  // If duration is already formatted or in minutes
  if (typeof duration === 'string') {
    return duration.includes('min') ? duration : `${duration} min`
  }
  
  return duration.toString()
}

const getStatusClass = (completed, status) => {
  // Handle boolean completed field first
  if (typeof completed === 'boolean') {
    return completed ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'
  }
  
  // Handle string status field
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'bg-green-500 text-white'
    case 'in_progress':
      return 'bg-yellow-500 text-black'
    case 'paused':
      return 'bg-orange-500 text-white'
    case 'cancelled':
    case 'stopped':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-500 text-white'
  }
}

const getStatusText = (completed, status) => {
  // Handle boolean completed field first
  if (typeof completed === 'boolean') {
    return completed ? 'Completed' : 'In Progress'
  }
  
  // Handle string status field
  switch (status?.toLowerCase()) {
    case 'completed':
      return 'Completed'
    case 'in_progress':
      return 'In Progress'
    case 'paused':
      return 'Paused'
    case 'cancelled':
    case 'stopped':
      return 'Stopped'
    default:
      return 'Unknown'
  }
}

onMounted(() => {
  fetchWorkoutHistory()
})
</script> 