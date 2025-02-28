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
              v-model="formState.bankName"
              :options="bankOptions"
              placeholder="E.g Zenith Bank PLC"
            />
          </UFormGroup>
        </div>

        <!-- Account Number -->
        <div>
          <UFormGroup label="Account Number" name="accountNumber">
            <InputField
              type="number"
              v-model="formState.accountNumber"
              placeholder="e.g 0123345345"
            />
          </UFormGroup>

          <div></div>
        </div>

        <!--  Button -->
        <div class="flex justify-between mt-6">
          <BaseButton
            type="submit"
            :disabled="isDisabled"
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
  bankName: "",
  accountNumber: 0,
  countryName: "",
});
const props = defineProps<{
  isVisible: boolean;
}>();
const emit = defineEmits(["next-step"]);

// Period options
const bankOptions = ["FCMB", "GTB", "ACCESS"];
const schema = object({
  bankName: string(),
  accountNumber: number().min(
    10,
    "Account number cannot be less than 10 digits!"
  ),
  countryName: string().required("Country is required"),
});
const isDisabled = computed(() => {
  return (
    !formState.value.bankName ||
    !formState.value.accountNumber ||
    !formState.value.countryName
  );
});
const onSubmit = async () => {
  emit("next-step");

  toast.add({
    title: "Form Submitted",
    description: "Your service has been created successfully!",
    color: "green",
  });
};
</script>

<style scoped></style>
