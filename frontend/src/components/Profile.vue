<template>
  <div class="min-h-screen bg-gradient-to-b from-purple-400 to-pink-300 pb-20">
    <!-- Profile Header -->
    <div class="pt-8 pb-4 text-center">
      <div class="w-20 h-20 rounded-full bg-white mx-auto mb-3 flex items-center justify-center border-2 border-white overflow-hidden">
        <img
          v-if="profileImageSrc"
          :src="profileImageSrc"
          alt="Profile Picture"
          class="w-full h-full object-cover"
          @load="onImageLoad"
          @error="onImageError"
        />
        <span v-else class="text-2xl">{{ getInitials(profile.full_name) }}</span>
      </div>
      <h1 class="text-2xl font-bold text-white mb-1">{{ profile.full_name }}</h1>
      <p class="text-white/90">{{ formatGoal(profile.fitness_goal) }}</p>
    </div>

    <!-- Main Content -->
    <div class="max-w-md mx-auto px-4">
      <!-- Profile Info View -->
      <div v-if="!editing" class="bg-white rounded-3xl shadow-lg overflow-hidden mb-4">
        <div class="p-6">
          <!-- Personal Information -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Gender</span>
                <span class="font-medium">{{ profile.gender }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Date of Birth</span>
                <span class="font-medium">{{ formatDate(profile.birth_date) }}</span>
              </div>
            </div>
          </div>

          <!-- Body Metrics -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Body Metrics</h2>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Weight</span>
                <span class="font-medium">{{ profile.weight }} kg</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Height</span>
                <span class="font-medium">{{ profile.height }} cm</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">BMI</span>
                <span class="font-medium">{{ profile.bmi }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">BMI Category</span>
                <span class="font-medium text-green-500">{{ profile.bmi_category }}</span>
              </div>
            </div>
          </div>

          <!-- Fitness Goals -->
          <div class="mb-6">
            <h2 class="text-lg font-semibold text-gray-800 mb-4">Fitness Goals</h2>
            <div class="space-y-4">
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Goal</span>
                <span class="font-medium">{{ profile.fitness_goal }}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-600">Activity Level</span>
                <span class="font-medium">{{ profile.activity_level }}</span>
              </div>
            </div>
          </div>

          <!-- Edit Profile Button -->
          <button 
            @click="editing = true"
            class="w-full bg-purple-600 text-white py-3 rounded-xl font-medium mb-4"
          >
            Edit Profile
          </button>

          <!-- Logout Button -->
          <button 
            @click="logout"
            class="w-full bg-red-500 text-white py-3 rounded-xl font-medium"
          >
            Logout
          </button>

          <!-- Report Issue Button -->
          <button 
            @click="showReportModal = true"
            class="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium mt-4 hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Report Issue
          </button>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-else class="bg-white rounded-3xl shadow-lg overflow-hidden">
        <div class="p-6">
          <form @submit.prevent="updateProfile" class="space-y-4">
            <!-- Profile Picture Section -->
            <div class="mb-6">
              <label class="block text-gray-600 mb-2">Profile Picture</label>
              <button 
                type="button"
                @click="$refs.fileInput.click()"
                class="px-6 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              >
                Choose Photo
              </button>
              <input 
                type="file" 
                accept="image/*" 
                @change="onFileChange" 
                class="hidden" 
                ref="fileInput"
              />
            </div>

            <!-- Form Fields -->
            <div class="space-y-4">
              <div>
                <label class="block text-gray-600 mb-2">Full Name</label>
                <input 
                  v-model="editProfile.full_name" 
                  type="text" 
                  class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-600 mb-2">Gender</label>
                  <select 
                    v-model="editProfile.gender"
                    class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Select</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label class="block text-gray-600 mb-2">Date of Birth</label>
                  <input 
                    v-model="editProfile.birth_date" 
                    type="date" 
                    class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-600 mb-2">Weight (kg)</label>
                  <input 
                    v-model.number="editProfile.weight" 
                    type="number" 
                    class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label class="block text-gray-600 mb-2">Height (cm)</label>
                  <input 
                    v-model.number="editProfile.height" 
                    type="number" 
                    class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-gray-600 mb-2">Fitness Goal</label>
                  <select 
                    v-model="editProfile.fitness_goal"
                    class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Select</option>
                    <option value="lose_weight">Lose Weight</option>
                    <option value="gain_muscle">Gain Muscle</option>
                    <option value="maintain">Maintain</option>
                    <option value="improve_fitness">Improve Fitness</option>
                  </select>
                </div>

                <div>
                  <label class="block text-gray-600 mb-2">Activity Level</label>
                  <select 
                    v-model="editProfile.activity_level"
                    class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">Select</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Error/Success Messages -->
            <div v-if="editError" class="p-3 bg-red-50 text-red-600 rounded-lg">{{ editError }}</div>
            <div v-if="editSuccess" class="p-3 bg-green-50 text-green-600 rounded-lg">Profile updated successfully!</div>

            <!-- Form Buttons -->
            <div class="grid grid-cols-2 gap-4 mt-6">
              <button 
                type="submit"
                class="w-full bg-purple-600 text-white py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                Save Changes
              </button>
              <button 
                type="button"
                @click="editing = false"
                class="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Report Issue Modal -->
    <div v-if="showReportModal" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black bg-opacity-50" @click="showReportModal = false"></div>
      
      <!-- Modal -->
      <div class="relative min-h-screen flex items-center justify-center p-4">
        <div class="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
          <h2 class="text-xl font-bold mb-4">Report an Issue</h2>
          
          <!-- Report Form -->
          <form @submit.prevent="submitReport">
            <!-- Issue Type -->
            <div class="mb-4">
              <label class="block text-gray-600 mb-2">Issue Type</label>
              <select 
                v-model="reportForm.type"
                class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                required
              >
                <option value="">Select Type</option>
                <option value="bug">Bug Report</option>
                <option value="feature">Feature Request</option>
                <option value="feedback">General Feedback</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Description -->
            <div class="mb-4">
              <label class="block text-gray-600 mb-2">Description</label>
              <textarea 
                v-model="reportForm.description"
                rows="4"
                class="w-full px-4 py-2 rounded-lg border border-gray-200 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                placeholder="Please describe the issue in detail..."
                required
              ></textarea>
            </div>

            <!-- Buttons -->
            <div class="flex space-x-3">
              <button 
                type="button"
                @click="showReportModal = false"
                class="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                class="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                :disabled="isSubmitting"
              >
                {{ isSubmitting ? 'Submitting...' : 'Submit Report' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Success Toast -->
    <div 
      v-if="showSuccessToast"
      class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform"
      :class="{ 'translate-y-0 opacity-100': showSuccessToast, 'translate-y-8 opacity-0': !showSuccessToast }"
    >
      Report submitted successfully!
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { API_BASE_URL } from '../config/environment.js'

const profile = ref({})
const editing = ref(false)
const editProfile = ref({})
const editError = ref('')
const editSuccess = ref(false)
const selectedPic = ref(null)
const imageLoaded = ref(false)
const profileImageSrc = ref('')
const router = useRouter()
const fileInput = ref(null)
const showReportModal = ref(false)
const showSuccessToast = ref(false)
const isSubmitting = ref(false)
const reportForm = ref({
  type: '',
  description: ''
})

const getInitials = (name) => {
  if (!name) return '👤'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
}

const formatGoal = (goal) => {
  if (!goal) return 'Not set'
  return goal
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_id')
  router.push('/login')
}

const formatDate = (dateString) => {
  if (!dateString) return 'Not set'
  
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

const processProfileImage = (base64String) => {
  if (!base64String) {
    profileImageSrc.value = ''
    return
  }
  
  // Ensure the base64 string has the proper data URL format
  if (base64String.startsWith('data:image/')) {
    profileImageSrc.value = base64String
  } else {
    // If it's just the base64 string without the data URL prefix, add it
    profileImageSrc.value = `data:image/jpeg;base64,${base64String}`
  }
}

const onImageLoad = () => {
  imageLoaded.value = true
  console.log('Profile image loaded successfully')
}

const onImageError = () => {
  imageLoaded.value = false
  profileImageSrc.value = ''
  console.log('Profile image failed to load')
}

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (event) => {
      selectedPic.value = event.target.result
    }
    reader.readAsDataURL(file)
  }
}

const uploadPic = async () => {
  const token = localStorage.getItem('token')
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/profilepic`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ profilepic: selectedPic.value })
    })
    if (res.ok) {
      profile.value.profilepic = selectedPic.value
      processProfileImage(selectedPic.value)
      selectedPic.value = null
      editSuccess.value = true
    }
  } catch (e) {
    console.error('Error uploading profile picture:', e)
    editError.value = 'Failed to upload profile picture'
  }
}

const updateProfile = async () => {
  editError.value = ''
  editSuccess.value = false
  const token = localStorage.getItem('token')
  // Prepare payload
  const payload = { ...editProfile.value }
  if (!payload.profile_pic || typeof payload.profile_pic !== 'string') {
    delete payload.profile_pic
  }
  // Remove username from payload (cannot be updated)
  delete payload.username
  delete payload.email
  try {
    const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })
    if (res.ok) {
      const data = await res.json()
      profile.value = { ...profile.value, ...editProfile.value }
      // Optionally recalculate BMI
      if (profile.value.height && profile.value.weight) {
        const heightM = profile.value.height > 10 ? profile.value.height / 100 : profile.value.height
        const bmi = profile.value.weight / (heightM * heightM)
        profile.value.bmi = bmi.toFixed(1)
        if (bmi < 18.5) profile.value.bmi_category = 'Underweight'
        else if (bmi < 25) profile.value.bmi_category = 'Normal'
        else if (bmi < 30) profile.value.bmi_category = 'Overweight'
        else profile.value.bmi_category = 'Obese'
      }
      editSuccess.value = true
      editing.value = false
    } else {
      const data = await res.json()
      editError.value = data.message || 'Update failed.'
    }
  } catch (e) {
    editError.value = 'Could not connect to server.'
  }
}

const submitReport = async () => {
  try {
    isSubmitting.value = true
    
    // Make API call to submit report
    const response = await fetchWithAuth(`${API_BASE_URL}/api/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: reportForm.value.type,
        description: reportForm.value.description,
        user_id: localStorage.getItem('user_id')
      })
    })

    if (response.ok) {
      // Show success message
      showReportModal.value = false
      showSuccessToast.value = true
      
      // Reset form
      reportForm.value = {
        type: '',
        description: ''
      }

      // Hide success toast after 3 seconds
      setTimeout(() => {
        showSuccessToast.value = false
      }, 3000)
    } else {
      const error = await response.json()
      throw new Error(error.message || 'Failed to submit report')
    }
  } catch (error) {
    alert(error.message)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        profile.value = data.profile || {}
        // Process profile image if it exists
        if (profile.value.profilepic) {
          processProfileImage(profile.value.profilepic)
        }
        // Optionally calculate BMI and category
        if (profile.value.height && profile.value.weight) {
          const heightM = profile.value.height > 10 ? profile.value.height / 100 : profile.value.height
          const bmi = profile.value.weight / (heightM * heightM)
          profile.value.bmi = bmi.toFixed(1)
          if (bmi < 18.5) profile.value.bmi_category = 'Underweight'
          else if (bmi < 25) profile.value.bmi_category = 'Normal'
          else if (bmi < 30) profile.value.bmi_category = 'Overweight'
          else profile.value.bmi_category = 'Obese'
        }
      }
    } catch (e) {
      // ignore
    }
  }
})

watch(editing, (val) => {
  if (val) {
    editProfile.value = { ...profile.value }
  }
})
</script>

<style scoped>
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>