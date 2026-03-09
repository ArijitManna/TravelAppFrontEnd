import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Pencil, Trash2, Hotel as HotelIcon } from 'lucide-react'
import { hotelsService } from '@/services/hotelsService'
import { toast } from 'sonner'
import type { Hotel } from '@/types'

const ROUTES = {
  ADMIN_HOTELS: '/admin/hotels',
  ADMIN_HOTELS_CREATE: '/admin/hotels/create',
  ADMIN_HOTELS_EDIT: (id: number) => `/admin/hotels/edit/${id}`,
}

export default function HotelsList() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    try {
      setLoading(true)
      const data = await hotelsService.getAll()
      setHotels(data)
    } catch (error) {
      toast.error('Failed to fetch hotels')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await hotelsService.delete(id)
      toast.success('Hotel deleted successfully')
      fetchHotels()
      setDeleteId(null)
    } catch (error) {
      toast.error('Failed to delete hotel')
    }
  }

  const filteredHotels = hotels.filter(hotel =>
    hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hotel.address.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Hotels</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage all hotels and accommodations
          </p>
        </div>
        <Link
          to={ROUTES.ADMIN_HOTELS_CREATE}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Hotel
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search hotels..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      {/* Hotels Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <HotelIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hotels found</h3>
          <p className="text-gray-500 mb-4">Get started by creating a new hotel</p>
          <Link
            to={ROUTES.ADMIN_HOTELS_CREATE}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Hotel
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <div
              key={hotel.id}
              className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative h-48">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=No+Image'
                  }}
                />
                {hotel.rating && (
                  <div className="absolute top-3 right-3 px-2 py-1 bg-yellow-400 text-gray-900 rounded-full text-xs font-semibold">
                    ⭐ {hotel.rating}
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {hotel.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{hotel.address}</p>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                  {hotel.description}
                </p>
                
                <div className="flex items-center justify-between mb-4 text-xs text-gray-600">
                  <span>Check-in: {hotel.checkInTime}</span>
                  <span>Check-out: {hotel.checkOutTime}</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link
                    to={ROUTES.ADMIN_HOTELS_EDIT(hotel.id)}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Link>
                  <button
                    onClick={() => setDeleteId(hotel.id)}
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
              Delete Hotel
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this hotel? This action cannot be undone.
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
