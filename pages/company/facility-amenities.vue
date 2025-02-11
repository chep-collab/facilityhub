<template>
    <UCard class=" font-inter w-full max-w-md mx-auto p-8 rounded-xl shadow-lg bg-white mt-12">
      <template #header>
        <h2 class="text-2xl font-semibold text-center text-gray-900">
          Facility Admin Amenities
        </h2>
        <p class="text-center text-md text-gray-500">
          Select the amenities available in your facility
        </p>
      </template>
      <div>
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-6"
          @submit="onSubmit"
        >
          <p class="text-sm text-gray-500">Select Amenities*</p>
  
          <div class="grid grid-cols-2 gap-x-16 gap-y-4">
            <div
              v-for="(amenity, index) in amenities"
              :key="index"
              class="flex items-center space-x-1"
            >
              <input
                type="checkbox"
                :id="'amenity-' + index"
                :value="amenity"
                v-model="state.selectedAmenities"
                class="w-4 h-3 rounded border-gray-300 focus:ring-green-500"
              />
              <label
                :for="'amenity-' + index"
                class="text-[15px] text-gray-700 py-2 whitespace-nowrap"
              >
                {{ amenity }}
              </label>
            </div>
          </div>
  
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
  import { reactive, ref } from "vue"; 
  import { object, array, type InferType } from "yup";
  import { useRouter } from "vue-router"; 
  
  const router = useRouter();
  const activeUserStore = useActiveUserStore();
  

  const schema = object({
    selectedAmenities: array().min(1, "Please select at least one amenity"),
  });
  
  
  type Schema = InferType<typeof schema>;
  
  const amenities = [
    "Shared meeting rooms",
    "Weightlifting area",
    "Cardio machines section",
    "High-speed internet",
    "Sauna and steam room",
    "Private workspaces",
    "Group fitness room",
    "On-site cafeteria",
    "Outdoor seating area",
    "Free parking",
  ];
  
  const state = reactive({
    selectedAmenities: [] as string[],
  });
  
  const userType = ref("user");
  
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
  