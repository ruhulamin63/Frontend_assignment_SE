<template>
  <div class="content-wrapper">
    <loading
      :active="isLoading"
      :can-cancel="true"
      :color="'#1C570EAE'"
      :on-cancel="() => (isLoading = false)"
      :is-full-page="fullPage"
    >
    </loading>

    <!-- Content Header (Page header) -->
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Roles</h1>
          </div>
          <!-- /.col -->
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <NuxtLink to="/">Home</NuxtLink>
              </li>
              <li class="breadcrumb-item active">Roles</li>
            </ol>
          </div>
          <!-- /.col -->
        </div>
        <!-- /.row -->
      </div>
      <!-- /.container-fluid -->
    </div>
    <!-- /.content-header -->

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Role List</h3>
                <button
                  style="float: right"
                  type="button"
                  class="add-button"
                  data-toggle="modal"
                  data-target="#staticBackdrop"
                  @click="openModal"
                  v-if="checkPermissions('roles_create')"
                >
                  <i class="fa fa-plus"></i> Add New
                </button>
              </div>
              <!-- table component start -->
              <common-table
                :columns="table_header"
                :entities="data"
                @getData="getData"
                :isPagination="true"
                filter_type="filter"
              >
                <template v-slot:column_sl="{ index }">
                  <td>{{ index + 1 }}</td>
                </template>
                <template v-slot:column_action="{ entity }">
                  <td>
                    <NuxtLink
                      v-if="
                        checkPermissions('permission_assign') && entity.id != 1
                      "
                      style="color: #dc3545"
                      :to="'/roles/' + entity?.id"
                      ><i class="fa fa-eye"></i
                    ></NuxtLink>

                    &nbsp;
                    <span v-if="entity.created_at !== null">
                      <a
                        href="javascript:"
                        @click="onEdit(entity)"
                        v-if="checkPermissions('roles_edit')"
                        ><i class="fas fa-edit"></i
                      ></a>

                      &nbsp;

                      <a
                        v-if="checkPermissions('roles_delete')"
                        style="color: #dc3545"
                        href="javascript:"
                        @click="onDelete(entity)"
                        ><i class="fas fa-trash"></i
                      ></a>
                    </span>
                  </td>
                </template>
              </common-table>
              <!-- table component end -->
            </div>
          </div>
        </div>
      </div>
      <!-- /.container-fluid -->
    </section>
    <!-- /.content -->
    <div
      class="modal fade"
      id="staticBackdrop"
      data-backdrop="static"
      data-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Create Role</h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <!-- modal start -->
          <Form
            @submit="onSubmit"
            :validation-schema="schema"
            :initial-values="formData"
          >
            <div class="modal-body">
              <div class="row">
                <div class="col-md-12">
                  <form action="">
                    <div class="form-group">
                      <label for="name">Name</label>
                      <Field
                        type="text"
                        class="form-control"
                        id="name"
                        placeholder="Enter name"
                        name="name"
                      />
                      <ErrorMessage class="text-danger" name="name" />
                    </div>

                    <div class="form-group">
                      <label for="description">Description</label>
                      <Field
                        type="description"
                        class="form-control"
                        id="description"
                        placeholder="Enter description"
                        name="description"
                      />
                      <ErrorMessage class="text-danger" name="description" />
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button type="submit" class="btn btn-primary">Save</button>
            </div>
          </Form>
          <!-- modal end -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
if (!checkPermissions(["roles_access"])) {
  throw createError({
    statusCode: 401,
    statusMessage: "you do not have permission to access this url",
    fatal: true,
  });
}

useHead({
  title: "Role",
  meta: [
    {
      name: "description",
      content: "Roles",
    },
  ],
});

import { ref, onMounted } from "vue";
import { useToast } from "vue-toastification";
import { Field, Form, ErrorMessage } from "vee-validate";
import * as yup from "yup";

import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/css/index.css";
const loading = Loading;
const isLoading = ref(false);
const fullPage = ref(true);

const config = useRuntimeConfig();

if (!checkPermissions(["roles_access"])) {
  throw createError({
    statusCode: 401,
    statusMessage: "you do not have permission to access this url",
    fatal: true,
  });
}

const schema = yup.object().shape({
  name: yup.string().min(3).required().label("Name"),
});

const api_url = useRuntimeConfig().public["apiBaseUrl"];

const table_header = [
  { label: "Sl", field: "sl", sortable: false },
  { label: "Title", field: "name" },
  { label: "Description", field: "description" },
];

let isEdit = ref(false);
let data = ref([]);
const toast = useToast();
const formData = ref({
  id: 0,
  name: "",
  description: "",
});

const resetForm = () => {
  formData.value = {
    id: 0,
    name: "",
    description: "",
  };
};

const showModal = ref(false);

const openModal = () => {
  showModal.value = true;
};

const closeModal = () => {
  $("#staticBackdrop").modal("hide");
  resetForm();
  showModal.value = false;
};

const onSubmit = async (values, { resetForm }) => {
  try {
    let url = api_url + "roles";
    let method = "POST";

    if (formData.value.id != 0) {
      url = url + "/" + formData.value.id;
      method = "PUT";
    }
    const res = await $fetch(url, {
      method,
      body: JSON.stringify(values),
    });
    if (res.status === 200) {
      toast.success(res.message);
      closeModal();
      getData();
      resetForm();
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    toast.error("Something went wrong!");
    console.log("submit error", error);
  }
};

// get data
const getData = async (params = { url: null, filter: { rows: 10 } }) => {
  isLoading.value = true;
  try {
    let url = api_url + "roles";
    if (params.hasOwnProperty("url") && params.url != null) {
      url = params.url;
    }

    let filter = {};
    if (params.hasOwnProperty("filter")) {
      filter = params.filter;
    }

    const response = await $fetch(url, {
      params: filter,
    });
    data.value = response;
  } catch (error) {
    console.log(error);
  }
  isLoading.value = false;
};

onMounted(() => getData());

function onEdit(entity) {
  formData.value = {
    id: entity?.id,
    name: entity?.name,
    description: entity?.description,
  };
  $("#staticBackdrop").modal("show");
}

const onDelete = async (entity) => {
  try {
    const res = await $fetch(api_url + "roles/" + entity?.id, {
      method: "DELETE",
    });
    if (res.status === 200) {
      toast.success(res.message);
      getData();
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    console.log("🚀 ~ file: index.vue:217 ~ onDelete ~ error:", error);
  }
};
</script>

<style scoped></style>
