// Header for the dashboard overview: title, subtitle, today's date, and a refresh button.
import { motion } from "framer-motion"
import { Calendar, RefreshCw } from "lucide-react"

/**
 * DashboardHeader
 * @param {Object} props
 * @param {Function} props.onRefresh - Callback fired when the refresh button is clicked.
 */
export default function DashboardHeader({ onRefresh }) {
  // Format today's date for display in the header
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 2xl:mb-10"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl 2xl:text-4xl font-heading font-bold text-[#0B1E3D] tracking-tight">Dashboard</h1>
        <p className="mt-1.5 text-sm text-gray-500">Welcome back! Here's an overview of your website.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 whitespace-nowrap">
          <Calendar className="w-4 h-4 text-[#0057D9]" />
          {today}
        </span>
        <button
          type="button"
          onClick={onRefresh}
          aria-label="Refresh data"
          className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-[#0B1E3D] hover:border-[#0057D9]/30 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}
