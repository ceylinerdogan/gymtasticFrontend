<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 pb-20 px-4">
    <div class="pt-6 pb-4">
      <h2 class="text-2xl font-bold text-white text-center mb-2">Available Workouts</h2>
      <p class="text-white text-center opacity-90">Choose a workout to get started</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-500 bg-opacity-20 rounded-lg p-4 mx-4 mb-4">
      <p class="text-white text-center">{{ error }}</p>
      <button @click="fetchWorkoutTypes" class="w-full mt-2 bg-white bg-opacity-20 text-white py-2 rounded-lg">
        Retry
      </button>
    </div>

    <!-- Workout Types List -->
    <div v-else class="space-y-4 px-2">
      <div 
        v-for="workout in workoutTypes" 
        :key="workout.id"
        @click="selectWorkout(workout)"
        class="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm border border-white border-opacity-30 cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:bg-opacity-30 active:scale-[0.98]"
      >
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-lg font-bold text-white">{{ workout.name }}</h3>
          <div class="flex items-center space-x-2">
            <span class="bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
              {{ workout.difficulty || 'Beginner' }}
            </span>
          </div>
        </div>
        
        <p class="text-white opacity-90 text-sm mb-3 line-clamp-2">
          {{ workout.description || 'Complete workout routine' }}
        </p>
        
        <div class="flex items-center justify-between text-sm">
          <div class="flex items-center space-x-4">
            <span class="text-white opacity-80">
              ⏱️ {{ workout.estimated_duration || '30' }} min
            </span>
            <span class="text-white opacity-80">
              🔥 {{ Math.round((workout.estimated_duration || 30) * 8) }} cal
            </span>
          </div>
          <div class="text-white opacity-60">
            {{ workout.category || 'General' }}
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="workoutTypes.length === 0 && !loading" class="text-center py-12">
        <div class="text-6xl mb-4">🏋️‍♂️</div>
        <h3 class="text-xl font-bold text-white mb-2">No Workouts Available</h3>
        <p class="text-white opacity-80">Check back later for new workout programs</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '../router'

const workoutTypes = ref([])
const loading = ref(true)
const error = ref('')
const router = useRouter()

const fetchWorkoutTypes = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetchWithAuth('http://localhost:5000/api/workouts/types')
    
    if (response.ok) {
      const data = await response.json()
      workoutTypes.value = data.workout_types || data || []
    } else {
      const errorData = await response.json()
      error.value = errorData.message || 'Failed to load workout types'
    }
  } catch (e) {
    error.value = 'Could not connect to server'
  } finally {
    loading.value = false
  }
}

const selectWorkout = (workout) => {
  // For now, redirect to camera page to start the workout
  // In the future, you could show exercise details first
  router.push('/camera')
}

onMounted(() => {
  fetchWorkoutTypes()
})
</script> 