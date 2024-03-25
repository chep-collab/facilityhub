<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { handleErrorMessages } from "../../common/errorHandlers";
import { useRouter } from "vue-router";

const activeUser = useActiveUser();
const runtimeConfig = useRuntimeConfig();

const router = useRouter();
const toast = useToast();

const schema = object({
  email: string().email("Invalid email").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
});

const pending = ref(false);

type Schema = InferType<typeof schema>;

const state = reactive({
  email: undefined,
  password: undefined,
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    pending.value = true;

    //login
    const { data, error } = await useFetch("/company/login", {
      method: "POST",
      body: { email: state.email, password: state.password },
      baseURL: runtimeConfig.public.apiUrl,
    });
    if (error.value) throw error.value.data.message;
    state.email = undefined;
    state.password = undefined;
    localStorage.setItem("accessToken", data.value.accessToken);

    activeUser.value = "company";

    //fetch user data
    const { data: dataWithDetails, error: detailsError } = await useFetch(
      "/company/me",
      {
        baseURL: runtimeConfig.public.apiUrl,
        onRequest({ request, options }) {
          options.headers = options.headers || {};
          options.headers.authorization = "Bearer " + data.value.accessToken;
        },
      }
    );

    if (detailsError.value) throw detailsError.value.data.message;

    router.push("/company/dashboard/home");
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

        <UButton type="submit" :loading="pending" :disabled="pending" block>
          Login
        </UButton>
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
