<script setup lang="ts">
import SidebarNavigation from '~/components/SideBarNavigation.vue';
import ColorModeButton from '~/components/ColorModeButton.vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';


const activeUserStore = useActiveUserStore();
const { userType, getUserDetails } = storeToRefs(activeUserStore);
const router = useRouter();

const darkMode = ref(false);

// Toggle dark mode
const toggleDarkMode = () => {
  darkMode.value = !darkMode.value;
  document.documentElement.classList.toggle('dark', darkMode.value); // Toggle the 'dark' class on the root element
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
  <div :class="['dashboard-layout flex h-screen', { dark: darkMode }]">
    <SidebarNavigation />
    <div class="flex-1 flex flex-col">
      <div class="py-3 px-3 flex justify-between bg-gray-100 dark:bg-gray-800 shadow-md">
        <h1 class="font-bold text-gray-900 dark:text-gray-100">
          Workspace 
          <span>{{ userType === "user" ? "User" : "Admin" }}</span>
          <br />
          <span v-if="userType === 'user'">
            {{ getUserDetails.firstName }} {{ getUserDetails.lastName }}
          </span>
          <span v-else>
            {{ getUserDetails.name }}
          </span>
        </h1>
        <div class="flex items-center gap-4">
          <ColorModeButton @click="toggleDarkMode" />
          <UButton @click="logout" color="white" variant="solid">Logout</UButton>
        </div>
      </div>

      <main class="p-4 flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <slot />
      </main>
      <Footer />
    </div>
  </div>
</template>

<style scoped>
.dashboard-layout {
  display: flex; 
}
</style>
