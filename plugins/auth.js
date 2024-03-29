import { useAuthStore } from "~/stores/auth";

export default defineNuxtPlugin(async (_nuxtApp) => {
  const authStore = useAuthStore();
  const api_url = useRuntimeConfig().public["apiBaseUrl"];

  try {
    const url = api_url + "me";
    const res = await $fetch(url, {
      headers:{
        Authorization: `Bearer ${authStore.token}`,
        Accept: "application/json",
      }
    });
    
    authStore.user = res?.data;
    authStore.roles = res?.data?.role;
    authStore.permissions = res?.data?.permissions;
  } catch (e) {
    if (e.status === 401) {
      authStore.isAuthenticated = false;
      authStore.user = null;
      authStore.token = null;
      authStore.roles = [];
      authStore.permissions = [];
      localStorage.removeItem("AUTH_STATUS");
      localStorage.removeItem("AUTH_TOKEN");
      return navigateTo("/login");
    }
  }
});
