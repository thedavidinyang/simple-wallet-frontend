import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  // baseURL: window.env.VITE_API_BASE_URL,
  // baseURL: import.meta.env.VITE_API_BASE_URL,
})

export default api
