import { apiClient } from './apiClient'
import type { RegisterRequest, LoginRequest, AuthResponse, User } from '@/types'
import { STORAGE_KEYS } from '@/config/constants'

export const authService = {
  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/Auth/register', data)
    this.saveAuth(response.data)
    return response.data
  },

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>('/api/Auth/login', data)
    this.saveAuth(response.data)
    return response.data
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
    localStorage.removeItem(STORAGE_KEYS.USER)
  },

  saveAuth(authData: AuthResponse): void {
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, authData.token)
    const user: User = {
      userId: authData.userId,
      fullName: authData.fullName,
      email: authData.email,
      role: authData.role
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user))
  },

  getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
  },

  getCurrentUser(): any {
    const userStr = localStorage.getItem(STORAGE_KEYS.USER)
    if (!userStr || userStr === 'undefined' || userStr === 'null') {
      return null
    }
    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
