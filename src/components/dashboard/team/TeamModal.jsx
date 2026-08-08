import { BriefcaseBusiness, Calendar, Award, Mail, Phone, Globe, Star } from "lucide-react"
import InfoRow from "../InfoRow"
import StatusBadge from "./StatusBadge"
import FeaturedBadge from "./FeaturedBadge"
import { SOCIAL_ICONS } from "../../../lib/socialIcons"

const SOCIAL_FIELDS = [
  { key: "linkedin_url", iconKey: "linkedin", label: "LinkedIn" },
  { key: "github_url", iconKey: "github", label: "GitHub" },
  { key: "facebook_url", iconKey: "facebook", label: "Facebook" },
  { key: "instagram_url", iconKey: "instagram", label: "Instagram" },
  { key: "x_url", iconKey: "x", label: "X (Twitter)" },
]

function MemberAvatar({ member, className = "w-20 h-20 text-2xl" }) {
  const initials = `${member.first_name?.[0] ?? ""}${member.last_name?.[0] ?? ""}`.toUpperCase() || "?"
  if (member.photo_url) {
    return (
      <img
        src={member.photo_url}
        alt={member.full_name}
        className={`${className} rounded-2xl object-cover flex-shrink-0`}
      />
    )
  }
  return (
    <span className={`${className} rounded-2xl bg-gradient-to-br from-[#0057D9] to-[#FF8C00] text-white font-heading font-bold flex items-center justify-center flex-shrink-0`}>
      {initials}
    </span>
  )
}

function SocialButton({ href, label, path }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-9 h-9 rounded-xl bg-[#F7F9FC] flex items-center justify-center text-[#0057D9] hover:bg-[#0057D9]/10 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
    >
      <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
        <path d={path} />
      </svg>
    </a>
  )
}

export default function TeamModal({ member }) {
  if (!member) return null

  const iconByKey = Object.fromEntries(SOCIAL_ICONS.map((i) => [i.key, i]))
  const socials = SOCIAL_FIELDS.filter((s) => member[s.key] && member[s.key] !== "#").map((s) => ({
    ...s,
    path: iconByKey[s.iconKey]?.path ?? "",
  }))
  const skills = Array.isArray(member.skills) ? member.skills : []

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <MemberAvatar member={member} />
        <div>
          <h4 className="text-lg font-heading font-bold text-[#0B1E3D]">{member.full_name}</h4>
          <p className="text-sm text-gray-400">
            {member.position}
            {member.department ? ` · ${member.department}` : ""}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={member.status} />
        <FeaturedBadge featured={member.featured} />
      </div>

      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div>
          <dt className="text-gray-400 mb-1">Experience</dt>
          <dd className="font-medium text-[#0B1E3D] flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#0057D9]" />
            {member.years_experience > 0 ? `${member.years_experience} years` : "—"}
          </dd>
        </div>
        <div>
          <dt className="text-gray-400 mb-1">Joined</dt>
          <dd className="font-medium text-[#0B1E3D] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#0057D9]" />
            {member.joined_date
              ? new Date(member.joined_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
              : "—"}
          </dd>
        </div>
      </dl>

      {member.bio && (
        <div>
          <p className="text-gray-400 text-sm mb-1">Biography</p>
          <p className="text-sm text-[#1F2937] leading-relaxed bg-[#F7F9FC] rounded-xl p-4">{member.bio}</p>
        </div>
      )}

      {skills.length > 0 && (
        <div>
          <p className="text-gray-400 text-sm mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0057D9] bg-[#0057D9]/10 px-2.5 py-1.5 rounded-lg"
              >
                <Star className="w-3 h-3 fill-[#0057D9]/20" />
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {(member.email || member.phone || member.website_url) && (
        <div className="space-y-3 pt-2 border-t border-gray-100">
          {member.email && <InfoRow icon={Mail} label="Email" value={member.email} href={`mailto:${member.email}`} />}
          {member.phone && <InfoRow icon={Phone} label="Phone" value={member.phone} href={`tel:${member.phone}`} />}
          {member.website_url && (
            <InfoRow icon={Globe} label="Website" value={member.website_url} href={member.website_url} />
          )}
        </div>
      )}

      {socials.length > 0 && (
        <div className="pt-2 border-t border-gray-100">
          <p className="text-gray-400 text-sm mb-3">Social Links</p>
          <div className="flex flex-wrap items-center gap-2">
            {socials.map((s) => (
              <SocialButton key={s.key} href={member[s.key]} label={s.label} path={s.path} />
            ))}
          </div>
        </div>
      )}

      {!member.bio && skills.length === 0 && !member.email && !member.phone && !member.website_url && socials.length === 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <BriefcaseBusiness className="w-4 h-4" />
          No additional details provided for this member yet.
        </div>
      )}
    </div>
  )
}
