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

setInterval(() => {
  const randomIndex = Math.floor(Math.random() * serviceTypes.length);
  displayedService.value = serviceTypes[randomIndex];
}, 1000);
</script>
<template>
  <div class="h-screen">
    <div class="flex flex-col md:flex-row gap-5 text-6xl h-[40%]">
      <p>Manage</p>
      <p>your</p>
      <p class="text-yellow-400">{{ displayedService }}</p>
    </div>
    <h1 class="pt-4 text-lg">What do you get ?</h1>
    <UAccordion
      color="white"
      variant="ghost"
      size="lg"
      :items="[
        {
          label: '1. Product/Service Management',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          defaultOpen: true,
        },
        {
          label: '2. Facility User Management',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
          label: '3. Subscription Managment',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },
        {
          label: '4. Attendance Management',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
        },
      ]"
    />

    <br />

    <div class="flex flex-row justify-end">
      <UButton @click="router.push('company/login')" variant="solid" size="xl">
        Get started
      </UButton>
    </div>
  </div>
</template>
