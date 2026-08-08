import { Star } from "lucide-react"
import { SOCIAL_ICONS } from "../lib/socialIcons"

// Team member card: photo (or initials), role, bio, skills, and social links.

// Social platforms read from the member object, mapped to their icon keys.
const SOCIAL_FIELDS = [
  { key: "linkedin_url", iconKey: "linkedin", label: "LinkedIn" },
  { key: "github_url", iconKey: "github", label: "GitHub" },
  { key: "facebook_url", iconKey: "facebook", label: "Facebook" },
  { key: "instagram_url", iconKey: "instagram", label: "Instagram" },
  { key: "x_url", iconKey: "x", label: "X (Twitter)" },
]

/**
 * Renders the member's photo, or initials on a gradient when no photo exists.
 * @param {object} props - TeamAvatar props.
 * @param {object} props.member - Team member object (first_name, last_name, photo_url, full_name).
 * @returns {JSX.Element} An image or initials block.
 */
function TeamAvatar({ member }) {
  // Build initials from first/last name, falling back to "?" if neither exists.
  const initials = `${member.first_name?.[0] ?? ""}${member.last_name?.[0] ?? ""}`.toUpperCase() || "?"
  if (member.photo_url) {
    return (
      <div className="aspect-[4/5] overflow-hidden">
        <img src={member.photo_url} alt={member.full_name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
      </div>
    )
  }
  return (
    <div className="aspect-[4/5] bg-gradient-to-br from-primary to-royal flex items-center justify-center">
      <span className="text-5xl font-heading font-bold text-white/90">{initials}</span>
    </div>
  )
}

/**
 * Renders a single team member card.
 * @param {object} props - TeamCard props.
 * @param {object} props.member - Member object (full_name, position, department, bio, skills, socials, featured).
 * @returns {JSX.Element} The team card.
 */
export default function TeamCard({ member }) {
  const iconByKey = Object.fromEntries(SOCIAL_ICONS.map((i) => [i.key, i]))
  // Only include socials that have a real URL (ignores empty or "#" values).
  const socials = SOCIAL_FIELDS.filter((s) => member[s.key] && member[s.key] !== "#").map((s) => ({
    ...s,
    path: iconByKey[s.iconKey]?.path ?? "",
  }))
  const skills = Array.isArray(member.skills) ? member.skills : []

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]/60 hover:shadow-xl hover:border-[#2563EB]/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <div className="relative">
        <TeamAvatar member={member} />
        {member.featured && (
          <span className="absolute top-3 right-3 inline-flex items-center gap-1 text-[10px] font-bold text-white bg-[#FF8C00] px-2 py-1 rounded-full shadow">
            <Star className="w-3 h-3 fill-white" />
            LEADERSHIP
          </span>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-base font-heading font-bold text-navy">{member.full_name}</h3>
        <p className="text-sm font-medium text-primary mt-0.5">{member.position}</p>
        {member.department && <p className="text-xs text-gray-400 mt-0.5">{member.department}</p>}

        {member.bio && (
          <p className="text-sm text-gray-500 leading-relaxed mt-3 line-clamp-3 flex-1">{member.bio}</p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {/* Show up to 5 skills, then a "+N" badge for the remainder. */}
            {skills.slice(0, 5).map((skill) => (
              <span
                key={skill}
                className="text-[11px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-1 rounded-md"
              >
                {skill}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="text-[11px] font-semibold text-[#64748B] bg-[#F1F5F9] px-2 py-1 rounded-md">
                +{skills.length - 5}
              </span>
            )}
          </div>
        )}

        {socials.length > 0 && (
          <div className="flex items-center gap-2 mt-5 pt-4 border-t border-gray-100">
            {socials.map((s) => (
              <a
                key={s.key}
                href={member[s.key]}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${member.full_name} on ${s.label}`}
                className="w-8 h-8 rounded-lg bg-[#F1F5F9] flex items-center justify-center text-[#64748B] hover:bg-primary hover:text-white transition-colors"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d={s.path} />
                </svg>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
