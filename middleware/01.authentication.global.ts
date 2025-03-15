export default defineNuxtRouteMiddleware(async (to, from) => {
  const activeUserStore = useActiveUserStore();
  const toast = useToast();
  const runtimeConfig = useRuntimeConfig();
  const activateComingSoon = runtimeConfig.public.activateComingSoon;
  const onboardingStatus = useState("onboardingStatus", () => null);

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
    destinationName.includes("dashboard") &&
    getAuthenticationState.value === false
  ) {
    toast.add({
      title: "Please login",
      color: "amber",
    });
    if (activeUserStore.getUserType == "company") {
      return navigateTo({ name: "company-login" });
    } else {
      return navigateTo({ name: "user-login" });
    }
  }

  if (destinationName.includes("dashboard") && getAuthenticationState.value) {
    try {
      if (!onboardingStatus.value) {
        const response = await useNuxtApp().$axios.get(
          "/company/onboarding-statuses"
        );
        onboardingStatus.value = response.data;
      }

      const steps = onboardingStatus.value?.steps;
      if (steps && Object.values(steps).every((step: any) => step.completed)) {
        return navigateTo({ name: "dashboard" });
      } else {
        return navigateTo({ name: "onboarding" });
      }
    } catch (error) {
      console.error("Error checking onboarding status:", error);
      return; 
    }
  }
  if (destinationName.includes("login") && getAuthenticationState.value) {
    return navigateTo({ name: "dashboard" });
  }
});
