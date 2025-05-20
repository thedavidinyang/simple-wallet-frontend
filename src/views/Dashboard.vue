<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import endpoints from '../services/endpoints'
import { setAuth } from '../stores/auth'

const wallet = ref(null)
const transactions = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = ref(10)
const loadingTransactions = ref(false)

const router = useRouter()

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  const options = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }
  return date.toLocaleString(undefined, options)
}

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
    fetchTransactions()
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

// Fetch transactions with pagination
async function fetchTransactions(page = 1) {
  loadingTransactions.value = true
  try {
    const token = localStorage.getItem('token')
    const response = await api.get(endpoints.transactions, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        per_page: perPage.value,
      },
    })
    const data = response.data.data
    transactions.value = data.data || []
    currentPage.value = data.current_page || 1
    totalPages.value = data.last_page || 1
    perPage.value = data.per_page || 10
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
      transactions.value = []
    }
  } finally {
    loadingTransactions.value = false
  }
}

const formattedWallet = computed(() => {
  if (!wallet.value || isNaN(wallet.value)) return '0.00'
  return Number(wallet.value).toFixed(2)
})

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    fetchTransactions(page)
  }
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
              <div v-if="wallet">
                <h1>{{ formattedWallet }}</h1>
              </div>
              <div v-else>
                <p>Loading wallet data...</p>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-12 transactions mt-4">
          <div class="card">
            <div class="card-header black">Transactions</div>
            <div class="card-body green">
              <div v-if="loadingTransactions">
                <p>Loading transactions...</p>
              </div>
              <div v-else>
                <table v-if="transactions.length" class="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(txn, idx) in transactions" :key="txn.id || idx">
                      <td>{{ idx + 1 + (currentPage - 1) * perPage }}</td>
                      <td>{{ formatDate(txn.created_at) }}</td>
                      <td>{{ txn.type }}</td>
                      <td>{{ Number(txn.amount).toFixed(2) }}</td>
                      <td>{{ txn.status }}</td>
                    </tr>
                  </tbody>
                </table>
                <div v-else>
                  <p>No transactions found.</p>
                </div>
                <!-- Pagination Controls -->
                <nav v-if="totalPages > 1" class="mt-3">
                  <ul class="pagination justify-content-center">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <button
                        class="page-link"
                        @click="goToPage(currentPage - 1)"
                        :disabled="currentPage === 1"
                      >
                        Previous
                      </button>
                    </li>
                    <li
                      class="page-item"
                      v-for="page in totalPages"
                      :key="page"
                      :class="{ active: currentPage === page }"
                    >
                      <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <button
                        class="page-link"
                        @click="goToPage(currentPage + 1)"
                        :disabled="currentPage === totalPages"
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
