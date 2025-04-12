<template>
  <div class="flex pb-6 flex-col gap-6">
    <UCard
      :ui="{
        base: 'card px-[18px] pt-4 pb-[23px] ',
        body: 'px-4 py-4',
      }"
    >
      <p
        class="text-[18px] font-semibold text-grey-stepper pb-2 border-[#E5E5EF] border-b"
      >
        {{ fieldLabel }} Information
      </p>

      <div class="flex items-center mt-3 gap-3">
        <div>
          <img src="/userimg.png" alt="" />
        </div>

        <UButton
          class="bg-transparent border text-black"
          :ui="{ base: 'w-fit' }"
          @click="$emit('edit')"
        >
          Change
        </UButton>
      </div>
      <!--  -->
      <div class="form-container">
        <UForm
          :schema="userOrCompanyDataSchema"
          class="flex flex-col mt-8 gap-6"
          :state="userOrCompanyDataState"
          @submit="onUserOrCompanyDataSubmit"
        >
          <div class="flex w-full gap-5">
            <!-- Name -->
            <div class="w-full">
              <UFormGroup label="Name" name="Name">
                <div class="i-famicons:globe-outline"></div>
                <InputField
                  icon=""
                  type="text"
                  :disabled="isUserDataSubmitting"
                  v-model="userOrCompanyDataState.name"
                  :placeholder="`${fieldLabel} Name`"
                >
                </InputField>
              </UFormGroup>
            </div>

            <!--  Email-->
            <div class="w-full">
              <UFormGroup label="Email" name="email">
                <InputField
                  type="email"
                  :disabled="isUserDataSubmitting"
                  v-model="userOrCompanyDataState.email"
                  placeholder="e.g admin@example.com"
                />
              </UFormGroup>
            </div>
          </div>

          <!--  Button -->
          <div class="flex md:w-1/3 self-end justify-between">
            <BaseButton
              type="submit"
              :disabled="getFormDisabledStatus(userOrCompanyDataState)"
              :loading="isUserDataSubmitting"
              :class="
                isUserOrCompanyDataDisabled
                  ? 'bg-grey-green cursor-not-allowed'
                  : 'bg-primary-green hover:bg-[#0D7F32]'
              "
              >Submit</BaseButton
            >
          </div>
        </UForm>
      </div>
    </UCard>

    <UCard
      :ui="{
        base: 'card px-[18px] pt-4 pb-[23px]',
        body: 'px-4 py-4',
      }"
    >
      <p
        class="text-[18px] font-semibold text-grey-stepper pb-2 border-[#E5E5EF] border-b"
      >
        Enter Password
      </p>

      <div class="form-container">
        <UForm
          :schema="passwordSchema"
          class="flex flex-col mt-8 gap-6"
          :state="passwordState"
          @submit="onPasswordSubmit"
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            <!-- Old Password -->
            <UFormGroup
              class="col-span-1"
              label="Old Password"
              name="oldPassword"
            >
              <InputField
                type="password"
                :disabled="isPasswordSubmitting"
                v-model="passwordState.oldPassword"
                placeholder="Enter old password"
              />
            </UFormGroup>

            <!-- New Password -->
            <UFormGroup
              class="col-span-1"
              label="New Password"
              name="newPassword"
            >
              <InputField
                type="password"
                :disabled="isPasswordSubmitting"
                v-model="passwordState.newPassword"
                placeholder="Enter new password"
              />
            </UFormGroup>

            <!-- Confirm Password -->
            <UFormGroup
              class="col-span-1"
              label="Confirm Password"
              name="confirmPassword"
            >
              <InputField
                type="password"
                :disabled="isPasswordSubmitting"
                v-model="passwordState.confirmPassword"
                placeholder="Confirm new password"
              />
            </UFormGroup>
          </div>

          <!-- Submit Button -->
          <div class="flex md:w-1/3 self-end justify-between">
            <BaseButton
              type="submit"
              :disabled="getFormDisabledStatus(passwordState)"
              :loading="isPasswordSubmitting"
              :class="
                isPasswordSubmitDisabled
                  ? 'bg-grey-green cursor-not-allowed'
                  : 'bg-primary-green hover:bg-[#0D7F32]'
              "
            >
              Submit
            </BaseButton>
          </div>
        </UForm>
      </div>
    </UCard>

    <UCard
      v-if="getUserType === 'company'"
      :ui="{
        base: 'card px-[18px] pt-4 pb-[23px]',
        body: 'px-4 py-4',
      }"
    >
      <p
        class="text-[18px] font-semibold text-grey-stepper pb-2 border-[#E5E5EF] border-b"
      >
        Facility Amenities
      </p>

      <UForm @submit="submitAmenitiesForm" :state="amenities">
        <div class="grid grid-cols-2 mt-8 gap-8">
          <div
            v-show="isAmenitiesLoading"
            :key="index"
            v-for="(_, index) in 8"
            class="w-full flex gap-2"
          >
            <USkeleton class="h-5 w-8" />
            <USkeleton class="h-5 w-4/5" />
          </div>

          <label
            v-show="!isAmenitiesLoading"
            v-for="item in amenities"
            :key="item.id"
            class="flex items-center w-full space-x-2 cursor-pointer"
          >
            <UCheckbox
              input-class="w-6 h-6"
              v-model="selectedIds"
              :value="item.id"
            />
            <span class="text-gray-800">{{ item.label }}</span>
          </label>
        </div>
        <!-- Submit Button -->
        <div class="flex w-full mt-6 justify-end">
          <BaseButton
            type="submit"
            :disabled="getFormDisabledStatus(selectedIds)"
            :loading="isAmenitiesSubmitting"
            class="md:max-w-[33%]"
            :class="
              getFormDisabledStatus(selectedIds)
                ? 'bg-grey-green cursor-not-allowed'
                : 'bg-primary-green hover:bg-[#0D7F32]'
            "
            >Continue</BaseButton
          >
        </div>
      </UForm>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { object, string } from "yup";
