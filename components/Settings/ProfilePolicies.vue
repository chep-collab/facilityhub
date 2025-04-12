<template>
  <div class="flex min-w-full w-full pb-6">
    <UCard
      :ui="{
        base: 'card w-full px-[18px] pt-4 pb-[23px] ',
        body: 'px-4 py-4',
      }"
    >
      <p
        class="text-[18px] font-semibold text-grey-stepper pb-2 border-[#E5E5EF] border-b"
      >
        Policies
      </p>
      <!--  -->
      <div class="form-container">
        <UForm
          :schema="policySchema"
          class="flex flex-col mt-8 gap-6"
          :state="policyState"
          @submit="onPolicySubmit"
        >
          <div class="flex w-full gap-5">
            <!-- Profile Policy -->
            <div class="w-full">
              <UFormGroup label="Selected Profile Policy" name="profilePolicy">
                <div class="i-famicons:globe-outline"></div>
                <SelectField
                  v-model="policyState.profilePolicy"
                  :options="policyOptions"
                  :disabled="isPolicySubmitting"
                  placeholder="Select Policy"
                />
              </UFormGroup>
            </div>

            <!--  Email-->
            <div class="w-full">
              <UFormGroup
                label="Selected Application Policy"
                name="applicationPolicy"
              >
                <SelectField
                  v-model="policyState.applicationPolicy"
                  :options="policyOptions"
                  :disabled="isPolicySubmitting"
                  placeholder="Select Policy"
                />
              </UFormGroup>
            </div>
          </div>

          <!--  Button -->
          <div class="flex md:w-1/3 self-end justify-between">
            <BaseButton
              type="submit"
              :disabled="getFormDisabledStatus(policyState)"
              :loading="isPolicySubmitting"
              :class="
                getFormDisabledStatus(policyState)
                  ? 'bg-grey-green cursor-not-allowed'
                  : 'bg-primary-green hover:bg-[#0D7F32]'
              "
              >Submit</BaseButton
            >
          </div>
        </UForm>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { object, boolean } from "yup";
import { type formState } from "~/types/component";

const isPolicySubmitting = ref(false);
const toast = useToast();
const companyServiceStore = useCompanyServiceStore();
const policySchema = object({
  profilePolicy: boolean(),
  applicationPolicy: boolean(),
});
const policyOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];

const policyState = ref({
  profilePolicy: true,
  applicationPolicy: true,
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

async function onPolicySubmit() {
  isPolicySubmitting.value = true;
  const { profilePolicy, applicationPolicy } = policyState.value;
  const payload = {
    profilePolicy: profilePolicy,
    applicationPolicy: applicationPolicy,
  };
  const updateProfilePoliciesResponse =
    await companyServiceStore.updateCompanyProfile(payload);
  const result = updateProfilePoliciesResponse.result;

  if (result === "success") {
    isPolicySubmitting.value = false;
    toast.add({
      title: "Policies Updated",
      color: "green",
      description: "Profile policies updated successfully",
    });
  } else {
    toast.add({ description: "Error updating profile policies" }); 
  }
}
</script>

<style scoped></style>
