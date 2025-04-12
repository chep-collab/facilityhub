<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { storeToRefs } from "pinia";

const router = useRouter();
const route = useRoute();
const activeUserStore = useActiveUserStore();
const companyServiceStore = useCompanyServiceStore();
const { userType, getUserDetails } = storeToRefs(activeUserStore);
const settingsPath = "/dashboard/settings";
// Emit closeSidebar event when a menu item is clicked
const closeSidebarAndNavigate = (path: string) => {
  emit("closeSidebar");
  router.push(path);
};
function resetStores() {
  activeUserStore.$reset();
  companyServiceStore.$reset();
}
// Logout function
const logout = () => {
  localStorage.clear();
  activeUserStore.setAuthenticationState(false);

  if (userType.value === "company") {
    router.push({ name: "company-login" });
    resetStores();
  } else {
    router.push({ name: "user-login" });
    resetStores();
  }
};

const companyTabs = [
  {
    label: "Overview",
    icon: "i-heroicons-home",
    path: "/dashboard",
  },
  {
    label: "Subscriptions",
    icon: "i-heroicons-banknotes",
    path: "/dashboard/subscriptions",
  },
  {
    label: "Services",
    icon: "i-heroicons-credit-card",
    path: "/dashboard/services",
  },
  {
    label: "Users",
    icon: "i-heroicons-user",
    path: "/dashboard/users",
  },
];

const userTabs = [
  {
    label: "Home",
    icon: "i-heroicons-home",
    path: "/dashboard",
  },
  {
    label: "My Subscriptions",
    icon: "i-heroicons-banknotes",
    path: "/dashboard/subscriptions",
  },
  {
    label: "My Centers",
    icon: "i-heroicons-building-office-2",
    path: "/dashboard/joined-centers",
  },
];

const links =
  userType.value === "company"
    ? companyTabs
    : userType.value === "user"
    ? userTabs
    : [];

import { defineProps, defineEmits } from "vue";

const emit = defineEmits(["closeSidebar"]);
</script>

<template>
  <div
    class="rounded-bg sidebar w-[239px] sidebar bg-[#599376] dark:bg-[#1B2C23]"
  >
    <div class="flex items-center space-x-2 p-4 ml-1 mt-3">
      <div style="position: relative; width: 20px; height: 20px">
        <img
          src="/assets/icons/dark_mode_logo.png"
          alt="Logo Light"
          class="h-5 w-5 dark:hidden"
          style="position: absolute; top: 0; left: 0"
        />
        <img
          src="/assets/icons/light_mode_logo.png"
          alt="Logo Dark"
          class="h-5 w-5 hidden dark:block"
          style="position: absolute; top: 0; left: 0"
        />
      </div>
      <div
        class="font-inter text-[14px] text-center text-sm font-bold text-white dark:text-white"
      >
        Facility Hub
      </div>
    </div>

    <div
      class="font-inter text-[11px] font-semibold leading-[15.95px] text-left text-white dark:text-gray-300 text-sm"
    >
      <p class="ml-5 mt-4 mb-3">MENU</p>
      <nav>
        <ul class="space-y-2 ml-2">
          <li
            v-for="link in links"
            :key="link.label"
            @click="closeSidebarAndNavigate(link.path)"
            :class="[
              'flex items-center space-x-2 cursor-pointer px-2 py-2 rounded-md transition-all duration-200',
              route.path === link.path
                ? 'bg-gray-300 bg-opacity-50 text-white dark:bg-gray-600 dark:bg-opacity-50'
                : 'hover:bg-gray-300 hover:bg-opacity-30 dark:hover:bg-gray-600 dark:hover:bg-opacity-40',
            ]"
          >
            <i :class="link.icon" class="h-5 w-5"></i>
            <span class="text-sm font-semibold">{{ link.label }}</span>
          </li>
        </ul>

        <hr class="ml-4 mr-3 mt-5" />
        <p class="ml-5 mt-5">GENERAL</p>
        <ul class="mt-2" >
          <li
            @click="closeSidebarAndNavigate(settingsPath)"
            :key="'settings'"
            :class="[
              'flex items-center space-x-2 cursor-pointer px-2 py-2 rounded-md transition-all duration-200',
              route.path === '/dashboard/settings'
                ? 'bg-gray-300 bg-opacity-50 text-white dark:bg-gray-600 dark:bg-opacity-50'
                : 'hover:bg-gray-300 hover:bg-opacity-30 dark:hover:bg-gray-600 dark:hover:bg-opacity-40',
            ]"
          >
            <i class="i-heroicons-cog-6-tooth h-5 w-5 ml-2"></i>
            <span class="text-sm font-semibold">Settings</span>
          </li>
          <li
            @click="logout"
            class="flex items-center space-x-2 cursor-pointer hover:bg-gray-300 hover:bg-opacity-30 dark:hover:bg-gray-600 dark:hover:bg-opacity-40 px-3 py-2 rounded-md mt-1 transition-all duration-200"
          >
            <i class="i-heroicons-arrow-left-end-on-rectangle h-5 w-5 ml-2"></i>
            <span class="text-sm font-semibold">Logout</span>
          </li>
        </ul>
      </nav>
      <hr class="ml-4 mr-3 mt-5" />
      <div class="flex items-center space-x-3 p-4">
        <img
          :src="getUserDetails.profilePicture"
          alt="User Profile Picture"
          class="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-600"
        />
        <div>
          <p class="font-bold text-gray-700 dark:text-gray-200 text-sm">
            <span v-if="userType === 'user'" style="color: #ffffff">
              {{ getUserDetails.firstName }} {{ getUserDetails.lastName }}
            </span>
            <span v-else style="color: #ffffff">
              {{ getUserDetails.name }}
            </span>
          </p>
          <p class="text-xs text-gray-300 dark:text-gray-400">
            {{ getUserDetails.email || "No email available" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
