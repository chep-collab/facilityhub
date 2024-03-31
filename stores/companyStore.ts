import { handleErrorMessages } from "~/common/errorHandlers";

export const useCompanyStore = defineStore({
  id: "companyStore",
  state: () => {
    return {
      joinedCompanies: [] as any[],
      companyDetails: {},
      fetchingCompanies: false,
      fetchingCompanyDetails: false,
      selectedCompanyId: "",
    };
  },
  actions: {
    async fetchCompanyJoinedByAUser() {
      try {
        this.fetchingCompanies = true;
        const response = await useNuxtApp().$axios.get("/user/companies");
        this.joinedCompanies = response.data;
      } catch (error: any) {
        if (error) {
          const toast = useToast();
          toast.add({
            title: handleErrorMessages(error),
            color: "red",
          });
        }
      } finally {
        this.fetchingCompanies = false;
      }
    },
    async fetchCompanyDetail(companyId: string) {
      try {
        this.fetchingCompanyDetails = true;
        const response = await useNuxtApp().$axios.get(`/company/${companyId}`);
        this.companyDetails = response.data;
      } catch (error: any) {
        if (error) {
          const toast = useToast();
          toast.add({
            title: handleErrorMessages(error),
            color: "red",
          });
        }
      } finally {
        this.fetchingCompanyDetails = false;
      }
    },
  },
  getters: {
    getCompaniesAUserJoined: (state) => {
      return state.joinedCompanies;
    },
  },
});
