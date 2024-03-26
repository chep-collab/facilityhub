const runtimeConfig = useRuntimeConfig();

export const useCompanyServiceStore = defineStore({
  id: "companyServiceStore",
  state: () => {
    return {
      services: [] as any[],
      fetchingServices: false,
    };
  },
  actions: {
    async fetchCompanyServices() {
      try {
        this.fetchingServices = true;
        const { data, error } = await useFetch("/company-service", {
          // method: "POST",
          key: new Date().toISOString(),
          baseURL: runtimeConfig.public.apiUrl,
          onRequest({ request, options }) {
            options.headers = options.headers || {};
            options.headers.authorization =
              "Bearer " + localStorage.getItem("accessToken");
          },
        });
        const response: any = data.value;
        const res = [];
        for (let i = 0; i < response.length; i++) {
          const service = response[i];
          res.push({
            id: i + 1,
            service: service.name,
            description: service.description,
            isActive: service.isActive,
            amount: service.companyServicePrice.amount,
            period: service.companyServicePrice.period,
          });
        }
        this.services = res;
        if (error.value) throw error.value.data.message;
      } catch (error) {
      } finally {
        this.fetchingServices = false;
      }
    },
  },
  getters: {
    getCompanyServices: (state) => {
      return state.services;
    },
  },
});
