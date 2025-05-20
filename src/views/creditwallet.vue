<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import endpoints from '../services/endpoints'
import monify from '../services/monify'
import { setAuth } from '../stores/auth'
import { alert, success } from '@pnotify/core'

const wallet = ref(null)
const creditAmount = ref('')
const loading = ref(false)
const router = useRouter()

// Fetch wallet balance
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
      setAuth(null)
      router.push('/login')
    } else {
      wallet.value = null
    }
  }
})

const formattedWallet = computed(() => {
  if (wallet.value === null || isNaN(wallet.value)) return '0.00'
  return Number(wallet.value).toFixed(2)
})

async function creditWalletWithMonnifyResponse(response) {
  success({
    text: 'verifying payment...',
    delay: 1500,
  })
  try {
    const token = localStorage.getItem('token')
    await api.post(endpoints.creditWallet, response, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    success({
      title: 'Success',
      text: 'Wallet credited successfully!',
      delay: 1500,
    })

    const res = await api.get(endpoints.wallet, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    wallet.value = res.data.data.balance
    creditAmount.value = ''
  } catch (error) {
    alert({
      title: 'Error',
      text: error.response?.data?.message || 'Failed to credit wallet.',
      delay: 2000,
      type: 'error',
    })
  }
}

// Monnify payment integration
function payWithMonnify() {
  if (!window.MonnifySDK) {
    const script = document.createElement('script')
    script.src = 'https://sdk.monnify.com/plugin/monnify.js'
    script.onload = () => launchMonnify()
    document.body.appendChild(script)
  } else {
    launchMonnify()
  }
}

function launchMonnify() {
  const amount = Number(creditAmount.value)
  if (!amount || amount <= 0) {
    alert({
      title: 'Error',
      text: 'Please enter a valid amount.',
      delay: 2000,
      type: 'error',
      styling: 'bootstrap4',
    })
    return
  }

  window.MonnifySDK.initialize({
    amount,
    currency: 'NGN',
    reference: String(Date.now()),
    customerFullName: 'Wallet User',
    customerEmail: 'user@email.com',
    apiKey: monify.ApiKey,
    // apiKey: import.meta.env.VITE_MONNIFY_API_KEY,
    contractCode: monify.ContractCode,
    // contractCode: import.meta.env.VITE_MONNIFY_CONTRACT_CODE,
    paymentDescription: 'Wallet Credit',
    metadata: {
      source: 'wallet-credit',
    },

    onLoadStart: () => {},
    onLoadComplete: () => {},
    onComplete: (response) => {
      success({
        text: 'verifying payment...',
        delay: 1500,
      })

      creditWalletWithMonnifyResponse(response)
    },
    onClose: function (data) {},
  })
}
</script>

<template>
  <div class="container">
    <h1>Dashboard</h1>
    <p>Welcome to your dashboard!</p>

    <div class="row">
      <div class="row">
        <div class="col-lg-12">
          <div class="card">
            <div class="card-header black">Wallet balance</div>
            <div class="card-body green">
              <div v-if="wallet !== null">
                <h1>N {{ formattedWallet }}</h1>
              </div>
              <div v-else>
                <p>Loading wallet data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-12 transactions mt-4">
        <div class="card">
          <div class="card-header black">Credit Wallet</div>
          <div class="card-body green">
            <form @submit.prevent="payWithMonnify">
              <div class="mb-3">
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  v-model="creditAmount"
                  class="form-control"
                  placeholder="Enter amount"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary">Pay With Monnify</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
