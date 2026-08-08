import { Navigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

// Route guard that redirects unauthenticated users to the login page.

/**
 * Wraps dashboard routes and requires an authenticated session.
 * @param {object} props - ProtectedRoute props.
 * @param {JSX.Element} props.children - The route content to render when authorized.
 * @returns {JSX.Element} A spinner while loading, a login redirect when logged out, or the children.
 */
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    // Full-screen spinner shown only while the auth session is being restored.
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
        <div className="w-10 h-10 border-4 border-[#0057D9] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    // Unauthenticated users are bounced to /login (replace prevents back-navigation).
    return <Navigate to="/login" replace />
  }

  return children
}
