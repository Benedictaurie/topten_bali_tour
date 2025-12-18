// src/services/rentalService.js
import { apiConfig, getAuthHeaders, handleResponse } from './apiConfig'

export const rentalService = {

  // GET: semua rental packages (admin)
  async getAllRentals() {
    try {
      const response = await fetch(`${apiConfig.baseURL}/admin/rentals`, {
        headers: getAuthHeaders()
      })

      const data = await response.json()

      if (response.ok) {
        if (data.success !== undefined) {
          return data
        } else if (Array.isArray(data)) {
          return {
            success: true,
            message: 'Rentals retrieved successfully',
            data: data
          }
        } else {
          return { success: true, data: data }
        }
      }

      throw new Error(data.message || 'Failed to fetch rentals')
    } catch (error) {
      console.error('Rental service error:', error)
      return { success: false, message: error.message, data: [] }
    }
  },

  // GET detail rental
  async getRentalById(id) {
    const response = await fetch(`${apiConfig.baseURL}/admin/rentals/detail/${id}`, {
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // CREATE rental package
  async createRental(rentalData) {
    const formData = new FormData()

    // basic fields
    formData.append('type', rentalData.type)
    formData.append('brand', rentalData.brand)
    formData.append('model', rentalData.model)
    formData.append('plate_number', rentalData.plate_number)
    formData.append('description', rentalData.description)
    formData.append('includes', rentalData.includes)
    formData.append('excludes', rentalData.excludes)
    formData.append('price_per_day', rentalData.price_per_day)
    formData.append('is_available', rentalData.is_available ? 'true' : 'false')

    // images
    if (rentalData.images && rentalData.images.length > 0) {
      rentalData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('image[]', image)
        }
      })
    }

    const response = await fetch(`${apiConfig.baseURL}/admin/rentals`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: formData
    })

    return handleResponse(response)
  },

  // UPDATE rental package
  async updateRental(id, rentalData) {
    const formData = new FormData()

    formData.append('type', rentalData.type)
    formData.append('brand', rentalData.brand)
    formData.append('model', rentalData.model)
    formData.append('plate_number', rentalData.plate_number)
    formData.append('description', rentalData.description)
    formData.append('includes', rentalData.includes)
    formData.append('excludes', rentalData.excludes)
    formData.append('price_per_day', rentalData.price_per_day)
    formData.append('is_available', rentalData.is_available ? 'true' : 'false')
    formData.append('_method', 'PUT')

    if (rentalData.images && rentalData.images.length > 0) {
      rentalData.images.forEach((image) => {
        if (image instanceof File) {
          formData.append('image[]', image)
        }
      })
    }

    const response = await fetch(`${apiConfig.baseURL}/admin/rentals/${id}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: formData
    })

    return handleResponse(response)
  },

  // DELETE rental
  async deleteRental(id) {
    const response = await fetch(`${apiConfig.baseURL}/admin/rentals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    })
    return handleResponse(response)
  },

  // CHECK availability
  async checkAvailability(id, start_date, end_date) {
    const response = await fetch(
      `${apiConfig.baseURL}/rentals/check/${id}?start_date=${start_date}&end_date=${end_date}`,
      { headers: getAuthHeaders() }
    )

    return handleResponse(response)
  }
}
