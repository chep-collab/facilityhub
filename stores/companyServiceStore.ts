const runtimeConfig = useRuntimeConfig();

export const useCompanyServiceStore = defineStore({
  id: "companyServiceStore",
  state: () => {
    return {
      services: [] as any[],
      fetchingServices: false,
      creatingService: false,
    };
  },
  actions: {
    async fetchCompanyServices() {
      try {
        this.fetchingServices = true;
        const { data, error } = await useFetch("/company-service", {
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
            amount: service.companyServicePrice?.amount || "N/A",
            period: service.companyServicePrice?.period || "N/A",
          });
        }
        this.services = res;
        if (error.value) throw error.value.data.message;
      } catch (error) {
      } finally {
        this.fetchingServices = false;
      }
    },
    async createNewService(
      name: string,
      description: string,
      amount: number,
      period: string
    ) {
      try {
        console.log({ name, description, amount, period });
        this.creatingService = true;
        const { data, error } = await useFetch("/company-service", {
          method: "POST",
          body: {
            name,
            description,
          },
          baseURL: runtimeConfig.public.apiUrl,
          onRequest({ request, options }) {
            options.headers = options.headers || {};
            options.headers.authorization =
              "Bearer " + localStorage.getItem("accessToken");
          },
        });
        if (error.value) throw error.value.data.message;

        const { data: data2, error: error2 } = await useFetch(
          `/company-service-price`,
          {
            method: "POST",
            baseURL: runtimeConfig.public.apiUrl,
            body: {
              serviceId: data.value.id,
              amount,
              period,
            },
            onRequest({ request, options }) {
              options.headers = options.headers || {};
              options.headers.authorization =
                "Bearer " + localStorage.getItem("accessToken");
            },
          }
        );
        if (error2.value) throw error.value2.data.message;
        await this.fetchCompanyServices();
      } catch (error) {
      } finally {
        this.creatingService = false;
      }
    },
  },
  getters: {
    getCompanyServices: (state) => {
      return state.services;
    },
    getFetchingCompanyServicesLoadingState: (state) => {
      return state.fetchingServices;
    },
    getCreatingCompanyServicesLoadingState: (state) => {
      return state.creatingService;
    },
  },
});
