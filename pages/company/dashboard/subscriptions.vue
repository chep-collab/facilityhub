<template>
  <div>
    <div>
      <div
        class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Filter subscriptions..." />
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
      >
        <template #status-data="{ row }">
          <span :class="row.status ? 'text-green-500' : 'text-red-500'">
            {{ row.status == true ? "Active" : "Inactive" }}
          </span>
        </template>

        <template #receiptUrl-data="{ row }">
          <UAvatar :src="row.receiptUrl" alt="-" />
        </template>
        <template #startDate-data="{ row }">
          <span>{{ formatDate(row.startDate) }}</span>
          <br />to
          <br />
          <span>{{ formatDate(row.endDate) }}</span>
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

      <div>
        <UModal v-model="isActivateModalOpen" prevent-close>
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
                  @click="isActivateModalOpen = false"
                />
              </div>
            </template>
            <div>
              <UForm
                :schema="schema"
                :state="state"
                class="space-y-4"
                @submit="onSubmitSubscriptionActivationRequest"
              >
                <div>Are you sure you want to activate this subscription?</div>

                <UButton type="submit"> Submit </UButton>
              </UForm>
            </div>
          </UCard>
        </UModal>
      </div>

      <div>
        <UButton label="Open" @click="isReceiptUploadModalOpen = true" />

        <UModal v-model="isReceiptUploadModalOpen" prevent-close>
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
                  Upload receipt
                </h3>
                <UButton
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-x-mark-20-solid"
                  class="-my-1"
                  @click="isReceiptUploadModalOpen = false"
                />
              </div>
            </template>

            <UFormGroup label="Selext receipt" name="receipt">
              <UInput type="file" size="sm" model-value="" />
            </UFormGroup>
            <br />
            <UButton type="submit" block> Upload </UButton>
          </UCard>
        </UModal>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatDate } from "../../../common/dataFormatter";
definePageMeta({
  layout: "dashboard-layout",
});

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "fullName",
    label: "Full Name",
  },
  {
    key: "service",
    label: "Service",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "receiptUrl",
    label: "Reciept",
  },
  {
    key: "startDate",
    label: "Start Date",
  },
  // {
  //   key: "endDate",
  //   label: "End Date",
  // },
  {
    key: "actions",
  },
];

const subscriptions = [
  {
    id: 1,
    fullName: "Daniel Sumah",
    service: "Daily Workspace",
    amount: 2000,
    status: true,
    receiptUrl:
      "https://firebasestorage.googleapis.com/v0/b/workspace-6cc0b.appspot.com/o/subscription-receipts%2Freceipt-deji-mailinator-com-2024-03-23-t-09-23-21-711-z?alt=media&token=214cb807-85a7-4519-b0bf-59802802eb24",
    startDate: "2024-03-22 15:58:39.247",
    endDate: "2024-03-22 15:58:39.247",
  },
  {
    id: 2,
    fullName: "Daniel Sumah",
    service: "Daily Workspace",
    amount: 2000,
    status: false,
    receiptUrl: null,
    startDate: "2024-03-22 15:58:39.247",
    endDate: "2024-03-22 15:58:39.247",
  },
  {
    id: 3,
    fullName: "Daniel Sumah",
    service: "Daily Workspace",
    amount: 2000,
    status: true,
    receiptUrl:
      "https://firebasestorage.googleapis.com/v0/b/workspace-6cc0b.appspot.com/o/subscription-receipts%2Freceipt-deji-mailinator-com-2024-03-23-t-09-23-21-711-z?alt=media&token=214cb807-85a7-4519-b0bf-59802802eb24",
    startDate: "2024-03-22 15:58:39.247",
    endDate: "2024-03-22 15:58:39.247",
  },
  {
    id: 4,
    fullName: "Daniel Sumah",
    service: "Daily Workspace",
    amount: 2000,
    status: true,
    receiptUrl:
      "https://firebasestorage.googleapis.com/v0/b/workspace-6cc0b.appspot.com/o/subscription-receipts%2Freceipt-deji-mailinator-com-2024-03-23-t-09-23-21-711-z?alt=media&token=214cb807-85a7-4519-b0bf-59802802eb24",
    startDate: "2024-03-22 15:58:39.247",
    endDate: "2024-03-22 15:58:39.247",
  },
  {
    id: 5,
    fullName: "Daniel Sumah",
    service: "Daily Workspace",
    amount: 2000,
    status: true,
    receiptUrl:
      "https://firebasestorage.googleapis.com/v0/b/workspace-6cc0b.appspot.com/o/subscription-receipts%2Freceipt-deji-mailinator-com-2024-03-23-t-09-23-21-711-z?alt=media&token=214cb807-85a7-4519-b0bf-59802802eb24",
    startDate: "2024-03-22 15:58:39.247",
    endDate: "2024-03-22 15:58:39.247",
  },
];
const selected = ref([subscriptions[1]]);

const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return subscriptions;
  }

  return subscriptions.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

const isActivateModalOpen = ref(false);
const isReceiptUploadModalOpen = ref(false);

const items = (row) => [
  [
    {
      label: "Activate",
      icon: "i-heroicons-lock-closed",
      click: () => {
        console.log("Delete", row.id);
        isActivateModalOpen.value = true;
      },
    },
    {
      label: "Upload receipt",
      icon: "i-heroicons-receipt-percent",
      click: () => {
        console.log("Upload", row.id);
        isReceiptUploadModalOpen.value = true;
      },
    },
  ],
];

const onSubmitSubscriptionActivationRequest = () => {
  console.log(5555);
};
const onSubmitReceiptUploadRequest = () => {
  console.log(5555);
};
</script>
