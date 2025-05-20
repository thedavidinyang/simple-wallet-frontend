<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">Register</div>
          <div class="card-body">
            <input v-model="name" type="text" class="form-control mb-2" placeholder="Full Name" />
            <input v-model="email" type="email" class="form-control mb-2" placeholder="Email" />
            <input v-model="password" type="password" class="form-control mb-3" placeholder="Password" />
            <button class="btn btn-success w-100" @click="register">Register</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import api from '../services/api'
import endpoints from '../services/endpoints'

const name = ref('')
const email = ref('')
const password = ref('')
const router = useRouter()
const toast = useToast()

const register = async () => {
  try {
    await api.post(endpoints.register, {
      name: name.value,
      email: email.value,
      password: password.value
    })
    toast.success('Registration successful! You can now log in.')
    router.push('/login')
  } catch {
    toast.error('Registration failed. Please try again.')
  }
}
</script>
