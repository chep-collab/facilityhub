<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

const schema = object({
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data);
}
</script>

<template>
  <UCard>
    <template #header> Admin Login </template>
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

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UButton type="submit" block> Login </UButton>
      </UForm>
    </div>
    <template #footer>
      <div class="flex flex-row justify-around gap-8">
        <ULink to="/company/signup">Signup</ULink>
        <ULink to="/forgot-password">Forgot Password</ULink>
      </div>
    </template>
  </UCard>
  <br />
  <ULink to="/">Home</ULink>
</template>
