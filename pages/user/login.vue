<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { handleErrorMessages } from "../../common/errorHandlers";
import { useRouter } from "vue-router";

const router = useRouter();
const toast = useToast();

const schema = object({
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});

type Schema = InferType<typeof schema>;

const pending = ref(false);
const state = reactive({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    pending.value = true;
    const { data, error } = await useFetch("/user/login", {
      method: "POST",
      body: { email: state.email, password: state.password },
      baseURL: "http://localhost:5000",
    });
    if (error.value) throw error.value.data.message;
    state.email = undefined;
    state.password = undefined;
    localStorage.setItem("accessToken", data.value.accessToken);
    router.push("/user/dashboard/home");
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
  <UCard>
    <template #header> User Login</template>
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

        <UButton type="submit" block>
          {{ pending ? "Loding" : "Submit" }}
        </UButton>
      </UForm>
    </div>
    <template #footer>
      <div class="flex flex-row justify-around gap-8">
        <ULink to="/user/signup">Signup</ULink>
        <ULink to="/forgot-password">Forgot Password</ULink>
      </div>
    </template>
  </UCard>
  <br />
  <ULink to="/">Home</ULink>
</template>
