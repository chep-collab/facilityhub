<template>
  <UCard class="w-full max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white mt-12">
    <template #header>
      <h2 class="text-2xl font-semibold text-center text-gray-900">Facility Admin Profile Policy</h2>
      <p class="text-center text-md text-gray-500">
        Should users of your facility provide a profile picture when joining your facility?
      </p>
    </template>
    <div>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-6"
        @submit="onSubmit"
      >
        <p class="text-sm text-gray-500">Set profile picture policy*</p>
        <UFormGroup label="Is a profile picture required for staff?" name="selectYourPolicy">
          <br>
          <select
            v-model="state.selectYourPolicy"
            class="w-full text-sm px-0 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 border-2 border-gray-300"
          >
            <option value="">Select your policy</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </UFormGroup>
        <UButton
          type="submit"
          block
          class="w-full bg-green-500 text-white py-3 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Continue
        </UButton>
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
      </UForm>
    </div>
    
  </UCard>
</template>

<script setup lang="ts">
import { object, string, type InferType } from "yup";
import { useRouter } from "vue-router";
import { reactive } from "vue";
import axios from 'axios';

const schema = object({
  selectYourPolicy: string().required("Policy selection is required"),
});

type Schema = InferType<typeof schema>;

const router = useRouter();
const activeUserStore = useActiveUserStore();

const state = reactive({
  selectYourPolicy: "",
});

/*async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const response = await axios.post('/company/facility-profile-policy', {
      selectYourPolicy: state.selectYourPolicy,
    });

    if (response.data.status) {
      router.push("/company/facility-profile-policy");
    }
  } catch (error) {
    console.error("An error occurred during facility setup:", error);
  }
}*/
</script>
