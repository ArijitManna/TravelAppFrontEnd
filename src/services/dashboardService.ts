import { apiClient } from './apiClient'

export interface DashboardStats {
  totalDestinations: number
  totalPackages: number
  activeBookings: number
  revenue: number
  destinationsChange?: string
  packagesChange?: string
  bookingsChange?: string
  revenueChange?: string
}

export interface RecentActivity {
  id: number
  type: 'package' | 'destination' | 'booking'
  title: string
  subtitle: string
  timestamp: string
}

export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>('/api/Dashboard/stats')
      return response.data
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
      // Return fallback data if API fails
      return {
        totalDestinations: 0,
        totalPackages: 0,
        activeBookings: 0,
        revenue: 0,
      }
    }
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      const response = await apiClient.get<RecentActivity[]>('/api/Dashboard/recent-activity')
      return response.data
    } catch (error) {
      console.error('Failed to fetch recent activity:', error)
      return []
    }
  },
}
