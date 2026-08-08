import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { usePublicWebsiteSettings } from "../hooks/useWebsiteSettings"
import { applyWebsiteSettings } from "../utils/seo"

// Headless component that keeps page titles, meta tags, and favicons in sync with the site settings.

/**
 * Applies public website settings to the document whenever settings or the route change.
 * @returns {null} Renders nothing.
 */
export default function SeoManager() {
  const { settings } = usePublicWebsiteSettings()
  const location = useLocation()

  useEffect(() => {
    // Re-apply on route change so per-page metadata (titles, descriptions) stays correct.
    if (settings) applyWebsiteSettings(settings)
  }, [settings, location.pathname])

  return null
}
