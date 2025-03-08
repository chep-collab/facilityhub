<script setup lang="ts">
import { handleErrorMessages } from "~/common/errorHandlers";

import greenPlusPath from "~/assets/icons/green-plus.png"
import orangeBagPath from "~/assets/icons/orange-bag.png"
import purpleCashPath from "~/assets/icons/purple-cash.png"
import { formatDateAddDay } from "~/common/dataFormatter";
const subscriptionStore = useSubscriptionStore();
const { getUserType } = useActiveUserStore();
const activeUserStore = useActiveUserStore();
const { userType, getUserDetails } = storeToRefs(activeUserStore);
const toast = useToast();

definePageMeta({
  layout: "dashboard-layout",
});

const q = ref("");

await subscriptionStore.fetchCompanySubscriptions();

const fetchingDashboardSummary = ref(false);
const companySummary = ref({
  totalUsers: 0,
  totalActiveSubscriptions: 0,
  totalServiceCount: 0,
  subscriptionsToAttendTo: 0,
  invitationLink: ''
})

async function getCompanyDashboardSummary() {
  try {
    fetchingDashboardSummary.value = true;
    const response = await useNuxtApp().$axios.get(`/company/dashboard-summary/`);
    companySummary.value = {
      totalUsers: response.data.totalUsers,
      totalActiveSubscriptions: response.data.totalActiveSubscriptions,
      totalServiceCount: response.data.totalServiceCount,
      subscriptionsToAttendTo: response.data.subscriptionsToAttendTo,
      invitationLink: response.data.invitationLink
    }
  } catch (error: any) {
    if (error) {
      toast.add({
        title: handleErrorMessages(error),
        color: "red",
      });
    }
  } finally {
    fetchingDashboardSummary.value = false;
  }
}

const userSubscriptionList = ref([])
async function getActiveSubscriptionsForUser() {
  try {
    fetchingDashboardSummary.value = true;
    const response = await useNuxtApp().$axios.get(`/subscription?status=active`);
    userSubscriptionList.value = response.data
  } catch (error: any) {
    if (error) {
      toast.add({
        title: handleErrorMessages(error),
        color: "red",
      });
    }
  } finally {
    fetchingDashboardSummary.value = false;
  }
}

if (getUserType == 'company') {
  getCompanyDashboardSummary()
} else {
  getActiveSubscriptionsForUser()
}

const shareInviteLink = () => {
  const shareData = {
    title: `Join ${getUserDetails.value.name}`,
    text: `Click the link below to join ${getUserDetails.value.name} and subscribe to our services.`,
    url: companySummary.value.invitationLink 
  };

  if (navigator.share) {
    navigator
      .share(shareData)
      .then(() => {
        console.log('Share successful!');
      })
      .catch((err) => {
        console.error('Error sharing:', err);
      });
  } else {
    alert('Sharing is not supported on this browser.');
  }
};
const copyInvitationLink = () => {
  const invitationLink = companySummary.value.invitationLink;

  if (!invitationLink) {
    alert('Invitation link is not available.');
    return;
  }

  // Copy the link to the clipboard
  navigator.clipboard
    .writeText(invitationLink)
    .then(() => {
      console.log('Invitation link copied to clipboard!');
      alert('Invitation link copied successfully!');
    })
    .catch((err) => {
      console.error('Error copying link:', err);
      alert('Failed to copy the invitation link. Please try again.');
    });
};

</script>
<template>
  <div class="px-3 py-3 dark:bg-[#0D0D0D99] dark:text-white rounded-lg">
    <div v-if="getUserType === 'company'">
      <section class="flex flex-col md:flex-row justify-between md:justify-start gap-2 md:items-center my-1 mt-0 ">
        <p class="dark:text-gray-200 ml-3">{{ companySummary.totalUsers }} users have joined your facility</p>
        <div class="flex gap-4">
        <UButton icon="i-heroicons-share" size="sm" color="primary" variant="solid" label="Invite more"
          :trailing="false" @click="shareInviteLink"/>
          <UButton icon="i-heroicons-clipboard-document-list" size="sm" color="primary" variant="outline" label="Copy Invitation Link"
          :trailing="false" @click="copyInvitationLink"/>
        </div>
      </section>
      <section>
        <UAlert v-if="getUserType === 'company' && companySummary.subscriptionsToAttendTo > 0"
          class="mb-2 border border-blue-500 dark:border-gray-600" :close-button="{
            color: 'orange',
            variant: 'outline',
            padded: false,
          }"
          :title="`You have ${companySummary.subscriptionsToAttendTo} subscription(s) with uploaded receipts that you need to attend to`" />
        <h2 class="text-lg text-gray-600 dark:text-gray-200 font-semibold mb-5 mt-5 ml-3">Analytics</h2>
        <div class="flex flex-wrap gap-6 ml-3">
          <SummaryCard title="Total users" :value="companySummary.totalUsers" />
          <SummaryCard title="Active Subscriptions" :value="companySummary.totalActiveSubscriptions" />
          <SummaryCard title="Available Services" :value="companySummary.totalServiceCount" />
        </div>
      </section>

      <section class="mb-10 items-center justify-left">
        <h2 class="text-lg text-gray-600 dark:text-gray-200 font-semibold mb-5 mt-5 ml-3">Quick Access</h2>
        <div class="flex flex-wrap gap-7 ml-3 text-left">
          <QuickAction 
            title="Invite Users" 
            :icon="greenPlusPath" 
            :action="() => navigateTo('/dashboard/users?openInviteForm=yes')" 
            class="py-4 px-2 sm:w-[170px] dark:bg-gray-700 dark:hover:bg-gray-600 "
          />
          <QuickAction 
            title="View Services" 
            :icon="orangeBagPath" 
            :action="() => navigateTo('/dashboard/services')" 
            class="py-4 px-2 sm:w-[170px] dark:bg-gray-700 dark:hover:bg-gray-600"
          />
          <QuickAction 
            title="View Subscriptions" 
            :icon="purpleCashPath" 
            :action="() => navigateTo('/dashboard/subscriptions')" 
            class="py-4 sm:w-[170px] dark:bg-gray-700 dark:hover:bg-gray-600"
          />
        </div>
      </section>
    </div>

    <div v-if="getUserType === 'user'">
      <section class="mb-10">
        <h2 class="text-lg font-semibold mb-2 dark:text-gray-200">Active Subscriptions</h2>
        <div v-if="userSubscriptionList.length > 0">
          <div class="flex flex-col lg:flex-row gap-2 mb-2">
            <ActiveSubscriptionCard v-for="sub in userSubscriptionList" :company-name="sub.company.name"
              :service-name="sub.actualSubscriptionName" :start-date="formatDateAddDay(sub.startDate)"
              :end-date="formatDateAddDay(sub.endDate)" class="dark:bg-gray-800"/>
          </div>
        </div>

        <div v-else class="text-center">
          <p class="dark:text-gray-200">You do not have an active subscription</p>
          <br />
          <UButton color="cyan" variant="outline" @click="navigateTo('/dashboard/joined-centers')" class="dark:bg-gray-700 dark:hover:bg-gray-600">
            View facilities and subscribe
          </UButton>
        </div>
      </section>
    </div>
  </div>
</template>
