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
        </div>
      </div>
      <UTable
        :loading="getFetchingCompanyServicesLoadingState"
        v-model="selected"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items.',
        }"
        :rows="filteredRows"
        :columns="columns"
        @select="selected"
      >
        <template #name-data="{ row }">
          <span
            :class="[
              selected.find((service) => service.id === row.id) &&
                'text-primary-500 dark:text-primary-400',
            ]"
            >{{ row.name }}</span
          >
        </template>

        <template #amount-data="{ row }">
          <span>{{ formatToNaira(row.amount) }} </span>
        </template>

        <template #isActive-data="{ row }">
          <span
            :class="row.isActive == true ? 'text-green-500' : 'text-red-500'"
          >
            {{ row.isActive == true ? "Active" : "Inactive" }}
          </span>
        </template>

        <template #description-data="{ row }">
          <div class="flex flex-row">
            <span>
              {{ row.description.substring(0, 15) }}
            </span>
            <UPopover mode="hover">
              <UButton
                color="white"
                variant="ghost"
                trailing-icon="i-heroicons-chevron-down-20-solid"
              />

              <template #panel>
                <div class="p-4">
                  {{ row.description }}
                </div>
              </template>
            </UPopover>
          </div>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
      </UTable>
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
  <div>
    <UModal v-model="isActivateDeactivateModalOpen" prevent-close>
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
              @click="isActivateDeactivateModalOpen = false"
            />
          </div>
        </template>
        <div>
          <UForm
            :schema="schema"
            :state="state"
            class="space-y-4"
            @submit="onSubmitStatusChangeRequest"
          >
            <div>Are you sure you want to deactivate this service?</div>

            <UButton type="submit"> Submit </UButton>
          </UForm>
        </div>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { formatToNaira } from "../../common/moneyConverter";

//form validation
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

//store import
import { storeToRefs } from "pinia";
const companyServiceStore = useCompanyServiceStore();
const {
  services: companyServices,
  getCompanyServices,
  getFetchingCompanyServicesLoadingState,
} = storeToRefs(companyServiceStore);

await companyServiceStore.fetchCompanyServices();

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
  console.log(event.data);
}

async function onSubmitDeleteRequest(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}

async function onSubmitStatusChangeRequest(event: FormSubmitEvent<Schema>) {
  console.log(event.data);
}

const isAddModalOpen = ref(false);

const isConfirmationModalOpen = ref(false);
const isActivateDeactivateModalOpen = ref(false);

definePageMeta({
  layout: "dashboard-layout",
});

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "service",
    label: "Services",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "isActive",
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
  {
    key: "actions",
  },
];

const items = (row) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        console.log("Edit", row.id);
      },
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        console.log("Delete", row.id);
        isConfirmationModalOpen.value = true;
      },
    },
    {
      label: "Deactivate",
      icon: "i-heroicons-lock-closed",
      click: () => {
        console.log("Delete", row.id);
        isActivateDeactivateModalOpen.value = true;
      },
    },
  ],
];
const selected = ref([]);

const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return getCompanyServices.value;
  }

  return getCompanyServices.value.filter((service) => {
    return Object.values(service).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
</script>
