// Destination Types
export interface Destination {
  id: number
  name: string
  country: string
  description: string
  imageUrl: string
  imageUrls: string[]
  isActive: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CreateDestinationRequest {
  name: string
  country: string
  description: string
  imageUrl: string
  imageUrls: string[]
}

export interface UpdateDestinationRequest extends CreateDestinationRequest {
  isActive: boolean
}

// Activity Types
export interface ActivityImage {
  id: number
  imageUrl: string
}

export interface Activity {
  id: number
  name: string
  description: string
  imageUrl: string
  price?: number
  duration?: string
  location?: string
  images?: ActivityImage[]
  imageUrls?: string[]
  isActive?: boolean
}

export interface CreateActivityRequest {
  name: string
  description: string
  imageUrl: string
  price?: number
  duration?: string
  location?: string
  imageUrls?: string[]
}

export interface UpdateActivityRequest extends CreateActivityRequest {
  isActive: boolean
}

// Hotel Types
export interface HotelImage {
  id: number
  imageUrl: string
}

export interface Hotel {
  id: number
  name: string
  description: string
  address: string
  rating?: number
  imageUrl: string
  checkInTime?: string
  checkOutTime?: string
  images?: HotelImage[]
  imageUrls?: string[]
  isActive?: boolean
}

export interface CreateHotelRequest {
  name: string
  description: string
  address: string
  rating?: number
  imageUrl: string
  checkInTime?: string
  checkOutTime?: string
  imageUrls?: string[]
}

export interface UpdateHotelRequest extends CreateHotelRequest {
  isActive: boolean
}

// Package Types
export interface PackageImage {
  id?: number
  imageUrl: string
}

export interface PackageInclusion {
  id?: number
  inclusionType: string
  iconName?: string
  isIncluded: boolean
}

export interface CreatePackageInclusionRequest {
  inclusionType: string
  iconName?: string
  isIncluded: boolean
}

export interface PackageHighlight {
  id?: number
  highlight: string
  displayOrder: number
}

export interface CreatePackageHighlightRequest {
  highlight: string
  displayOrder: number
}

export interface Transfer {
  id?: number
  vehicleType?: string
  pickupLocation?: string
  dropLocation?: string
  pickupTime?: string
  isPrivate: boolean
}

export interface CreateTransferRequest {
  vehicleType?: string
  pickupLocation?: string
  dropLocation?: string
  pickupTime?: string
  isPrivate: boolean
}

export interface ItineraryDayHotel {
  id?: number
  hotelId: number
  hotel?: Hotel
  displayOrder: number
  isRecommended: boolean
}

export interface CreateItineraryDayHotelRequest {
  hotelId: number
  displayOrder: number
  isRecommended: boolean
}

export interface ItineraryDayActivity {
  id?: number
  activityId: number
  activity?: Activity
  isRecommended: boolean
  isIncluded: boolean
  displayOrder: number
}

export interface CreateItineraryDayActivityRequest {
  activityId: number
  isRecommended: boolean
  isIncluded: boolean
  displayOrder: number
}

export interface ItineraryDay {
  id?: number
  dayNumber: number
  title: string
  description: string
  isBreakfastIncluded: boolean
  isLunchIncluded: boolean
  isDinnerIncluded: boolean
  isLeisureDay: boolean
  imageUrls?: string[]
  hotels?: ItineraryDayHotel[]
  activities?: ItineraryDayActivity[]
  transfers?: Transfer[]
}

export interface CreateItineraryDayRequest {
  dayNumber: number
  title: string
  description: string
  isBreakfastIncluded: boolean
  isLunchIncluded: boolean
  isDinnerIncluded: boolean
  isLeisureDay: boolean
  imageUrls?: string[]
  hotels?: CreateItineraryDayHotelRequest[]
  activities?: CreateItineraryDayActivityRequest[]
  transfers?: CreateTransferRequest[]
}

export interface Package {
  id: number
  destinationId: number
  destinationName?: string
  destination?: Destination
  title: string
  description: string
  durationDays: number
  basePrice: number
  originalPrice?: number
  discountAmount?: number
  maxPeople?: number
  category: string
  themeTags?: string
  isFeatured: boolean
  isActive: boolean
  startDate?: string
  endDate?: string
  imageUrls: string[]
  images?: PackageImage[]
  inclusions?: PackageInclusion[]
  highlights?: PackageHighlight[]
  itinerary: ItineraryDay[]
  createdAt?: string
  updatedAt?: string
}

export interface CreatePackageRequest {
  destinationId: number
  title: string
  description: string
  durationDays: number
  basePrice: number
  originalPrice?: number
  discountAmount?: number
  maxPeople?: number
  category: string
  themeTags?: string
  isFeatured: boolean
  startDate?: string
  endDate?: string
  imageUrls: string[]
  inclusions?: CreatePackageInclusionRequest[]
  highlights?: CreatePackageHighlightRequest[]
  itinerary: CreateItineraryDayRequest[]
}

export interface UpdatePackageRequest {
  destinationId: number
  title: string
  description: string
  durationDays: number
  basePrice: number
  originalPrice?: number
  discountAmount?: number
  maxPeople?: number
  category: string
  themeTags?: string
  isFeatured: boolean
  isActive: boolean
  startDate?: string
  endDate?: string
  imageUrls: string[]
  inclusions?: CreatePackageInclusionRequest[]
  highlights?: CreatePackageHighlightRequest[]
  itinerary: CreateItineraryDayRequest[]
}

// Package Filter Types
export interface PackageFilters {
  destination?: number
  minPrice?: number
  maxPrice?: number
  category?: string
  isFeatured?: boolean
}

// Auth Types
export interface User {
  userId: string
  fullName: string
  email: string
  role: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  phone: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  userId: string
  fullName: string
  email: string
  role: string
}

// API Response Types
export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}
