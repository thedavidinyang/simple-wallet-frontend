<template>
  <div class="auth-container">
    <h1>Login</h1>
    <form @submit.prevent="login">
      <input type="email" placeholder="Email" v-model="email" required />
      <input type="password" placeholder="Password" v-model="password" required />
      <button type="submit">Login</button>
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
