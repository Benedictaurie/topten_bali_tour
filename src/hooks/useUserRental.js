import { useState, useCallback } from 'react'
import { userRentalService } from '../services/userRentalService'

export const useUserRental = () => {
  const [rentals, setRentals] = useState([])
  const [selectedRental, setSelectedRental] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAvailableRentals = useCallback(async () => {
    setLoading(true)
    setError(null)

    const response = await userRentalService.getAllAvailableRentals()

    if (response.success) {
      const available = response.data.filter(
        r => r.is_available !== false && r.is_available !== 0
      )
      setRentals(available)
    } else {
      setError(response.message)
      setRentals([])
    }

    setLoading(false)
  }, [])

  const fetchRentalBySlug = useCallback(async (slug) => {
    if (!slug) return null

    setLoading(true)
    setError(null)

    const response = await userRentalService.getRentalBySlug(slug)

    if (response.success) {
      if (!response.data.is_available) {
        setError('This rental is currently unavailable')
        setSelectedRental(null)
        setLoading(false)
        return null
      }

      setSelectedRental(response.data)
      setLoading(false)
      return response.data
    }

    setError(response.message)
    setSelectedRental(null)
    setLoading(false)
    return null
  }, [])

  return {
    rentals,
    selectedRental,
    loading,
    error,
    fetchAvailableRentals,
    fetchRentalBySlug,
    clearError: () => setError(null),
    clearSelectedRental: () => setSelectedRental(null)
  }
}