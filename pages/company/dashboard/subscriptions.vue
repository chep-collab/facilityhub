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
    key: "fullName",
    label: "Full Name",
  },
  {
    key: "service",
    label: "Service",
  },
  {
    key: "amount",
    label: "Amount",
  },
  {
    key: "status",
    label: "Status",
  },
  {
    key: "receiptUrl",
    label: "Reciept",
  },
  {
    key: "startDate",
    label: "Start Date",
  },
  {
    key: "endDate",
    label: "End Date",
  },
];

const services = [
  {
    id: 1,
    fullName: "Daniel Sumah",
    service: "Daily Workspace",
    amount: 2000,
    status: "inactive",
    receiptUrl:
      "https://firebasestorage.googleapis.com/v0/b/workspace-6cc0b.appspot.com/o/subscription-receipts%2Freceipt-deji-mailinator-com-2024-03-23-t-09-23-21-711-z?alt=media&token=214cb807-85a7-4519-b0bf-59802802eb24",
    startDate: "2024-03-22 15:58:39.247",
    endDate: "2024-03-22 15:58:39.247",
  },
  {
    id: 2,
    fullName: "Daniel Sumah",
    service: "Daily Workspace",
    amount: 2000,
    status: "inactive",
    receiptUrl:
      "https://firebasestorage.googleapis.com/v0/b/workspace-6cc0b.appspot.com/o/subscription-receipts%2Freceipt-deji-mailinator-com-2024-03-23-t-09-23-21-711-z?alt=media&token=214cb807-85a7-4519-b0bf-59802802eb24",
    startDate: "2024-03-22 15:58:39.247",
    endDate: "2024-03-22 15:58:39.247",
  },
  {
    id: 3,
    fullName: "Daniel Sumah",
    service: "Daily Workspace",
    amount: 2000,
    status: "inactive",
    receiptUrl:
      "https://firebasestorage.googleapis.com/v0/b/workspace-6cc0b.appspot.com/o/subscription-receipts%2Freceipt-deji-mailinator-com-2024-03-23-t-09-23-21-711-z?alt=media&token=214cb807-85a7-4519-b0bf-59802802eb24",
    startDate: "2024-03-22 15:58:39.247",
    endDate: "2024-03-22 15:58:39.247",
  },
  {
    id: 4,
    fullName: "Daniel Sumah",
    service: "Daily Workspace",
    amount: 2000,
    status: "inactive",
    receiptUrl:
      "https://firebasestorage.googleapis.com/v0/b/workspace-6cc0b.appspot.com/o/subscription-receipts%2Freceipt-deji-mailinator-com-2024-03-23-t-09-23-21-711-z?alt=media&token=214cb807-85a7-4519-b0bf-59802802eb24",
    startDate: "2024-03-22 15:58:39.247",
    endDate: "2024-03-22 15:58:39.247",
  },
  {
    id: 5,
    fullName: "Daniel Sumah",
    service: "Daily Workspace",
    amount: 2000,
    status: "inactive",
    receiptUrl:
      "https://firebasestorage.googleapis.com/v0/b/workspace-6cc0b.appspot.com/o/subscription-receipts%2Freceipt-deji-mailinator-com-2024-03-23-t-09-23-21-711-z?alt=media&token=214cb807-85a7-4519-b0bf-59802802eb24",
    startDate: "2024-03-22 15:58:39.247",
    endDate: "2024-03-22 15:58:39.247",
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
