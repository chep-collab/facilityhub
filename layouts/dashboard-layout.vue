<script setup lang="ts">
const activeUserStore = useActiveUserStore();
const { userType, getUserDetails } = storeToRefs(activeUserStore);

const router = useRouter();
const logout = () => {
  localStorage.clear();
  activeUserStore.setAuthenticationState(false);
  if (userType.value == "company") {
    router.push({ name: "company-login" });
  } else {
    router.push({ name: "user-login" });
  }
};
</script>
<template>
  <div>
    <div class="py-3 px-3 flex flex-row justify-between">
      <h1 class="w-full">
        Workspace <span> {{ userType == "user" ? "User" : "Admin" }}</span>
        <br />
        <span v-if="userType == 'user'">{{
          `${getUserDetails.firstName} ${getUserDetails.lastName}`
        }}</span>
        <span v-else>{{ `${getUserDetails.name}` }}</span>
      </h1>
      <div class="flex flex-row gap-4">
        <UButton color="white" variant="solid">Profile</UButton>
        <UButton @click="logout" color="white" variant="solid">Logout</UButton>
      </div>
    </div>
    <Navigation />
    <slot />
    <Footer />
  </div>
</template>
