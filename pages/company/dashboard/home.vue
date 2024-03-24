<template>
  <div>
    <div>
      <div
        class="flex justify-between px-3 py-3.5 border-b border-gray-200 dark:border-gray-700"
      >
        <UInput v-model="q" placeholder="Filter services..." />
        <div>
          <UButton
            icon="i-heroicons-plus"
            size="sm"
            color="blue"
            variant="ghost"
            label="Add"
            :trailing="false"
          />

          <UButton
            icon="i-heroicons-pencil-square"
            size="sm"
            color="blue"
            variant="ghost"
            label="Edit"
            :trailing="false"
          />

          <UButton
            icon="i-heroicons-trash"
            size="sm"
            color="red"
            variant="ghost"
            label="Delete"
            :trailing="false"
          />
        </div>
      </div>

      <UTable
        v-model="selected"
        :empty-state="{
          icon: 'i-heroicons-circle-stack-20-solid',
          label: 'No items.',
        }"
        :rows="filteredRows"
        :columns="columns"
        @select="selected"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
});

const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "services",
    label: "Services",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "period",
    label: "Period",
  },
];

const services = [
  {
    id: 1,
    services: "Daily workspace",
    description: "Use the workspace from 9-5 for 1 day",
    status: "active",
    amount: 2000,
    period: "daily",
  },
  {
    id: 2,
    services: "Daily workspace",
    description: "Use the workspace from 9-5 for 1 day",
    status: "active",
    amount: 2000,
    period: "daily",
  },
  {
    id: 3,
    services: "Daily workspace",
    description: "Use the workspace from 9-5 for 1 day",
    status: "active",
    amount: 2000,
    period: "daily",
  },
  {
    id: 4,
    services: "Daily workspace",
    description: "Use the workspace from 9-5 for 1 day",
    status: "active",
    amount: 2000,
    period: "daily",
  },
  {
    id: 5,
    services: "Daily workspace",
    description: "Use the workspace from 9-5 for 1 day",
    status: "active",
    amount: 2000,
    period: "daily",
  },
];
const selected = ref([services[1]]);

const q = ref("");

const filteredRows = computed(() => {
  if (!q.value) {
    return services;
  }

  return services.filter((person) => {
    return Object.values(person).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});
</script>
