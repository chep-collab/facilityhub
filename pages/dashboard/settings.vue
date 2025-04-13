<template>
  <div class="">
    <div class="absolute top-0 right-0 left-0 bg-white shadow-lg">
      <div class="w-[70%] mx-auto mt-4 flex flex-col">
        <h1 class="text-grey-medium font-bold text-xl mb-4">Settings</h1>

        <custom-tabs
          :items="tabsItemToShow"
          v-model="selectedTab"
          color="blue"
        />
      </div>
    </div>

    <!--  -->
    <div class="w-[70%] py-6 mt-[100px] mx-auto">
      <SettingsUserOrCompanyInformation v-show="selectedTab === 'user-data'" />
      <SettingsProfilePolicies v-show="selectedTab === 'policies'" />
      <SettingsAccountSettlement
        v-show="selectedTab === 'settlement-account'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { type TabsItem } from "~/types/component";
const { getUserType } = useActiveUserStore();
const companyTabsItems: TabsItem[] = [
  {
    label: "Company Information",
    icon: "i-heroicons-user",
    value: "user-data",
  },
  {
    label: "Policies",
    icon: "i-heroicons-pencil-square",
    value: "policies",
  },
  {
    label: "Settlement Account",
    icon: "i-heroicons-banknotes",
    value: "settlement-account",
  },
];

const userTabsItems: TabsItem[] = [
  {
    label: "User Information",
    icon: "i-heroicons-user",
    value: "user-data",
  },
];

const tabsItemToShow =
  getUserType === "company" ? companyTabsItems : userTabsItems;
const selectedTab = ref<string>(tabsItemToShow[0].value);
</script>

<style scoped></style>
