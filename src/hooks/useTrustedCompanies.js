// Hook that loads and manages the trusted companies list with CRUD actions that
// refresh the list after every mutation.

import { useCallback, useEffect, useState } from "react"
import {
  getTrustedCompanies as getTrustedCompaniesRequest,
  createTrustedCompany as createTrustedCompanyRequest,
  updateTrustedCompany as updateTrustedCompanyRequest,
  deleteTrustedCompany as deleteTrustedCompanyRequest,
} from "../services/trustedCompaniesService"

/**
 * Loads all trusted companies on mount.
 *
 * Returns:
 * - companies: array of trusted company records
 * - loading / error: fetch state
 * - refetch(): reloads all companies
 * - createCompany(payload) / updateCompany(id, payload) / removeCompany(id):
 *   perform the mutation, then refetch so `companies` reflects the database.
 */
export function useTrustedCompanies() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCompanies = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTrustedCompaniesRequest()
      setCompanies(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load companies once on mount.
  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  const createCompany = useCallback(
    async (payload) => {
      const created = await createTrustedCompanyRequest(payload)
      await fetchCompanies()
      return created
    },
    [fetchCompanies]
  )

  const updateCompany = useCallback(
    async (id, payload) => {
      const updated = await updateTrustedCompanyRequest(id, payload)
      await fetchCompanies()
      return updated
    },
    [fetchCompanies]
  )

  const removeCompany = useCallback(
    async (id) => {
      await deleteTrustedCompanyRequest(id)
      await fetchCompanies()
    },
    [fetchCompanies]
  )

  return {
    companies,
    loading,
    error,
    refetch: fetchCompanies,
    createCompany,
    updateCompany,
    removeCompany,
  }
}
