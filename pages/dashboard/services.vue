<script setup lang="ts">
import { formatToNaira } from "../../common/moneyConverter";

//form validation
import { object, string, type InferType, number } from "yup";
import type { FormSubmitEvent } from "#ui/types";
const { getUserType } = useActiveUserStore();

//store import
import { storeToRefs } from "pinia";
import { handleErrorMessages } from "~/common/errorHandlers";
const companyServiceStore = useCompanyServiceStore();
const {
  getCompanyServices,
  getFetchingCompanyServicesLoadingState,
  getCompanyServiceDeletingState,
} = storeToRefs(companyServiceStore);

await companyServiceStore.fetchCompanyServices();

const schema = object({
  name: string().required("Required"),
  description: string().required("Required"),
  amount: number().required("Required"),
  period: string().required("Required"),
});

type Schema = InferType<typeof schema>;

const periods = ["daily", "weekly", "monthly"];

const state = reactive({
  name: undefined,
  description: undefined,
  amount: undefined,
  period: periods[0],
});

const toast = useToast();
async function onSubmitDeleteRequest(event: FormSubmitEvent<Schema>) {
  try {
    await companyServiceStore.deleteCompanyServiceStatus(
      serviceDataToDelete.value.id
    );
    isConfirmationModalOpen.value = false;
  } catch (error: any) {
    if (error) {
      toast.add({
        title: handleErrorMessages(error),
        color: "red",
      });
    }
  }
}

const isAddEditServiceModalOpen = ref(false);

const isConfirmationModalOpen = ref(false);
const isActivateDeactivateModalOpen = ref(false);
const addEditServiceMode = ref("add");
const serviceDataToEdit = ref({});
const serviceDataToDelete = ref({});


const columns = [
  {
    key: "index",
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
        addEditServiceMode.value = "edit";
        isAddEditServiceModalOpen.value = true;
        serviceDataToEdit.value = row;
      },
    },
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
      click: () => {
        isConfirmationModalOpen.value = true;
        serviceDataToDelete.value = row;
      },
    },
    {
      label: `${row.isActive ? "Deactivate" : "Activate"}`,
      icon: "i-heroicons-lock-closed",
      click: () => {
        selectedService.value = row;
        isActivateDeactivateModalOpen.value = true;
      },
    },
  ],
];

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
const selectedService = ref({});
const openAddEditServiceModal = () => {
  addEditServiceMode.value = "add";
  isAddEditServiceModalOpen.value = true;
};
const closeAddEditServiceModal = () => {
  isAddEditServiceModalOpen.value = false;
};

const closeActivateDeactiveModal = () => {
  isActivateDeactivateModalOpen.value = false;
};
</script>

<template>
  <div>
    <div>
      <div
        class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Search services..." />
        <div>
          <UButton
            v-if="getUserType === 'company'"
            icon="i-heroicons-plus"
            size="sm"
            color="blue"
            variant="ghost"
            label="Add Service"
            :trailing="false"
            @click="openAddEditServiceModal"
          />
        </div>
      </div>
      <UTable
        :loading="getFetchingCompanyServicesLoadingState"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items.',
        }"
        :rows="filteredRows"
        :columns="columns"
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
      {{ row.description == "undefined" ? "" : row.description?.substring(0, 15)}}
    </span>
    <UPopover mode="hover" v-if="row.description">
      <UButton
        color="white"
        variant="ghost"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      />

      <template #panel>
        <div class="p-4">
          {{ row.description == "undefined" ? "" : row.description }}
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
  <AddEditServiceModal
    :mode="addEditServiceMode"
    :initial-service-data="serviceDataToEdit"
    v-if="isAddEditServiceModalOpen"
    :is-open="isAddEditServiceModalOpen"
    @close="closeAddEditServiceModal"
  />

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
          <div class="flex flex-col gap-4">
            <div>Are you sure you want to delete this service?</div>

            <BaseButton
              :loading="getCompanyServiceDeletingState"
              @click="onSubmitDeleteRequest"
              type="button"
            >
              Submit
            </BaseButton>
          </div>
        </div>
      </UCard>
    </UModal>
  </div>
  <ServiceStatusUpdateModal
    v-if="isActivateDeactivateModalOpen"
    :selected-service="selectedService"
    :is-open="isActivateDeactivateModalOpen"
    @close="closeActivateDeactiveModal"
  />
</template>
