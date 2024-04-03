<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useCompanyStore } from "../stores/companyStore";
import { storeToRefs } from "pinia";
const companyStore = useCompanyStore();
const { getCompaniesFetchingStatus, getCompanies } = storeToRefs(companyStore);

definePageMeta({
  layout: "service-layout",
});
const router = useRouter();

const items = [
  "https://picsum.photos/1920/1080?random=1",
  "https://picsum.photos/1920/1080?random=2",
  "https://picsum.photos/1920/1080?random=3",
  "https://picsum.photos/1920/1080?random=4",
  "https://picsum.photos/1920/1080?random=5",
  "https://picsum.photos/1920/1080?random=6",
];

const carouselRef = ref();

onMounted(() => {
  setInterval(() => {
    if (!carouselRef.value) return;

    if (carouselRef.value.page === carouselRef.value.pages) {
      return carouselRef.value.select(0);
    }

    carouselRef.value.next();
  }, 3000);
});

const isServicesSlideoverOpen = ref(false);
const selectedCompany = ref({});
const isJoiningModalOpen = ref(false);

const setCompanyToJoin = (company: object) => {
  selectedCompany.value = company;
  isJoiningModalOpen.value = true;
};
const setCompanyToView = (company: object) => {
  selectedCompany.value = company;
  isServicesSlideoverOpen.value = true;
};

const closeServiceSlideover = () => {
  isServicesSlideoverOpen.value = false;
};
const closeJoiningModal = () => {
  isJoiningModalOpen.value = false;
};
companyStore.fetchCompanies();
</script>
<template>
  <div class="h-screen">
    <div class="flex flex-row gap-4 justify-end">
      <UButton @click="router.push('/user/login')" variant="solid" size="xl">
        Facility user login
      </UButton>
    </div>
    <div class="flex flex-col gap-5 text-xl my-4">
      <p>Available facilities</p>
    </div>

    <div v-if="getCompaniesFetchingStatus">
      <UProgress animation="carousel" />
      <div class="p-4">Fetching facilities</div>
    </div>
    <div v-if="getCompanies.length === 0">No company found</div>

    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 justify-center"
    >
      <CompanyCard
        v-for="(company, index) in getCompanies"
        :company="company"
        :key="index"
        @joinThisCompany="setCompanyToJoin"
        @viewServices="setCompanyToView"
      />
    </div>

    <br />
    <CompanyServiceSlideover
      v-if="isServicesSlideoverOpen"
      :company="selectedCompany"
      :is-open="isServicesSlideoverOpen"
      @close="closeServiceSlideover"
    />
    <JoiningModal
      v-if="isJoiningModalOpen"
      :selected-company="selectedCompany"
      :is-open="isJoiningModalOpen"
      @close="closeJoiningModal"
    />
  </div>
</template>
