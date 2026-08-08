import { Eye, Pencil, Trash2 } from "lucide-react"
import StatusBadge from "../StatusBadge"
import FeaturedBadge from "../FeaturedBadge"

const gradients = [
  "from-[#0B1E3D] to-[#0057D9]",
  "from-[#0057D9] to-[#FF8C00]",
  "from-[#0B1E3D] to-[#FF8C00]",
  "from-[#0057D9] to-[#3B82F6]",
]

function CoverThumb({ project }) {
  if (project.cover_image_url) {
    return (
      <img
        src={project.cover_image_url}
        alt={project.title}
        className="w-16 h-12 rounded-lg object-cover flex-shrink-0"
      />
    )
  }
  const gradient = gradients[project.title.length % gradients.length]
  return (
    <span
      className={`w-16 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0`}
    >
      <span className="text-white/40 text-lg font-heading font-bold">{project.title[0]}</span>
    </span>
  )
}

function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function PortfolioRow({ project, onView, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-[#F7F9FC] transition-colors">
      <td className="py-3.5 pl-4 pr-4 2xl:py-4 2xl:pl-6 2xl:pr-6">
        <div className="flex items-center gap-3">
          <CoverThumb project={project} />
          <div className="min-w-0">
            <span className="block font-medium text-[#0B1E3D] truncate max-w-[200px]">{project.title}</span>
            {project.client && <span className="block text-xs text-gray-400 truncate max-w-[200px]">{project.client}</span>}
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <span className="text-sm text-gray-500 bg-[#F7F9FC] px-2.5 py-1 rounded-full whitespace-nowrap">
          {project.category}
        </span>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <StatusBadge status={project.status} />
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <FeaturedBadge featured={project.featured} />
      </td>
      <td className="py-3.5 pr-4 text-sm font-medium text-[#1F2937]">{project.display_order}</td>
      <td className="py-3.5 pr-4 text-sm text-gray-400 whitespace-nowrap">{formatDate(project.created_at)}</td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onView(project)}
            aria-label={`View ${project.title}`}
            className="p-2 rounded-lg text-gray-400 hover:text-[#0057D9] hover:bg-[#0057D9]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(project)}
            aria-label={`Edit ${project.title}`}
            className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(project)}
            aria-label={`Delete ${project.title}`}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
