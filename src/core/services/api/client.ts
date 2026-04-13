import { API_BASE_URL } from '@/core/constants/app'

export const apiClient = {
  baseUrl: API_BASE_URL,
  async request<T>(_endpoint: string, _init?: RequestInit): Promise<T> {
    throw new Error('API service layer is not implemented yet.')
  },
}
