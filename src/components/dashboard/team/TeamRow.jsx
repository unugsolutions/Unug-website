import { Eye, Pencil, Trash2 } from "lucide-react"
import StatusBadge from "./StatusBadge"
import FeaturedBadge from "./FeaturedBadge"

function MemberAvatar({ member }) {
  const initials = `${member.first_name?.[0] ?? ""}${member.last_name?.[0] ?? ""}`.toUpperCase() || "?"
  if (member.photo_url) {
    return (
      <img
        src={member.photo_url}
        alt={member.full_name}
        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
      />
    )
  }
  return (
    <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#0057D9] to-[#FF8C00] text-white text-sm font-heading font-bold flex items-center justify-center flex-shrink-0">
      {initials}
    </span>
  )
}

function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function TeamRow({ member, onView, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-50 last:border-0 hover:bg-[#F7F9FC] transition-colors">
      <td className="py-3.5 pl-4 pr-4 2xl:py-4 2xl:pl-6 2xl:pr-6">
        <div className="flex items-center gap-3">
          <MemberAvatar member={member} />
          <div className="min-w-0">
            <span className="block font-medium text-[#0B1E3D] truncate max-w-[180px]">{member.full_name}</span>
            {member.email && <span className="block text-xs text-gray-400 truncate max-w-[180px]">{member.email}</span>}
          </div>
        </div>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <span className="block text-sm text-[#1F2937] truncate max-w-[180px]">{member.position}</span>
        {member.years_experience > 0 && (
          <span className="block text-xs text-gray-400 truncate max-w-[180px]">{member.years_experience} yrs exp.</span>
        )}
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <span className="inline-flex text-xs font-medium text-[#0B1E3D] bg-[#F7F9FC] px-2.5 py-1 rounded-lg">
          {member.department || "—"}
        </span>
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <FeaturedBadge featured={member.featured} />
      </td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <StatusBadge status={member.status} />
      </td>
      <td className="py-3.5 pr-4 text-sm text-gray-400 whitespace-nowrap">{formatDate(member.joined_date)}</td>
      <td className="py-3.5 pr-4 2xl:py-4 2xl:pr-6">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onView(member)}
            aria-label={`View ${member.full_name}`}
            className="p-2 rounded-lg text-gray-400 hover:text-[#0057D9] hover:bg-[#0057D9]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(member)}
            aria-label={`Edit ${member.full_name}`}
            className="p-2 rounded-lg text-gray-400 hover:text-violet-600 hover:bg-violet-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(member)}
            aria-label={`Delete ${member.full_name}`}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
