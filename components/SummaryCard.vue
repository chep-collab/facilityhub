<script setup lang="ts">
const props = defineProps({
    value: {
        type: Number,
        required: true,
    },

    title: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <UCard class="w-full lg:max-w-[336px]">
        <p class="h-8 text-[#475367] text-3xl font-semibold mb-6">{{ value }}</p>
        <p class="h-8 text-[#475367] text-lg font-medium">{{ title }}</p>
    </UCard>
</template>