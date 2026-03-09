import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  MapPin, 
  Package, 
  LogOut, 
  Menu,
  X,
  Sparkles,
  Hotel
} from 'lucide-react'
import { useState } from 'react'
import { authService } from '@/services/authService'
import { toast } from 'sonner'
import { ROUTES } from '@/config/constants'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const navigation = [
    { name: 'Dashboard', href: ROUTES.ADMIN_DASHBOARD, icon: LayoutDashboard },
    { name: 'Destinations', href: ROUTES.ADMIN_DESTINATIONS, icon: MapPin },
    { name: 'Packages', href: ROUTES.ADMIN_PACKAGES, icon: Package },
    { name: 'Activities', href: '/admin/activities', icon: Sparkles },
    { name: 'Hotels', href: '/admin/hotels', icon: Hotel },
  ]

  const isActive = (path: string) => {
    if (path === ROUTES.ADMIN_DASHBOARD) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <Link to={ROUTES.ADMIN_DASHBOARD} className="flex items-center space-x-2">
              <Package className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-gray-900">TNT Admin</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg
                    transition-colors duration-150
                    ${active
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center justify-between px-4 py-3 rounded-lg bg-gray-50">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.fullName || 'Admin User'}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-3 p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center h-16 px-4 bg-white border-b border-gray-200 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-4 text-gray-500 hover:text-gray-700"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">
              {navigation.find(item => isActive(item.href))?.name || 'Admin Panel'}
            </h1>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
