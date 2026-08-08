// Hook that loads and manages team members (list, CRUD, photo upload/delete)
// with a refresh after every mutation.

import { useCallback, useEffect, useState } from "react"
import {
  getTeamMembers as getTeamMembersRequest,
  createTeamMember as createTeamMemberRequest,
  updateTeamMember as updateTeamMemberRequest,
  deleteTeamMember as deleteTeamMemberRequest,
  uploadPhoto as uploadPhotoRequest,
  deletePhoto as deletePhotoRequest,
} from "../services/teamService"

/**
 * Loads all team members on mount.
 *
 * Returns:
 * - team: array of team member records
 * - loading / error: fetch state
 * - refetch(): reloads all team members
 * - createTeamMember(payload) / updateTeamMember(id, payload) / removeTeamMember(id):
 *   perform the mutation, then refetch so `team` reflects the database
 * - uploadPhoto(file, onProgress) / removePhoto(publicUrl): storage helpers that
 *   do not trigger a refetch (photo URLs are set via updateTeamMember)
 */
export function useTeam() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTeam = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTeamMembersRequest()
      setTeam(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load team members once on mount.
  useEffect(() => {
    fetchTeam()
  }, [fetchTeam])

  const createTeamMember = useCallback(
    async (payload) => {
      const created = await createTeamMemberRequest(payload)
      await fetchTeam()
      return created
    },
    [fetchTeam]
  )

  const updateTeamMember = useCallback(
    async (id, payload) => {
      const updated = await updateTeamMemberRequest(id, payload)
      await fetchTeam()
      return updated
    },
    [fetchTeam]
  )

  const removeTeamMember = useCallback(
    async (id) => {
      await deleteTeamMemberRequest(id)
      await fetchTeam()
    },
    [fetchTeam]
  )

  const uploadPhoto = useCallback(async (file, onProgress) => uploadPhotoRequest(file, onProgress), [])

  const removePhoto = useCallback(async (publicUrl) => deletePhotoRequest(publicUrl), [])

  return {
    team,
    loading,
    error,
    refetch: fetchTeam,
    createTeamMember,
    updateTeamMember,
    removeTeamMember,
    uploadPhoto,
    removePhoto,
  }
}
