<script setup lang="ts">
import { object, string, number, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { handleErrorMessages } from "../../common/errorHandlers";

const runtimeConfig = useRuntimeConfig();
const toast = useToast();
const router = useRouter();

const schema = object({
  name: string().required().min(2),
  phone: number().required(),
  address: string().required().min(2),
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
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

const handleFileUpload = (file) => {
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
        title: handleErrorMessages("Company image is required"),
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
      title: "Company account created. You will be taken to login",
    });
    const { posthog } = usePosthog();
    posthog.captureEvent(posthog.ALLOWED_EVENT_NAMES.SIGNUP, {
      user_type: "company",
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
  <UCard class="w-full md:w-1/2 mx-auto">
    <template #header> Sign up your facility </template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Company/Facility name" name="name">
        <UInput v-model="state.name" />
      </UFormGroup>

      <ImageUploadInput
        @fileStaged="handleFileUpload"
        :label="`Upload Company Image`"
      />

      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Address" name="address">
        <UInput v-model="state.address" />
      </UFormGroup>

      <UFormGroup label="Phone number" name="phone">
        <UInput v-model="state.phone" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton :loading="pending" :disabled="pending" type="submit" block>
        Signup
      </UButton>
    </UForm>
    <template #footer>
      <div class="flex flex-row justify-around gap-8">
        <ULink to="/company/login">Login</ULink>
      </div>
    </template>
  </UCard>
  <br />
  <ULink to="/">Home</ULink>
</template>
