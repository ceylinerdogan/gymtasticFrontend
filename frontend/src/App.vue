<template>
  <router-view />
</template>

<script setup>
// No logic needed here for now
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
</style>
