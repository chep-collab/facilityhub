<template>
  <UContainer class="lg:px-6">
    <UForm
      :schema="schema"
      class="flex flex-col mt-8 gap-6"
      :state="formState"
      @submit="onSubmit"
    >
      <!-- Service Name -->
      <div>
        <UFormGroup label="Service Name" name="serviceName">
          <InputField
            type="text"
            v-model="formState.serviceName"
            placeholder="E.g Shared workplace"
          />
        </UFormGroup>
      </div>

      <!--  Pricing Information -->
      <div>
        <UFormGroup label="Price" name="price">
          <InputField
            type="number"
            v-model="formState.price"
            placeholder="Enter price"
          />
        </UFormGroup>
      </div>

      <!-- Period -->
      <div>
        <UFormGroup label="Billing Period" name="period">
          <SelectField
            v-model="formState.period"
            :options="periodOptions"
            placeholder="Select period"
          />
        </UFormGroup>
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
  </UContainer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { number, object, string } from "yup";
import { useToast } from "#imports";

const toast = useToast();

const props = defineProps<{
  onSuccess: () => void;
}>();
const emit = defineEmits(["next-step"]);
const formState = ref({
  serviceName: "",
  price: 0,
  period: "",
});

const periodOptions = ["Monthly", "Quarterly", "Yearly"];
const schema = object({
  serviceName: string().min(
    3,
    "Service name must be at least 3 characters long"
  ),
  price: number().positive("Price must be a positive number"),
  period: string()
    .oneOf(["Monthly", "Quarterly", "Yearly"], "Invalid period")
    .required("Period is required"),
});
const isDisabled = computed(() => {
  

  return (
    !formState.value.serviceName ||
    formState.value.price <= 0 ||
    !formState.value.period
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
