<template>
  <!-- Content Wrapper. Contains page content -->
  <div class="content-wrapper">

    <loading
        :active="isLoading"
        :can-cancel="true"
        :color="'#1C570EAE'"
        :on-cancel="() => (isLoading = false)"
        :is-full-page="fullPage">
    </loading>

    <!-- Content Header (Page header) -->
    <section class="content-header">
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-sm-6">
            <h1>Profile</h1>
          </div>
          <div class="col-sm-6">
            <ol class="breadcrumb float-sm-right">
              <li class="breadcrumb-item"><a href="#">Home</a></li>
              <li class="breadcrumb-item active">User Profile</li>
            </ol>
          </div>
        </div>
      </div>
    </section>

    <!-- Main content -->
    <section class="content">
      <div class="container-fluid">
        <div class="row">
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Profile</h3>
              </div>
              <div class="card-body">
                <div class="tab-content">
                  <div class="active tab-pane" id="settings">
                    <Form class="form-horizontal" 
                      @submit="profileUpdate"
                      :validation-schema="schema"
                      :initial-values="data"
                    >
                      <div class="col-12">
                        <div class="form-group">
                          <label for="inputName">Name <span class="text-danger"> *</span></label>
                          <Field
                              v-model="data.name"
                              name="name"
                              id="name"
                              class="form-control"
                              placeholder="Enter your name"
                              type="text"
                            />
                            <ErrorMessage class="text-danger" name="name" />
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="form-group">
                          <label for="inputEmail">Email<span class="text-danger"> *</span></label>
                          <Field
                              v-model="data.email"
                              name="email"
                              id="email"
                              class="form-control"
                              placeholder="Enter your email"
                              type="email"
                            />
                            <ErrorMessage class="text-danger" name="email" />
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="form-group">
                          <label for="inputSkills">Phone<span class="text-danger"> *</span></label>
                          <Field
                              v-model="data.phone"
                              name="phone"
                              id="phone"
                              class="form-control"
                              placeholder="Enter your phone"
                              type="text"
                            />
                            <ErrorMessage class="text-danger" name="phone" />
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="form-group">
                          <label for="inputSkills">Image (<span class="text-danger">accept: png, jpg, jpeg</span>), (<span class="text-danger">max size: 2 MB</span>)</label>
                          <Field
                                v-model="selectedImage"
                                name="file"
                                id="file"
                                class="form-control"
                                type="file"
                                accept=".png, .jpg, .jpeg"
                                @change="onFileChange($event)"
                            />
                            <span class="text-danger">
                              {{ image_file_error ? image_file_size : '' }}
                            </span>
                        </div>
                      </div>
                      
                      <div class="offset-sm-2 col-sm-10">
                        <button :disabled="submitDisabled" type="submit" class="add-button float-right">
                          <i v-if="submitDisabled" class="fa fa-spinner fa-spin"></i>
                          {{ submitDisabled ? "Loading..." : "Submit" }}
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-md-4">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">About Me</h3>
              </div>
              <div class="card-body">

                <div class="text-center">
                  <img
                    class="profile-user-img img-fluid img-circle"
                    :src="data?.photo_url"
                    alt="User profile picture">
                </div>
                
                <hr>
                <i class="fas fa-book mr-1"></i><strong> Name </strong><span class="text-muted">: {{ data.name ? data.name : 'N/A' }}</span>
                <hr>
                <strong><i class="fas fa-mail-bulk mr-1"></i> Email </strong> <span class="text-muted">: {{ data.email ? data.email : 'N/A' }}</span>
                <hr>
                <strong><i class="fas fa-phone mr-1"></i> Phone </strong><span class="text-muted">: {{ data.phone ? data.phone : 'N/A' }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-md-8">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Change Password</h3>

                <div class="row float-right">
                    <label>Show</label>
                    <Toggle class="toggle-button ml-2" v-model="value" :name="'toggle'" :id="'toggle'"
                        :onLabel="'On'" :offLabel="'Off'" :trueValue="true" :falseValue="false" :disabled="false"
                        :required="false" @change="toggle()" />
                </div>
              </div>
              
              <div class="card-body" v-if="filterShow">
                <div class="tab-content">
                  <div class="active tab-pane">
                    <Form class="form-horizontal" 
                      @submit="passwordUpdate"
                      :validation-schema="passwordSchema"
                      :initial-values="passwordData"
                    >
                      <div class="col-12">
                        <div class="form-group">
                          <label for="inputName">Current Password</label>
                          <Field
                              v-model="passwordData.current_password"
                              name="current_password"
                              id="current_password"
                              class="form-control"
                              placeholder="Enter your current password"
                              type="password"
                            />
                          <ErrorMessage class="text-danger" name="current_password" />
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="form-group">
                          <label for="inputName">New Password</label>
                          <Field
                              v-model="passwordData.password"
                              name="password"
                              id="password"
                              class="form-control"
                              placeholder="Enter your new password"
                              type="password"
                            />
                          <ErrorMessage class="text-danger" name="password" />
                        </div>
                      </div>

                      <div class="col-12">
                        <div class="form-group">
                          <label for="inputName">Confirm Password</label>
                          <Field
                              v-model="passwordData.password_confirmation"
                              name="password_confirmation"
                              id="password_confirmation"
                              class="form-control"
                              placeholder="Enter your confirm password"
                              type="password"
                            />
                          <ErrorMessage class="text-danger" name="password_confirmation" />
                        </div>
                      </div>
                      
                      <div class="offset-sm-2 col-sm-10">
                        <button :disabled="changePasswordSubmitDisabled" type="submit" class="add-button float-right">
                          <i v-if="changePasswordSubmitDisabled" class="fa fa-spinner fa-spin"></i>
                          {{ changePasswordSubmitDisabled ? "Loading..." : "Update" }}
                        </button>
                      </div>
                    </Form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue";
  import { Field, Form, ErrorMessage } from "vee-validate";
  import * as yup from "yup";
  import { useToast } from "vue-toastification";
  import { useAuthStore } from "~/stores/auth";
  import Toggle from '@vueform/toggle'

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

  const api_url = useRuntimeConfig().public["apiBaseUrl"];

  const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string().required(),
    phone: yup.number().typeError("Must be a number").required(),
  });

  let selectedImage = ref(null);
  const toast = useToast();
  const user = ref([]);
  const submitDisabled = ref(false);
  const changePasswordSubmitDisabled = ref(false);
  const image_file_error = ref(false);
  const image_file_size = ref("");

  const data = ref({
    name: '',
    email: '',
    phone: '',
    image_url: '',
  });
  
  const onFileChange = (e) => {
    selectedImage.value = e.target.files[0];
    const file_size = selectedImage.value.size;
    
    if (file_size > 2097152) {
        image_file_error.value = true;
        image_file_size.value = "File size must be less than 2 MB";
        return;
    }
    image_file_error.value = false;
    image_file_size.value = "";
  };

  const profileUpdate = async (values) => {
    try{
      if(image_file_error.value) {
        return;
      }

      submitDisabled.value = true;

      let url = api_url + "profile";

      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      formData.append("phone", values.phone);

      if (selectedImage.value) {
        formData.append("image", selectedImage.value);
      }

      const res = await $fetch(url, {
        method: 'POST',
        body: formData,
      });

      if(res.status === 409) {
        submitDisabled.value = false;
        toast.warning(res.message);
        return;
      }

      if (res.status === 200) {
        isLoading.value = true;
        setTimeout(() => {
          toast.success(res.message);
          isLoading.value = false;
          submitDisabled.value = false;
        }, 1000);

        selectedImage.value = null;
        $('#file').val('');
        getProfile();
      } else {
        isLoading.value = false;
        submitDisabled.value = false;
        toast.warning(res.message);
      }

    } catch (error) {
      console.log(error);
    }
  };
  
  const getProfile = async () => {
    const authUser = useAuthStore().user.id
    let url = api_url + "users/" + authUser;

    const res = await $fetch(url, {
      method: 'GET',
    });
    data.value = res.data;
  };

  const passwordSchema = yup.object().shape({
    current_password: yup.string().required(),
    password: yup
    .string()
    .label("New Password")
    .when([], {
      is: () => passwordData.value.id === 0,
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

  const passwordData = ref({
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const clearForm = async () => {
    passwordData.value = {
      current_password: '',
      password: '',
      password_confirmation: '',
    };
  };

  const passwordUpdate = async (values, { resetForm }) => {
    changePasswordSubmitDisabled.value = true;

    try{
      let url = api_url + "update-password";
      const res = await $fetch(url, {
        method: 'POST',
        body: JSON.stringify(values),
      });
      
      if(res.status === 409) {
        changePasswordSubmitDisabled.value = false;
        toast.warning(res.message);
        return;
      }
      
      if (res.status === 200) {
        isLoading.value = true;
        setTimeout(() => {
          toast.success(res.message);
          isLoading.value = false;
          changePasswordSubmitDisabled.value = false;
        }, 1000);

        clearForm();
        resetForm();

      } else {
        isLoading.value = false;
        changePasswordSubmitDisabled.value = false;
        toast.warning(res.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  onMounted( async () => {
    await getProfile();
  });
</script>

<style scoped>
  /* profile-user-img img-fluid img-circle image position fixed */
  .profile-user-img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    object-position: center;
  }
</style>