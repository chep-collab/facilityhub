// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  colorMode: {
    preference: "light",
  },
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    ["@pinia/nuxt", { autoImports: ["defineStore", "acceptHMRUpdate"] }],
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxtjs/google-fonts",
  ],
  imports: {
    dirs: ["stores"],
  },
  googleFonts: {
    families: {
      Inter: [300, 400, 500, 600, 700, 800],
    },
    display: "swap",
  },
  ssr: false,
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: process.env.FIREBASE_AUTH_DOMAIN,
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.FIREBASE_APP_ID,
      posthogPublicKey: process.env.POSTHOG_PUBLIC_KEY,
      posthogHost: process.env.POSTHOG_HOST,
      activateComingSoon: process.env.ACTIVATE_COMING_SOON,
    },
  },
});
