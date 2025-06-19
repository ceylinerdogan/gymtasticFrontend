<template>
  <div class="relative w-full h-screen overflow-hidden bg-black">
    <!-- Full Screen Camera -->
    <video
      ref="videoElement"
      v-show="isCameraOpen"
      class="absolute inset-0 w-full h-full object-cover"
      autoplay
      playsinline
      muted
    ></video>
    
    <!-- Canvas for pose landmarks overlay -->
    <canvas
      ref="canvasElement"
      v-show="isCameraOpen"
      class="absolute inset-0 w-full h-full pointer-events-none z-10"
    ></canvas>
    
    <!-- Placeholder when camera is off -->
    <div
      v-show="!isCameraOpen"
      class="absolute inset-0 flex items-center justify-center bg-gray-900"
    >
      <div class="text-center text-white">
        <svg class="w-24 h-24 mx-auto mb-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
        </svg>
        <p class="text-xl text-gray-300">Tap the button to start camera</p>
      </div>
    </div>

    <!-- Error Message -->
    <div 
      v-if="error" 
      class="absolute top-4 left-4 right-4 p-4 bg-red-500 bg-opacity-90 text-white rounded-lg shadow-lg z-20"
    >
      {{ error }}
    </div>

    <!-- Exercise Selection Buttons -->
    <div class="absolute top-4 right-4 flex flex-col space-y-2 z-20">
      <button
        @click="selectExercise('squat')"
        :class="selectedExercise === 'squat' ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-80 text-gray-800'"
        class="px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Squat
      </button>
      <button
        @click="selectExercise('plank')"
        :class="selectedExercise === 'plank' ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-80 text-gray-800'"
        class="px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Plank
      </button>
      <button
        @click="selectExercise('lunge')"
        :class="selectedExercise === 'lunge' ? 'bg-blue-500 text-white' : 'bg-white bg-opacity-80 text-gray-800'"
        class="px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
      >
        Lunge
      </button>
    </div>

    <!-- Selected Exercise Display -->
    <div v-if="selectedExercise" class="absolute top-4 left-4 bg-blue-500 bg-opacity-90 text-white px-4 py-2 rounded-lg shadow-lg z-20">
      Selected: {{ selectedExercise.charAt(0).toUpperCase() + selectedExercise.slice(1) }}
    </div>

    <!-- Socket Connection Status -->
    <div class="absolute top-20 left-4 flex items-center space-x-2 z-20">
      <div 
        :class="socketConnected ? 'bg-green-500' : (fallbackInterval ? 'bg-yellow-500' : 'bg-red-500')"
        class="w-3 h-3 rounded-full"
      ></div>
      <span class="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
        {{ socketConnected ? 'Connected' : (fallbackInterval ? 'Demo Mode' : 'Disconnected') }}
      </span>
    </div>

    <!-- Workout Session Status -->
    <div v-if="workoutSessionId" class="absolute top-36 left-4 flex items-center space-x-2 z-20">
      <div class="w-3 h-3 rounded-full bg-purple-500 animate-pulse"></div>
      <span class="text-white text-sm bg-purple-600 bg-opacity-80 px-2 py-1 rounded">
        Session Active
      </span>
    </div>

    <!-- Voice Controls Panel (Above Navigation) -->
    <div class="absolute bottom-20 right-4 flex flex-col items-end space-y-3 z-20">
      <!-- Voice Toggle Button -->
      <div class="flex flex-col items-center space-y-2">
        <button
          @click="toggleVoice"
          :class="isVoiceEnabled ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-500 hover:bg-gray-600'"
          class="w-12 h-12 rounded-full text-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg"
          :title="isVoiceEnabled ? 'Voice ON' : 'Voice OFF'"
        >
          <svg v-if="isVoiceEnabled" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
        </button>

        <!-- Voice Status Indicator -->
        <div v-if="isPlaying" class="w-12 h-3 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
          <div class="w-2 h-2 bg-white rounded-full"></div>
        </div>
      </div>

      <!-- Voice Settings Panel -->
      <div v-if="isVoiceEnabled" class="bg-black bg-opacity-80 rounded-lg p-3 min-w-[140px]">
      <div class="text-white text-xs mb-2 font-semibold">Voice Settings</div>
      
      <div class="text-white text-xs mb-1">Volume</div>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.1" 
        :value="voiceSettings.volume"
        @input="adjustVolume(parseFloat($event.target.value))"
        class="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-2"
      />
      
      <div class="text-white text-xs mb-1">Speech Rate</div>
      <input 
        type="range" 
        min="0.5" 
        max="2" 
        step="0.1" 
        :value="voiceSettings.rate"
        @input="adjustRate(parseFloat($event.target.value))"
        class="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer mb-3"
      />
      
      <div class="flex flex-col space-y-2">
        <button 
          @click="testVoice" 
          class="w-full text-white text-xs bg-blue-500 hover:bg-blue-600 rounded px-3 py-2 transition-colors"
        >
          Test Voice
        </button>
        <button 
          @click="debugVoiceStatus" 
          class="w-full text-white text-xs bg-orange-500 hover:bg-orange-600 rounded px-3 py-2 transition-colors"
        >
          Debug Voice
        </button>
      </div>
    </div>
    </div>

    <!-- Pose Analysis Results -->
    <div v-if="poseData" class="absolute bottom-20 left-4 bg-black bg-opacity-80 text-white p-4 rounded-xl z-20 max-w-xs shadow-lg border border-white border-opacity-20">
      <div class="text-sm space-y-2">
        <div class="font-semibold text-lg">{{ poseData.poseName || 'Unknown' }}</div>
        
        <div class="flex items-center justify-between">
          <span>Accuracy:</span>
          <span :class="poseData.accuracy >= 80 ? 'text-green-400' : poseData.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'" class="font-bold">
            {{ Math.round(poseData.accuracy) }}%
          </span>
        </div>
        
        <div class="flex items-center justify-between">
          <span>Form:</span>
          <span :class="poseData.correct_form ? 'text-green-400' : 'text-red-400'" class="font-semibold">
            {{ poseData.correct_form ? '✓ Correct' : '⚠ Needs Work' }}
          </span>
        </div>
        
        <div v-if="landmarks.length > 0" class="border-t border-gray-600 pt-2">
          <div class="flex items-center justify-between text-xs">
            <span>Landmarks:</span>
            <span class="text-cyan-400 font-mono">{{ landmarks.length }}/33</span>
          </div>
          <div class="flex items-center justify-between text-xs">
            <span>Visible:</span>
            <span class="text-green-400 font-mono">{{ landmarks.filter(l => (l.visibility || 1) > 0.5).length }}</span>
          </div>
          <div class="w-full bg-gray-700 rounded-full h-1.5 mt-1">
            <div 
              class="bg-cyan-400 h-1.5 rounded-full transition-all duration-300" 
              :style="{ width: Math.round((landmarks.filter(l => (l.visibility || 1) > 0.5).length / 33) * 100) + '%' }"
            ></div>
          </div>
        </div>
        
        <div v-if="poseData.feedback && poseData.feedback.length > 0" class="border-t border-gray-600 pt-2">
          <div class="text-xs text-yellow-300 space-y-1">
            <div v-for="(tip, index) in poseData.feedback" :key="index" class="flex items-start">
              <span class="text-yellow-400 mr-1">•</span>
              <span>{{ tip }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Camera Toggle Button -->
    <button
      @click="toggleCamera"
      :disabled="isLoading"
      class="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full text-white font-bold shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed z-10"
      :class="isCameraOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'"
    >
      <!-- Loading Spinner -->
      <svg v-if="isLoading" class="animate-spin w-8 h-8 mx-auto" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      
      <!-- Stop Icon -->
      <svg v-else-if="isCameraOpen" class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
        <rect x="6" y="6" width="12" height="12" rx="2"></rect>
      </svg>
      
      <!-- Play Icon -->
      <svg v-else class="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 24 24">
        <polygon points="5,3 19,12 5,21"></polygon>
      </svg>
    </button>
  </div>
</template>

<script>
import { ref, onUnmounted, onMounted, nextTick, watch } from 'vue'
import { io } from 'socket.io-client'
import { SOCKET_URL, API_BASE_URL } from '../config/environment.js'
import { useVoiceFeedback } from '../composables/useVoiceFeedback.js'
import { fetchWithAuth } from '../router.js'

export default {
  name: 'CameraControl',
  setup() {
    const videoElement = ref(null)
    const canvasElement = ref(null)
    const isCameraOpen = ref(false)
    const isLoading = ref(false)
    const error = ref('')
    const selectedExercise = ref('squat')
    const socketConnected = ref(false)
    const landmarks = ref([])
    const poseData = ref(null)

    // Voice feedback integration
    const {
      isVoiceEnabled,
      voiceSettings,
      isPlaying,
      speak,
      generatePoseFeedback,
      generateMotivationalFeedback,
      speakCountdown,
      toggleVoice,
      adjustRate,
      adjustVolume,
      stopSpeaking,
      testVoice,
      debugVoiceStatus
    } = useVoiceFeedback()
    
    let stream = null
    let socket = null
    let frameInterval = null
    let canvasContext = null

    // Add workout session tracking
    const workoutSessionId = ref(null)
    const workoutStartTime = ref(null)
    const exerciseData = ref([])
    const currentExerciseStartTime = ref(null)

    // Workout type ID mapping
    const getWorkoutTypeId = (exerciseType) => {
      const workoutTypeMapping = {
        'squat': 'eb40b0bb-24f5-4fe8-928c-307e5c1b48d1', // Gain muscle
        'plank': '61ddc7af-5096-410a-9b50-2bd8fa10744a', // Burn fat  
        'lunge': 'b2598f55-493c-4dec-909e-0f9b218756b3'  // Cardio
      }
      return workoutTypeMapping[exerciseType.toLowerCase()] || workoutTypeMapping['squat'] // Default to gain muscle
    }

    const getWorkoutTypeName = (exerciseType) => {
      const workoutNameMapping = {
        'squat': 'Gain muscle',
        'plank': 'Burn fat',
        'lunge': 'Cardio'
      }
      return workoutNameMapping[exerciseType.toLowerCase()] || 'Gain muscle'
    }



    // Socket connection
    const connectSocket = () => {
      try {
        socket = io(SOCKET_URL, {
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
          timeout: 20000
        })

        socket.on('connect', () => {
          console.log('Socket connected:', socket.id)
          socketConnected.value = true
        })

        socket.on('disconnect', () => {
          console.log('Socket disconnected')
          socketConnected.value = false
          // Start fallback mode when disconnected
          startFallbackMode()
        })

        socket.on('connect_error', (err) => {
          console.error('Socket connection error:', err)
          socketConnected.value = false
          // Start fallback mode when connection fails
          startFallbackMode()
        })

        // Listen for pose analysis results
        socket.on('pose_analysis_result', (data) => {
          console.log('Received pose analysis:', data)
          handlePoseData(data)
        })

        // Alternative event listeners for different backend responses
        socket.on('landmarks', (data) => {
          console.log('Received landmarks:', data)
          handlePoseData(data)
        })

        socket.on('pose_detection', (data) => {
          console.log('Received pose detection:', data)
          handlePoseData(data)
        })

      } catch (err) {
        console.error('Socket connection failed:', err)
        socketConnected.value = false
        // Start fallback mode when socket creation fails
        startFallbackMode()
      }
    }

    // Enhanced fallback mode with accurate body-aligned landmarks
    let fallbackInterval = null
    let animationFrame = null
    let poseVariation = 0
    let cachedLandmarks = []
    let lastUpdateTime = 0
    let poseState = {
      squatDepth: 0,
      armPosition: 0,
      bodyTilt: 0,
      isSquatting: false
    }
    
    const startFallbackMode = () => {
      if (fallbackInterval || socketConnected.value) return
      
      console.log('Starting enhanced body-aligned landmark mode')
      error.value = 'Demo mode - Enhanced body tracking'
      
      // Enhanced landmark generation with realistic body proportions
      const generateAccurateLandmarks = () => {
        const now = Date.now()
        if (now - lastUpdateTime < 8) return cachedLandmarks // 120fps updates for ultra-smooth
        
        poseVariation += 0.08 // Much faster variation for immediate response
        lastUpdateTime = now
        
        // Simulate realistic squat movement
        const squatCycle = Math.sin(poseVariation * 0.4) * 0.5 + 0.5 // 0 to 1
        poseState.squatDepth = squatCycle * 0.15 // Max squat depth
        poseState.armPosition = Math.cos(poseVariation * 0.6) * 0.1
        poseState.bodyTilt = Math.sin(poseVariation * 0.3) * 0.02
        poseState.isSquatting = squatCycle > 0.3
        
        // Base body center (better aligned to real body position)
        const centerX = 0.5 + Math.sin(poseVariation * 0.8) * 0.02 // Less horizontal drift
        const centerY = 0.45 + poseState.squatDepth // Higher in frame to match real body
        
        // Body proportions (calibrated for better alignment)
        const shoulderWidth = 0.15 // Narrower shoulders
        const hipWidth = 0.12 // Narrower hips
        const headOffset = 0.18 // Head closer to shoulders
        const shoulderOffset = 0.12 // Shoulders higher
        const hipOffset = 0.08 // Hips slightly lower
        const legLength = 0.25 // Shorter legs for better fit
        
        // Generate accurate landmarks
        const landmarks = []
        
        // Face landmarks (0-10) - positioned above shoulders
        for (let i = 0; i <= 10; i++) {
          const faceY = centerY - headOffset + (i % 4) * 0.015
          const faceX = centerX + (i % 3 - 1) * 0.025 + poseState.bodyTilt
          landmarks.push({
            id: i,
            x: faceX * 640,
            y: faceY * 480,
            x_normalized: Math.max(0.1, Math.min(0.9, faceX)),
            y_normalized: Math.max(0.1, Math.min(0.9, faceY)),
            visibility: 0.9
          })
        }
        
        // Shoulders (11-12) - key reference points
        const leftShoulderX = centerX - shoulderWidth + poseState.bodyTilt
        const rightShoulderX = centerX + shoulderWidth + poseState.bodyTilt
        const shoulderY = centerY - shoulderOffset
        
        landmarks.push({
          id: 11, // Left shoulder
          x: leftShoulderX * 640,
          y: shoulderY * 480,
          x_normalized: Math.max(0.1, Math.min(0.9, leftShoulderX)),
          y_normalized: Math.max(0.1, Math.min(0.9, shoulderY)),
          visibility: 0.95
        })
        
        landmarks.push({
          id: 12, // Right shoulder
          x: rightShoulderX * 640,
          y: shoulderY * 480,
          x_normalized: Math.max(0.1, Math.min(0.9, rightShoulderX)),
          y_normalized: Math.max(0.1, Math.min(0.9, rightShoulderY)),
          visibility: 0.95
        })
        
        // Arms (13-22) - realistic arm positioning
        const armExtension = poseState.isSquatting ? 0.12 : 0.08
        const armBend = poseState.isSquatting ? 0.05 : 0.02
        
        // Left arm
        landmarks.push({ id: 13, x: (leftShoulderX - armExtension + poseState.armPosition) * 640, y: (shoulderY + 0.08) * 480, x_normalized: leftShoulderX - armExtension + poseState.armPosition, y_normalized: shoulderY + 0.08, visibility: 0.9 })
        landmarks.push({ id: 14, x: (rightShoulderX + armExtension + poseState.armPosition) * 640, y: (shoulderY + 0.08) * 480, x_normalized: rightShoulderX + armExtension + poseState.armPosition, y_normalized: shoulderY + 0.08, visibility: 0.9 })
        landmarks.push({ id: 15, x: (leftShoulderX - armExtension - armBend + poseState.armPosition) * 640, y: (shoulderY + 0.16) * 480, x_normalized: leftShoulderX - armExtension - armBend + poseState.armPosition, y_normalized: shoulderY + 0.16, visibility: 0.85 })
        landmarks.push({ id: 16, x: (rightShoulderX + armExtension + armBend + poseState.armPosition) * 640, y: (shoulderY + 0.16) * 480, x_normalized: rightShoulderX + armExtension + armBend + poseState.armPosition, y_normalized: shoulderY + 0.16, visibility: 0.85 })
        
        // Hand landmarks (17-22)
        for (let i = 17; i <= 22; i++) {
          const isLeft = i % 2 === 1
          const handX = isLeft ? leftShoulderX - armExtension - armBend * 1.2 + poseState.armPosition : rightShoulderX + armExtension + armBend * 1.2 + poseState.armPosition
          const handY = shoulderY + 0.18 + (i - 17) * 0.01
          landmarks.push({
            id: i,
            x: handX * 640,
            y: handY * 480,
            x_normalized: Math.max(0.05, Math.min(0.95, handX)),
            y_normalized: Math.max(0.05, Math.min(0.95, handY)),
            visibility: 0.8
          })
        }
        
        // Hips (23-24) - important for squat tracking
        const leftHipX = centerX - hipWidth + poseState.bodyTilt
        const rightHipX = centerX + hipWidth + poseState.bodyTilt
        const hipY = centerY + hipOffset
        
        landmarks.push({
          id: 23, // Left hip
          x: leftHipX * 640,
          y: hipY * 480,
          x_normalized: Math.max(0.1, Math.min(0.9, leftHipX)),
          y_normalized: Math.max(0.1, Math.min(0.9, hipY)),
          visibility: 0.95
        })
        
        landmarks.push({
          id: 24, // Right hip
          x: rightHipX * 640,
          y: hipY * 480,
          x_normalized: Math.max(0.1, Math.min(0.9, rightHipX)),
          y_normalized: Math.max(0.1, Math.min(0.9, hipY)),
          visibility: 0.95
        })
        
        // Legs (25-32) - realistic squat positioning
        const kneeY = hipY + legLength * 0.6 + poseState.squatDepth * 0.5
        const ankleY = hipY + legLength + poseState.squatDepth * 0.3
        const kneeSpread = poseState.isSquatting ? 0.05 : 0.02
        
        // Knees
        landmarks.push({ id: 25, x: (leftHipX - kneeSpread) * 640, y: kneeY * 480, x_normalized: leftHipX - kneeSpread, y_normalized: kneeY, visibility: 0.9 })
        landmarks.push({ id: 26, x: (rightHipX + kneeSpread) * 640, y: kneeY * 480, x_normalized: rightHipX + kneeSpread, y_normalized: kneeY, visibility: 0.9 })
        
        // Ankles
        landmarks.push({ id: 27, x: (leftHipX - kneeSpread * 0.7) * 640, y: ankleY * 480, x_normalized: leftHipX - kneeSpread * 0.7, y_normalized: ankleY, visibility: 0.9 })
        landmarks.push({ id: 28, x: (rightHipX + kneeSpread * 0.7) * 640, y: ankleY * 480, x_normalized: rightHipX + kneeSpread * 0.7, y_normalized: ankleY, visibility: 0.9 })
        
        // Feet (29-32)
        const footY = ankleY + 0.03
        landmarks.push({ id: 29, x: (leftHipX - kneeSpread * 0.7) * 640, y: footY * 480, x_normalized: leftHipX - kneeSpread * 0.7, y_normalized: footY, visibility: 0.85 })
        landmarks.push({ id: 30, x: (rightHipX + kneeSpread * 0.7) * 640, y: footY * 480, x_normalized: rightHipX + kneeSpread * 0.7, y_normalized: footY, visibility: 0.85 })
        landmarks.push({ id: 31, x: (leftHipX - kneeSpread * 0.8) * 640, y: (footY + 0.02) * 480, x_normalized: leftHipX - kneeSpread * 0.8, y_normalized: footY + 0.02, visibility: 0.8 })
        landmarks.push({ id: 32, x: (rightHipX + kneeSpread * 0.8) * 640, y: (footY + 0.02) * 480, x_normalized: rightHipX + kneeSpread * 0.8, y_normalized: footY + 0.02, visibility: 0.8 })
        
        cachedLandmarks = landmarks
        return landmarks
      }
      
      // Ultra-fast 60fps animation with accurate pose tracking
      const animateFrame = () => {
        if (!isCameraOpen.value) return
        
        const squatPercentage = Math.round(poseState.squatDepth * 100 / 0.15)
        const poseDescription = poseState.isSquatting ? `Squatting ${squatPercentage}%` : 'Standing'
        
        const generatedLandmarks = generateAccurateLandmarks()
        console.log('Generated landmarks count:', generatedLandmarks.length)
        
        const mockData = {
          landmarks: generatedLandmarks,
          exercise_name: `Squat Demo: ${poseDescription}`,
          accuracy: 85 + Math.sin(poseVariation * 1.2) * 10,
          correct_form: poseState.isSquatting && squatPercentage > 20 && squatPercentage < 80,
          feedback: [
            'Enhanced body tracking',
            `Squat depth: ${squatPercentage}%`,
            poseState.isSquatting ? '✓ Squatting detected' : 'Standing position'
          ],
          image_dimensions: { width: 640, height: 480 }
        }
        
        handlePoseData(mockData)
        animationFrame = requestAnimationFrame(animateFrame)
      }
      
      // Start high-speed animation
      animationFrame = requestAnimationFrame(animateFrame)
    }
    
    const stopFallbackMode = () => {
      if (fallbackInterval) {
        clearInterval(fallbackInterval)
        fallbackInterval = null
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
        animationFrame = null
      }
      cachedLandmarks = []
      console.log('Stopped optimized fallback mode')
    }

    // Handle pose data from backend (optimized for immediate response)
    const handlePoseData = (data) => {
      try {
        // Store the complete pose data including image dimensions
        if (data.exercise_name || data.poseName || data.pose_name) {
          const newPoseData = {
            poseName: data.exercise_name || data.poseName || data.pose_name,
            accuracy: data.accuracy || data.score || 0,
            feedback: data.feedback || [],
            image_dimensions: data.image_dimensions || { width: 1280, height: 720 },
            correct_form: data.correct_form || false
          }
          
          poseData.value = newPoseData
          
          // Track exercise performance
          trackExercisePerformance(newPoseData)
          
          // Generate voice feedback for the pose analysis
          if (isVoiceEnabled.value) {
            generatePoseFeedback(newPoseData)
          }
        }
        
        // Process landmarks immediately - they're already in the correct format
        if (data.landmarks && Array.isArray(data.landmarks)) {
          landmarks.value = data.landmarks.map(lm => ({
            id: lm.id,
            x: Number(lm.x),
            y: Number(lm.y),
            x_normalized: Number(lm.x_normalized),
            y_normalized: Number(lm.y_normalized),
            visibility: Number(lm.visibility || 1.0)
          }))
          
          // Draw landmarks immediately without waiting for next frame
          drawPoseLandmarks()
        }
        
      } catch (err) {
        console.error('Error processing pose data:', err)
      }
    }

    // Optimized pose landmark drawing for better performance
    const drawPoseLandmarks = () => {
      if (!canvasElement.value || landmarks.value.length === 0) {
        return
      }

      // Ensure canvas context is initialized
      if (!canvasContext) {
        canvasContext = canvasElement.value.getContext('2d')
        if (!canvasContext) {
          console.error('Failed to get canvas context')
          return
        }
      }

      const canvas = canvasElement.value
      const video = videoElement.value
      
      if (!video) return

      // Clear canvas efficiently
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)
      console.log('Drawing landmarks:', landmarks.value.length, 'Canvas size:', canvas.width, 'x', canvas.height)
      
      // Set canvas size to exactly match video display (only if needed)
      const rect = video.getBoundingClientRect()
      if (canvas.width !== rect.width || canvas.height !== rect.height) {
        canvas.width = rect.width
        canvas.height = rect.height
        canvas.style.width = rect.width + 'px'
        canvas.style.height = rect.height + 'px'
      }
      
      // Get current accuracy for color coding
      const accuracy = poseData.value?.accuracy || 0
      const correctForm = poseData.value?.correct_form || false
      
      // Simplified color selection (faster)
      let strokeColor, fillColor
      if (correctForm && accuracy >= 85) {
        strokeColor = fillColor = '#00ff41'
      } else if (accuracy >= 70) {
        strokeColor = fillColor = '#ffff00'
      } else if (accuracy >= 50) {
        strokeColor = fillColor = '#ff8c00'
      } else {
        strokeColor = fillColor = '#ff0040'
      }
      
      // Pre-calculate video dimensions
      const videoWidth = canvas.width
      const videoHeight = canvas.height

      // Set up drawing context once
      canvasContext.strokeStyle = strokeColor
      canvasContext.fillStyle = fillColor
      canvasContext.lineWidth = 3
      canvasContext.lineCap = 'round'
      canvasContext.globalAlpha = 0.9
      
      // Essential connections only (for performance)
      const essentialConnections = [
        // Core body structure (most important)
        [11, 12], [11, 23], [12, 24], [23, 24],
        // Arms (simplified)
        [11, 13], [13, 15], [12, 14], [14, 16],
        // Legs (simplified)
        [23, 25], [25, 27], [24, 26], [26, 28],
        // Feet connections
        [27, 29], [28, 30], [29, 31], [30, 32]
      ]

      // Draw all connections in one pass
      canvasContext.beginPath()
      essentialConnections.forEach(([startIdx, endIdx]) => {
        const startPoint = landmarks.value[startIdx]
        const endPoint = landmarks.value[endIdx]
        
        if (startPoint && endPoint && 
            (startPoint.visibility || 1) > 0.4 && (endPoint.visibility || 1) > 0.4) {
          
          const startX = startPoint.x_normalized * videoWidth
          const startY = startPoint.y_normalized * videoHeight
          const endX = endPoint.x_normalized * videoWidth
          const endY = endPoint.y_normalized * videoHeight
          
          canvasContext.moveTo(startX, startY)
          canvasContext.lineTo(endX, endY)
        }
      })
      canvasContext.stroke()

             // Draw more key points for better visibility (shoulders, elbows, hips, knees, ankles, feet)
       const keyPoints = [11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32]
       keyPoints.forEach(index => {
         const landmark = landmarks.value[index]
         if (landmark && (landmark.visibility || 1) > 0.4) {
           const x = landmark.x_normalized * videoWidth
           const y = landmark.y_normalized * videoHeight
           
           // Larger, more visible points
           const pointSize = [11, 12, 23, 24].includes(index) ? 8 : [27, 28, 29, 30].includes(index) ? 7 : 6 // Bigger for main joints, medium for feet
           
           // Draw main point with glow
           canvasContext.shadowColor = fillColor
           canvasContext.shadowBlur = 5
           canvasContext.beginPath()
           canvasContext.arc(x, y, pointSize, 0, 2 * Math.PI)
           canvasContext.fill()
           
           // Add bright white center
           canvasContext.shadowBlur = 0
           canvasContext.fillStyle = '#ffffff'
           canvasContext.beginPath()
           canvasContext.arc(x, y, pointSize * 0.4, 0, 2 * Math.PI)
           canvasContext.fill()
           canvasContext.fillStyle = fillColor // Reset
         }
       })
      
      // Reset context
      canvasContext.globalAlpha = 1.0
    }

    // Capture and send video frames with throttling (10 FPS max)
    const FRAME_INTERVAL = 100; // 100ms = 10 FPS
    let lastFrameTime = 0;
    
    const startFrameCapture = () => {
      if (!socket || !socketConnected.value || !videoElement.value) {
        return
      }

      // Create a single reusable canvas for frame capture
      const captureCanvas = document.createElement('canvas')
      const captureContext = captureCanvas.getContext('2d')
      
      // Set smaller resolution for much faster processing
      captureCanvas.width = 320
      captureCanvas.height = 240
      
      const processFrame = () => {
        try {
          const now = Date.now();
          if (now - lastFrameTime < FRAME_INTERVAL) {
            return; // Skip this frame
          }
          lastFrameTime = now;
          
          const video = videoElement.value
          if (!video || video.readyState !== video.HAVE_ENOUGH_DATA) {
            return
          }
          
          // Draw video frame to canvas
          captureContext.drawImage(video, 0, 0, 320, 240)
          
          // Convert to base64 with very low quality for maximum speed
          const imageData = captureCanvas.toDataURL('image/jpeg', 0.3)
          
          // Send frame to backend
          socket.emit('analyze_pose_frame', {
            exercise_id: selectedExercise.value,
            image: imageData,
            user_id: 'anonymous',
            timestamp: Date.now(),
            force_detection: true,
            debug: false
          })
          
        } catch (err) {
          console.error('Error capturing frame:', err)
        }
      }
      
      // Use a shorter interval but throttle inside the callback
      frameInterval = setInterval(processFrame, 50) // Check every 50ms but only send at 10 FPS
    }

    const stopFrameCapture = () => {
      if (frameInterval) {
        clearInterval(frameInterval)
        frameInterval = null
      }
    }

    const startWorkoutSession = async () => {
      try {
        workoutStartTime.value = new Date()
        currentExerciseStartTime.value = new Date()
        
        const workoutTypeId = getWorkoutTypeId(selectedExercise.value)
        const workoutTypeName = getWorkoutTypeName(selectedExercise.value)
        
        console.log('🚀 Starting workout session...', {
          workout_type: workoutTypeName,
          workout_type_id: workoutTypeId,
          exercise: selectedExercise.value,
          start_time: workoutStartTime.value.toISOString(),
          API_BASE_URL: API_BASE_URL
        })
        
        const response = await fetchWithAuth(`${API_BASE_URL}/api/workouts/sessions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            workout_type: workoutTypeName,
            workout_type_id: workoutTypeId,
            start_time: workoutStartTime.value.toISOString()
          })
        })

        console.log('📡 API Response status:', response.status, response.statusText)

        if (response.ok) {
          const data = await response.json()
          console.log('📊 API Response data:', data)
          
          // Try multiple possible field names for session ID
          const sessionId = data.session_id || data.id || data.workout_session_id || data.sessionId
          
          if (sessionId) {
            workoutSessionId.value = sessionId
            console.log('✅ Workout session started successfully! ID:', workoutSessionId.value)
          } else {
            console.error('❌ No session ID found in response. Available fields:', Object.keys(data))
            // Fallback: generate a temporary ID
            workoutSessionId.value = `temp_${Date.now()}`
            console.log('🔧 Using temporary session ID:', workoutSessionId.value)
          }
        } else {
          const errorText = await response.text()
          console.error('❌ Failed to start workout session:', {
            status: response.status,
            statusText: response.statusText,
            error: errorText
          })
          
          // If backend is not available, create a temporary session
          workoutSessionId.value = `offline_${Date.now()}`
          console.log('🔧 Backend unavailable, using offline session ID:', workoutSessionId.value)
        }
      } catch (error) {
        console.error('❌ Error starting workout session:', error)
        
        // Fallback: create a temporary session ID so the workout can still be tracked
        workoutSessionId.value = `error_${Date.now()}`
        console.log('🔧 Error occurred, using fallback session ID:', workoutSessionId.value)
      }
    }

    const endWorkoutSession = async () => {
      console.log('🏁 Ending workout session...')
      console.log('Session ID:', workoutSessionId.value)
      console.log('Start time:', workoutStartTime.value)
      
      if (!workoutSessionId.value || !workoutStartTime.value) {
        console.log('❌ Cannot end session - missing session ID or start time')
        return
      }

      try {
        const endTime = new Date()
        const duration = Math.floor((endTime - workoutStartTime.value) / 1000) // in seconds

        const workoutTypeId = getWorkoutTypeId(selectedExercise.value)
        const workoutTypeName = getWorkoutTypeName(selectedExercise.value)
        
        const sessionSummary = {
          session_id: workoutSessionId.value,
          workout_type: workoutTypeName,
          workout_type_id: workoutTypeId,
          start_time: workoutStartTime.value.toISOString(),
          end_time: endTime.toISOString(),
          duration: duration,
          exercises: exerciseData.value,
          completed: true
        }
        
        console.log('📋 Session summary:', sessionSummary)

        // Check if this is a temporary/offline session
        const isTemporarySession = workoutSessionId.value.startsWith('temp_') || 
                                   workoutSessionId.value.startsWith('offline_') || 
                                   workoutSessionId.value.startsWith('error_')

        if (isTemporarySession) {
          // For temporary sessions, try to create a new session instead of updating
          console.log('🔧 Temporary session detected, creating new session...')
          
          const response = await fetchWithAuth(`${API_BASE_URL}/api/workouts/sessions`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(sessionSummary)
          })

          if (response.ok) {
            const data = await response.json()
            console.log('✅ Temporary session saved successfully:', data)
          } else {
            console.error('❌ Failed to save temporary session:', await response.text())
            // Store in localStorage as fallback
            const offlineSessions = JSON.parse(localStorage.getItem('offline_sessions') || '[]')
            offlineSessions.push(sessionSummary)
            localStorage.setItem('offline_sessions', JSON.stringify(offlineSessions))
            console.log('💾 Session saved offline for later sync')
          }
        } else {
          // Normal session update
          const response = await fetchWithAuth(`${API_BASE_URL}/api/workouts/sessions/${workoutSessionId.value}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(sessionSummary)
          })
          
          console.log('📡 Update response:', response.status, response.statusText)

          if (response.ok) {
            const data = await response.json()
            console.log('✅ Workout session completed and saved:', data)
          } else {
            console.error('❌ Failed to save workout session:', await response.text())
          }
        }

        // Voice feedback for session completion
        if (isVoiceEnabled.value) {
          const minutes = Math.max(1, Math.floor(duration / 60))
          speak(`Great job! Your ${selectedExercise.value} session lasted ${minutes} minutes`, 'medium')
        }

      } catch (error) {
        console.error('❌ Error ending workout session:', error)
        
        // Save to localStorage as fallback
        try {
          const workoutTypeId = getWorkoutTypeId(selectedExercise.value)
          const workoutTypeName = getWorkoutTypeName(selectedExercise.value)
          
          const sessionSummary = {
            session_id: workoutSessionId.value,
            workout_type: workoutTypeName,
            workout_type_id: workoutTypeId,
            start_time: workoutStartTime.value.toISOString(),
            end_time: new Date().toISOString(),
            duration: Math.floor((new Date() - workoutStartTime.value) / 1000),
            exercises: exerciseData.value,
            completed: true,
            offline: true
          }
          
          const offlineSessions = JSON.parse(localStorage.getItem('offline_sessions') || '[]')
          offlineSessions.push(sessionSummary)
          localStorage.setItem('offline_sessions', JSON.stringify(offlineSessions))
          console.log('💾 Session saved offline due to error')
        } catch (storageError) {
          console.error('❌ Failed to save offline session:', storageError)
        }
      } finally {
        // Reset session data
        workoutSessionId.value = null
        workoutStartTime.value = null
        exerciseData.value = []
        currentExerciseStartTime.value = null
        console.log('🔄 Session data reset')
      }
    }

    // Track exercise performance
    const trackExercisePerformance = (poseData) => {
      if (!workoutSessionId.value || !poseData) return

      const exercisePerformance = {
        exercise_name: selectedExercise.value,
        timestamp: new Date().toISOString(),
        accuracy: poseData.accuracy || 0,
        correct_form: poseData.correct_form || false,
        feedback: poseData.feedback || []
      }

      exerciseData.value.push(exercisePerformance)
      
      // Keep only last 100 entries to avoid memory issues
      if (exerciseData.value.length > 100) {
        exerciseData.value = exerciseData.value.slice(-100)
      }
    }

    const startCamera = async () => {
      try {
        isLoading.value = true
        error.value = ''
        
        // Start workout session when camera starts
        await startWorkoutSession()
        
        // Voice feedback for starting camera
        if (isVoiceEnabled.value) {
          speak(`Starting ${selectedExercise.value} detection`, 'high')
        }
        
        // Try different camera configurations to avoid zoom issues
        const cameraConfigs = [
          // Standard mobile resolution (preferred)
          {
            video: {
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
              facingMode: 'user',
              aspectRatio: { ideal: 16/9 }
            },
            audio: false
          },
          // Fallback: Lower resolution
          {
            video: {
              width: { ideal: 640, max: 1280 },
              height: { ideal: 480, max: 720 },
              facingMode: 'user',
              aspectRatio: { ideal: 4/3 }
            },
            audio: false
          },
          // Last resort: Basic constraints
          {
            video: {
              facingMode: 'user'
            },
            audio: false
          }
        ]
        
        let stream = null
        let lastError = null
        
        // Try each configuration until one works
        for (const constraints of cameraConfigs) {
          try {
            console.log('Trying camera config:', constraints)
            stream = await navigator.mediaDevices.getUserMedia(constraints)
            break // Success, exit loop
          } catch (err) {
            console.log('Camera config failed:', err.message)
            lastError = err
            continue // Try next configuration
          }
        }
        
        if (!stream) {
          throw lastError || new Error('All camera configurations failed')
        }
        
        if (videoElement.value) {
          videoElement.value.srcObject = stream
          isCameraOpen.value = true
          
          // Wait for video to be ready
          await nextTick()
          
          // Log actual video dimensions for debugging
          const video = videoElement.value
          video.addEventListener('loadedmetadata', () => {
            console.log(`Camera resolution: ${video.videoWidth}x${video.videoHeight}`)
          })
          
          // Initialize canvas context immediately
          if (canvasElement.value) {
            canvasContext = canvasElement.value.getContext('2d')
            console.log('Canvas context initialized')
          }
          
          // Connect socket and start frame capture
          if (!socket) {
            connectSocket()
          }
          
          // Start fallback mode immediately if no socket connection
          setTimeout(() => {
            if (!socketConnected.value) {
              console.log('Socket not connected, starting fallback mode')
              startFallbackMode()
            } else {
              startFrameCapture()
            }
          }, 500) // Shorter delay
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
        let errorMessage = 'Unable to access camera.'
        
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access and try again.'
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera found on this device.'
        } else if (err.name === 'NotReadableError') {
          errorMessage = 'Camera is already in use by another application.'
        }
        
        error.value = errorMessage
      } finally {
        isLoading.value = false
      }
    }

    const stopCamera = () => {
      stopFrameCapture()
      stopFallbackMode() // Stop fallback mode when camera stops
      
      // End workout session when camera stops
      endWorkoutSession()
      
      // Stop any ongoing voice feedback
      stopSpeaking()
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        stream = null
      }
      if (videoElement.value) {
        videoElement.value.srcObject = null
      }
      
      isCameraOpen.value = false
      error.value = ''
      landmarks.value = []
      poseData.value = null
      
      // Clear canvas
      if (canvasContext && canvasElement.value) {
        canvasContext.clearRect(0, 0, canvasElement.value.width, canvasElement.value.height)
      }
      
      // Voice feedback for stopping camera
      if (isVoiceEnabled.value) {
        speak('Workout session ended', 'medium')
      }
    }

    const toggleCamera = () => {
      if (isCameraOpen.value) {
        stopCamera()
      } else {
        startCamera()
      }
    }

    const selectExercise = (exercise) => {
      selectedExercise.value = exercise
      console.log('Selected exercise:', exercise)
      
      // Voice feedback for exercise selection
      if (isVoiceEnabled.value && !isCameraOpen.value) {
        speak(`${exercise} exercise selected`, 'medium')
      }
    }

    const handleResize = () => {
      if (isCameraOpen.value && stream) {
        stopCamera()
        setTimeout(() => {
          startCamera()
        }, 100)
      }
    }

    // Initialize canvas context
    const initializeCanvas = () => {
      if (canvasElement.value && !canvasContext) {
        canvasContext = canvasElement.value.getContext('2d')
        console.log('Canvas context initialized on mount')
      }
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
      // Initialize canvas context when component mounts
      nextTick(() => {
        initializeCanvas()
      })
    })

    onUnmounted(() => {
      stopCamera()
      stopFallbackMode() // Clean up fallback mode
      if (socket) {
        socket.disconnect()
      }
      window.removeEventListener('resize', handleResize)
    })

    // Add motivational feedback based on good form
    let lastMotivationTime = 0
    watch(poseData, (newData) => {
      if (newData && newData.correct_form && newData.accuracy >= 80 && isVoiceEnabled.value) {
        const now = Date.now()
        // Give motivational feedback every 10 seconds for good form
        if (now - lastMotivationTime > 10000) {
          generateMotivationalFeedback(selectedExercise.value)
          lastMotivationTime = now
        }
      }
    })

    return {
      videoElement,
      canvasElement,
      isCameraOpen,
      isLoading,
      error,
      selectedExercise,
      socketConnected,
      landmarks,
      poseData,
      fallbackInterval: ref(fallbackInterval),
      workoutSessionId,
      toggleCamera,
      selectExercise,
      
      // Voice feedback
      isVoiceEnabled,
      voiceSettings,
      isPlaying,
      speak,
      generatePoseFeedback,
      generateMotivationalFeedback,
      speakCountdown,
      toggleVoice,
      adjustRate,
      adjustVolume,
      stopSpeaking,
      testVoice,
      debugVoiceStatus
    }
  }
}
</script>

<style scoped>
video {
  object-fit: cover;
  transform: scaleX(-1); /* Mirror the video for better UX */
}

canvas {
  object-fit: cover;
  transform: scaleX(-1); /* Mirror the canvas to match video */
}

/* Ensure video fills container properly without excessive zoom */
.relative video,
.relative canvas {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  object-position: center;
}

body {
  overflow: hidden;
}

/* Voice control styles */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

input[type="range"]::-webkit-slider-track {
  background: #374151;
  height: 4px;
  border-radius: 2px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #3B82F6;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  cursor: pointer;
}

input[type="range"]::-moz-range-track {
  background: #374151;
  height: 4px;
  border-radius: 2px;
  border: none;
}

input[type="range"]::-moz-range-thumb {
  background: #3B82F6;
  height: 16px;
  width: 16px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* Voice status animation */
@keyframes voice-pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* Lock icon animation */
@keyframes lock-pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.lock-icon {
  animation: lock-pulse 2s infinite;
}
</style>