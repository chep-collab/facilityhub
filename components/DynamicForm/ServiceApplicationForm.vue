<template>
  <Transition name="fade-slide">
    <UContainer class="lg:px-6">
      <UForm
        :schema="schema"
        class="flex flex-col mt-8 gap-6"
        :state="formState"
        @submit="onSubmit"
      >
        <!--  Application Policy select -->
        <div>
          <UFormGroup label="" name="servicePolicy">
            <SelectField
              v-model="formState.servicePolicy"
              :options="policyOptions"
            />
          </UFormGroup>
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
    </UContainer>
  </Transition>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { boolean, number, object, string } from "yup";
import { useToast } from "#imports";

const toast = useToast();
const isSubmitting = ref(false);
const formState = ref({
  servicePolicy: false,
});
const emit = defineEmits(["setup-success"]);
const companyServiceStore = useCompanyServiceStore();
const policyOptions = [
  {
    label: "No, Users can subscribe to my services without approval",
    value: false,
  },
  {
    label: "Yes, I must approve users before they can subscribe to my services",
    value: true,
  },
];
const schema = object({
  servicePolicy: boolean(),
});
const isDisabled = computed(() => {
  return false;
});
const onSubmit = async () => {
  isSubmitting.value = true;

  const response = await companyServiceStore.updateCompanyProfile({
    isApplicationRequiredToUseFacility: Boolean(formState.value.servicePolicy),
  });
  const result = response.result;
  if (result === "success") {
    toast.add({
      title: "Application Policy Updated",
      description: "You have been onboarded successfully!",
      color: "green",
    });
    isSubmitting.value = false;
    emit("setup-success");
  } else {
    toast.add({
      color: "red",
      description: "Error getting facility amenities",
    });
  }
};
</script>

<style></style>
