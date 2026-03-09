import { useState, useEffect } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2, GripVertical } from 'lucide-react'
import { adminPackagesService } from '@/services/adminPackagesService'
import { destinationsService } from '@/services/destinationsService'
import { hotelsService } from '@/services/hotelsService'
import { activitiesService } from '@/services/activitiesService'
import { toast } from 'sonner'
import type { CreatePackageRequest, Destination, Hotel, Activity } from '@/types'
import { ROUTES } from '@/config/constants'

export default function CreatePackage() {
  const navigate = useNavigate()
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [activities, setActivities] = useState<Activity[]>([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<CreatePackageRequest>({
    defaultValues: {
      isFeatured: false,
      imageUrls: [''],
      itinerary: [{ 
        dayNumber: 1, 
        title: '', 
        description: '', 
        imageUrls: [''],
        isBreakfastIncluded: false,
        isLunchIncluded: false,
        isDinnerIncluded: false,
        isLeisureDay: false,
        hotels: [],
        activities: [],
        transfers: []
      }],
      inclusions: [{ inclusionType: '', isIncluded: true }],
      highlights: [{ highlight: '', displayOrder: 1 }],
    },
  })

  const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
    control,
    name: 'imageUrls' as any,
  })

  const { fields: itineraryFields, append: appendDay, remove: removeDay } = useFieldArray({
    control,
    name: 'itinerary',
  })

  const { fields: inclusionFields, append: appendInclusion, remove: removeInclusion } = useFieldArray({
    control,
    name: 'inclusions',
  })

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray({
    control,
    name: 'highlights',
  })

  useEffect(() => {
    fetchDestinations()
    fetchHotels()
    fetchActivities()
  }, [])

  const fetchDestinations = async () => {
    try {
      const data = await destinationsService.getAll()
      setDestinations(data.filter(d => d.isActive))
    } catch (error) {
      toast.error('Failed to fetch destinations')
    }
  }

  const fetchHotels = async () => {
    try {
      const data = await hotelsService.getAll()
      setHotels(data)
    } catch (error) {
      toast.error('Failed to fetch hotels')
    }
  }

  const fetchActivities = async () => {
    try {
      const data = await activitiesService.getAll()
      setActivities(data)
    } catch (error) {
      toast.error('Failed to fetch activities')
    }
  }

  const onSubmit = async (data: CreatePackageRequest) => {
    try {
      // Clean up empty image URLs
      data.imageUrls = data.imageUrls.filter(url => url.trim() !== '')
      
      // Ensure day numbers are sequential and clean up day image URLs
      data.itinerary = data.itinerary.map((day, index) => ({
        ...day,
        dayNumber: index + 1,
        imageUrls: day.imageUrls?.filter(url => url?.trim() !== ''),
      }))

      // Clean up empty inclusions and highlights
      data.inclusions = data.inclusions?.filter(inc => inc.inclusionType?.trim() !== '')
      data.highlights = data.highlights?.filter(hl => hl.highlight?.trim() !== '')

      await adminPackagesService.create(data)
      toast.success('Package created successfully')
      navigate(ROUTES.ADMIN_PACKAGES)
    } catch (error) {
      toast.error('Failed to create package')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(ROUTES.ADMIN_PACKAGES)}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Packages
        </button>
        <h2 className="text-2xl font-bold text-gray-900">Create New Package</h2>
        <p className="mt-1 text-sm text-gray-500">
          Add a new travel package to your catalog
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Basic Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Title */}
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Package Title *
              </label>
              <input
                type="text"
                id="title"
                {...register('title', { required: 'Title is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Amazing Bali Experience"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            {/* Destination */}
            <div>
              <label htmlFor="destinationId" className="block text-sm font-medium text-gray-700 mb-2">
                Destination *
              </label>
              <select
                id="destinationId"
                {...register('destinationId', { 
                  required: 'Destination is required',
                  valueAsNumber: true,
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select a destination</option>
                {destinations.map(dest => (
                  <option key={dest.id} value={dest.id}>
                    {dest.name}, {dest.country}
                  </option>
                ))}
              </select>
              {errors.destinationId && (
                <p className="mt-1 text-sm text-red-600">{errors.destinationId.message}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <input
                type="text"
                id="category"
                {...register('category', { required: 'Category is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="e.g., Adventure, Luxury, Beach"
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            {/* Duration Days */}
            <div>
              <label htmlFor="durationDays" className="block text-sm font-medium text-gray-700 mb-2">
                Duration (Days) *
              </label>
              <input
                type="number"
                id="durationDays"
                {...register('durationDays', { 
                  required: 'Duration is required',
                  valueAsNumber: true,
                  min: { value: 1, message: 'Duration must be at least 1 day' },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="7"
              />
              {errors.durationDays && (
                <p className="mt-1 text-sm text-red-600">{errors.durationDays.message}</p>
              )}
            </div>

            {/* Start Date */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date (Optional)
              </label>
              <input
                type="date"
                id="startDate"
                {...register('startDate')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* End Date */}
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                End Date (Optional)
              </label>
              <input
                type="date"
                id="endDate"
                {...register('endDate')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            {/* Original Price */}
            <div>
              <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (INR)
              </label>
              <input
                type="number"
                step="0.01"
                id="originalPrice"
                {...register('originalPrice', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Price must be positive' },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="2999.99"
              />
              <p className="mt-1 text-xs text-gray-500">List price before discount</p>
            </div>

            {/* Discount Amount */}
            <div>
              <label htmlFor="discountAmount" className="block text-sm font-medium text-gray-700 mb-2">
                Discount Amount (INR)
              </label>
              <input
                type="number"
                step="0.01"
                id="discountAmount"
                {...register('discountAmount', { 
                  valueAsNumber: true,
                  min: { value: 0, message: 'Discount must be positive' },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="1000.00"
              />
              <p className="mt-1 text-xs text-gray-500">Amount to subtract from original price</p>
            </div>

            {/* Base Price */}
            <div>
              <label htmlFor="basePrice" className="block text-sm font-medium text-gray-700 mb-2">
                Base Price (INR) *
              </label>
              <input
                type="number"
                step="0.01"
                id="basePrice"
                {...register('basePrice', { 
                  required: 'Price is required',
                  valueAsNumber: true,
                  min: { value: 0, message: 'Price must be positive' },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="1999.99"
              />
              {errors.basePrice && (
                <p className="mt-1 text-sm text-red-600">{errors.basePrice.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Final price after discount</p>
            </div>

            {/* Max People */}
            <div>
              <label htmlFor="maxPeople" className="block text-sm font-medium text-gray-700 mb-2">
                Max People (Optional)
              </label>
              <input
                type="number"
                id="maxPeople"
                {...register('maxPeople', { valueAsNumber: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="10"
              />
            </div>

            {/* Theme Tags */}
            <div className="md:col-span-2">
              <label htmlFor="themeTags" className="block text-sm font-medium text-gray-700 mb-2">
                Theme Tags (Optional)
              </label>
              <input
                type="text"
                id="themeTags"
                {...register('themeTags')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="adventure, family-friendly, cultural"
              />
              <p className="mt-1 text-xs text-gray-500">Comma-separated tags for categorization</p>
            </div>

            {/* Featured */}
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  {...register('isFeatured')}
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  Featured Package (will be highlighted on homepage)
                </span>
              </label>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                rows={6}
                {...register('description', { required: 'Description is required' })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Describe what makes this package special..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Inclusions */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Package Inclusions</h3>
            <button
              type="button"
              onClick={() => appendInclusion({ inclusionType: '', isIncluded: true })}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Inclusion
            </button>
          </div>
          
          <div className="space-y-4">
            {inclusionFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Inclusion {index + 1}</span>
                  {inclusionFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInclusion(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Inclusion Type *
                    </label>
                    <input
                      type="text"
                      {...register(`inclusions.${index}.inclusionType` as const, {
                        required: 'Inclusion type is required',
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Accommodation, Meals, Transport"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Icon Name (Optional)
                    </label>
                    <input
                      type="text"
                      {...register(`inclusions.${index}.iconName` as const)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., hotel, utensils, bus"
                    />
                  </div>
                  
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register(`inclusions.${index}.isIncluded` as const)}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        Included in package
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Package Highlights</h3>
            <button
              type="button"
              onClick={() => appendHighlight({ highlight: '', displayOrder: highlightFields.length + 1 })}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Highlight
            </button>
          </div>
          
          <div className="space-y-4">
            {highlightFields.map((field, index) => (
              <div key={field.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Highlight {index + 1}</span>
                  {highlightFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Highlight *
                    </label>
                    <textarea
                      rows={2}
                      {...register(`highlights.${index}.highlight` as const, {
                        required: 'Highlight is required',
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Visit the ancient temples and UNESCO World Heritage Sites"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Display Order *
                    </label>
                    <input
                      type="number"
                      {...register(`highlights.${index}.displayOrder` as const, {
                        required: 'Display order is required',
                        valueAsNumber: true,
                        min: 1
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="1"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Image URLs */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Package Images</h3>
            <button
              type="button"
              onClick={() => appendImage('' as any)}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Image URL
            </button>
          </div>

          <div className="space-y-4">
            {imageFields.map((field, index) => (
              <div key={field.id} className="flex items-center space-x-3">
                <input
                  type="url"
                  {...register(`imageUrls.${index}` as const)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                />
                {imageFields.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Itinerary */}
        <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Itinerary</h3>
            <button
              type="button"
              onClick={() => appendDay({ 
                dayNumber: itineraryFields.length + 1, 
                title: '', 
                description: '',
                imageUrls: [''],
                isBreakfastIncluded: false,
                isLunchIncluded: false,
                isDinnerIncluded: false,
                isLeisureDay: false,
                hotels: [],
                activities: [],
                transfers: []
              })}
              className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Day
            </button>
          </div>

          <div className="space-y-6">
            {itineraryFields.map((field, index) => (
              <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                    <h4 className="text-base font-semibold text-gray-900">
                      Day {index + 1}
                    </h4>
                  </div>
                  {itineraryFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDay(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Day Title *
                    </label>
                    <input
                      type="text"
                      {...register(`itinerary.${index}.title` as const, {
                        required: 'Title is required',
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="e.g., Arrival and City Tour"
                    />
                    {errors.itinerary?.[index]?.title && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.itinerary[index]?.title?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      rows={3}
                      {...register(`itinerary.${index}.description` as const, {
                        required: 'Description is required',
                      })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="Describe the activities for this day..."
                    />
                    {errors.itinerary?.[index]?.description && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.itinerary[index]?.description?.message}
                      </p>
                    )}
                  </div>

                  {/* Day Images */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Day Images (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const currentImages = watch(`itinerary.${index}.imageUrls`) || ['']
                          setValue(`itinerary.${index}.imageUrls`, [...currentImages, ''])
                        }}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Image
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(watch(`itinerary.${index}.imageUrls`) || ['']).map((_, imgIndex) => (
                        <div key={imgIndex} className="flex items-center space-x-2">
                          <input
                            type="url"
                            {...register(`itinerary.${index}.imageUrls.${imgIndex}` as const)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="https://example.com/day-image.jpg"
                          />
                          {(watch(`itinerary.${index}.imageUrls`) || ['']).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const currentImages = watch(`itinerary.${index}.imageUrls`) || ['']
                                setValue(`itinerary.${index}.imageUrls`, currentImages.filter((_, i) => i !== imgIndex))
                              }}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Add images for this day's activities</p>
                  </div>

                  {/* Meal Inclusions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Meals Included
                    </label>
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register(`itinerary.${index}.isBreakfastIncluded` as const)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">Breakfast</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register(`itinerary.${index}.isLunchIncluded` as const)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">Lunch</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register(`itinerary.${index}.isDinnerIncluded` as const)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">Dinner</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          {...register(`itinerary.${index}.isLeisureDay` as const)}
                          className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        />
                        <span className="ml-2 text-sm text-gray-700">Leisure Day (Free Time)</span>
                      </label>
                    </div>
                  </div>

                  {/* Hotels */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Hotels (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const currentHotels = watch(`itinerary.${index}.hotels`) || []
                          setValue(`itinerary.${index}.hotels`, [...currentHotels, { hotelId: 0, displayOrder: currentHotels.length + 1, isRecommended: false }])
                        }}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Hotel
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(watch(`itinerary.${index}.hotels`) || []).map((_, hotelIndex) => (
                        <div key={hotelIndex} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">Hotel {hotelIndex + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const currentHotels = watch(`itinerary.${index}.hotels`) || []
                                setValue(`itinerary.${index}.hotels`, currentHotels.filter((_, i) => i !== hotelIndex))
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <select
                              {...register(`itinerary.${index}.hotels.${hotelIndex}.hotelId` as const, { valueAsNumber: true })}
                              className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                              <option value={0}>Select Hotel</option>
                              {hotels.map(hotel => (
                                <option key={hotel.id} value={hotel.id}>{hotel.name}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              {...register(`itinerary.${index}.hotels.${hotelIndex}.displayOrder` as const, { valueAsNumber: true })}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Display Order"
                            />
                            <label className="flex items-center px-3 py-2 border border-gray-200 rounded-lg">
                              <input
                                type="checkbox"
                                {...register(`itinerary.${index}.hotels.${hotelIndex}.isRecommended` as const)}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                              <span className="ml-2 text-xs text-gray-700">Recommended</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Activities (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const currentActivities = watch(`itinerary.${index}.activities`) || []
                          setValue(`itinerary.${index}.activities`, [...currentActivities, { activityId: 0, isRecommended: false, isIncluded: true, displayOrder: currentActivities.length + 1 }])
                        }}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Activity
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(watch(`itinerary.${index}.activities`) || []).map((_, activityIndex) => (
                        <div key={activityIndex} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">Activity {activityIndex + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const currentActivities = watch(`itinerary.${index}.activities`) || []
                                setValue(`itinerary.${index}.activities`, currentActivities.filter((_, i) => i !== activityIndex))
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="space-y-2">
                            <select
                              {...register(`itinerary.${index}.activities.${activityIndex}.activityId` as const, { valueAsNumber: true })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                              <option value={0}>Select Activity</option>
                              {activities.map(activity => (
                                <option key={activity.id} value={activity.id}>{activity.name}</option>
                              ))}
                            </select>
                            <div className="grid grid-cols-3 gap-2">
                              <input
                                type="number"
                                {...register(`itinerary.${index}.activities.${activityIndex}.displayOrder` as const, { valueAsNumber: true })}
                                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Order"
                              />
                              <label className="flex items-center px-2 py-2 border border-gray-200 rounded-lg">
                                <input
                                  type="checkbox"
                                  {...register(`itinerary.${index}.activities.${activityIndex}.isRecommended` as const)}
                                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="ml-1 text-xs text-gray-700">Rec.</span>
                              </label>
                              <label className="flex items-center px-2 py-2 border border-gray-200 rounded-lg">
                                <input
                                  type="checkbox"
                                  {...register(`itinerary.${index}.activities.${activityIndex}.isIncluded` as const)}
                                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                                />
                                <span className="ml-1 text-xs text-gray-700">Incl.</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Transfers */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Transfers (Optional)
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          const currentTransfers = watch(`itinerary.${index}.transfers`) || []
                          setValue(`itinerary.${index}.transfers`, [...currentTransfers, { vehicleType: '', pickupLocation: '', dropLocation: '', pickupTime: '', isPrivate: false }])
                        }}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium text-primary hover:text-primary/80"
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add Transfer
                      </button>
                    </div>
                    <div className="space-y-3">
                      {(watch(`itinerary.${index}.transfers`) || []).map((_, transferIndex) => (
                        <div key={transferIndex} className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600">Transfer {transferIndex + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const currentTransfers = watch(`itinerary.${index}.transfers`) || []
                                setValue(`itinerary.${index}.transfers`, currentTransfers.filter((_, i) => i !== transferIndex))
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              {...register(`itinerary.${index}.transfers.${transferIndex}.vehicleType` as const)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Vehicle Type (e.g., Bus, Car)"
                            />
                            <input
                              type="time"
                              {...register(`itinerary.${index}.transfers.${transferIndex}.pickupTime` as const)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                            <input
                              type="text"
                              {...register(`itinerary.${index}.transfers.${transferIndex}.pickupLocation` as const)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Pickup Location"
                            />
                            <input
                              type="text"
                              {...register(`itinerary.${index}.transfers.${transferIndex}.dropLocation` as const)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="Drop Location"
                            />
                            <label className="col-span-2 flex items-center px-3 py-2 border border-gray-200 rounded-lg bg-white">
                              <input
                                type="checkbox"
                                {...register(`itinerary.${index}.transfers.${transferIndex}.isPrivate` as const)}
                                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                              />
                              <span className="ml-2 text-sm text-gray-700">Private Transfer</span>
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(ROUTES.ADMIN_PACKAGES)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating...' : 'Create Package'}
          </button>
        </div>
      </form>
    </div>
  )
}
