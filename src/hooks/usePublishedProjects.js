// Hook that loads only the published projects for public-facing pages.

import { useCallback, useEffect, useState } from "react"
import { getPublishedProjects } from "../services/portfolioService"

/**
 * Fetches published projects on mount.
 *
 * Returns:
 * - projects: array of published project records (filtered by the API)
 * - loading / error: fetch state
 * - refetch(): reloads the published projects
 */
export function usePublishedProjects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPublishedProjects()
      setProjects(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load published projects once on mount.
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  return { projects, loading, error, refetch: fetchProjects }
}
