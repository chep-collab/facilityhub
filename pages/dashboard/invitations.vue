<script setup lang="ts">
import { storeToRefs } from "pinia";
definePageMeta({
  layout: "dashboard-layout",
});

const companyStore = useCompanyStore();
companyStore.fetchCompanyJoinedByAUser();
const selectedCompany = ref({});
const alreadyJoined = ref(true); // State to check if the user has already joined the company

const state = reactive({
  companyInvitationCode: "",
});

const setCompanyToJoin = (company: object) => {
  selectedCompany.value = company;
};

import { handleErrorMessages } from "../../common/errorHandlers";

const toast = useToast();
const fetchingCompanyName = ref(false);
const facilityType = ref();
const facilityAddress = ref();
const invitingCompanyName = ref("");

async function getCompanyNameViaInvitationCode(invitationCode: string) {
  try {
    fetchingCompanyName.value = true;
    const response = await useNuxtApp().$axios.get(`/company/get-name/${invitationCode}`);
    invitingCompanyName.value = response.data.name;
    facilityType.value = response.data.facility_type;
    facilityAddress.value = response.data.address;
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
if (invitationCode) {
  state.companyInvitationCode = invitationCode;
  getCompanyNameViaInvitationCode(invitationCode);
}

const pending = ref(false);

// Function to handle redirecting to the list of joined companies
function goToJoinedCompanies() {
  useRouter().push("/joined-companies");
}

// Function to handle accepting the invitation
function acceptInvitation() {
  // Logic to be implemented
}

// Function to handle rejecting the invitation
function rejectInvitation() {
  // Logic to be implemented
}
</script>

<template>
  <div class="p-6 bg-gray-50 rounded-md shadow-md max-w-md mx-auto">
    <h1 class="text-2xl font-semibold text-gray-800 mb-4">
      Join {{ invitingCompanyName }}
    </h1>
    <p class="text-gray-700 mb-2">
      <span class="font-medium">Facility type:</span> {{ facilityType }}
    </p>
    <p class="text-gray-700 mb-4">
      <span class="font-medium">Address:</span> {{ facilityAddress }}
    </p>

    <div v-if="alreadyJoined" class="flex flex-col items-center">
      <p class="text-gray-600 mb-4">
        ✅ You have already joined this company. ✅
      </p>
      <UButton
        type="button"
        @click="goToJoinedCompanies"
        class="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        View Joined Companies
      </UButton>
    </div>

    <div v-else class="flex flex-row gap-4 mb-4">
      <UButton
        :loading="pending"
        :disabled="pending"
        type="submit"
        @click="acceptInvitation"
        class="bg-green-500 text-white py-3 px-6 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Accept and Join
      </UButton>

      <UButton
        color=""
        :loading="pending"
        :disabled="pending"
        type="button"
        @click="rejectInvitation"
        class="bg-white text-gray-800 py-3 px-6 rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
      >
        Reject
      </UButton>
    </div>

    <p v-if="!alreadyJoined" class="text-sm text-gray-600">
      <strong>Note:</strong> If you reject, you can click the invitation link again to revisit this page.
    </p>
  </div>
</template>
