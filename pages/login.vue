<template>
  <div class="hold-transition login-page">
    <div class="login-box">
      <!-- /.login-logo -->
      <div class="card">
        <div class="card-body login-card-body">
          <!-- Login From -->
          <div class="form login_form">
            <Form
              @submit="onSubmit" 
              :validation-schema="schema"
              :initial-values="list"
            >
              <div class="login-logo">
                <img src="../../images/bteb-logo.png" alt="logo" class="img-fluid" />
              </div>

              <span class="project-name">e-RPL platforms for Skills Assessment and Certification</span>
              
              <div class="input-group">
                <Field
                  :class="{'is-invalid' : errors.email}"
                  type="email" 
                  name="email" 
                  class="form-control" 
                  placeholder="Email" 
                  v-model="email"/>
                <div class="input-group-append">
                  <div class="input-group-text">
                    <span class="fas fa-envelope"></span>
                  </div>
                </div>
              </div>
              <ErrorMessage class="text-danger" name="email" />

              <div class="mb-3"></div>

              <div class="input-group">
                <Field
                  :class="{'is-invalid' : errors.password}"
                  id="password"
                  name="password" 
                  class="form-control" 
                  placeholder="Password" 
                  v-model="password"
                  :type="passwordVisible ? 'text' : 'password'" />
                <div class="input-group-append">
                  <div class="input-group-text" id="input-group-text">
                    <span :class="passwordVisible ? 'fa fa-eye' : 'fa fa-eye-slash'" id="togglePassword"
                      @click="togglePasswordVisibility">
                    </span>
                    <!-- <span class="fas fa-lock"></span> -->
                  </div>
                </div>
              </div>
              <ErrorMessage class="text-danger" name="password" />

              <div class="option_field mt-2">
                <NuxtLink to="/forgot-password" class="forgot_pw">Forgot password ?</NuxtLink>
              </div>

              <span class="checkbox">
                <input type="checkbox" id="remember" v-model="remember" @change="remember_me" />
                <label for="check">Remember me</label>
              </span>

              <button :disabled="submitDisabled" type="submit" class="btn btn-success btn-sm w-100">
                <i v-if="submitDisabled" class="fa fa-spinner fa-spin"></i>
                {{ submitDisabled ? "Loading..." : "Login" }}
              </button>
            </Form>
          </div>
        </div>
        <!-- /.login-card-body -->
      </div>
    </div>
  </div>
</template>

<script setup>
  useHead({
    title: "e-RPL platforms",
  });

  definePageMeta({
    layout: "auth",
  });

  import { Field, Form, ErrorMessage } from "vee-validate";
  import { useAuthStore } from "~/stores/auth";
  const { $toast } = useNuxtApp();
  const authStore = useAuthStore();
  import * as yup from "yup";
  import { useForm } from "vee-validate";

  const passwordVisible = ref(false);
  const submitDisabled = ref(false);

  let list = {
    email: "",
    password: "",
  };

  const togglePasswordVisibility = () => {
    passwordVisible.value = !passwordVisible.value;
    const passwordInput = document.getElementById("password");
    if (passwordVisible.value) {
      passwordInput.setAttribute("type", "text");
    } else {
      passwordInput.setAttribute("type", "password");
    }
  };

  const remember_me = useCookie("remember");
  if (remember_me.value === undefined) {
    remember_me.value = {
      is_remember_me: false,
      email: "",
      password: "",
    };
  }

  const schema = yup.object({
    email: yup.string().email().required(),
    password: yup.string().required(),
  });

  //error message
  const { useFieldModel, errors } = useForm({
    validationSchema: schema,
  });
  const [email, password] = useFieldModel(["email", "password"]);

  email.value = remember_me.value.email;
  password.value = remember_me.value.password;
  const remember = ref(remember_me.value.is_remember_me);

  const onSubmit = async (values) => {
    submitDisabled.value = true;

    try {
      const form = ref({
        value: {
          email: values.email,
          password: values.password,
        },
      });

      const isSignInCheck = authStore.signIn(form.value, submitDisabled);

      if (!isSignInCheck) {
        submitDisabled.value = false;

      } else {
        if (remember.value) {
          remember_me.value = {
            is_remember_me: true,
            email: email.value,
            password: password.value,
          };
        } else {
          remember_me.value = {
            is_remember_me: false,
            email: "",
            password: "",
          };
        }
      }
    } catch (error) {
      console.log(error);
      submitDisabled.value = false;
    }
  };
</script>

<style scoped></style>
