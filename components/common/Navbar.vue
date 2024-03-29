<script setup>
import { useAuthStore } from "~/stores/auth";
import { useNotificationStore } from "~/stores/notification";
import { useToast } from "vue-toastification";

const notifications = useNotificationStore();
const auth = useAuthStore();

await notifications.limitNotifications();

const channel = pusher.subscribe("dphe-notification-channel");
channel.bind("dphe-notification-event", async function (data) {
  if (
    data.message.user_id === auth.user.id &&
    ["all", "web"].includes(data.message.platform)
  ) {
    //   if(notifications.length == 5){
    //     notifications.splice(-1);
    //   }
    //   notifications.unshift(data.message);
    //   unread_notification.value = +unread_notification.value + 1;
    await notifications.limitNotifications();
  }
});

const markAllAsRead = async () => {
  try {
    const url = api_url + "mark-as-read";

    const res = await $fetch(url, {
      method: "POST",
      body: JSON.stringify({
        user_id: auth.user.id,
        mark_all: true,
      }),
    });

    if (res.status === 200) {
      await notifications.limitNotifications();
    } else {
      useToast().error(res);
    }
  } catch (e) {
    console.log(e);
  }
};
</script>

<template>
  <nav
    class="main-header navbar navbar-expand navbar-white navbar-light custom-navbar-background"
  >
    <!-- Left navbar links -->
    <ul class="navbar-nav">
      <li class="nav-item">
        <a class="nav-link pl-0" data-widget="pushmenu" href="#" role="button"
          ><i class="fas fa-bars"></i
        ></a>
      </li>
    </ul>

    <!-- Right navbar links -->
    <ul class="navbar-nav ml-auto">
      <li>
          <div class="mt-2">
              <!-- <toggle-button
                  :width="75"
                  :height="25"
                  :color="{unchecked: '#198754', checked: 'rgb(10,88,202)'}"
                  :font-size="12"
                  :show-labels="true"
                  :rounded="true"
                  @change="changeLanguage"
                  :labels="{checked: 'English', unchecked: 'বাংলা'}"
              /> -->
          </div>

      </li>

      <li class="nav-item dropdown">
        <a class="nav-link" data-toggle="dropdown" href="#">
          <i class="far fa-bell"></i>
          <span class="badge badge-warning navbar-badge">{{
            notifications.unread_count != 0 ? notifications.unread_count : ""
          }}</span>
        </a>
        <div class="dropdown-menu dropdown-menu-lg dropdown-menu-right">
          <!-- <span class="dropdown-item dropdown-header">{{notifications.unread_count}} Notifications Unread</span> -->
          <span
            class="dropdown-item dropdown-header"
            style="cursor: pointer"
            @click="markAllAsRead"
            >Mark all as read</span
          >
          <div class="dropdown-divider"></div>

          <NuxtLink
            :to="notification.web_url + '?notification_id=' + notification.id"
            class="dropdown-item notification-item"
            :class="notification.read_at === null ? 'notification-unread' : ''"
            v-for="(notification, sl) in notifications.limit_notifications"
            :key="sl"
          >
            <!-- <i class="fas fa-envelope mr-2"></i> -->
            <span v-html="notification.title"></span>
            <br />
            <span class="text-muted text-sm">{{
              notification.created_at_human
            }}</span>
          </NuxtLink>

          <div class="dropdown-divider"></div>
          <NuxtLink to="/notifications" class="dropdown-item dropdown-footer"
            >See All Notifications</NuxtLink
          >
        </div>
      </li>

      <!-- Messages Dropdown Menu -->
      <!-- <li class="nav-item dropdown mr-2">
          <NuxtLink to="/chat-candidate" class="nav-link">
              <i class="far fa-comments"></i>
          </NuxtLink>
      </li> -->

      <li class="nav-item">
        <p class="navbar-user-info">
          <strong>{{ auth.user?.name }}</strong> <br />
          {{ auth.user?.designation?.name }}
        </p>
      </li>

      <li class="nav-item dropdown">
        <a class="nav-link navbar-user-logo" data-toggle="dropdown" href="#">
          <img
            class="img-circle" 
            :src="auth?.user?.photo_url" 
            alt="test" >
        </a>
        <div
          class="dropdown-menu dropdown-menu-sm dropdown-menu-right"
          style="margin-top: 10px"
        >
          <NuxtLink class="dropdown-item" to="/profiles">
            <i class="fas fa-user mr-2"></i> Profile
          </NuxtLink>
          <div class="dropdown-divider"></div>
          <a href="javascript:" class="dropdown-item" @click="auth.logout()">
            <i class="fa fa-sign-out-alt mr-2"></i> Sign Out
          </a>
        </div>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.custom-font-size {
  font-size: 16px;
}
</style>
