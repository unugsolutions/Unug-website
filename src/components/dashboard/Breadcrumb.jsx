// Breadcrumb trail with a home link, optional intermediate links, and the current page label.
import { Link } from "react-router-dom"
import { Home, ChevronRight } from "lucide-react"

/**
 * Breadcrumb
 * @param {Object} props
 * @param {Array} [props.items] - Intermediate trail links: { label, to }.
 * @param {string} [props.current] - Current page label, rendered as plain text.
 */
export default function Breadcrumb({ items = [], current }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm">
      <Link
        to="/dashboard"
        className="flex items-center gap-1 text-gray-400 hover:text-[#0057D9] transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
      </Link>

      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" aria-hidden="true" />
          <Link
            to={item.to ?? "#"}
            className="text-gray-400 hover:text-[#0057D9] transition-colors"
          >
            {item.label}
          </Link>
        </span>
      ))}

      {current && (
        <span className="flex items-center gap-1.5">
          <ChevronRight className="w-3.5 h-3.5 text-gray-300" aria-hidden="true" />
          <span className="font-medium text-[#0B1E3D]" aria-current="page">
            {current}
          </span>
        </span>
      )}
    </nav>
  )
}