import { type formState } from "~/types/component";

const { getUserType } = useActiveUserStore();
const fieldLabel = getUserType === "company" ? "Company" : "Personal";
const isUserDataSubmitting = ref(false);
const isPasswordSubmitting = ref(false);
const isUserOrCompanyDataDisabled = computed(() => {
  return (
    !userOrCompanyDataState.value.name || !userOrCompanyDataState.value.email
  );
});
const userOrCompanyDataState = ref({
  name: "",
  email: "",
});
const toast = useToast();
const amenities = ref([]);
const selectedIds = ref([]);
const isAmenitiesLoading = ref(true);
const isAmenitiesSubmitting = ref(false);

const passwordState = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const userOrCompanyDataSchema = object({
  name: string().required("Name is required"),
  email: string().email("Email is invalid").required("Email is required"),
});
const passwordSchema = object({
  oldPassword: string().required("Old password is required"),
  newPassword: string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters"),
  confirmPassword: string()
    .required("Confirm password is required")
    .oneOf([passwordState.value.newPassword], "Passwords must match"),
});
const isPasswordSubmitDisabled = computed(() => {
  return (
    !passwordState.value.oldPassword ||
    !passwordState.value.newPassword ||
    !passwordState.value.confirmPassword
  );
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

function onUserOrCompanyDataSubmit() {
  console.log("user data is submitted");

  isUserDataSubmitting.value = true;
  // Simulate an API call
  setTimeout(() => {
    isUserDataSubmitting.value = false;
    // Emit the updated data to the parent component
  }, 2000);
}
function onPasswordSubmit() {
  isPasswordSubmitting.value = true;
  // Simulate an API call
  setTimeout(() => {
    isPasswordSubmitting.value = false;
    // Emit the updated data to the parent component
  }, 2000);
}

function onSubmitAmenitiesForm() {
  isAmenitiesSubmitting.value = true;
  // Simulate an API call
  setTimeout(() => {
    isAmenitiesSubmitting.value = false;
    // Emit the updated data to the parent component
  }, 2000);
}
</script>

<style scoped></style>
