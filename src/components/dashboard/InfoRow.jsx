// Renders an icon + label + value row, with the value shown as a link when a href is given.

/**
 * InfoRow
 * @param {Object} props
 * @param {ComponentType} props.icon - Icon component for the row.
 * @param {string} props.label - Small label above the value.
 * @param {string} [props.value] - Value text ("—" placeholder when empty).
 * @param {string} [props.href] - Optional URL; the value becomes a link when set.
 */
export default function InfoRow({ icon: Icon, label, value, href }) {
  return (
    <div className="flex items-start gap-3">
      <span className="w-9 h-9 rounded-xl bg-[#F7F9FC] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#0057D9]" />
      </span>
      <div className="min-w-0">
        <p className="text-xs text-gray-400">{label}</p>
        {href ? (
          <a href={href} className="text-sm font-medium text-[#0057D9] hover:underline break-all">
            {value || "—"}
          </a>
        ) : (
          <p className="text-sm font-medium text-[#0B1E3D] break-all">{value || "—"}</p>
        )}
      </div>
    </div>
  )
}
