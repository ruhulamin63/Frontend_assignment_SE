<script setup>
import { useAuthStore } from "~/stores/auth";
const auth = useAuthStore();
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
      <li class="nav-item">
        <p class="navbar-user-info">
          <strong>{{ auth.user?.name }}</strong> <br />
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
