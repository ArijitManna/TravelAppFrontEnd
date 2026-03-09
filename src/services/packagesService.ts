import { apiClient } from './apiClient'
import type { Package, PackageFilters } from '@/types'

// Transform API response to frontend format
function transformPackage(pkg: any): Package {
  return {
    ...pkg,
    // Convert images array to imageUrls string array for backward compatibility
    imageUrls: pkg.images?.map((img: any) => img.imageUrl) || pkg.imageUrls || [],
    // Keep original images array
    images: pkg.images,
    // Add destination name if available
    destination: pkg.destinationName ? { 
      id: pkg.destinationId,
      name: pkg.destinationName,
      country: '',
      description: '',
      imageUrl: '',
      imageUrls: [],
      isActive: true
    } : pkg.destination,
  }
}

export const packagesService = {
  async getAll(filters?: PackageFilters): Promise<Package[]> {
    const params = new URLSearchParams()
    
    if (filters?.destination) {
      params.append('destination', filters.destination.toString())
    }
    if (filters?.minPrice !== undefined) {
      params.append('minPrice', filters.minPrice.toString())
    }
    if (filters?.maxPrice !== undefined) {
      params.append('maxPrice', filters.maxPrice.toString())
    }
    if (filters?.category) {
      params.append('category', filters.category)
    }
    if (filters?.isFeatured !== undefined) {
      params.append('isFeatured', filters.isFeatured.toString())
    }

    const response = await apiClient.get<any[]>(
      `/api/Packages${params.toString() ? `?${params.toString()}` : ''}`
    )
    return response.data.map(transformPackage)
  },

  async getById(id: number): Promise<Package> {
    const response = await apiClient.get<any>(`/api/Packages/${id}`)
    return transformPackage(response.data)
  },
}
