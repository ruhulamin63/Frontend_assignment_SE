<script setup>
  const preloader = ref(true);
  onMounted(() => {
    $('[data-widget="treeview"]').Treeview('init');

    setTimeout(() => {
      preloader.value = false;
    }, 1000);

  });

  const clicked = () =>{
    $fetch(useRuntimeConfig().public["apiBaseUrl"] + "clicked");
  }
</script>
<template>
  <body class="hold-transition sidebar-mini layout-fixed layout-navbar-fixed layout-footer-fixed" @click="clicked">
    <div class="wrapper">
      <!-- Preloader -->
      <!-- <common-preloader :preloader="preloader"></common-preloader> -->
      
      <!-- Navbar -->
      <common-navbar></common-navbar>
      <!-- /.navbar -->

      <!-- Main Sidebar Container -->
      <common-sidebar></common-sidebar>
      <slot />

      <!-- /.content-wrapper -->
      <common-footer></common-footer>
    </div>
  </body>
</template>

<style scoped></style>
