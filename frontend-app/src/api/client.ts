import axios, { type InternalAxiosRequestConfig } from 'axios'
import { API_BASE_URL, STORAGE_KEYS } from '@/constants'

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
})

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem(STORAGE_KEYS.token)
    if (token) {
      config.headers = config.headers ?? {}
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedMessage =
      error?.response?.data?.message || error?.message || 'Request failed'
    // eslint-disable-next-line no-console
    console.error('[API Error]', normalizedMessage, error?.response)
    if (normalizedMessage && error && typeof error === 'object') {
      error.message = normalizedMessage
    }
    return Promise.reject(error)
  }
)

export default apiClient
