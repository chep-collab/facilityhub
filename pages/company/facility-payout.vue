<template>
  <UCard class="w-full max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white mt-12">
    <template #header>
      <h2 class="text-2xl font-semibold text-center text-gray-900">Facility Admin Payout</h2>
      <p class="text-center text-md text-gray-500">
        Allows users to see the account details to pay when subscribing to your facility
      </p>
    </template>
    <div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <p class="text-sm text-gray-500">Provide settlement account*</p>
        <UFormGroup label="Country" name="country">
          <UInput
            v-model="state.country"
            type="text"
            placeholder="Nigeria"
            class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </UFormGroup>

        <UFormGroup label="Bank Name" name="bankName">
          <UInput
            v-model="state.bankName"
            type="text"
            placeholder="E.g Zenith Bank Plc"
            class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </UFormGroup>

        <UFormGroup label="Account Number" name="accountNumber">
          <UInput
            v-model="state.accountNumber"
            type="text"
            placeholder="E.g 0718273633"
            class="w-full px-0 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
  country: string().required("Country is required"),
  bankName: string().required("Bank Name is required"),
  accountNumber: string().required("Account Number is required"),
});

type Schema = InferType<typeof schema>;

const router = useRouter();
const activeUserStore = useActiveUserStore();

const state = reactive({
  country: "",
  bankName: "",
  accountNumber: "",
});

async function onSubmit() {
  try {
    const response = await axios.post("/company/facility-payout", {
      country: state.country,
      bankName: state.bankName,
      accountNumber: state.accountNumber,
    });

    if (response.data.status) {
      router.push("/company/facility-payout");
    }
  } catch (error) {
    console.error("An error occurred during facility setup:", error);
  }
}


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
