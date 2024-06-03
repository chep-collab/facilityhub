<template>
  <UFormGroup :label="label" name="file">
    <UInput type="file" size="sm" v-on:change="handleFileUpload" />
  </UFormGroup>
</template>

<script setup lang="ts">
const emit = defineEmits(["fileStaged"]);
const props = defineProps({
  label: {
    type: String,
    required: false,
    default: "Upload Image",
  },
});
const handleFileUpload = (event: any) => {
  emit("fileStaged", event.target.files[0]);
};
</script>
