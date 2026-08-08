// Account menu in the top navbar: avatar, email, profile/settings links, and logout.
import { useRef, useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import toast from "react-hot-toast"
import { ChevronDown, UserCircle, Settings, LogOut } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"

// Static links shown inside the account dropdown
const menuItems = [
  { to: "/dashboard/profile", label: "Profile", icon: UserCircle },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
]

export default function UserMenu() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
    // Close the dropdown on outside click or Escape
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("mousedown", onDown)
    document.addEventListener("keydown", onKey)
    return () => {
      document.removeEventListener("mousedown", onDown)
      document.removeEventListener("keydown", onKey)
    }
  }, [open])

  // Sign out and redirect to the login page
  const handleLogout = async () => {
    setOpen(false)
    try {
      await signOut()
      toast.success("Signed out successfully")
      navigate("/login", { replace: true })
    } catch (err) {
      toast.error(err.message || "Unable to sign out")
    }
  }

  const email = user?.email ?? "administrator@unugsolutions.online"
  const initials = email[0]?.toUpperCase() ?? "A"

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-[#F7F9FC] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
      >
        <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0057D9] to-[#0B1E3D] text-white text-xs font-bold flex items-center justify-center">
          {initials}
        </span>
        <span className="hidden xl:flex flex-col items-start leading-tight">
          <span className="text-sm font-semibold text-[#0B1E3D]">Administrator</span>
          <span className="text-[11px] text-gray-400 max-w-[140px] truncate">{email}</span>
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 hidden xl:block transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="menu"
            aria-label="Account"
            className="absolute right-0 mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-[#0B1E3D]/8 overflow-hidden z-50"
          >
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-heading font-semibold text-[#0B1E3D]">Administrator</p>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{email}</p>
            </div>

            <div className="p-2">
              {menuItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  role="menuitem"
                  className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#1F2937] rounded-lg hover:bg-[#F7F9FC] hover:text-[#0057D9] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
                >
                  <item.icon className="w-4 h-4 text-gray-400" />
                  {item.label}
                </Link>
              ))}

              <div className="my-1.5 border-t border-gray-100" />

              <button
                type="button"
                onClick={handleLogout}
                role="menuitem"
                className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-500 rounded-lg hover:bg-red-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
