<template>
  <div class="partner-section w-full py-5 relative overflow-hidden">
    <!-- Section Title -->
    <p class="text-center text-[#344054] text-4xl mb-8">What Our Users Say</p>

    <!-- Carousel Component -->
    <UCarousel :items="items" arrows class="w-full mx-auto">
      <!-- Default Slot for Carousel Item -->
      <template #default="{ item }">
        <div class="flex flex-col md:flex-row w-full items-center text-black rounded-lg overflow-hidden p-4 md:p-6 mr-4"
          style="background: linear-gradient(135deg, rgba(240, 255, 0, 0.55) 0%, rgba(88, 207, 251, 0.55) 100%);">
          <!-- Image on the Left (responsive square) -->
          <img :src="item.avatar.src" alt="User avatar" class="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover"
            draggable="false" />

          <!-- Text on the Right -->
          <div class="mt-4 md:mt-0 md:ml-6 text-center md:text-left">
            <p class="font-semibold text-lg">{{ item.name }}</p>
            <p class="text-sm">{{ item.feedback }}</p>
          </div>
        </div>

      </template>

      <!-- Navigation Buttons -->
      <!-- <template #prev="{ navigatePrev, disabledPrev }">
        <button :disabled="disabledPrev" @click="navigatePrev" class="mr-2 bg-gray-200 text-black px-4 py-2 rounded">
          Prev
        </button>
      </template> -->

      <!-- <template #next="{ navigateNext, disabledNext }">
        <button :disabled="disabledNext" @click="navigateNext" class="ml-2 bg-gray-200 text-black px-4 py-2 rounded">
          Next
        </button>
      </template> -->
    </UCarousel>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const items = [{
  name: 'Sébastien Chopin',
  feedback: 'Nuxt has transformed my development experience!',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/atinux' }
}, {
  name: 'Pooya Parsa',
  feedback: 'I love how Nuxt simplifies complex tasks!',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/pi0' }
}, {
  name: 'Daniel Roe',
  feedback: 'Nuxt makes building applications so much easier!',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/danielroe' }
}, {
  name: 'Anthony Fu',
  feedback: 'Nuxt’s flexibility is unmatched in the industry.',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/antfu' }
},{
  name: 'Sébastien Chopin',
  feedback: 'Nuxt has transformed my development experience!',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/atinux' }
}, {
  name: 'Pooya Parsa',
  feedback: 'I love how Nuxt simplifies complex tasks!',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/pi0' }
}, {
  name: 'Daniel Roe',
  feedback: 'Nuxt makes building applications so much easier!',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/danielroe' }
}, {
  name: 'Anthony Fu',
  feedback: 'Nuxt’s flexibility is unmatched in the industry.',
  avatar: { src: 'https://ipx.nuxt.com/f_auto,s_192x192/gh_avatar/antfu' }
}]
</script>

<style scoped>
/* No additional styling needed for basic responsiveness */
</style>
