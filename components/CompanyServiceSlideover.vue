<script setup lang="ts">
const props = defineProps({
  company: {
    type: Object,
    required: true,
  },
  isOpen: {
    type: Boolean,
    require: true,
  },
});
const { company, isOpen } = props;

const companyStore = useCompanyStore();
const { fetchingCompanyDetails, companyDetails } = storeToRefs(companyStore);

const selectedService = ref({});
const isSubscriptionFormOpen = ref(false);

const selectThisService =  (service: any) => {
  selectedService.value = service;
  state.serviceId = service.id;
  isSubscriptionFormOpen.value = true;
};

const state = reactive({
  serviceId: "",
  startDate: "",
  endDate: "",
});

const closeSubscriptionForm = () => {
  isSubscriptionFormOpen.value = false;
};

const items = ["https://placehold.co/600x400"];

await companyStore.fetchCompanyDetail(company.id);
</script>

<template>
  <div>
    <USlideover v-model="isOpen">
      <div class="p-4 flex flex-row justify-end">
        <UButton color="primary" variant="ghost" @click="$emit('close')">
          Close
        </UButton>
      </div>

      <div v-if="fetchingCompanyDetails">
        <UProgress animation="carousel" />
        <div class="p-4">Getting services</div>
      </div>
      <div v-else class="p-4 overflow-y-auto">
        <h3 class="text-lg">{{ companyDetails.name }}'s Services</h3>
        <p v-if="companyDetails.companyServices.length === 0">
          This facility has no active services at the moment
        </p>
        <br />
        <UCard
          class="mb-4"
          v-for="(service, index) in companyDetails.companyServices"
        >
          <UCarousel
            ref="carouselRef"
            v-slot="{ item }"
            :items="items"
            :ui="{ item: 'basis-full' }"
            class="rounded-lg overflow-hidden"
            indicators
          >
            <img
              :src="service.avatarUrl || item"
              class="w-full"
              draggable="false"
            />
          </UCarousel>
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
              <p :class="service.isActive ? 'text-green-500' : 'text-red-500'">
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
        <SubscriptionModal
        :companyId="company.id"
          v-if="isSubscriptionFormOpen"
          :selected-service="selectedService"
          :is-open="isSubscriptionFormOpen"
          @close="closeSubscriptionForm"
        />
      </div>
    </USlideover>
  </div>
</template>
