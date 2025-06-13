<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-b from-purple-400 to-pink-300">
    <div class="flex-1 flex flex-col items-center justify-center">
      <h2 class="text-2xl font-bold text-white mb-4">Hi, {{ userName }}</h2>
      <p class="text-white mb-6">Let's check your activity</p>
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-purple-700">5</div>
          <div class="text-white text-sm">Completed Workouts</div>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-purple-700">1</div>
          <div class="text-white text-sm">Workouts in Progress</div>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg p-4 text-center">
          <div class="text-2xl font-bold text-purple-700">30</div>
          <div class="text-white text-sm">Minutes Spent</div>
        </div>
      </div>
      <div class="grid grid-cols-3 gap-4 mb-6">
        <div class="bg-white bg-opacity-20 rounded-lg p-2 text-center">
          <div class="text-purple-700 font-bold">Squat</div>
          <div class="text-white text-xs">10 Reps • 3 Sets</div>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg p-2 text-center">
          <div class="text-purple-700 font-bold">Plank</div>
          <div class="text-white text-xs">40s Hold • 3 Sets</div>
        </div>
        <div class="bg-white bg-opacity-20 rounded-lg p-2 text-center">
          <div class="text-purple-700 font-bold">Lunge</div>
          <div class="text-white text-xs">10 Reps • 3 Sets</div>
        </div>
      </div>
      <div class="flex flex-col items-center mb-6">
        <img src="https://img.icons8.com/ios-filled/100/000000/dumbbell.png" alt="Workout" class="w-24 h-24 mb-2" />
        <button class="bg-purple-600 text-white px-8 py-2 rounded-lg font-semibold">Start Workout</button>
      </div>
      <div class="text-center text-white mb-4">Keep the progress! You're improving every day!</div>
    </div>
    <nav class="w-full bg-white bg-opacity-20 py-2 flex justify-around items-center rounded-t-xl">
      <router-link to="/" class="flex flex-col items-center text-purple-700">
        <span class="material-icons">home</span>
        <span class="text-xs">Home</span>
      </router-link>
      <router-link to="/workouts" class="flex flex-col items-center text-purple-700">
        <span class="material-icons">fitness_center</span>
        <span class="text-xs">Workouts</span>
      </router-link>
      <router-link to="/history" class="flex flex-col items-center text-purple-700">
        <span class="material-icons">history</span>
        <span class="text-xs">History</span>
      </router-link>
      <router-link to="/profile" class="flex flex-col items-center text-purple-700">
        <span class="material-icons">person</span>
        <span class="text-xs">Profile</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { fetchWithAuth } from '../router'

const userName = ref('[User Name]')

onMounted(async () => {
  try {
    const res = await fetchWithAuth('http://localhost:5000/api/users/profile')
    if (res.ok) {
      const data = await res.json()
      userName.value = data.profile?.full_name || '[User Name]'
    }
  } catch (e) {}
})
</script> 