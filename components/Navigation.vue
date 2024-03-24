<script setup lang="ts">
const route = useRoute();

const links = [
  [
    {
      label: "Services",
      icon: "i-heroicons-cog-6-tooth",
      to: "/company/dashboard/home",
    },
    {
      label: "Subscriptions",
      icon: "i-heroicons-credit-card",
      to: "/company/dashboard/subscriptions",
    },
    {
      label: "Users",
      icon: "i-heroicons-user",
      to: "/company/dashboard/users",
    },
  ],
  //  [{
  //   label: 'Profile',
  //   icon: 'i-heroicons-light-bulb'
  // }, {
  //   label: 'Logout',
  //   icon: 'i-heroicons-question-mark-circle'
  // }]
];
</script>

<template>
  <UHorizontalNavigation
    :links="links"
    class="border-b border-gray-200 dark:border-gray-800"
  />
</template>
