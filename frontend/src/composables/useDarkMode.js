import { ref, watch, onMounted } from 'vue'

const isDarkMode = ref(false)

export function useDarkMode() {
  const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value
  }

  const setDarkMode = (value) => {
    isDarkMode.value = value
  }

  // Watch for changes and update the DOM
  watch(isDarkMode, (newValue) => {
    if (newValue) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }, { immediate: true })

  // Initialize dark mode from localStorage
  onMounted(() => {
    const savedMode = localStorage.getItem('darkMode')
    if (savedMode !== null) {
      isDarkMode.value = savedMode === 'true'
    } else {
      // Check system preference if no saved preference
      isDarkMode.value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    }
  })

  return {
    isDarkMode,
    toggleDarkMode,
    setDarkMode
  }
} 