import { createContext, useEffect, useMemo, useState, useCallback } from "react"
import { supabase } from "../lib/supabaseClient"
import { login as loginService, logout as logoutService } from "../services/authService"

// Global auth context: exposes the current user/session and sign-in/sign-out actions.
const AuthContext = createContext(null)

// Provides auth state to the whole app by syncing with Supabase's session lifecycle.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, restore any existing session and subscribe to future auth changes.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Supabase emits onAuthStateChange on login, logout, token refresh, etc.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async ({ email, password }) => {
    // Delegates the actual RPC/API call to the auth service, then returns its data.
    const data = await loginService({ email, password })
    return data
  }, [])

  // Logs out via the service and clears local auth state.
  const signOut = useCallback(async () => {
    await logoutService()
    setUser(null)
    setSession(null)
  }, [])

  // Memoized context value so consumers only re-render when auth state changes.
  const value = useMemo(
    () => ({ user, session, loading, signIn, signOut }),
    [user, session, loading, signIn, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext
