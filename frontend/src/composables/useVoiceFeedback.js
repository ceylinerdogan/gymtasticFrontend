import { ref, reactive } from 'vue'

export function useVoiceFeedback() {
  const isVoiceEnabled = ref(true) // Default to true, available for all users
  const voiceSettings = reactive({
    rate: 0.9,
    pitch: 1.0,
    volume: 0.8,
    voice: null // Will be set to preferred voice
  })
  
  const lastSpokenFeedback = ref('')
  const lastSpokenTime = ref(0)
  const lastSpokenAccuracy = ref(0)
  const feedbackQueue = ref([])
  const isPlaying = ref(false)
  
  // Initialize speech synthesis
  const initVoice = () => {
    if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) {
      console.warn('Speech synthesis not supported on this device')
      isVoiceEnabled.value = false // Disable voice on unsupported devices
      return false
    }
    
    // Wait for voices to load
    const setVoice = () => {
      const voices = speechSynthesis.getVoices()
      if (voices.length === 0) {
        // Voices not loaded yet, try again
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
  
  // Speak text with immediate response for real-time feedback
  const speak = (text, priority = 'normal', isRealTimeFeedback = false) => {
    if (!isVoiceEnabled.value || !text) return
    
    // Check if speech synthesis is available
    if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) {
      console.warn('Speech synthesis not available on this device')
      return
    }
    
    // For real-time pose feedback, reduce repetition delay significantly
    const repetitionDelay = isRealTimeFeedback ? 800 : 3000 // 0.8s for pose feedback, 3s for others
    
    // Avoid repeating the same feedback too quickly
    const now = Date.now()
    if (lastSpokenFeedback.value === text && now - lastSpokenTime.value < repetitionDelay) {
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
        lastSpokenTime.value = now
      }
      
      utterance.onend = () => {
        isPlaying.value = false
        processQueue()
      }
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
        isPlaying.value = false
        processQueue()
      }
      
      // For real-time pose feedback, always interrupt and speak immediately
      if (isRealTimeFeedback || priority === 'high') {
        // Stop current speech and speak immediately
        speechSynthesis.cancel()
        feedbackQueue.value = []
        speechSynthesis.speak(utterance)
      } else if (priority === 'medium' || !isPlaying.value) {
        // Speak immediately if nothing is playing
        if (!isPlaying.value) {
          speechSynthesis.speak(utterance)
        } else {
          // Add to front of queue
          feedbackQueue.value.unshift(utterance)
        }
      } else {
        // Add to end of queue
        feedbackQueue.value.push(utterance)
      }
    } catch (error) {
      console.error('Speech synthesis error:', error)
      isPlaying.value = false
    }
  }
  
  // Process queued speech
  const processQueue = () => {
    if (feedbackQueue.value.length > 0 && !isPlaying.value) {
      const next = feedbackQueue.value.shift()
      speechSynthesis.speak(next)
    }
  }
  
  // Generate immediate pose feedback for real-time response
  const speakImmediatePoseFeedback = (text) => {
    if (!isVoiceEnabled.value || !text) return
    
    // Check if speech synthesis is available
    if (!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) {
      console.warn('Speech synthesis not available on this device')
      return
    }
    
    try {
      // Always interrupt current speech for immediate pose feedback
      speechSynthesis.cancel()
      feedbackQueue.value = []
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = voiceSettings.rate
      utterance.pitch = voiceSettings.pitch
      utterance.volume = voiceSettings.volume
      
      if (voiceSettings.voice) {
        utterance.voice = voiceSettings.voice
      }
      
      utterance.onstart = () => {
        isPlaying.value = true
      }
      
      utterance.onend = () => {
        isPlaying.value = false
      }
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error)
        isPlaying.value = false
      }
      
      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error('Speech synthesis error:', error)
      isPlaying.value = false
    }
  }

  // Generate feedback based on pose data
  const generatePoseFeedback = (poseData) => {
    if (!poseData) return
    
    const { accuracy, correct_form, feedback, poseName } = poseData
    const exercise = poseName?.toLowerCase() || 'exercise'
    
    console.log('Voice Feedback Debug:', { accuracy, correct_form, exercise, feedback })
    
    let primaryFeedback = null
    let secondaryFeedback = []
    
    // Primary feedback based on accuracy and correctness (takes priority)
    // Adjusted thresholds to match green landmark visual indicators
    if (accuracy >= 95) {
      primaryFeedback = 'Excellent form!'
    } else if (accuracy >= 85) {
      primaryFeedback = 'Good form!'
    } else if (accuracy >= 75) {
      primaryFeedback = 'Nice work!'
    } else if (accuracy >= 65) {
      primaryFeedback = 'Keep it up!'
    } else if (accuracy >= 50) {
      primaryFeedback = 'Keep adjusting your form'
    } else if (accuracy >= 30) {
      primaryFeedback = 'Adjust your position'
    } else {
      primaryFeedback = 'Check your position'
    }
    
    // Only add exercise-specific feedback if accuracy is below 65% (needs improvement)
    if (accuracy < 65) {
      if (exercise.includes('squat')) {
        if (feedback?.some(f => f.toLowerCase().includes('depth'))) {
          secondaryFeedback.push('Go deeper')
        }
        if (feedback?.some(f => f.toLowerCase().includes('knee'))) {
          secondaryFeedback.push('Watch your knees')
        }
        if (feedback?.some(f => f.toLowerCase().includes('back'))) {
          secondaryFeedback.push('Keep your back straight')
        }
      } else if (exercise.includes('plank')) {
        if (feedback?.some(f => f.toLowerCase().includes('hip'))) {
          secondaryFeedback.push('Level your hips')
        }
        if (feedback?.some(f => f.toLowerCase().includes('arm'))) {
          secondaryFeedback.push('Strong arms')
        }
      } else if (exercise.includes('lunge')) {
        if (feedback?.some(f => f.toLowerCase().includes('balance'))) {
          secondaryFeedback.push('Find your balance')
        }
        if (feedback?.some(f => f.toLowerCase().includes('step'))) {
          secondaryFeedback.push('Bigger step')
        }
      }
    }
    
    // Determine what to speak
    let messageToSpeak = primaryFeedback
    
    // If we have secondary feedback and accuracy is low, prioritize specific tips
    if (secondaryFeedback.length > 0 && accuracy < 50) {
      messageToSpeak = secondaryFeedback[0] // Use the first specific tip
    }
    
    // Speak the selected message with real-time feedback
    if (messageToSpeak) {
      // Only speak if accuracy has changed significantly or message is different
      const accuracyChange = Math.abs(accuracy - lastSpokenAccuracy.value)
      const isDifferentMessage = messageToSpeak !== lastSpokenFeedback.value
      const timeSinceLastSpoken = Date.now() - lastSpokenTime.value
      
      // Speak if: message changed, accuracy changed by 10%+, or 2+ seconds passed
      if (isDifferentMessage || accuracyChange >= 10 || timeSinceLastSpoken >= 2000) {
        console.log('Speaking:', messageToSpeak, 'for accuracy:', accuracy, 'change:', accuracyChange)
        speakImmediatePoseFeedback(messageToSpeak)
        lastSpokenAccuracy.value = accuracy
        lastSpokenFeedback.value = messageToSpeak
        lastSpokenTime.value = Date.now()
      }
    }
  }
  
  // Generate motivational feedback
  const generateMotivationalFeedback = (exerciseType, repCount = 0) => {
    const motivations = {
      squat: [
        'Perfect squat!',
        'Feel the burn!',
        'Strong legs!',
        'Keep going!',
        'Powerful squats!'
      ],
      plank: [
        'Hold it steady!',
        'Core strength!',
        'Stay strong!',
        'Perfect plank!',
        'Rock solid!'
      ],
      lunge: [
        'Great balance!',
        'Strong lunge!',
        'Keep it up!',
        'Perfect form!',
        'Excellent control!'
      ]
    }
    
    const messages = motivations[exerciseType] || motivations.squat
    const randomMessage = messages[Math.floor(Math.random() * messages.length)]
    
    speak(randomMessage, 'medium')
  }
  
  // Generate countdown feedback
  const speakCountdown = (count) => {
    if (count <= 5 && count > 0) {
      speak(count.toString(), 'high')
    } else if (count === 0) {
      speak('Go!', 'high')
    }
  }
  
  // Control functions
  const toggleVoice = () => {
    isVoiceEnabled.value = !isVoiceEnabled.value
    if (!isVoiceEnabled.value) {
      speechSynthesis.cancel()
      feedbackQueue.value = []
    }
  }
  
  const adjustRate = (newRate) => {
    voiceSettings.rate = Math.max(0.1, Math.min(2.0, newRate))
  }
  
  const adjustVolume = (newVolume) => {
    voiceSettings.volume = Math.max(0.0, Math.min(1.0, newVolume))
  }
  
  const stopSpeaking = () => {
    speechSynthesis.cancel()
    feedbackQueue.value = []
    isPlaying.value = false
  }
  
  // Test function
  const testVoice = () => {
    speak('Voice feedback is working correctly', 'high')
  }

  // Debug function to check voice status
  const debugVoiceStatus = () => {
    console.log('🔍 Debug Voice Status:')
    console.log('Voice Enabled:', isVoiceEnabled.value)
    console.log('Speech Synthesis Supported:', 'speechSynthesis' in window)
    console.log('Available Voices:', speechSynthesis.getVoices().length)
    console.log('Current Settings:', voiceSettings)
  }
  
  // Initialize voice on first use
  initVoice()
  
  return {
    // State
    isVoiceEnabled,
    voiceSettings,
    isPlaying,
    
    // Core functions
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
    testVoice,
    debugVoiceStatus,
    
    // Utilities
    initVoice
  }
} 