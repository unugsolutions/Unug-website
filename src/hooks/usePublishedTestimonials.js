// Hook that loads only the published testimonials for public-facing pages.

import { useCallback, useEffect, useState } from "react"
import { getPublishedTestimonials } from "../services/testimonialService"

/**
 * Fetches published testimonials on mount.
 *
 * Returns:
 * - testimonials: array of published testimonial records (filtered by the API)
 * - loading / error: fetch state
 * - refetch(): reloads the published testimonials
 */
export function usePublishedTestimonials() {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTestimonials = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getPublishedTestimonials()
      setTestimonials(data)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load published testimonials once on mount.
  useEffect(() => {
    fetchTestimonials()
  }, [fetchTestimonials])

  return { testimonials, loading, error, refetch: fetchTestimonials }
}
