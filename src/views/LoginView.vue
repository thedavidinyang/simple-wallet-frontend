<template>
  <div class="auth-container">
    <form @submit.prevent="login">
      <h1 class="center">Login</h1>
      <input type="email" class="form-control" placeholder="Email" v-model="email" required />

      <input
        type="password"
        placeholder="Password"
        class="form-control"
        v-model="password"
        required
      />

      <button type="submit" class="btn btn-primary w-100">Login</button>
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

const email = ref('')
const password = ref('')
const router = useRouter()

const login = async () => {
  try {
    const response = await api.post(endpoints.login, {
      email: email.value,
      password: password.value,
    })

    localStorage.setItem('token', response.data.token)

    success({
      text: 'Login successful!',
      delay: 1500,
    })

    router.push('/dashboard')
  } catch (error) {
    alert({
      text: 'Login failed. Please check your credentials.',
      delay: 2000,
      type: 'error',
    })

    console.log('Login failed', error)
  }
}
</script>
