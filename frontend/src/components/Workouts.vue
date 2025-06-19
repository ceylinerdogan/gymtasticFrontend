<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 pb-20">
    <!-- Header Section -->
    <div class="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
      <div class="max-w-lg mx-auto px-4 py-6">
        <h2 class="text-2xl font-bold text-white text-center mb-2">Workout Library</h2>
        <p class="text-white text-center opacity-90">Choose your perfect workout routine</p>
        
        <!-- Categories Scroll -->
        <div class="flex space-x-2 overflow-x-auto py-4 scrollbar-hide">
          <button 
            v-for="category in ['All', 'Cardio', 'Strength']" 
            :key="category"
            @click="filterCategory = category"
            :class="[
              'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all',
              filterCategory === category
                ? 'bg-white text-purple-600'
                : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
            ]"
          >
            {{ category }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-lg mx-auto px-4 pt-6">
      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
        <p class="text-white mt-4">Loading your workouts...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-500 bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center">
        <div class="text-3xl mb-2">😕</div>
        <p class="text-white mb-4">{{ error }}</p>
        <button 
          @click="fetchWorkoutTypes" 
          class="px-6 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-all"
        >
          Try Again
        </button>
      </div>

      <!-- Workout Types List -->
      <div v-else class="space-y-4">
        <div 
          v-for="workout in filteredWorkouts" 
          :key="workout.id"
          @click="selectWorkout(workout)"
          class="group bg-white bg-opacity-95 rounded-xl overflow-hidden shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-[1.02] hover:shadow-xl active:scale-[0.98]"
        >
          <!-- Workout Image/Banner -->
          <div class="h-32 bg-gradient-to-br from-purple-500 to-pink-500 relative overflow-hidden">
            <img 
              :src="getWorkoutImage(workout.category)"
              class="absolute inset-0 w-full h-full object-cover"
              alt="Workout thumbnail"
            />
            <div class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div class="absolute bottom-2 left-3 right-3 flex justify-between items-end">
              <div>
                <h3 class="text-lg font-bold text-white mb-1">{{ workout.name }}</h3>
                <div class="flex items-center space-x-3">
                  <span class="text-white/90 text-sm flex items-center">
                    <span class="mr-1">⏱️</span> {{ workout.estimated_duration || '30' }} min
                  </span>
                  <span class="text-white/90 text-sm flex items-center">
                    <span class="mr-1">🔥</span> {{ Math.round((workout.estimated_duration || 30) * 8) }} cal
                  </span>
                </div>
              </div>
              <div 
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-green-500': workout.difficulty === 'Beginner',
                  'bg-yellow-500': workout.difficulty === 'Intermediate',
                  'bg-red-500': workout.difficulty === 'Advanced',
                  'bg-purple-500': !workout.difficulty
                }"
              >
                {{ workout.difficulty || 'Beginner' }}
              </div>
            </div>
          </div>
          
          <!-- Workout Details -->
          <div class="p-4">
            <p class="text-gray-600 text-sm mb-3">
              {{ workout.description || 'Complete workout routine designed to help you achieve your fitness goals.' }}
            </p>
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-2">
                <span class="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-600">
                  {{ workout.category || 'General' }}
                </span>
              </div>
              <button class="text-purple-600 font-medium text-sm group-hover:underline">
                Start Workout →
              </button>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredWorkouts.length === 0 && !loading" class="text-center py-12 bg-white bg-opacity-10 backdrop-blur-sm rounded-xl">
          <div class="text-6xl mb-4">🏋️‍♂️</div>
          <h3 class="text-xl font-bold text-white mb-2">No Workouts Found</h3>
          <p class="text-white opacity-80">
            {{ filterCategory === 'All' 
              ? 'Check back later for new workout programs' 
              : `No ${filterCategory.toLowerCase()} workouts available yet` 
            }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { fetchWithAuth } from '../router'
import { API_BASE_URL } from '../config/environment.js'

const workoutTypes = ref([])
const loading = ref(true)
const error = ref('')
const router = useRouter()
const filterCategory = ref('All')

const getWorkoutImage = (category) => {
  const imageMap = {
    'Cardio': '/combined2.png',
    'Strength': '/combined.png',
    'General': '/combined.png'
  }
  return imageMap[category] || '/combined.png'
}

const filteredWorkouts = computed(() => {
  if (filterCategory.value === 'All') return workoutTypes.value
  return workoutTypes.value.filter(workout => 
    workout.category?.toLowerCase() === filterCategory.value.toLowerCase()
  )
})

const fetchWorkoutTypes = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const response = await fetchWithAuth(`${API_BASE_URL}/api/workouts/types`)
    
    if (response.ok) {
      const data = await response.json()
      const workouts = (data.workout_types || data || []).map(workout => {
        if (workout.name.toLowerCase().includes('burn') || workout.name.toLowerCase().includes('fat')) {
          workout.difficulty = 'Beginner'
          workout.estimated_duration = 20
          workout.calories = 150
          workout.description = "Perfect for beginners! Start your fitness journey with this gentle yet effective workout. Build confidence and strength at your own pace. Every champion was once a beginner!"
        } else if (workout.name.toLowerCase().includes('cardio')) {
          workout.difficulty = 'Intermediate'
          workout.estimated_duration = 35
          workout.calories = 300
          workout.description = "Take your fitness to the next level! This high-energy cardio session will boost your endurance and torch calories. Push your limits and feel the burn!"
        } else if (workout.name.toLowerCase().includes('muscle') || workout.name.toLowerCase().includes('gain')) {
          workout.difficulty = 'Advanced'
          workout.estimated_duration = 45
          workout.calories = 400
          workout.description = "Ready for a challenge? This intense workout combines strength and endurance to build serious muscle. Transform your body and unleash your full potential!"
        }
        return workout
      })
      workoutTypes.value = workouts
    } else {
      const errorData = await response.json()
      error.value = errorData.message || 'Failed to load workout types'
    }
  } catch (e) {
    error.value = 'Could not connect to server'
    // Provide some default workouts for testing
    workoutTypes.value = [
      {
        id: 1,
        name: 'Burn Your Fat',
        category: 'Cardio',
        difficulty: 'Beginner',
        estimated_duration: 20,
        calories: 150,
        description: "Perfect for beginners! Start your fitness journey with this gentle yet effective workout. Build confidence and strength at your own pace. Every champion was once a beginner!"
      },
      {
        id: 2,
        name: 'Do Cardio!',
        category: 'Cardio',
        difficulty: 'Intermediate',
        estimated_duration: 35,
        calories: 300,
        description: "Take your fitness to the next level! This high-energy cardio session will boost your endurance and torch calories. Push your limits and feel the burn!"
      },
      {
        id: 3,
        name: 'Gain Muscle',
        category: 'Strength',
        difficulty: 'Advanced',
        estimated_duration: 45,
        calories: 400,
        description: "Ready for a challenge? This intense workout combines strength and endurance to build serious muscle. Transform your body and unleash your full potential!"
      }
    ]
  } finally {
    loading.value = false
  }
}

const selectWorkout = (workout) => {
  router.push(`/workout-preview/${workout.id}`)
}

onMounted(() => {
  fetchWorkoutTypes()
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style> 