import { Package, MapPin, Users, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { dashboardService, type DashboardStats, type RecentActivity } from '@/services/dashboardService'
import { toast } from 'sonner'

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsData, activitiesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentActivity()
      ])
      setStats(statsData)
      setRecentActivities(activitiesData)
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'package': return 'bg-gradient-to-br from-purple-500 to-pink-500'
      case 'destination': return 'bg-gradient-to-br from-blue-500 to-cyan-500'
      case 'booking': return 'bg-gradient-to-br from-emerald-500 to-teal-500'
      default: return 'bg-gradient-to-br from-gray-500 to-gray-600'
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'package': return Package
      case 'destination': return MapPin
      case 'booking': return Users
      default: return Package
    }
  }

  const dashboardCards = stats ? [
    { 
      name: 'Total Destinations', 
      value: stats.totalDestinations.toString(), 
      icon: MapPin, 
      change: `${stats.destinationsChange >= 0 ? '+' : ''}${stats.destinationsChange}%`, 
      changeType: stats.destinationsChange >= 0 ? 'positive' : 'negative',
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50',
      iconBg: 'bg-blue-500'
    },
    { 
      name: 'Total Packages', 
      value: stats.totalPackages.toString(), 
      icon: Package, 
      change: `${stats.packagesChange >= 0 ? '+' : ''}${stats.packagesChange}%`, 
      changeType: stats.packagesChange >= 0 ? 'positive' : 'negative',
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50',
      iconBg: 'bg-purple-500'
    },
    { 
      name: 'Active Bookings', 
      value: stats.activeBookings.toString(), 
      icon: Users, 
      change: `${stats.bookingsChange >= 0 ? '+' : ''}${stats.bookingsChange}%`, 
      changeType: stats.bookingsChange >= 0 ? 'positive' : 'negative',
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50',
      iconBg: 'bg-emerald-500'
    },
    { 
      name: 'Revenue (MTD)', 
      value: `$${(stats.revenue / 1000).toFixed(1)}K`, 
      icon: TrendingUp, 
      change: `${stats.revenueChange >= 0 ? '+' : ''}${stats.revenueChange}%`, 
      changeType: stats.revenueChange >= 0 ? 'positive' : 'negative',
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50',
      iconBg: 'bg-orange-500'
    },
  ] : []

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">Dashboard Overview</h2>
        <p className="mt-2 text-gray-600">
          Welcome back! Here's what's happening with your travel business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {dashboardCards.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${stat.bgGradient} p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/50 group hover:scale-105`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${stat.iconBg} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className={`text-3xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.value}
                </p>
              </div>
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`} />
            </div>
          )
        })}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-2xl bg-white/70 backdrop-blur-sm p-6 shadow-lg border border-white/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full mr-3"></span>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <a
              href="/admin/destinations/create"
              className="block px-5 py-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 hover:border-blue-400 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-blue-500 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 block">Add New Destination</span>
                  <span className="text-xs text-gray-500">Create a new travel destination</span>
                </div>
              </div>
            </a>
            <a
              href="/admin/packages/create"
              className="block px-5 py-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 hover:border-purple-400 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center">
                <div className="p-2 bg-purple-500 rounded-lg mr-4 group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <div>
                  <span className="font-semibold text-gray-900 block">Create New Package</span>
                  <span className="text-xs text-gray-500">Build a travel package</span>
                </div>
              </div>
            </a>
          </div>
        </div>

        <div className="rounded-2xl bg-white/70 backdrop-blur-sm p-6 shadow-lg border border-white/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="w-1 h-6 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full mr-3"></span>
            Recent Activity
          </h3>
          {recentActivities.length > 0 ? (
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity) => {
                const ActivityIcon = getActivityIcon(activity.type)
                return (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl hover:bg-white/50 transition-colors">
                    <div className={`p-2 rounded-lg ${getActivityColor(activity.type)} flex-shrink-0`}>
                      <ActivityIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{activity.title}</p>
                      <p className="text-xs text-gray-500 truncate">{activity.subtitle}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(activity.timestamp).toLocaleDateString()}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-sm text-gray-500">No recent activities</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
