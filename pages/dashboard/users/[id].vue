<template>
  <section>
    <div class="">
      <UButton
        label="Back"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        @click="goBackToUsersPage"
        :trailing="false"
        class="bg-transparent hover:bg-transparent gap-3 text-grey-stepper shadow-none"
      />
    </div>
  </section>

  <section class="mt-5">
    <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
      <UCard
        :ui="{
          base: 'card px-[18px] pt-4 pb-[23px] ',
          body: 'px-4 py-4',
        }"
        class=""
      >
        <p
          class="text-center text-[18px] font-semibold text-grey-stepper w-[94%] mx-auto pb-2 border-[#E5E5EF] border-b"
        >
          Profile
        </p>

        <div class="flex gap-4 mt-4">
          <div class="">
            <img src="/userimg.png" alt="" />
          </div>

          <div class="flex flex-col">
            <p class="text-[#1D2739] text-[1.125rem] font-semibold">
              <strong> {{ ` ${firstName} ${lastName} ` }} </strong>
            </p>
            <!-- status -->
            <div class="flex text-[14px]">
              <i class="i-heroicons-pencil-square bg-icon w-5 h-5"></i>

              <p>status : <span> Active</span></p>
            </div>
          </div>
        </div>

        <!-- facility and date joined -->
        <div class="flex mt-7 flex-col gap-[14px]">
          <div class="flex items-center gap-1">
            <i class="i-heroicons-building-office-2 bg-icon w-5 h-5"></i>
            <p class="text-grey-border">Facility :</p>
          </div>
          <div class="flex items-center gap-1">
            <i class="i-heroicons-calendar bg-icon w-5 h-5"></i>
            <p class="text-grey-border">
              Date Joined : <span class="text-icon">{{}} </span>
            </p>
          </div>
        </div>

        <!-- contact -->

        <div class="flex flex-col mt-10 px-1 gap-[14px] border py-1 rounded">
          <div class="flex items-center gap-1">
            <i class="i-heroicons-envelope bg-icon w-5 h-5"></i>
            <p class="text-grey-border w-[60px]">Email :</p>
            <span class="text-icon">{{ userDetails?.email }} </span>
          </div>
          <div class="flex items-center gap-1">
            <i class="i-heroicons-phone bg-icon w-5 h-5"></i>

            <p class="text-grey-border w-[60px]">Phone :</p>
            <span class="text-icon">{{ userDetails?.phone }} </span>
          </div>
        </div>
      </UCard>

      <UCard
        :ui="{
          base: 'h-full  card px-[18px] pt-4 pb-[23px]',
          body: 'px-4 py-4',
        }"
      >
        <p
          class="text-center text-[18px] font-semibold text-grey-stepper w-[94%] mx-auto pb-2 border-[#E5E5EF] border-b"
        >
          Statistics
        </p>
        <div class="w-full flex flex-col items-center justify-center">
          <div class="w-[200px] mt-4 h-[200px] justify-center flex">
            <Doughnutchart :data1="13" :data2="2" />
          </div>
          <div class="w-full pt-6 flex flex-col gap-2">
            <div class="flex gap-1 items-center">
              <i class="i-heroicons-banknotes bg-icon w-5 h-5"></i>
              <p class="text-grey-border">Total Subscriptions:</p>
              13 <i> (past & active) </i>
            </div>
            <div class="flex gap-1 items-center">
              <i class="i-heroicons-pencil-square bg-icon w-5 h-5"></i>
              <p class="text-grey-border">Active Subscriptions:</p>
              2
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </section>

  <!-- table section -->
  <div class="overflow-x-auto mt-8">
    <div class="border-b px-5 border-[#D0D5DD]">
      <h2
        class="border-b-2 text-[1.125rem] px-2 font-semibold border-primary-green w-fit text-grey-medium"
      >
        Subscriptions
      </h2>
    </div>
    <UTable
      class=""
      :ui="{
        th: { base: 'hidden' },
        tr: { base: 'flex justify-between' },
        td: {
          base: ' w-fit text-[16px] flex items-center gap-2 whitespace-nowrap',
        },
      }"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No user has joined your facility.',
      }"
      :rows="filteredRows"
      :columns="columns"
    >
      <template #summary-data="{ row }">
        <div class="flex items-center gap-1">
          <span
            class="text-primary-green font-[900] w-[32px] h-[32px] flex items-center justify-center bg-[#F0F2F5] px-3 py-2 rounded-[50%]"
            >₦
          </span>
          <p class="font-medium text-[#1D2739]">
            Payment <span class="font-normal text-grey-border"> of </span>
            {{ row.actualSubscriptionAmount }}
            <span class="font-normal text-grey-border"> made to</span>
            {{ row.actualSubscriptionName }}
            <span class="font-normal text-grey-border"> by </span>
            {{ ` ${firstName} ${lastName} ` }}
          </p>
        </div>
      </template>
      <template #status-data="{ row }">
        <span
          :class="row.status === 'active' ? 'text-primary-green' : 'text-error'"
        >
          {{ row.status === "inactive" ? "Expired" : row.status }}
        </span>
      </template>
      <template #start-data="{ row }">
        <p class="font-normal text-grey-border">start:</p>
        <p class="font-medium text-[#1D2739]">
          {{
            new Date(row.startDate)?.toLocaleDateString(
              "en-US",
              dateFormatOption
            )
          }}
        </p>
      </template>
      <template #end-data="{ row }">
        <p class="font-normal text-grey-border">end:</p>
        <p class="font-medium text-[#1D2739]">
          {{
            new Date(row.endDate)?.toLocaleDateString("en-US", dateFormatOption)
          }}
        </p>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import Doughnutchart from "~/components/charts/Doughnut.vue";

