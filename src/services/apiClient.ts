import axios, { AxiosInstance, AxiosError } from 'axios'
import { API_BASE_URL, STORAGE_KEYS } from '@/config/constants'
import type { ApiError } from '@/types'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    console.log('🔧 [API CLIENT] Initializing...')
    console.log('🔧 [API CLIENT] Base URL from env:', import.meta.env.VITE_API_BASE_URL)
    console.log('🔧 [API CLIENT] API_BASE_URL constant:', API_BASE_URL)
    console.log('🔧 [API CLIENT] Window location:', window.location.href)
    
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    })
    
    console.log('✅ [API CLIENT] Axios instance created with baseURL:', this.client.defaults.baseURL)

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        console.log('📤 [API REQUEST] URL:', config.url)
        console.log('📤 [API REQUEST] Base URL:', config.baseURL)
        console.log('📤 [API REQUEST] Full URL:', config.baseURL + config.url)
        console.log('📤 [API REQUEST] Method:', config.method?.toUpperCase())
        
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Unauthorized - clear auth and redirect to login
          localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
          localStorage.removeItem(STORAGE_KEYS.USER)
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  getInstance(): AxiosInstance {
    return this.client
  }
}

export const apiClient = new ApiClient().getInstance()
