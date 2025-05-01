<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  pageSize: {
    type: Number,
    default: 5
  },
  initialPage: {
    type: Number,
    default: 1
  },
  showPagination: {
    type: Boolean,
    default: true
  }
})

const page = ref(props.initialPage)

const emit = defineEmits(['page-change'])

const totalPages = computed(() => Math.ceil(props.items.length / props.pageSize))
const paginatedItems = computed(() => {
  const start = (page.value - 1) * props.pageSize
  const end = start + props.pageSize
  return props.items.slice(start, end)
})

watch(page, (newPage) => {
  emit('page-change', newPage)
})

function changePage(newPage: number) {
  page.value = newPage
}
</script>

<template>
  <div>
    <UTable :rows="paginatedItems" />

    <div v-if="showPagination && items.length > pageSize" 
         class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
      <UPagination 
        v-model="page" 
        :page-count="totalPages" 
        :total="items.length" 
      />
    </div>
  </div>
</template>