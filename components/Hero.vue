<template>
    <section id="hero" class="flex flex-col md:flex-row items-center p-8 lg:p-20">
        <!-- Left Side: Text Section -->
        <div class="md:w-1/2 space-y-6 md:pr-8">
            <h1 class="text-4xl lg:text-7xl font-bold text-gray-800">
                Effortless <br> Facility Management
            </h1>
            <img src="../assets/landing-page/curved-line.png" class="h-4 w-12">
            <p class="text-lg lg:text-xl text-gray-600">
                Manage your facilites (workspaces, gyms, etc.), users, subscriptions, and services in one place.
            </p>
            <div class="flex space-x-4">
                <button class="bg-[#006B00] text-white px-6 py-3 rounded-md" @click="router.push('company/signup')">
                    Get Started
                </button>
                <a href="https://forms.gle/PhZW1dHoDz5L99Qf8" target="_blank" rel="noopener noreferrer"
                    class="bg-transparent text-grey-800 border border-[#006B00] px-6 py-3 rounded-md inline-block">
                    Book A Demo
                </a>
            </div>
        </div>

        <!-- Right Side: Image Section -->
        <div class="md:w-1/2 mt-6 md:mt-0 flex justify-center">
            <img src="../assets/landing-page/main-hero.png" alt="Hero Image"
                class="w-full md:w-[500px] md:h-[500px] lg:w-[800px] lg:h-[600px] rounded-lg shadow-lg object-cover" />
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
const router = useRouter();
const isOpen = ref(false)
</script>

<style scoped>
/* Additional styles if necessary */
</style>