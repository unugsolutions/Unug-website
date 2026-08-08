// Reusable empty-state placeholder shown when a list or section has no content.
import { motion } from "framer-motion"
import { Inbox } from "lucide-react"

/**
 * EmptyState
 * @param {Object} props
 * @param {ComponentType} [props.icon] - Icon rendered above the message (default Inbox).
 * @param {string} [props.title] - Main empty-state heading.
 * @param {string} [props.description] - Optional supporting text.
 * @param {Object} [props.action] - Optional CTA: { label, icon, onClick }.
 */
export default function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center text-center py-16 px-6"
    >
      <div className="w-14 h-14 rounded-2xl bg-[#F7F9FC] flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-gray-300" />
      </div>
      <h3 className="text-base font-heading font-semibold text-[#0B1E3D]">{title}</h3>
      {description && <p className="text-sm text-gray-400 mt-1 max-w-sm">{description}</p>}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold bg-[#0057D9] text-white rounded-xl hover:bg-[#004ab8] shadow-lg shadow-[#0057D9]/20 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
        >
          {action.icon && <action.icon className="w-4 h-4" />}
          {action.label}
        </button>
      )}
    </motion.div>
  )
}
