// Hook that loads and manages the full portfolio project list with CRUD actions
// that refresh the list after every mutation.

import { useCallback, useEffect, useState } from "react"
import {
  getProjects as getProjectsRequest,
  createProject as createProjectRequest,
  updateProject as updateProjectRequest,
  deleteProject as deleteProjectRequest,
} from "../services/portfolioService"

/**
 * Loads all portfolio projects on mount.
 *
 * Returns:
 * - projects: array of project records
 * - loading / error: fetch state
 * - refetch(): reloads all projects
 * - createProject(payload) / updateProject(id, payload) / removeProject(id):
 *   perform the mutation, then refetch so `projects` reflects the database.
 */
export function usePortfolio() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProjects = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProjectsRequest()
      setProjects(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load projects once on mount.
  useEffect(() => {
    fetchProjects()
  }, [fetchProjects])

  const createProject = useCallback(
    async (payload) => {
      const created = await createProjectRequest(payload)
      await fetchProjects()
      return created
    },
    [fetchProjects]
  )

  const updateProject = useCallback(
    async (id, payload) => {
      const updated = await updateProjectRequest(id, payload)
      await fetchProjects()
      return updated
    },
    [fetchProjects]
  )

  const removeProject = useCallback(
    async (id) => {
      await deleteProjectRequest(id)
      await fetchProjects()
    },
    [fetchProjects]
  )

  return {
    projects,
    loading,
    error,
    refetch: fetchProjects,
    createProject,
    updateProject,
    removeProject,
  }
}
