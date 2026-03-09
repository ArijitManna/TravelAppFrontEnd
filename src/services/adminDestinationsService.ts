import { apiClient } from './apiClient'
import type { Destination, CreateDestinationRequest, UpdateDestinationRequest } from '@/types'

export const adminDestinationsService = {
  async create(data: CreateDestinationRequest): Promise<Destination> {
    const response = await apiClient.post<Destination>('/api/admin/destinations', data)
    return response.data
  },

  async update(id: number, data: UpdateDestinationRequest): Promise<Destination> {
    const response = await apiClient.put<Destination>(`/api/admin/destinations/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/admin/destinations/${id}`)
  },
}
