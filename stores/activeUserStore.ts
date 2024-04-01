export const useActiveUserStore = defineStore({
  id: "activeUserStore",
  state: () => {
    return {
      userType: "",
      userDetails: {},
      isAuthenticated: false,
    };
  },
  actions: {
    fetchUserDetails(type: string) {
      // fetch from the backend
      //set the user's details
    },
    setAuthenticationState(value: boolean) {
      this.isAuthenticated = value;
    },
  },
  getters: {
    getUserType: (state) => {
      return state.userType;
    },
    getUserDetails: (state) => {
      return state.userDetails;
    },
    getAuthenticationState: (state) => {
      return state.isAuthenticated;
    },
  },
  persist: true,
});
