import { handleErrorMessages } from "~/common/errorHandlers";

export const useSubscriptionStore = defineStore({
  id: "subscriptionStore",
  state: () => {
    return {
      subscriptions: [] as any[],
      fetchingSubscriptions: false,
      creatingASubscription: false,
      changingSubscriptionStatus: false,
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
      return await useNuxtApp().$axios.get("/subscription/users");
    },

    async getAUsersSubscriptions() {
      return await useNuxtApp().$axios.get("/subscription");
    },

    async activateSubscription(subscriptionId: string, newStatus: boolean) {
      try {
        this.changingSubscriptionStatus = true;
        const response = await useNuxtApp().$axios.patch(
          `/subscription/${subscriptionId}`,
          {
            isActive: newStatus,
          }
        );
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
      return state.subscriptions;
    },
    getSubscriptionsFetchingStatus: (state) => {
      return state.fetchingSubscriptions;
    },
    getSubscriptionsStatusChangingStatus: (state) => {
      return state.changingSubscriptionStatus;
    },
  },
});
