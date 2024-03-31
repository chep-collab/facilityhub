<script setup lang="ts">
import moment from "moment";
import { storeToRefs } from "pinia";
import { object, string } from "yup";
import { formatDateAddDay, formatDate } from "../../common/dataFormatter";
import { handleErrorMessages } from "~/common/errorHandlers";
definePageMeta({
  layout: "dashboard-layout",
});

const companyStore = useCompanyStore();
const { getCompaniesAUserJoined, fetchingCompanyDetails, companyDetails } =
  storeToRefs(companyStore);
companyStore.fetchCompanyJoinedByAUser();

const subscriptionStore = useSubscriptionStore();
const { getSubscriptionCreationStatus } = storeToRefs(subscriptionStore);
const isCompanyServicePopoverOpen = ref(false);

const selectThisCompany = async (companyId: string) => {
  isCompanyServicePopoverOpen.value = true;
  await companyStore.fetchCompanyDetail(companyId);
};

const selectedService = ref({});
const isSubscriptionFormOpen = ref(false);

const selectThisService = async (service: any) => {
  selectedService.value = service;
  state.serviceId = service.id;
  isSubscriptionFormOpen.value = true;
  //open the service modal
};

const schema = object({
  serviceId: string().required("Required"),
  startDate: string().required("Required"),
  endDate: string().required("Required"),
});

const selectedDate = ref("");

const state = reactive({
  serviceId: "",
  startDate: "",
  endDate: "",
});
const toast = useToast();
const router = useRouter();

const subscribeToThisService = async () => {
  try {
    const response = await subscriptionStore.subscribeToACompanyService(
      state.serviceId,
      state.startDate,
      state.endDate
    );
    toast.add({
      title: response.data.message || "Subscription successful",
      color: "green",
    });
    isSubscriptionFormOpen.value = false;
    router.push("/dashboard");
  } catch (error: any) {
    if (error) {
      toast.add({
        title: handleErrorMessages(error),
        color: "red",
      });
    }
  }
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
</script>
<template>
  <div class="py-3 px-3">
    <UAlert
      v-if="getCompaniesAUserJoined.length > 0"
      variant="ghost"
      title="Facilities you have joined"
      :actions="[
        {
          variant: 'ghost',
          color: 'primary',
          label: 'Other facilities',
          click: () => router.push('/'),
        },
      ]"
    />

    <br />
    <div class="text-center" v-if="getCompaniesAUserJoined.length === 0">
      <p>You have not joined any facility</p>
      <br />
      <UButton color="cyan" variant="outline" @click="router.push('/')">
        Browse facilities
      </UButton>
    </div>
    <UCard
      v-for="(company, index) in getCompaniesAUserJoined"
      :key="index"
      class="mb-4"
    >
      <template #header> {{ company.name }} </template>

      <li><b>Address</b>: {{ company.address }}</li>
      <li>
        <b>Phone</b>: <a :href="`tel:${company.phone}`">{{ company.phone }}</a>
      </li>
      <li>
        <b>Status</b>:
        <span :class="company.isActive ? 'text-green-500' : 'text-red-500'">
          {{ company.isActive ? "Active" : "Inactive" }}</span
        >
      </li>
      <div class="flex flex-row justify-end mt-2">
        <UButton
          color="cyan"
          variant="outline"
          @click="selectThisCompany(company.id)"
        >
          View Services
        </UButton>
      </div>
    </UCard>
    <div>
      <USlideover v-model="isCompanyServicePopoverOpen">
        <div class="p-4 flex-row justify-end">
          <UButton
            color="primary"
            variant="ghost"
            @click="isCompanyServicePopoverOpen = false"
          >
            Close Services
          </UButton>
        </div>

        <div v-if="fetchingCompanyDetails">
          <UProgress animation="carousel" />
          <div class="p-4">Getting services</div>
        </div>
        <div v-else class="p-4 overflow-y-auto">
          <h3>{{ companyDetails.name }}'s Services</h3>
          <br />
          <UCard
            class="mb-4"
            v-for="(service, index) in companyDetails.companyServices"
          >
            <div class="flex flex-row justify-between">
              <div class="w-1/2">
                {{ service.name }} <br />
                <p class="text-xs">{{ service.description }}</p>
              </div>
              <div class="w-1/2 text-right">
                {{
                  service.companyServicePrice
                    ? "N " + service.companyServicePrice?.amount
                    : "N/A"
                }}
                {{
                  service.companyServicePrice
                    ? " " + service.companyServicePrice?.period
                    : ""
                }}
                <br />
                <p
                  :class="service.isActive ? 'text-green-500' : 'text-red-500'"
                >
                  {{ service.isActive ? "Active" : "Inactive" }}
                </p>
              </div>
            </div>
            <div class="flex flex-row justify-around mt-2">
              <UButton
                v-if="service.isActive && service.companyServicePrice"
                color="cyan"
                variant="outline"
                @click="selectThisService(service)"
                block
              >
                Subscribe
              </UButton>
            </div>
          </UCard>
          <div>
            <UModal v-model="isSubscriptionFormOpen">
              <UCard
                :ui="{
                  ring: '',
                  divide: 'divide-y divide-gray-100 dark:divide-gray-800',
                }"
              >
                <template #header>
                  <div class="flex flex-row justify-between items-center">
                    Subscibe to {{ selectedService.name }}

                    <UButton
                      label="Close"
                      variant="ghost"
                      @click="isSubscriptionFormOpen = false"
                    />
                  </div>
                </template>
                <form
                  class="space-y-4"
                  @submit.prevent="subscribeToThisService"
                >
                  <li>
                    Subscription Type :
                    {{ selectedService.companyServicePrice?.period }}
                  </li>
                  <li>
                    Subscription Price : N
                    {{ selectedService.companyServicePrice?.amount }}
                  </li>
                  <div
                    v-if="
                      selectedService.companyServicePrice?.period == 'daily'
                    "
                    class="my-4"
                  >
                    <label for="dateInput">Select a Date:</label> <br />
                    <input
                      class="w-full p-4 rounded-sm"
                      type="date"
                      id="dateInput"
                      name="dateInput"
                      v-model="selectedDate"
                    />
                  </div>

                  <div
                    v-if="
                      selectedService.companyServicePrice?.period == 'monthly'
                    "
                    class="my-4"
                  >
                    <label for="monthInput">Select a Month:</label> <br />
                    <input
                      class="w-full p-4 rounded-sm"
                      type="month"
                      id="monthInput"
                      name="monthInput"
                      v-model="selectedDate"
                    />
                  </div>

                  <div
                    v-if="
                      selectedService.companyServicePrice?.period == 'weekly'
                    "
                    class="my-4"
                  >
                    <label for="weekInput">Select a Week:</label> <br />
                    <input
                      class="w-full p-4 rounded-sm"
                      type="week"
                      id="weekInput"
                      name="weekInput"
                      v-model="selectedDate"
                    />
                  </div>
                  <div class="flex flex-row justify-between">
                    <div class="text-sm text-yellow-300">
                      From: {{ formatDateAddDay(state.startDate) }}
                      <br />
                    </div>
                    <div class="text-sm text-yellow-300">
                      To: {{ formatDateAddDay(state.endDate) }} <br />
                    </div>
                  </div>
                  <UButton
                    :loading="getSubscriptionCreationStatus"
                    label="Proceed"
                    type="submit"
                    block
                  />
                </form>
              </UCard>
            </UModal>
          </div>
        </div>
      </USlideover>
    </div>
  </div>
</template>
