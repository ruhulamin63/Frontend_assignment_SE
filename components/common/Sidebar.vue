<script setup lang="ts">
  import { useAuthStore } from "../../stores/auth";
</script>

<template>
  <aside class="main-sidebar">
    <!-- Brand Logo -->
    <NuxtLink class="brand-link text-center custom-navbar-background" to="/">
      <img
        src="../../images/soft_zeno.png"
        alt="AdminLTE Logo"
        class="right-logo"
        style="opacity: 0.8"
      />
      <span class="brand-text font-weight-light">Assignment</span>
    </NuxtLink>

    <!-- Sidebar -->
    <div class="sidebar">
      <!-- Sidebar Menu -->
      <nav class="mt-2">
        <ul
          class="nav nav-pills nav-sidebar flex-column"
          data-widget="treeview"
          role="menu"
          data-accordion="false"
        >
          <li class="nav-item">
            <NuxtLink class="nav-link" to="/">
              <i class="nav-icon fas fa-th-large"></i>
              <p>Dashboard</p>
            </NuxtLink>
          </li>

          <li
            class="nav-item"
          >
            <a href="#" class="nav-link">
              <i class="nav-icon fab fa-artstation"></i>
              <p>
                Product Management
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>

            <ul
              class="nav nav-treeview"
            >
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/">
                  <i class="fab fa-accusoft"></i>
                  <p>Products</p>
                </NuxtLink>
              </li>
            </ul>
            <ul
              class="nav nav-treeview"
            >
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/categories">
                  <i class="fab fa-accusoft"></i>
                  <p>Categories</p>
                </NuxtLink>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <!-- /.sidebar-menu -->
    </div>
    <!-- /.sidebar -->
  </aside>
</template>

<style scoped></style>
