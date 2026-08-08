import { useEffect } from "react"
import { useLocation } from "react-router-dom"

// Scroll restoration helper: jumps to the top on every route change.

/**
 * Resets scroll position to the top whenever the pathname changes.
 * @returns {null} Renders nothing.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // "instant" avoids smooth-scrolling animation between route changes.
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [pathname])

  return null
}
