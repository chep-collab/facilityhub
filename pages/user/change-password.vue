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
          <UFormGroup label="New Password" name="newPassword">
            <UInput
              v-model="state.newPassword"
              type="password"
              class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </UFormGroup>
          <UFormGroup label="Confirm Password" name="confirmPassword">
            <UInput
              v-model="state.confirmPassword"
              type="password"
              class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </UFormGroup>
          <UButton
            type="submit"
            block
            class="w-full bg-primary text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-primary"
          >
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
  import { useRouter } from "vue-router";
  import type { FormSubmitEvent } from "#ui/types";
  import { handleErrorMessages } from "~/common/errorHandlers";
  import { reactive } from "vue";
  import axios from "axios";
  

  
  const schema = object({
    oldPassword: string()
      .min(8, "Must be at least 8 characters")
      .required("Old password is required"),
    newPassword: string()
      .min(8, "Must be at least 8 characters")
      .required("New password is required"),
    confirmPassword: string()
      .min(8, "Must be at least 8 characters")
      .required("Confirm password is required"),
  }).test("passwords-match", "Passwords must match", function (value) {
    return value?.newPassword === value?.confirmPassword;
  });
  
  type Schema = InferType<typeof schema>;
  
  const router = useRouter();
  const toast = useToast();
  
  const state = reactive({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  
  
  async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
      // POST request to user change password endpoint
      const response = await axios.post("/user/change-password", {
        oldPassword: state.oldPassword,
        newPassword: state.newPassword,
        confirmPassword: state.confirmPassword,
      },);
  
      if (response.data.status) {
        toast.add({
          title: "Password updated successfully.",
          color: "green",
        });
        router.push("/user/login");
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || handleErrorMessages(error);
      toast.add({
        title: errorMessage || "An error occurred. Please try again.",
        color: "red",
      });
    }
  }
  </script>
  