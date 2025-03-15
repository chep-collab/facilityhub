<template>
  <UContainer class="lg:px-6">
    <UForm @submit="submitForm" :state="amenities">
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
          v-for="item in amenities"
          :key="item.id"
          class="flex items-center w-full space-x-2 cursor-pointer"
        >
          <UCheckbox
            input-class="w-6 h-6"
            v-model="selectedIds"
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
          :loading="isSubmitting"
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
const amenities = ref([]);
const selectedIds = ref([]);
const isAmenitiesLoading = ref(true);
const isSubmitting = ref(false);
const isDisabled = computed(() => selectedIds.value.length === 0);
const companyServiceStore = useCompanyServiceStore();
const toast = useToast();

onMounted(async () => {
  const amenitiesResponse = await companyServiceStore.fetchFacilityAmenities();
  const result = amenitiesResponse.result;

  amenities.value = amenitiesResponse.data?.map((item: unknown) => ({
    id: item?.id,
    label: item?.name,
  }));

  if (result === "success") {
    isAmenitiesLoading.value = false;
  } else {
    toast.error("Error getting facility amenities"); // ❌ Show error toast
  }
});

async function submitForm() {
  isSubmitting.value = true;
  const addAmenitiesResponse = await companyServiceStore.addAmenitiesToCompany(
    selectedIds.value
  );
  const result = addAmenitiesResponse.result;

  if (result === "success") {
    isAmenitiesLoading.value = false;
    isSubmitting.value = false;
    toast.add({
      title: "Amenities Added",
      description: "Amenities added successfully!",
      color: "green",
    });
    emit("next-step");
  } else {
    toast.add({
      title: "Amenities Error",
      description: "Error adding amenities!",
      color: "red",
    });
  }
}
</script>
