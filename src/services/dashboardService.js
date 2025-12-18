import { apiConfig, getAuthHeaders } from './apiConfig'

export const dashboardService = {
  async getStats() {
    // Simulasi API call ke Laravel backend
    const response = await fetch(`${apiConfig.baseURL}/admin/dashboard/stats`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) throw new Error('Failed to fetch dashboard stats')
    
    // Data dummy untuk contoh
    return {
      totalUsers: 1247,
      todayBookings: 23,
      totalReviews: 456,
      revenue: 12500000
    }
    
    // Uncomment untuk real API
    // return response.json()
  },

  async getRecentBookings() {
    const response = await fetch(`${apiConfig.baseURL}/admin/dashboard/recent-bookings`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) throw new Error('Failed to fetch recent bookings')
    return response.json()
  },

  async getRecentReviews() {
    const response = await fetch(`${apiConfig.baseURL}/admin/dashboard/recent-reviews`, {
      headers: getAuthHeaders()
    })
    
    if (!response.ok) throw new Error('Failed to fetch recent reviews')
    return response.json()
  }
}