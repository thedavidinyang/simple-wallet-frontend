<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import endpoints from '../services/endpoints'

const wallet = ref(null)

const router = useRouter()

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
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data &&
      error.response.data.message === 'Token has expired'
    ) {
      localStorage.removeItem('token')
      router.push('/login')
    } else {
      wallet.value = null
      // Optionally handle other errors
    }
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

        <div class="col-lg-12 transactions">
          <div class="card">
            <div class="card-header black">Transactions</div>
            <div class="card-body green">
              {transactions}
              <p>Transaction history will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
