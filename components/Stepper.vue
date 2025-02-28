<template>
  <div class="flex items-center justify-center">
    <div v-for="(step, index) in steps" :key="index" class="flex items-center">
      <!-- Step Circle -->
      <div
        class="w-8 h-8 flex items-center border justify-center rounded-full transition-all"
        :class="lineClass(index, 'white')"
      >
        {{ index + 1 }}
      </div>

      <div
        class="flex gap-[2px] md:gap-2 mx-[5px] md:mx-[10.5px]"
        v-if="index !== steps.length - 1"
      >
        <span
          class="w-1 hidden md:block h-[2px]"
          :class="lineClass(index)"
        ></span>
        <div class="w-2 h-[2px] transition-all" :class="lineClass(index)"></div>
        <div class="w-2 h-[2px] transition-all" :class="lineClass(index)"></div>
        <span
          class="w-1 hidden md:block h-[2px]"
          :class="lineClass(index)"
        ></span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps } from "vue";
//  index is like 0 for 1 , less than currentStep which should be 1 show
const props = defineProps<{
  steps: string[];
  currentStep: number;
  onNextStep: () => void;
}>();
function lineClass(index: number, color?: string) {
  const colorToUse =
    color && color === "white"
      ? "bg-white border-grey-border "
      : "bg-grey-stepper";

  const result = computed(() =>
    index < props.currentStep
      ? "bg-primary-green border-transparent text-white"
      : ` ${colorToUse} text-grey-stepper`
  );
  return result.value;
}
</script>
