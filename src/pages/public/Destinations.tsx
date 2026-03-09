import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Search } from 'lucide-react'
import { destinationsService } from '@/services/destinationsService'
import type { Destination } from '@/types'
import { ROUTES } from '@/config/constants'

export default function Destinations() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      const data = await destinationsService.getAll()
      setDestinations(data.filter(d => d.isActive))
    } catch (error) {
      console.error('Failed to fetch destinations', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Destinations</h1>
          <p className="text-xl text-blue-100">
            Discover amazing places around the world
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="container mx-auto px-4 -mt-6 relative z-10 mb-12">
        <div className="bg-white rounded-lg shadow-lg p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search destinations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
            />
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="container mx-auto px-4 pb-16">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No destinations found</h3>
            <p className="text-gray-600">Try adjusting your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map(dest => (
              <Link
                key={dest.id}
                to={ROUTES.DESTINATION_DETAIL(dest.id)}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Destination'
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{dest.name}</h3>
                    <p className="text-gray-200 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {dest.country}
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 line-clamp-3">{dest.description}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
