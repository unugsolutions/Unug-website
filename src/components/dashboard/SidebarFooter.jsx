// Sidebar footer with the administrator identity and logout action; adapts to collapsed state.
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { LogOut } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

/**
 * SidebarFooter
 * @param {Object} props
 * @param {boolean} [props.collapsed] - When true, shows a compact icon-only layout.
 */
export default function SidebarFooter({ collapsed }) {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  // Sign out, then redirect to the login page
  const handleLogout = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully")
      navigate("/login", { replace: true })
    } catch (err) {
      toast.error(err.message || "Unable to sign out")
    }
  }

  return (
    <div className="flex-shrink-0 border-t border-white/10 p-3">
      <div className={`flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
        <span
          className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF8C00] to-[#ffb14d] text-[#0B1E3D] text-xs font-bold flex items-center justify-center flex-shrink-0"
          aria-hidden="true"
        >
          A
        </span>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white truncate">Administrator</p>
            <p className="text-[11px] text-white/50 truncate">administrator@unugsolutions.online</p>
          </div>
        )}

        {!collapsed && (
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8C00]"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>

      {collapsed && (
        <button
          type="button"
          onClick={handleLogout}
          aria-label="Logout"
          className="mt-3 w-9 h-9 mx-auto flex items-center justify-center rounded-lg text-white/50 hover:text-red-400 hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8C00]"
        >
          <LogOut className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}
