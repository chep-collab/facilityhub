<template>
    <div class="partner-section w-full py-5 relative overflow-hidden">
      <!-- Green bar above -->
      <p class="text-center text-[#344054] text-4xl mb-8">Trusted By</p>

      <div class="h-4 bg-[#55AA55] w-full"></div>

      <!-- Scrolling container for partners -->
      <div class="partner-container flex items-center overflow-hidden whitespace-nowrap my-2 space-x-4">
       
        
        <!-- Scrolling images of partners -->
      <div class="partner-list inline-flex justify-between gap-4 animate-scroll-left w-full">
        <img
          v-for="(partner, index) in [1,2,3,4,5]"
          :key="index"
          src="../assets/landing-page/rakuten.png"
          alt="Partner Logo"
          class="partner-logo w-24 h-auto mr-5"
        />
      </div>
    </div>

      <!-- Green bar below -->
      <div class="h-4 bg-[#55AA55] w-full"></div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'

  </script>
  
  <style scoped>
  @keyframes scroll-left {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-100%);
    }
  }
  
  .animate-scroll-left {
    animation: scroll-left 20s linear infinite;
  }
  </style>
  