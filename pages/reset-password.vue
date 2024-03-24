<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

const schema = object({
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
  confirmPassword: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  password: undefined,
  confirmPassword: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data);
}
</script>

<template>
  <UCard>
    <template #header> Enter new password </template>
    <div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.confirmPassword" type="password" />
        </UFormGroup>

        <UButton type="submit" block> Submit </UButton>
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
