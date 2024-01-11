<template>
  <div>
    <div class="container">
      <div class="d-flex justify-content-center align-items-center min-vh-100">
        <div class="card">
          <div class="card-body">
              <div v-if="error" class="alert text-white alert-danger" role="alert">
                {{ error }}
            <button v-if="error" @click="goToLogin" class="btn btn-primary mt-3">
              Go to Login
            </button>
              </div>

          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import shApis from '@/helpers/ShApis.js'

export default {
  inject: ['global'],
  data() {
    return {
      expiresAt: null,
      signature: null,
      user_id: null,
      error: null,
    }
  },
  created() {
    const isSignatureValid =
        this.$route.query.hasOwnProperty('expires_at') &&
        this.$route.query.hasOwnProperty('user_id') &&
        this.$route.query.hasOwnProperty('signature')
    if (isSignatureValid) {
      this.expiresAt = this.$route.query.expires_at;
      this.signature = this.$route.query.signature;
      this.user_id = this.$route.query.user_id;
      shApis.doGet('login/'+ this.user_id + '/' + this.expiresAt + '/', {
        signature: this.signature,
      }).then((response) => {
        if (response.data.user) {
          const accessToken = response.data.access_token
          localStorage.setItem('access_token', accessToken)
          this.global.setLoggedInUser(accessToken,  response.data.user)
          window.location.href='/user/profile'
        }
      }).catch((error) => {
        if (error.response && error.response.status === 401) {
          this.error = 'Invalid or expired login link.'
        } else {
          console.error(error)
        }
      })
    }

  },
  methods: {
    goToLogin() {
      this.$router.push({ name: 'login' })
    },
  },
};
</script>
