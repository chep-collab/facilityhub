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
