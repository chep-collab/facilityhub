<template>
<UCard class="w-full max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white mt-12">
<template #header>
<h2 class="text-2xl font-semibold text-center text-gray-900">Change Password</h2>
</template>
<div>
<UForm
:schema="schema"
:state="state"
class="space-y-6"
@submit="onSubmit"
>
<UFormGroup label="Old Password" name="oldPassword">
<UInput
v-model="state.oldPassword"
type="password"
class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
</UFormGroup>
<UFormGroup label="New Password" name="newpassword">
<UInput
v-model="state.newPassword"
type="password"
class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
</UFormGroup>
<UFormGroup label="Confirm Password" name="confirmPassword">
<UInput
v-model="state.confirmPassword"
type="password"
class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
</UFormGroup>
  
<UButton
type="submit"
block
class="w-full bg-primary text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary">
Submit
</UButton>
</UForm>
</div>
  
      <template #footer>
        <div class="flex justify-center mt-6">
          <ULink to="/" class="text-primary hover:text-primary-dark">
            Back to Home
          </ULink>
        </div>
      </template>
    </UCard>
  </template>
  
  <script setup lang="ts">
  import { object, string, type InferType } from "yup";
  import { usePasswordResetStore } from "~/stores/usePasswordResetStore"; // Import the store
  import type { FormSubmitEvent } from "#ui/types";
  import { handleErrorMessages } from "~/common/errorHandlers";
  import { reactive } from "vue"; 
  
  const schema = object({
  oldPassword: string()
    .min(8, "Must be at least 8 characters")
    .required("Old password is required"),
  password: string()
    .min(8, "Must be at least 8 characters")
    .required("New password is required"),
  confirmPassword: string()
    .min(8, "Must be at least 8 characters")
    .required("Confirm password is required"),
}).test('passwords-match', 'New passwords must match', function(value) {
  return value?.password === value?.confirmPassword;
});

  
  type Schema = InferType<typeof schema>;
  
  const route = useRoute();
  const token = route.query.token as string;
  
  if (!token) {
    console.error("Token is missing in the URL query parameters.");
  }
  
  const toast = useToast();
  const router = useRouter();
  const passwordResetStore = usePasswordResetStore(); // Access the store
  
  // Initialize state with reactive
  const state = reactive({
  oldPassword: "",  // Add this field
  password: "",
  confirmPassword: "",
  email: "",  
});

  
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      passwordResetStore.resettingPassword = true; // Set state to true when resetting starts
  
      await passwordResetStore.resetPassword(state.oldPassword, state.password, state.confirmPassword);
  
      toast.add({
        title: "Your password has been successfully reset.",
        color: "green",
      });
  
      router.push("/user/login");
    } catch (error: any) {
      toast.add({
        title: handleErrorMessages(error) || "An error occurred. Please try again.",
        color: "red",
      });
    } finally {
      passwordResetStore.resettingPassword = false; // Reset state after request
    }
  }
  </script>
  