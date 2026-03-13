// Use empty string for local dev (proxy) or full URL for production
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'TNT Travel'

// Debug logging
console.log('📋 [CONSTANTS] Configuration loaded:')
console.log('📋 [CONSTANTS] API_BASE_URL:', API_BASE_URL)
console.log('📋 [CONSTANTS] APP_NAME:', APP_NAME)
console.log('📋 [CONSTANTS] Mode:', import.meta.env.MODE)
console.log('📋 [CONSTANTS] All env vars:', import.meta.env)

export const ROUTES = {
  // Public routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DESTINATIONS: '/destinations',
  DESTINATION_DETAIL: (id: number) => `/destinations/${id}`,
  PACKAGES: '/packages',
  PACKAGE_DETAIL: (id: number) => `/packages/${id}`,
  
  // Admin routes
  ADMIN_DASHBOARD: '/admin',
  ADMIN_DESTINATIONS: '/admin/destinations',
  ADMIN_DESTINATIONS_CREATE: '/admin/destinations/create',
  ADMIN_DESTINATIONS_EDIT: (id: number) => `/admin/destinations/${id}`,
  ADMIN_PACKAGES: '/admin/packages',
  ADMIN_PACKAGES_CREATE: '/admin/packages/create',
  ADMIN_PACKAGES_EDIT: (id: number) => `/admin/packages/${id}`,
} as const

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
} as const
