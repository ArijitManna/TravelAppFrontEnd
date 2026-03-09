import { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { hotelsService } from '@/services/hotelsService'
import { toast } from 'sonner'
import type { UpdateHotelRequest } from '@/types'

const ROUTES = {
  ADMIN_HOTELS: '/admin/hotels',
}

export default function EditHotel() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    control,
  } = useForm<UpdateHotelRequest>({
    defaultValues: {
      images: [{
        imageUrl: '',
        caption: '',
      }],
      checkInTime: '14:00',
      checkOutTime: '11:00',
    },
  })

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'images',
  })

  const imageUrl = watch('imageUrl')
  const images = watch('images')

  useEffect(() => {
    if (id) {
      fetchHotel()
    }
  }, [id])

  const fetchHotel = async () => {
    try {
      setLoading(true)
      const data = await hotelsService.getById(Number(id))
      // Ensure images is an array, default to empty array with one empty entry
      if (!data.images || data.images.length === 0) {
        data.images = [{ imageUrl: '', caption: '' }]
      }
      reset(data)
    } catch (error) {
      toast.error('Failed to fetch hotel')
      navigate(ROUTES.ADMIN_HOTELS)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: UpdateHotelRequest) => {
    try {
      // Clean up empty images
      data.images = data.images.filter(img => img.imageUrl?.trim() !== '')
      
      await hotelsService.update(Number(id), data)
      toast.success('Hotel updated successfully')
      navigate(ROUTES.ADMIN_HOTELS)
    } catch (error) {
      toast.error('Failed to update hotel')
    }
  }

  const handleDelete = async () => {
    try {
      await hotelsService.delete(Number(id))
      toast.success('Hotel deleted successfully')
      navigate(ROUTES.ADMIN_HOTELS)
    } catch (error) {
      toast.error('Failed to delete hotel')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(ROUTES.ADMIN_HOTELS)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Hotels
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Hotel</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update hotel information
            </p>
          </div>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Delete Hotel
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow border border-gray-200 p-6">
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Hotel Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., Grand Palace Hotel"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={4}
                  {...register('description', { required: 'Description is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Describe the hotel..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Primary Image URL */}
              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                  Primary Image URL *
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  {...register('imageUrl', { 
                    required: 'Primary image URL is required',
                    pattern: {
                      value: /^https?:\/\/.+/i,
                      message: 'Please enter a valid URL'
                    }
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {errors.imageUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">This will be the main image displayed</p>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  id="address"
                  {...register('address', { required: 'Address is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="e.g., 123 Main Street, Paris, France"
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                )}
              </div>

              {/* Rating, Check-in and Check-out */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-2">
                    Rating
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    id="rating"
                    {...register('rating', { 
                      valueAsNumber: true,
                      min: { value: 0, message: 'Min 0' },
                      max: { value: 5, message: 'Max 5' }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="4.5"
                  />
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkInTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-in *
                  </label>
                  <input
                    type="time"
                    id="checkInTime"
                    {...register('checkInTime', { required: 'Check-in time is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {errors.checkInTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.checkInTime.message}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="checkOutTime" className="block text-sm font-medium text-gray-700 mb-2">
                    Check-out *
                  </label>
                  <input
                    type="time"
                    id="checkOutTime"
                    {...register('checkOutTime', { required: 'Check-out time is required' })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  {errors.checkOutTime && (
                    <p className="mt-1 text-sm text-red-600">{errors.checkOutTime.message}</p>
                  )}
                </div>
              </div>

              {/* Additional Images */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Images
                  </label>
                  <button
                    type="button"
                    onClick={() => appendImage({ imageUrl: '', caption: '' })}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary hover:text-primary/80"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Image
                  </button>
                </div>
                <div className="space-y-3">
                  {imageFields.map((field, index) => (
                    <div key={field.id} className="p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Image {index + 1}</span>
                        {imageFields.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="url"
                          {...register(`images.${index}.imageUrl` as const)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="https://example.com/image.jpg"
                        />
                        <input
                          type="text"
                          {...register(`images.${index}.caption` as const)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Image caption (optional)"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.ADMIN_HOTELS)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Updating...' : 'Update Hotel'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-4 sticky top-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="aspect-video rounded-lg bg-gray-100 mb-3 overflow-hidden">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+URL'
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                  No image
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              This is how your hotel card will appear
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
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
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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
