<script setup lang="ts">
import { object, string, number, type InferType } from "yup";
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
});

type Schema = InferType<typeof schema>;

const pending = ref(false);
const state = reactive({
  name: undefined,
  email: undefined,
  password: undefined,
  phone: undefined,
  address: undefined,
  avatar: undefined,
});

const handleFileUpload = (file: File) => {
  state.avatar = file;
};

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    pending.value = true;
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("phone", state.phone);
    formData.append("address", state.address);
    formData.append("email", state.email);
    formData.append("password", state.password);
    if (!state.avatar) {
      return toast.add({
        title: "Company image is required",
        color: "amber",
      });
    }
    formData.append("avatar", state.avatar);
    const { data, error } = await useFetch("/company/signup", {
      method: "POST",
      body: formData,
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
</script>

<template>
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
        <UInput
          v-model="state.name"
          placeholder="Enter your facility name"
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </UFormGroup>

      <UFormGroup label="Upload Company Image">
        <ImageUploadInput
          @fileStaged="handleFileUpload"
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </UFormGroup>

      <UFormGroup label="Email Address" name="email">
        <UInput
          v-model="state.email"
          type="email"
          placeholder="example@company.com"
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </UFormGroup>

      <UFormGroup label="Business Address" name="address">
        <UInput
          v-model="state.address"
          placeholder="Enter your business address"
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </UFormGroup>

      <UFormGroup label="Phone Number" name="phone">
        <UInput
          v-model="state.phone"
          type="tel"
          placeholder="Enter your phone number"
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput
          v-model="state.password"
          type="password"
          placeholder="Create a secure password"
          class="w-full px-0 py-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </UFormGroup>

      <UButton
        type="submit"
        :loading="pending"
        :disabled="pending"
        block
        class="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
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
