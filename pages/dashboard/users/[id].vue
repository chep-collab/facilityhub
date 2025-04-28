<template>
  <section>
    <div class="">
      <UButton
        label="Back"
        variant="ghost"
        icon="i-heroicons-arrow-left"
        @click="goBackToUsersPage"
        :trailing="false"
        class="bg-transparent hover:bg-transparent gap-3 text-grey-stepper shadow-none"
      />
    </div>
  </section>

  <section class="mt-5">
    <div class="grid grid-cols-1 gap-10 md:grid-cols-2">
      <UCard
        :ui="{
          base: 'dashboard-card px-[18px] pt-4 pb-[23px] ',
          body: 'px-4 py-4',
        }"
        class=""
      >
        <p
          class="text-center text-[18px] font-semibold text-grey-stepper w-[94%] mx-auto pb-2 border-[#E5E5EF] border-b"
        >
          Profile
        </p>

        <div class="flex gap-4 mt-4">
          <div class="">
            <img src="/userimg.png" alt="" />
          </div>

          <div class="flex flex-col">
            <p class="text-[#1D2739] text-[1.125rem] font-semibold">
              <strong> {{ ` ${firstName} ${lastName} ` }} </strong>
            </p>
            <!-- status -->
            <div class="flex text-[14px]">
              <i class="i-heroicons-pencil-square bg-icon w-5 h-5"></i>

              <p>status : <span> Active</span></p>
            </div>
          </div>
        </div>

        <!-- facility and date joined -->
        <div class="flex mt-7 flex-col gap-[14px]">
          <div class="flex items-center gap-1">
            <i class="i-heroicons-building-office-2 bg-icon w-5 h-5"></i>
            <p class="text-grey-border">Facility :</p>
          </div>
          <div class="flex items-center gap-1">
            <i class="i-heroicons-calendar bg-icon w-5 h-5"></i>
            <p class="text-grey-border">
              Date Joined : <span class="text-icon">{{}} </span>
            </p>
          </div>
        </div>

        <!-- contact -->

        <div class="flex flex-col mt-10 px-1 gap-[14px] border py-1 rounded">
          <div class="flex items-center gap-1">
            <i class="i-heroicons-envelope bg-icon w-5 h-5"></i>
            <p class="text-grey-border w-[60px]">Email :</p>
            <span class="text-icon">{{ userDetails?.email }} </span>
          </div>
          <div class="flex items-center gap-1">
            <i class="i-heroicons-phone bg-icon w-5 h-5"></i>

            <p class="text-grey-border w-[60px]">Phone :</p>
            <span class="text-icon">{{ userDetails?.phone }} </span>
          </div>
        </div>
      </UCard>

      <UCard
        :ui="{
          base: 'h-full  dashboard-card px-[18px] pt-4 pb-[23px]',
          body: 'px-4 py-4',
        }"
      >
        <p
          class="text-center text-[18px] font-semibold text-grey-stepper w-[94%] mx-auto pb-2 border-[#E5E5EF] border-b"
        >
          Statistics
        </p>
        <div class="w-full flex flex-col items-center justify-center">
          <div class="w-[200px] mt-4 h-[200px] justify-center flex">
            <Doughnutchart
              :data1="userSubscriptions.data.length"
              :data2="expiredSubscriptionsLength"
            />
          </div>
          <div class="w-full pt-6 flex flex-col gap-2">
            <div class="flex gap-1 items-center">
              <i class="i-heroicons-banknotes bg-icon w-5 h-5"></i>
              <p class="text-grey-border">Total Subscriptions:</p>
              {{ userSubscriptions.data.length }} <i> (past & active) </i>
            </div>
            <div class="flex gap-1 items-center">
              <i class="i-heroicons-pencil-square bg-icon w-5 h-5"></i>
              <p class="text-grey-border">Active Subscriptions:</p>
              {{ userSubscriptions.data.length - expiredSubscriptionsLength }}
            </div>
          </div>
        </div>
      </UCard>
    </div>
  </section>

  <!-- table section -->
  <div class="overflow-x-auto mt-8">
    <div class="border-b px-5 border-[#D0D5DD]">
      <h2
        class="border-b-2 text-[1.125rem] px-2 font-semibold border-primary-green w-fit text-grey-medium"
      >
        Subscriptions
      </h2>
    </div>
    <UTable
      class=""
      :ui="{
        th: { base: 'hidden' },
        tr: { base: 'flex justify-between' },
        td: {
          base: ' w-fit text-[16px] flex items-center gap-2 whitespace-nowrap',
        },
      }"
      :empty-state="{
        icon: 'i-heroicons-circle-stack-20-solid',
        label: 'No user has joined your facility.',
      }"
      :rows="filteredRows"
      :columns="columns"
    >
      <template #summary-data="{ row }">
        <div class="flex items-center gap-1">
          <span
            class="text-primary-green font-[900] w-[32px] h-[32px] flex items-center justify-center bg-[#F0F2F5] px-3 py-2 rounded-[50%]"
            >₦
          </span>
          <p class="font-medium text-[#1D2739]">
            Payment <span class="font-normal text-grey-border"> of </span>
            {{ row.actualSubscriptionAmount }}
            <span class="font-normal text-grey-border"> made to</span>
            {{ row.actualSubscriptionName }}
            <span class="font-normal text-grey-border"> by </span>
            {{ ` ${firstName} ${lastName} ` }}
          </p>
        </div>
      </template>
      <template #status-data="{ row }">
        <span
          :class="row.status === 'active' ? 'text-primary-green' : 'text-error'"
        >
          {{ row.status === "inactive" ? "Expired" : row.status }}
        </span>
      </template>
      <template #start-data="{ row }">
        <p class="font-normal text-grey-border">start:</p>
        <p class="font-medium text-[#1D2739]">
          {{
            new Date(row.startDate)?.toLocaleDateString(
              "en-US",
              dateFormatOption
            )
          }}
        </p>
      </template>
      <template #end-data="{ row }">
        <p class="font-normal text-grey-border">end:</p>
        <p class="font-medium text-[#1D2739]">
          {{
            new Date(row.endDate)?.toLocaleDateString("en-US", dateFormatOption)
          }}
        </p>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
