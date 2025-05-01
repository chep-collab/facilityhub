export default defineNuxtRouteMiddleware(async (to, from) => {
  const activeUserStore = useActiveUserStore();
  const toast = useToast();
  const runtimeConfig = useRuntimeConfig();
  const activateComingSoon = runtimeConfig.public.activateComingSoon;

  const nuxtapp = useNuxtApp();
  const companyStore = useCompanyServiceStore();
  const { getCompanyOnboardingStatus } = companyStore;

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
    if (toast) {
      toast?.add({
        title: "Please login",
        color: "amber",
      });
    }

    if (activeUserStore.getUserType == "company") {
      return navigateTo({ name: "company-login" });
    } else {
      return navigateTo({ name: "user-login" });
    }
  }

  if (
    !from.name?.toString().includes("dashboard") &&
    activeUserStore.getUserType === "company" &&
    destinationName.includes("dashboard") &&
    getAuthenticationState.value
  ) {
    try {
      const response = await getCompanyOnboardingStatus();
      const onboardingStatus = response.data;

      const steps = onboardingStatus?.steps;
      if (steps && !Object.values(steps).every((step: any) => step.completed)) {
        return navigateTo({ name: "onboarding" });
      }
    } catch (error) {
      return navigateTo({ name: "company-login" });
    }
  }
  if (destinationName.includes("login") && getAuthenticationState.value) {
    return navigateTo({ name: "dashboard" });
  }
});
