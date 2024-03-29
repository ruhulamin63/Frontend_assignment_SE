import { useAuthStore } from "~/stores/auth";
import { useNotificationStore } from "~/stores/notification";

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (useAuthStore().user !== null) {
    if (to.query.hasOwnProperty("notification_id")) {
      try {
        const url = useRuntimeConfig().public["apiBaseUrl"] + "mark-as-read";

        await $fetch(url, {
          method: "POST",
          body: JSON.stringify({
            user_id: useAuthStore().user.id,
            id: to.query.notification_id,
          }),
        });
      } catch (e) {
        console.log(e);
      }
    }

    useNotificationStore().limitNotifications();
  }
});
