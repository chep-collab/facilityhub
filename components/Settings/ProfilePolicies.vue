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
        <form class="flex flex-col mt-8 gap-6" @submit.prevent="onPolicySubmit">
          <div class="flex w-full gap-5">
            <!-- Profile Policy -->
            <div class="w-full">
              <UFormGroup label="Selected Profile Policy" name="profilePolicy">
                <div class="i-famicons:globe-outline"></div>
                <SelectField
                  v-model="profilePolicy"
                  :options="policyOptions"
                  :disabled="isPolicySubmitting"
                  placeholder="Select Policy"
                />
              </UFormGroup>
            </div>

            <!--  Application Policy-->
            <div class="w-full">
              <UFormGroup
                label="Selected Application Policy"
                name="applicationPolicy"
              >
                <SelectField
                  v-model="applicationPolicy"
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
              :disabled="isCompanyPolicyUnchanged"
              :loading="isPolicySubmitting"
              :class="
                isCompanyPolicyUnchanged
                  ? 'bg-grey-green cursor-not-allowed'
                  : 'bg-primary-green hover:bg-[#0D7F32]'
              "
              >Submit</BaseButton
            >
          </div>
        </form>
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { object, boolean } from "yup";
import { type formState } from "~/types/component";

const isPolicySubmitting = ref(false);
const toast = useToast();
const store = useActiveUserStore();
const { fetchUserDetails } = store;
const { userDetails } = storeToRefs(store);
const { isUserProfilePictureCompulsory, isApplicationRequiredToUseFacility } =
  userDetails.value;
const companyServiceStore = useCompanyServiceStore();
const policyOptions = [
  { label: "Yes", value: true },
  { label: "No", value: false },
];
const profilePolicy = ref(userDetails.value.isUserProfilePictureCompulsory);
const applicationPolicy = ref(
  userDetails.value.isApplicationRequiredToUseFacility
);

const isCompanyPolicyUnchanged = computed(() => {
  return (
    isUserProfilePictureCompulsory == profilePolicy.value &&
    isApplicationRequiredToUseFacility == applicationPolicy.value
  );
});
function convertToBoolean(value: string): boolean {
  return value === "true";
}
async function onPolicySubmit() {
  isPolicySubmitting.value = true;
  const payload = {
    isUserProfilePictureCompulsory: convertToBoolean(profilePolicy.value),
    isApplicationRequiredToUseFacility: convertToBoolean(
      applicationPolicy.value
    ),
  };
  const updateProfilePoliciesResponse =
    await companyServiceStore.updateCompanyProfile(payload);
  const result = updateProfilePoliciesResponse.result;

  if (result === "success") {
    await fetchUserDetails("company");
    isPolicySubmitting.value = false;
    toast.add({
      title: "Policies Updated",
      color: "green",
      description: "Profile policies updated successfully",
    });
  } else {
    toast.add({ description: "Error updating profile policies" });
  }

  isPolicySubmitting.value = false;
}
</script>

<style scoped></style>
