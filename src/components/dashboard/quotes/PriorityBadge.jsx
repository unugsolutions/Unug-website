// Per-priority Tailwind color classes for the demo request priority badge.
const styles = {
  low: "text-gray-500 bg-gray-500/10",
  medium: "text-amber-600 bg-amber-500/10",
  high: "text-red-600 bg-red-500/10",
  urgent: "text-purple-600 bg-purple-500/10",
}

export default function PriorityBadge({ priority }) {
  // Default to "medium" so an unknown/missing priority never renders unstyled.
  const value = priority || "medium"
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${
        styles[value] ?? styles.medium
      }`}
    >
      {value}
    </span>
  )
}
