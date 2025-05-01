<template>
  <div>
    <UPopover
      :overlay="false"
      :popper="{
        placement: 'auto',
      }"
    >
      <UButton size="sm" variant="outline" class="text-[10px] py-1 px-2">
        View Payment Details
      </UButton>

      <template #panel="{ close }">
        <div
          class="bg-white border border-gray-200 rounded-lg shadow-xl p-4 w-full max-w-[90vw] sm:max-w-sm md:max-w-md lg:w-[40vw] max-h-[80vh] pb-[50px] overflow-y-auto"
        >
          <div class="flex justify-between items-center mb-2">
            <h2 class="font-semibold text-lg">Payment Info</h2>
            <button
              @click="close"
              aria-label="Close"
              class="text-gray-500 hover:text-red-500 transition"
            >
              ✕
            </button>
          </div>
          <SubscriptionsFacilityPaymentDetails :companyId="companyId"  />
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  companyId:string
}>()
</script>
