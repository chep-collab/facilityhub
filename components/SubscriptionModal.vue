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
console.log(selectedService);
const selectedDate = ref("");
const adminBankInfo = ref(null);

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
  const date = new Date().getDate().toLocaleString();
  const todaysDate = moment().day(date);
  console.log(todaysDate);

  if (selectedService.companyServicePrice?.period == "daily") {
    state.startDate = selectedDate.value || date;
    state.endDate = selectedDate.value || date;
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

    const defaultYear = new Date().getFullYear();
    const defaultMonth = new Date().getMonth();
    const [year, month] = selectedDate.value.split("-").map(Number);
    // Get the first day of the selected month
    const firstDayOfMonth = moment()
      .year(year || defaultYear)
      .month(month - 1 || defaultMonth)
      .startOf("month")
      .format("YYYY-MM-DD");
    // Get the last day of the selected month
    const lastDayOfMonth = moment()
      .year(year || defaultYear)
      .month(month - 1 || defaultMonth)
      .endOf("month")
      .format("YYYY-MM-DD");
    state.startDate = firstDayOfMonth;
    state.endDate = lastDayOfMonth;
  }
});

console.log(state);
function copyAccountNumber() {
  navigator.clipboard
    .writeText(adminBankInfo.value.accountNumber)
    .then(() => {
      console.log("Account number copied!");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
    });
}
</script>
<template>
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
          class="my-4 flex flex-col gap-4"
        >
          <label for="dateInput">Select a Date:</label>
          <input
            class="w-full p-4 border rounded-lg"
            type="date"
            id="dateInput"
            name="dateInput"
            v-model="selectedDate"
          />
        </div>

        <div
          v-if="selectedService.companyServicePrice?.period == 'monthly'"
          class="my-4 flex flex-col gap-4"
        >
          <label for="monthInput">Select a Month:</label>
          <input
            class="w-full border p-4 rounded-lg"
            type="month"
            id="monthInput"
            name="monthInput"
            v-model="selectedDate"
          />
        </div>

        <div
          v-if="selectedService.companyServicePrice?.period == 'weekly'"
          class="my-4 flex flex-col gap-4"
        >
          <label for="weekInput">Select a Week:</label>
          <input
            class="w-full p-4 border rounded-lg"
            type="week"
            id="weekInput"
            name="weekInput"
            v-model="selectedDate"
          />
        </div>
        <div class="flex flex-row justify-between">
          <div class="text-sm text-brown-200">
            From: {{ formatDateAddDay(state.startDate) }}
          </div>
          <div class="text-sm text-brown-200">
            To: {{ formatDateAddDay(state.endDate) }}
          </div>
        </div>
        <div class="mt-6 space-y-2 border-t pt-4">
          <h3 class="text-lg font-semibold">Admin Payment Info</h3>

          <p>
            <span class="font-medium">Bank Name:</span>
            {{ adminBankInfo?.bankName || "Opay Bank Limited" }}
          </p>

          <p>
            <span class="font-medium">Account Name:</span>
            {{ adminBankInfo?.accountName || "Jays Facility" }}
          </p>

          <div class="flex items-center gap-2">
            <span class="font-medium">Account Number:</span>
            <span>{{ adminBankInfo?.accountNumber || 123445452 }}</span>
            <UButton
              size="xs"
              variant="soft"
              icon="i-heroicons-clipboard"
              @click="copyAccountNumber"
              label="Copy"
            />
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
</template>
