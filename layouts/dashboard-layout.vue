<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const router = useRoute();

const activeUser = useActiveUser();
</script>
<template>
  <div>
    <div class="py-3 px-3 flex flex-row justify-between">
      <h1 class="w-12">Workspaces ({{ activeUser }})</h1>
      <div class="flex flex-row gap-4">
        <UButton color="white" variant="solid">Profile</UButton>
        <UButton to="/company/login" color="white" variant="solid"
          >Logout</UButton
        >
      </div>
    </div>
    <Navigation />
    <slot />
    <Footer />
  </div>
</template>
