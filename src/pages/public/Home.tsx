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
        packagesService.getAll({ isFeatured: true }), // Only featured packages
        destinationsService.getAll(),
      ])
      setFeaturedPackages(packages) // Show all packages
      setPopularDestinations(destinations.filter(d => d.isActive).slice(0, 8))
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setLoading(false)
    }
  }

  // Auto-scroll carousel effect
  useEffect(() => {
    if (featuredPackages.length === 0) return

    const carousel = document.getElementById('packages-carousel')
    if (!carousel) return

    let scrollPosition = 0
    const scrollSpeed = 1 // pixels per frame
    const maxScroll = carousel.scrollWidth - carousel.clientWidth

    const autoScroll = () => {
      scrollPosition += scrollSpeed
      
      // Reset to start when reaching the end
      if (scrollPosition >= maxScroll) {
        scrollPosition = 0
      }
      
      carousel.scrollLeft = scrollPosition
    }

    const intervalId = setInterval(autoScroll, 30) // Smooth 33fps

    // Pause on hover
    const handleMouseEnter = () => clearInterval(intervalId)
    const handleMouseLeave = () => {
      const newIntervalId = setInterval(autoScroll, 30)
      return newIntervalId
    }

    carousel.addEventListener('mouseenter', handleMouseEnter)

    return () => {
      clearInterval(intervalId)
      carousel.removeEventListener('mouseenter', handleMouseEnter)
    }
  }, [featuredPackages])

  return (
    <div className="bg-gradient-to-b from-white via-blue-50/30 to-purple-50/20">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
          {/* Animated Blobs */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-md rounded-full border border-white/30">
              <span className="text-sm font-medium">✨ Your Journey Begins Here</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Explore the World with
              <span className="block mt-2 bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 bg-clip-text text-transparent">
                TNT Travel
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-blue-100 max-w-2xl mx-auto leading-relaxed">
              Discover breathtaking destinations and create unforgettable memories with our expertly curated travel packages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={ROUTES.PACKAGES}
                className="group inline-flex items-center justify-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 text-lg shadow-2xl hover:shadow-white/20 hover:scale-105"
              >
                Browse Packages
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to={ROUTES.DESTINATIONS}
                className="group inline-flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 text-white font-bold rounded-2xl hover:bg-white/20 transition-all duration-300 text-lg"
              >
                View Destinations
                <MapPin className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Search Bar */}
      <section className="container mx-auto px-4 -mt-12 relative z-20 mb-20">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 hover:border-blue-400 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <MapPin className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Where to?"
                className="flex-1 outline-none text-gray-700 bg-transparent placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 hover:border-blue-400 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <Calendar className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="When?"
                className="flex-1 outline-none text-gray-700 bg-transparent placeholder:text-gray-400"
              />
            </div>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 hover:border-blue-400 transition-colors focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200">
              <Users className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
              <input
                type="text"
                placeholder="Travelers"
                className="flex-1 outline-none text-gray-700 bg-transparent placeholder:text-gray-400"
              />
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl px-6 py-4 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 group">
              <Search className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="container mx-auto px-4 mb-24">
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 font-semibold rounded-full text-sm">
              ⭐ Featured Packages
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
            Hand-Picked Travel Experiences
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Curated travel packages designed to give you the best experience
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading amazing packages...</p>
          </div>
        ) : (
          <div 
            id="packages-carousel"
            className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6"
            style={{ scrollBehavior: 'smooth' }}
          >
            {featuredPackages.map((pkg, index) => (
              <Link
                key={pkg.id}
                to={ROUTES.PACKAGE_DETAIL(pkg.id)}
                className="group relative bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 flex-shrink-0 w-96 snap-start"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Image */}
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={pkg.imageUrls?.[0] || 'https://via.placeholder.com/400x300'}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  {/* Featured Badge */}
                  <div className="absolute top-4 left-4 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 rounded-full text-sm font-bold flex items-center shadow-lg">
                    <Star className="w-4 h-4 mr-1.5 fill-current" />
                    Featured
                  </div>

                  {/* Price Badge */}
                  <div className="absolute bottom-4 right-4 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg">
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatCurrency(pkg.basePrice)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {pkg.title}
                  </h3>
                  
                  {pkg.destination && (
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm font-medium">{pkg.destination.name}</span>
                    </div>
                  )}
                  
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4 leading-relaxed">
                    {pkg.description}
                  </p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-1.5" />
                      <span className="font-medium">{pkg.durationDays} days</span>
                    </div>
                    <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                      <span className="text-sm">View Details</span>
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10"></div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to={ROUTES.PACKAGES}
            className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            View All Packages
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50/30 to-pink-50/20"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-semibold rounded-full text-sm">
                🌍 Popular Destinations
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent mb-4">
              Explore Amazing Places
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most sought-after travel destinations around the world
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {popularDestinations.map((dest, index) => (
              <Link
                key={dest.id}
                to={ROUTES.DESTINATION_DETAIL(dest.id)}
                className="group relative h-80 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6">
                  <div className="transform transition-all duration-300 group-hover:-translate-y-2">
                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                      {dest.name}
                    </h3>
                    <div className="flex items-center text-white/90 mb-3">
                      <MapPin className="w-4 h-4 mr-1.5" />
                      <span className="text-sm font-medium">{dest.country}</span>
                    </div>
                    
                    {/* Explore Button - Shows on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                      <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold border border-white/30">
                        Explore
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Decorative Corner */}
                <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white/30 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to={ROUTES.DESTINATIONS}
              className="group inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-2xl hover:bg-gray-50 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-200"
            >
              View All Destinations
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
