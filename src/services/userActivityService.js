import { apiConfig } from './apiConfig'

export const userActivityService = {

  async getAllAvailableActivities() {
    try {
      const response = await fetch(
        `${apiConfig.baseURL}/activity-packages/get`,
        { headers: apiConfig.headers }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch activities')
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

  async getActivityBySlug(slug) {
    try {
      const response = await fetch(
        `${apiConfig.baseURL}/activity-packages/${slug}`,
        { headers: apiConfig.headers }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Activity not found')
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
