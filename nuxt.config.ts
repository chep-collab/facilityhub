// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    ["@pinia/nuxt", { autoImports: ["defineStore", "acceptHMRUpdate"] }],
    "@pinia-plugin-persistedstate/nuxt",
  ],
  imports: {
    dirs: ["stores"],
  },
  ssr: false,
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
    },
  },
});
