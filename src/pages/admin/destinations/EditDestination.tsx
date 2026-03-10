import { useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { destinationsService } from '@/services/destinationsService'
import { adminDestinationsService } from '@/services/adminDestinationsService'
import { toast } from 'sonner'
import type { UpdateDestinationRequest } from '@/types'
import { ROUTES } from '@/config/constants'
import { useState } from 'react'

export default function EditDestination() {
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
  } = useForm<UpdateDestinationRequest>({
    defaultValues: {
      imageUrls: [''],
    },
  })

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    // @ts-expect-error - react-hook-form does not support arrays of primitives properly
    name: 'imageUrls',
  }) as any

  const imageUrl = watch('imageUrl')

  useEffect(() => {
    if (id) {
      fetchDestination()
    }
  }, [id])

  const fetchDestination = async () => {
    try {
      setLoading(true)
      const data = await destinationsService.getById(Number(id))
      // Ensure imageUrls is an array, default to empty array with one empty string
      if (!data.imageUrls || data.imageUrls.length === 0) {
        data.imageUrls = ['']
      }
      reset(data)
    } catch (error) {
      toast.error('Failed to fetch destination')
      navigate(ROUTES.ADMIN_DESTINATIONS)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: UpdateDestinationRequest) => {
    try {
      // Clean up empty image URLs
      data.imageUrls = data.imageUrls.filter(url => url?.trim() !== '')
      
      await adminDestinationsService.update(Number(id), data)
      toast.success('Destination updated successfully')
      navigate(ROUTES.ADMIN_DESTINATIONS)
    } catch (error) {
      toast.error('Failed to update destination')
    }
  }

  const handleDelete = async () => {
    try {
      await adminDestinationsService.delete(Number(id))
      toast.success('Destination deleted successfully')
      navigate(ROUTES.ADMIN_DESTINATIONS)
    } catch (error) {
      toast.error('Failed to delete destination')
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
          onClick={() => navigate(ROUTES.ADMIN_DESTINATIONS)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Destinations
        </button>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Edit Destination</h2>
            <p className="mt-1 text-sm text-gray-500">
              Update destination information
            </p>
          </div>
          <button
            onClick={() => setDeleteConfirm(true)}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors"
          >
            Delete Destination
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
                  Destination Name *
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                  Country *
                </label>
                <input
                  type="text"
                  id="country"
                  {...register('country', { required: 'Country is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.country && (
                  <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
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
                  {...register('imageUrl', { required: 'Primary image URL is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.imageUrl && (
                  <p className="mt-1 text-sm text-red-600">{errors.imageUrl.message}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">This will be the main image displayed</p>
              </div>

              {/* Additional Image URLs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Additional Images
                  </label>
                  <button
                    type="button"
                    onClick={() => appendImage('' as any)}
                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary hover:text-primary/80"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Image
                  </button>
                </div>
                <div className="space-y-2">
                  {imageFields.map((field: any, index: number) => (
                    <div key={field.id} className="flex items-center space-x-2">
                      <input
                        type="url"
                        {...register(`imageUrls.${index}` as const)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://example.com/additional-image.jpg"
                      />
                      {imageFields.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">Optional additional images for gallery</p>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  id="description"
                  rows={6}
                  {...register('description', { required: 'Description is required' })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
              </div>

              {/* Is Active */}
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('isActive')}
                    className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Active (visible to users)
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.ADMIN_DESTINATIONS)}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Updating...' : 'Update Destination'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow border border-gray-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <div className="relative h-48 bg-gray-100">
                {imageUrl && (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+URL'
                    }}
                  />
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900">{watch('name')}</h4>
                <p className="text-sm text-gray-500 mt-1">{watch('country')}</p>
                <p className="text-sm text-gray-600 mt-3 line-clamp-3">{watch('description')}</p>
                <div className={`inline-block mt-3 px-2 py-1 rounded-full text-xs font-medium ${
                  watch('isActive') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {watch('isActive') ? 'Active' : 'Inactive'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Destination
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this destination? This action cannot be undone and will affect all associated packages.
            </p>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700"
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
