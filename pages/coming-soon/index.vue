<template>
    <div class="flex items-center justify-center h-screen bg-coming-soon bg-cover bg-center text-center">
      
      <div>
        <h1 class="text-2xl sm:text-4xl font-bold text-black animate-fade-in animate-glistening">Coming Soon...</h1>
        <p class="mt-4 text-lg sm:text-base md:text-lg text-green-700 animate-fade-in delay-200">We are working hard to bring you this feature. Stay tuned!</p>
        <p class="mt-4 text-sm text-gray-700 animate-fade-in delay-400">© Copyright 2024, All Rights Reserved by FacilityHub</p>
      </div>
    </div>
  </template>
  
  <style scoped>
  @keyframes shimmer {
    0% {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.6);
    }
    50% {
      text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 255, 255, 0.7);
    }
    100% {
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.7), 0 0 20px rgba(255, 255, 255, 0.6);
    }
  }
  
  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-glistening {
    animation: shimmer 1.5s ease-in-out infinite;
  }
  
  .animate-fade-in {
    animation: fade-in 1.2s ease-out forwards;
  }
  
  .delay-100 {
    animation-delay: 0.1s;
  }
  
  .delay-200 {
    animation-delay: 0.2s;
  }
  </style>
  