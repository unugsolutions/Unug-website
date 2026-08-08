import { Eye, Trash2 } from "lucide-react"
import QuoteStatusBadge from "./QuoteStatusBadge"
import PriorityBadge from "./PriorityBadge"

// Formats the submission timestamp as a short date (e.g. "Aug 5, 2026").
function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Single table row in the demo requests table: client, service, timeline, status, priority, and actions.
export default function QuoteRow({ quote, onView, onDelete }) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-[#F7F9FC] transition-colors">
      <td className="py-3.5 pl-4 pr-4 2xl:py-4 2xl:pl-6 2xl:pr-6">
        <span className="text-xs font-semibold text-[#0057D9] bg-[#0057D9]/10 px-2.5 py-1 rounded-lg whitespace-nowrap">
          {quote.reference_number}
        </span>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0057D9] to-[#FF8C00] text-white text-xs font-heading font-bold flex items-center justify-center flex-shrink-0">
            {quote.full_name[0]?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <span className="block text-sm font-semibold text-[#0B1E3D] truncate max-w-[120px]">{quote.full_name}</span>
            <span className="block text-xs text-gray-400 truncate max-w-[120px]">{quote.email}</span>
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6 xl:hidden 2xl:table-cell">
        <span className="text-sm text-[#1F2937] truncate max-w-[100px] block">{quote.company || "—"}</span>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6 xl:hidden 2xl:table-cell">
        <span className="text-sm text-gray-500 truncate max-w-[100px] block">{quote.service}</span>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6 xl:hidden 3xl:table-cell">
        <span className="text-sm text-gray-500 truncate max-w-[90px] block">{quote.timeline || "—"}</span>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <QuoteStatusBadge status={quote.status} />
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6 xl:hidden 2xl:table-cell">
        <PriorityBadge priority={quote.priority} />
      </td>
      <td className="py-3.5 pr-4 text-sm text-gray-400 whitespace-nowrap">{formatDate(quote.submitted_at)}</td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onView(quote)}
            aria-label={`View demo request ${quote.reference_number}`}
            className="p-2 rounded-lg text-gray-400 hover:text-[#0057D9] hover:bg-[#0057D9]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(quote)}
            aria-label={`Delete demo request ${quote.reference_number}`}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
