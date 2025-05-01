<script setup lang="ts">
import moment from "moment";
import { handleErrorMessages } from "~/common/errorHandlers";
import { formatDateAddDay } from "~/common/dataFormatter";
import { object, string } from "yup";
const subscriptionStore = useSubscriptionStore();
const { getSubscriptionCreationStatus } = storeToRefs(subscriptionStore);
const toast = useToast();

const props = defineProps<{
  selectedService: {
    type: Object;
    required: true;
  };
  isOpen: {
    type: Boolean;
    required: true;
  };
  companyId: string;
}>();

const emit = defineEmits(["close"]);

const { selectedService, isOpen } = props;
const subscriptionSchema = object({
  selectedDate: string().required("Date is required"),
});
const subscriptionFormState = reactive({
  selectedDate: "",
});
const dates = ref({
  startDate: "",
  endDate: "",
});
const subscribeToThisService = async () => {
  const payload = {
    serviceId: selectedService.id,
    startDate: dates.value.startDate,
    endDate: dates.value.endDate,
  };
  try {
    const response = await subscriptionStore.subscribeToACompanyService(
      payload
    );
    toast.add({
      title: response.data.message || "Subscription successful",
      color: "green",
    });

    navigateTo("/dashboard/subscriptions");
  } catch (error: any) {
    if (error) {
      toast.add({
        title: "Error",
        description: error.response.data?.message,
        color: "red",
      });
    }
  }
};

const isFormValid = computed(() => {
  return subscriptionFormState.selectedDate.trim() !== "";
});

const dateLabel = computed(() => {
  const period = selectedService.companyServicePrice?.period;
  return period == "daily"
    ? "Select a Date"
    : period == "weekly"
    ? "Select a Week"
    : "Select a Month";
});

const dateType = computed(() => {
  const period = selectedService.companyServicePrice?.period;
  return period === "daily" ? "date" : period === "weekly" ? "week" : "month";
});

watchEffect(() => {
  const today = moment().format("YYYY-MM-DD");
  const currentYear = moment().year();
  const currentWeek = moment().isoWeek();
  const currentMonth = moment().month();
  if (selectedService.companyServicePrice?.period == "daily") {
    dates.value.startDate = subscriptionFormState.selectedDate || today;
    dates.value.endDate = subscriptionFormState.selectedDate || today;
  }
  if (selectedService.companyServicePrice?.period == "weekly") {
    const year = parseInt(
      subscriptionFormState.selectedDate.substring(0, 4),
      10
    );
    const week = parseInt(
      subscriptionFormState.selectedDate.substring(6, 8),
      10
    );

    // Calculate start date of the week
    const date = new Date();
    const startDate = moment()
      .year(year || currentYear)
      .isoWeek(week || currentWeek)
      .startOf("isoWeek")
      .format("YYYY-MM-DD");

    // Calculate end date of the week
    const endDate = moment()
      .year(year || currentYear)
      .isoWeek(week || currentWeek)
      .endOf("isoWeek")
      .format("YYYY-MM-DD");

    dates.value.startDate = startDate;
    dates.value.endDate = endDate;
  }
  if (selectedService.companyServicePrice?.period == "monthly") {
    const [year, month] = subscriptionFormState.selectedDate
      .split("-")
      .map(Number);
    const firstDayOfMonth = moment()
      .year(year || currentYear)
      .month(month - 1 || currentMonth)
      .startOf("month")
      .format("YYYY-MM-DD");
    // Get the last day of the selected month
    const lastDayOfMonth = moment()
      .year(year || currentYear)
      .month(month - 1 || currentMonth)
      .endOf("month")
      .format("YYYY-MM-DD");
    dates.value.startDate = firstDayOfMonth;
    dates.value.endDate = lastDayOfMonth;
  }
});
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
          Subscribe to {{ selectedService.name }}

          <UButton label="Close" variant="ghost" @click="$emit('close')" />
        </div>
      </template>
      <UForm
        :state="subscriptionFormState"
        :schema="subscriptionSchema"
        @submit="subscribeToThisService"
        class="space-y-4"
      >
        <li>
          Subscription Type:
          {{ selectedService.companyServicePrice?.period }}
        </li>
        <li>
          Subscription Price: N
          {{ selectedService.companyServicePrice?.amount }}
        </li>

        <li>
          Subscription Description:
          <p class="indent-5">{{ selectedService?.description }}</p>
        </li>

        <UFormGroup :label="dateLabel" name="selectedDate" required>
          <UInput
            v-model="subscriptionFormState.selectedDate"
            :type="dateType"
          />
        </UFormGroup>

        <div class="flex flex-row justify-between">
          <div class="text-sm text-brown-200">
            From: {{ formatDateAddDay(dates.startDate) }}
          </div>
          <div class="text-sm text-brown-200">
            To: {{ formatDateAddDay(dates.endDate) }}
          </div>
        </div>
        <p class="font-medium px-4 text-left relative text-blue-700">
          <UIcon
            name="i-heroicons-exclamation-circle"
            class="absolute left-0 top-[5px]"
          >
          </UIcon>

          After subscribing, make payment to any of the accounts below and
          upload your receipt to have your subscription activated.
        </p>

        <!-- Payment Details -->
        <h3 class="mb-0 text-lg font-bold">Company Payment Details</h3>
        <SubscriptionsFacilityPaymentDetails :company-id="companyId" />

        <UButton
          type="submit"
          :loading="getSubscriptionCreationStatus"
          label="Proceed After Payment"
          block
          :disabled="!isFormValid"
        />
      </UForm>
    </UCard>
  </UModal>
</template>
