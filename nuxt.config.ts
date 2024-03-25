// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@pinia/nuxt"],
  ssr: false,
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },
});
