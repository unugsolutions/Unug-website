// Hook that loads and manages testimonials (list, CRUD, photo upload/delete)
// with a refresh after every mutation.

import { useCallback, useEffect, useState } from "react"
import {
  getTestimonials as getTestimonialsRequest,
  createTestimonial as createTestimonialRequest,
  updateTestimonial as updateTestimonialRequest,
  deleteTestimonial as deleteTestimonialRequest,
  uploadPhoto as uploadPhotoRequest,
  deletePhoto as deletePhotoRequest,
} from "../services/testimonialService"

/**
 * Loads all testimonials on mount.
 *
 * Returns:
 * - testimonials: array of testimonial records
 * - loading / error: fetch state
 * - refetch(): reloads all testimonials
 * - createTestimonial(payload) / updateTestimonial(id, payload) / removeTestimonial(id):
 *   perform the mutation, then refetch so `testimonials` reflects the database
 * - uploadPhoto(file, onProgress) / removePhoto(publicUrl): storage helpers that
 *   do not trigger a refetch (photo URLs are set via updateTestimonial)
 */
export function useTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTestimonials = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getTestimonialsRequest()
      setTestimonials(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load testimonials once on mount.
  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  const createTestimonial = useCallback(
    async (payload) => {
      const created = await createTestimonialRequest(payload)
      await fetchTestimonials()
      return created
    },
    [fetchTestimonials]
  )

  const updateTestimonial = useCallback(
    async (id, payload) => {
      const updated = await updateTestimonialRequest(id, payload)
      await fetchTestimonials()
      return updated
    },
    [fetchTestimonials]
  )

  const removeTestimonial = useCallback(
    async (id) => {
      await deleteTestimonialRequest(id)
      await fetchTestimonials()
    },
    [fetchTestimonials]
  )

  const uploadPhoto = useCallback(async (file, onProgress) => uploadPhotoRequest(file, onProgress), [])

  const removePhoto = useCallback(async (publicUrl) => deletePhotoRequest(publicUrl), [])

  return {
    testimonials,
    loading,
    error,
    refetch: fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    removeTestimonial,
    uploadPhoto,
    removePhoto,
  }
}
