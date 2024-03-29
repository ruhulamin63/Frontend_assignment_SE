
<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Dashboard</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <NuxtLink to="/">Home</NuxtLink>
              </li>
              <li class="breadcrumb-item active">Dashboard</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">

        <loading :active.sync="isLoading" :color="'#1C570EAE'" :is-full-page="fullPage">
        </loading>

        <!-- Info boxes -->
        <div class="row">

          <div class="col-lg-4 col-6">
            <div class="small-box" style="background-color: #fd8a4b;">
              <div class="icon ss s">
                <i class="fa fa-calculator" aria-hidden="true"></i>
              </div>
              <div class="inner text-white text-center">
                <h3>{{ total_rto_user }}</h3>
                <p> Total RTO Center</p>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-6">
            <a href="#" @click="gotoMentorList" style="text-decoration: none;">
              <div class="small-box" style="background-color: #88969e;">
                <div class="icon ss s">
                  <i class="fa fa-users" aria-hidden="true"></i>
                </div>
                <div class="inner text-white text-center">
                  <h3>{{ mentor_count }}</h3>
                  <p>Total Mentors</p>
                </div>
              </div>
            </a>
          </div>

          <div class="col-lg-4 col-6">
            <div class="small-box" style="background-color: #656ba7;">
              <div class="icon ss s">
                <i class="fa fa-users" aria-hidden="true"></i>
              </div>
              <div class="inner text-white text-center">
                <h3>{{ total_assessor_count }}</h3>
                <p>Total Assessor</p>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-6">
            <a href="#" @click="gotoCandidateList" style="text-decoration: none;">
              <div class="small-box" style="background-color: #661687;">
                <div class="icon ss s">
                  <i class="fas fa-users"></i>
                </div>
                <div class="inner text-white text-center">
                  <h3>{{ total_candidate }}</h3>
                  <p>Total Candidate</p>
                </div>
              </div>
            </a>
          </div>

          <div class="col-lg-4 col-6">
            <a href="#" @click="gotoResultView" style="text-decoration: none;">
              <div class="small-box" style="background-color: #0069bc;">
                <div class="icon ss s">
                  <i class="fa fa-book" aria-hidden="true"></i>
                </div>
                <div class="inner text-white text-center">
                  <h3>{{ total_result_count }}</h3>
                  <p>Total Result</p>
                </div>
              </div>
            </a>
          </div>

          <div class="col-lg-4 col-6">
            <a href="#" @click="gotoResultView" style="text-decoration: none;">
              <div class="small-box" style="background-color: #dd6cea;">
                <div class="icon ss s">
                  <i class="fa fa-book" aria-hidden="true"></i>
                </div>
                <div class="inner text-white text-center">
                  <h3>{{ total_remaining_result_count }}</h3>
                  <p>Remaining Result</p>
                </div>
              </div>
            </a>
          </div>

        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </section>
    <!-- /.content -->

  </div>
</template>

<script setup>
  import Multiselect from "vue-multiselect";
  import Toggle from '@vueform/toggle';

  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/css/index.css';
  const loading = Loading;
  const isLoading = ref(false);
  const fullPage = ref(true);

  // if (!checkPermissions(['vendor_access',])) {
  //   throw createError({
  //     statusCode: 401,
  //     statusMessage: "you do not have permission to access this url",
  //     fatal: true,
  //   });
  // }

  useHead({
    title: "Dashboard",
  });

  definePageMeta({
    layout: "default",
  });


  const api_url = useRuntimeConfig().public["apiBaseUrl"];

  const value = ref(false);
  const filterShow = ref(false);

  const toggle = (event) => {
    filterShow.value = value.value;
  };

  import { ref, onMounted } from 'vue';
  const router = useRouter();

  const candidateList = ref([]);
  let mentor_count = 0;
  let total_candidate = 0;
  let total_passed_candidate = 0;
  let total_rto_user = 0;
  let total_assessor_count = 0;
  let total_result_count = 0;
  let total_remaining_result_count = 0;

  const gotoResultView = () => {
    router.push('/unit-of-competency-result');
  };

  const gotoCandidateList = () => {
    router.push('/show-all-candidate');
  };

  const gotoMentorList = () => {
    router.push('/mentor-list');
  };

  const loadAllCandidateShow = (params = { url: null, filter: { rows: 10 } }) => {
      try {
          let url = api_url + "get-mentor-assign-candidates-list";

          if (params.hasOwnProperty("url") && params.url != null) {
              url = params.url;
          }

          let filter = {};
          if (params.hasOwnProperty("filter")) {
              filter = params.filter;
          }

          isLoading.value = true;
          setTimeout(async () => {
              const res = await $fetch(url, {
                  params: filter,
              });
              candidateList.value = res.data;
              isLoading.value = false;
          }, 500);

      } catch (e) {
          console.log(e);
          isLoading.value = false;
      }
  };

  const loadDashboardCountData = async () => {
    const url = api_url + "bteb-admin";

      const res = await $fetch(url).then((data) => {
      mentor_count = data.data.mentor_count;
      total_candidate = data.data.total_candidate;
      total_passed_candidate = data.data.total_passed_candidate;
      total_rto_user = data.data.total_rto_user;
      total_assessor_count = data.data.total_assessor_count;
      total_result_count = data.data.total_result_count;
      total_remaining_result_count = data.data.total_remaining_result_count;
    }).catch(({ response }) => {
      console.error(response);
    });
  };

  onMounted(() => {
    // loadAllCandidateShow();
    loadDashboardCountData();
  });
</script>