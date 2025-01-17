<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router"; // Imported useRoute

const router = useRouter();
const route = useRoute(); // To get the current route
const activeUserStore = useActiveUserStore();
const { userType, getUserDetails } = storeToRefs(activeUserStore);

// Logout function
const logout = () => {
  localStorage.clear();
  activeUserStore.setAuthenticationState(false);
  if (userType.value === "company") {
    router.push({ name: "company-login" });
  } else {
    router.push({ name: "user-login" });
  }
};

const companyTabs = [
  {
    label: "Overview",
    icon: "i-heroicons-home",
    to: "/dashboard",
  },
  {
    label: "Subscriptions",
    icon: "i-heroicons-banknotes",
    to: "/dashboard/subscriptions",
  },
  {
    label: "Services",
    icon: "i-heroicons-credit-card",
    to: "/dashboard/services",
  },
  {
    label: "Users",
    icon: "i-heroicons-user",
    to: "/dashboard/users",
  },
];

const userTabs = [
  {
    label: "Home",
    icon: "i-heroicons-home",
    to: "/dashboard",
  },
  {
    label: "My Subscriptions",
    icon: "i-heroicons-banknotes",
    to: "/dashboard/subscriptions",
  },
  {
    label: "My Centers",
    icon: "i-heroicons-building-office-2",
    to: "/dashboard/joined-centers",
  },
];

const links =
  userType.value === "company"
    ? companyTabs
    : userType.value === "user"
    ? userTabs
    : [];
</script>

<template>
  <div class=" rounded-bg sidebar w-[239px] sidebar bg-[#599376] dark:bg-[#1B2C23]">
    <div class="flex items-center space-x-2 p-4 ml-1">
      <img src="/assets/icons/light logo.png" alt="Logo Light" class="h-5 w-5 dark:hidden" />
      <img src="/assets/icons/Root (1).png" alt="Logo Dark" class="h-5 w-5 hidden dark:block"
    />
      <div class="font-inter text-[14px] text-center text-sm font-bold text-white dark:text-white">Facility Hub</div>
    </div>
    <div class="font-inter text-[11px] font-semibold leading-[15.95px] text-left text-white dark:text-gray-300 text-sm">
      <p class="ml-5 mt-3 mb-3">MENU</p>
      <nav>
        <ul class="space-y-3 ml-2">
          <li
            v-for="link in links"
            :key="link.label"
            @click="router.push(link.to)"
            :class="[ 
              'flex items-center space-x-2 cursor-pointer px-2 py-2 rounded-md transition-all duration-200', 
              route.path === link.to ? 'bg-gray-300 bg-opacity-50 text-white dark:bg-gray-600 dark:bg-opacity-50' : 
              'hover:bg-gray-300 hover:bg-opacity-30 dark:hover:bg-gray-600 dark:hover:bg-opacity-40' 
            ]"
          >
            <i :class="link.icon" class="h-5 w-5"></i>
            <span class="text-sm font-semibold">{{ link.label }}</span>
          </li>
        </ul>

        <hr class="ml-4 mr-3 mt-5" />
        <p class="ml-5 mt-5">GENERAL</p>
        <ul>
          <li
         @click="settingsComingSoon"
        class="flex items-center space-x-2 cursor-not-allowed opacity-50 px-3 py-2 rounded-md mt-1 transition-all duration-200"
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
  <!-- Profile Picture -->
  <img
    :src="getUserDetails.profilePicture || '/assets/icons/default-avatar.png'"
    alt="User Profile Picture"
    class="h-10 w-10 rounded-full border border-gray-300 dark:border-gray-600"
  />

  <!-- Welcome Text -->
  <div>
    <p class="font-bold text-gray-700 dark:text-gray-200 text-sm">
      <span v-if="userType === 'user'" style="color: #FFFFFF;">
      {{ getUserDetails.firstName }} {{ getUserDetails.lastName }}
      </span>
      <span v-else style="color: #FFFFFF;">
      {{ getUserDetails.name }}
      </span>
    </p>
    <p class="text-xs dark:text-gray-400">
            {{ getUserDetails.email || 'No email available' }}
          </p>
  </div>
</div>
    </div>
  </div>
</template>
