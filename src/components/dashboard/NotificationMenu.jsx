// Notification bell + dropdown: lists recent messages/demo requests, tracks unread count, and links onward.
import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Bell, MessageSquare, FileText, CheckCheck, Inbox } from "lucide-react"
import { useNotifications } from "../../hooks/useNotifications"

// Per-type presentation (icon, color, title) and destination route for notification items
const typeConfig = {
  message: {
    icon: MessageSquare,
    color: "bg-[#0057D9]/10 text-[#0057D9]",
    title: "New contact message",
    href: "/dashboard/messages",
  },
  quote: {
    icon: FileText,
    color: "bg-[#FF8C00]/10 text-[#FF8C00]",
    title: "New demo request",
    href: "/dashboard/quotes",
  },
}

/**
 * Formats a timestamp as a human-readable relative string ("5 min ago", "2 days ago", etc.).
 * @param {string|number|Date} value - Notification timestamp.
 * @returns {string} Relative time label, or "" when value is empty.
 */
function formatRelativeTime(value) {
  if (!value) return ""
  const date = new Date(value)
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hr${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

/**
 * NotificationMenu
 * Renders the bell button with an unread-count badge and a dropdown listing notifications.
 */
export default function NotificationMenu() {
  const { notifications, loading, unreadCount, markRead, markAllRead } = useNotifications()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    if (!open) return
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

  const handleOpen = (item) => {
    const config = typeConfig[item.type]
    markRead(item.id)
    setOpen(false)
    if (config) navigate(config.href)
  }

  const handleViewAll = () => {
    setOpen(false)
    navigate("/dashboard/messages")
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Notifications"
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative w-10 h-10 rounded-xl bg-[#F7F9FC] border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0B1E3D] hover:border-[#0057D9]/30 hover:bg-white transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#FF8C00] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="menu"
            aria-label="Notifications"
            className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl border border-gray-100 shadow-xl shadow-[#0B1E3D]/8 overflow-hidden z-50"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-heading font-semibold text-[#0B1E3D]">Notifications</p>
              <button
                type="button"
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#0057D9] hover:text-[#004ab8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded disabled:opacity-50"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Mark all read
              </button>
            </div>

            <ul className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="animate-pulse space-y-3 p-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-100" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3 bg-gray-100 rounded w-2/3" />
                        <div className="h-2.5 bg-gray-100 rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : notifications.length === 0 ? (
                <li>
                  <div className="py-10 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-[#F7F9FC] flex items-center justify-center mx-auto mb-3">
                      <Inbox className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-sm text-gray-400">No notifications yet.</p>
                  </div>
                </li>
              ) : (
                notifications.slice(0, 12).map((n) => {
                  const config = typeConfig[n.type] ?? typeConfig.message
                  return (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => handleOpen(n)}
                        className="w-full flex items-start gap-3 px-4 py-3 hover:bg-[#F7F9FC] transition-colors text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
                      >
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
                          <config.icon className="w-4 h-4" />
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="flex items-center gap-2">
                            <span className={`text-sm truncate ${n.read ? "font-medium text-[#1F2937]" : "font-semibold text-[#0B1E3D]"}`}>
                              {config.title}
                            </span>
                            {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-[#0057D9] flex-shrink-0" aria-label="Unread" />}
                          </span>
                          <span className="block text-xs text-gray-400 mt-0.5 truncate">
                            from {n.fullName} · {formatRelativeTime(n.time)}
                          </span>
                        </span>
                      </button>
                    </li>
                  )
                })
              )}
            </ul>

            <div className="border-t border-gray-100 p-2">
              <button
                type="button"
                onClick={handleViewAll}
                className="w-full text-center text-sm font-medium text-[#0057D9] hover:text-[#004ab8] py-1.5 rounded-lg hover:bg-[#0057D9]/5 transition-colors"
              >
                View all notifications
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
