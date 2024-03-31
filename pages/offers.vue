<script setup lang="ts">
import { useRouter } from "vue-router";

definePageMeta({
  layout: "service-layout",
});
const router = useRouter();
const serviceTypes = [
  "Coworking Space",
  "Study Center",
  "Private Offices",
  "Training Halls",
  "Meeting Halls",
  "Conference Rooms",
  "Classrooms",
  "Labs",
];
const displayedService = ref(serviceTypes[0]);

const offers = [
  {
    label: "1. Product/Service Management",
    content: "Create and manage products that users can subscribe to",
    defaultOpen: true,
  },
  {
    label: "2. Facility User Management",
    content: "See all the users that have joined your facility",
  },
  {
    label: "3. Subscription Managment",
    content: "Manage user subscriptions",
  },
  {
    label: "4. Attendance Management (Coming soon)",
    content: "Get insights into when users use your facility",
  },
];
setInterval(() => {
  const randomIndex = Math.floor(Math.random() * serviceTypes.length);
  displayedService.value = serviceTypes[randomIndex];
}, 1000);
</script>
<template>
  <div class="h-screen">
    <div class="flex flex-row gap-4 justify-end">
      <UButton
        @click="router.push('company/login')"
        variant="outline"
        size="xl"
      >
        Login
      </UButton>
      <UButton @click="router.push('company/signup')" variant="solid" size="xl">
        Get started
      </UButton>
    </div>
    <div class="flex flex-col gap-5 md:text-7xl text-6xl h-[40%]">
      <p>Manage</p>
      <p>your</p>
      <p class="text-green-400">{{ displayedService }}</p>
    </div>
    <div class="md:w-1/2 w-full">
      <h1 class="pt-4 text-lg">What do you get ?</h1>
      <br />
      <hr />
      <br />
      <UAccordion color="white" variant="outline" size="lg" :items="offers" />
    </div>

    <br />
  </div>
</template>
