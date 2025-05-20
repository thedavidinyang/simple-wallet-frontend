import axios from 'axios'

const api = axios.create({
  baseURL: window.env.VITE_API_BASE_URL,
  // baseURL: import.meta.env.VITE_API_BASE_URL,
})

export default api
