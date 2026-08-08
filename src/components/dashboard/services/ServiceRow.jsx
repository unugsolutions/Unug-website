import { CheckCircle, Circle, Eye, Pencil, Trash2 } from "lucide-react"
import { getServiceIcon } from "../../../lib/serviceIcons"
import StatusBadge from "../StatusBadge"

function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function ServiceRow({ service, onView, onEdit, onDelete }) {
  const Icon = getServiceIcon(service.icon)

  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-[#F7F9FC] transition-colors">
      <td className="py-3.5 pl-4 pr-4 2xl:py-4 2xl:pl-6 2xl:pr-6">
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-[#0057D9]/10 text-[#0057D9] flex items-center justify-center flex-shrink-0">
            <Icon className="w-[18px] h-[18px]" />
          </span>
          <span className="font-medium text-[#0B1E3D] truncate max-w-[180px]">{service.title}</span>
        </div>
      </td>
      <td className="py-3.5 pr-4 text-sm text-gray-400 font-mono truncate max-w-[160px]">{service.slug}</td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <StatusBadge status={service.status} />
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <span className="inline-flex items-center gap-1.5 text-sm">
          {service.featured ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 font-medium text-xs">Featured</span>
            </>
          ) : (
            <>
              <Circle className="w-4 h-4 text-gray-300" />
              <span className="text-gray-400 text-xs">No</span>
            </>
          )}
        </span>
      </td>
      <td className="py-3.5 pr-4 text-sm font-medium text-[#1F2937]">{service.display_order}</td>
      <td className="py-3.5 pr-4 text-sm text-gray-400 whitespace-nowrap">{formatDate(service.created_at)}</td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onView(service)}
            aria-label={`View ${service.title}`}
            className="p-2 rounded-lg text-gray-400 hover:text-[#0057D9] hover:bg-[#0057D9]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(service)}
            aria-label={`Edit ${service.title}`}
            className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(service)}
            aria-label={`Delete ${service.title}`}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
