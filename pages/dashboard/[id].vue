<template>
  <div class="pt-1 pl-6 pr-6">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-14">
        <button @click="goBack" class="text-gray-900 font-bold dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100">
          <span class="font-bold text-xl">← </span>{{ user?.firstName + ' ' + user?.lastName }}
        </button>
      </div>
    </div>
    <div class="flex gap-2 justify-between mb-10">
  <div class="w-[427px] h-[290px] bg-white dark:bg-gray-900 px-4 py-5 rounded shadow dark:shadow-gray-700">
    <h3 class="text-lg text-center font-semibold text-gray-800 dark:text-white">Profile</h3>
    <hr class="border-gray-300 dark:border-gray-700">
    <div class="flex items-center pl-2 mt-3 mb-6">
      <img :src="''" alt="Profile Picture" class="w-12 h-12 rounded-full">
      <div class="flex flex-col ml-3">
        <p class="text-gray-800 font-bold dark:text-gray-300">{{ user?.firstName + ' ' + user?.lastName }}</p>
        <div class="flex items-center">
          <img src="../../assets/icons/fluent_status-20-regular.svg" alt="status_logo" class="w-4 h-6 mr-1">
          <p class="text-gray-600 dark:text-gray-400 text-md">Status:</p>
        </div>
      </div>
    </div>
    
    <div class="space-y-2">
  <div class="flex items-center">
    <img src="../../assets/icons/facility.svg" alt="facility_logo" class="w-4 h-6 mr-2"/>
    <p class="text-gray-600 dark:text-gray-400 text-md">Facility:</p>
  </div>

  <div class="flex items-center">
    <img src="../../assets/icons/uit_calender.svg" alt="calendar_logo" class="w-4 h-6 mr-2"/>
    <p class="text-gray-600 dark:text-gray-400 text-md">Date Joined:</p>
  </div>
</div>


  <div class="flex gap-3 h-7 mt-9">
  <button class="inline-flex items-center flex-1 min-w-0 whitespace-nowrap bg-white dark:bg-gray-900 shadow dark:shadow-gray-700 text-gray-600 dark:text-gray-300 text-sm px-2 py-1 rounded overflow-hidden text-ellipsis">
    <img src="../../assets/icons/mdi-light_email.svg" alt="email_logo" class="w-4 h-4 mr-1 flex-shrink-0"/>
    <strong class="mr-1 flex-shrink-0">Email:</strong>
    <span class="truncate">{{ user?.email }}</span>
  </button>
  <button class="inline-flex items-center flex-1 min-w-0 whitespace-nowrap bg-white dark:bg-gray-900 shadow dark:shadow-gray-700 text-gray-600 dark:text-gray-300 text-sm px-2 py-1 rounded overflow-hidden text-ellipsis">
    <img src="../../assets/icons/phone.svg" alt="phone_logo" class="w-4 h-4 mr-1 flex-shrink-0"/>
    <strong class="mr-1 flex-shrink-0">Phone:</strong>
    <span class="truncate">{{ user?.phone || 'N/A' }}</span>
  </button>
</div>
</div>

<div class="w-[427px] h-[290px] bg-white dark:bg-gray-900 p-6 rounded shadow dark:shadow-gray-700">
  <h3 class="text-lg text-center font-semibold text-gray-800 dark:text-white">Statistics</h3>
  <hr class="border-gray-300 dark:border-gray-700">
  
  <div class="flex items-center mt-5">
    <img src="../../assets/icons/circum_money-bill.svg" alt="status" class="w-5 h-5 mr-2"/>
    <p class="text-gray-600 dark:text-gray-300 text-md"><strong>Total Subscription:</strong> {{ subscriptions.length }}</p>
  </div>

  <div class="flex items-center mt-3">
    <img src="../../assets/icons/fluent_status-20-regular.svg" alt="status" class="w-5 h-5 mr-2"/>
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
  <img src="../../assets/icons/filter.svg" alt="filter_logo" class="w-3 h-3 mr-1"/>
  Filter
</button>

      </div>

      <div v-if="subscriptions.length > 0">
        <ul class="space-y-4">
          <li v-for="subscription in paginatedSubscriptions" :key="subscription.id"
            class="flex justify-between items-center p-4 border-b border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
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