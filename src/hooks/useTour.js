// src/hooks/useTour.js
import { useState, useEffect, useCallback } from 'react'
import { tourService } from '../services/tourService'

export const useTour = () => {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get all tours
  const fetchTours = useCallback (async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await tourService.getAllTours()
      console.log('Tour API Response:', response)

      if (response.success) {
        setTours(response.data)
      } else {
        if (Array.isArray(response)) {
          setTours(response)
        } else {
          setError(response.message || 'Failed to fetch tours')
        }
      }
    } catch (err) {
      console.error('Error fetching tours:', err)
      setError(err.message)
      setTours([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Get tour by ID
  const fetchTourById = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await tourService.getTourById(id)
      if (response.success) {
        return response.data
      } else {
        setError(response.message)
        return null
      }
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Create tour
  const createTour = async (tourData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await tourService.createTour(tourData)
      if (response.success) {
        await fetchTours() // Refresh list
        return response.data
      } else {
        setError(response.message)
        return null
      }
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Update tour
  const updateTour = async (id, tourData) => {
    setLoading(true)
    setError(null)
    try {
      const response = await tourService.updateTour(id, tourData)
      if (response.success) {
        await fetchTours() // Refresh list
        return response.data
      } else {
        setError(response.message)
        return null
      }
    } catch (err) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Delete tour
  const deleteTour = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await tourService.deleteTour(id)
      
      if (response.success) {
        // Refresh list
        await fetchTours()
        return true
      } else {
        setError(response.message || 'Failed to delete tour')
        return false
      }
    } catch (err) {
      setError(err.message || 'Failed to delete tour')
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchTours])

  // Clear error
  const clearError = () => setError(null)

  return {
    tours,
    loading,
    error,
    fetchTours,
    fetchTourById,
    createTour,
    updateTour,
    deleteTour,
    clearError
  }
}