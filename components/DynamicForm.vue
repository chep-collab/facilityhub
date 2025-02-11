<template>
    <div class="dynamic-form">
      <form @submit.prevent="submitForm">
        <div v-if="step === 1">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="form.name" required />
        </div>
  
  
        <div v-if="step === 2">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="form.email" required />
        </div>
  
        <button type="button" @click="nextStep">Next</button>
      </form>
    </div>
  </template>
  
  
  <script>
  import { ref, onMounted } from 'vue';
  import axios from 'axios'; 
  
  
  export default {
    props: {
      step: {
        type: Number,
        required: true,
      },
    },
    emits: ['next'],
    setup(props, { emit }) {
      const form = ref({
        name: '',
        email: '',
      });
  
  
      // This will fetch the form data when the step changes
      const fetchFormData = async (step) => {
        try {
          const response = await axios.get(`/api/form-step/${step}`);
          if (response.data) {
            // To update form fields based on the response data
            for (const key in response.data) {
              if (form.value.hasOwnProperty(key)) {
                form.value[key] = response.data[key];
              }
            }
          }
        } catch (error) {
          console.error('Error fetching form data:', error);
        }
      };
  
      onMounted(() => {
        fetchFormData(props.step);
      });
  

      watch(() => props.step, (newStep) => {
        fetchFormData(newStep);
      });
  
      const nextStep = () => {
        emit('next');
      };
  
  
      return {
        form,
        nextStep,
      };
    },
  };
  </script>
  
  
<style scoped>
  .dynamic-form {
    max-width: 600px;
    margin: 0 auto;
}
  
form {
    display: flex;
    flex-direction: column;
  }
  
  
label {
    margin-bottom: 5px;
}
  
  
input, textarea {
    margin-bottom: 10px;
  }
</style>
  