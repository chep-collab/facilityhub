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
await companyStore.fetchCompanies();
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
      <UCard class="mb-4" v-for="(company, index) in getCompanies">
        <template #header>
          <UCarousel
            ref="carouselRef"
            v-slot="{ item }"
            :items="items"
            :ui="{ item: 'basis-full' }"
            class="rounded-lg overflow-hidden"
            indicators
          >
            <img :src="item" class="w-full" draggable="false" />
          </UCarousel>
          <p class="text-center mt-2">{{ company.name }}</p>
        </template>

        <li><b>Address</b>: {{ company.address }}</li>
        <li>
          <b>Phone</b>:
          <a :href="`tel:${company.phone}`">{{ company.phone }}</a>
        </li>
        <li>
          <b>Status</b>:
          <span :class="company.isActive ? 'text-green-500' : 'text-red-500'">
            {{ company.isActive ? "Active" : "Inactive" }}</span
          >
        </li>
        <div class="flex flex-row justify-end mt-2 gap-4">
          <UButton variant="outline" @click="selectThisCompany(company.id)">
            Join facility
          </UButton>
          <UButton variant="outline" @click="selectThisCompany(company.id)">
            View Services
          </UButton>
        </div>
      </UCard>
    </div>

    <br />
  </div>
</template>
