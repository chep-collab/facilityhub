<template>
    <section class="bg-white p-8 lg:p-20 w-full">
        <div class="mb-8">
            <h2 class="text-3xl font-bold text-center">All Your Workspace Needs in Unified Solution</h2>
        </div>
        <div class="flex flex-col gap-6 mx-auto">

            <!-- First Row with 2 Boxes -->
            <div class="flex flex-col md:flex-row w-full gap-6">
                <div v-for="index in [1, 2]"
                    class="flex flex-col w-full justify-between p-4 border border border-[#E4E7EC] rounded-xl">
                    <h3 class="text-lg font-semibold text-lg">{{index}} Feature 1</h3>
                    <p class="text-sm">Brief description of Feature 1. Should span across two lines</p>
                    <img src="../assets/landing-page/feature1.jpeg" alt="Feature 1"
                        class="w-full h-48 md:h-80 object-cover mb-4 rounded-lg">
                </div>
            </div>

            <!-- Second Row with 3 Boxes -->
            <div class="flex flex-col md:flex-row w-full gap-6">
                <div v-for="index in [1, 2, 3]"
                    class="flex flex-col w-full justify-between p-4 border border border-[#E4E7EC] rounded-xl">
                    <h3 class="text-lg font-semibold text-lg">{{ index + 2}} Feature 1</h3>
                    <p class="text-sm">Brief description of Feature 1. Should span across two lines</p>
                    <img src="../assets/landing-page/feature2.jpeg" alt="Feature 1"
                        class="w-full h-48 md:h-80 object-cover mb-4 rounded-lg">
                </div>
            </div>
        </div>
    </section>
</template>

<script>
</script>