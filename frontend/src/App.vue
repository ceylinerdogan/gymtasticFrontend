<template>
  <div class="app-container">
    <router-view class="main-content" :class="{ 'with-nav': shouldShowNavigation }" />
    
    <!-- Bottom Navigation Bar -->
    <nav v-if="shouldShowNavigation" class="fixed bottom-0 left-0 right-0 w-full bg-white bg-opacity-20 py-2 flex justify-around items-center rounded-t-xl z-50">
      <router-link to="/" class="flex flex-col items-center text-purple-700">
        <span class="material-icons">🏠</span>
        <span class="text-xs text-white">Home</span>
      </router-link>
      <router-link to="/workouts" class="flex flex-col items-center text-purple-700">
        <span class="material-icons">🏋️‍♂️</span>
        <span class="text-xs text-white">Workouts</span>
      </router-link>
      <router-link to="/history" class="flex flex-col items-center text-purple-700">
        <span class="material-icons">📊</span>
        <span class="text-xs text-white">History</span>
      </router-link>
      <router-link to="/profile" class="flex flex-col items-center text-purple-700">
        <span class="material-icons">👤</span>
        <span class="text-xs text-white">Profile</span>
      </router-link>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// Pages that should NOT show the navigation bar
const pagesWithoutNavigation = ['/login', '/register', '/create-profile']

const shouldShowNavigation = computed(() => {
  return !pagesWithoutNavigation.includes(route.path)
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
nav .router-link-active {
  color: #8b5cf6 !important;
}

nav .router-link-active span {
  color: white !important;
  font-weight: bold;
}
</style>
