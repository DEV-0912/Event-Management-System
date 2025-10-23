import axios from 'axios'

const base = import.meta.env.VITE_API_BASE || 'https://events.vjstartup.com/ef-be'
export const api = axios.create({ baseURL: base })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
