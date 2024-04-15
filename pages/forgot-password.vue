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
    const response = await useNuxtApp().$axios.post("/user/forgot-password", {
      email: state.email,
    });
    toast.add({
      title: response.data.message || "Please, check your mail",
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
  <UCard class="w-full md:w-1/2 mx-auto">
    <template #header> Forgot password </template>
    <div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" />
        </UFormGroup>

        <UButton :loading="sendingResetPasswordRequest" type="submit" block>
          Submit
        </UButton>
      </UForm>
    </div>
    <template #footer>
      <div class="flex flex-row justify-around gap-8">
        <ULink to="/">Home</ULink>
      </div>
    </template>
  </UCard>
  <br />
</template>
