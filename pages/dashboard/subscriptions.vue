<script setup lang="ts">
import { handleErrorMessages } from "~/common/errorHandlers";
import { formatDate } from "../../common/dataFormatter";
const subscriptionStore = useSubscriptionStore();
const { getUserType } = useActiveUserStore();
const {
  getSubscriptions,
  getSubscriptionsFetchingStatus,
  getSubscriptionsStatusChangingStatus,
} = storeToRefs(subscriptionStore);

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
    label: "Period",
  },
  {
    key: "actions",
  },
];

// const selected = ref([subscriptions[1]]);

const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return getSubscriptions.value;
  }

  return getSubscriptions.value.filter((subscription) => {
    return Object.values(subscription).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

const isActivateModalOpen = ref(false);
const isReceiptUploadModalOpen = ref(false);

const companyMenus = (row) => [
  [
    {
      label: "Activate",
      icon: "i-heroicons-lock-closed",
      click: () => {
        subscriptionIdToUpdate.value = row.id;
        isActivateModalOpen.value = true;
      },
    },
  ],
];

const userMenus = (row) => [
  [
    {
      label: "Upload receipt",
      icon: "i-heroicons-receipt-percent",
      click: () => {
        isReceiptUploadModalOpen.value = true;
      },
    },
  ],
];

const items = getUserType === "company" ? companyMenus : userMenus;
const subscriptionIdToUpdate = ref("");
const onSubmitSubscriptionActivationRequest = async () => {
  try {
    await subscriptionStore.activateSubscription(
      subscriptionIdToUpdate.value,
      true
    );
    isActivateModalOpen.value = false;
  } catch (error: any) {
    if (error) {
      const toast = useToast();
      toast.add({
        title: handleErrorMessages(error),
        color: "red",
      });
    }
  }
};
const onSubmitReceiptUploadRequest = () => {
  console.log(5555);
};
await subscriptionStore.fetchCompanySubscriptions();
</script>

<template>
  <div>
    <div>
      <div
        class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Filter subscriptions..." />
      </div>
      <UTable
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items.',
        }"
        :rows="filteredRows"
        :columns="columns"
        :loading="getSubscriptionsFetchingStatus"
      >
        <template #id-data="{ row, index }">
          <span>
            {{ index + 1 }}
          </span>
        </template>

        <template #fullName-data="{ row }">
          <span>
            {{ row.user.firstName }}
            {{ row.user.lastName }}
          </span>
        </template>

        <template #service-data="{ row }">
          <span>
            {{ row.actualSubscriptionName }}
          </span>
        </template>

        <template #amount-data="{ row }">
          <span>
            {{ row.actualSubscriptionAmount }}
          </span>
        </template>

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
              <div class="space-y-4">
                <div>Are you sure you want to activate this subscription?</div>

                <UButton
                  :loading="getSubscriptionsStatusChangingStatus"
                  @click="onSubmitSubscriptionActivationRequest"
                >
                  Submit
                </UButton>
              </div>
            </div>
          </UCard>
        </UModal>
      </div>

      <div>
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
