// KPI stat card showing a value, an optional trend pill, and an optional link destination.
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { TrendingUp, TrendingDown } from "lucide-react"

/**
 * StatCard
 * @param {Object} props
 * @param {string} props.title - Statistic label.
 * @param {string|number} props.value - Statistic value.
 * @param {ComponentType} props.icon - Icon component.
 * @param {string} props.iconClass - Tailwind classes for the icon chip.
 * @param {Object} [props.trend] - Trend info: { up: boolean, value: string }.
 * @param {string} [props.description] - Optional helper text.
 * @param {number} [props.index] - Stagger index for the entrance animation.
 * @param {string} [props.to] - Optional route; the card becomes a link when set.
 */
export default function StatCard({ title, value, icon: Icon, iconClass, trend, description, index = 0, to }) {
  const content = (
    <>
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconClass}`}>
          <Icon className="w-5 h-5" />
        </div>

        {/* Up/down trend pill, green when improving and red when declining */}
        {trend && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
              trend.up ? "text-emerald-600 bg-emerald-500/10" : "text-red-500 bg-red-500/10"
            }`}
          >
            {trend.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {trend.value}
          </span>
        )}
      </div>

      <p className="mt-4 text-3xl 2xl:text-4xl font-heading font-bold text-[#0B1E3D] tracking-tight">{value}</p>
      <p className="mt-0.5 text-sm font-semibold text-[#1F2937]">{title}</p>
      {description && <p className="mt-1 text-xs text-gray-400">{description}</p>}
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -4, boxShadow: "0 16px 40px rgba(11, 30, 61, 0.10)" }}
      className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 2xl:p-8 transition-shadow duration-300"
    >
      {/* Wrap in a link when a route is provided */}
      {to ? (
        <Link to={to} className="block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded-lg">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  )
}
