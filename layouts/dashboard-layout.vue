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
      <div class="py-3 px-9 flex justify-between bg-gray-100 dark:bg-[#0D0D0D99] rounded-md">
        <h1 class="font-bold text-gray-400 dark:text-grey-200 ml-2">
  Workspace 
  <span>{{ userType === "user" ? "User" : "Admin" }}</span>
  <br />
  <span v-if="userType === 'user'"style="color: #667185;">
    Welcome, {{ getUserDetails.firstName }} {{ getUserDetails.lastName }}!
  </span>
  <span v-else style="color: #667185;">
    Welcome, {{ getUserDetails.name }}!
  </span>
</h1>

        <div class="flex items-center gap-4 ">
          <ColorModeButton @click="toggleDarkMode" />
          <UButton @click="logout" color="white" variant="solid">Logout</UButton>
        </div>
      </div>

      <main class="p-5 flex-1 overflow-y-auto bg-white dark:bg-[#0D0D0D99]">
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
