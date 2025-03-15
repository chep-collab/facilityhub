export default defineNuxtRouteMiddleware(async (to, from) => {
  const activeUserStore = useActiveUserStore();
  const toast = useToast();
  const router = useRouter();
  const runtimeConfig = useRuntimeConfig(); // Referencing the runtime configuration
  const activateComingSoon = runtimeConfig.public.activateComingSoon; //targets the variable here

  // This check if Coming Soon is active, then it will redirect to coming soon page
  if (
    activateComingSoon === "yes" &&
    ((to.name as string).includes("login") ||
      (to.name as string).includes("signup"))
  ) {
    return navigateTo({ name: "coming-soon" });
  }

  const { getAuthenticationState } = storeToRefs(activeUserStore);
  const destinationName = to.name as string;
  if (
    destinationName.includes("dashboard") ||
    (destinationName.includes("onboarding") &&
      getAuthenticationState.value === false)
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

  // note: the if statement below  might need to be modified to seperate between
  // going to user login page or company login page
  // for e.g, we might want an authenticated user who clicks on the admin login page to view it
  // and we might want an authenticated company who clicks on the user login page to view it

  // A simpler approach might be to user a single login form for both user and admin
  // (Note: the dashboard view takes shapes depending on the user type that is logged in)
  // If you decide to do the above, then the if statement below will not require modification.
  // Please rememeber to clear out or modify the comment based on what you do.

  // This logic checks the onboarding status for authenticated users trying to access the dashboard
  if (destinationName.includes("dashboard") && getAuthenticationState.value) {
    try {
      const response = await useNuxtApp().$axios.get(
        "/company/onboarding-statuses"
      );
      if (
        Object.values(response.data.steps).every((step: any) => step.completed)
      ) {
        return router.push({ name: "dashboard" });
      } else {
        return router.push({ name: "onboarding" });
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
    }
  }

  // If authenticated user visits login, redirect to dashboard
  if (destinationName.includes("login") && getAuthenticationState.value) {
    return router.push({ name: "dashboard" });
  }
});
