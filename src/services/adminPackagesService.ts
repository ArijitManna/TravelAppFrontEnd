import { apiClient } from './apiClient'
import type { Package, CreatePackageRequest, UpdatePackageRequest } from '@/types'

export const adminPackagesService = {
  async create(data: CreatePackageRequest): Promise<Package> {
    const response = await apiClient.post<Package>('/api/admin/packages', data)
    return response.data
  },

  async update(id: number, data: UpdatePackageRequest): Promise<Package> {
    console.log('🔄 adminPackagesService.update called:', { id, isFeatured: data.isFeatured, isActive: data.isActive })
    const response = await apiClient.put<Package>(`/api/admin/packages/${id}`, data)
    console.log('✅ adminPackagesService.update response:', response.data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/packages/${id}`)
  },
}