const router = useRouter();
const columns = [
  {
    key: "summary",
    label: "",
  },
  {
    key: "status",
    label: "",
  },
  {
    key: "start",
    label: "",
  },
  {
    key: "end",
    label: "",
  },
];

const {
  params: { id },
} = router?.currentRoute.value;
const dateFormatOption: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};
const names = typeof id === "string" ? id.split("_") : [];
const capitalNames = names.map((name) => {
  return name[0].toUpperCase() + name.slice(1);
});
const [firstName, lastName] = capitalNames;
const userDetails = ref<{ data: any; result: string } | null>(null);
const { getUserDetailsUnderCompany, getCompanyUserSubscriptions } =
  useWorkspaceUserStore();
const userSubscriptions = ref([]);
const { data: response } = await useAsyncData("user-details", async () => {
  const response = getUserDetailsUnderCompany();
  return response;
});
const { data: subscriptions } = await useAsyncData(
  "user-subscriptions",
  async () => {
    const response = await getCompanyUserSubscriptions();
    return response;
  }
);

userSubscriptions.value = subscriptions.value?.data;
userDetails.value = response.value?.data;

const filteredRows = computed(() => {
  if (userSubscriptions.value) {
    return userSubscriptions?.value?.data?.map((item) => {
      const {
        actualSubscriptionAmount,
        actualSubscriptionName,
        status,
        startDate,
        endDate,
      } = item;
      return {
        actualSubscriptionAmount,
        actualSubscriptionName,
        status,
        startDate,
        endDate,
      };
    });
  }
});

function goBackToUsersPage() {
  navigateTo("/dashboard/users");
}
</script>

<style scoped>
.card {
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.15);
}
.bg-icon {
  background-color: #475367;
}
</style>
=======
  <div class="pt-1 pl-6 pr-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-14">
        <button @click="goBack" class="inline-flex items-center text-gray-900 font-bold dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
    <img src="../../../assets/icons/arrow back.svg" alt="Go back" class="w-5 h-5 mr-2"/>  
    <span class="font-bold text-xl">
        <span v-if="user?.firstName && user?.lastName">
            {{ user.firstName + ' ' + user.lastName }}
        </span>
        <span v-else>
            <img src="../../../assets/icons/clockloader.svg" alt="Loading" class="w-5 h-5 inline animate-spin"/>
        </span>
    </span>
</button>

