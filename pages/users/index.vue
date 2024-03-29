<template>
  <div class="content-wrapper">

    <loading :active="isLoading" :can-cancel="true" :color="'#1C570EAE'" :on-cancel="() => (isLoading = false)"
      :is-full-page="fullPage">
    </loading>

    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Users</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <NuxtLink to="/">Home</NuxtLink>
              </li>
              <li class="breadcrumb-item active">Users</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <section class="content">
      <div class="container-fluid">
        <div class="row">

          <div class="col-md-12">
            <div class="row float-right">
              <label>Filter</label>
              <Toggle class="toggle-button ml-2" v-model="value" :name="'toggle'" :id="'toggle'" :onLabel="'On'"
                :offLabel="'Off'" :trueValue="true" :falseValue="false" :disabled="false" :required="false"
                @change="toggle()" />
            </div>

            <div class="row" v-if="filterShow">
              <div class="col-md-4 col-sm-3 col-xs-4">
                <div class="form-group">
                  <multiselect v-model="filterSelectedOccupation" placeholder="Search occupation name"
                    :options="occupations" :taggable="true" label="title" track-by="id" :show-labels="false"
                    name="occupation" />
                </div>
              </div>

              <div class="col-xs-1">
                <button class="date-search-button" type="button" @click="getData()">
                  Search
                </button>

                <!-- how to reset filter -->
                <button class="reset-button ml-1" type="button" @click="filterSelectedOccupation = null; getData()">
                  <i class="fas fa-undo"></i>
                  Reset
                </button>
              </div>
            </div>
          </div>

          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">User List</h3>
                <button style="float: right" type="button" class="add-button" data-toggle="modal"
                  data-target="#staticBackdrop" v-if="checkPermissions('user_create')">
                  <i class="fa fa-plus"></i> Add New
                </button>
              </div>
              <common-table :columns="table_header" :entities="entities" @getData="getData" @onEdit="onEdit"
                @onDelete="onDelete">
                <template v-slot:column_sl="{ index }">
                  <td>{{ index + 1 }}</td>
                </template>
                <template v-slot:column_roles="{ entity }">
                  <td>
                    <span v-for="(role, sl) in entity.roles" :key="sl" class="badge badge-info mr-1">{{ role.name
                    }}</span>
                  </td>
                </template>

                <template v-slot:column_action="{ entity }">
                  <td>
                    <a v-if="checkPermissions('user_edit')" href="javascript:" @click="onEdit(entity)">
                      <i class="fas fa-edit"></i>
                    </a>

                    &nbsp;

                    <a v-if="checkPermissions('user_delete')" style="color: #dc3545" href="javascript:"
                      @click="onDelete(entity)">
                      <i class="fas fa-trash"></i>
                    </a>
                  </td>
                </template>
              </common-table>
            </div>
          </div>
        </div>
      </div>
    </section>


    <div class="modal fade" id="staticBackdrop" data-backdrop="static" data-keyboard="false" tabindex="-1"
      aria-labelledby="staticBackdropLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Create User</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="resetForm">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <Form @submit="onSubmit" :validation-schema="schema" :initial-values="formValues">
              <div class="row">

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="name">Name<span class="text-danger"> *</span></label>
                    <Field class="form-control" id="name" name="name" type="text" placeholder="Enter name" />
                    <ErrorMessage class="text-danger" name="name" />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="email">Email<span class="text-danger"> *</span></label>
                    <Field class="form-control" id="email" name="email" type="email" placeholder="Enter email" />
                    <ErrorMessage class="text-danger" name="email" />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="type">User Type<span class="text-danger"> *</span></label>
                    <multiselect placeholder="Search type" :options="types" v-model="selectedType" :taggable="false"
                      label="name" track-by="id" id="type" :show-labels="false" :allow-empty="true" @close="TypeCheck" />
                    <span class="text-danger" v-if="!selectedType && check">Please select user type</span>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="role">Select Role<span class="text-danger"> *</span></label>
                    <multiselect placeholder="Search role" :options="roles" v-model="selectedRole" :taggable="false"
                      label="name" track-by="id" id="role" :multiple="true" :show-labels="false" :allow-empty="true">
                    </multiselect>
                    <span class="text-danger" v-if="!selectedRole && check">Please select role</span>
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="password">Password<span class="text-danger"> *</span></label>
                    <Field class="form-control" id="password" name="password" type="password" placeholder="Enter password"
                      autocomplete="off" />
                    <ErrorMessage class="text-danger" name="password" />
                  </div>
                </div>

                <div class="col-md-6">
                  <div class="form-group">
                    <label for="password_confirmation">Confirm Password<span class="text-danger"> *</span></label>
                    <Field class="form-control" id="password_confirmation" name="password_confirmation" type="password"
                      placeholder="Enter confirm password" autocomplete="off" />
                    <ErrorMessage class="text-danger" name="password_confirmation" />
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group" v-if="type == 'mentor'
                    || type == 'assessor'">
                    <label for="sector">Sector<span class="text-danger"> *</span></label>
                    <multiselect placeholder="Select sector" :options="sectors" v-model="selectedSector" :taggable="false"
                      label="title" track-by="id" id="sector" :show-labels="false" :allow-empty="true"
                      :loading="sector_loading" @close="get_occupations">
                    </multiselect>
                    <span class="text-danger" v-if="!selectedSector && check">Please select sector</span>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group" v-if="type == 'mentor'
                    || type == 'assessor'">
                    <label for="occupation">Occupation<span class="text-danger"> *</span></label>
                    <multiselect placeholder="Search occupation" :options="occupations" v-model="selectedOccupation"
                      :taggable="false" label="title" track-by="id" id="occupation" :show-labels="false"
                      :allow-empty="true" :loading="occupation_loading" @close="get_levels">
                    </multiselect>
                    <span class="text-danger" v-if="!selectedOccupation && check">Please select occupation</span>
                  </div>
                </div>

                <div class="col-md-4">
                  <div class="form-group" v-if="type == 'mentor'
                    || type == 'assessor'">
                    <label for="level">Level<span class="text-danger"> *</span></label>
                    <multiselect placeholder="Search level" :options="levels" v-model="selectedLevel" :taggable="false"
                      label="title" track-by="id" id="level" :show-labels="false" :allow-empty="true"
                      :loading="level_loading">
                    </multiselect>
                    <span class="text-danger" v-if="!selectedLevel && check">Please select level</span>
                  </div>
                </div>
              </div>

              <button type="submit" :disabled="submit_disabled" class="add-button float-right">
                <i v-if="submit_disabled" class="fa fa-spinner fa-spin"></i>
                {{ submit_disabled ? "Loading..." : "Submit" }}
              </button>

              <button @click="resetForm" :disabled="submit_disabled" type="button"
                class="btn btn-danger btn-sm float-right mr-2">
                Reset
              </button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
