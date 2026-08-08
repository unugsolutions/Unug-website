// Hook that exposes the shared authentication state and methods from AuthContext.

import { useContext } from "react"
import AuthContext from "../context/AuthContext"

/**
 * Returns the authentication context (current user, loading state, and auth actions).
 * Must be used inside an AuthProvider, otherwise it throws.
 */
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
