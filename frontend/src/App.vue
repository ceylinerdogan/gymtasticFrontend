<template>
  <div class="app-container dark:bg-gray-900 transition-colors duration-300">
    <!-- Dark Mode Toggle -->
    <div v-if="shouldShowDarkModeToggle" class="fixed top-4 right-4 z-50">
      <DarkModeToggle />
    </div>
    
    <router-view class="main-content" :class="{ 'with-nav': shouldShowNavigation }" />
    
    <!-- Bottom Navigation Bar -->
    <nav v-if="shouldShowNavigation" class="fixed bottom-0 left-0 right-0 w-full bg-neutral-900 dark:bg-gray-800 py-2 flex justify-around items-center rounded-t-xl z-50 shadow-lg transition-colors duration-300">
      <router-link to="/" class="flex flex-col items-center text-purple-700">
        <span class="material-icons" style="font-size:1.4rem;">🏠</span>
        <span class="text-sm font-bold text-white mt-0.5">Home</span>
      </router-link>
      <router-link to="/workouts" class="flex flex-col items-center text-purple-700">
        <span class="material-icons" style="font-size:1.4rem;">🏋️‍♂️</span>
        <span class="text-sm font-bold text-white mt-0.5">Workouts</span>
      </router-link>
      <router-link to="/history" class="flex flex-col items-center text-purple-700">
        <span class="material-icons" style="font-size:1.4rem;">📊</span>
        <span class="text-sm font-bold text-white mt-0.5">History</span>
      </router-link>
      <router-link to="/profile" class="flex flex-col items-center text-purple-700">
        <span class="material-icons" style="font-size:1.4rem;">👤</span>
        <span class="text-sm font-bold text-white mt-0.5">Profile</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import DarkModeToggle from './components/DarkModeToggle.vue'
import { useDarkMode } from './composables/useDarkMode'

const route = useRoute()

// Initialize dark mode
const { isDarkMode } = useDarkMode()

// Pages that should NOT show the navigation bar
const pagesWithoutNavigation = ['/login', '/register', '/create-profile']

// Pages that should NOT show the dark mode toggle (fullscreen interfaces)
const pagesWithoutDarkModeToggle = ['/login', '/register', '/create-profile', '/camera']

const shouldShowNavigation = computed(() => {
  return !pagesWithoutNavigation.includes(route.path)
})

const shouldShowDarkModeToggle = computed(() => {
  return !pagesWithoutDarkModeToggle.includes(route.path)
})
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background: #000;
  transition: background-color 0.3s ease;
}

html.dark, body.dark {
  background: #111827;
}

#app {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app-container {
  width: 100%;
  height: 100%;
  position: relative;
}

/* Emergency fallback button that is always visible */
#emergency-camera-button {
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10000;
  padding: 15px 40px;
  font-size: 24px;
  font-weight: bold;
  background: #4CAF50;
  color: white;
  border: 3px solid white;
  border-radius: 12px;
  cursor: pointer;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
}

#emergency-camera-button.started {
  background: #f44336;
}

/* App Layout Styles */
.app-container {
  width: 100%;
  height: 100vh;
  position: relative;
}

.main-content {
  width: 100%;
  height: 100%;
  overflow-y: auto;
}

.main-content.with-nav {
  padding-bottom: 80px; /* Space for navigation bar */
}

/* Navigation styles */
nav {
  background: #18181b !important; /* dark neutral for professional look */
  box-shadow: 0 0 16px 0 rgba(0,0,0,0.12);
}
nav .router-link-active {
  color: #8b5cf6 !important;
}
nav .router-link-active span {
  color: white !important;
  font-weight: bold;
}
</style>
