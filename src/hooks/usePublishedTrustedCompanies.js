// Hook that loads only the published trusted companies for public-facing pages.

import { useCallback, useEffect, useState } from "react"
import { getPublishedTrustedCompanies } from "../services/trustedCompaniesService"

/**
 * Fetches published trusted companies on mount.
 *
 * Returns:
 * - companies: array of published company records (filtered by the API)
 * - loading / error: fetch state
 * - refetch(): reloads the published trusted companies
 */
export function usePublishedTrustedCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPublishedTrustedCompanies()
      setCompanies(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load published companies once on mount.
  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  return { companies, loading, error, refetch: fetchCompanies }
}
