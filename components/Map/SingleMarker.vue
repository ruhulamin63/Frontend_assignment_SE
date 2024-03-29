<template>
  <div>
      <GoogleMap :api-key="useRuntimeConfig().public['map_key']" :style="{width: width, height: height}" :center="center" :zoom="zoom">
        <Marker :options="{ position: center }" />
      </GoogleMap>
  </div>
</template>

<script setup>
  import { GoogleMap, Marker } from "vue3-google-map";

  const props = defineProps({
    latitude: {
      type: Number,
      required: true,
      default: 0,
    },
    longitude: {
      type: Number,
      required: true,
      default: 0,
    },
    zoom: {
      type: Number,
      required: false,
      default: 15,
    },
    width:{
      type: String,
      required: false,
      default: '100%',
    },
    height:{
      type: String,
      required: false,
      default: '77vh',
    },
  })

  const center = computed(() => {
    return {
      lat: props.latitude,
      lng: props.longitude,
    }
  })

</script>

<style scoped>

</style>