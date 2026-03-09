import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { adminDestinationsService } from '@/services/adminDestinationsService'
import { toast } from 'sonner'
import type { CreateDestinationRequest } from '@/types'
import { ROUTES } from '@/config/constants'

export default function CreateDestination() {
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    control,
  } = useForm<CreateDestinationRequest>({
    defaultValues: {
      imageUrls: [''],
    },
  })

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'imageUrls' as any,
  })

  const imageUrl = watch('imageUrl')
  const imageUrls = watch('imageUrls')

  const onSubmit = async (data: CreateDestinationRequest) => {
    try {
      // Clean up empty image URLs
      data.imageUrls = data.imageUrls.filter(url => url?.trim() !== '')
      
      await adminDestinationsService.create(data)
      toast.success('Destination created successfully')
      navigate(ROUTES.ADMIN_DESTINATIONS)
    } catch (error) {
      toast.error('Failed to create destination')
    }
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
        <h2 className="text-2xl font-bold text-gray-900">Create New Destination</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add a new travel destination to your catalog
        </p>
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
                  placeholder="e.g., Paris"
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
                  placeholder="e.g., France"
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
                  {imageFields.map((field, index) => (
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
                  placeholder="Describe this destination..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
                )}
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
                  className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Destination'}
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
                  <div className="flex items-center justify-center h-full text-gray-400">
                    No image URL provided
                  </div>
                )}
              </div>
              <div className="p-4">
                <h4 className="font-semibold text-gray-900">
                  {watch('name') || 'Destination Name'}
                </h4>
                <p className="text-sm text-gray-500 mt-1">
                  {watch('country') || 'Country'}
                </p>
                <p className="text-sm text-gray-600 mt-3 line-clamp-3">
                  {watch('description') || 'Description will appear here...'}
                </p>
                {imageUrls && imageUrls.filter(url => url?.trim()).length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-2">
                      +{imageUrls.filter(url => url?.trim()).length} additional images
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
