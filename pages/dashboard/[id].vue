<template>
  <div class="pt-6 pl-6 pr-6">
    <!-- This is the user profile header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center space-x-4">
        <button @click="goBack" class="text-gray-600 hover:text-gray-800">
          <span class="font-bold text-xl">&lt;</span> Back
        </button>
        <h2 class="text-3xl font-semibold">{{ user.name }}</h2>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <!-- User Profile Card -->
      <div class="bg-white p-6 rounded shadow">
        <h3 class="text-lg font-semibold">Profile</h3>
        <img :src="'https://userProfilePicture/'" alt="Profile Picture" class="w-32 h-32 rounded-full mt-4 mb-2">
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Role:</strong> {{ user.role }}</p>
      </div>

      <!-- Statistics Card -->
      <div class="bg-white p-6 rounded shadow">
        <h3 class="text-lg font-semibold"> Statistics</h3>
        <!--Stats here-->
      </div>
    </div>

    <!-- The Chart -->
    <div class="bg-white p-6 rounded shadow mb-6">
      <h3 class="text-lg font-semibold mb-4">Activity Chart</h3>
      <div>
        <!--The chart will go here-->
      </div>
    </div>

    <!-- Subscription List -->
    <div class="bg-white p-6 rounded shadow mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">Subscription List</h3>
        <button @click="showFilterModal = !showFilterModal" class="text-green-500 hover:underline">Filter</button>
      </div>
      
      <!-- Subscription Filtered List -->
      <div v-if="subscriptions.length > 0">
        <ul class="space-y-4">
          <li v-for="subscription in paginatedSubscriptions" :key="subscription.id" class="flex justify-between items-center p-4 border-b hover:bg-gray-100 rounded">
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
        <p>No subscriptions found.</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-between items-center" v-if="totalPages > 1">
      <button class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">
        Previous
      </button>
      <p>Page {{ currentPage }} of {{ totalPages }}</p>
      <button class="px-4 py-2 bg-gray-200 rounded disabled:opacity-50" :disabled="currentPage === totalPages" @click="changePage(currentPage + 1)">
        Next
      </button>
    </div>

    <!-- Modal for the Filter -->
    <div v-if="showFilterModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded shadow-lg">
        <h4 class="text-xl font-semibold mb-4">Filter Subscriptions</h4>
        <form @submit.prevent="applyFilter">
          <div class="space-y-4">
            <div>
              <label class="block font-medium">Status</label>
              <select v-model="filterStatus" class="w-full p-2 border rounded">
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div class="flex justify-between">
              <button type="button" @click="showFilterModal = false" class="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded">
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

import { useWorkspaceUserStore } from '@/stores/workspaceUserStore';


export default {
  setup() {
    const workspaceUserStore = useWorkspaceUserStore();
    return { workspaceUserStore };
  },
  data() {
    return {
      subscriptions: [],
      loading: true,
      currentPage: 1,
      itemsPerPage: 5,
      filterStatus: '',
      showFilterModal: false,
    };
  },
  computed: {
    user() {
      return this.workspaceUserStore.getWorkspaceUsers.find(
        (user) => user.id === this.$route.params.id
      ) || {};
    },
    paginatedSubscriptions() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.subscriptions.slice(startIndex, endIndex);
    },
    totalPages() {
      return Math.ceil(this.subscriptions.length / this.itemsPerPage);
    },
  },
  methods: {
    async fetchUserData() {
      this.loading = true;
      try {
        await this.workspaceUserStore.fetchWorkspaceUsers();
        const selectedUser = this.user;
        if (selectedUser && selectedUser.subscriptions) {
          this.subscriptions = selectedUser.subscriptions;
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        this.loading = false;
      }
    },
    changePage(page) {
      this.currentPage = page;
    },
    applyFilter() {
      this.showFilterModal = false;
      this.fetchUserData();
    },
    goBack() {
      this.$router.push('/dashboard/users');
    },
  },
  async mounted() {
    await this.fetchUserData();
  },
};
</script>

<style scoped>

</style>
