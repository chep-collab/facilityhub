import axios from "axios";

// A function to handle error messages globally
function handleErrorMessages(error: any): string {
  if (error.response) {
    return error.response.data.message || "Something went wrong. Please try again.";
  } else if (error.request) {
    return "No response from the server. Please check your connection.";
  } else {
    return "An unknown error occurred.";
  }
}


export default defineNuxtPlugin(async () => {
  const runtimeConfig = useRuntimeConfig();
  const activeUserStore = useActiveUserStore();
  const router = useRouter();

  const $axios = axios.create({
    baseURL: runtimeConfig.public.apiUrl,
    timeout: 10000,
  });

  $axios.interceptors.request.use((config) => {
    const accessToken = localStorage.getItem("accessToken");
    config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  $axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        activeUserStore.setAuthenticationState(false);
        if (activeUserStore.getUserType == "company") {
          router.push({ name: "company-login" });
        } else {
          router.push({ name: "user-login" });
        }
      }
      
      const userFriendlyMessage = handleErrorMessages(error);
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: $axios,
    },
  };
});
