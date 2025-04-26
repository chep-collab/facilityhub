<script setup lang="ts">
import { handleErrorMessages } from "~/common/errorHandlers";
import { formatDate } from "../../common/dataFormatter";
import { mixed, object } from "yup";
import { capitalizeWord } from "~/common/textFormatters";
const subscriptionStore = useSubscriptionStore();
const { getUserType } = useActiveUserStore();
const {
  getSubscriptions,
  getSubscriptionsFetchingStatus,
  getSubscriptionsStatusChangingStatus,
  uploadingSubscriptionReceipt,
} = storeToRefs(subscriptionStore);

const showAlert1 = ref(true);
const showAlert2 = ref(true);
const showAlert3 = ref(true);
const companyServiceStore = useCompanyServiceStore();
const { getCompanyServices } = storeToRefs(companyServiceStore);

const columns = [
  {
    key: "id",
    label: "ID",
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
    key: "fullName",
    label: "Full Name",
  },
  {
    key: "company",
    label: "CompanyName",
  },
  {
    key: "startDate",
    label: "Period",
  },
  {
    key: "actions",
  },
];

const state = reactive({
  file: undefined,
});

const schema = object({
  file: mixed().required("File is required"),
});

const q = ref("");

console.log(getSubscriptions.value);

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

console.log(filteredRows.value);

const isActivateModalOpen = ref(false);
const isReceiptUploadModalOpen = ref(false);
const isImageSlideOverOpen = ref(false);

const receiptUrl = ref("");

const companyMenus = (row) => [
  [
    {
      label: "Activate",
      icon: "i-heroicons-lock-closed",
      click: () => {
        subscriptionIdToUpdate.value = row.id;
        isActivateModalOpen.value = true;
      },
      disabled: row.status == "active" ? true : false,
    },
    {
      label: "View receipt",
      icon: "i-heroicons-receipt-percent",
      click: () => {
        receiptUrl.value = row.receipt.url;
        isImageSlideOverOpen.value = true;
      },
      disabled: row.receipt ? false : true,
    },
  ],
];

const userMenus = (row) => [
  [
    {
      label: "Upload receipt",
      icon: "i-heroicons-receipt-percent",
      click: () => {
        subscriptionIdToUpdate.value = row.id;
        isReceiptUploadModalOpen.value = true;
      },
      disabled: row.receipt ? true : false,
    },
    {
      label: "View receipt",
      icon: "i-heroicons-receipt-percent",
      click: () => {
        receiptUrl.value = row.receipt.url;
        isImageSlideOverOpen.value = true;
      },
      disabled: row.receipt ? false : true,
    },
  ],
  ,
];

const items = getUserType === "company" ? companyMenus : userMenus;

const subscriptionIdToUpdate = ref("");
const onSubmitSubscriptionActivationRequest = async () => {
  try {
    await subscriptionStore.activateSubscription(subscriptionIdToUpdate.value);
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

const handleFileUpload = (file: any) => {
  state.file = file;
};

const uploadSubscriptionReceipt = async () => {
  try {
    const formData = new FormData();
    formData.append("file", state.file, state.file.name);
    await subscriptionStore.uploadSubscriptionReceipt(
      subscriptionIdToUpdate.value,
      formData
    );
    isReceiptUploadModalOpen.value = false;
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
await subscriptionStore.fetchCompanySubscriptions();
</script>

<template>
  <div>
    <UAlert
      v-if="
        showAlert1 &&
        getUserType === 'company' &&
        getCompanyServices.length === 0
      "
      class="my-4 mx-4 border border-orange-500"
      :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'gray',
        variant: 'link',
        padded: false,
      }"
      @close="showAlert1 = false"
      title="You need to create a service that users can subscribe to. Click 'Service' then 'Add Service' to add a new service."
    />

    <UAlert
      v-if="showAlert2 && getUserType === 'company'"
      class="my-4 mx-4 border border-blue-500"
      :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'gray',
        variant: 'link',
        padded: false,
      }"
      @close="showAlert2 = false"
      title="You can activate subscription when a user uploads a receipt."
    />

    <UAlert
      v-if="showAlert3 && getUserType !== 'company'"
      class="my-4 mx-4 border border-blue-500"
      :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'gray',
        variant: 'link',
        padded: false,
      }"
      @close="showAlert3 = false"
      title="Don't forget to pay for your subscription and upload a receipt."
    />
    <div>
      <div
        class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Search subscriptions..." />
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
          <br />
          {{ row.user.email }}
        </template>

        <template #service-data="{ row, index }">
          <span>
            {{ row.actualSubscriptionName }}
          </span>
          <p v-if="row.receipt" class="text-green-500">Receipt Uploaded</p>
          <p v-else class="text-red-500">Receipt Not Uploaded</p>
          <p
            v-if="
              getUserType == 'company' &&
              row.status == 'inactive' &&
              row.receipt
            "
            class="text-orange-500"
          >
            Please review and activate
          </p>
          <p
            v-if="
              getUserType == 'user' && row.status == 'inactive' && row.receipt
            "
            class="text-orange-500"
          >
            Awaiting activation
          </p>

          <div v-if="!row.receipt && getUserType !== 'company'">
            <SubscriptionsPaymentDetailsDialog
              :key="index"
              :facilityId="row.id"
            />
          </div>
        </template>

        <template #amount-data="{ row }">
          <span>
            {{ row.actualSubscriptionAmount }}
          </span>
          <br />
          <span>{{ row.actualSubscriptionPeriod }}</span>
        </template>

        <template #status-data="{ row }">
          <span
            :class="
              row.status == 'active'
                ? 'text-green-500'
                : row.status == 'inactive'
                ? 'text-orange-500'
                : 'text-red-500'
            "
          >
            {{ capitalizeWord(row.status) }}
          </span>
        </template>

        <template #company-data="{ row }">
          <span>
            {{ row.company.name }}
          </span>
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

            <UForm
              :schema="schema"
              :state="state"
              class="space-y-4"
              @submit="uploadSubscriptionReceipt"
            >
              <ImageUploadInput @fileStaged="handleFileUpload" />
              <br />
              <UButton
                type="submit"
                block
                :loading="uploadingSubscriptionReceipt"
              >
                Upload
              </UButton>
            </UForm>
          </UCard>
        </UModal>
      </div>

      <div>
        <USlideover v-model="isImageSlideOverOpen">
          <div class="p-4 flex-1 justify-end">
            <UButton
              color="primary"
              variant="ghost"
              @click="isImageSlideOverOpen = false"
            >
              Close Receipt
            </UButton>
          </div>
          <img :src="receiptUrl" class="w-full h-full" />
        </USlideover>
      </div>
    </div>
  </div>
</template>
