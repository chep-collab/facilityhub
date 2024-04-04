<script setup lang="ts">
import { ref } from "vue";
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
  <div class="w-full">
    <h1 class="text-3xl">Workspace</h1>

    <br />
    <UButton
      @click="router.push('offers')"
      color="white"
      variant="solid"
      size="xl"
      block
    >
      <div class="flex flex-row w-full">
        <div class="w-full text-right">Manage your &nbsp;</div>
        <div class="w-full text-left">
          <span class="text-green-400">{{ displayedService }}</span>
        </div>
      </div>
    </UButton>

    <br />
    <UButton
      @click="router.push('facilities')"
      color="white"
      variant="solid"
      size="xl"
      block
    >
      Find facilities
    </UButton>
  </div>
</template>
