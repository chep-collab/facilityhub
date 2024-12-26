<script setup lang="ts">
import { object, string, type InferType, number } from "yup";
import type { FormSubmitEvent } from "#ui/types";
import { handleErrorMessages } from "../../common/errorHandlers";
const runtimeConfig = useRuntimeConfig();

const toast = useToast();
const router = useRouter();
const schema = object({
  firstName: string().required().min(2),
  lastName: string().required().min(2),
  phone: number().required(),
  email: string().email("This is compulsory").required("Required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("Required"),
  companyInvitationCode : string().optional()
});

type Schema = InferType<typeof schema>;

const state = reactive({
  firstName: undefined,
  lastName: undefined,
  email: undefined,
  phone: undefined,
  password: undefined,
  companyInvitationCode: ""
});
const pending = ref(false);
const fetchingCompanyName = ref(false)
async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    pending.value = true;
    const { data, error } = await useFetch("/user/signup", {
      method: "POST",
      body: {
        firstName: state.firstName,
        lastName: state.lastName,
        phone: state.phone,
        email: state.email,
        password: state.password,
        companyInvitationCode: state.companyInvitationCode
      },
      baseURL: runtimeConfig.public.apiUrl,
    });
    if (error.value) throw error.value.data.message;
    toast.add({
      title: "Account created. You will be taken to login",
    });
    const { posthog } = usePosthog();
    posthog.captureEvent(posthog.ALLOWED_EVENT_NAMES.SIGNUP, {
      user_type: "user",
    });
    setTimeout(() => {
      router.push("/user/login");
    }, 1500);
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

const invitingCompanyName = ref("")

async function getCompanyNameViaInvitationCode(invitationCode: string) {
  try {
    fetchingCompanyName.value = true;
    const response = await useNuxtApp().$axios.get(`/company/get-name/${invitationCode}`);
    invitingCompanyName.value = response.data.name
  } catch (error: any) {
    if (error) {
      toast.add({
        title: handleErrorMessages(error),
        color: "red",
      });
    }
  } finally {
    fetchingCompanyName.value = false;
  }
}

const route = useRoute();
const invitationCode = route.query.invitationCode as string;
if(invitationCode){
  state.companyInvitationCode = invitationCode
  getCompanyNameViaInvitationCode(invitationCode)
}
</script>

<template>
  <UCard class="w-full max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white mt-12">
    <template #header>
      <h2 class="text-2xl font-semibold text-center text-gray-900">{{ invitationCode ? `Signup to join ${invitingCompanyName} and use their services.` : `Facility User Sign up`}}</h2>
    </template>
    <div>
      <UForm :schema="schema" :state="state" class="space-y-6" @submit="onSubmit">
        <UFormGroup label="First Name" name="firstName">
          <UInput v-model="state.firstName" class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
        </UFormGroup>

        <UFormGroup label="Last Name" name="lastName">
          <UInput v-model="state.lastName" class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
        </UFormGroup>

        <UFormGroup label="Email" name="email">
          <UInput v-model="state.email" class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
        </UFormGroup>

        <UFormGroup label="Phone Number" name="phone">
          <UInput v-model="state.phone" type="phone" class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
        </UFormGroup>

        <UFormGroup label="Password" name="password">
          <UInput v-model="state.password" type="password" class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" />
        </UFormGroup>

        <UButton :loading="pending" :disabled="pending" type="submit" block class="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500">
          {{ pending ? "Loading" : "Signup" }}
        </UButton>
      </UForm>
    </div>

    <template #footer>
      <div class="flex justify-between mt-6">
        <ULink to="/user/login" class="text-green-500 hover:text-green-700">Login</ULink>
      </div>
    </template>
  </UCard>

  <br />
  <ULink to="/" class="text-green-500 hover:text-green-700 mx-auto block text-center">Home</ULink>
</template>
