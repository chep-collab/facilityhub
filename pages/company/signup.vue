<script setup lang="ts">
import { object, string, number, type InferType, boolean } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { handleErrorMessages } from "../../common/errorHandlers";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const router = useRouter();

const schema = object({
  name: string().required().min(2, "Name must be at least 2 characters"),
  phone: number().required("Phone number is required"),
  address: string().required("Address is required").min(5, "Address is too short"),
  email: string().email("Invalid email").required("Email is required"),
  password: string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  isRegistered: boolean().required("Company registration status must be provided"),
  registrationNumber: string(),
  facilityTypeId: string().required("Select your facility type")
});

type Schema = InferType<typeof schema>;

const pending = ref(false);
const state = reactive({
  name: undefined,
  email: undefined,
  password: undefined,
  phone: undefined,
  address: undefined,
  isRegistered: false,
  registrationNumber: undefined,
  facilityTypeId: undefined
});

const fetchingActiveFacilityTypes = ref(false);
const activeFacilityTypes = ref([])
const selectableFacilityTypeNames = ref([])

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    pending.value = true;
    const { data, error } = await useFetch("/company/signup", {
      method: "POST",
      body: {
        name: state.name,
        email: state.email,
        password: state.password,
        phone: state.phone,
        address: state.address,
        isRegistered: state.isRegistered,
        registrationNumber: state.registrationNumber,
        facilityTypesIds: state.facilityTypeId ? [state.facilityTypeId] : []
      },
      baseURL: runtimeConfig.public.apiUrl,
    });
    if (error.value) throw error.value.data.message;
    toast.add({
      title: "Account successfully created! Redirecting to login...",
    });
    setTimeout(() => {
      router.push("/company/login");
    }, 1500);
  } catch (error: any) {
    if (error) {
      toast.add({
        title: handleErrorMessages(error),
        color: "red",
      });
    }
  } finally {
    pending.value = false;
  }
}

async function getActiveFacilityTypes() {
  try {
    fetchingActiveFacilityTypes.value = true;
    const response = await useNuxtApp().$axios.get("/facility-types");
    activeFacilityTypes.value = response.data
    selectableFacilityTypeNames.value = activeFacilityTypes.value.map(ft => `${ft.name} - ${ft.description}`)
    console.log({selectableFacilityTypeNames})
  } catch (error: any) {
    if (error) {
      toast.add({
        title: handleErrorMessages(error),
        color: "red",
      });
    }
  } finally {
    fetchingActiveFacilityTypes.value = false;
  }
}

getActiveFacilityTypes()

</script>

<template>
  <UAlert
    :actions="[{ variant: 'outline', label: 'Click here to signup', click: () => navigateTo('/user/signup') }]"
    title="Are you a facility user?"
    class="w-full max-w-md mx-auto p-4 rounded-xl bg-white mt-12"
  />
  <UCard class="w-full max-w-lg mx-auto p-8 rounded-xl shadow-xl bg-white mt-5">
    <template #header>
      <h2 class="text-2xl font-bold text-center text-gray-800">
        Facility Admin Signup
      </h2>
      <p class="text-center text-gray-600 mt-1 text-0.5xl">
        Create an account to manage your facility
      </p>
    </template>

    <UForm :schema="schema" :state="state" class="space-y-6 mt-1" @submit="onSubmit">
      <UFormGroup label="Company/Facility Name" name="name">
        <UInput v-model="state.name" placeholder="Enter your facility name"
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      </UFormGroup>

      <UCheckbox v-model="state.isRegistered" name="isRegistered" label="My company is registered" />

      <UFormGroup v-if="state.isRegistered" label="Registration Number (This can be used to validate your company)"
        name="registrationNumber">
        <UInput v-model="state.registrationNumber" placeholder=""
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      </UFormGroup>

      <UFormGroup label="Select facility Type" name="facilityTypeId">
          <USelect :loading="fetchingActiveFacilityTypes" icon="i-heroicons-magnifying-glass-20-solid" color="white" size="sm"
          v-model="state.facilityTypeId" :options="activeFacilityTypes" option-attribute="name" value-attribute="id" placeholder="Search..." />
      </UFormGroup>

      <UFormGroup label="Email Address" name="email">
        <UInput v-model="state.email" type="email" placeholder="example@company.com"
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      </UFormGroup>

      <UFormGroup label="Business Address" name="address">
        <UInput v-model="state.address" placeholder="Enter your business address"
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      </UFormGroup>

      <UFormGroup label="Phone Number" name="phone">
        <UInput v-model="state.phone" type="tel" placeholder="Enter your phone number"
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" placeholder="Create a secure password"
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" />
      </UFormGroup>

      <UButton type="submit" :loading="pending" :disabled="pending" block
        class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
        Signup
      </UButton>
    </UForm>

    <template #footer>
      <div class="flex justify-between items-center mt-3 text-1xl">
        <ULink to="/company/login" class="text-green-500 hover:text-green-700">
          Already have an account? Login
        </ULink>
        <ULink to="/" class="text-green-500 hover:text-green-700 text-1xl">Back to Home</ULink>
      </div>
    </template>
  </UCard>
</template>
