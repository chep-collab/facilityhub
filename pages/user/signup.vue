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
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  phone: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data);
}
</script>

<template>
  <UCard>
    <template #header> User Signup </template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="First Name" name="text">
        <UInput v-model="state.firstName" />
      </UFormGroup>

      <UFormGroup label="Last Name" name="text">
        <UInput v-model="state.lastName" />
      </UFormGroup>

      <UFormGroup label="Email" name="email">
        <UInput v-model="state.email" />
      </UFormGroup>

      <UFormGroup label="Phone number" name="phone">
        <UInput v-model="state.phone" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit" block> Signup </UButton>
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
