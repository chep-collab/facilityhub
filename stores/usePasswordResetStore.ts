import { defineStore } from 'pinia'; // importing the defineStore function from Pinia


//Initializing the states to false to set a default state.
export const usePasswordResetStore = defineStore({
  id: 'passwordResetStore',
  state: () => ({
    resettingPassword: false,
    resetSuccess: false,
    error: null as string | null,
    sendingForgotPasswordRequest: false,
  }),
  actions: {
    //this is the reset password action
    async resetPassword(email: string, resetType: 'user' | 'company') {
      this.resettingPassword = true;
      this.error = null;
      try {
        const endpoint = resetType === 'user' ? '/user/reset-password' : '/company/reset-password';
        
        const response = await useNuxtApp().$axios.post(endpoint, { email });
        this.resetSuccess = true;
        return response;
      } catch (error: any) { 
        this.error = error.response?.data?.message || 'Something went wrong!';
        throw error;
      } finally {
        this.resettingPassword = false;
      }
    },

    //this is the forgot password action/logic
    async forgotPassword(email: string, resetType: 'user' | 'company') {
      this.sendingForgotPasswordRequest = true;
      this.error = null;
      try {
        const endpoint = resetType === 'user' ? '/user/forgot-password' : '/company/forgot-password';

        const response = await useNuxtApp().$axios.post(endpoint, { email });
        this.resetSuccess = true;
        return response;
      } catch (error: any) {
        this.error = error.response?.data?.message || 'Something went wrong!';
        throw error;
      } finally {
        this.sendingForgotPasswordRequest = false;
      }
    },
  },
  getters: {
    isResetting: (state) => state.resettingPassword,
    isSendingForgotPasswordRequest: (state) => state.sendingForgotPasswordRequest,
    getError: (state) => state.error,
    wasResetSuccessful: (state) => state.resetSuccess,
  },
});
