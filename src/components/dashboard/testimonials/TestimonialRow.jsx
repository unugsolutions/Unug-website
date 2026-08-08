import { Eye, Pencil, Trash2 } from "lucide-react"
import StatusBadge from "../StatusBadge"
import FeaturedBadge from "../FeaturedBadge"
import RatingStars from "./RatingStars"

function ClientAvatar({ testimonial }) {
  if (testimonial.photo_url) {
    return (
      <img
        src={testimonial.photo_url}
        alt={testimonial.client_name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    )
  }
  return (
    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0057D9] to-[#FF8C00] text-white text-sm font-heading font-bold flex items-center justify-center flex-shrink-0">
      {testimonial.client_name[0]?.toUpperCase()}
    </span>
  )
}

function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function TestimonialRow({ testimonial, onView, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-[#F7F9FC] transition-colors">
      <td className="py-3.5 pl-4 pr-4 2xl:py-4 2xl:pl-6 2xl:pr-6">
        <div className="flex items-center gap-3">
          <ClientAvatar testimonial={testimonial} />
          <div className="min-w-0">
            <span className="block font-medium text-[#0B1E3D] truncate max-w-[180px]">{testimonial.client_name}</span>
            {testimonial.email && <span className="block text-xs text-gray-400 truncate max-w-[180px]">{testimonial.email}</span>}
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <span className="block text-sm text-[#1F2937] truncate max-w-[180px]">{testimonial.company}</span>
        {testimonial.position && <span className="block text-xs text-gray-400 truncate max-w-[180px]">{testimonial.position}</span>}
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <RatingStars value={testimonial.rating} size="sm" />
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <FeaturedBadge featured={testimonial.featured} />
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <StatusBadge status={testimonial.status} />
      </td>
      <td className="py-3.5 pr-4 text-sm text-gray-400 whitespace-nowrap">{formatDate(testimonial.created_at)}</td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onView(testimonial)}
            aria-label={`View ${testimonial.client_name}`}
            className="p-2 rounded-lg text-gray-400 hover:text-[#0057D9] hover:bg-[#0057D9]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(testimonial)}
            aria-label={`Edit ${testimonial.client_name}`}
            className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(testimonial)}
            aria-label={`Delete ${testimonial.client_name}`}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
