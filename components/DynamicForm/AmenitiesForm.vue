<template>
  <UContainer class="lg:px-6">
    <UForm @submit="submitForm" :state="selectedItems">
      <div class="grid grid-cols-2 mt-8 gap-8">
        <div
          v-show="isAmenitiesLoading"
          v-for=" in 8"
          class="w-full flex gap-2"
        >
          <USkeleton class="h-5 w-8" />
          <USkeleton class="h-5 w-4/5" />
        </div>

        <label
          v-show="!isAmenitiesLoading"
          v-for="item in selectedItems"
          :key="item.id"
          class="flex items-center w-full space-x-2 cursor-pointer"
        >
          <UCheckbox
            input-class="w-6 h-6"
            v-model="selectedItems"
            :value="item.id"
          />
          <span class="text-gray-800">{{ item.label }}</span>
        </label>
      </div>
      <!-- Submit Button -->
      <div class="flex w-full justify-between mt-14">
        <BaseButton
          type="submit"
          :disabled="isDisabled"
          :class="
            isDisabled
              ? 'bg-grey-green cursor-not-allowed'
              : 'bg-primary-green hover:bg-[#0D7F32]'
          "
          >Continue</BaseButton
        >
      </div>
    </UForm>
  </UContainer>
</template>
<script lang="ts" setup>
import { ref, computed } from "vue";
const emit = defineEmits(["next-step"]);
const selectedItems = ref([]);
const isAmenitiesLoading = ref(true);
const isDisabled = computed(() => selectedItems.value.length === 0);
const companyServiceStore = useCompanyServiceStore();
const toast = useToast();

onMounted(async () => {
  const amenitiesResponse = await companyServiceStore.fetchFacilityAmenities();
  const result = amenitiesResponse.result;
  selectedItems.value = amenitiesResponse.data.map((item: unknown) => ({
    id: item?.id,
    label: item?.name,
  }));

  if (result === "success") {
  } else {
    toast.error("Error getting facility amenities"); // ❌ Show error toast
  }
});

async function submitForm() {
  const addAmenitiesResponse = await companyServiceStore.addAmenitiesToCompany(
    selectedItems.value
  );
  const result = addAmenitiesResponse.result;
  if (result === "success") {
    isAmenitiesLoading.value = false;
    toast.success("Amenities added successfully");
  } else {
    toast.error("Error adding amenities"); 
  }

  emit("next-step");
}
</script>
