import { useRouter } from "vue-router";
import { useActiveUserStore } from "~/stores/activeUserStore";
import { useCompanyServiceStore } from "~/stores/companyServiceStore";

export function useLogout() {
  const router = useRouter();
  const activeUserStore = useActiveUserStore();
  const companyServiceStore = useCompanyServiceStore();

  function resetStores() {
    activeUserStore.$reset();
    companyServiceStore.$reset();
  }

  const logout = () => {
    localStorage.clear();
    activeUserStore.setAuthenticationState(false);

    if (activeUserStore.userType === "company") {
      router.push({ name: "company-login" });
      resetStores();
    } else {
      router.push({ name: "user-login" });
      resetStores();
    }
  };

  return { logout };
}
