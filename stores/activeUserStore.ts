import type { baseEndpointPayload } from "~/types/component";

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
    async changeUserPassword(payload: baseEndpointPayload, userType: string) {
      const { oldPassword, newPassword } = payload;
      try {
        const response = await useNuxtApp().$axios.post(
          `/${userType}/change-password`,
          {
            oldPassword,
            newPassword,
          }
        );
        return { data: response?.data, result: "success" };
      } catch (error) {
        return { data: error?.response?.data?.message, result: "error" };
      }
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
