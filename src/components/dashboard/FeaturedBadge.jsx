// Small badge that shows "Featured" or "No" depending on a boolean flag.
import { Star } from "lucide-react"

/**
 * FeaturedBadge
 * @param {Object} props
 * @param {boolean} [props.featured] - Whether the item is marked as featured.
 */
export default function FeaturedBadge({ featured }) {
  if (!featured) return <span className="text-xs text-gray-400">No</span>
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-500/10 px-2.5 py-1 rounded-full">
      <Star className="w-3 h-3 fill-amber-500" />
      Featured
    </span>
  )
}
