import { defineStore } from "pinia";
import { useToast } from "vue-toastification";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    isAuthenticated: localStorage.getItem("AUTH_STATUS") || false,
    user: null,
    token: localStorage.getItem("AUTH_TOKEN") || null,
    permissions: [],
    roles: [],
  }),
  
  actions: {
    async signIn(formData, submitDisabled) {
      try {
        const response = await $fetch(
          useRuntimeConfig().public["apiBaseUrl"] + "auth/signin",
          {
            method: "POST",
            body: JSON.stringify(formData.value),
          }
        );

        if (response.status === "success") {
          this.isAuthenticated = true;
          this.user = response.data.user;
          this.token = response.data.token;
          this.roles = response?.data?.user?.role;
          this.permissions = response?.data?.user?.permissions;

          localStorage.setItem("AUTH_STATUS", this.isAuthenticated);
          localStorage.setItem("AUTH_TOKEN", response.data.token);

          window.location.href = '/';
          // return navigateTo("/");
        }
      } catch (error) {
        if (error.response.status === 401) {
          useToast().warning(error.response._data.data.message);
          submitDisabled.value = false;
        }
      }
    },

    async logout() {
      try {
        const response = await $fetch(
          useRuntimeConfig().public["apiBaseUrl"] + "logout", 
          {
            method: "POST",
          }
        );

        if (response.status_code === 200) {
          this.isAuthenticated = false;
          this.user = null;
          this.token = null;
          this.roles = [];
          this.permissions = [];
          localStorage.removeItem("AUTH_STATUS");
          localStorage.removeItem("AUTH_TOKEN");
          return navigateTo("/login");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
});
