import { defineStore } from "pinia";
import { useToast } from "vue-toastification";
import {useAuthStore} from "~/stores/auth";

export const useNotificationStore = defineStore("notification", {
  state: () => ({
    unread_count: 0,
    limit_notifications: [],
  }),
  actions: {
    async limitNotifications(params = {limit: 5}) {
        try {
            params.user_id = useAuthStore().user.id;
    
            const response = await $fetch(
              useRuntimeConfig().public["apiBaseUrl"] + "get-limit-notifications",
              {
                params,
              }
            );
            
            this.limit_notifications = response.notifications;
            this.unread_count = response.unread_count;

          } catch (error) {
            if (error.response.status === 401) {
                useToast().warning(error.response._data.data.message);
            } else {
                console.log(error);
            }
        }
    },
  },
});
