<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-400 to-pink-300">
    <div class="w-full max-w-md bg-white bg-opacity-20 rounded-xl shadow-lg p-8">
      <div class="flex flex-col items-center mb-6">
        <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
          <img v-if="profile.profilepic" :src="profile.profilepic" alt="Profile" class="w-24 h-24 object-cover rounded-full" />
          <span v-else class="text-4xl">👤</span>
        </div>
        <input v-if="editing" type="file" accept="image/*" @change="onFileChange" class="mb-2" />
        <button v-if="editing && selectedPic" class="bg-purple-600 text-white px-2 py-1 rounded mb-2" @click="uploadPic">Upload Photo</button>
        <h1 class="text-2xl font-bold text-white mb-2">{{ profile.full_name || 'User' }}</h1>
        <button class="bg-purple-600 text-white px-4 py-1 rounded-lg font-semibold mb-4" @click="editing = !editing">{{ editing ? 'Cancel' : 'Edit Profile' }}</button>
      </div>
      <form v-if="editing" @submit.prevent="updateProfile" class="mb-4">
        <input v-model="editProfile.full_name" type="text" placeholder="Full Name" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
        <input v-model="editProfile.gender" type="text" placeholder="Gender" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
        <input v-model="editProfile.birth_date" type="date" placeholder="Date of Birth" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
        <input v-model.number="editProfile.weight" type="number" placeholder="Weight (kg)" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
        <input v-model.number="editProfile.height" type="number" placeholder="Height (cm)" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
        <input v-model="editProfile.fitness_goal" type="text" placeholder="Fitness Goal" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
        <input v-model="editProfile.activity_level" type="text" placeholder="Activity Level" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
        <button class="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold mt-2">Save</button>
        <div v-if="editError" class="text-red-500 text-center my-2">{{ editError }}</div>
        <div v-if="editSuccess" class="text-green-500 text-center my-2">Profile updated!</div>
      </form>
      <div v-else>
        <div class="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
          <h2 class="text-lg font-semibold text-white mb-2">Personal Information</h2>
          <div class="flex justify-between text-white mb-1">
            <span>Gender:</span><span>{{ profile.gender }}</span>
          </div>
          <div class="flex justify-between text-white mb-1">
            <span>Date of Birth:</span><span>{{ profile.birth_date }}</span>
          </div>
        </div>
        <div class="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
          <h2 class="text-lg font-semibold text-white mb-2">Body Metrics</h2>
          <div class="flex justify-between text-white mb-1">
            <span>Weight:</span><span>{{ profile.weight }} kg</span>
          </div>
          <div class="flex justify-between text-white mb-1">
            <span>Height:</span><span>{{ profile.height }} cm</span>
          </div>
          <div class="flex justify-between text-white mb-1">
            <span>BMI:</span><span>{{ profile.bmi || '-' }}</span>
          </div>
          <div class="flex justify-between text-white mb-1">
            <span>BMI Category:</span><span class="text-green-400">{{ profile.bmi_category || '-' }}</span>
          </div>
        </div>
        <div class="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
          <h2 class="text-lg font-semibold text-white mb-2">Fitness Goals</h2>
          <div class="flex justify-between text-white mb-1">
            <span>Goal:</span><span>{{ profile.fitness_goal }}</span>
          </div>
          <div class="flex justify-between text-white mb-1">
            <span>Activity Level:</span><span>{{ profile.activity_level }}</span>
          </div>
        </div>
      </div>
      <button class="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold" @click="logout">Logout</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'

const profile = ref({})
const editing = ref(false)
const editProfile = ref({})
const editError = ref('')
const editSuccess = ref(false)
const selectedPic = ref(null)
const router = useRouter()

const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('user_id')
  router.push('/login')
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
    const res = await fetch('http://localhost:5000/api/users/profilepic', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ profilepic: selectedPic.value })
    })
    if (res.ok) {
      profile.value.profilepic = selectedPic.value
      selectedPic.value = null
    }
  } catch (e) {}
}

const updateProfile = async () => {
  editError.value = ''
  editSuccess.value = false
  const token = localStorage.getItem('token')
  try {
    const res = await fetch('http://localhost:5000/api/users/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(editProfile.value)
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

onMounted(async () => {
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const res = await fetch('http://localhost:5000/api/users/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        profile.value = data.profile || {}
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