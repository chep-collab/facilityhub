import { handleErrorMessages } from "~/common/errorHandlers";
import { useActiveUserStore } from "#imports";
import { storeToRefs } from "#imports";
import { useNuxtApp } from "#imports";
import type { baseEndpointPayload } from "~/types/component";
// const toast = useToast();

export const useCompanyServiceStore = defineStore({
  id: "companyServiceStore",
  state: () => {
    return {
      services: [] as any[],
      settlementAccounts: [],
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
        const {
          posthog: { captureEvent, ALLOWED_EVENT_NAMES },
        } = usePosthog();

        captureEvent(ALLOWED_EVENT_NAMES.FETCH_COMPANY_SERVICES, {});
        this.services = res;
      } catch (error: any) {
        if (error) {
          // const toast = useToast();
          // toast.add({
          //   title: handleErrorMessages(error),
          //   color: "red",
          // });
        }
      } finally {
        this.fetchingServices = false;
      }
    },
    async fetchMyCompanyAmenities() {
      try {
        const response = await useNuxtApp().$axios.get(`/company/amenities`);
        return { data: response?.data, result: "success" };
      } catch (error) {
        return { data: error?.response?.data?.message, result: "error" };
      }
    },
    async AddMyCompanyAmenities(payload: { [key: string]: Number[] }) {
      const { amenityIds } = payload;
      try {
        const response = await useNuxtApp().$axios.post(`/company/amenities`, {
          amenityIds,
        });
        return { data: response?.data, result: "success" };
      } catch (error) {
        return { data: error?.response?.data?.message, result: "error" };
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
    async fetchCompanySettlementAccount(id:string) {
      try {
        const response = await useNuxtApp().$axios.get(`/settlement-account/company/${id}`);
        this.settlementAccounts = response.data;
        return { data: response?.data, result: "success" };
      } catch (error) {
        return { data: error?.response?.data?.message, result: "error" };
      }
    },
    async changeCompanyPassword(payload: baseEndpointPayload) {
      const { oldPassword, newPassword } = payload;
      try {
        const response = await useNuxtApp().$axios.post(
          "/company/change-password",
          {
            oldPassword,
            newPassword,
          }
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
        return { data: response?.data, result: "success" };
      } catch (error) {
        return { data: error?.response?.data?.message, result: "error" };
      }
    },
    async updateCompanyProfile(payload: baseEndpointPayload) {
      try {
        await useNuxtApp().$axios.patch("/company/update", {
          ...payload,
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
    async createNewService({
      name,
      amount,
      period,
      description,
      avatar,
    }: {
      name: string;
      amount: number;
      period: string;
      description?: string;
      avatar?: File;
    }) {
      try {
        this.creatingService = true;
        const serviceNamePayload = {
          name: name,
          description: description,
        };
        const serviceResponse = await useNuxtApp().$axios.post(
          "/company-service",
          serviceNamePayload
        );

        const priceResponse = await useNuxtApp().$axios.post(
          "/company-service-price",
          {
            serviceId: serviceResponse.data.id,
            amount,
            period,
          }
        );
        const {
          posthog: { captureEvent, ALLOWED_EVENT_NAMES },
        } = usePosthog();
        captureEvent(ALLOWED_EVENT_NAMES.COMPANY_CREATE_SERVICE, {
          ...serviceResponse.data,
          ...priceResponse.data,
        });

        await this.fetchCompanyServices();
        return { data: "Service created", result: "success" };
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
        const {
          posthog: { captureEvent, ALLOWED_EVENT_NAMES },
        } = usePosthog();

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
        const response = await useNuxtApp().$axios.patch(
          `/company-service/${serviceId}`,
          {
            isActive: `${isActive}`,
          }
        );
        const {
          posthog: { captureEvent, ALLOWED_EVENT_NAMES },
        } = usePosthog();

        captureEvent(ALLOWED_EVENT_NAMES.COMPANY_UPDATE_SERVICE_STATUS, {
          status: isActive,
        });
        this.fetchCompanyServices();
        return { data: response.data, result: "success" };
      } catch (error: any) {
        if (error) {
          // toast.add({
          //   title: handleErrorMessages(error),
          //   color: "red",
          // });
        }
        return { data: error.response?.data?.message, result: "error" };
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

        // toast.add({
        //   title: response.data.message || "service removed",
        //   color: "green",
        // });
        const {
          posthog: { captureEvent, ALLOWED_EVENT_NAMES },
        } = usePosthog();

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
