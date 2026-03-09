import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Calendar, Users, Star, ArrowRight } from 'lucide-react'
import { destinationsService } from '@/services/destinationsService'
import { packagesService } from '@/services/packagesService'
import type { Destination, Package } from '@/types'
import { ROUTES } from '@/config/constants'
import { formatCurrency } from '@/lib/utils'

export default function Home() {
  const [featuredPackages, setFeaturedPackages] = useState<Package[]>([])
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [packages, destinations] = await Promise.all([
        packagesService.getAll({ isFeatured: true }),
        destinationsService.getAll(),
      ])
      setFeaturedPackages(packages.slice(0, 6))
      setPopularDestinations(destinations.filter(d => d.isActive).slice(0, 8))
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white py-24 lg:py-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600')] bg-cover bg-center opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Explore the World with TNT Travel
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Discover amazing destinations and create unforgettable memories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={ROUTES.PACKAGES}
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors text-lg"
              >
                Browse Packages
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                to={ROUTES.DESTINATIONS}
                className="inline-flex items-center justify-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-lg"
              >
                View Destinations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4 -mt-8 relative z-20 mb-16">
        <div className="bg-white rounded-lg shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
              <MapPin className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Where to?"
                className="flex-1 outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
              <Calendar className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="When?"
                className="flex-1 outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center border border-gray-300 rounded-lg px-4 py-3">
              <Users className="w-5 h-5 text-gray-400 mr-3" />
              <input
                type="text"
                placeholder="Travelers"
                className="flex-1 outline-none text-gray-700"
              />
            </div>
            <button className="bg-primary text-white font-semibold rounded-lg px-6 py-3 hover:bg-primary/90 transition-colors flex items-center justify-center">
              <Search className="w-5 h-5 mr-2" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="container mx-auto px-4 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Featured Packages</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hand-picked travel packages designed to give you the best experience
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPackages.map(pkg => (
              <Link
                key={pkg.id}
                to={ROUTES.PACKAGE_DETAIL(pkg.id)}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={pkg.imageUrls?.[0] || 'https://via.placeholder.com/400x300'}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-1 fill-current" />
                    Featured
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                    {pkg.title}
                  </h3>
                  {pkg.destination && (
                    <p className="text-gray-600 mb-3 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {pkg.destination.name}
                    </p>
                  )}
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{pkg.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{pkg.durationDays} days</span>
                    <span className="text-2xl font-bold text-primary">{formatCurrency(pkg.basePrice)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-10">
          <Link
            to={ROUTES.PACKAGES}
            className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
          >
            View All Packages
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our most sought-after travel destinations
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularDestinations.map(dest => (
              <Link
                key={dest.id}
                to={ROUTES.DESTINATION_DETAIL(dest.id)}
                className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="text-xl font-bold mb-1">{dest.name}</h3>
                    <p className="text-sm text-gray-200">{dest.country}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to={ROUTES.DESTINATIONS}
              className="inline-flex items-center px-6 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors"
            >
              View All Destinations
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Choose TNT Travel?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Best Prices</h3>
            <p className="text-gray-600">
              We guarantee the best prices on all our packages with no hidden fees
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Guides</h3>
            <p className="text-gray-600">
              Travel with experienced and knowledgeable local guides
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Amazing Destinations</h3>
            <p className="text-gray-600">
              Explore carefully curated destinations around the world
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
