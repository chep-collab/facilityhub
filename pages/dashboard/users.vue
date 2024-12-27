<script setup lang="ts">
const workspaceUserStore = useWorkspaceUserStore();
const { getFetchingWorkspaceUserState, getWorkspaceUsers } =
  storeToRefs(workspaceUserStore);
  const { getUserType } = useActiveUserStore();

import { storeToRefs } from "pinia";

const isInvitationModalOpen = ref(false);

const route = useRoute();
const openInviteForm = route.query.openInviteForm as string;
if(openInviteForm == "yes"){
  isInvitationModalOpen.value = true
}

const openUserInvitationModal = () => {
  isInvitationModalOpen.value = true
}

const closeUserInvitationModal = () => {
  isInvitationModalOpen.value = false
}
definePageMeta({
  layout: "dashboard-layout",
});

const columns = [
  {
    key: "index",
    label: "ID",
  },
  {
    key: "fullName",
    label: "Full Name",
  },
  {
    key: "email",
    label: "Email",
  },
  {
    key: "phone",
    label: "Phone Number",
  },
];

const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return getWorkspaceUsers.value;
  }

  return getWorkspaceUsers.value.filter((user) => {
    return Object.values(user).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
await workspaceUserStore.fetchWorkspaceUsers();
</script>

<template>
  <div>
    <div>
      <div
        class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Search users..." />
        <div>
          <UButton
            v-if="getUserType === 'company'"
            icon="i-heroicons-plus"
            size="sm"
            color="blue"
            variant="ghost"
            label="Invite Users"
            :trailing="false"
            @click="openUserInvitationModal"
          />
        </div>
      </div>
      <UTable
        :loading="getFetchingWorkspaceUserState"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No user has joined your facility.',
        }"
        :rows="filteredRows"
        :columns="columns"
      >
        <template #index-data="{ row, index }">
          <span>{{ index + 1 }} </span>
        </template>
        <template #fullName-data="{ row }">
          <span>{{ row.firstName }} {{ row.lastName }}</span>
        </template>
      </UTable>
    </div>

    <UserInvitationModal
      v-if="isInvitationModalOpen"
      :is-open="isInvitationModalOpen"
      @close="closeUserInvitationModal"
    />
  </div>
</template>
