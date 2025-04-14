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
        <div class="flex items-center mt-3 gap-3">
          <!-- Profile Image -->
          <div
            class="w-16 h-16 rounded-full overflow-hidden cursor-pointer border"
            @click="triggerFileSelect"
          >
            <img
              :src="previewImage || '/userimg.png'"
              alt="Profile Picture"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Change Button -->
          <UButton
            class="bg-transparent border border-[#E5E5EF] text-black hover:text-white"
            :ui="{ base: 'w-fit' }"
            @click="triggerFileSelect"
          >
            Change
          </UButton>

          <!-- Hidden File Input -->
          <input
            type="file"
            accept="image/*"
            ref="fileInput"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
      </div>
      <!--  -->
      <div class="form-container">
        <form class="flex flex-col mt-8 gap-6">
          <div class="flex w-full gap-5">
            <!-- Name -->
            <div class="w-full">
              <UFormGroup label="Name" name="Name">
                <div class="i-famicons:globe-outline"></div>
                <InputField
                  icon=""
                  type="text"
                  :value="userDetails?.name"
                  disabled
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
                  disabled
                  :value="userDetails?.email"
                  placeholder="e.g admin@example.com"
                />
              </UFormGroup>
            </div>
          </div>
        </form>
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
        Change Password
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
                :disabled="isPasswordSubmitting"
                v-model="passwordState.oldPassword"
                autocomplete
                placeholder="Enter old password"
                :type="showOldPassword ? 'text' : 'password'"
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="
                      showOldPassword
                        ? 'i-heroicons-eye-slash'
                        : 'i-heroicons-eye'
                    "
                    :aria-label="
                      showOldPassword ? 'Hide password' : 'Show password'
                    "
                    :aria-pressed="showOldPassword"
                    aria-controls="password"
                    @click="showOldPassword = !showOldPassword"
                  />
                </template>
              </InputField>
            </UFormGroup>

            <!-- New Password -->
            <UFormGroup
              class="col-span-1"
              label="New Password"
              name="newPassword"
            >
              <InputField
                :type="showNewPassword ? 'text' : 'password'"
                :disabled="isPasswordSubmitting"
                v-model="passwordState.newPassword"
                autocomplete
                placeholder="Enter new password"
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="
                      showNewPassword
                        ? 'i-heroicons-eye-slash'
                        : 'i-heroicons-eye'
                    "
                    :aria-label="
                      showNewPassword ? 'Hide password' : 'Show password'
                    "
                    :aria-pressed="showNewPassword"
                    aria-controls="password"
                    @click="showNewPassword = !showNewPassword"
                  />
                </template>
              </InputField>
            </UFormGroup>

            <!-- Confirm Password -->
            <UFormGroup
              class="col-span-1"
              label="Confirm Password"
              name="confirmPassword"
            >
              <InputField
                :type="showConfirmPassword ? 'text' : 'password'"
                :disabled="isPasswordSubmitting"
                v-model="passwordState.confirmPassword"
                placeholder="Confirm new password"
                autocomplete
                :ui="{ icon: { trailing: { pointer: '' } } }"
              >
                <template #trailing>
                  <UButton
                    color="neutral"
                    variant="link"
                    size="sm"
                    :icon="
                      showConfirmPassword
                        ? 'i-heroicons-eye-slash'
                        : 'i-heroicons-eye'
                    "
                    :aria-label="
                      showConfirmPassword ? 'Hide password' : 'Show password'
                    "
                    :aria-pressed="showConfirmPassword"
                    aria-controls="password"
                    @click="showConfirmPassword = !showConfirmPassword"
                  />
                </template>
              </InputField>
            </UFormGroup>
          </div>

          <!-- Submit Button -->
          <div class="flex md:w-1/3 self-end justify-between">
            <BaseButton
              type="submit"
              :disabled="getFormDisabledStatus(passwordState) || !isFormValid"
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

      <UForm @submit="onSubmitAmenitiesForm" :state="amenities">
        <div class="grid grid-cols-2 mt-8 gap-8">
          <div
            v-if="isAmenitiesLoading"
            :key="index"
            v-for="(_, index) in 8"
            class="w-full flex gap-2"
          >
            <USkeleton class="h-5 w-8" />
            <USkeleton class="h-5 w-4/5" />
          </div>

          <label
            v-else
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
            :disabled="
              getFormDisabledStatus(selectedIds) || isAmenitiesUnchanged
            "
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
import { storeToRefs } from "pinia";
const { getUserType, changeUserPassword } = useActiveUserStore();
const companyServiceStore = useCompanyServiceStore();
const { userDetails } = storeToRefs(useActiveUserStore());
const { fetchMyCompanyAmenities, AddMyCompanyAmenities } = companyServiceStore;
const fieldLabel = getUserType === "company" ? "Company" : "Personal";
const isUserDataSubmitting = ref(false);
const isPasswordSubmitting = ref(false);

