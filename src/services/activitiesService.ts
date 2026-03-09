import { apiClient } from './apiClient'
import type { Activity, CreateActivityRequest, UpdateActivityRequest } from '@/types'

export const activitiesService = {
  async getAll(): Promise<Activity[]> {
    const response = await apiClient.get<Activity[]>('/api/Activities')
    return response.data
  },

  async getById(id: number): Promise<Activity> {
    const response = await apiClient.get<Activity>(`/api/Activities/${id}`)
    return response.data
  },

  async create(data: CreateActivityRequest): Promise<Activity> {
    const response = await apiClient.post<Activity>('/api/Activities', data)
    return response.data
  },

  async update(id: number, data: UpdateActivityRequest): Promise<Activity> {
    const response = await apiClient.put<Activity>(`/api/Activities/${id}`, data)
    return response.data
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/Activities/${id}`)
  },
}
