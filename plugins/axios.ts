import axios from "axios";

export default defineNuxtPlugin(async () => {
  const runtimeConfig = useRuntimeConfig();

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
        console.log("Received 403 Forbidden error. Logging out user...");

        alert("Session expired. Please log in again.");

        localStorage.clear();
        const router = useRouter();
        router.push("/");
      }
      return Promise.reject(error);
    }
  );

  return {
    provide: {
      axios: $axios,
    },
  };
});
