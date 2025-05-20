<template>
  <div class="auth-container">
    <form @submit.prevent="register">
      <h1 class="center">Register</h1>
      <input
        type="text"
        placeholder="Full name"
        class="form-control"
        v-model="full_name"
        required
      />
      <input type="email" placeholder="Email" class="form-control" v-model="email" required />
      <input
        type="password"
        placeholder="Password"
        class="form-control"
        v-model="password"
        required
      />
      <button type="submit" class="btn btn-primary w-100">Register</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import endpoints from '../services/endpoints'

import { alert, success } from '@pnotify/core'
import '@pnotify/core/dist/PNotify.css'
import '@pnotify/core/dist/BrightTheme.css'

const full_name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()

const register = async () => {
  try {
    const response = await api.post(endpoints.register, {
      email: email.value,
      password: password.value,
      full_name: full_name.value,
    })

    success({
      text: 'Regitration successful!',
      delay: 1500,
      addClass: 'pnotify-bootstrap4',
    })

    router.push('/login')
  } catch (error) {
    alert({
      title: 'Registration Failed: ' + error.response.data.message,
      text: error.response.data.error,
      delay: 2000,
      addClass: 'pnotify-bootstrap4',
    })

    console.log('Login failed', error)
  }
}
</script>