import Doughnutchart from "~/components/charts/Doughnut.vue";

const router = useRouter();
const columns = [
  {
    key: "summary",
    label: "",
  },
  {
    key: "status",
    label: "",
  },
  {
    key: "start",
    label: "",
  },
  {
    key: "end",
    label: "",
  },
];

const {
  params: { id },
} = router?.currentRoute.value;
const dateFormatOption: Intl.DateTimeFormatOptions = {
  month: "short",
  day: "numeric",
  year: "numeric",
};
const names = typeof id === "string" ? id.split("_") : [];
const capitalNames = names.map((name) => {
  return name[0].toUpperCase() + name.slice(1);
});
const [firstName, lastName] = capitalNames;
const userDetails = ref<{ data: any; result: string } | null>(null);
const { getUserDetailsUnderCompany, getCompanyUserSubscriptions } =
  useWorkspaceUserStore();
const userSubscriptions = ref({});
const expiredSubscriptionsLength = computed(
  () =>
    userSubscriptions?.value?.data?.filter((item) => item.status === "inactive")
      .length
);
const { data: response } = await useAsyncData("user-details", async () => {
  const response = getUserDetailsUnderCompany();
  return response;
});
const { data: subscriptions } = await useAsyncData(
  "user-subscriptions",
  async () => {
    const response = await getCompanyUserSubscriptions();
    return response;
  }
);

userSubscriptions.value = subscriptions.value?.data;
userDetails.value = response.value?.data;

const filteredRows = computed(() => {
  if (userSubscriptions.value) {
    return userSubscriptions?.value?.data?.map((item) => {
      const {
        actualSubscriptionAmount,
        actualSubscriptionName,
        status,
        startDate,
        endDate,
      } = item;
      return {
        actualSubscriptionAmount,
        actualSubscriptionName,
        status,
        startDate,
        endDate,
      };
    });
  }
});

function goBackToUsersPage() {
  navigateTo("/dashboard/users");
}
</script>

<style scoped>
.bg-icon {
  background-color: #475367;
}
</style>
