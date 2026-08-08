// Dashboard "Recent Activity" card: renders a titled, animated list of recent activity entries.
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

/**
 * ActivityList
 * @param {Object} props
 * @param {string} [props.title] - Heading shown above the list (default "Recent Activity").
 * @param {Array} [props.items] - Activity entries: { icon, description, time, color }.
 */
export default function ActivityList({ title = "Recent Activity", items = [] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-heading font-semibold text-[#0B1E3D]">{title}</h3>
        <Link
          to="/dashboard/messages"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#0057D9] hover:text-[#004ab8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <ul className="space-y-1">
        {/* Stagger each row's entrance slightly for a cascading list effect */}
        {items.map((item, i) => (
          <motion.li
            key={item.description + i}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
            className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#F7F9FC] transition-colors"
          >
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
              <item.icon className="w-5 h-5" />
            </span>
            <p className="flex-1 min-w-0 text-sm font-medium text-[#1F2937] truncate">{item.description}</p>
            <span className="text-[11px] text-gray-400 flex-shrink-0">{item.time}</span>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}
