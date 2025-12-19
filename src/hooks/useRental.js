// src/hooks/useRental.js
import { useState, useEffect, useCallback } from 'react'
import { rentalService } from '../services/rentalService'

export const useRental = () => {
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get All Rentals
  const fetchRentals = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await rentalService.getAllRentals()
      console.log('Rental API Response:', response)

      if (response.success) {
        setRentals(response.data)
      } else {
        if (Array.isArray(response)) {
          setRentals(response)
        } else {
          setError(response.message || 'Failed to fetch rentals')
        }
      }
    } catch (err) {
      console.error('Error fetching rentals:', err)
      setError(err.message)
      setRentals([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Get Rental by ID
  const fetchRentalById = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await rentalService.getRentalById(id)
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

  // Create Rental
  const createRental = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const response = await rentalService.createRental(data)
      if (response.success) {
        await fetchRentals()
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

  // Update Rental
  const updateRental = async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      const response = await rentalService.updateRental(id, data)
      if (response.success) {
        await fetchRentals()
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

  // Delete Rental
  const deleteRental = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await rentalService.deleteRental(id)
      if (response.success) {
        await fetchRentals()
        return true
      } else {
        setError(response.message)
        return false
      }
    } catch (err) {
      setError(err.message)
      return false
    } finally {
      setLoading(false)
    }
  }, [fetchRentals])

  const clearError = () => setError(null)

  return {
    rentals,
    loading,
    error,
    fetchRentals,
    fetchRentalById,
    createRental,
    updateRental,
    deleteRental,
    clearError
  }
}
