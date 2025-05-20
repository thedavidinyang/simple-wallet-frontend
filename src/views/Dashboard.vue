<script setup>
import { ref, onMounted, computed } from 'vue'
import api from '../services/api'
import endpoints from '../services/endpoints'

const wallet = ref(null)

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const response = await api.get(endpoints.wallet, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    wallet.value = response.data.data.balance
  } catch (error) {
    wallet.value = null
    // Optionally handle error (e.g., show notification)
  }
})

const formattedWallet = computed(() => {
  if (!wallet.value || isNaN(wallet.value)) return '0.00'
  return Number(wallet.value).toFixed(2)
})
</script>

<template>
  <div class="container">
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard!</p>

    <div class="row">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header black">Wallet ballance</div>
            <div class="card-body green">
              <div v-if="wallet">
                <h1>{{ formattedWallet }}</h1>
              </div>
              <div v-else>
                <p>Loading wallet data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
