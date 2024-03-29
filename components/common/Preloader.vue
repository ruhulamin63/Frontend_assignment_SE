<script setup lang="js">
const { preloader } = defineProps({
  preloader: Boolean
})
</script>

<template>
    <div v-if="preloader" class="preloader flex-column justify-content-center align-items-center">
        <img 
          class="animation__shake" 
          src="/images/soft_zeno.png"
          alt="logo" 
          height="60" 
          width="60"
        >
    </div>
</template>

<style scoped>

</style>