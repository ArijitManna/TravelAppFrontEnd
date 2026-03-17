import { Outlet, Link } from 'react-router-dom'
import { Package } from 'lucide-react'
import { ROUTES } from '@/config/constants'
import { authService } from '@/services/authService'

export default function PublicLayout() {
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getCurrentUser()

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-gradient-to-r from-cyan-100 to-cyan-50 border-b border-cyan-300 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to={ROUTES.HOME} className="flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Package className="w-7 h-7 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-gray-800">TNT Travel</span>
                <span className="text-xs text-gray-600 uppercase tracking-wide">Explore the Wonderful World</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to={ROUTES.HOME}
                className="text-base font-semibold text-gray-700 hover:text-cyan-600 transition-colors"
              >
                Home
              </Link>
              <Link
                to={ROUTES.DESTINATIONS}
                className="text-base font-semibold text-gray-700 hover:text-cyan-600 transition-colors"
              >
                Destination
              </Link>
              <Link
                to={ROUTES.PACKAGES}
                className="text-base font-semibold text-gray-700 hover:text-cyan-600 transition-colors"
              >
                Packages
              </Link>
            </nav>

            {/* Auth buttons */}
            <div className="flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-sm font-medium text-gray-700">
                    Hi, {user?.fullName}
                  </span>
                  {user?.role === 'admin' && (
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      className="text-base font-semibold text-gray-700 hover:text-cyan-600 transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      authService.logout()
                      window.location.href = ROUTES.LOGIN
                    }}
                    className="text-base font-semibold text-gray-700 hover:text-red-600 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to={ROUTES.LOGIN}
                    className="text-base font-semibold text-gray-700 hover:text-cyan-600 transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="px-6 py-2.5 text-base font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Package className="w-6 h-6" />
                <span className="text-lg font-bold">TNT Travel</span>
              </div>
              <p className="text-sm text-gray-400">
                Explore the world with our curated travel packages and destinations.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link to={ROUTES.HOME} className="hover:text-white">Home</Link></li>
                <li><Link to={ROUTES.DESTINATIONS} className="hover:text-white">Destinations</Link></li>
                <li><Link to={ROUTES.PACKAGES} className="hover:text-white">Packages</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>&copy; 2026 TNT Travel. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
