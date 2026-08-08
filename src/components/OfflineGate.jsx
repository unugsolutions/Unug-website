import { useEffect, useState } from "react"
import Offline from "../pages/Offline"

// Wrapper that swaps the app for an offline page whenever the browser reports no network.

/**
 * Guards the app against network loss.
 * @param {object} props - OfflineGate props.
 * @param {JSX.Element} props.children - App tree rendered while online.
 * @returns {JSX.Element} Children when online, otherwise the Offline page.
 */
export default function OfflineGate({ children }) {
  // Initialise from navigator.onLine so the first render is correct (SSR-safe fallback is true).
  const [online, setOnline] = useState(() =>
    typeof navigator !== "undefined" ? navigator.onLine : true
  )

  // Track connectivity and flip the flag in both directions, cleaning up listeners on unmount.
  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener("online", goOnline)
    window.addEventListener("offline", goOffline)
    return () => {
      window.removeEventListener("online", goOnline)
      window.removeEventListener("offline", goOffline)
    }
  }, [])

  return online ? children : <Offline />
}
