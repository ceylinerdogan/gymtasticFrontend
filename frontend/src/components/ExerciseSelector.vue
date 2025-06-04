<template>
  <div class="w-full px-4 py-6">
    <div class="mb-4 text-center">
      <h2 class="text-xl font-bold text-gray-800">Select Exercise</h2>
    </div>
    <div class="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4 justify-center">
      <button 
        v-for="exercise in exercises" 
        :key="exercise"
        @click="selectExercise(exercise)"
        :class="[
          'py-3 px-5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
          selectedExercise === exercise 
            ? 'bg-indigo-600 text-white shadow-md hover:bg-indigo-700' 
            : 'bg-white text-gray-700 shadow hover:bg-gray-50'
        ]"
      >
        {{ exercise }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const exercises = ['Squat', 'Plank', 'Lunge'];
const selectedExercise = ref('Squat');

const emit = defineEmits(['exercise-selected']);

function selectExercise(exercise) {
  selectedExercise.value = exercise;
  emit('exercise-selected', exercise);
}
</script> 