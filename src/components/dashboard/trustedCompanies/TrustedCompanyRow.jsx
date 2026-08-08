import { Pencil, Trash2, ExternalLink } from "lucide-react"
import StatusBadge from "../StatusBadge"

function LogoThumb({ company }) {
  if (company.logo_url) {
    return (
      <span className="w-16 h-12 rounded-lg border border-gray-100 bg-white flex items-center justify-center flex-shrink-0 overflow-hidden">
        <img src={company.logo_url} alt={company.name} className="max-w-full max-h-full object-contain" />
      </span>
    )
  }
  return (
    <span className="w-16 h-12 rounded-lg bg-[#F7F9FC] border border-gray-100 flex items-center justify-center flex-shrink-0">
      <span className="text-[#0057D9]/40 text-sm font-heading font-bold">{company.name.slice(0, 2).toUpperCase()}</span>
    </span>
  )
}

function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function TrustedCompanyRow({ company, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-[#F7F9FC] transition-colors">
      <td className="py-3.5 pl-4 pr-4 2xl:py-4 2xl:pl-6 2xl:pr-6">
        <div className="flex items-center gap-3">
          <LogoThumb company={company} />
          <div className="min-w-0">
            <span className="block font-medium text-[#0B1E3D] truncate max-w-[180px]">{company.name}</span>
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        {company.website_url ? (
          <a
            href={company.website_url}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 text-sm text-[#0057D9] hover:text-[#004ab8] transition-colors"
          >
            {company.website_url.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        ) : (
          <span className="text-sm text-gray-400">—</span>
        )}
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <StatusBadge status={company.status} />
      </td>
      <td className="py-3.5 pr-4 text-sm font-medium text-[#1F2937]">{company.display_order}</td>
      <td className="py-3.5 pr-4 text-sm text-gray-400 whitespace-nowrap">{formatDate(company.created_at)}</td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(company)}
            aria-label={`Edit ${company.name}`}
            className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(company)}
            aria-label={`Delete ${company.name}`}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
