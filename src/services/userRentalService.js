import { apiConfig } from './apiConfig'

export const userRentalService = {

  async getAllAvailableRentals() {
    try {
      const response = await fetch(
        `${apiConfig.baseURL}/rental-packages/get`,
        { headers: apiConfig.headers }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch rentals')
      }

      return data.success !== undefined
        ? data
        : { success: true, data }

    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  },

  async getRentalBySlug(slug) {
    try {
      const response = await fetch(
        `${apiConfig.baseURL}/rental-packages/${slug}`,
        { headers: apiConfig.headers }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Rental not found')
      }

      return {
        success: true,
        data: data.data ?? data
      }

    } catch (error) {
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  }
}
