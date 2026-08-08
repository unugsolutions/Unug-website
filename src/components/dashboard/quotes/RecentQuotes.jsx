// "Recent Demo Requests" card on the dashboard overview, linking through to the full quotes page.
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowRight, FileText, AlertTriangle, Plus } from "lucide-react"
import QuoteStatusBadge from "./QuoteStatusBadge"

// Shows a time for today's submissions and a short date for older ones.
function formatDate(value) {
  if (!value) return ""
  const d = new Date(value)
  const today = new Date()
  const isToday = d.toDateString() === today.toDateString()
  return isToday
    ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

export default function RecentQuotes({ quotes = [], loading, error, onRetry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 p-6"
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-base font-heading font-semibold text-[#0B1E3D]">Recent Demo Requests</h3>
        <Link
          to="/dashboard/quotes"
          className="inline-flex items-center gap-1 text-xs font-medium text-[#0057D9] hover:text-[#004ab8] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
              <div className="w-8 h-8 rounded-full bg-gray-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-1/3" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
              <div className="h-5 w-16 bg-gray-100 rounded-full" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="py-8 text-center">
          <AlertTriangle className="w-7 h-7 text-amber-500 mx-auto mb-3" />
          <p className="text-sm text-gray-400 mb-4">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#0057D9] text-white rounded-xl hover:bg-[#004ab8] transition-all duration-200"
          >
            <Plus className="w-3.5 h-3.5" />
            Try again
          </button>
        </div>
      ) : quotes.length === 0 ? (
        <div className="py-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F9FC] flex items-center justify-center mx-auto mb-3">
            <FileText className="w-6 h-6 text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">No demo requests yet.</p>
        </div>
      ) : (
        <ul className="divide-y divide-gray-50">
          {quotes.map((q, i) => (
            <motion.li
              key={q.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.08 + i * 0.05 }}
            >
              <Link to="/dashboard/quotes" className="flex items-center gap-3 py-2.5 group">
                <span className="w-8 h-8 rounded-full bg-[#0057D9]/10 text-[#0057D9] text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {q.full_name[0]?.toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[#0057D9]">{q.reference_number}</span>
                  </div>
                  <p className="text-sm font-medium text-[#1F2937] truncate">
                    {q.full_name} · {q.service}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <QuoteStatusBadge status={q.status} />
                  <p className="text-[10px] text-gray-400 mt-1">{formatDate(q.submitted_at)}</p>
                </div>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}
