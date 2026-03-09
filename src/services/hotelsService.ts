import { apiClient } from './apiClient'
import type { Hotel, CreateHotelRequest, UpdateHotelRequest } from '@/types'

export const hotelsService = {
  async getAll(): Promise<Hotel[]> {
    const response = await apiClient.get<Hotel[]>('/api/Hotels')
    return response.data
  },

  async getById(id: number): Promise<Hotel> {
    const response = await apiClient.get<Hotel>(`/api/Hotels/${id}`)
    return response.data
  },

  async create(data: CreateHotelRequest): Promise<Hotel> {
    const response = await apiClient.post<Hotel>('/api/Hotels', data)
    return response.data
  },

  async update(id: number, data: UpdateHotelRequest): Promise<Hotel> {
    const response = await apiClient.put<Hotel>(`/api/Hotels/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/Hotels/${id}`)
  },
}
