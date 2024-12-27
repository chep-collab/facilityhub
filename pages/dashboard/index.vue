<script setup lang="ts">
import { handleErrorMessages } from "~/common/errorHandlers";

import greenPlusPath from "~/assets/icons/green-plus.png"
import orangeBagPath from "~/assets/icons/orange-bag.png"
import purpleCashPath from "~/assets/icons/purple-cash.png"
import { formatDateAddDay } from "~/common/dataFormatter";
const subscriptionStore = useSubscriptionStore();
const { getUserType } = useActiveUserStore();

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
  totalServiceCount: 0
})

async function getCompanyDashboardSummary() {
  try {
    fetchingDashboardSummary.value = true;
    const response = await useNuxtApp().$axios.get(`/company/dashboard-summary/`);
    companySummary.value = {
      totalUsers: response.data.totalUsers,
      totalActiveSubscriptions: response.data.totalActiveSubscriptions,
      totalServiceCount: response.data.totalServiceCount
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

if(getUserType == 'company'){
  getCompanyDashboardSummary()
} else {
  getActiveSubscriptionsForUser()
}
</script>

<template>
  <div class="px-3 py-3.5">
    <div v-if="getUserType === 'company'">
      <section class="mb-10">
        <h2 class="text-lg font-semibold mb-2">Analytics</h2>
        <div class="flex flex-col lg:flex-row gap-2">
          <SummaryCard title="Total users" :value="companySummary.totalUsers" />
          <SummaryCard title="Active Subscriptions" :value="companySummary.totalActiveSubscriptions" />
          <SummaryCard title="Available Services" :value="companySummary.totalServiceCount" />
        </div>
      </section>

      <section class="mb-10">
        <h2 class="text-lg font-semibold mb-5">Quick Access</h2>
        <div class="flex flex-rownjustify-between gap-4">
          <QuickAction title="Invite Users" :icon="greenPlusPath"
            :action="() => navigateTo('/dashboard/users?openInviteForm=yes')" />
          <QuickAction title="View Services" :icon="orangeBagPath" :action="() => navigateTo('/dashboard/services')" />
          <QuickAction title="View Subscriptions" :icon="purpleCashPath"
            :action="() => navigateTo('/dashboard/subscriptions')" />
        </div>
      </section>
    </div>

    <div v-if="getUserType === 'user'">
      <section class="mb-10">
        <h2 class="text-lg font-semibold mb-2">Active Subscriptions</h2>
        <div v-if="userSubscriptionList.length > 0">
          <div class="flex flex-col lg:flex-row gap-2 mb-2">
            <ActiveSubscriptionCard v-for="sub in userSubscriptionList" :company-name="sub.company.name" :service-name="sub.actualSubscriptionName"
              :start-date="formatDateAddDay(sub.startDate)" :end-date="formatDateAddDay(sub.endDate)" />
          </div>
        </div>

        <div v-else class="text-center">
          <p>You do not have an active subscription</p>
          <br />
          <UButton color="cyan" variant="outline" @click="navigateTo('/dashboard/joined-centers')">
            View facilities and subscribe
          </UButton>
        </div>
      </section>
    </div>
  </div>
</template>
