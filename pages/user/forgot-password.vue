<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { handleErrorMessages } from "~/common/errorHandlers";
const {
  posthog: { captureEvent, ALLOWED_EVENT_NAMES },
} = usePosthog();

const schema = object({
  email: string().email("Invalid email").required("Required"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  email: undefined,
});
const sendingResetPasswordRequest = ref(false);

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    sendingResetPasswordRequest.value = true;
     // This sends the POST request to the user reset password endpoint
     const response = await useNuxtApp().$axios.post("/user/forgot-password", {
      email: state.email,
    });
    // This shows the message from the backend and or a fallback message
    toast.add({
      title:
        response.data.message ||
        "Reset password instructions will be sent to your email address if an account exists with the email you provided.",
      color: "green",
    });
    captureEvent(ALLOWED_EVENT_NAMES.REQUESTED_PASSWORD_RESET, {});
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