</div>

    </div>
    
    <div class="flex gap-2 justify-between mb-10">
  <div class="w-[455px] h-[290px] bg-white dark:bg-gray-900 px-6 py-5 rounded shadow dark:shadow-gray-700">
    <h3 class="text-lg text-center font-semibold text-gray-800 dark:text-white">Profile</h3>
    <hr class="border-gray-300 dark:border-gray-700">
    <div class="flex items-center pl-2 mt-3 mb-6">
      <img src="../../../assets/icons/avatarImg.svg" alt="Profile Picture" class="w-12 h-12 rounded-full border">
      <div class="flex flex-col ml-3">
        <p class="text-gray-800 font-bold dark:text-gray-300">
          <span v-if="user?.firstName && user?.lastName">
            {{ user.firstName + ' ' + user.lastName }}
          </span>
          <span v-else>
            <img src="../../../assets/icons/clockloader.svg" alt="Loading" class="w-5 h-5 inline animate-spin"/>
          </span>
        </p>
        <div class="flex items-center">
          <img src="../../../assets/icons/fluent_status-20-regular.svg" alt="status_logo" class="w-4 h-6 mr-1">
          <p class="text-gray-600 dark:text-gray-400 text-md">Status: </p>
        </div>
      </div>
</div>

    
    <div class="space-y-2">
  <div class="flex items-center">
    <img src="../../../assets/icons/facility.svg" alt="facility_logo" class="w-4 h-6 mr-2"/>
    <p class="text-gray-600 dark:text-gray-400 text-md">Facility:</p>
  </div>

  <div class="flex items-center">
    <img src="../../../assets/icons/uit_calender.svg" alt="calendar_logo" class="w-4 h-6 mr-2"/>
    <p class="text-gray-600 dark:text-gray-400 text-md">Date Joined:</p>
  </div>
</div>
<div class="flex gap-1 h-7 mt-9 mr-4">
  <button class="inline-flex items-center flex-wrap min-w-fit bg-white dark:bg-gray-900 shadow dark:shadow-gray-700 text-gray-600 dark:text-gray-300 text-sm px-2 py-1 rounded">
    <img src="../../../assets/icons/mdi-light_email.svg" alt="email_logo" class="w-3 h-3 mr-1 flex-shrink-0"/>
    <strong class="mr-1 flex-shrink-0">Email:</strong>
    <span class="whitespace-normal break-all">
      <span v-if="user?.email">{{ user.email }}</span>
      <span v-else>
        <img src="../../../assets/icons/clockloader.svg" alt="Loading" class="w-3 h-3 inline animate-spin"/>
      </span>
    </span>
  </button>
  
  <button class="inline-flex items-center flex-wrap min-w-fit bg-white dark:bg-gray-900 shadow dark:shadow-gray-700 text-gray-600 dark:text-gray-300 text-sm px-2 py-1 rounded">
    <img src="../../../assets/icons/phone.svg" alt="phone_logo" class="w-3 h-3 mr-1 flex-shrink-0"/>
    <strong class="mr-1 flex-shrink-0">Phone:</strong>
    <span class="whitespace-normal break-all">
      <span v-if="user?.phone">{{ user.phone }}</span>
      <span v-else>
        <img src="../../../assets/icons/clockloader.svg" alt="Loading" class="w-3 h-3 inline animate-spin"/>
      </span>
    </span>
  </button>
</div>
</div>

<div class="w-[427px] h-[290px] bg-white dark:bg-gray-900 p-6 rounded shadow dark:shadow-gray-700">
  <h3 class="text-lg text-center font-semibold text-gray-800 dark:text-white">Statistics</h3>
  <hr class="border-gray-300 dark:border-gray-700">
  
  <div class="flex items-center mt-5">
    <img src="../../../assets/icons/circum_money-bill.svg" alt="status" class="w-5 h-5 mr-2"/>
    <p class="text-gray-600 dark:text-gray-300 text-md"><strong>Total Subscription:</strong> {{ subscriptions.length }}</p>
  </div>

  <div class="flex items-center mt-3">
    <img src="../../../assets/icons/fluent_status-20-regular.svg" alt="status" class="w-5 h-5 mr-2"/>
    <p class="text-gray-600 dark:text-gray-300 text-md"><strong>Active Subscriptions:</strong> {{ activeSubscriptions }}</p>
  </div>
