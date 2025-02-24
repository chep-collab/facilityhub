<template>
  <UCard class="font-inter w-full max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white mt-12">
    <template #header>
      <h2 class="text-2xl font-semibold text-center text-gray-900">Facility Admin Setup</h2>
      <p class="text-center text-md text-gray-500">Complete setup to manage your facility</p>
    </template>
    <div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <p class="text-sm text-gray-500">Add at least one service*</p>
        <UFormGroup label="Service Name" name="serviceName">
          <UInput
            v-model="state.serviceName"
            type="text"
            placeholder="E.g Shared workspace"
            class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </UFormGroup>

        <UFormGroup label="Pricing Information" name="pricingInformation">
          <UInput
            v-model="state.pricingInformation"
            type="text"
            placeholder="E.g ₦15,000"
            class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </UFormGroup>

        <UFormGroup label="Period" name="period">
          <select
            v-model="state.period"
            class="w-full text-sm px-0 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 border-2 border-gray-300"
          >
            <option value="" disabled>E.g daily, weekly</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </UFormGroup>

        <UButton
          type="submit"
          block
          class="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Continue
        </UButton>
      </UForm>
    </div>
    <template #footer>
  <div class="flex justify-end mt-6">
    <ULink
      to="/"
      class="bg-red-400 text-white px-5 py-2 rounded hover:bg-red-600"
      @click.prevent="logout"
    >
      Log Out
    </ULink>
  </div>
</template>
  </UCard>
</template>

<script setup lang="ts">
import { object, string, type InferType } from "yup";
import { useRouter } from "vue-router";
import { reactive } from "vue";
import axios from "axios";

const schema = object({
  serviceName: string().required("Service name is required"),
  pricingInformation: string().required("Pricing information is required"),
  period: string().required("Period is required"),
});

type Schema = InferType<typeof schema>;

const router = useRouter();
const activeUserStore = useActiveUserStore();

const state = reactive({
  serviceName: "",
  pricingInformation: "",
  period: "",
});

/*async function onSubmit() {
  try {
    const response = await axios.post("/company/facility-setup", {
      serviceName: state.serviceName,
      pricingInformation: state.pricingInformation,
      period: state.period,
    });

    if (response.data.status) {
      router.push("/company/facilities");
    } else {
      alert("Failed to complete the setup. Please try again.");
    }
  } catch (error) {
    console.error("An error occurred during facility setup:", error);
    alert("An unexpected error occurred. Please try again later.");
  }
}*/

  // Logout function
  const logout = () => {
    localStorage.clear();
    activeUserStore.setAuthenticationState(false);
    if (userType.value === "company") {
      router.push({ name: "company-login" });
    } else {
      router.push({ name: "user-login" });
    }
  };
</script>
