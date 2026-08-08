// Hook that loads and manages the full service list with CRUD actions that
// refresh the list after every mutation.

import { useCallback, useEffect, useState } from "react"
import {
  getServices as getServicesRequest,
  createService as createServiceRequest,
  updateService as updateServiceRequest,
  deleteService as deleteServiceRequest,
} from "../services/serviceService"

/**
 * Loads all services on mount.
 *
 * Returns:
 * - services: array of service records
 * - loading / error: fetch state
 * - refetch(): reloads all services
 * - createService(payload) / updateService(id, payload) / removeService(id):
 *   perform the mutation, then refetch so `services` reflects the database.
 */
export function useServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getServicesRequest()
      setServices(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load services once on mount.
  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const createService = useCallback(
    async (payload) => {
      const created = await createServiceRequest(payload)
      await fetchServices()
      return created
    },
    [fetchServices]
  )

  const updateService = useCallback(
    async (id, payload) => {
      const updated = await updateServiceRequest(id, payload)
      await fetchServices()
      return updated
    },
    [fetchServices]
  )

  const removeService = useCallback(
    async (id) => {
      await deleteServiceRequest(id)
      await fetchServices()
    },
    [fetchServices]
  )

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
    createService,
    updateService,
    removeService,
  }
}
