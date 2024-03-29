<template>
    <div class="content-wrapper">
      <div class="content-header">
        <div class="container-fluid">
          <div class="row mb-2">
            <div class="col-sm-6">
              <h1 class="m-0">Notifications</h1>
            </div>
            <div class="col-sm-6">
              <ol class="breadcrumb float-sm-right">
                <li class="breadcrumb-item">
                  <NuxtLink to="/">Home</NuxtLink>
                </li>
                <li class="breadcrumb-item active">Notifications</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
  
      <section class="content">
        <div class="container-fluid">

          <div class="row">
            <div class="col-md-12">
              <div class="card">
                <div class="card-header">
                  <h3 class="card-title">Notifications</h3>
                </div>
                <common-table
                  :columns="table_header"
                  :entities="entities"
                  :isAction="false"
                  :per_page="50"
                  :per_page_array="['all', 50, 100, 200, 500, 1000, 5000, 10000]"
                  @getData="getData"
                >
                  <template v-slot:column_sl="{ index, entity }">
                    <td :class="entity.read_at === null ? 'notification-unread' : ''">{{ index + 1 }}</td>
                  </template>

                  <template v-slot:column_title="{ entity }">
                    <td :class="entity.read_at === null ? 'notification-unread' : ''">
                        <NuxtLink :to="entity.web_url + '?notification_id=' + entity.id" v-html="entity.title"></NuxtLink>
                    </td>
                  </template>

                  <template v-slot:column_created_at="{ entity }">
                    <td :class="entity.read_at === null ? 'notification-unread' : ''">
                        {{formatDate(entity.created_at, 'DD-MM-YY hh:mm A')}}
                    </td>
                  </template>
                </common-table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  </template>
      
<script setup>

  useHead({
    title: "Notifications",
  });

  import { useAuthStore } from "~/stores/auth";
  
  const api_url = useRuntimeConfig().public["apiBaseUrl"];
  
  let entities = ref({});
  
  const table_header = [
    { label: "Sl", field: "sl", sortable: false, filterable: false },
    { label: "Notification", field: "title" },
    { label: "Date Time", field: "created_at" },
  ];
  
  const getData = async (params = { url: null, filter: { rows: 50 } }) => {
    try {
      let url = api_url + "get-notifications";
      if (params.hasOwnProperty("url") && params.url != null) {
        url = params.url;
      }
  
      let filter = {};
      if (params.hasOwnProperty("filter")) {
        filter = params.filter;
      }
  
      filter.user_id = useAuthStore().user.id
  
      const response = await $fetch(url, {
        params: filter,
      });
      entities.value = response;
    } catch (error) {
      console.log(error);
    }
  };
  
  await getData();
</script>
      
<style scoped>
</style>