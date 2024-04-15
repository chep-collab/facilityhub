import posthog from "posthog-js";
export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost,
    capture_pageview: false,
    loaded: (posthog) => {
      if (import.meta.env.MODE === "development") posthog.debug();
    },
  });

  // Make sure that pageviews are captured with each route change
  const router = useRouter();
  router.afterEach((to) => {
    nextTick(() => {
      posthog.capture("$pageview", {
        current_url: to.fullPath,
        current_page_name: to.name,
      });
    });
  });

  return {
    provide: {
      posthog: () => posthogClient,
    },
  };
});
