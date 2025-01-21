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
    <UCard class="w-[45%] sm:w-[45%] lg:max-w-[250px] py-4 px-1">
        <p class="h-8 text-[#475367] text-3xl font-semibold mb-6">{{ value }}</p>
        <p class="h-8 text-[#475367] text-lg font-medium">{{ title }}</p>
    </UCard>
</template>