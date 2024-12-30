<script setup lang="ts">
import moment from "moment";
import { handleErrorMessages } from "~/common/errorHandlers";
import { formatDateAddDay } from "~/common/dataFormatter";
const subscriptionStore = useSubscriptionStore();
const { getSubscriptionCreationStatus } = storeToRefs(subscriptionStore);
const toast = useToast();
const router = useRouter();

const props = defineProps({
  selectedService: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["close"]);

const { selectedService, isOpen } = props;

const selectedDate = ref("");

const state = reactive({
  startDate: "",
  endDate: "",
});

const subscribeToThisService = async () => {
  try {
    const response = await subscriptionStore.subscribeToACompanyService(
      selectedService.id,
      state.startDate,
      state.endDate
    );
    toast.add({
      title: response.data.message || "Subscription successful",
      color: "green",
    });
    emit("close");
    router.push("/dashboard/subscriptions");
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
  if (selectedService.companyServicePrice?.period == "daily") {
    state.startDate = selectedDate.value;
    state.endDate = selectedDate.value;
  }
  if (selectedService.companyServicePrice?.period == "weekly") {
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
  if (selectedService.companyServicePrice?.period == "monthly") {
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
  <div>
    <UModal v-model="isOpen">
      <UCard
        :ui="{
          ring: '',
          divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        }"
      >
        <template #header>
          <div class="flex flex-row justify-between items-center">
            Subscibe to {{ selectedService.name }}

            <UButton label="Close" variant="ghost" @click="$emit('close')" />
          </div>
        </template>
        <form class="space-y-4" @submit.prevent="subscribeToThisService">
          <li>
            Subscription Type :
            {{ selectedService.companyServicePrice?.period }}
          </li>
          <li>
            Subscription Price : N
            {{ selectedService.companyServicePrice?.amount }}
          </li>
          <div
            v-if="selectedService.companyServicePrice?.period == 'daily'"
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
            v-if="selectedService.companyServicePrice?.period == 'monthly'"
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
            v-if="selectedService.companyServicePrice?.period == 'weekly'"
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
            <div class="text-sm text-brown-200">
              From: {{ formatDateAddDay(state.startDate) }}
              <br />
            </div>
            <div class="text-sm text-brown-200">
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
</template>
