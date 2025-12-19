import { apiConfig, handleResponse } from './apiConfig'

export const userTourService = {
  // GET semua tour packages yang AVAILABLE untuk user
  async getAllAvailableTours() {
    try {
      const response = await fetch(`${apiConfig.baseURL}/tour-packages`, {
        headers: apiConfig.headers
      })
      
      const data = await response.json()
      
      // Handle berbagai format response
      if (response.ok) {
        // Format ApiResponseResources { success: true, data: [...] }
        if (data.success !== undefined) {
          return data
        }
        // Format langsung array
        else if (Array.isArray(data)) {
          return {
            success: true,
            message: 'Tours retrieved successfully',
            data: data
          }
        }
        // Format lain
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
      console.error('User tour service error:', error)
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  },

  // GET detail tour package untuk user
  async getTourBySlug(slug) {
    try {
      const response = await fetch(
        `${apiConfig.baseURL}/tour-packages/${slug}`,
        { headers: apiConfig.headers }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Tour not found')
      }

      return {
        success: true,
        data: data.data ?? data
      }
    } catch (error) {
      console.error('Get tour detail error:', error)
      return {
        success: false,
        message: error.message,
        data: null
      }
    }
  },

  // GET tour packages berdasarkan kategori/filter (jika ada)
  async getToursByCategory(category) {
    try {
      const url = category 
        ? `${apiConfig.baseURL}/tour-packages?category=${category}`
        : `${apiConfig.baseURL}/tour-packages`
      
      const response = await fetch(url, {
        headers: apiConfig.headers
      })
      
      const data = await response.json()
      
      if (response.ok) {
        if (data.success !== undefined) {
          return data
        } else if (Array.isArray(data)) {
          return {
            success: true,
            data: data
          }
        }
      } else {
        throw new Error(data.message || 'Failed to fetch tours by category')
      }
    } catch (error) {
      console.error('Category tour error:', error)
      return {
        success: false,
        message: error.message,
        data: []
      }
    }
  },

  // SEARCH tour packages dengan parameter
  async searchTours(params = {}) {
    try {
      // Build query string dari params
      const queryParams = new URLSearchParams();
      
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);
      if (params.min_price) queryParams.append('min_price', params.min_price);
      if (params.max_price) queryParams.append('max_price', params.max_price);
      
      const queryString = queryParams.toString();
      const url = queryString 
        ? `${apiConfig.baseURL}/tour-packages?${queryString}`
        : `${apiConfig.baseURL}/tour-packages`;
      
      const response = await fetch(url, {
        headers: apiConfig.headers
      });
      
      const data = await response.json();
      
      if (response.ok) {
        if (data.success !== undefined) {
          return data;
        } else if (Array.isArray(data)) {
          return {
            success: true,
            data: data
          };
        }
      } else {
        throw new Error(data.message || 'Failed to search tours');
      }
    } catch (error) {
      console.error('Search tour error:', error);
      return {
        success: false,
        message: error.message,
        data: []
      };
    }
  }
}