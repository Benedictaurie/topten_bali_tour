// src/services/activityService.js
import { apiConfig, getAuthHeaders, handleResponse } from './apiConfig'

export const activityService = {

  // GET: semua activity packages (admin)
  async getAllActivities() {
    try {
      const response = await fetch(`${apiConfig.baseURL}/admin/activities`, {
        headers: getAuthHeaders()
      })

      const data = await response.json()

      if (response.ok) {
        if (data.success !== undefined) return data
        if (Array.isArray(data)) {
          return {
            success: true,
            message: 'Activities retrieved successfully',
            data: data
          }
        }
        return { success: true, data: data }
      }

      throw new Error(data.message || 'Failed to fetch activities')

    } catch (error) {
      console.error('Activity service error:', error)
      return { success: false, message: error.message, data: [] }
    }
  },

  // GET detail activity
  async getActivityById(id) {
    const response = await fetch(`${apiConfig.baseURL}/admin/activities/detail/${id}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // CREATE activity
  async createActivity(activityData) {
    const formData = new FormData()

    // basic data
    formData.append('name', activityData.name)
    formData.append('description', activityData.description)
    formData.append('itinerary', activityData.itinerary)
    formData.append('includes', activityData.includes)
    formData.append('excludes', activityData.excludes)
    formData.append('price_per_person', activityData.price_per_person)
    formData.append('min_persons', activityData.min_persons)
    formData.append('duration_hours', activityData.duration_hours)
    formData.append('is_available', activityData.is_available ? 'true' : 'false')

    // images
    if (activityData.images && activityData.images.length > 0) {
      activityData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('image[]', image)
        }
      })
    }

    const response = await fetch(`${apiConfig.baseURL}/admin/activities`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData
    })

    return handleResponse(response)
  },

  // UPDATE activity
  async updateActivity(id, activityData) {
    const formData = new FormData()

    formData.append('name', activityData.name)
    formData.append('description', activityData.description)
    formData.append('itinerary', activityData.itinerary)
    formData.append('includes', activityData.includes)
    formData.append('excludes', activityData.excludes)
    formData.append('price_per_person', activityData.price_per_person)
    formData.append('min_persons', activityData.min_persons)
    formData.append('duration_hours', activityData.duration_hours)
    formData.append('is_available', activityData.is_available ? 'true' : 'false')
    formData.append('_method', 'PUT')

    if (activityData.images && activityData.images.length > 0) {
      activityData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('image[]', image)
        }
      })
    }

    const response = await fetch(`${apiConfig.baseURL}/admin/activities/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData
    })

    return handleResponse(response)
  },

  // DELETE activity
  async deleteActivity(id) {
    const response = await fetch(`${apiConfig.baseURL}/admin/activities/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // CHECK availability
  async checkAvailability(id, date, participants) {
    const url = `${apiConfig.baseURL}/activities/check/${id}?date=${date}&participants=${participants}`

    const response = await fetch(url, {
      headers: getAuthHeaders()
    })

    return handleResponse(response)
  }
}
