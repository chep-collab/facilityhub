<template>
    <div class="pt-0 pl-4 sm:pl-6">
      <h4 class="text-sm sm:text-2xl text-black-600 dark:text-gray-300 font-semibold mb-4">Users</h4>
      <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">Loading...</div>
  
      <ul v-else class="space-y-2 sm:space-y-3 w-full max-w-3xl">
        <li 
          v-for="(user, index) in paginatedUsers" 
          :key="user.id" 
          class="bg-white dark:bg-gray-800 p-2 rounded shadow-lg dark:shadow-none flex justify-between items-center transition-colors"
        >
          <div class="flex items-center space-x-2 sm:space-x-4 w-full">
            <span class="font-bold text-gray-800 dark:text-gray-300 w-4 sm:w-6 text-xs sm:text-sm ml-1 sm:ml-2">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}.
            </span> 
            <img :src="''" alt="User" class="w-8 sm:w-10 h-8 sm:h-10 rounded-full border">
            <div class="flex-1">
              <p class="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
                {{ getUserName(user.id) }}
              </p>
            </div>
          </div>
          <div class="flex justify-between items-center w-full">
            <span :class="getStatusClass(user.id)" class="text-xs sm:text-sm font-medium">
              {{ getUserSubscriptionStatus(user.id) }}
            </span>
            <button class="text-green-500 dark:text-green-400 hover:underline text-xs sm:text-sm mt-1 sm:mt-2 mr-2 sm:mr-3" @click="viewUser(user.id)">View →</button>
          </div>
        </li>
      </ul>
      <div class="mt-4 flex justify-between items-center" v-if="totalPages > 1">
        <button
          class="px-2 sm:px-4 py-1 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded disabled:opacity-50 text-xs sm:text-sm"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          Previous
        </button>
        <p class="text-gray-700 dark:text-gray-300 text-xs sm:text-sm">Page {{ currentPage }} of {{ totalPages }}</p>
        <button
          class="px-2 sm:px-4 py-1 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded disabled:opacity-50 text-xs sm:text-sm"
          :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  definePageMeta({ layout: "dashboard-layout" });
  
  import { ref, computed, onMounted } from "vue";
  import { useWorkspaceUserStore } from "@/stores/workspaceUserStore";
  import { useSubscriptionStore } from "@/stores/subscriptionStore"; 
  import { storeToRefs } from "pinia";
  import { useRouter } from "vue-router";
  import { useActiveUserStore } from "@/stores/activeUserStore"; // Importing
  
  const subscriptionStore = useSubscriptionStore();
  const { getSubscriptions } = storeToRefs(subscriptionStore);
  
  const workspaceUserStore = useWorkspaceUserStore();
  const { getWorkspaceUsers } = storeToRefs(workspaceUserStore);
  
  const activeUserStore = useActiveUserStore();
  const { getUserDetails } = storeToRefs(activeUserStore); // Getting active user 
  
  const loading = ref(true);
  const currentPage = ref(1);
  const itemsPerPage = 5;
  const router = useRouter();
  
  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return getWorkspaceUsers.value.slice(start, start + itemsPerPage);
  });
  
  const totalPages = computed(() => {
    return Math.ceil(getWorkspaceUsers.value.length / itemsPerPage);
  });
  
  const changePage = (page) => {
    currentPage.value = page;
  };
  
  const getUserName = (userId) => {
    const user = getWorkspaceUsers.value.find(u => u.id === userId);
    if (user) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim() || "Unknown User";
    }
    return "Unknown User";
  };
  
  const getUserSubscriptionStatus = (userId) => {
    const userSubscription = getSubscriptions.value.find(subscription => subscription.userId === userId);
    if (userSubscription) {
      return userSubscription.isActive ? "Active" : "Inactive";
    }
    return "Inactive"; 
  };
  
  const getStatusClass = (userId) => {
    const userSubscription = getSubscriptions.value.find(subscription => subscription.userId === userId);
    if (userSubscription) {
      return userSubscription.isActive ? "text-green-500 dark:text-green-400 font-bold" : "text-orange-500 dark:text-orange-400 font-bold";
    }
    return "text-orange-400 dark:text-orange-400";
  };
  
  const viewUser = (userId) => {
    router.push(`/dashboard/users/${userId}`);
  };
  
  
  onMounted(async () => {
    await workspaceUserStore.fetchWorkspaceUsers();
    await subscriptionStore.fetchCompanySubscriptions(); 
    loading.value = false;
  });
  </script>
  