<script setup lang="ts">
const props = defineProps({
  icon: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  action: {
    type: Function,
    required: true
  }
});
</script>

<template>
 <UCard :ui="{body:{base:'flex flex-col items-center justify-center'}}" :onclick="action" class=" cursor-pointer flex flex-col items-center justify-center text-left">
    <img :src="icon" alt="icon" class="w-8 h-8 mb-4 object-contain" />
    <p class="text-[#475367] text-base font-medium">{{ title }}</p>
  </UCard>
</template>