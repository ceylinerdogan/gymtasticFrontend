<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 dark:from-gray-800 dark:to-gray-900 transition-colors duration-300">
    <!-- Header -->
    <div class="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 dark:bg-gray-800 dark:bg-opacity-90 dark:border-gray-600">
      <div class="max-w-lg mx-auto px-4 py-6">
        <div class="flex items-center justify-between mb-4">
          <button 
            @click="goBack"
            class="text-white hover:text-gray-200 transition-colors dark:text-gray-100 dark:hover:text-gray-300"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <h2 class="text-xl font-bold text-white dark:text-gray-100">Workout Preview</h2>
          <DarkModeToggle />
        </div>
      </div>
    </div>

    <!-- Videos -->
    <div class="max-w-lg mx-auto px-4 pt-6 pb-20">
      <div class="space-y-4">
        <!-- Squat -->
        <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg dark:shadow-gray-900/30 transition-colors duration-300">
          <h3 class="p-4 text-lg font-bold text-gray-900 dark:text-gray-100">Squat</h3>
          <video
            src="/videos/squat-demo.mp4"
            class="w-full h-48 object-cover"
            controls
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <!-- Plank -->
        <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg dark:shadow-gray-900/30 transition-colors duration-300">
          <h3 class="p-4 text-lg font-bold text-gray-900 dark:text-gray-100">Plank</h3>
          <video
            src="/videos/plank-demo.mp4"
            class="w-full h-48 object-cover"
            controls
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <!-- Lunge -->
        <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg dark:shadow-gray-900/30 transition-colors duration-300">
          <h3 class="p-4 text-lg font-bold text-gray-900 dark:text-gray-100">Lunge</h3>
          <video
            src="/videos/lunge-demo.mp4"
            class="w-full h-48 object-cover"
            controls
            preload="metadata"
          >
            Your browser does not support the video tag.
          </video>
        </div>

        <!-- Start Button -->
        <div class="sticky bottom-4 pt-4">
          <button
            @click="startWorkout"
            class="w-full bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-purple-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:from-purple-700 hover:to-pink-700 dark:hover:from-purple-600 dark:hover:to-purple-800 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div class="flex items-center justify-center space-x-2">
              <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <span>Start Workout</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'


const router = useRouter()
const route = useRoute()



const goBack = () => {
  router.back()
}

const startWorkout = () => {
  router.push(`/camera?workout=${route.params.workoutId || route.query.workout}`)
}
</script>

<style scoped>
video::-webkit-media-controls {
  background-color: rgba(0, 0, 0, 0.5);
}

video::-webkit-media-controls-panel {
  background-color: rgba(0, 0, 0, 0.5);
}
</style> 