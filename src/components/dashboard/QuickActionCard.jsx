// Clickable card linking to a dashboard section, with a hover arrow affordance.
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

/**
 * QuickActionCard
 * @param {Object} props
 * @param {string} props.title - Card title.
 * @param {string} [props.description] - Supporting text.
 * @param {ComponentType} props.icon - Icon component.
 * @param {string} props.color - Tailwind classes for the icon chip.
 * @param {string} [props.to] - Route to navigate to; renders a button when omitted.
 * @param {number} [props.index] - Stagger index for the entrance animation.
 */
export default function QuickActionCard({ title, description, icon: Icon, color, to, index = 0 }) {
  const content = (
    <>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} mb-4`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-[#0B1E3D]">{title}</p>
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        </div>
        <span className="w-7 h-7 rounded-lg bg-[#F7F9FC] flex items-center justify-center text-gray-400 group-hover:bg-[#0057D9] group-hover:text-white transition-colors duration-200 flex-shrink-0">
          <ArrowUpRight className="w-4 h-4" />
        </span>
      </div>
    </>
  )

  const classes =
    "group bg-white rounded-2xl border border-gray-100 p-5 2xl:p-7 hover:border-[#0057D9]/20 hover:shadow-lg hover:shadow-[#0057D9]/8 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] block text-left w-full"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
      whileHover={{ y: -4 }}
    >
      {/* Link when a route is provided, otherwise a plain button */}
      {to ? (
        <Link to={to} className={classes}>
          {content}
        </Link>
      ) : (
        <button type="button" className={classes}>
          {content}
        </button>
      )}
    </motion.div>
  )
}
