const styles = {
  new: "text-[#0057D9] bg-[#0057D9]/10",
  in_progress: "text-amber-600 bg-amber-500/10",
  replied: "text-emerald-600 bg-emerald-500/10",
  closed: "text-slate-600 bg-slate-500/10",
}

export default function StatusBadge({ status }) {
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
