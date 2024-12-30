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
  <UCard :onclick="action" class="w-[120px] cursor-pointer">
    <img :src="icon" alt="icon" class="w-8 h-8 mb-4" />
    <p class="h-8 text-[#475367] text-base font-medium">{{ title }}</p>
  </UCard>
</template>