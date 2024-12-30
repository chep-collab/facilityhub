<template>
    <section class=" p-8 lg:p-20">
        <h1 class="text-4xl lg:text-7xl text-center font-bold text-gray-800">
            Who we are
        </h1>
        <div id="hero" class="flex flex-col md:flex-row items-center mt-4">
            <!-- Left Side: Text Section -->
            <div class="md:w-1/2 space-y-6 md:pr-8">
                <div class="text-center">
                    <img src="../assets/icons/company.png" alt="Hero Image"
                        class="mx-auto md:mx-0 md:w-[40px] md:h-[40px] rounded-lg shadow-lg object-cover" />
                </div>

                <p class="text-lg lg:text-xl text-gray-600 text-center md:text-left">
                    Facility Hub is a comprehensive platform for workspace owners and users. Workspace owners can list and manage their available services, invite users to join and subscribe to their services, and manage subscriptions in one app.
                    <br> <br>
                    Users benefit from a streamlined subscription experience and access to personalized dashboards, making it easy to find and book spaces
                    that suit their needs. </p>
            </div>

            <div class="md:w-1/2 mt-3 md:mt-0 flex justify-center">
                <img src="../assets/landing-page/whoweare.jpeg" alt="Hero Image"
                    class="w-full md:w-[500px] md:h-[500px] lg:w-[800px] lg:h-[600px] rounded-lg shadow-lg object-cover" />
            </div>
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