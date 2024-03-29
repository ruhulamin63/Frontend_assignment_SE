<template>
  <div class="content-wrapper">
    <div class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1 class="m-0">Assign Permission to {{ roles?.name }}</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item">
                <NuxtLink to="/">Home</NuxtLink>
              </li>
              <li class="breadcrumb-item">
                <NuxtLink to="/roles">Role</NuxtLink>
              </li>
              <li class="breadcrumb-item active">{{ id }}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>

    <section class="content">
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-lg-10">
            <div class="card">
              <div class="card-body">
                <form
                  @submit.prevent="submitPermissions"
                  class="form"
                  id="role_permissions"
                >
                  <div
                    v-for="(item, index) in permissions"
                    :key="index"
                    class="mb-4"
                  >
                    <label class="fs-6 fw-bold mr-5">{{ item.name }}</label>
                    <span class="ml-2">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :id="'select_all_' + index"
                        :checked="areAllPermissionsSelected(item)"
                        @change="selectAllPermissions(item)"
                      />
                      <label
                        :for="'select_all_' + index"
                        class="form-check-label"
                      >
                        Select All
                      </label>
                    </span>
                    <div
                      class="form-check form-switch form-check-custom form-check-solid me-4 mb-3"
                    ></div>
                    <div class="d-flex flex-wrap">
                      <div
                        v-for="(permission, pIndex) in item.permissions"
                        :key="pIndex"
                        class="form-check form-switch form-check-custom form-check-solid me-4 mb-3"
                      >
                        <input
                          class="form-check-input"
                          name="permission_id"
                          type="checkbox"
                          :id="'permission_id_' + permission.id"
                          :checked="selectedPermissions.includes(permission.id)"
                          @change="updatePermission($event, permission.id)"
                        />
                        <label
                          :for="'permission_id_' + permission.id"
                          class="form-check-label"
                        >
                          {{ capitalize(permission.name) }}
                        </label>
                      </div>
                    </div>
                  </div>

                  <hr class="mt-4 mb-3" />

                  <div class="text-center">
                    <button type="submit" class="add-button float-right">
                      Submit
                    </button>

                    <NuxtLink
                      :to="{
                        name: 'roles',
                      }"
                      class="btn btn-info btn-sm float-right mr-1"
                    >
                      Back
                    </NuxtLink>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useToast } from "vue-toastification";
const { id } = useRoute().params;

const api_url = useRuntimeConfig().public["apiBaseUrl"];

const toast = useToast();
const permissions = ref([]);
const selectedPermissions = ref([]);
const roles = ref([]);

// const role_name = await $fetch(api_url + "get-role-name", {
//   method: "GET",
//   body: JSON.stringify({ id }),
// });

// if (role_name == "") {
//   throw createError({
//     statusCode: 404,
//     statusMessage: "No Role Found!",
//     fatal: true,
//   });
// }
//get role wise already assigned permissions
const getRolePermission = async () => {
  const response = await $fetch(api_url + `roles/${id}`, {
    method: "GET",
  });

  roles.value = response?.data;
  console.log("🚀 ~ file: [id].vue:130 ~ getRolePermission ~ roles.value:", roles.value)
};

//get all permissions
const getPermission = async () => {
  const response = await $fetch(api_url + "get-permission", {
    method: "GET",
  });

  permissions.value = response;
};

watch(roles, (new_value, old_value) => {
  selectedPermissions.value =
    roles.value.permissions?.map((perm) => perm.id) || [];
});

const areAllPermissionsSelected = (item) => {
  return item.permissions.every((permission) =>
    selectedPermissions.value.includes(permission.id)
  );
};

// const isSelected = (permissionId) => {
//   return !selectedPermissions.includes(permissionId);
// };

const updatePermission = (event, permissionId, item) => {
  const checked = event.target.checked;
  if (checked) {
    selectedPermissions.value.push(permissionId);
  } else {
    selectedPermissions.value = selectedPermissions.value.filter(
      (id) => id !== permissionId
    );
  }
};

const selectAllPermissions = (item) => {
  const selected = areAllPermissionsSelected(item);
  if (!selected) {
    selectedPermissions.value = [
      ...selectedPermissions.value,
      ...item.permissions.map((p) => p.id),
    ];
  } else {
    selectedPermissions.value = selectedPermissions.value.filter(
      (id) => !item.permissions.some((p) => p.id === id)
    );
  }
};

const submitPermissions = async () => {
  try {
    let url = api_url + "roles";
    let method = "POST";

    const res = await $fetch(url + `/${id}` + "/permission-update", {
      method,
      body: JSON.stringify({ permissionIds: selectedPermissions.value }),
    });
    if (res.status === 200) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  } catch (error) {
    toast.error('Something went wrong!');
    console.log("role submit error", error);
  }
};

const capitalize = (name) => {
  if (!name) return "";
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

onMounted(() => {
  capitalize();
  getPermission();
  getRolePermission();
});
</script>

<style scoped>
.form-check.form-switch.mb-3 {
  margin-right: 15px;
}
.selected-blue {
  color: blue;
}

.selected-green {
  color: green;
}
.newly-selected-green {
  color: green;
}
</style>
