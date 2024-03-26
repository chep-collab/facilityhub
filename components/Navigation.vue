<script setup lang="ts">
import { storeToRefs } from "pinia";

const activeUserStore = useActiveUserStore();
const { userType } = storeToRefs(activeUserStore);

const companyTabs = [
  {
    label: "Services",
    icon: "i-heroicons-cog-6-tooth",
    to: "/dashboard",
  },
  {
    label: "Subscriptions",
    icon: "i-heroicons-credit-card",
    to: "/dashboard/subscriptions",
  },
  {
    label: "Users",
    icon: "i-heroicons-user",
    to: "/dashboard/users",
  },
];

const userTabs = [
  {
    label: "My Subscriptions",
    icon: "i-heroicons-user",
    to: "/dashboard",
  },
  {
    label: "My Centers",
    icon: "i-heroicons-user",
    to: "/dashboard/joined-centers",
  },
];
const links =
  userType.value == "company"
    ? companyTabs
    : userType.value == "user"
    ? userTabs
    : [];
</script>

<template>
  <UHorizontalNavigation
    :links="links"
    class="border-b border-gray-200 dark:border-gray-800"
  />
</template>
