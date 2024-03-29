<script setup lang="ts">
  import { useAuthStore } from "../../stores/auth";
</script>

<template>
  <aside class="main-sidebar">
    <!-- Brand Logo -->
    <NuxtLink class="brand-link text-center custom-navbar-background" to="/">
      <img
        src="../../images/bteb-logo.png"
        alt="AdminLTE Logo"
        class="right-logo"
        style="opacity: 0.8"
      />
      <span class="brand-text font-weight-light">e-RPL Platforms</span>
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
            v-if="
              checkPermissions([
                'user_access',
                'roles_access',
              ])
            "
          >
            <a href="#" class="nav-link">
              <i class="nav-icon fas fa-cogs"></i>
              <p>
                User Information
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>

            <ul
              class="nav nav-treeview"
              v-if="checkPermissions(['roles_access'])"
            >
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/roles">
                  <i class="fas fa-users"></i>
                  <p>Roles</p>
                </NuxtLink>
              </li>
            </ul>
            <ul
              class="nav nav-treeview"
              v-if="checkPermissions(['user_access'])"
            >
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/users">
                  <i class="fas fa-users"></i>
                  <p>Users</p>
                </NuxtLink>
              </li>
            </ul>
          </li>

          <li
            class="nav-item"
            v-if="
              checkPermissions([
                'basic_information_access',
              ])
            "
          >
            <a href="#" class="nav-link">
              <i class="nav-icon fab fa-creative-commons-sampling"></i>
              <p>
                Basic
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>

            <ul class="nav nav-treeview"
              v-if="
                checkPermissions([
                  'sector_access',
                ])
              "
            >
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/sectors">
                  <i class="fas fa-user"></i>
                  <p>Sectors</p>
                </NuxtLink>
              </li>
            </ul>

            <ul class="nav nav-treeview"
              v-if="
                checkPermissions([
                  'occupation_access',
                ])
              "
            >
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/occupations">
                  <i class="fas fa-user"></i>
                  <p>Occupations</p>
                </NuxtLink>
              </li>
            </ul>

            <ul class="nav nav-treeview"
              v-if="
                checkPermissions([
                  'level_access',
                ])
              "
            >
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/levels">
                  <i class="fas fa-user"></i>
                  <p>Levels</p>
                </NuxtLink>
              </li>
            </ul>

            <ul class="nav nav-treeview"
              v-if="
                checkPermissions([
                  'sector_with_occupation_access',
                ])
              "
            >
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/sector-occupations">
                  <i class="fas fa-user"></i>
                  <p>Sector-Occupations</p>
                </NuxtLink>
              </li>
            </ul>

            <ul class="nav nav-treeview"
              v-if="
                checkPermissions([
                  'occupation_with_level_access',
                ])
              "
            >
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/occupation-levels">
                  <i class="fas fa-user"></i>
                  <p>Occupation-levels</p>
                </NuxtLink>
              </li>
            </ul>

             <!-- RTO center information start -->
             <ul
              class="nav nav-treeview"
              v-if="checkPermissions('rto_access')"
            >
              <li class="nav-item">
                <a href="#" class="nav-link">
                  <i class="fas fa-sitemap"></i>
                  <p>
                    RTO-center
                    <i class="fas fa-angle-left right"></i>
                  </p>
                </a>
                <ul
                  class="nav nav-treeview"
                  v-if="checkPermissions('rto_access')"
                >
                  <li class="nav-item">
                    <NuxtLink class="nav-link" to="/rtos">
                      <span class="sub-menu">
                        <i class="fa fa-project-diagram"></i>
                        <span class="sub-menu-text">RTO List</span>
                      </span>
                    </NuxtLink>
                  </li>
                </ul>
              </li>
            </ul>

          </li>

          <li
            class="nav-item"
            v-if="
              checkPermissions([
                'user_access',
              ])
            "
          >
            <a href="#" class="nav-link">
              <i class="nav-icon fab fa-creative-commons-sampling"></i>
              <p>
                Common
                <i class="right fas fa-angle-left"></i>
              </p>
            </a>

            <ul class="nav nav-treeview">
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/profiles">
                  <i class="fas fa-user"></i>
                  <p>Profile</p>
                </NuxtLink>
              </li>
            </ul>

            <ul class="nav nav-treeview">
              <li class="nav-item">
                <NuxtLink class="nav-link" to="/learning-materials">
                  <i class="fas fa-user"></i>
                  <p>Learning-material</p>
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