if (
  !checkPermissions(['user_access'])
) {
  throw createError({
    statusCode: 401,
    statusMessage: "you do not have permission to access this url",
    fatal: true,
  });
}

useHead({
  title: "Users",
});

import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useToast } from "vue-toastification";
import Multiselect from "vue-multiselect";
import Swal from "sweetalert2";
import Toggle from '@vueform/toggle';

import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
const loading = Loading;
const isLoading = ref(false);
const fullPage = ref(true);

const value = ref(false);
const filterShow = ref(false);
const toggle = (event) => {
  filterShow.value = value.value;
};

const types = [
  { id: 1, name: "mentor" },
  { id: 2, name: "assessor" },
  { id: 3, name: "rto" },
  { id: 4, name: "admin" },
];

const TypeCheck = () => {
  type.value = selectedType.value?.name;
};

const schema = yup.object().shape({
  name: yup.string().min(3).required().label("Name"),
  email: yup.string().email().required().label("Email"),
  password: yup
    .string()
    .label("Password")
    .when([], {
      is: () => formValues.value.id === 0,
      then: yup
        .string()
        .required("No password provided.")
        .min(6, "Password is too short - should be 6 chars minimum."),
      otherwise: yup.string().when("password", (value) => {
        if (value) {
          return yup
            .string()
            .min(6, "Password is too short - should be 6 chars minimum.");
        } else {
          return yup.string().nullable(true);
        }
      }),
    }),
  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const api_url = useRuntimeConfig().public["apiBaseUrl"];

let formValues = ref({
  id: 0,
  name: "",
  email: "",
  type: "",
  password: "",
  password_confirmation: "",
});

let entities = ref({});
let sectors = ref([]);
let occupations = ref([]);
let levels = ref([]);
let districts = ref([]);
let roles = ref([]);
let selectedSector = ref(null);
let selectedOccupation = ref(null);
let selectedLevel = ref(null);
let selectedDistrict = ref(null);
let selectedRole = ref(null);
let sector_loading = ref(false);
let occupation_loading = ref(false);
let level_loading = ref(false);
let district_loading = ref(false);
const submit_disabled = ref(false);
let edit_process = ref(false);
const filterSelectedOccupation = ref(null);
const selectedType = ref(null);
let type = ref(null);
const check = ref(false);

const table_header = [
  { label: "Sl", field: "sl", sortable: false, filterable: false },
  { label: "Name", field: "name" },
  { label: "Email", field: "email" },
  { label: "Phone", field: "phone" },
  { label: "Type", field: "type" },
  { label: "Role", field: "roles", sortable: false, filterable: false },
];

const onSubmit = async (values, { resetForm }) => {
  if (selectedRole.value == null) {
    check.value = true;
    return;
  } else {
    values.roles = [];
    for (const d in selectedRole.value) {
      values.roles.push(selectedRole.value[d].id);
    }
  }

  if (selectedType.value == null) {
    check.value = true;
    return;
  }

  if (selectedType.value.name == 'mentor' || selectedType.value.name == 'assessor') {
    if (!selectedSector.value) {
      check.value = true;
      return;
    }

    if (!selectedOccupation.value) {
      check.value = true;
      return;
    }

    if (!selectedLevel.value) {
      check.value = true;
      return;
    }
  }

  try {
    values.type = selectedType.value?.name ?? null;
    values.sector_id = selectedSector.value?.id ?? null;
    values.occupation_id = selectedOccupation.value?.id ?? null;
    values.level_id = selectedLevel.value?.id ?? null;
    
    submit_disabled.value = true;
    let url = api_url + "users";
    let method = "POST";

    if (formValues.value.id != 0) {
      url = url + "/" + formValues.value.id;
      method = "PUT";
    }
    const res = await $fetch(url, {
      method,
      body: JSON.stringify(values),
    });
    if (res.status === 200) {
      useToast().success(res.message);
      clearForm();
      resetForm();
      getData();
      $('#staticBackdrop').modal('hide');
    } else {
      useToast().error(res);
    }
  } catch (error) {
    useToast().error('Something went wrong!');
    console.log(error);
  }

  submit_disabled.value = false;
};

const clearForm = () => {
  formValues.value = {
    id: 0,
    name: "",
    email: "",
    type: "",
    password: "",
    password_confirmation: "",
  };

  selectedRole.value = null;
  selectedSector.value = null;
  selectedOccupation.value = null;
  selectedLevel.value = null;
};

const resetForm = () => {
  clearForm();
};

const getData = async (params = { url: null, filter: { rows: 10 } }) => {
  isLoading.value = true;
  try {
    let url = api_url + "users";
    if (params.hasOwnProperty("url") && params.url != null) {
      url = params.url;
    }

    let filter = {};
    if (params.hasOwnProperty("filter")) {
      filter = params.filter;

      filter.filter_occupation = filterSelectedOccupation.value?.id ?? null;
    }
    filter.with = JSON.stringify(['roles']);

    const response = await $fetch(url, {
      params: filter,
    });
    entities.value = response;

  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

const getRoles = async () => {
  try {
    const url = api_url + "roles";
    const res = await $fetch(url);

    res?.data.map((item) => {
      if (item.name != 'Student') {
        roles.value.push(item);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

const get_sectors = async () => {
  sector_loading.value = true;
  try {
    const url = api_url + "get-all-sectors";
    const res = await $fetch(url);
    sectors.value = res;
  } catch (e) {
    console.log(e);
  }

  sector_loading.value = false;
};

const get_occupations = async () => {
  occupation_loading.value = true;
  try {
    const url = api_url + "get-sector-wise-occupations"
    const res = await $fetch(url, {
      params: {
        sector_id: selectedSector.value?.id,
      },
    });
    occupations.value = res;

    occupations = res.map((item) => {
      return {
        id: item.occupation_id,
        title: item.occupations.title,
      };
    });
  } catch (e) {
    console.log(e);
  }
  occupation_loading.value = false;
};

const get_levels = async () => {
  level_loading.value = true;
  try {
    const url = api_url + "get-occupation-wise-levels"
    const res = await $fetch(url, {
      params: {
        occupation_id: selectedOccupation.value?.id,
      },
    });
    levels.value = res;

    levels = res.map((item) => {
      return {
        id: item.level_id,
        title: item.levels.title,
      };
    });
  } catch (e) {
    console.log(e);
  }
  level_loading.value = false;
};

const onEdit = async (entity) => {
  edit_process.value = true;
  try {
    let filter = {
      id: entity.id,
      with: JSON.stringify(['designation', 'roles', 'districts', 'upazilas']),
    };
    const response = await $fetch(api_url + "users", {
      params: filter,
    });

    let final_user = response.data[0]

    formValues.value = {
      id: final_user.id,
      name: final_user.name,
      email: final_user.email,
      type: final_user.type,
      password: "",
      password_confirmation: "",
    };

    selectedDesignation.value = final_user.designation;

    selectedRole.value = final_user.roles;

    if (final_user.type != 'official') {
      selectedDistrict.value = final_user.districts;
      selectedUpazila.value = final_user.upazilas;
    }

    $("#staticBackdrop").modal("show");
  } catch (error) {
    console.log(error);
  }

  setTimeout(() => {
    edit_process.value = false;
  }, 500);
};

const onDelete = async (entity) => {
  try {
    const confirm = await Swal.fire({
      title: "Warning!",
      text: "Do you want to delete?",
      icon: "warning",
      confirmButtonText: "Ok",
      showCancelButton: true,
    });
    if (!confirm.isConfirmed) {
      return;
    }
    const res = await $fetch(api_url + "users/" + entity.id, {
      method: "DELETE",
    });
    if (res.status === 200) {
      useToast().success(res.message);
      getData();
    } else {
      useToast().error(res);
    }
  } catch (error) {
    console.log(error);
  }
};

onMounted(async () => {
  getData();
  getRoles();
  get_sectors();
});
</script>

<style scoped></style>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>
<style src="@vueform/toggle/themes/default.css"></style>