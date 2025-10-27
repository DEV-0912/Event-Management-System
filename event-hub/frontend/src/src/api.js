import axios from 'axios'

// If VITE_API_BASE is set (e.g., https://events.vjstartup.com), use it.
// Otherwise default to the current origin so requests like '/api/...'
// go to `${origin}/api/...` without duplicating '/api'.
const base = import.meta.env.VITE_API_BASE || (typeof window !== 'undefined' ? window.location.origin : '')
export const api = axios.create({ baseURL: base })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  // Avoid double '/api' if baseURL already points to an API root ending with '/api'
  try {
    const endsWithApi = /\/api\/?$/.test(api.defaults.baseURL || '')
    if (endsWithApi && typeof config.url === 'string' && config.url.startsWith('/api/')) {
      config.url = config.url.replace(/^\/api\//, '/')
    }
  } catch {}
  return config
})
