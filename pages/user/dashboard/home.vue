<script setup lang="ts">
const accessToken = ref(localStorage.getItem("accessToken"));
</script>

<template>
  <div>
    <h1>User Login</h1>
    <AppAlert>
      User token
      {{ accessToken }}
    </AppAlert>
  </div>
</template>
