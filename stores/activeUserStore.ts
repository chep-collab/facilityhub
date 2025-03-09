type userStoreState = {
  userType: string;
  userDetails: {};
  isAuthenticated: boolean;
};
export const useActiveUserStore = defineStore({
  id: "activeUserStore",
  state: (): userStoreState => {
    return {
      userType: "",
      userDetails: {},
      isAuthenticated: false,
    };
  },
  actions: {
    setUserDetails(value: {}) {
      this.userDetails = value;
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
