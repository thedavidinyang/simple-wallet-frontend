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
      <button type="submit" class="btn btn-primary w-100">>Register</button>
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

const register = async () => {
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

<style scoped>
.center {
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
  color: #333;
}
.auth-container {
  max-width: 400px;
  margin: 60px auto;
  padding: 2rem 2.5rem 2rem 2.5rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}

.auth-title {
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 600;
  color: #333;
}

.auth-form .form-group {
  margin-bottom: 1.2rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
  margin-bottom: 1rem;
}

.form-control:focus {
  border-color: #007bff;
  outline: none;
}

.btn {
  display: inline-block;
  width: 50%;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
}

.btn-primary {
  background: #007bff;
  border: none;
  color: #fff;
  font-weight: 500;
  padding: 0.75rem 0;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #0056b3;
}
</style>
