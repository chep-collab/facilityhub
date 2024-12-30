<template>
    <section class="bg-white p-8 lg:p-20 w-full">
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-center">All Your Facility Needs in a Unified Solution</h2>
        </div>
        <div class="flex flex-col gap-6 mx-auto">

            <div class="flex flex-col md:flex-row w-full gap-6">
                <BigFeatureItem v-for="feature in aa" :key="feature.title" :feature="feature"/>
            </div>

            <div class="flex flex-col lg:flex-row w-full gap-6">
                <BigFeatureItem v-for="feature in bb" :key="feature.title" :feature="feature"/>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue';

// Define the features array
import serviceManagementImagePath from "~/assets/icons/service-management.png"
import userOnboardingtImagePath from "~/assets/icons/user-onboarding.png"
import subscriptionTrackingImagePath from "~/assets/icons/subscription-tracking.png"
import automatedRenewalsImagePath from "~/assets/icons/automated-renewals.png"
import scanToBookImagePath from "~/assets/icons/scan-to-book.png"
import easyManagementImagePath from "~/assets/icons/easy-management.png"
const features = [
  {
    title: "Service Management",
    description: "Easily add, update, activate, or deactivate services like shared workspaces, gym services, etc. and set prices—all in one place.",
    comingSoon: false,
    imagePath: serviceManagementImagePath,
    smallImage: false
  },
  {
    title: "User Onboarding & App access",
    description: "Invite users to your facility for instant access to services and streamlined onboarding. They also get a web app for easy service access.",
    comingSoon: false,
    imagePath: userOnboardingtImagePath,
    smallImage: false
  },
  {
    title: "Subscription Tracking",
    description: "Track all user subscriptions to your services, helping you manage engagement and renewals.",
    comingSoon: false,
    imagePath: subscriptionTrackingImagePath,
    smallImage: true
  },
  {
    title: "Automated Renewal Reminders",
    description: "Automatic reminders notify users when subscriptions are about to expire, ensuring seamless renewals.",
    comingSoon: true,
    imagePath: automatedRenewalsImagePath,
    smallImage: true
  },
  {
    title: "Quick Booking",
    description: "Users can scan a QR code to instantly book services, making facility access fast and easy.",
    comingSoon: true,
    imagePath: scanToBookImagePath,
    smallImage: true
  },
  {
    title: "Centralized Management Dashboard",
    description: "Access all your management tools in one intuitive dashboard—no more juggling multiple apps.",
    comingSoon: false,
    imagePath: easyManagementImagePath,
    smallImage: true
  }
];

// Use ref to make `aa` and `bb` reactive and accessible in the template
const aa = ref(features.slice(0, 2));
const bb = ref(features.slice(2));
</script>
