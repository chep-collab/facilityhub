<template>
  <div class="onboarding">
    <DynamicForm />
  </div>
</template>

<script>
export default {
  components: {},
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
        alert("Form Complete!");
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
.onboarding {
  padding-block: 96px;
}
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
