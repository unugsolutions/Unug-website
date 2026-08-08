// Hook that loads only the published team members for public-facing pages.

import { useCallback, useEffect, useState } from "react"
import { getPublishedTeamMembers } from "../services/teamService"

/**
 * Fetches published team members on mount.
 *
 * Returns:
 * - team: array of published team member records (filtered by the API)
 * - loading / error: fetch state
 * - refetch(): reloads the published team members
 */
export function usePublishedTeamMembers() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTeam = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPublishedTeamMembers()
      setTeam(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load published team members once on mount.
  useEffect(() => {
    fetchTeam()
  }, [fetchTeam])

  return { team, loading, error, refetch: fetchTeam }
}
