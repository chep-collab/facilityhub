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
          :loading="loading"
          type="submit"
          :disabled="isDisabled || loading"
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
const loading = ref(false);
const props = defineProps<{
  onSuccess: () => void;
}>();
const emit = defineEmits(["next-step"]);
const formState = ref({
  serviceName: "",
  price: 0,
  period: "",
});

const periodOptions = ["Monthly", "Weekly", "Daily"];
const schema = object({
  serviceName: string().min(
    3,
    "Service name must be at least 3 characters long"
  ),
  price: number().positive("Price must be a positive number"),
  period: string()
    .oneOf(["Monthly", "Weekly", "Daily"], "Invalid period")
    .required("Period is required"),
});
const isDisabled = computed(() => {
  return (
    !formState.value.serviceName ||
    formState.value.price <= 0 ||
    !formState.value.period
  );
});
async function onSubmit() {
  loading.value = true;
  const serviceNamePayload = {
    name: formState.value.serviceName,
  };
  try {
    const response = await useNuxtApp().$axios.post(
      "/company-service",
      serviceNamePayload
    );

    if (response.data) {
      const servicePricePayload = {
        serviceId: response?.data?.id,
        amount: formState.value.price,
        period: formState.value.period.toLocaleLowerCase(),
      };
      const servicePriceResponse = await useNuxtApp().$axios.post(
        "/company-service-price",
        servicePricePayload
      );
    }
    toast.add({
      title: "Form Submitted",
      description: "Your service has been created successfully!",
      color: "green",
    });

    emit("next-step");
  } catch (error) {
    toast.error("Error creating service");
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
