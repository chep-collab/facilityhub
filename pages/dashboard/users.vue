<template>
  <div class="pt-0 pl-6">
    <h4 class="text-2xl text-gray-600 dark:text-gray-300 font-semibold mb-4">Users</h4>
    <div v-if="loading" class="text-center text-gray-500 dark:text-gray-400">Loading...</div>

    <ul v-else class="space-y-4">
      <li 
        v-for="(user, index) in paginatedUsers" 
        :key="user.id" 
        class="bg-white dark:bg-gray-800 p-3 rounded shadow-lg dark:shadow-none flex justify-between items-center transition-colors"
      >
        <div class="flex items-center space-x-4">
          <span class="font-bold text-gray-800 dark:text-gray-300">
            {{ (currentPage - 1) * itemsPerPage + index + 1 }}.
          </span> 
          <img :src="'https://theuserprofilepic'" alt="User" class="w-10 h-10 rounded-full">
          <div>
            <p class="text-lg font-medium text-gray-800 dark:text-gray-200">{{ user.fullName }}</p>
          </div>
        </div>
        <div>
          <span :class="getStatusClass(user.status)">{{ user.status }}</span>
        </div>
        <!-- Button -->
        <button class="text-green-500 dark:text-green-400 hover:underline" @click="viewUser(user.id)">View →</button>
      </li>
    </ul>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center" v-if="totalPages > 1">
      <button
        class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      <p class="text-gray-700 dark:text-gray-300">Page {{ currentPage }} of {{ totalPages }}</p>
      <button
        class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded disabled:opacity-50"
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

const subscriptionStore = useSubscriptionStore();
const { getSubscriptions } = storeToRefs(subscriptionStore);

const workspaceUserStore = useWorkspaceUserStore();
const { getWorkspaceUsers } = storeToRefs(workspaceUserStore);

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

const getStatusClass = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "text-green-500 dark:text-green-400 font-bold";
    case "inactive":
      return "text-yellow-500 dark:text-yellow-400 font-bold";
    case "expired":
      return "text-red-500 dark:text-red-400 font-bold";
    default:
      return "text-gray-500 dark:text-gray-400";
  }
};

const viewUser = (userId) => {
  router.push(`/dashboard/users/${userId}`);
};

onMounted(async () => {
  await workspaceUserStore.fetchWorkspaceUsers();
  loading.value = false;
});
</script>
