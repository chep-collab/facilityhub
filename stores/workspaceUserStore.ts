const {
  posthog: { captureEvent, ALLOWED_EVENT_NAMES },
} = usePosthog();

export const useWorkspaceUserStore = defineStore({
  id: "workspaceUserStore",
  state: () => {
    return {
      users: [],
      fetchingWorkspaceUsers: false,
    };
  },
  actions: {
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
  },
  getters: {
    getFetchingWorkspaceUserState: (state) => {
      return state.fetchingWorkspaceUsers;
    },
    getWorkspaceUsers: (state) => {
      return state.users;
    },
  },
  persist: true,
});
