export default defineNuxtRouteMiddleware((to, from) => {
    const activeUserStore = useActiveUserStore();
    const toast = useToast();
    const router = useRouter();
    const runtimeConfig = useRuntimeConfig();


    const fromName = from.name as string;
    const destinationName = to.name as string;
    const { getAuthenticationState } = storeToRefs(activeUserStore);
    if ((destinationName == 'dashboard-invitations') && (!getAuthenticationState.value)) {
        toast.add({
            title: "Please login and click the link again to view your invitation",
            color: "amber",
        });
        router.push({ name: "user-login" });
    }
});
