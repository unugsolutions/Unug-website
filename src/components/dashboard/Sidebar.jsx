// Main navigation sidebar: collapsible on desktop and rendered as an animated drawer on mobile.
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"
import { sidebarNavItems } from "./sidebarNavItems"
import SidebarLogo from "./SidebarLogo"
import SidebarToggle from "./SidebarToggle"
import SidebarItem from "./SidebarItem"
import SidebarFooter from "./SidebarFooter"

// Shared inner layout used by both the desktop sidebar and the mobile drawer
function SidebarContent({ collapsed, onToggleCollapse, showToggle = true }) {
  return (
    <>
      <div
        className={`flex flex-shrink-0 ${
          collapsed
            ? "flex-col items-center gap-2.5 py-3.5"
            : "flex-row items-center justify-between h-16 px-3"
        }`}
      >
        <SidebarLogo collapsed={collapsed} />
        {showToggle && <SidebarToggle collapsed={collapsed} onClick={onToggleCollapse} />}
      </div>

      <div className="mx-3 mb-4 h-px bg-white/10" />

      <nav
        aria-label="Dashboard navigation"
        className="flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-2.5 pb-4"
      >
        {sidebarNavItems.map((item) => (
          <SidebarItem key={item.to} item={item} collapsed={collapsed} />
        ))}
      </nav>

      <SidebarFooter collapsed={collapsed} />
    </>
  )
}

/**
 * Sidebar
 * @param {Object} props
 * @param {boolean} props.collapsed - Whether the desktop sidebar is collapsed to icons only.
 * @param {Function} props.onToggleCollapse - Callback to toggle the collapsed state.
 * @param {boolean} props.mobileOpen - Whether the mobile drawer is open.
 * @param {Function} props.onClose - Callback to close the mobile drawer.
 */
export default function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onClose }) {
  return (
    <>
      {/* Desktop sidebar: fixed on lg+ screens, animates its width when collapsed */}
      <motion.aside
        animate={{ width: collapsed ? 80 : 280 }}
        transition={{ type: "spring", stiffness: 300, damping: 32 }}
        aria-label="Sidebar"
        className="hidden lg:flex fixed inset-y-0 left-0 z-40 flex-col bg-[#0B1E3D] overflow-hidden"
      >
        <SidebarContent collapsed={collapsed} onToggleCollapse={onToggleCollapse} />
      </motion.aside>

      <AnimatePresence>
        {mobileOpen && (
          <div
            className="lg:hidden fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="absolute inset-0 bg-[#0B1E3D]/50 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
              className="absolute inset-y-0 left-0 w-[280px] bg-[#0B1E3D] flex flex-col shadow-2xl"
            >
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close menu"
                  className="inline-flex items-center justify-center w-7 h-7 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8C00]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <SidebarContent collapsed={false} onToggleCollapse={() => {}} showToggle={false} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
