<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { handleErrorMessages } from "../../common/errorHandlers";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

// This sets out the layout to use the 'auth' layout
definePageMeta({
  layouts: "auth",
});

const activeUserStore = useActiveUserStore();
const { userType, userDetails } = storeToRefs(activeUserStore);

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
    const response = await useNuxtApp().$axios.post("/company/login", {
      email: state.email,
      password: state.password,
    });
    const accessToken = response.data.accessToken;
    state.email = undefined;
    state.password = undefined;
    localStorage.setItem("accessToken", accessToken);

    userType.value = "company";

    const userDetailsResponse = await useNuxtApp().$axios.get("/company/me");
    userDetails.value = userDetailsResponse.data;
    activeUserStore.setAuthenticationState(true);
    const { posthog } = usePosthog();
    posthog.identifyUser({
      type: "company",
      email: userDetails.value.email,
      full_name: `${userDetails.value.name}`,
    });
    router.push("/dashboard");
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
  <UCard class="w-full max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white mt-12">
    <template #header>
      <h2 class="text-2xl font-semibold text-center text-gray-900">
        Facility Admin Login
      </h2>
    </template>

    <div>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormGroup label="Email" name="email">
          <UInput
            v-model="state.email"
            class="w-full px-0 py-0 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput
            v-model="state.password"
            type="password"
            class="w-full px-0 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </UFormGroup>

        <UButton
          type="submit"
          :loading="pending"
          :disabled="pending"
          block
          class="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Login
        </UButton>
      </UForm>
    </div>

    <template #footer>
      <div class="flex justify-between items-center mt-6">
        <ULink to="/company/signup" class="text-green-500 hover:text-green-700">
          Signup
        </ULink>
        <ULink to="/company/forgot-password" class="text-green-500 hover:text-green-700">
          Forgot Password
        </ULink>
      </div>
    </template>
  </UCard>

  <br />
  <UButton
    to="/"
    class="mt-2 text-green-500 border-2 border-green-500 py-2 px-4 w-32 rounded-md bg-white hover:bg-green-100 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mx-auto block"
  >
    Back to Home
  </UButton>
</template>
