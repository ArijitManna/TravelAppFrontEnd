import { Package, MapPin, Users, TrendingUp } from 'lucide-react'

export default function AdminDashboard() {
  const stats = [
    { name: 'Total Destinations', value: '24', icon: MapPin, change: '+4.75%', changeType: 'positive' },
    { name: 'Total Packages', value: '156', icon: Package, change: '+12.5%', changeType: 'positive' },
    { name: 'Active Bookings', value: '89', icon: Users, change: '+8.2%', changeType: 'positive' },
    { name: 'Revenue (MTD)', value: '$124.5K', icon: TrendingUp, change: '+23.1%', changeType: 'positive' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your travel business today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white px-4 py-5 shadow border border-gray-200 sm:px-6 sm:py-6"
            >
              <dt>
                <div className="absolute rounded-md bg-primary p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">{stat.name}</p>
              </dt>
              <dd className="ml-16 flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                <p className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                  {stat.change}
                </p>
              </dd>
            </div>
          )
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a
              href="/admin/destinations/create"
              className="block px-4 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-primary mr-3" />
                <span className="font-medium">Add New Destination</span>
              </div>
            </a>
            <a
              href="/admin/packages/create"
              className="block px-4 py-3 rounded-lg border border-gray-200 hover:border-primary hover:bg-primary/5 transition-colors"
            >
              <div className="flex items-center">
                <Package className="w-5 h-5 text-primary mr-3" />
                <span className="font-medium">Create New Package</span>
              </div>
            </a>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start">
              <div className="w-2 h-2 mt-2 rounded-full bg-green-500 mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">New package created</p>
                <p className="text-gray-500">Maldives Paradise • 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 mt-2 rounded-full bg-blue-500 mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">Destination updated</p>
                <p className="text-gray-500">Bali, Indonesia • 5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="w-2 h-2 mt-2 rounded-full bg-purple-500 mr-3"></div>
              <div>
                <p className="font-medium text-gray-900">New booking received</p>
                <p className="text-gray-500">Swiss Alps Tour • 1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
