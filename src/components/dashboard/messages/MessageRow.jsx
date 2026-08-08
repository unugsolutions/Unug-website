import { Eye, Mail, MailOpen, Trash2 } from "lucide-react"
import StatusBadge from "./StatusBadge"
import PriorityBadge from "../quotes/PriorityBadge"

function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default function MessageRow({ message, onView, onToggleRead, onDelete }) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-[#F7F9FC] transition-colors">
      <td className="py-3.5 pl-4 pr-4 2xl:py-4 2xl:pl-6 2xl:pr-6">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0057D9] to-[#FF8C00] text-white text-xs font-heading font-bold flex items-center justify-center flex-shrink-0">
            {message.full_name[0]?.toUpperCase()}
          </span>
          <div className="min-w-0">
            <span className="flex items-center gap-1.5 text-sm font-semibold text-[#0B1E3D] truncate max-w-[130px]">
              {message.full_name}
              {!message.is_read && <span className="w-1.5 h-1.5 rounded-full bg-[#0057D9] flex-shrink-0" aria-label="Unread" />}
            </span>
            <span className="block text-xs text-gray-400 truncate max-w-[120px]">{message.email}</span>
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6 xl:hidden 2xl:table-cell">
        <span className="text-sm text-[#1F2937] truncate max-w-[100px] block">{message.company || "—"}</span>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <StatusBadge status={message.status} />
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6 xl:hidden 3xl:table-cell">
        <span className="text-sm text-gray-500 truncate max-w-[90px] block">{message.phone || "—"}</span>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6 xl:hidden 3xl:table-cell">
        <span className="text-sm text-gray-500 truncate max-w-[90px] block">{message.service || "—"}</span>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6 xl:hidden 2xl:table-cell">
        <PriorityBadge priority={message.priority} />
      </td>
      <td className="py-3.5 pr-4 text-sm text-gray-400 whitespace-nowrap">{formatDate(message.submitted_at)}</td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onToggleRead(message)}
            aria-label={message.is_read ? "Mark as unread" : "Mark as read"}
            className="p-2 rounded-lg text-gray-400 hover:text-[#0057D9] hover:bg-[#0057D9]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
          >
            {message.is_read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
          </button>
          <button
            type="button"
            onClick={() => onView(message)}
            aria-label={`View message from ${message.full_name}`}
            className="p-2 rounded-lg text-gray-400 hover:text-[#0057D9] hover:bg-[#0057D9]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(message)}
            aria-label={`Delete message from ${message.full_name}`}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
