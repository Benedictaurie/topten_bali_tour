// src/hooks/useActivity.js
import { useState, useEffect, useCallback } from 'react'
import { activityService } from '../services/activityService'

export const useActivity = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Get All Activities
  const fetchActivities = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await activityService.getAllActivities()
      console.log('Activity API Response:', response)

      if (response.success) {
        setActivities(response.data)
      } else {
        if (Array.isArray(response)) {
          setActivities(response)
        } else {
          setError(response.message || 'Failed to fetch activities')
        }
      }
    } catch (err) {
      console.error('Error fetching activities:', err)
      setError(err.message)
      setActivities([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Get Activity by ID
  const fetchActivityById = async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await activityService.getActivityById(id)
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

  // Create Activity
  const createActivity = async (data) => {
    setLoading(true)
    setError(null)
    try {
      const response = await activityService.createActivity(data)
      if (response.success) {
        await fetchActivities()
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

  // Update Activity
  const updateActivity = async (id, data) => {
    setLoading(true)
    setError(null)
    try {
      const response = await activityService.updateActivity(id, data)
      if (response.success) {
        await fetchActivities()
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

  // Delete Activity
  const deleteActivity = useCallback(async (id) => {
    setLoading(true)
    setError(null)
    try {
      const response = await activityService.deleteActivity(id)
      if (response.success) {
        await fetchActivities()
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
  }, [fetchActivities])

  const clearError = () => setError(null)

  return {
    activities,
    loading,
    error,
    fetchActivities,
    fetchActivityById,
    createActivity,
    updateActivity,
    deleteActivity,
    clearError
  }
}
