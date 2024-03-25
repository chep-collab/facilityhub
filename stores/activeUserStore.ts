export const useActiveUserStore = defineStore({
  id: "activeUserStore",
  state: () => {
    return {
      userType: "",
      userDetails: {},
    };
  },
  actions: {
    fetchUserDetails(type: string) {
      // fetch from the backend
      //set the user's details
    },
  },
  getters: {
    getUserType: (state) => {
      return state.userType;
    },
    getUserDetails: (state) => {
      return state.userDetails;
    },
  },
});
