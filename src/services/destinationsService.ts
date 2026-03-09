import { apiClient } from './apiClient'
import type { Destination } from '@/types'

export const destinationsService = {
  async getAll(): Promise<Destination[]> {
    const response = await apiClient.get<Destination[]>('/api/Destinations')
    return response.data
  },

  async getById(id: number): Promise<Destination> {
    const response = await apiClient.get<Destination>(`/api/Destinations/${id}`)
    return response.data
  },
}
