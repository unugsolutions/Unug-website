// Brand logo + name block at the top of the sidebar; hides the text when collapsed.
import { motion } from "framer-motion"

/**
 * SidebarLogo
 * @param {Object} props
 * @param {boolean} [props.collapsed] - When true, only the logo image is shown.
 */
export default function SidebarLogo({ collapsed }) {
  return (
    <div className={`flex items-center gap-3 flex-shrink-0 ${collapsed ? "justify-center" : "min-w-0"}`}>
      <img src="/mainlogo.svg" alt="UNUG Solutions logo" className="w-9 h-9 flex-shrink-0" />
      {!collapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col leading-tight min-w-0"
        >
          <span className="font-heading text-[15px] font-bold text-white whitespace-nowrap tracking-tight">
            UNUG Solutions
          </span>
          <span className="text-[10px] text-white/50 whitespace-nowrap truncate">
            Engineering Digital Solutions
          </span>
        </motion.div>
      )}
    </div>
  )
}
