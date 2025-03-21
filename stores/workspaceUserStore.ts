const {
  posthog: { captureEvent, ALLOWED_EVENT_NAMES },
} = usePosthog();

export const useWorkspaceUserStore = defineStore({
  id: "workspaceUserStore",
  state: () => {
    return {
      users: [],
      selectedUserId: "",
      fetchingWorkspaceUsers: false,
    };
  },
  actions: {
    setSelectedUserId(id: string) {
      this.selectedUserId = id;
    },
    async fetchWorkspaceUsers() {
      try {
        this.fetchingWorkspaceUsers = true;
        const response = await useNuxtApp().$axios.get("/company/users");
        this.users = response.data;
        captureEvent(ALLOWED_EVENT_NAMES.FETCHED_FACILITY_USERS, {});
      } catch (error) {
        throw error;
      } finally {
        this.fetchingWorkspaceUsers = false;
      }
    },
    async getUserDetailsUnderCompany() {
      try {
        const response = await useNuxtApp().$axios.get(
          `/company/users/${this.selectedUserId}`
        );
        return { data: response.data, result: "success" };
      } catch (error) {
        return { data: error?.response?.data.message, result: "error" };
      }
    },
    async getCompanyUserSubscriptions() {
      try {
        const response = await useNuxtApp().$axios.get(
          `/subscription/users?userId=${this.selectedUserId}`
        );
        return { data: response.data, result: "success" };
      } catch (error) {
        return { data: error?.response?.data.message, result: "error" };
      }
    },
  },
  getters: {
    getSelectedUserId: (state) => {
      return state.selectedUserId;
    },

    getFetchingWorkspaceUserState: (state) => {
      return state.fetchingWorkspaceUsers;
    },
    getWorkspaceUsers: (state) => {
      return state.users;
    },
  },
  persist: true,
});