import { handleErrorMessages } from "~/common/errorHandlers";
const {
  posthog: { captureEvent, ALLOWED_EVENT_NAMES },
} = usePosthog();

export const useCompanyStore = defineStore({
  id: "companyStore",
  state: () => {
    return {
      companies: [] as any[],
      joinedCompanies: [] as any[],
      companyDetails: {},
      fetchingCompanies: false,
      fetchingCompanyDetails: false,
      joiningCompany: false,
      selectedCompanyId: "",
    };
  },
  actions: {
    async fetchCompanyJoinedByAUser() {
      try {
        this.fetchingCompanies = true;
        const response = await useNuxtApp().$axios.get("/user/companies");
        this.joinedCompanies = response.data;
        captureEvent(ALLOWED_EVENT_NAMES.FETCH_JOINED_COMPANIES, {});
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
        captureEvent(ALLOWED_EVENT_NAMES.FETCH_COMPANY_DETAIL, {});
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
    async fetchCompanies() {
      try {
        this.fetchingCompanies = true;
        const response = await useNuxtApp().$axios.get(`/company`);
        this.companies = response.data;
        captureEvent(ALLOWED_EVENT_NAMES.FETCH_COMPANIES, {});
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
    async JoinACompnay(companyId: string) {
      try {
        this.joiningCompany = true;
        const response = await useNuxtApp().$axios.get(
          `/company/${companyId}/join`
        );
        captureEvent(ALLOWED_EVENT_NAMES.JOINED_A_COMPANY, {});
        return response;
      } catch (error: any) {
        throw error;
      } finally {
        this.joiningCompany = false;
      }
    },
  },
  getters: {
    getCompaniesAUserJoined: (state) => {
      return state.joinedCompanies;
    },
    getCompanies: (state) => {
      return state.companies;
    },
    getCompaniesFetchingStatus: (state) => {
      return state.fetchingCompanies;
    },
    getJoiningCompanyStatus: (state) => {
      return state.joiningCompany;
    },
  },
});
