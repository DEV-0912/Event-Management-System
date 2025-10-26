import axios from 'axios'

const base = import.meta.env.VITE_API_BASE || 'https://events.vjstartup.com/ef-be'
export const api = axios.create({ baseURL: base, withCredentials: true })

api.interceptors.request.use((config) => {
  // Only send Authorization header if no cookie auth (for backward compatibility)
  const token = localStorage.getItem('auth_token')
  if (token && !document.cookie.includes('auth_token=')) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
