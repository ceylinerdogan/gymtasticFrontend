import { ref, reactive } from 'vue'
import { TextToSpeech } from '@capacitor-community/text-to-speech'
import { Capacitor } from '@capacitor/core'

export function useVoiceFeedback() {
  const isVoiceEnabled = ref(true) // Default to true, available for all users
  const voiceSettings = reactive({
    rate: 0.9, // Good balance for real-time feedback
    pitch: 1.0,
    volume: 1.0, // Full volume for better audibility
    voice: null // Will be set to preferred voice
  })
  
  const lastSpokenFeedback = ref('')
  const lastSpokenTime = ref(0)
  const lastSpokenAccuracy = ref(0)
  const feedbackQueue = ref([])
  const isPlaying = ref(false)
  const currentSpeechId = ref(null)
  
  // Platform detection
  const isMobile = Capacitor.isNativePlatform()
  const isAndroid = Capacitor.getPlatform() === 'android'
  const isIOS = Capacitor.getPlatform() === 'ios'
  
  console.log('🔊 Voice Feedback Platform:', {
    isMobile,
    isAndroid,
    isIOS,
    platform: Capacitor.getPlatform()
  })
  
  // Initialize speech synthesis
  const initVoice = async () => {
    if (isMobile) {
      console.log('🔊 Initializing mobile TTS plugin for real-time feedback')
      
      try {
        // Test TTS availability
        await new Promise(resolve => setTimeout(resolve, 300))
        console.log('🔊 Mobile TTS initialized successfully')
      } catch (error) {
        console.error('🔊 Mobile TTS initialization error:', error)
      }
      
      return true
    } else {
      // For web, use Web Speech API
      if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) {
        console.warn('Speech synthesis not supported on this device')
        isVoiceEnabled.value = false
        return false
      }
      
      // Wait for voices to load
      const setVoice = () => {
        const voices = speechSynthesis.getVoices()
        if (voices.length === 0) {
          setTimeout(setVoice, 100)
          return
        }
        
        // Prefer English voices
        const preferredVoices = [
          'Google US English',
          'Microsoft David',
          'Alex',
          'Samantha',
          'Karen'
        ]
        
        let selectedVoice = null
        for (const voiceName of preferredVoices) {
          selectedVoice = voices.find(voice => voice.name.includes(voiceName))
          if (selectedVoice) break
        }
        
        // Fallback to first English voice
        if (!selectedVoice) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en'))
        }
        
        // Final fallback to first available voice
        if (!selectedVoice && voices.length > 0) {
          selectedVoice = voices[0]
        }
        
        voiceSettings.voice = selectedVoice
        console.log('Voice initialized:', selectedVoice?.name || 'Default')
      }
      
      // Handle voice loading
      if (speechSynthesis.getVoices().length === 0) {
        speechSynthesis.addEventListener('voiceschanged', setVoice, { once: true })
      } else {
        setVoice()
      }
      
      return true
    }
  }
  
  // Smart repetition filter for real-time feedback
  const shouldSkipSpeech = (text, isRealTimeFeedback) => {
    const now = Date.now()
    
    if (isRealTimeFeedback) {
      // For real-time feedback, only skip if exact same message within 2 seconds
      return lastSpokenFeedback.value === text && now - lastSpokenTime.value < 2000
    } else {
      // For non-real-time feedback, longer delay
      return lastSpokenFeedback.value === text && now - lastSpokenTime.value < 4000
    }
  }
  
  // Mobile TTS with smooth real-time feedback
  const speakMobile = async (text, isRealTimeFeedback = false, priority = 'normal') => {
    if (!isVoiceEnabled.value || !text) return
    
    // Smart filtering to avoid repetition but allow real-time flow
    if (shouldSkipSpeech(text, isRealTimeFeedback)) {
      console.log('🔊 Skipping repetitive speech')
      return
    }
    
    console.log('🔊 Mobile TTS:', text.substring(0, 40) + '...', 'RealTime:', isRealTimeFeedback)
    
    try {
      const speechId = Date.now().toString()
      currentSpeechId.value = speechId
      
      // For real-time feedback, use ADD strategy to queue naturally
      // For other speech, use FLUSH only if it's truly urgent
      const queueStrategy = (priority === 'urgent') ? 0 : 1 // 0=flush, 1=add
      
      lastSpokenFeedback.value = text
      lastSpokenTime.value = Date.now()
      isPlaying.value = true
      
      await TextToSpeech.speak({
        text: text,
        lang: 'en-US',
        rate: voiceSettings.rate,
        pitch: voiceSettings.pitch,
        volume: voiceSettings.volume,
        category: 'playback', // Good for continuous speech
        queueStrategy: queueStrategy
      })
      
      // Only mark as complete if this is still the current speech
      if (currentSpeechId.value === speechId) {
        isPlaying.value = false
        console.log('🔊 Mobile TTS completed naturally')
      }
      
    } catch (error) {
      console.error('🔊 Mobile TTS error:', error)
      isPlaying.value = false
    }
  }
  
  // Web TTS with smooth handling
  const speakWeb = (text, isRealTimeFeedback = false, priority = 'normal') => {
    if (!isVoiceEnabled.value || !text) return
    
    if (shouldSkipSpeech(text, isRealTimeFeedback)) {
      return
    }
    
    if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) {
      console.warn('Speech synthesis not available on this device')
      return
    }
    
    try {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch
      utterance.volume = voiceSettings.volume
      
      if (voiceSettings.voice) {
        utterance.voice = voiceSettings.voice
      }
      
      utterance.onstart = () => {
        isPlaying.value = true
        lastSpokenFeedback.value = text
        lastSpokenTime.value = Date.now()
      }
      
      utterance.onend = () => {
        isPlaying.value = false
        processWebQueue()
      }
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
        isPlaying.value = false
        processWebQueue()
      }
      
      // For urgent priority, clear queue and speak immediately
      if (priority === 'urgent') {
        speechSynthesis.cancel()
        feedbackQueue.value = []
        speechSynthesis.speak(utterance)
      } else if (!isPlaying.value) {
        // Speak immediately if nothing is playing
        speechSynthesis.speak(utterance)
      } else {
        // Add to queue for smooth flow
        feedbackQueue.value.push(utterance)
      }
    } catch (error) {
      console.error('Speech synthesis error:', error)
      isPlaying.value = false
    }
  }
  
  // Process web queue smoothly
  const processWebQueue = () => {
    if (!isMobile && feedbackQueue.value.length > 0 && !isPlaying.value) {
      const next = feedbackQueue.value.shift()
      if (next && next.text) {
        speechSynthesis.speak(next)
      }
    }
  }
  
  // Main speak function with improved real-time handling
  const speak = async (text, priority = 'normal', isRealTimeFeedback = false) => {
    if (!isVoiceEnabled.value || !text) return
    
    console.log('🔊 Speak request:', text.substring(0, 25) + '...', 'Priority:', priority, 'RealTime:', isRealTimeFeedback)
    
    if (isMobile) {
      await speakMobile(text, isRealTimeFeedback, priority)
    } else {
      speakWeb(text, isRealTimeFeedback, priority)
    }
  }
  
  // Real-time pose feedback - smooth and non-interrupting
  const speakImmediatePoseFeedback = async (text) => {
    if (!isVoiceEnabled.value || !text) return
    
    console.log('🔊 Real-time pose feedback:', text)
    
    // Use normal priority to avoid cutting - let it queue naturally
    await speak(text, 'normal', true)
  }

  // Generate feedback based on pose data
  const generatePoseFeedback = (poseData) => {
    if (!poseData) return
    
    const { accuracy, correct_form, feedback, poseName } = poseData
    
    // Generate feedback based on accuracy and form
    let feedbackMessage = ''
    
    if (correct_form) {
      if (accuracy >= 90) {
        feedbackMessage = `Perfect ${poseName}!`
      } else if (accuracy >= 80) {
        feedbackMessage = `Good ${poseName}!`
      } else if (accuracy >= 70) {
        feedbackMessage = `Nice ${poseName}!`
      } else {
        feedbackMessage = `Keep working on your ${poseName}`
      }
    } else {
      // Use specific feedback for form corrections
      feedbackMessage = feedback || `Check your ${poseName} form`
    }
    
    // Store accuracy for history
    lastSpokenAccuracy.value = accuracy
    
    // Use real-time feedback that flows naturally
    speakImmediatePoseFeedback(feedbackMessage)
  }
  
  // Generate motivational feedback
  const generateMotivationalFeedback = (exerciseType, repCount = 0) => {
    const motivationalMessages = [
      `Great work on those ${exerciseType}s!`,
      `You're crushing it! Keep going!`,
      `Excellent form! You're getting stronger!`,
      `Amazing effort! Don't give up!`,
      `You're doing fantastic! Push through!`,
      `Strong work! Your dedication shows!`,
      `Incredible! You're making progress!`,
      `Outstanding! Keep that energy up!`
    ]
    
    let message = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)]
    
    if (repCount > 0) {
      message = `${repCount} reps completed! ${message}`
    }
    
    speak(message, 'normal')
  }
  
  // Speak countdown
  const speakCountdown = async (count) => {
    const countMessage = count > 0 ? count.toString() : 'Go!'
    await speak(countMessage, 'urgent', true) // Only countdown uses urgent priority
  }
  
  // Toggle voice on/off
  const toggleVoice = () => {
    isVoiceEnabled.value = !isVoiceEnabled.value
    const status = isVoiceEnabled.value ? 'enabled' : 'disabled'
    console.log(`🔊 Voice feedback ${status}`)
    
    // Stop any current speech when disabling
    if (!isVoiceEnabled.value) {
      stopSpeaking()
    }
  }
  
  // Adjust speech rate
  const adjustRate = (newRate) => {
    voiceSettings.rate = Math.max(0.1, Math.min(2.0, newRate))
    console.log('🔊 Speech rate adjusted to:', voiceSettings.rate)
  }
  
  // Adjust volume
  const adjustVolume = (newVolume) => {
    voiceSettings.volume = Math.max(0.0, Math.min(1.0, newVolume))
    console.log('🔊 Volume adjusted to:', voiceSettings.volume)
  }
  
  // Stop speaking (only when really needed)
  const stopSpeaking = async () => {
    console.log('🔊 Stopping all speech')
    
    if (isMobile) {
      try {
        await TextToSpeech.stop()
        console.log('🔊 Mobile TTS stopped')
      } catch (error) {
        console.error('🔊 Error stopping mobile TTS:', error)
      }
    } else {
      speechSynthesis.cancel()
    }
    
    feedbackQueue.value = []
    isPlaying.value = false
    currentSpeechId.value = null
  }
  
  // Test voice functionality
  const testVoice = async () => {
    await speak('Voice feedback is working smoothly! This is a test message for real-time coaching without interruptions.', 'normal')
  }
  
  // Debug voice status
  const debugVoiceStatus = () => {
    console.log('🔊 Voice Debug Info:', {
      isVoiceEnabled: isVoiceEnabled.value,
      platform: isMobile ? 'mobile' : 'web',
      isAndroid,
      isIOS,
      isPlaying: isPlaying.value,
      queueLength: feedbackQueue.value.length,
      currentSpeechId: currentSpeechId.value,
      voiceSettings: voiceSettings,
      lastSpoken: lastSpokenFeedback.value,
      timeSinceLastSpoken: Date.now() - lastSpokenTime.value
    })
  }
  
  return {
    // State
    isVoiceEnabled,
    voiceSettings,
    isPlaying,
    lastSpokenFeedback,
    lastSpokenTime,
    lastSpokenAccuracy,
    
    // Core functions
    initVoice,
    speak,
    speakImmediatePoseFeedback,
    generatePoseFeedback,
    generateMotivationalFeedback,
    speakCountdown,
    
    // Controls
    toggleVoice,
    adjustRate,
    adjustVolume,
    stopSpeaking,
    
    // Utilities
    testVoice,
    debugVoiceStatus
  }
} 