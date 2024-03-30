import { handleErrorMessages } from "~/common/errorHandlers";

export const useSubscriptionStore = defineStore({
  id: "subscriptionStore",
  state: () => {
    return {
      subscriptions: [] as any[],
      fetchingSubscriptions: false,
      creatingASubscription: false,
    };
  },
  actions: {
    async fetchCompanySubscriptions() {
      try {
        this.fetchingSubscriptions = true;
        const response = await useNuxtApp().$axios.get("/subscription/users");
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
  },
  getters: {
    getSubscriptions: (state) => {
      return state.subscriptions;
    },
    getSubscriptionsFetchingStatus: (state) => {
      return state.fetchingSubscriptions;
    },
  },
});
