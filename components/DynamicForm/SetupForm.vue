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
            placeholder="e.g Daily Coworking or Monthly Gym Usage"
          />
        </UFormGroup>
      </div>

      <!-- Service Description -->
      <div>
        <UFormGroup label="Describe your service" name="serviceDescription">
          <UTextarea
            type="text"
            v-model="formState.description"
            placeholder=""
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
  description: ""
});

const periodOptions = ["Monthly", "Weekly", "Daily"];
const schema = object({
  serviceName: string().min(
    3,
    "Service name must be at least 3 characters long"
  ).required(),
  price: number().positive("Price must be a positive number"),
  period: string()
    .oneOf(["Monthly", "Weekly", "Daily"], "Invalid period")
    .required("Period is required"),
  description: string().min(3).required()
});
const isDisabled = computed(() => {
  return (
    !formState.value.serviceName ||
    formState.value.price <= 0 ||
    !formState.value.period
  );
});
const { createNewService } = useCompanyServiceStore();
async function onSubmit() {
  loading.value = true;
  try {
    const response = await createNewService({
      name: formState.value.serviceName,
      amount: formState.value.price,
      period: formState.value.period.toLowerCase(),
      description: formState.value.description
    });
    toast.add({
      title: "Form Submitted",
      description: "Your service has been created successfully!",
      color: "green",
    });

    emit("next-step");
  } catch (error) {
    toast.add({
      color: "red",
      title: "Error",
      description: "Error creating service",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped></style>
