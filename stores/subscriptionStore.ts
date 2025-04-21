import { handleErrorMessages } from "~/common/errorHandlers";
const {
  posthog: { captureEvent, ALLOWED_EVENT_NAMES },
} = usePosthog();

export const useSubscriptionStore = defineStore({
  id: "subscriptionStore",
  state: () => {
    return {
      subscriptions: {} as Record<string, any>,
      fetchingSubscriptions: false,
      creatingASubscription: false,
      changingSubscriptionStatus: false,
      uploadingSubscriptionReceipt: false,
      subscribingToAService: false,
    };
  },
  actions: {
    async fetchCompanySubscriptions() {
      try {
        this.fetchingSubscriptions = true;
        let response;
        const { getUserType } = useActiveUserStore();
        if (getUserType === "company") {
          response = await this.getCompanySubscriptions();
        } else {
          response = await this.getAUsersSubscriptions();
        }
        const res = [];
        for (let i = 0; i < response.data.length; i++) {
          const service = response.data[i];
          res.push({
            id: i + 1,
            service: service.name,
            description: service.description,
            isActive: service.isActive,
            amount: service.companyServicePrice?.amount || "N/A",
            period: service.companyServicePrice?.period || "N/A",
          });
        }
        this.subscriptions = response.data;
      } catch (error: any) {
        if (error) {
          const toast = useToast();
          toast.add({
            title: handleErrorMessages(error),
            color: "red",
          });
        }
      } finally {
        this.fetchingSubscriptions = false;
      }
    },

    async getCompanySubscriptions() {
      const response = await useNuxtApp().$axios.get("/subscription/users");
      captureEvent(ALLOWED_EVENT_NAMES.FETCHED_SUBSCRIPTIONS, {});
      this.subscriptions = response.data.data
      return response;
    },

    async getAUsersSubscriptions(status?: "active" | "inactive" | "expired") {
      const response = await useNuxtApp().$axios.get(
        `/subscription${status ? `?status=${status}` : ""}`
      );
      captureEvent(ALLOWED_EVENT_NAMES.FETCHED_SUBSCRIPTIONS, {});
      return response;
    },

    async uploadSubscriptionReceipt(
      subscriptionId: string,
      formData: FormData
    ) {
      try {
        this.uploadingSubscriptionReceipt = true;
        const response = await useNuxtApp().$axios.post(
          `/subscription/${subscriptionId}/upload-receipt`,
          formData
        );
        captureEvent(ALLOWED_EVENT_NAMES.UPLOADED_SUBSCRIPTION_RECEIPT, {});
        await this.fetchCompanySubscriptions();
      } catch (error) {
        throw error;
      } finally {
        this.uploadingSubscriptionReceipt = false;
      }
    },

    async subscribeToACompanyService(payload: {
      serviceId: string;
      startDate: string;
      endDate: string;
    }) {
      try {
        this.subscribingToAService = true;
        const response = await useNuxtApp().$axios.post("/subscription/user", {
          ...payload,
        });
        captureEvent(ALLOWED_EVENT_NAMES.SUBSCRIBED_TO_A_SERVICE, {});
        return response;
      } catch (error) {
        throw error;
      } finally {
        this.subscribingToAService = false;
      }
    },
    async activateSubscription(subscriptionId: string) {
      try {
        this.changingSubscriptionStatus = true;
        const response = await useNuxtApp().$axios.patch(
          `/subscription/${subscriptionId}`,
          {
            status: "active",
          }
        );
        captureEvent(ALLOWED_EVENT_NAMES.ACTIVATED_A_SUBSCRIPTION, {});
        await this.fetchCompanySubscriptions();
      } catch (error: any) {
        throw error;
      } finally {
        this.changingSubscriptionStatus = false;
      }
    },
  },
  getters: {
    getSubscriptions: (state) => {
      return state.subscriptions.data;
    },
    getSubscriptionsFetchingStatus: (state) => {
      return state.fetchingSubscriptions;
    },
    getSubscriptionsStatusChangingStatus: (state) => {
      return state.changingSubscriptionStatus;
    },
    getSubscriptionCreationStatus: (state) => {
      return state.subscribingToAService;
    },
  },
});
