<template>
  <UContainer class="lg:px-6"  >
    <UForm
      :schema="schema"
      class="flex flex-col mt-8 gap-6"
      :state="formState"
      @submit="onSubmit"
    >
      <!--  Profile Policy select -->
      <div>
        <UFormGroup
          label="Is a profile picture required for staff?"
          name="bankName"
        >
          <SelectField
            v-model="formState.profilePolicy"
            :options="policyOptions"
            placeholder="Select Policy"
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

const formState = ref({
  profilePolicy: "",
});
const emit = defineEmits(["next-step"]);

// Period options
const policyOptions = ["Lorem ipsum", "Ipsum Lorem"];
const schema = object({
  bankName: string(),
});
const isDisabled = computed(() => {
  return !formState.value.profilePolicy;
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
