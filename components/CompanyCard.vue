<script setup lang="ts">
const props = defineProps({
  company: {
    type: Object,
    required: true,
  },

  showJoinButton: {
    type: Boolean,
    required: false,
    default: true,
  },
});
const { company, showJoinButton } = props;
const items = [
  "https://placehold.co/600x400",
  "https://placehold.co/600x400",
  "https://placehold.co/600x400",
];
</script>
<template>
  <div>
    <UCard class="mb-4">
      <template #header>
        <UCarousel
          ref="carouselRef"
          v-slot="{ item }"
          :items="items"
          :ui="{ item: 'basis-full' }"
          class="rounded-lg overflow-hidden"
          indicators
        >
          <img
            :src="company.avatarUrl || item"
            class="w-full"
            draggable="false"
          />
        </UCarousel>
        <p class="text-center mt-2">{{ company.name }}</p>
      </template>

      <li><b>Address</b>: {{ company.address }}</li>
      <li>
        <b>Phone</b>:
        <a :href="`tel:${company.phone}`">{{ company.phone }}</a>
      </li>
      <li>
        <b>Status</b>:
        <span :class="company.isActive ? 'text-green-500' : 'text-red-500'">
          {{ company.isActive ? "Active" : "Inactive" }}</span
        >
      </li>
      <div class="flex flex-row justify-end mt-2 gap-4">
        <UButton
          v-if="showJoinButton"
          variant="outline"
          @click="$emit('joinThisCompany', company)"
        >
          Join facility
        </UButton>
        <UButton variant="outline" @click="$emit('viewServices', company)">
          View Services
        </UButton>
      </div>
    </UCard>
  </div>
</template>
