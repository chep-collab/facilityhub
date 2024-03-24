<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";

const schema = object({
  email: string().email("Invalid email").required("Required"),
});

type Schema = InferType<typeof schema>;

const state = reactive({
  email: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  // Do something with event.data
  console.log(event.data);
}
</script>

<template>
  <UCard>
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
