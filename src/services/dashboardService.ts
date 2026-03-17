import { apiClient } from './apiClient'

interface StatValue {
  value: number
  percentageChange: number
}

export interface DashboardStatsResponse {
  totalDestinations: StatValue
  totalPackages: StatValue
  activeBookings: StatValue
  revenue: StatValue
  recentActivities: RecentActivityResponse[]
}

export interface DashboardStats {
  totalDestinations: number
  totalPackages: number
  activeBookings: number
  revenue: number
  destinationsChange: number
  packagesChange: number
  bookingsChange: number
  revenueChange: number
}

interface RecentActivityResponse {
  type: 'package' | 'destination' | 'booking'
  description: string
  timestamp: string
  icon: string
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
      const response = await apiClient.get<DashboardStatsResponse>('/api/admin/dashboard/stats')
      const data = response.data
      
      // Transform backend response to frontend format
      return {
        totalDestinations: data.totalDestinations.value,
        totalPackages: data.totalPackages.value,
        activeBookings: data.activeBookings.value,
        revenue: data.revenue.value,
        destinationsChange: data.totalDestinations.percentageChange,
        packagesChange: data.totalPackages.percentageChange,
        bookingsChange: data.activeBookings.percentageChange,
        revenueChange: data.revenue.percentageChange,
      }
    } catch (error: any) {
      // Silently handle errors - backend endpoint may not be fully implemented
      console.warn('⚠️ Dashboard stats endpoint error - using fallback data:', error?.response?.status || error.message)
      // Return fallback data if API fails
      return {
        totalDestinations: 0,
        totalPackages: 0,
        activeBookings: 0,
        revenue: 0,
        destinationsChange: 0,
        packagesChange: 0,
        bookingsChange: 0,
        revenueChange: 0,
      }
    }
  },

  async getRecentActivity(): Promise<RecentActivity[]> {
    try {
      const response = await apiClient.get<DashboardStatsResponse>('/api/admin/dashboard/stats')
      const activities = response.data.recentActivities || []
      
      // Transform backend response to frontend format
      return activities.map((activity, index) => ({
        id: index + 1,
        type: activity.type,
        title: this.getActivityTitle(activity),
        subtitle: this.getActivitySubtitle(activity),
        timestamp: activity.timestamp,
      }))
    } catch (error: any) {
      // Only log if it's not a 404 (endpoint not implemented yet)
      if (error?.response?.status !== 404) {
        console.warn('⚠️ Dashboard recent activities error:', error?.response?.status || error.message)
      }
      return []
    }
  },

  getActivityTitle(activity: RecentActivityResponse): string {
    if (activity.type === 'package') {
      return 'New Package Created'
    } else if (activity.type === 'destination') {
      return 'New Destination Added'
    } else {
      return 'New Booking'
    }
  },

  getActivitySubtitle(activity: RecentActivityResponse): string {
    return activity.description
  },
}
