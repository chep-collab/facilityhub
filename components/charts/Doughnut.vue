<script setup lang="ts">
import { defineProps } from "vue";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  DoughnutController,
  Legend,
} from "chart.js";
import { Doughnut } from "vue-chartjs";
const props = defineProps<{
  data1: number;
  data2: number;
}>();

const totalNo = computed(() => props.data1 + props.data2);

ChartJS.register(DoughnutController, ArcElement, Tooltip, Legend);
const chartData = {
  labels: ["Past Subscriptions", "New Subscriptions"],
  datasets: [
    {
      data: [props.data1, props.data2],
      backgroundColor: ["#599376", "#FFA500"], // Colors for the slices
      hoverBackgroundColor: ["#599376", "#FFA500"],
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom" as const,
      maxHeight: 100,
      pointStyle: "circle",
      labels: {
        usePointStyle: true,
        padding: 20,
        pointStyle: "circle",
      },
    },
  },
};
</script>

<template>
  <div class="relative">
    <Doughnut :data="chartData" :options="chartOptions" />
    <div class="absolute text-3xl font-bold top-[30%] right-[46%]">
      {{ data1 }}
    </div>
  </div>
</template>
