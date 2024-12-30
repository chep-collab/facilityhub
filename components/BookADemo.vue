<template>
    <section
        class="flex items-center justify-center py-8 md:py-20 bg-gradient-to-r from-[#F0FF00] to-[#58CFFB] text-center p-8">
        <div class="space-y-6">
            <h1 class="text-2xl md:text-4xl font-bold text-gray-800">
                Revolutionize Your Facility Experience with Satisfaction
            </h1>

            <p class="text-base md:text-lg text-gray-600">
                Facility Hub provides the tools you need to manage and connect your spaces efficiently. Schedule a demo
                to learn more.
            </p>
            <br>
            <a href="https://forms.gle/PhZW1dHoDz5L99Qf8" target="_blank"
                class="bg-[#000000] text-white px-6 py-3 rounded-md hover:bg-green-600">
                Book a Demo
            </a>
        </div>
    </section>
</template>

<style scoped>
/* Additional styles if necessary */
</style>

<script setup>
const openEmail = () => {
    if (process.client) {
        window.location.href = 'https://forms.gle/PhZW1dHoDz5L99Qf8';
    }
};
</script>
