<template>
  <div class="flex min-w-full w-full pb-6">
    <UCard
      :ui="{
        base: 'card w-full px-[18px] pt-4 pb-[23px]',
        body: 'px-4 py-4',
      }"
    >
      <p
        class="text-[18px] font-semibold text-grey-stepper pb-2 border-[#E5E5EF] border-b"
      >
        Settlement Account
      </p>

      <div class="form-container">
        <UForm
          :schema="settlementSchema"
          class="flex flex-col mt-8 gap-6"
          :state="settlementState"
          @submit="onSettlementSubmit"
        >
          <!-- Grid Layout -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Country -->
            <UFormGroup label="Country" name="country">
              <InputField
                class="text-black"
                disabled
                value="Nigeria"
                type="text"
              />
            </UFormGroup>

            <!-- Bank Name -->
            <UFormGroup label="Bank Name" name="bankName">
              <InputField
                v-model="settlementState.bankCode"
                type="text"
                :disabled="isSettlementSubmitting"
                placeholder="Enter Bank Name"
              />
            </UFormGroup>

            <!-- Account Number -->
            <UFormGroup label="Account Number" name="accountNumber">
              <InputField
                v-model="settlementState.accountNumber"
                type="text"
                :disabled="isSettlementSubmitting"
                placeholder="Enter Account Number"
              />
            </UFormGroup>

            <!-- Account Name -->
            <UFormGroup label="Account Name" name="accountName">
              <InputField
                disabled
                v-model="accountName"
                type="text"
                placeholder="Account Name"
              />
            </UFormGroup>
          </div>

          <!-- Submit Button -->
          <div class="flex md:w-1/3 self-end justify-between">
            <BaseButton
              type="submit"
              :disabled="getFormDisabledStatus(settlementState)"
              :loading="isSettlementSubmitting"
              :class="
                getFormDisabledStatus(settlementState)
                  ? 'bg-grey-green cursor-not-allowed'
                  : 'bg-primary-green hover:bg-[#0D7F32]'
              "
            >
              Submit
            </BaseButton>
          </div>
        </UForm>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import { type formState } from "~/types/component";

const isSettlementSubmitting = ref(false);
const toast = useToast();
const companyServiceStore = useCompanyServiceStore();
const accountName = ref("");
const settlementState = ref({
  bankCode: "",
  accountNumber: "",
  countryName: "Nigeria",
});

const accountNumberSchema = string()
  .matches(/^\d{10}$/, "Account number must be exactly 10 digits")
  .required("Account number is required");
const bankCodeSchema = string().required("Bank is required");
const settlementSchema = object({
  bankCode: bankCodeSchema,
  accountNumber: accountNumberSchema,
  countryName: string().required("Country is required"),
});

function getFormDisabledStatus(state: formState) {
  if (Array.isArray(state)) {
    return state.length === 0;
  }
  const status = computed(() =>
    Object.values(state).some((value) => {
      return value === "" || value === null || value === undefined;
    })
  );
  return status.value;
}

async function onSettlementSubmit() {
  isSettlementSubmitting.value = true;
  const payload = { ...settlementState.value };

  const updateResponse = await companyServiceStore.updateCompanyProfile(
    payload
  );

  const result = updateResponse.result;

  if (result === "success") {
    isSettlementSubmitting.value = false;
    toast.add({
      title: "Settlement Info Updated",
      color: "green",
      description: "Settlement account updated successfully",
    });
  } else {
    toast.add({ description: "Error updating settlement account" });
    isSettlementSubmitting.value = false;
  }
}
</script>

<style scoped></style>
