import { ref } from 'vue'

export const isAuthenticated = ref(!!localStorage.getItem('token'))

export function setAuth(token) {
  if (token) {
    localStorage.setItem('token', token)
    isAuthenticated.value = true
  } else {
    localStorage.removeItem('token')
    isAuthenticated.value = false
  }
}
