<script setup lang="ts">
import greenDotPath from "~/assets/icons/green-dot.png"
const props = defineProps({
    companyName: {
        type: String,
        required: true,
    },

    serviceName: {
        type: String,
        required: true,
    },

    startDate: {
        type: String,
        required: true,
    },

    endDate: {
        type: String,
        required: true,
    },
});
</script>

<template>
    <UCard class="w-full lg:max-w-[336px]">
        <p class="h-8 text-[#475367] text-3xl font-semibold mb-6">{{ companyName }}</p>
        <div class="flex flex-row items-center gap-2">
            <span class="h-8 text-[#475367] text-lg font-medium">{{ serviceName }}</span>
            <img :src="greenDotPath" class="h-2 w-2"/>
            <span class="text-green-500">Active</span>
        </div>
        <div class="flex flex-row items-center gap-2">
            <p>{{ startDate }}</p>
            <p>-  {{ endDate }}</p>
        </div>
    </UCard>
</template>