<script setup lang="ts">
import { ref } from 'vue';
import SidebarNavigation from '~/components/SideBarNavigation.vue';
import ColorModeButton from '~/components/ColorModeButton.vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const activeUserStore = useActiveUserStore();
const { userType, getUserDetails } = storeToRefs(activeUserStore);
const router = useRouter();

const darkMode = ref(false);
const sidebarVisible = ref(false);

// Toggle dark mode
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle('dark', darkMode.value); 
};

// Toggle sidebar visibility
const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value;
};

// Event to close sidebar
const closeSidebar = () => {
  sidebarVisible.value = false;
};

const logout = () => {
  localStorage.clear();
  activeUserStore.setAuthenticationState(false);
  if (userType.value === "company") {
    router.push({ name: "company-login" });
  } else {
    router.push({ name: "user-login" });
  }
};
</script>

<template>
  <div :class="['dashboard-layout flex h-screen relative', { dark: darkMode }]">
    <!-- Overlay -->
    <div 
      v-if="sidebarVisible" 
      @click="closeSidebar"
      class="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden transition-opacity"
    ></div>

    <!-- Sidebar -->
    <SidebarNavigation 
      :class="['fixed lg:relative z-20 top-0 left-0 h-full w-64 shadow-lg transform lg:translate-x-0', sidebarVisible ? 'translate-x-0' : '-translate-x-full']"
      style="transition: transform 0.3s ease-in-out;"
      @closeSidebar="closeSidebar"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col w-full">
      <div class="py-3 px-7 flex justify-between bg-gray-100 dark:bg-[#0D0D0D99] rounded-md shadow">
        <button @click="toggleSidebar" class="lg:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400 dark:text-gray-200 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 class="font-bold text-gray-400 text-sm dark:text-grey-200 ml-4">
          Workspace 
          <span class="text-sm">{{ userType === "user" ? "User" : "Admin" }}</span>
          <br />
          <span v-if="userType === 'user'" class="text-md" style="color: #667185;">
            Welcome, {{ getUserDetails.firstName }} {{ getUserDetails.lastName }}!
          </span>
          <span v-else class="text-md" style="color: #667185;">
            Welcome, {{ getUserDetails.name }}!
          </span>
        </h1>
        <div class="flex items-center gap-1">
          <ColorModeButton @click="toggleDarkMode" />
          <!--<UButton @click="logout" color="white" variant="solid">Logout</UButton>-->
        </div>
      </div>

      <main class="p-5 flex-1 relative overflow-y-auto bg-white dark:bg-[#0D0D0D99]">
        <slot />
      </main>
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex;
}
</style>
