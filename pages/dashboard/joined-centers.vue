<script setup lang="ts">
import moment from "moment";
import { storeToRefs } from "pinia";

const companyStore = useCompanyStore();
const { getCompaniesAUserJoined } = storeToRefs(companyStore);
companyStore.fetchCompanyJoinedByAUser();

const isCompanyServicePopoverOpen = ref(false);

const selectedService = ref({});

const selectedDate = ref("");
const selectedCompany = ref({});

const state = reactive({
  serviceId: "",
  startDate: "",
  endDate: "",
});
const router = useRouter();

const closeServiceSlideover = () => {
  isCompanyServicePopoverOpen.value = false;
};
watchEffect(() => {
  if (selectedService.value?.companyServicePrice?.period == "daily") {
    state.startDate = selectedDate.value;
    state.endDate = selectedDate.value;
  }
  if (selectedService.value?.companyServicePrice?.period == "weekly") {
    const year = parseInt(selectedDate.value.substring(0, 4), 10);
    const week = parseInt(selectedDate.value.substring(6, 8), 10);

    // Calculate start date of the week
    const startDate = moment()
      .year(year)
      .isoWeek(week)
      .startOf("isoWeek")
      .format("YYYY-MM-DD");

    // Calculate end date of the week
    const endDate = moment()
      .year(year)
      .isoWeek(week)
      .endOf("isoWeek")
      .format("YYYY-MM-DD");

    state.startDate = startDate;
    state.endDate = endDate;
  }
  if (selectedService.value.companyServicePrice?.period == "monthly") {
    // Extract year and month from the selectedMonth string (e.g., "2024-07")
    const [year, month] = selectedDate.value.split("-").map(Number);

    // Get the first day of the selected month
    const firstDayOfMonth = moment()
      .year(year)
      .month(month - 1)
      .startOf("month")
      .format("YYYY-MM-DD");

    // Get the last day of the selected month
    const lastDayOfMonth = moment()
      .year(year)
      .month(month - 1)
      .endOf("month")
      .format("YYYY-MM-DD");

    state.startDate = firstDayOfMonth;
    state.endDate = lastDayOfMonth;
  }
});

const setCompanyToJoin = (company: object) => {
  selectedCompany.value = company;
};
const setCompanyToView = (company: object) => {
  selectedCompany.value = company;
  isCompanyServicePopoverOpen.value = true;
};
</script>
<template>
  <div class="py-3 px-3">
    <!-- <UAlert
      v-if="getCompaniesAUserJoined.length > 0"
      variant="ghost"
      title="Facilities you have joined"
      :actions="[
        {
          variant: 'ghost',
          color: 'primary',
          label: 'Other facilities',
          click: () => router.push('/facilities'),
        },
      ]"
    /> -->

    <br />
    <div class="text-center" v-if="getCompaniesAUserJoined.length === 0">
      <p>You have not joined any facility</p>
      <br />
      <!-- <UButton
        color="cyan"
        variant="outline"
        @click="router.push('/facilities')"
      >
        Browse facilities
      </UButton> -->
    </div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center"
    >
      <CompanyCard
        v-for="(company, index) in getCompaniesAUserJoined"
        :company="company"
        :key="index"
        :show-join-button="false"
        @joinThisCompany="setCompanyToJoin"
        @viewServices="setCompanyToView"
      />
    </div>
    <CompanyServiceSlideover
      v-if="isCompanyServicePopoverOpen"
      :company="selectedCompany"
      :is-open="isCompanyServicePopoverOpen"
      @close="closeServiceSlideover"
    />
  </div>
</template>
