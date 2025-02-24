<template>
    <div class="onboarding">
      <!-- Progress Bar -->
      <div class="progress-bar">
        <div class="progress" :style="{ width: `${progress}%` }"></div>
      </div>
  
      <DynamicForm :step="currentStep" @next="nextStep" />
    </div>
  </template>
  
  
  <script>
  import DynamicForm from './DynamicForm.vue';
  
  
  export default {
    components: {
      DynamicForm,
    },
    setup() {
      // The current step of the form
      const currentStep = ref(1);
      
      // The number of steps 
      const totalSteps = 5;
  
  
      // To calculate progress as a percentage
      const progress = computed(() => (currentStep.value / totalSteps) * 100);
  
      const nextStep = () => {
        if (currentStep.value < totalSteps) {
          currentStep.value += 1;
        } else {
          alert('Form Complete!');
        }
      };
  
  
      return {
        currentStep,
        progress,
        nextStep,
      };
    },
  };
  </script>
  
  
<style scoped>

.progress-bar {
    width: 100%;
    height: 10px;
    background-color: #ddd;
    margin-bottom: 20px;
  }

.progress {
    height: 100%;
    background-color: #4caf50;
  }
</style>
  