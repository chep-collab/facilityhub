<script setup lang="ts">
const props = defineProps({
  selectedService: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["close"]);
const { selectedService, isOpen } = props;
const companyServiceStore = useCompanyServiceStore();
const { getCompanyServiceStatusUpdateState } = storeToRefs(companyServiceStore);
const onSubmitStatusChangeRequest = async () => {
  await companyServiceStore.updateCompanyServiceStatus(
    selectedService.id,
    !selectedService.isActive
  );
  emit("close");
};
</script>

<template>
  <div>
    <UModal v-model="isOpen" prevent-close>
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <h3
              class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
            >
              Please confirm
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="$emit('close')"
            />
          </div>
        </template>
        <div>
          <div>
            <div>
              Are you sure you want to
              {{ selectedService.isActive ? "DEACTIVATE" : "ACTIVATE" }} this
              service?
            </div>

            <UButton
              :loading="getCompanyServiceStatusUpdateState"
              @click="onSubmitStatusChangeRequest"
              type="button"
            >
              Submit
            </UButton>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
</template>