</div>
</div>

    
    <div class="bg-white dark:bg-gray-900 p-6 rounded shadow dark:shadow-gray-700 mb-6">
  <h3 class="text-lg font-semibold text-gray-800 dark:text-white mb-4">Activity Chart</h3>
  <div class="text-gray-800 dark:text-gray-300">
    <!--The chart will go here-->
  </div>
</div>

<div class="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Subscription List</h3>
        <button @click="showFilterModal = true" class="flex items-center text-green-500 dark:text-green-400 hover:underline">
  <img src="../../../assets/icons/filter.svg" alt="filter_logo" class="w-3 h-3 mr-1"/>
  Filter
</button>

      </div>

      <div v-if="subscriptions.length > 0">
        <ul class="space-y-4">
          <li v-for="subscription in paginatedSubscriptions" :key="subscription.id"
            class="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray600 hover:bg-gray-700 dark:hover:bg-gray-700 rounded">
            <div class="flex-1">
              <p><strong>Payment Made By:</strong> {{ subscription.paidBy }}</p>
              <p><strong>Facility:</strong> {{ subscription.facility }}</p>
            </div>
            <div class="flex-1 text-center">
              <p><strong>Status:</strong> {{ subscription.status }}</p>
            </div>
            <div class="flex-1 text-right">
              <p><strong>Start Date:</strong> {{ subscription.startDate }}</p>
              <p><strong>End Date:</strong> {{ subscription.endDate }}</p>
            </div>
          </li>
        </ul>
      </div>
      <div v-else>
        <p class="text-center">No subscriptions found yet.</p>
      </div>
    </div>

    <div class="flex justify-between items-center" v-if="totalPages > 1">
      <button class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        Previous
      </button>
      <p>Page {{ currentPage }} of {{ totalPages }}</p>
      <button class="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
        :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        Next
      </button>
    </div>

    <!-- The Modal -->
    <div v-if="showFilterModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">
        <h4 class="text-xl font-semibold mb-4">Filter Subscriptions</h4>
        <form @submit.prevent="applyFilter">
          <div class="space-y-4">
            <div>
              <label class="block font-medium">Status</label>
              <select v-model="filterStatus"
                class="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:text-gray-200">
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="expired">Expired</option>
              </select>
            </div>
            <div class="flex justify-between">
              <button type="button" @click="showFilterModal = false"
                class="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded">
                Cancel
              </button>
              <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded">
                Apply
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
definePageMeta({ layout: "dashboard-layout" });
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWorkspaceUserStore } from "@/stores/workspaceUserStore";

export default {
  setup() {
    const route = useRoute();
    const router = useRouter();
    const workspaceUserStore = useWorkspaceUserStore();

    const userId = ref(route.params.id);
    const user = ref(null);
    const subscriptions = ref([]);
    const filterStatus = ref('');
    const showFilterModal = ref(false);
    const currentPage = ref(1);
    const itemsPerPage = 5;

  
    const fetchUser = async () => {
      await workspaceUserStore.fetchWorkspaceUsers();
      user.value = workspaceUserStore.getWorkspaceUsers.find(u => u.id === userId.value) || null;
      subscriptions.value = user.value?.subscriptions || [];
    };

    onMounted(fetchUser);

    const paginatedSubscriptions = computed(() => {
      let filteredSubscriptions = subscriptions.value;
      if (filterStatus.value) {
        filteredSubscriptions = filteredSubscriptions.filter(sub => sub.status === filterStatus.value);
      }
      const startIndex = (currentPage.value - 1) * itemsPerPage;
      return filteredSubscriptions.slice(startIndex, startIndex + itemsPerPage);
    });

    const totalPages = computed(() => Math.ceil(subscriptions.value.length / itemsPerPage));
    const activeSubscriptions = computed(() => subscriptions.value.filter(sub => sub.status === "active").length);

    const changePage = (page) => {
      if (page >= 1 && page <= totalPages.value) {
        currentPage.value = page;
      }
    };

    const applyFilter = () => {
      showFilterModal.value = false;
    };
    const goBack = () => {
      router.push("/dashboard/users");
    };

    return {
      user,
      subscriptions,
      activeSubscriptions,
      paginatedSubscriptions,
      totalPages,
      currentPage,
      changePage,
      showFilterModal,
      filterStatus,
      applyFilter,
      goBack
    };
  }
};
</script>
