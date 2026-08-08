// Hook that loads only the published services for public-facing pages.

import { useCallback, useEffect, useState } from "react"
import { getPublishedServices } from "../services/serviceService"

/**
 * Fetches published services on mount.
 *
 * Returns:
 * - services: array of published service records (filtered by the API)
 * - loading / error: fetch state
 * - refetch(): reloads the published services
 */
export function usePublishedServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPublishedServices()
      setServices(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load published services once on mount.
  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  return { services, loading, error, refetch: fetchServices }
}
