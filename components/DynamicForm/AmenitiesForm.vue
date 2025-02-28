<template>
  <UContainer class="lg:px-6">
    <UForm @submit="submitForm" :state="selectedItems">
      <div class="grid grid-cols-2 mt-8 gap-8">
        <label
          v-for="item in items"
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
const items = ref([
  { id: 1, label: "Shared meeting rooms" },
  { id: 2, label: "Shared meeting rooms" },
  { id: 3, label: "Shared meeting rooms" },
  { id: 4, label: "Shared meeting rooms" },
  { id: 5, label: "Shared meeting rooms" },
  { id: 6, label: "Shared meeting rooms" },
  { id: 7, label: "Shared meeting rooms" },
  { id: 8, label: "Shared meeting rooms" },
  { id: 9, label: "Shared meeting rooms" },
  { id: 10, label: "OShared meeting rooms" },
]);

const selectedItems = ref([]);

const isDisabled = computed(() => selectedItems.value.length === 0);

function submitForm() {

  emit("next-step");
}
</script>
