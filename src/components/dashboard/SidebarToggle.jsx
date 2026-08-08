// Collapse/expand toggle for the sidebar; the chevron direction follows the state.
import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * SidebarToggle
 * @param {Object} props
 * @param {boolean} props.collapsed - Current collapsed state (controls icon and aria-label).
 * @param {Function} props.onClick - Callback fired when the toggle is clicked.
 */
export default function SidebarToggle({ collapsed, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      aria-expanded={!collapsed}
      className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8C00]"
    >
      {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
    </button>
  )
}
