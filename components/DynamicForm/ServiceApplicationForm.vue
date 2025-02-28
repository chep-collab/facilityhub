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
          <UFormGroup
            label="Is approval required before users can start using the facility?"
            name="servicePolicy"
          >
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
import { number, object, string } from "yup";
import { useToast } from "#imports";

const toast = useToast();

const formState = ref({
  servicePolicy: "",
});
const emit = defineEmits(["setup-success"]);

const policyOptions = ["Yes", "No"];
const schema = object({
  servicePolicy: string(),
});
const isDisabled = computed(() => {
  return !formState.value.servicePolicy;
});
const onSubmit = async () => {
  emit("setup-success");
  toast.add({
    title: "Form Submitted",
    description: "Your service has been created successfully!",
    color: "green",
  });
};
</script>

<style>
</style>
