<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();
const activeUserStore = useActiveUserStore();
const { userType } = storeToRefs(activeUserStore);

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
    icon: "i-heroicons-cog-6-tooth",
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
    icon: "i-heroicons-user",
    to: "/dashboard/subscriptions",
  },
  {
    label: "My Centers",
    icon: "i-heroicons-user",
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
  <div class="sidebar bg-[#599376] w-[239px]">
    <div class="flex items-center space-x-2 p-4 ml-1">
      <img src="/assets/icons/Image.png" alt="Logo" class="h-6 w-6" />
      <div class="font-inter text-[14px] text-center text-sm font-bold text-white">Facility Hub</div>
    </div>
    <div class="font-inter text-[11px] font-semibold leading-[15.95px] text-left text-[#E4E7EC] text-sm text-white">
      <p class="ml-5 mt-3 mb-3">MENU</p>
      <nav>
        <ul class="space-y-3 ml-2">
          <li
            v-for="link in links"
            :key="link.label"
            @click="router.push(link.to)"
            class="flex items-center space-x-2 cursor-pointer hover:bg-gray-300 hover:bg-opacity-30 dark:hover:bg-gray-600 dark:hover:bg-opacity-40 px-2 py-2 rounded-md transition-all duration-200"
          >
            <i :class="link.icon" class="h-5 w-5"></i>
            <span class="text-sm font-semibold">{{ link.label }}</span>
          </li>
        </ul>

        <hr class="ml-4 mr-3 mt-5" />
        <p class="ml-5 mt-5">GENERAL</p>
        <ul>
          <li
            @click="logout"
            class="flex items-center space-x-2 cursor-pointer hover:bg-gray-300 hover:bg-opacity-30 dark:hover:bg-gray-600 dark:hover:bg-opacity-40 px-3 py-2 rounded-md mt-1 transition-all duration-200"
          >
            <i class="i-heroicons-arrow-left-end-on-rectangle h-5 w-5 ml-2"></i>
            <span class="text-sm font-semibold">Logout</span>
          </li>
        </ul>
        <hr class="ml-4 mr-3 mt-5" />

      </nav>
    </div>
  </div>
</template>

