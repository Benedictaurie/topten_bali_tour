import { useState, useEffect, useCallback } from 'react'
import { userTourService } from '../services/userTourService'

export const useUserTour = () => {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedTour, setSelectedTour] = useState(null)

  // Get all AVAILABLE tours for user
  const fetchAvailableTours = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await userTourService.getAllAvailableTours()
      
      if (response.success) {
        // Filter hanya yang available jika belum difilter di backend
        const availableTours = response.data.filter(tour => 
          tour.is_available !== false && tour.is_available !== 0
        )
        setTours(availableTours)
      } else {
        setError(response.message || 'Failed to fetch tours')
        setTours([])
      }
    } catch (err) {
      console.error('Error fetching available tours:', err)
      setError(err.message)
      setTours([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Get tour by ID untuk user
  const fetchTourById = useCallback(async (id) => {
    if (!id) return null
    
    setLoading(true)
    setError(null)
    try {
      const response = await userTourService.getTourById(id)
      
      if (response.success) {
        // Cek apakah tour available
        if (response.data.is_available === false || response.data.is_available === 0) {
          setError('This tour package is currently unavailable')
          setSelectedTour(null)
          return null
        }
        
        setSelectedTour(response.data)
        return response.data
      } else {
        setError(response.message || 'Tour not found')
        setSelectedTour(null)
        return null
      }
    } catch (err) {
      setError(err.message)
      setSelectedTour(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Get tours by category
  const fetchToursByCategory = useCallback(async (category) => {
    setLoading(true)
    setError(null)
    try {
      const response = await userTourService.getToursByCategory(category)
      
      if (response.success) {
        // Filter hanya yang available
        const availableTours = response.data.filter(tour => 
          tour.is_available !== false && tour.is_available !== 0
        )
        setTours(availableTours)
      } else {
        setError(response.message || 'Failed to fetch tours by category')
        setTours([])
      }
    } catch (err) {
      console.error('Error fetching tours by category:', err)
      setError(err.message)
      setTours([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Clear error
  const clearError = () => setError(null)

  // Clear selected tour
  const clearSelectedTour = () => setSelectedTour(null)

  return {
    tours,
    selectedTour,
    loading,
    error,
    fetchAvailableTours,
    fetchTourById,
    fetchToursByCategory,
    clearError,
    clearSelectedTour
  }
}