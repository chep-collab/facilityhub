<template>
  <div class="flex gap-8 border-b" role="tablist">
    <button
      v-for="item in items"
      :key="item.value"
      class="flex items-center gap-2 rounded-b px-4 pt-2 pb-[14px] text-sm font-medium border-b-4 transition-colors duration-200"
      :class="[
        modelValue === item.value
          ? `border-[#5555FF] text-[#5555FF] rounded-b-sm `
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
      ]"
      @click="select(item.value)"
    >
      <i :class="item.icon" class="h-5 w-5"></i>
      <span>{{ item.label }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { type TabsItem } from "~/types/component";
const props = defineProps({
  items: {
    type: Array as PropType<TabsItem[]>,
    required: true,
    default: () => [],
  },
  modelValue: {
    type: String,
    default: "",
  },
  //   color: {
  //     type: String,
  //     default: "black",
  //   },
});

const emit = defineEmits(["update:modelValue"]);

function select(value: string) {
  emit("update:modelValue", value);
}
</script>
