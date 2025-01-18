<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { handleErrorMessages } from "~/common/errorHandlers";
import { usePasswordResetStore } from '~/stores/usePasswordResetStore'; //imported the store

const {
  posthog: { captureEvent, ALLOWED_EVENT_NAMES },
} = usePosthog();

const schema = object({
  email: string().email("Invalid email").required("Required"),
});

type Schema = InferType<typeof schema>;

  const state = reactive({
  email: "" as string, 
});
const sendingResetPasswordRequest = ref(false);

const toast = useToast();

// Accessingg the store to use the forgotPassword action
const passwordResetStore = usePasswordResetStore();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    sendingResetPasswordRequest.value = true;
    // Call the store's forgotPassword method to handle the request
    const response = await passwordResetStore.forgotPassword(state.email, 'company');
    
    toast.add({
      title:
        response.data.message ||
        "Reset password instructions will be sent to your email address if an account exists with the email you provided.",
      color: "green",
    });

    captureEvent(ALLOWED_EVENT_NAMES.COMPANY_REQUESTED_PASSWORD_RESET, {
      email: state.email,
      user_type: "company",
    });
  } catch (error: any) {
    toast.add({
      title: handleErrorMessages(error),
      color: "red",
    });
    } finally {
    sendingResetPasswordRequest.value = false;
  }
}
</script>

<template>
  <UCard class="w-full max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white mt-12">
    <template #header>
      <h2 class="text-2xl font-semibold text-center text-gray-900">Forgot Password</h2>
    </template>

    <div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <UFormGroup label="Email" name="email">
          <UInput
            v-model="state.email"
            class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </UFormGroup>

        <UButton
          :loading="sendingResetPasswordRequest"
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
        <ULink to="/" class="text-green-500 hover:text-green-700">Back to Home</ULink>
      </div>
    </template>
  </UCard>
</template>
