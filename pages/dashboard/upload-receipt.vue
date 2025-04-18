<template>
  <div class="p-6">
    <h1 class="md:text-xl mb-[50px] font-semibold">
      Upload Service Subscription Receipt
    </h1>

    <div class="max-w-xl mx-auto">
      <UCard
        class="border-2 border-dashed border-gray-300 hover:border-primary cursor-pointer transition-colors"
        @drop.prevent="handleDrop"
        @dragover.prevent
        @click="fileInput?.click()"
      >
        <div class="text-center space-y-2">
          <UIcon
            name="i-heroicons-arrow-up-tray"
            class="text-primary mx-auto text-3xl"
          />
          <p class="text-sm text-gray-600">
            Click or drag to upload receipt (PDF or Image)
          </p>
          <p class="text-xs text-gray-400">Max 1 file — PNG, JPG, or PDF</p>
          <input
            ref="fileInput"
            type="file"
            accept="application/pdf,image/*"
            class="hidden"
            @change="handleFileChange"
          />
        </div>
      </UCard>

      <!-- Image Preview -->
      <div v-if="isImage && previewUrl" class="mt-6 relative">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
        <button
          class="absolute top-0 right-0 p-1 text-gray-600 hover:text-red-500"
          @click.stop="removeFile"
          aria-label="Remove file"
        >
          <UIcon name="i-heroicons-x-mark" class="text-xl" />
        </button>
        <img
          :src="previewUrl"
          alt="Preview"
          class="w-full rounded-lg shadow-md border"
        />
      </div>

      <!-- PDF Preview -->
      <div
        v-else-if="file"
        class="relative flex items-center justify-between p-4 bg-gray-50 border rounded-lg mt-6"
      >
        <div class="flex gap-3">
          <UIcon name="i-heroicons-document" class="text-primary text-2xl" />
          <span class="text-sm text-gray-700">{{ file?.name }}</span>
        </div>
        <button
          class="p-1 text-gray-600 hover:text-red-500"
          @click.stop="removeFile"
          aria-label="Remove file"
        >
          <UIcon name="i-heroicons-x-mark" class="text-xl" />
        </button>
      </div>

      <div class="w-full md:justify-end flex mt-4">
        <BaseButton :disabled="file === null" class="w-full md:w-1/3">
          Notify Admin
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const file = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const previewUrl = ref<string | null>(null);
const toast = useToast();
const isImage = computed(() =>
  file.value ? file.value.type.startsWith("image") : false
);

function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    processFile(target.files[0]);
  }
}

function handleDrop(e: DragEvent) {
  const droppedFile = e.dataTransfer?.files?.[0];
  if (droppedFile) {
    processFile(droppedFile);
  }
}

function removeFile() {
  file.value = null;
  previewUrl.value = null;
  if (fileInput.value) {
    fileInput.value.value = "";
  }
}
console.log(isImage.value);
function processFile(selectedFile: File) {
  const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];

  if (!allowedTypes.includes(selectedFile.type)) {
    toast.add({
      title: "File type not supported",
      description: "Unsupported file type. Please upload PNG, JPG, or PDF.",
    });
    return;
  }

  file.value = selectedFile;
  console.log(file.value);

  if (selectedFile.type.startsWith("image")) {
    previewUrl.value = URL.createObjectURL(selectedFile);
  } else {
    previewUrl.value = null;
  }
}
</script>

<style scoped></style>
