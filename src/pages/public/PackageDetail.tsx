import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  Users, 
  Star, 
  Clock,
  CheckCircle2
} from 'lucide-react'
import { packagesService } from '@/services/packagesService'
import type { Package } from '@/types'
import { ROUTES } from '@/config/constants'
import { formatCurrency } from '@/lib/utils'

export default function PackageDetail() {
  const { id } = useParams<{ id: string }>()
  const [pkg, setPkg] = useState<Package | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (id) {
      fetchPackage()
    }
  }, [id])

  const fetchPackage = async () => {
    try {
      setLoading(true)
      const data = await packagesService.getById(Number(id))
      setPkg(data)
    } catch (error) {
      console.error('Failed to fetch package', error)
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

  if (!pkg) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Package not found</h2>
        <Link to={ROUTES.PACKAGES} className="text-primary hover:underline">
          Back to Packages
        </Link>
      </div>
    )
  }

  const images = pkg.imageUrls && pkg.imageUrls.length > 0 
    ? pkg.imageUrls 
    : ['https://via.placeholder.com/800x600?text=Package+Image']

  return (
    <div>
      {/* Image Gallery */}
      <section className="bg-gray-900">
        <div className="container mx-auto px-4 py-3">
          {/* Main Image */}
          <div className="relative h-56 md:h-72 rounded-lg overflow-hidden mb-2">
            <img
              src={images[selectedImage]}
              alt={pkg.title}
              className="w-full h-full object-cover"
            />
            {pkg.isFeatured && (
              <div className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full font-semibold flex items-center text-xs">
                <Star className="w-3 h-3 mr-1 fill-current" />
                Featured
              </div>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-5 md:grid-cols-8 gap-1.5">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative h-12 rounded overflow-hidden ${
                    selectedImage === index ? 'ring-4 ring-primary' : 'opacity-70 hover:opacity-100'
                  } transition-all`}
                >
                  <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 py-4">
        <Link
          to={ROUTES.PACKAGES}
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-3 text-sm"
        >
          <ArrowLeft className="w-3 h-3 mr-1" />
          Back to Packages
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Title & Info */}
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{pkg.title}</h1>
                  {pkg.destination && (
                    <p className="text-base text-gray-600 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {pkg.destination.name}, {pkg.destination.country}
                    </p>
                  )}
                </div>
              </div>

              {pkg.category && (
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {pkg.category}
                </span>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <Calendar className="w-6 h-6 text-primary mr-2" />
                <div>
                  <p className="text-xs text-gray-600">Duration</p>
                  <p className="text-sm font-semibold text-gray-900">{pkg.durationDays} Days</p>
                </div>
              </div>
              {pkg.maxPeople && (
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-primary mr-2" />
                  <div>
                    <p className="text-xs text-gray-600">Max People</p>
                    <p className="text-sm font-semibold text-gray-900">{pkg.maxPeople}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center">
                <Clock className="w-6 h-6 text-primary mr-2" />
                <div>
                  <p className="text-xs text-gray-600">Availability</p>
                  <p className="text-sm font-semibold text-green-600">Available</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">About This Package</h2>
              <p className="text-gray-700 leading-relaxed text-sm">{pkg.description}</p>
            </div>

            {/* Itinerary */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">Itinerary</h2>
              <div className="space-y-3">
                {pkg.itinerary && pkg.itinerary.length > 0 ? (
                  pkg.itinerary.map((day, index) => (
                    <div
                      key={day.id || index}
                      className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0"
                    >
                      <div className="absolute left-0 top-0 -translate-x-1/2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {day.dayNumber}
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-base font-bold text-gray-900 mb-2">{day.title}</h3>
                        <p className="text-gray-700 leading-relaxed text-sm mb-3">{day.description}</p>
                        
                        {/* Day Images */}
                        {day.imageUrls && day.imageUrls.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-3">
                            {day.imageUrls.map((imageUrl, imgIndex) => (
                              <div key={imgIndex} className="relative h-24 rounded-lg overflow-hidden group">
                                <img
                                  src={imageUrl}
                                  alt={`${day.title} - Image ${imgIndex + 1}`}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Meal Information */}
                        {(day.isBreakfastIncluded || day.isLunchIncluded || day.isDinnerIncluded) && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {day.isBreakfastIncluded && (
                              <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                                🍳 Breakfast
                              </span>
                            )}
                            {day.isLunchIncluded && (
                              <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                                🍽️ Lunch
                              </span>
                            )}
                            {day.isDinnerIncluded && (
                              <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                                🍷 Dinner
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No itinerary details available.</p>
                )}
              </div>
            </div>

            {/* What's Included (placeholder) */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-3">What's Included</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Accommodation</p>
                    <p className="text-xs text-gray-600">Hotel stays as per itinerary</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Meals</p>
                    <p className="text-xs text-gray-600">Breakfast and select meals</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Transportation</p>
                    <p className="text-xs text-gray-600">All transfers and sightseeing</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">Guide Services</p>
                    <p className="text-xs text-gray-600">Professional tour guide</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="mb-4">
                <p className="text-gray-600 text-xs mb-1">Starting from</p>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-primary">{formatCurrency(pkg.basePrice)}</span>
                  <span className="text-gray-600 text-sm ml-1">/ person</span>
                </div>
              </div>

              <button className="w-full bg-primary text-white font-semibold py-3 rounded-lg hover:bg-primary/90 transition-colors mb-3">
                Book Now
              </button>

              <button className="w-full border-2 border-primary text-primary font-semibold py-3 rounded-lg hover:bg-primary/5 transition-colors text-sm">
                Contact Us
              </button>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">Need help?</h3>
                <p className="text-xs text-gray-600 mb-1">
                  Call us at: <a href="tel:+1234567890" className="text-primary font-medium">+1 234 567 890</a>
                </p>
                <p className="text-xs text-gray-600">
                  Email: <a href="mailto:info@tnttravel.com" className="text-primary font-medium">info@tnttravel.com</a>
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  Free cancellation up to 48 hours
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  Instant confirmation
                </div>
                <div className="flex items-center text-xs text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" />
                  24/7 customer support
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
