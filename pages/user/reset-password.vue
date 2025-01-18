<script setup lang="ts">
import { object, string, type InferType } from "yup";
import { usePasswordResetStore } from "~/stores/usePasswordResetStore"; 
import type { FormSubmitEvent } from "#ui/types";
import { handleErrorMessages } from "~/common/errorHandlers";
import { reactive } from "vue"; 

const {
  posthog: { captureEvent, ALLOWED_EVENT_NAMES },
} = usePosthog();

const schema = object({
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
  confirmPassword: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});

type Schema = InferType<typeof schema>;

const route = useRoute();
const token = route.query.token as string;

if (!token) {
  console.error("Token is missing in the URL query parameters.");
}

const toast = useToast();
const router = useRouter();
const passwordResetStore = usePasswordResetStore(); 

const state = reactive({
  password: "",
  confirmPassword: "",
  email: "",  
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    passwordResetStore.resettingPassword = true; // Set state to true when resetting starts

    // Call the store's resetPassword method
    await passwordResetStore.resetPassword(state.email, 'company');

    toast.add({
      title: "Your password has been successfully reset.",
      color: "green",
    });

    captureEvent(ALLOWED_EVENT_NAMES.USER_CHANGED_PASSWORD, {
      email: state.email,
      user_type: "company",
    });

    router.push("/company/login");
  } catch (error: any) {
    toast.add({
      title: handleErrorMessages(error) || "An error occurred. Please try again.",
      color: "red",
    });
  } finally {
    passwordResetStore.resettingPassword = false; 
  }
}
</script>

<template>
  <UCard class="w-full max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white mt-12">
    <template #header>
      <h2 class="text-2xl font-semibold text-center text-gray-900">Enter New Password</h2>
    </template>

    <div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormGroup label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </UFormGroup>

        <UFormGroup label="Confirm Password" name="confirmPassword">
          <UInput
            v-model="state.confirmPassword"
            type="password"
            class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </UFormGroup>

        <UButton
          type="submit"
          block
          class="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Submit
        </UButton>
      </UForm>
    </div>

    <template #footer>
      <div class="flex justify-center mt-6">
        <ULink to="/" class="text-green-500 hover:text-green-700">
          Back to Home
        </ULink>
      </div>
    </template>
  </UCard>
</template>
