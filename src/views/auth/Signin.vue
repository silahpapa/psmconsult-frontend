<template>
<auth-layout>
      <div class="pb-0 card-header text-start">
        <h4 class="font-weight-bolder">Sign In</h4>
        <p class="mb-0">Enter your email and password to sign in</p>
      </div>
      <div class="card-body mb-3">
        <div class="alert alert-success text-white"  v-if="logged_link_send" role="alert" >
           Check your email to get logged in.
        </div>
          <sh-form
              :fields="['email']"
              action="auth/login"
              success-callback="loginSuccessful"
              @loginSuccessful="loginSuccessful"
              :placeholders="{ email:'Enter email address'}"
          ></sh-form>
      </div>
          <div class="px-1 pt-0 text-center card-footer px-lg-2">
        <p class="mx-auto mb-4 text-sm">
          Don't have an account?
          <router-link to="registration"
              href="#"
              class="text-success text-gradient font-weight-bold"
          >Sign up</router-link>
        </p>
          </div>
</auth-layout>
</template>

<script>
import AuthLayout from '@/views/auth/AuthLayout.vue'
import ShForm from '@/components/ShForm.vue'
import shRepo from '@/helpers/ShRepo.js'
const body = document.getElementsByTagName("body")[0];
import { useRouter } from 'vue-router'

export default {
  name: "signin",
  inject: ['global'],
  data() {
    return {
      logged_link_send: false
    }
  },
  components: {
    ShForm,
    AuthLayout
  },
  methods: {
    loginSuccessful: function (response) {
      if(response.message) {
        this.logged_link_send = true
      shRepo.showToast(response.message, 'success')
      }
    }
  }
};
</script>
