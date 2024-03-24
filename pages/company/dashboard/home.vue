<template>
  <div>
    <div>
      <div
        class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Filter services..." />
        <div>
          <UButton
            icon="i-heroicons-plus"
            size="sm"
            color="blue"
            variant="ghost"
            label="Add"
            :trailing="false"
            @click="isAddModalOpen = true"
          />

          <UButton
            icon="i-heroicons-pencil-square"
            size="sm"
            color="blue"
            variant="ghost"
            label="Edit"
            :trailing="false"
          />

          <UButton
            icon="i-heroicons-trash"
            size="sm"
            color="red"
            variant="ghost"
            label="Delete"
            :trailing="false"
            @click="isConfirmationModalOpen = true"
          />
        </div>
      </div>

      <UTable
        v-model="selected"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items.',
        }"
        :rows="filteredRows"
        :columns="columns"
        @select="selected"
      />
    </div>
  </div>
  <div>
    <UModal v-model="isAddModalOpen" prevent-close>
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
              Add Service
            </h3>
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-x-mark-20-solid"
              class="-my-1"
              @click="isAddModalOpen = false"
            />
          </div>
        </template>
        <div>
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormGroup label="Service Name" name="service">
              <UInput v-model="state.name" />
            </UFormGroup>

            <UFormGroup label="Description" name="description">
              <UInput v-model="state.description" type="text" />
            </UFormGroup>

            <UFormGroup label="Amount" name="amount">
              <UInput v-model="state.amount" type="number" />
            </UFormGroup>

            <UFormGroup label="Period" name="period">
              <USelect v-model="period" :options="periods" />
            </UFormGroup>

            <UButton type="submit"> Submit </UButton>
          </UForm>
        </div>
      </UCard>
    </UModal>
  </div>
  <div>
    <UModal v-model="isConfirmationModalOpen" prevent-close>
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
              @click="isConfirmationModalOpen = false"
            />
          </div>
        </template>
        <div>
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmitDeleteRequest"
          >
            <div>Are you sure you want to delete this service?</div>

            <UButton type="submit"> Submit </UButton>
          </UForm>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
//form validation
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

const schema = object({
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  name: undefined,
  description: undefined,
  amount: undefined,
  period: undefined,
});

const periods = ["daily", "weekly", "monthly"];

const period = ref(periods[0]);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data);
}

async function onSubmitDeleteRequest(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data);
}

const isAddModalOpen = ref(false);

const isConfirmationModalOpen = ref(false);

definePageMeta({
  layout: "dashboard-layout",
});

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "services",
    label: "Services",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "period",
    label: "Period",
  },
];

const services = [
  {
    id: 1,
    services: "Daily workspace",
    description: "Use the workspace from 9-5 for 1 day",
    status: "active",
    amount: 2000,
    period: "daily",
  },
  {
    id: 2,
    services: "Daily workspace",
    description: "Use the workspace from 9-5 for 1 day",
    status: "active",
    amount: 2000,
    period: "daily",
  },
  {
    id: 3,
    services: "Daily workspace",
    description: "Use the workspace from 9-5 for 1 day",
    status: "active",
    amount: 2000,
    period: "daily",
  },
  {
    id: 4,
    services: "Daily workspace",
    description: "Use the workspace from 9-5 for 1 day",
    status: "active",
    amount: 2000,
    period: "daily",
  },
  {
    id: 5,
    services: "Daily workspace",
    description: "Use the workspace from 9-5 for 1 day",
    status: "active",
    amount: 2000,
    period: "daily",
  },
];
const selected = ref([services[1]]);

const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return services;
  }

  return services.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
</script>
