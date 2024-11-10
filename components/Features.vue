<template>
    <section class="bg-white p-8 lg:p-20 w-full">
        <div class="mb-8">
            <h2 class="text-3xl font-bold">All Your Workspace Needs? <br> One Unified Solution</h2>
        </div>
        <div class="flex flex-col gap-6 mx-auto px-4">

            <!-- First Row with 2 Boxes -->
            <div class="flex flex-col md:flex-row w-full p-4 gap-6">
                <div v-for="name in [1, 2]"
                    class="flex flex-col w-full items-center justify-between p-4 border border border-[#E4E7EC] rounded-[40px]">
                    <h3 class="text-lg font-semibold">Feature 1</h3>
                    <p class="text-sm">Brief description of Feature 1.</p>
                    <img src="../assets/landing-page/feature1.jpeg" alt="Feature 1"
                        class="w-full h-48 object-cover mb-4">
                </div>
            </div>

            <!-- Second Row with 3 Boxes -->
            <div class="flex flex-col md:flex-row w-full gap-6">
                <div v-for="name in [1, 2, 3]"
                    class="flex flex-col w-full text-center justify-between p-4 border border border-[#E4E7EC] rounded-[40px]">
                    <h3 class="text-lg font-semibold">Feature 1</h3>
                    <p class="text-sm">Brief description of Feature 1.</p>
                    <img src="../assets/landing-page/feature2.jpeg" alt="Feature 1"
                        class="w-full h-48 object-cover mb-4">
                </div>
            </div>
        </div>
    </section>
</template>