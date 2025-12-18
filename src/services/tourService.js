// src/services/tourService.js
import { apiConfig, getAuthHeaders, handleResponse } from './apiConfig'

export const tourService = {
  // GET semua tour packages (untuk admin - semua data, termasuk yang tidak available)
  async getAllTours() {
    try {
      const response = await fetch(`${apiConfig.baseURL}/admin/tours`, {
        headers: getAuthHeaders()
      })
      
      const data = await response.json()
      
      // Handle berbagai format response
      if (response.ok) {
        // Format 1: ApiResponseResources { success: true, data: [...] }
        if (data.success !== undefined) {
          return data
        }
        // Format 2: Langsung array
        else if (Array.isArray(data)) {
          return {
            success: true,
            message: 'Tours retrieved successfully',
            data: data
          }
        }
        // Format 3: Data langsung dalam response
        else {
          return {
            success: true,
            data: data
          }
        }
      } else {
        throw new Error(data.message || 'Failed to fetch tours')
      }
    } catch (error) {
      console.error('Tour service error:', error)
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  },

  // GET detail tour package
  async getTourById(id) {
    const response = await fetch(`${apiConfig.baseURL}/admin/tours/detail/${id}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // CREATE new tour package
  async createTour(tourData) {
    const formData = new FormData()
    
    // Append basic data
    formData.append('name', tourData.name)
    formData.append('description', tourData.description)
    formData.append('itinerary', tourData.itinerary)
    formData.append('includes', tourData.includes)
    formData.append('excludes', tourData.excludes)
    formData.append('price_per_person', tourData.price_per_person)
    formData.append('min_persons', tourData.min_persons)
    formData.append('duration_days', tourData.duration_days)
    formData.append('is_available', tourData.is_available ? 'true' : 'false')

    // Append images jika ada
    if (tourData.images && tourData.images.length > 0) {
      tourData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('image[]', image)
        }
      })
    }

    const response = await fetch(`${apiConfig.baseURL}/admin/tours`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        // Jangan set Content-Type untuk FormData, browser akan set otomatis dengan boundary
      },
      body: formData
    })
    return handleResponse(response)
  },

  // UPDATE tour package
  async updateTour(id, tourData) {
    const formData = new FormData()
    
    // Append basic data
    formData.append('name', tourData.name)
    formData.append('description', tourData.description)
    formData.append('itinerary', tourData.itinerary)
    formData.append('includes', tourData.includes)
    formData.append('excludes', tourData.excludes)
    formData.append('price_per_person', tourData.price_per_person)
    formData.append('min_persons', tourData.min_persons)
    formData.append('duration_days', tourData.duration_days)
    formData.append('is_available', tourData.is_available ? 'true' : 'false')
    formData.append('_method', 'PUT') // Untuk Laravel form data dengan PUT

    // Append images jika ada
    if (tourData.images && tourData.images.length > 0) {
      tourData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('image[]', image)
        }
      })
    }

    const response = await fetch(`${apiConfig.baseURL}/admin/tours/${id}`, {
      method: 'POST', // Use POST for FormData with _method=PUT
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData
    })
    return handleResponse(response)
  },

  // DELETE tour package
  async deleteTour(id) {
    const response = await fetch(`${apiConfig.baseURL}/admin/tours/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  }
}