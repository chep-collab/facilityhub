<script setup lang="ts">
import { handleErrorMessages } from "~/common/errorHandlers";
import { formatDate } from "../../common/dataFormatter";
import { mixed, object } from "yup";

import greenPlusPath from "~/assets/icons/green-plus.png"
import orangeBagPath from "~/assets/icons/orange-bag.png"
import purpleCashPath from "~/assets/icons/purple-cash.png"
const subscriptionStore = useSubscriptionStore();
const { getUserType } = useActiveUserStore();
const {
  getSubscriptions,
  getSubscriptionsFetchingStatus,
  getSubscriptionsStatusChangingStatus,
  uploadingSubscriptionReceipt,
} = storeToRefs(subscriptionStore);

const companyServiceStore = useCompanyServiceStore();
const { getCompanyServices } = storeToRefs(companyServiceStore);
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
      disabled: row.isActive ? true : false,
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
  <div class="px-3 py-3.5">
    <section class="mb-10">
      <h2 class="text-lg font-semibold mb-2">Analytics</h2>
      <div class="flex flex-col lg:flex-row gap-2">
        <SummaryCard title="Total users" value="45" />
        <SummaryCard title="Active Subscriptions" value="20" />
        <SummaryCard title="Available Services" value="2" />
      </div>
    </section>

    <section class="mb-10">
      <h2 class="text-lg font-semibold mb-5">Quick Access</h2>
      <div class="flex flex-rownjustify-between gap-4">
        <QuickAction title="Invite Users" :icon="greenPlusPath" :action="() => navigateTo('/dashboard/users?openInviteForm=yes')"/>
        <QuickAction title="View Services" :icon="orangeBagPath" :action="() => navigateTo('/dashboard/services')"/>
        <QuickAction title="View Subscriptions" :icon="purpleCashPath" :action="() => navigateTo('/dashboard/subscriptions')"/>
      </div>
    </section>
  </div>
</template>
