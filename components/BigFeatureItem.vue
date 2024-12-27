<template>
    <UCard :onclick="action">
        <div class="w-full cursor-pointer flex flex-col gap-8">
            <img :src="feature.imagePath" alt="icon" :class="`w-10 lg:w-[${feature.smallImage ? '3.5' : '4'}rem] h-10 lg:h-[${feature.smallImage ? '3.5' : '4'}rem]`" />
            <div class="flex flex-col gap-3">
                <p class="text-[#344054] text-xl font-semibold">{{ feature.title }}</p>
                <p class="text-[#667185] text-base">{{ feature.description }}</p>
            </div>
        </div>
    </UCard>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
    feature: {
        type: Object,
        required: true,
        default: () => ({})
    }
});
</script>