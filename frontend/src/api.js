import axios from 'axios'


// Change VITE_API_BASE to VITE_API_URL to match your .env
const API_BASE = import.meta.env.VITE_API_URL ;

const instance = axios.create({ 
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
})


instance.interceptors.request.use((config) => {
  // Consistency check: use 'access_token' everywhere
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Optional: Global error handler for 401 (Unauthorized)
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('access_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default instance
