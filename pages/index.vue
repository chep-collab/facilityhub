<template>
  <nav class="bg-white p-8 lg:px-20">
    <div class="mx-auto flex items-center justify-between">
      <!-- Logo -->
      <div class="text-grey-800 text-lg font-semibold">
        <a href="/">Facility Hub</a>
      </div>

      <!-- Center Navigation Items (hidden on small screens) -->
      <ul class="hidden md:flex gap-12 text-grey-800">
        <!-- <li><a href="#home" class="hover:text-gray-400">Home</a></li> -->
        <li><a href="#about" class="hover:text-gray-400">About Us</a></li>
        <li><a href="#features" class="hover:text-gray-400">Features</a></li>
        <!-- <li><a href="#pricing" class="hover:text-gray-400">Pricing</a></li> -->
        <li>
          <a href="https://wa.me/2348152435800" class="hover:text-gray-400"
            >Contact</a
          >
        </li>
      </ul>

      <!-- Right buttons for Sign Up and Login (hidden on small screens) -->
      <div class="hidden md:flex space-x-4">
        <button
          class="text-grey-800 border border-grey-800 px-4 py-2 rounded-full"
          @click="router.push('company/login')"
        >
          Login
        </button>
        <button
          class="bg-[#006B00] text-white px-4 py-2 rounded-full"
          @click="router.push('company/signup')"
        >
          Sign Up
        </button>
      </div>

      <!-- Hamburger menu for mobile -->
      <button
        @click="isOpen = !isOpen"
        class="md:hidden relative focus:outline-none"
      >
        <span
          class="absolute inset-0 rounded-full animate-ping bg-[#006B00] opacity-75"
          aria-hidden="true"
        ></span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6 relative z-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile Menu (only visible when isOpen is true) -->
    <div v-if="isOpen" class="md:hidden mt-4 p-4">
      <ul class="space-y-4 text-grey-800 text-center">
        <!-- <li><a href="#home" class="hover:text-grey-400">Home</a></li> -->
        <li><a href="#about" class="hover:text-grey-400">About</a></li>
        <li><a href="#features" class="hover:text-grey-400">Features</a></li>
        <li><a href="#contact" class="hover:text-grey-400">Contact</a></li>
        <li>
          <button
            class="bg-[#006B00] text-white w-full py-2 rounded"
            @click="router.push('company/signup')"
          >
            Sign Up
          </button>
        </li>
        <li>
          <button
            class="text-grey-800 border border-grey-800 border border-grey-800 w-full py-2 rounded"
            @click="router.push('company/login')"
          >
            Login
          </button>
        </li>
      </ul>
    </div>
  </nav>
  <Hero />
  <!-- <TrustedBy/> -->
  <Features />
  <BookADemo />
  <WhoWeAre />
  <!-- <Partners/> -->
  <!-- <Testimonials/> -->
  <StartNow />
  <WebsiteFooter />
</template>

<script setup>
import { ref } from "vue";
const router = useRouter();
const isOpen = ref(false);
</script>

<style scoped>
/* Add any additional styling here if needed */
</style>
