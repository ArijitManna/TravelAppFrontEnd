import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Star, MapPin, Calendar } from 'lucide-react'
import { packagesService } from '@/services/packagesService'
import { destinationsService } from '@/services/destinationsService'
import type { Package, Destination, PackageFilters } from '@/types'
import { ROUTES } from '@/config/constants'
import { formatCurrency } from '@/lib/utils'

export default function Packages() {
  const [packages, setPackages] = useState<Package[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<PackageFilters>({})
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchDestinations()
    fetchPackages()
  }, [filters])

  const fetchDestinations = async () => {
    try {
      const data = await destinationsService.getAll()
      setDestinations(data.filter(d => d.isActive))
    } catch (error) {
      console.error('Failed to fetch destinations', error)
    }
  }

  const fetchPackages = async () => {
    try {
      setLoading(true)
      const data = await packagesService.getAll(filters)
      setPackages(data.filter(p => p.isActive))
    } catch (error) {
      console.error('Failed to fetch packages', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredPackages = packages.filter(pkg =>
    pkg.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pkg.category?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const clearFilters = () => {
    setFilters({})
    setSearchQuery('')
  }

  const uniqueCategories = Array.from(new Set(packages.map(p => p.category).filter(Boolean)))

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Travel Packages</h1>
          <p className="text-xl text-blue-100">
            Find the perfect package for your next adventure
          </p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container mx-auto px-4 -mt-6 relative z-10 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search packages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:w-auto px-6 py-3 border-2 border-gray-300 rounded-lg font-medium text-gray-700 hover:border-primary hover:text-primary transition-colors flex items-center justify-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Destination Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Destination
                  </label>
                  <select
                    value={filters.destination || ''}
                    onChange={(e) => setFilters({ ...filters, destination: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Destinations</option>
                    {destinations.map(dest => (
                      <option key={dest.id} value={dest.id}>{dest.name}</option>
                    ))}
                  </select>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">All Categories</option>
                    {uniqueCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price
                  </label>
                  <input
                    type="number"
                    placeholder="₹0"
                    value={filters.minPrice || ''}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <input
                    type="number"
                    placeholder="₹100000"
                    value={filters.maxPrice || ''}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.isFeatured || false}
                    onChange={(e) => setFilters({ ...filters, isFeatured: e.target.checked || undefined })}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm text-gray-700">Featured only</span>
                </label>
                <button
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary/80 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Packages Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No packages found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPackages.map(pkg => (
              <Link
                key={pkg.id}
                to={ROUTES.PACKAGE_DETAIL(pkg.id)}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={pkg.imageUrls?.[0] || 'https://via.placeholder.com/400x300'}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {pkg.isFeatured && (
                    <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {pkg.title}
                  </h3>
                  {pkg.destination && (
                    <p className="text-gray-600 mb-2 flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-1" />
                      {pkg.destination.name}
                    </p>
                  )}
                  {pkg.category && (
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full mb-3">
                      {pkg.category}
                    </span>
                  )}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{pkg.description}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-1" />
                      {pkg.durationDays} days
                    </div>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(pkg.basePrice)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
