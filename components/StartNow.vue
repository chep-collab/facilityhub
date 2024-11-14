<template>
    <section class="relative h-[200px] my-10 md:mx-20 flex items-center justify-center text-center bg-cover bg-center bg-no-repeat"
        style="background-image: url('../assets/landing-page/bluebg.png');">
        <!-- Overlay for readability -->
        <div class="absolute inset-0 bg-[#2563EB] md:rounded-lg"></div>

        <!-- Content -->
        <div class="relative z-10 px-4">
            <h1 class="text-white text-3xl md:text-5xl font-bold mb-4">
                Start Managing Your Workspace Now
            </h1>
            <button
                class="bg-black text-white px-6 py-3 rounded-lg text-lg md:text-xl font-semibold hover:bg-yellow-600 transition duration-300">
                Start Now
            </button>
        </div>
    </section>
</template>

<style scoped>
/* Ensure background image covers entire section */
.bg-cover {
    background-size: cover;
}
</style>