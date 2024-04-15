<script setup lang="ts">
import { object, string, type InferType } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { handleErrorMessages } from "../../common/errorHandlers";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";

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
  <UCard class="w-full md:w-1/2 mx-auto">
    <template #header> Facility Admin Login </template>
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
