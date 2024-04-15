<script setup lang="ts">
import { object, string, type InferType, number } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { handleErrorMessages } from "../../common/errorHandlers";
const runtimeConfig = useRuntimeConfig();

const toast = useToast();
const router = useRouter();
const schema = object({
  firstName: string().required().min(2),
  lastName: string().required().min(2),
  phone: number().required(),
  email: string().email("This is compulsory").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  phone: undefined,
  password: undefined,
});
const pending = ref(false);
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    pending.value = true;
    const { data, error } = await useFetch("/user/signup", {
      method: "POST",
      body: {
        firstName: state.firstName,
        lastName: state.lastName,
        phone: state.phone,
        email: state.email,
        password: state.password,
      },
      baseURL: runtimeConfig.public.apiUrl,
    });
    if (error.value) throw error.value.data.message;
    toast.add({
      title: "Account created. You will be taken to login",
    });
    const { posthog } = usePosthog();
    posthog.captureEvent(posthog.ALLOWED_EVENT_NAMES.SIGNUP, {
      user_type: "user",
    });
    setTimeout(() => {
      router.push("/user/login");
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
    <template #header> User Signup </template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="First Name" name="firstName">
        <UInput v-model="state.firstName" />
      </UFormGroup>

      <UFormGroup label="Last Name" name="lastName">
        <UInput v-model="state.lastName" />
      </UFormGroup>

      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Phone number" name="phone">
        <UInput v-model="state.phone" type="phone" />
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
        <ULink to="/user/login">Login</ULink>
      </div>
    </template>
  </UCard>
  <br />
  <ULink to="/">Home</ULink>
</template>
