<template>
  <UContainer class="lg:px-6">
    <Transition class="fade-slide">
      <UForm
        v-if="isVisible"
        :schema="schema"
        class="flex flex-col mt-8 gap-6"
        :state="formState"
        @submit="onSubmit"
      >
        <!-- Country -->
        <div>
          <UFormGroup label="Country Name" name="countryName">
            <div class="i-famicons:globe-outline"></div>
            <InputField
              icon=""
              type="text"
              :disabled="true"
              v-model="formState.countryName"
              placeholder="Nigeria"
            >
              <template #leading>
                <img src="../../assets/icons/world.svg" alt="world icon" />
              </template>
            </InputField>
          </UFormGroup>
        </div>

        <!--  Bank Name -->
        <div>
          <UFormGroup label="Bank Name" name="bankName">
            <SelectField
              :options="bankOptions"
              option-attribute="name"
              :disabled="isSubmitting || isResolveAccountLoading"
              v-model="formState.bankCode"
              placeholder="E.g Zenith Bank PLC"
            />
          </UFormGroup>
        </div>
        <!-- show isResolve , show this content-isResolve is false,showPop -->
        <!-- Account Number -->
        <div class="relative">
          <div
            v-if="showPopover"
            class="animate-fade-in absolute w-3/5 right-0 text-[12px] whitespace-nowrap flex bottom-[50px] text-black transition-all translate-y-3 shadow rounded-md border"
          >
            <div
              v-show="!showBankDetails"
              class="flex p-2 gap-5 justify-between w-full items-center"
            >
              <USkeleton class="w-full h-5 rounded" />

              <USkeleton class="h-5 w-5" />
            </div>

            <div
              v-show="showBankDetails && !formState.confirmBankDetails"
              class="p-2 items-center w-full justify-between flex bg-white"
            >
              <p class="font-bold">{{ bankDetails?.accountName }}</p>
              <UCheckbox v-model="formState.confirmBankDetails" />
            </div>
          </div>

          <div>
            <UFormGroup label="Account Number" name="accountNumber">
              <InputField
                type="number"
                :disabled="isSubmitting || isResolveAccountLoading"
                v-model="formState.accountNumber"
                placeholder="e.g 0123345345"
              />
            </UFormGroup>

            <div></div>
          </div>
        </div>

        <!--  Button -->
        <div class="flex justify-between mt-6">
          <BaseButton
            type="submit"
            :disabled="isDisabled"
            :loading="isSubmitting"
            :class="
              isDisabled
                ? 'bg-grey-green cursor-not-allowed'
                : 'bg-primary-green hover:bg-[#0D7F32]'
            "
            >Continue</BaseButton
          >
        </div>
      </UForm>
    </Transition>
  </UContainer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { number, object, string } from "yup";
import { useToast } from "#imports";

const toast = useToast();

const formState = ref({
  bankCode: "",
  accountNumber: "",
  countryName: "Nigeria",
  confirmBankDetails: false,
});
type accountNumber = number | string;

const props = defineProps<{
  isVisible: boolean;
}>();
const emit = defineEmits(["next-step"]);
const bankDetails = ref({});
const isResolveAccountLoading = ref(false);
const bankOptions = ref([{}]);
const showPopover = ref(false);
const isSubmitting = ref(false);
const showBankDetails = ref(false);
const accountNumberSchema = string()
  .matches(/^\d{10}$/, "Account number must be exactly 10 digits")
  .required("Account number is required");
const bankCodeSchema = string().required("Bank is required");
const schema = object({
  bankCode: bankCodeSchema,
  accountNumber: accountNumberSchema,
  countryName: string().required("Country is required"),
});

const isDisabled = computed(() => {
  return (
    !formState.value.bankCode ||
    !formState.value.accountNumber ||
    !formState.value.countryName ||
    !formState.value.confirmBankDetails
  );
});

onMounted(async () => {
  const banksListResponse = await useNuxtApp().$axios.get(
    "/settlement-account/list-banks"
  );
  bankOptions.value = banksListResponse.data;
  const bankDetailsCut = banksListResponse.data.map((bank: unknown) => ({
    name: bank?.name,
    value: bank?.code,
  }));

  bankOptions.value = bankDetailsCut;
});

watchEffect(async () => {
  const accountNumber = formState.value.accountNumber;
  const bankCode = formState.value.bankCode;

  const isAccountNumberValid = await accountNumberSchema.isValid(accountNumber);
  const isBankCodeValid = await bankCodeSchema.isValid(bankCode);
  console.log(isAccountNumberValid, isBankCodeValid);

  if (!isAccountNumberValid || !isBankCodeValid) {
    return;
  }
  isResolveAccountLoading.value = true;
  showPopover.value = true;
  try {
    const bankResolveResponse = await useNuxtApp().$axios.post(
      "/settlement-account/resolve-bank-account",
      {
        bankCode: bankCode,
        accountNumber: accountNumber.toString(),
      }
    );

    bankDetails.value = bankResolveResponse.data;

    showBankDetails.value = true;
  } catch (error) {
    toast.add({
      title: "Error",
      description: error?.response?.data?.message,
      color: "red",
    });
    showPopover.value = false;
  } finally {
    isResolveAccountLoading.value = false;
  }
});
const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    const settlementAccountPayload = {
      bankCode: formState.value.bankCode,
      accountNumber: formState.value.accountNumber.toString(),
    };
    await useNuxtApp().$axios.post(
      "/settlement-account",
      settlementAccountPayload
    );
    toast.add({
      title: "Form Submitted",
      description: "Your settlement account has been created successfully!",
      color: "green",
    });
    emit("next-step");
  } catch (error) {
    toast.add({
      title: "Error",
      description: error?.response?.data?.message,
      color: "red",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped></style>
