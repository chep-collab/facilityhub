<!-- This is the dedicated authentication layou file for the forms -->
<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <UCard class="w-full max-w-md p-8 rounded-xl shadow-lg bg-white">
        <template #header>
          <h2 class="text-2xl font-semibold text-center text-gray-900">
            <slot name="title">The Layout Authentication Page</slot>
          </h2>
        </template>
  
        <div>
          <slot></slot>
        </div>
  
        <template #footer>
          <div class="flex justify-between items-center mt-6">
            <slot name="footer"></slot>
          </div>
        </template>
      </UCard>
  
      <UButton 
        to="/" 
        class="mt-6 text-green-500 border-2 border-green-500 py-2 px-4 rounded-md bg-white hover:bg-green-100 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
        Back to Home
      </UButton>
    </div>
  </template>