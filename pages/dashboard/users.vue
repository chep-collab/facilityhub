<template>
  <div class="pt-0 pl-6">
    <h4 class="text-2xl text-gray-600 font-semibold mb-4">Users</h4>
    
    <!-- This is the loading state -->
    <div v-if="loading" class="text-center">Loading...</div>

    <ul v-else class="space-y-4">
      <li v-for="user in paginatedUsers" :key="user.id" class="bg-white p-4 rounded shadow flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <img :src="'https://theuserprofilepic'" alt="User" class="w-10 h-10 rounded-full">
          <div>
            <p class="text-lg font-medium">{{ user.fullName }}</p>
          </div>
        </div>
        <div>
          <span :class="getStatusClass(user.status)">{{ user.status }}</span>
        </div>
        <!-- Button -->
        <button class="text-green-500 hover:underline" @click="viewUser(user.id)">View →</button>
      </li>
    </ul>

    <!-- Pagination -->
    <div class="mt-4 flex justify-between items-center" v-if="totalPages > 1">
      <button
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
      >
        Previous
      </button>
      <p>Page {{ currentPage }} of {{ totalPages }}</p>
      <button
        class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useWorkspaceUserStore } from "@/stores/workspaceUserStore";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

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
      return "text-green-500 font-bold";
    case "inactive":
      return "text-yellow-500 font-bold";
    case "expired":
      return "text-red-500 font-bold";
    default:
      return "text-gray-500";
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
