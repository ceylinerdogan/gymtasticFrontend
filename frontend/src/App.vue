<script setup>
import { ref } from 'vue';
import CameraPage from './components/CameraPage.vue';

// Backend WebSocket URL (configurable via environment variable)
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'localhost:5000';

// Track the selected exercise
const selectedExercise = ref('squat');

// Start camera status - initialize to false
const isCameraStarted = ref(false);

// Handle camera start/stop
function toggleCamera() {
  console.log('App.vue: Toggling camera state from', isCameraStarted.value, 'to', !isCameraStarted.value);
  isCameraStarted.value = !isCameraStarted.value;
}
</script>

<template>
  <div id="app-container">
    <CameraPage />
  </div>
</template>

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
</style>
