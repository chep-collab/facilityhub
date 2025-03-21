<script setup lang="ts">
const workspaceUserStore = useWorkspaceUserStore();
const { getFetchingWorkspaceUserState, getWorkspaceUsers } =
  storeToRefs(workspaceUserStore);
const { setSelectedUserId, fetchWorkspaceUsers } = workspaceUserStore;

const { getUserType } = useActiveUserStore();

import { storeToRefs } from "pinia";

const isInvitationModalOpen = ref(false);

const route = useRoute();
const openInviteForm = route.query.openInviteForm as string;
if (openInviteForm == "yes") {
  isInvitationModalOpen.value = true;
}

const openUserInvitationModal = () => {
  isInvitationModalOpen.value = true;
};

const closeUserInvitationModal = () => {
  isInvitationModalOpen.value = false;
};

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
  const filteredWorkSpaceUserData = getWorkspaceUsers.value.map((item) => {
    const { firstName, lastName, email, phone, id: userId } = item;
    return { firstName, lastName, email, phone, userId };
  });
  if (!q.value) {
    return filteredWorkSpaceUserData;
  }

  return filteredWorkSpaceUserData.filter((user) => {
    return Object.values(user).some((value) => {
      return String(value).toLowerCase()?.includes(q.value.toLowerCase());
    });
  });
});
await fetchWorkspaceUsers();

function onSelect(row: any, e?: Event) {
  const { firstName, userId, lastName } = row;

  navigateTo(
    `/dashboard/users/${firstName.toLowerCase()}_${lastName.toLowerCase()}`
  );
}
</script>

<template>
  <div>
    <div
      class="flex flex-col sm:flex-row sm:justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
    >
      <UInput v-model="q" placeholder="Search users..." class="mb-3 sm:mb-0" />
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

    <!-- Table Section -->
    <div class="overflow-x-auto">
      <UTable
        @select="onSelect"
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

    <!-- User Invitation Modal -->
    <UserInvitationModal
      v-if="isInvitationModalOpen"
      :is-open="isInvitationModalOpen"
      @close="closeUserInvitationModal"
    />
  </div>
</template>
