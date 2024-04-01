<script setup lang="ts">
import { number, object, string } from "yup";
import { storeToRefs } from "pinia";
const companyServiceStore = useCompanyServiceStore();
const { getCreatingCompanyServicesLoadingState } =
  storeToRefs(companyServiceStore);

await companyServiceStore.fetchCompanyServices();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  mode: {
    type: String,
    required: true,
    default: "add",
  },
  initialServiceData: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits(["close"]);

const { mode, isOpen, initialServiceData } = props;

const schema = object({
  name: string().required("Required"),
  description: string().required("Required"),
  amount: number().required("Required"),
  period: string().required("Required"),
});
const periods = ["daily", "weekly", "monthly"];

const state = reactive({
  name: undefined,
  description: undefined,
  amount: undefined,
  period: periods[0],
});

if (mode == "edit") {
  state.name = initialServiceData.service;
  state.description = initialServiceData.description;
  state.amount = initialServiceData.amount;
  state.period = initialServiceData.period;
}

async function createNewCompanyService(event: any) {
  const payload = event.data;
  await companyServiceStore.createNewService(
    payload.name,
    payload.description,
    payload.amount,
    payload.period
  );
  state.name = undefined;
  state.description = undefined;
  state.amount = undefined;
  state.period = "daily";

  emit("close");
}

async function updateCompanyServiceAndPrice(event: any) {
  const payload = event.data;
  await companyServiceStore.updateCompanyServiceAndPrice(
    initialServiceData.serviceId,
    initialServiceData.servicePriceId,
    payload.name,
    payload.description,
    parseFloat(payload.amount),
    payload.period
  );
  state.name = undefined;
  state.description = undefined;
  state.amount = undefined;
  state.period = "daily";

  emit("close");
}

async function createOrEdit(event: any) {
  if (mode == "add") {
    await createNewCompanyService(event);
  } else {
    await updateCompanyServiceAndPrice(event);
  }
}
</script>
<template>
  <UModal v-model="isOpen">
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
            {{ mode == "add" ? "Add" : "Edit" }} Service
          </h3>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-x-mark-20-solid"
            class="-my-1"
            @click="emit('close')"
          />
        </div>
      </template>
      <div>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="createOrEdit"
        >
          <UFormGroup label="Service Name" name="name">
            <UInput v-model="state.name" />
          </UFormGroup>

          <UFormGroup label="Description" name="description">
            <UInput v-model="state.description" type="text" />
          </UFormGroup>

          <UFormGroup label="Amount" name="amount">
            <UInput v-model="state.amount" type="number" />
          </UFormGroup>

          <UFormGroup label="Period" name="period">
            <USelect v-model="state.period" :options="periods" />
          </UFormGroup>

          <UButton
            :loading="getCreatingCompanyServicesLoadingState"
            :disabled="getCreatingCompanyServicesLoadingState"
            type="submit"
          >
            {{ mode == "add" ? "Add Service" : "Update Service" }}
          </UButton>
        </UForm>
      </div>
    </UCard>
  </UModal>
</template>
