<template>
    <section class="bg-white p-8 lg:p-20 w-full">
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-center">All Your Workspace Needs in a Unified Solution</h2>
        </div>
        <div class="flex flex-col gap-6 mx-auto">

            <!-- First Row with 2 Boxes -->
            <div class="flex flex-col md:flex-row w-full gap-6">
                <div v-for="feature in aa" :key="feature.title"
                    class="flex flex-col w-full justify-between p-4 border border-[#E4E7EC] rounded-xl">
                    <h3 class="text-lg font-semibold">{{feature.title}}</h3>
                    <p class="text-sm">{{ feature.description }}</p>
                    <img src="../assets/landing-page/feature1.jpeg" alt="Feature 1"
                        class="w-full h-48 md:h-80 object-cover mb-4 rounded-lg">
                </div>
            </div>

            <!-- Second Row with 4 Boxes -->
            <div class="flex flex-col md:flex-row w-full gap-6">
                <div v-for="feature in bb" :key="feature.title"
                    class="flex flex-col w-full justify-between p-4 border border-[#E4E7EC] rounded-xl">
                    <h3 class="text-lg font-semibold">{{ feature.title }}</h3>
                    <p class="text-sm">{{ feature.description }}</p>
                    <img src="../assets/landing-page/feature2.jpeg" alt="Feature 2"
                        class="w-full h-48 md:h-80 object-cover mb-4 rounded-lg">
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

// Define the features array
const features = [
  {
    title: "Service Management",
    description: "Easily add, update, activate, or deactivate services like shared workspaces and set prices—all in one place."
  },
  {
    title: "User Onboarding",
    description: "Invite users directly to your facility, giving them instant access to your services and simplifying onboarding."
  },
  {
    title: "Subscription Tracking",
    description: "Track all user subscriptions to your services, helping you manage engagement and renewals."
  },
  {
    title: "Automated Renewal Reminders",
    description: "Automatic reminders notify users when subscriptions are about to expire, ensuring seamless renewals."
  },
  {
    title: "Quick Booking",
    description: "Users can scan a QR code to instantly book services, making facility access fast and easy."
  },
  {
    title: "Centralized Management Dashboard",
    description: "Access all your management tools in one intuitive dashboard—no more juggling multiple apps."
  }
];

// Use ref to make `aa` and `bb` reactive and accessible in the template
const aa = ref(features.slice(0, 2));
const bb = ref(features.slice(2));
</script>
