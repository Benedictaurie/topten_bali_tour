import { useState, useCallback } from 'react';
import { userActivityService } from '../services/userActivityService';

export const useUserActivity = () => {
  const [activities, setActivities] = useState([])
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchAvailableActivities = useCallback(async () => {
    setLoading(true)
    setError(null)

    const response = await userActivityService.getAllAvailableActivities()

    if (response.success) {
      const available = response.data.filter(
        a => a.is_available !== false && a.is_available !== 0
      )
      setActivities(available)
    } else {
      setError(response.message)
      setActivities([])
    }

    setLoading(false)
  }, [])

  const fetchActivityBySlug = useCallback(async (slug) => {
    if (!slug) return null

    setLoading(true)
    setError(null)

    const response = await userActivityService.getActivityBySlug(slug)

    if (response.success) {
      if (!response.data.is_available) {
        setError('This activity is currently unavailable')
        setSelectedActivity(null)
        setLoading(false)
        return null
      }

      setSelectedActivity(response.data)
      setLoading(false)
      return response.data
    }

    setError(response.message)
    setSelectedActivity(null)
    setLoading(false)
    return null
  }, [])

  return {
    activities,
    selectedActivity,
    loading,
    error,
    fetchAvailableActivities,
    fetchActivityBySlug,
    clearError: () => setError(null),
    clearSelectedActivity: () => setSelectedActivity(null)
  }
}
