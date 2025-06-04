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
        :class="socketConnected ? 'bg-green-500' : 'bg-red-500'"
        class="w-3 h-3 rounded-full"
      ></div>
      <span class="text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
        {{ socketConnected ? 'Connected' : 'Disconnected' }}
      </span>
    </div>

    <!-- Pose Analysis Results -->
    <div v-if="poseData" class="absolute bottom-20 left-4 bg-black bg-opacity-70 text-white p-3 rounded-lg z-20 max-w-xs">
      <div class="text-sm space-y-1">
        <div class="font-semibold">{{ poseData.poseName || 'Unknown' }}</div>
        <div class="flex items-center space-x-2">
          <span>Accuracy:</span>
          <span :class="poseData.accuracy >= 80 ? 'text-green-400' : poseData.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'">
            {{ Math.round(poseData.accuracy) }}%
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <span>Form:</span>
          <span :class="poseData.correct_form ? 'text-green-400' : 'text-red-400'">
            {{ poseData.correct_form ? 'Correct' : 'Needs Work' }}
          </span>
        </div>
        <div v-if="landmarks.length > 0" class="text-xs text-gray-300">
          Landmarks: {{ landmarks.length }}
        </div>
        <div v-if="poseData.feedback && poseData.feedback.length > 0" class="mt-2 pt-2 border-t border-gray-600">
          <div class="text-xs text-yellow-300">
            <div v-for="(tip, index) in poseData.feedback" :key="index" class="mb-1">
              • {{ tip }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Camera Toggle Button -->
    <button
      @click="toggleCamera"
      :disabled="isLoading"
      class="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full text-white font-bold shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed z-10"
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
import { ref, onUnmounted, onMounted, nextTick } from 'vue'
import { io } from 'socket.io-client'

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
    
    let stream = null
    let socket = null
    let frameInterval = null
    let canvasContext = null

    // Socket connection
    const connectSocket = () => {
      try {
        socket = io('http://localhost:5000', {
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
        })

        socket.on('connect_error', (err) => {
          console.error('Socket connection error:', err)
          socketConnected.value = false
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
      }
    }

    // Handle pose data from backend (optimized for immediate response)
    const handlePoseData = (data) => {
      try {
        // Store the complete pose data including image dimensions
        if (data.exercise_name || data.poseName || data.pose_name) {
          poseData.value = {
            poseName: data.exercise_name || data.poseName || data.pose_name,
            accuracy: data.accuracy || data.score || 0,
            feedback: data.feedback || [],
            image_dimensions: data.image_dimensions || { width: 1280, height: 720 },
            correct_form: data.correct_form || false
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

    // Draw pose landmarks as skeleton with accuracy-based colors (fixed alignment)
    const drawPoseLandmarks = () => {
      if (!canvasElement.value || !canvasContext || landmarks.value.length === 0) {
        return
      }

      const canvas = canvasElement.value
      const video = videoElement.value
      
      if (!video) return

      // Clear canvas
      canvasContext.clearRect(0, 0, canvas.width, canvas.height)
      
      // Set canvas size to exactly match video display
      const rect = video.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      canvas.style.width = rect.width + 'px'
      canvas.style.height = rect.height + 'px'
      
      // Get current accuracy for color coding
      const accuracy = poseData.value?.accuracy || 0
      const correctForm = poseData.value?.correct_form || false
      
      // Determine skeleton color based on accuracy and form
      let skeletonColor, pointColor
      if (correctForm && accuracy >= 85) {
        skeletonColor = '#00ff00' // Bright green - excellent
        pointColor = '#00ff00'
      } else if (accuracy >= 70) {
        skeletonColor = '#ffff00' // Yellow - good
        pointColor = '#ffaa00'
      } else if (accuracy >= 50) {
        skeletonColor = '#ff8800' // Orange - needs improvement
        pointColor = '#ff6600'
      } else {
        skeletonColor = '#ff0000' // Red - poor form
        pointColor = '#ff0000'
      }
      
      // MediaPipe pose landmark connections
      const connections = [
        // Face outline
        [0, 1], [1, 2], [2, 3], [3, 7], [0, 4], [4, 5], [5, 6], [6, 8],
        // Mouth
        [9, 10],
        // Core body structure
        [11, 12], [11, 23], [12, 24], [23, 24],
        // Left arm
        [11, 13], [13, 15], [15, 17], [17, 19], [15, 21],
        // Right arm  
        [12, 14], [14, 16], [16, 18], [18, 20], [16, 22],
        // Left leg
        [23, 25], [25, 27], [27, 29], [27, 31],
        // Right leg
        [24, 26], [26, 28], [28, 30], [28, 32]
      ]

      // Use normalized coordinates for proper alignment
      const videoWidth = canvas.width
      const videoHeight = canvas.height

      // Draw connections with accuracy-based colors
      canvasContext.strokeStyle = skeletonColor
      canvasContext.lineWidth = 3
      canvasContext.lineCap = 'round'

      connections.forEach(([startIdx, endIdx]) => {
        const startPoint = landmarks.value[startIdx]
        const endPoint = landmarks.value[endIdx]
        
        if (startPoint && endPoint && 
            (startPoint.visibility || 1) > 0.5 && (endPoint.visibility || 1) > 0.5) {
          
          // Use normalized coordinates for proper alignment
          const startX = startPoint.x_normalized * videoWidth
          const startY = startPoint.y_normalized * videoHeight
          const endX = endPoint.x_normalized * videoWidth
          const endY = endPoint.y_normalized * videoHeight
          
          canvasContext.beginPath()
          canvasContext.moveTo(startX, startY)
          canvasContext.lineTo(endX, endY)
          canvasContext.stroke()
        }
      })

      // Draw landmark points
      landmarks.value.forEach((landmark, index) => {
        if (landmark && (landmark.visibility || 1) > 0.5) {
          // Use normalized coordinates
          const x = landmark.x_normalized * videoWidth
          const y = landmark.y_normalized * videoHeight
          
          // Main point
          canvasContext.fillStyle = pointColor
          canvasContext.beginPath()
          canvasContext.arc(x, y, 4, 0, 2 * Math.PI)
          canvasContext.fill()
          
          // White border for contrast
          canvasContext.strokeStyle = '#ffffff'
          canvasContext.lineWidth = 1
          canvasContext.beginPath()
          canvasContext.arc(x, y, 4, 0, 2 * Math.PI)
          canvasContext.stroke()
        }
      })
    }

    // Capture and send video frames (much faster)
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
      
      frameInterval = setInterval(() => {
        try {
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
      }, 150) // Reduced frequency to 150ms for better performance
    }

    const stopFrameCapture = () => {
      if (frameInterval) {
        clearInterval(frameInterval)
        frameInterval = null
      }
    }

    const startCamera = async () => {
      try {
        isLoading.value = true
        error.value = ''
        
        const constraints = {
          video: {
            width: { ideal: window.innerWidth },
            height: { ideal: window.innerHeight },
            facingMode: 'user'
          },
          audio: false
        }
        
        stream = await navigator.mediaDevices.getUserMedia(constraints)
        
        if (videoElement.value) {
          videoElement.value.srcObject = stream
          isCameraOpen.value = true
          
          // Wait for video to be ready
          await nextTick()
          
          // Initialize canvas context
          if (canvasElement.value) {
            canvasContext = canvasElement.value.getContext('2d')
          }
          
          // Connect socket and start frame capture
          if (!socket) {
            connectSocket()
          }
          
          setTimeout(() => {
            startFrameCapture()
          }, 1000) // Wait 1 second for socket connection
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
    }

    const handleResize = () => {
      if (isCameraOpen.value && stream) {
        stopCamera()
        setTimeout(() => {
          startCamera()
        }, 100)
      }
    }

    onMounted(() => {
      window.addEventListener('resize', handleResize)
    })

    onUnmounted(() => {
      stopCamera()
      if (socket) {
        socket.disconnect()
      }
      window.removeEventListener('resize', handleResize)
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
      toggleCamera,
      selectExercise
    }
  }
}
</script>

<style scoped>
video {
  object-fit: cover;
}

canvas {
  object-fit: cover;
}

body {
  overflow: hidden;
}
</style>