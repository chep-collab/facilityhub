<script setup lang="ts">
const idOfCopiedNumber = ref(0);
const isAccountNumberCopied = ref(false);
const companyServiceStore = useCompanyServiceStore();
const { settlementAccounts } = storeToRefs(companyServiceStore);
const accountsLoading = ref(false);
const toast = useToast();
const props = defineProps<{
  companyId: string;
}>();

onMounted(async () => {
  accountsLoading.value = true;
  const response = await companyServiceStore.fetchCompanySettlementAccount(
    props.companyId
  );

  if (response.result !== "success") {
    toast.add({
      color: "red",
      description: response.data,
      title: "Error",
    });
    console.log("Error Loading accounts");
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
    <div class="flex flex-col gap-6 mb-4" v-if="settlementAccounts.length > 0">
      <div
        :key="index"
        v-for="(item, index) in settlementAccounts"
        class="space-y-1 border-t pt-2 text-sm"
      >
        <p>
          <span class="font-base">Bank Name:</span>
          {{ item?.bankName }}
        </p>
        <p>
          <span class="font-base">Account Name:</span>
          {{ item?.accountHolderName }}
        </p>
        <div class="flex items-center gap-2">
          <span class="font-base">Account Number:</span>
          <span>{{ item?.accountNumber }}</span>
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

    <div v-else class="min-h-[300px]">Subscription payment details not found</div>
  </div>
</template>
