import { handleErrorMessages } from "~/common/errorHandlers";
import { useActiveUserStore } from "#imports";
import { storeToRefs } from "#imports";
const toast = useToast();
const {
  posthog: { captureEvent, ALLOWED_EVENT_NAMES },
} = usePosthog();

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
      facilityAmenities: [] as {}[],
      onboardingStatus: {} as any,
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
            avatarUrl: service.avatarUrl || "",
          });
        }
        captureEvent(ALLOWED_EVENT_NAMES.FETCH_COMPANY_SERVICES, {});
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
    async fetchFacilityAmenities() {
      const { userDetails } = storeToRefs(useActiveUserStore());
      const facilityTypeId = userDetails.value?.facility_types[0]?.id;
      try {
        const response = await useNuxtApp().$axios.get(
          `/facility-types/${facilityTypeId}/amenities`
        );
        return { data: response?.data, result: "success" };
      } catch (error) {
        return { data: error?.response?.data?.message, result: "error" };
      }
    },
    async addAmenitiesToCompany(ids: number[]) {
      try {
        const response = await useNuxtApp().$axios.post(`/company/amenities`, {
          amenityIds: ids,
        });
        this.onboardingStatus = response.data;
        return { data: response?.data, result: "success" };
      } catch (error) {
        return { data: error?.response?.data?.message, result: "error" };
      }
    },
    async updateCompanyProfile({
      key,
      value,
    }: {
      key: string;
      value: boolean;
    }) {
      try {
        await useNuxtApp().$axios.patch("/company/update", {
          key: value,
        });
        return { data: "Profile updated", result: "success" };
      } catch (error) {
        return { data: error?.response?.data?.message, result: "error" };
      }
    },
    async getCompanyOnboardingStatus() {
      try {
        const response = await useNuxtApp().$axios.get(
          "/company/onboarding-statuses"
        );
        this.onboardingStatus = response?.data;
        return { data: response?.data, result: "success" };
      } catch (error) {
        return { data: error?.response?.data?.message, result: "error" };
      }
    },
    async createNewService(
      name: string,
      description: string,
      amount: number,
      period: string,
      avatar: File
    ) {
      try {
        this.creatingService = true;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (avatar) {
          formData.append("avatar", avatar, avatar.name);
        }
        const serviceResponse = await useNuxtApp().$axios.post(
          "/company-service",
          formData
        );

        const priceResponse = await useNuxtApp().$axios.post(
          "/company-service-price",
          {
            serviceId: serviceResponse.data.id,
            amount,
            period,
          }
        );
        captureEvent(ALLOWED_EVENT_NAMES.COMPANY_CREATE_SERVICE, {
          ...serviceResponse.data,
          ...priceResponse.data,
        });
        await this.fetchCompanyServices();
      } catch (error: any) {
        throw error;
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
      period: string,
      avatar: File
    ) {
      try {
        this.creatingService = true;
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        if (avatar) {
          formData.append("avatar", avatar, avatar.name);
        }
        await useNuxtApp().$axios.patch(
          `/company-service/${serviceId}`,
          formData
        );

        await useNuxtApp().$axios.patch(
          `/company-service-price/${servicePriceId}`,
          {
            amount,
            period,
          }
        );
        captureEvent(ALLOWED_EVENT_NAMES.COMPANY_UPDATE_SERVICE, {});
        await this.fetchCompanyServices();
      } catch (error: any) {
        throw error;
      } finally {
        this.creatingService = false;
      }
    },
    async updateCompanyServiceStatus(serviceId: string, isActive: boolean) {
      try {
        this.updatingCompanyServiceStatus = true;
        await useNuxtApp().$axios.patch(`/company-service/${serviceId}`, {
          isActive: `${isActive}`,
        });
        captureEvent(ALLOWED_EVENT_NAMES.COMPANY_UPDATE_SERVICE_STATUS, {
          status: isActive,
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
        captureEvent(ALLOWED_EVENT_NAMES.COMPANY_DELETE_SERVICE, {});
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
