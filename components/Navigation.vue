<script setup lang="ts">
const route = useRoute();
const activeUser = useActiveUser();

const companyTabs = [
  {
    label: "Services",
    icon: "i-heroicons-cog-6-tooth",
    to: "/dashboard/home",
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
    to: "/dashboard/my-subscriptions",
  },
  {
    label: "My Centers",
    icon: "i-heroicons-user",
    to: "/dashboard/joined-centers",
  },
];
const links =
  activeUser === "company"
    ? companyTabs
    : activeUser === "user"
    ? userTabs
    : [];
</script>

<template>
  <UHorizontalNavigation
    :links="links"
    class="border-b border-gray-200 dark:border-gray-800"
  />
</template>
