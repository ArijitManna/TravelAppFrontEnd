import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, MapPin } from 'lucide-react'
import { destinationsService } from '@/services/destinationsService'
import { adminDestinationsService } from '@/services/adminDestinationsService'
import { toast } from 'sonner'
import type { Destination } from '@/types'
import { ROUTES } from '@/config/constants'

export default function DestinationsList() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    try {
      setLoading(true)
      const data = await destinationsService.getAll()
      setDestinations(data)
    } catch (error) {
      toast.error('Failed to fetch destinations')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await adminDestinationsService.delete(id)
      toast.success('Destination deleted successfully')
      fetchDestinations()
      setDeleteId(null)
    } catch (error) {
      toast.error('Failed to delete destination')
    }
  }

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.country.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Destinations</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage all travel destinations
          </p>
        </div>
        <Link
          to={ROUTES.ADMIN_DESTINATIONS_CREATE}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Destination
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredDestinations.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No destinations found</h3>
          <p className="text-gray-500 mb-4">Get started by creating a new destination</p>
          <Link
            to={ROUTES.ADMIN_DESTINATIONS_CREATE}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Destination
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDestinations.map((destination) => (
            <div
              key={destination.id}
              className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={destination.imageUrl}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'
                  }}
                />
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  destination.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {destination.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {destination.name}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{destination.country}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {destination.description}
                </p>
                
                <div className="flex items-center space-x-2">
                  <Link
                    to={ROUTES.ADMIN_DESTINATIONS_EDIT(destination.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(destination.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Destination
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this destination? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
