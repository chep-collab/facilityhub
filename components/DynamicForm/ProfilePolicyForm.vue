<template>
  <UContainer class="lg:px-6">
    <UForm
      :schema="schema"
      class="flex flex-col mt-8 gap-6"
      :state="formState"
      @submit="onSubmit"
    >
      <!--  Profile Policy select -->
      <div>
        <UFormGroup
          label="Is a profile picture required for users?"
          name="profilePolicy"
        >
          <SelectField
            v-model="formState.profilePolicy"
            :options="policyOptions"
            :disabled="isSubmitting"
            placeholder="Select Policy"
          />
        </UFormGroup>
      </div>

      <!--  Button -->
      <div class="flex justify-between mt-6">
        <BaseButton
          :loading="isSubmitting"
          :disabled="isSubmitting"
          type="submit"
          >Continue</BaseButton
        >
      </div>
    </UForm>
  </UContainer>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { boolean, number, object, string } from "yup";
import { useToast } from "#imports";

const toast = useToast();
const isSubmitting = ref(false);
const formState = ref({
  profilePolicy: true,
});
const emit = defineEmits(["next-step"]);

// Period options
const policyOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];
const schema = object({
  profilePolicy: boolean(),
});
const onSubmit = async () => {
  isSubmitting.value = true;
  try {
    await useNuxtApp().$axios.patch("/company/update", {
      isUserProfilePictureCompulsory: Boolean(formState.value.profilePolicy),
    });
    toast.add({
      title: "Form Submitted",
      description: "Your profile has been updated successfully!",
      color: "green",
    });
    emit("next-step");
  } catch (error) {
    toast({
      title: "Error",
      description: "There was an error submitting the form.",
      color: "red",
    });
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped></style>
