export default defineNuxtRouteMiddleware((to, from) => {
  const activeUserStore = useActiveUserStore();
  const toast = useToast();
  const router = useRouter();

  const { getAuthenticationState } = storeToRefs(activeUserStore);
  const destinationName = to.name as string;
  if (
    destinationName.includes("dashboard") &&
    getAuthenticationState.value === false
  ) {
    toast.add({
      title: "Please login",
      color: "amber",
    });
    if (activeUserStore.getUserType == "company") {
      router.push({ name: "company-login" });
    } else {
      router.push({ name: "user-login" });
    }
  }
});
