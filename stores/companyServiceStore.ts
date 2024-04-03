import { handleErrorMessages } from "~/common/errorHandlers";
const toast = useToast();

export const useCompanyServiceStore = defineStore({
  id: "companyServiceStore",
  state: () => {
    return {
      services: [] as any[],
      fetchingServices: false,
      creatingService: false,
      subscriptionIdToUpdate: "",
      isActivateModalOpen: false,
      updatingCompanyServiceStatus: false,
      deletingCompanyServiceStatus: false,
    };
  },
  actions: {
    async fetchCompanyServices() {
      try {
        this.fetchingServices = true;
        const response = await useNuxtApp().$axios.get("/company-service");
        const res = [];
        for (let i = 0; i < response.data.length; i++) {
          const service = response.data[i];
          res.push({
            id: service.id,
            index: i + 1,
            service: service.name,
            description: service.description,
            isActive: service.isActive,
            amount: service.companyServicePrice?.amount || "N/A",
            period: service.companyServicePrice?.period || "N/A",
            serviceId: service.id,
            servicePriceId: service.companyServicePrice?.id || null,
          });
        }
        this.services = res;
      } catch (error: any) {
        if (error) {
          const toast = useToast();
          toast.add({
            title: handleErrorMessages(error),
            color: "red",
          });
        }
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
        this.creatingService = true;
        const serviceResponse = await useNuxtApp().$axios.post(
          "/company-service",
          {
            name,
            description,
          }
        );

        const priceResponse = await useNuxtApp().$axios.post(
          "/company-service-price",
          {
            serviceId: serviceResponse.data.id,
            amount,
            period,
          }
        );
        await this.fetchCompanyServices();
      } catch (error: any) {
        if (error) {
          const toast = useToast();
          toast.add({
            title: handleErrorMessages(error),
            color: "red",
          });
        }
      } finally {
        this.creatingService = false;
      }
    },
    async updateCompanyServiceAndPrice(
      serviceId: string,
      servicePriceId: string,
      name: string,
      description: string,
      amount: number,
      period: string
    ) {
      try {
        this.creatingService = true;
        await useNuxtApp().$axios.patch(`/company-service/${serviceId}`, {
          name,
          description,
        });

        await useNuxtApp().$axios.patch(
          `/company-service-price/${servicePriceId}`,
          {
            amount,
            period,
          }
        );
        await this.fetchCompanyServices();
      } catch (error: any) {
        if (error) {
          const toast = useToast();
          toast.add({
            title: handleErrorMessages(error),
            color: "red",
          });
        }
      } finally {
        this.creatingService = false;
      }
    },
    async updateCompanyServiceStatus(serviceId: string, isActive: boolean) {
      try {
        this.updatingCompanyServiceStatus = true;
        await useNuxtApp().$axios.patch(`/company-service/${serviceId}`, {
          isActive,
        });
        await this.fetchCompanyServices();
      } catch (error: any) {
        if (error) {
          toast.add({
            title: handleErrorMessages(error),
            color: "red",
          });
        }
      } finally {
        this.updatingCompanyServiceStatus = false;
      }
    },
    async deleteCompanyServiceStatus(serviceId: string) {
      try {
        this.deletingCompanyServiceStatus = true;
        const response = await useNuxtApp().$axios.delete(
          `/company-service/${serviceId}`
        );
        toast.add({
          title: response.data.message || "service removed",
          color: "green",
        });
        await this.fetchCompanyServices();
      } catch (error: any) {
        throw error;
      } finally {
        this.deletingCompanyServiceStatus = false;
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
    getCompanyServiceStatusUpdateState: (state) => {
      return state.updatingCompanyServiceStatus;
    },
    getCompanyServiceDeletingState: (state) => {
      return state.deletingCompanyServiceStatus;
    },
  },
});
