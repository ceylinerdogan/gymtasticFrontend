<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-purple-400 to-pink-300">
    <div class="w-full max-w-md bg-white bg-opacity-20 rounded-xl shadow-lg p-8">
      <h2 class="text-2xl font-bold text-white mb-6 text-center">Edit Profile</h2>
      <form>
        <div class="mb-4">
          <input type="text" placeholder="First Name" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
          <input type="text" placeholder="Last Name" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
        </div>
        <div class="mb-4">
          <select class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none">
            <option disabled selected>Gender</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
          <input type="date" placeholder="Date of Birth" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
        </div>
        <div class="mb-4 flex gap-2">
          <input type="number" placeholder="Weight (kg)" class="w-1/2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
          <input type="number" placeholder="Height (cm)" class="w-1/2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
        </div>
        <div class="mb-4">
          <input type="text" placeholder="Fitness Goal" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
          <input type="text" placeholder="Activity Level" class="w-full mb-2 px-4 py-2 rounded-lg bg-white bg-opacity-80 focus:outline-none" />
        </div>
        <button class="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold mb-2">Save Profile</button>
      </form>
    </div>
  </div>
</template>

<script setup>
// Add logic here later
</script> 