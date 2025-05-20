<template>
  <div class="auth-container">
    <h1>Register</h1>
    <form @submit.prevent="login">
      <input type="text" placeholder="Full name" v-model="full_name" required />
      <input type="email" placeholder="Email" v-model="email" required />
      <input type="password" placeholder="Password" v-model="password" required />
      <button type="submit">Register</button>
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
// const toast = useToast()

const login = async () => {
  try {
    const response = await api.post(endpoints.register, {
      email: email.value,
      password: password.value,
      full_name: full_name.value,
    })
    localStorage.setItem('token', response.data.token)

    success({
      text: 'Login successful!',
      delay: 1500,
    })

    router.push('/')
  } catch (error) {
    alert({
      text: 'Login failed. Please check your credentials.',
      delay: 2000,
    })

    console.log('Login failed', error)
    // toast.error('Login failed. Please check your credentials.')
  }
}
</script>
