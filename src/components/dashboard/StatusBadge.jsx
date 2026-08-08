// Small pill badge indicating whether a record is published or still a draft.

/**
 * StatusBadge
 * @param {Object} props
 * @param {string} props.status - Record status; "published" renders the published pill.
 */
export default function StatusBadge({ status }) {
  const published = status === "published"
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${
        published ? "text-emerald-600 bg-emerald-500/10" : "text-gray-500 bg-gray-500/10"
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${published ? "bg-emerald-500" : "bg-gray-400"}`} />
      {published ? "Published" : "Draft"}
    </span>
  )
}
