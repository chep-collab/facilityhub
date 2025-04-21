<script setup lang="ts">
const idOfCopiedNumber = ref(0);
const isAccountNumberCopied = ref(false);
const companyServiceStore = useCompanyServiceStore();
const { settlementAccounts } = storeToRefs(companyServiceStore);
const accountsLoading = ref(false);

onMounted(async () => {
  try {
    accountsLoading.value = true;
    await companyServiceStore.fetchCompanySettlementAccounts();
  } catch (err) {
    console.log("Error Loading accounts");
  } finally {
    accountsLoading.value = false;
  }
});

function copyAccountNumber(acctNo: string, id: number) {
  idOfCopiedNumber.value = id;
  navigator.clipboard
    .writeText(acctNo)
    .then(() => {
      isAccountNumberCopied.value = true;
      setTimeout(() => {
        isAccountNumberCopied.value = false;
      }, 1000);
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
}
</script>

<template>
  <div class="overflow-y-auto">
    <div class="flex flex-col gap-6" v-if="settlementAccounts.length > 0">
      <div
        v-for="(item, index) in settlementAccounts"
        :key="index"
        class="space-y-2  border-t pt-4"
      >
        <h3 class="text-lg font-semibold"></h3>
        <p>
          <span class="font-medium">Bank Name:</span>
          {{ item?.bankName || "Opay Bank Limited" }}
        </p>
        <p>
          <span class="font-medium">Account Name:</span>
          {{ item?.accountHolderName || "Jays Facility" }}
        </p>
        <div class="flex items-center gap-2">
          <span class="font-medium">Account Number:</span>
          <span>{{ item?.accountNumber || 123445452 }}</span>
          <UButton
            size="xs"
            variant="soft"
            :icon="
              isAccountNumberCopied && idOfCopiedNumber === item?.id
                ? 'i-heroicons-check'
                : 'i-heroicons-clipboard'
            "
            @click="copyAccountNumber(item?.accountNumber, item?.id)"
            :label="
              isAccountNumberCopied && idOfCopiedNumber === item?.id
                ? 'Copied'
                : 'Copy'
            "
          />
        </div>
      </div>
    </div>

    <div v-else class="min-h-[300px]">Loading Admin Account Details ...</div>
  </div>
</template>