const toast = useToast();
const amenities = ref([]);
const selectedIds = ref([]);
const baseSelectedIds = ref([]);
const isAmenitiesLoading = ref(true);
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);
const isAmenitiesSubmitting = ref(false);
const fileInput = ref(null);
const previewImage = ref(null); // base64 or blob URL

const passwordState = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const isAmenitiesUnchanged = computed(() => {
  return (
    baseSelectedIds.value?.length === selectedIds.value?.length &&
    baseSelectedIds.value?.every((id) => selectedIds.value?.includes(id))
  );
});
const confirmPasswordSchema = string().required("Confirm password is required");

const passwordSchema = object({
  oldPassword: string()
    .required("Old password is required")
    .min(8, "Password must be at least 8 characters"),
  newPassword: string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    ),
  confirmPassword: confirmPasswordSchema,
}).test("passwords-match", "Passwords must match", function (value) {
  return value?.newPassword === value?.confirmPassword;
});
const isPasswordSubmitDisabled = computed(() => {
  return (
    !passwordState.value.oldPassword ||
    !passwordState.value.newPassword ||
    !passwordState.value.confirmPassword
  );
});
// i want the submit btn disabled until the form has been interacted with ? or an update has been made  ?
// the forms have been interacted with
onMounted(async () => {
  const amenitiesResponse = await companyServiceStore.fetchFacilityAmenities();
  const result = amenitiesResponse.result;

  if (result === "success") {
    amenities.value = amenitiesResponse.data?.map((item: unknown) => ({
      id: item?.id,
      label: item?.name,
    }));

    const myCompanyAmenitiesResponse = await fetchMyCompanyAmenities();
    const myCompanyAmenitiesResult = myCompanyAmenitiesResponse.result;
    // the company amenities are fetched after by facility amenities are gotten
    if (myCompanyAmenitiesResult === "success") {
      const ids = myCompanyAmenitiesResponse.data?.map(
        (item: unknown) => item?.id
      );
      // base ids to compare with the selected ids
      baseSelectedIds.value = ids;
      selectedIds.value = ids;
    } else {
      toast.add({
        color: "red",
        description: "Error getting company amenities",
      });
    }

    isAmenitiesLoading.value = false;
  } else {
    toast.add({
      color: "red",
      description: "Error getting facility amenities",
    });
  }
});

const isFormValid = ref(false);

watchEffect(async () => {
  try {
    await passwordSchema.validate(passwordState.value, { abortEarly: false });
    isFormValid.value = true;
  } catch {
    isFormValid.value = false;
  }

  console.log("Form Valid:", isFormValid.value);
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

function resetPasswordFormState() {
  passwordState.value = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
}

async function onPasswordSubmit() {
  isPasswordSubmitting.value = true;
  const response = await changeUserPassword(
    {
      oldPassword: passwordState.value.oldPassword,
      newPassword: passwordState.value.newPassword,
    },
    getUserType
  );
  if (response.result === "success") {
    toast.add({
      title: "Password Updated",
      color: "green",
      description: "Password updated successfully",
    });
    resetPasswordFormState();
  } else {
    toast.add({ color: "red", description: response.data });
  }
  setTimeout(() => {
    isPasswordSubmitting.value = false;
  }, 2000);
}

async function onSubmitAmenitiesForm() {
  isAmenitiesSubmitting.value = true;

  const response = await AddMyCompanyAmenities({
    amenityIds: selectedIds.value,
  });
  if (response.result === "success") {
    toast.add({
      title: "Amenities Updated",
      color: "green",
      description: "Amenities updated successfully",
    });
  } else {
    toast.add({ color: "red", description: response.data });
  }

  setTimeout(() => {
    isAmenitiesSubmitting.value = false;
  }, 2000);
}

function triggerFileSelect() {
  fileInput.value?.click();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      previewImage.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
</script>

<style scoped></style>
