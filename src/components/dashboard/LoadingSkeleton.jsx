// Placeholder rows shown while list content is loading (uses the Tailwind pulse animation).

/**
 * LoadingSkeleton
 * @param {Object} props
 * @param {number} [props.rows] - Number of skeleton rows to render (default 6).
 */
export default function LoadingSkeleton({ rows = 6 }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 py-4 border-b border-gray-50 last:border-0"
        >
          <div className="w-9 h-9 rounded-lg bg-gray-100" />
          <div className="flex-1 space-y-2">
            <div className="h-3.5 bg-gray-100 rounded w-1/3" />
            <div className="h-3 bg-gray-100 rounded w-1/4" />
          </div>
          <div className="h-5 w-20 bg-gray-100 rounded-full" />
          <div className="h-5 w-16 bg-gray-100 rounded-full" />
        </div>
      ))}
    </div>
  )
}
