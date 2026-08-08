// Single sidebar navigation link with an animated active highlight and a collapsed-mode tooltip.
import { NavLink } from "react-router-dom"
import { motion } from "framer-motion"

/**
 * SidebarItem
 * @param {Object} props
 * @param {Object} props.item - Nav item: { to, label, icon, end }.
 * @param {boolean} [props.collapsed] - When true, shows icon-only with a hover tooltip.
 */
export default function SidebarItem({ item, collapsed = false }) {
  const { to, label, icon: Icon, end = false } = item

  return (
    <NavLink
      to={to}
      end={end}
      aria-label={label}
      className={({ isActive }) =>
        `group relative flex items-center gap-3 h-11 rounded-xl transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8C00] ${
          collapsed ? "justify-center w-11 mx-auto" : "px-3.5"
        } ${isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/5"}`
      }
    >
      {({ isActive }) => (
        <>
          {/* Shared layoutId animates the active highlight between items */}
          {isActive && (
            <motion.span
              layoutId="sidebar-active-bg"
              className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#0057D9] to-[#1D6AF0] shadow-lg shadow-[#0057D9]/30"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}

          {isActive && (
            <motion.span
              layoutId="sidebar-active-bar"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 rounded-r-full bg-white/90"
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
            />
          )}

          <span className={`relative flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
            <Icon
              className={`w-[18px] h-[18px] flex-shrink-0 transition-colors duration-200 ${
                isActive ? "text-white" : "text-white/70 group-hover:text-white"
              }`}
            />
            {!collapsed && <span className="text-[13.5px] font-medium whitespace-nowrap">{label}</span>}
          </span>

          {/* Hover tooltip with the label when the sidebar is collapsed to icons */}
          {collapsed && (
            <span
              role="tooltip"
              className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#0B1E3D] text-white text-xs font-medium whitespace-nowrap opacity-0 translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 z-50 shadow-xl shadow-black/20 border border-white/10"
            >
              {label}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}
