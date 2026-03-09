import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, ArrowLeft } from 'lucide-react'
import { destinationsService } from '@/services/destinationsService'
import { packagesService } from '@/services/packagesService'
import type { Destination, Package } from '@/types'
import { ROUTES } from '@/config/constants'
import { formatCurrency } from '@/lib/utils'

export default function DestinationDetail() {
  const { id } = useParams<{ id: string }>()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [packages, setPackages] = useState<Package[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchData()
    }
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [destData, packagesData] = await Promise.all([
        destinationsService.getById(Number(id)),
        packagesService.getAll({ destination: Number(id) }),
      ])
      setDestination(destData)
      setPackages(packagesData.filter(p => p.isActive))
    } catch (error) {
      console.error('Failed to fetch data', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!destination) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Destination not found</h2>
        <Link to={ROUTES.DESTINATIONS} className="text-primary hover:underline">
          Back to Destinations
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Image */}
      <section className="relative h-96 bg-gray-900">
        <img
          src={destination.imageUrl}
          alt={destination.name}
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-5xl font-bold mb-4">{destination.name}</h1>
            <p className="text-2xl flex items-center justify-center">
              <MapPin className="w-6 h-6 mr-2" />
              {destination.country}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-12">
        <Link
          to={ROUTES.DESTINATIONS}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Destinations
        </Link>

        {/* Description */}
        <div className="max-w-4xl mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">About {destination.name}</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{destination.description}</p>
        </div>

        {/* Available Packages */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">
            Available Packages ({packages.length})
          </h2>

          {packages.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-600">No packages available for this destination yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {packages.map(pkg => (
                <Link
                  key={pkg.id}
                  to={ROUTES.PACKAGE_DETAIL(pkg.id)}
                  className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={pkg.imageUrls?.[0] || 'https://via.placeholder.com/400x300'}
                      alt={pkg.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {pkg.title}
                    </h3>
                    {pkg.category && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full mb-3">
                        {pkg.category}
                      </span>
                    )}
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{pkg.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{pkg.durationDays} days</span>
                      <span className="text-xl font-bold text-primary">{formatCurrency(pkg.basePrice)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
