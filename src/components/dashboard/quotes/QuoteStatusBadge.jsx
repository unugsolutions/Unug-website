// Per-status Tailwind color classes for the demo request status badge.
const styles = {
  new: "text-[#0057D9] bg-[#0057D9]/10",
  reviewing: "text-violet-600 bg-violet-500/10",
  quoted: "text-amber-600 bg-amber-500/10",
  negotiation: "text-orange-600 bg-orange-500/10",
  approved: "text-emerald-600 bg-emerald-500/10",
  rejected: "text-red-600 bg-red-500/10",
  completed: "text-slate-600 bg-slate-500/10",
}

export default function QuoteStatusBadge({ status }) {
  // Default to "new" so an unknown/missing status never renders unstyled.
  const value = status || "new"
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full capitalize whitespace-nowrap ${
        styles[value] ?? styles.new
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles[value] ?? styles.new}`} />
      {value.replace("_", " ")}
    </span>
  )
}
