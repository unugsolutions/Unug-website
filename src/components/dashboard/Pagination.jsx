// Pagination controls: previous/next buttons plus page numbers with ellipsis gaps.
import { ChevronLeft, ChevronRight } from "lucide-react"

/**
 * Builds the ordered sequence of page numbers and "..." ellipsis markers to display.
 * @param {number} page - Current page number.
 * @param {number} pageCount - Total number of pages.
 * @returns {Array<number|string>} Page numbers and ellipsis placeholders.
 */
function buildPageNumbers(page, pageCount) {
  const pages = new Set([1, pageCount, page - 1, page, page + 1])
  const list = []
  let prev = 0
  for (const n of [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b)) {
    if (n - prev > 1) list.push("...")
    list.push(n)
    prev = n
  }
  return list
}

/**
 * Pagination
 * @param {Object} props
 * @param {number} props.page - Current page number.
 * @param {number} props.pageCount - Total number of pages.
 * @param {number} props.total - Total item count (for the summary line).
 * @param {number} props.from - First item number shown on this page.
 * @param {number} props.to - Last item number shown on this page.
 * @param {Function} props.onPageChange - Called with the newly selected page number.
 */
export default function Pagination({ page, pageCount, total, from, to, onPageChange }) {
  if (pageCount <= 1) return null

  const buttonClass = (disabled, active) =>
    `inline-flex items-center justify-center w-8 h-8 2xl:w-9 2xl:h-9 text-xs font-semibold rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] ${
      disabled
        ? "text-gray-300 cursor-not-allowed"
        : active
          ? "bg-[#0057D9] text-white shadow-sm"
          : "text-gray-500 hover:bg-[#F7F9FC] hover:text-[#0B1E3D]"
    }`

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 2xl:gap-4 2xl:pt-5">
      <p className="text-xs text-gray-400">
        Showing <span className="font-medium text-[#0B1E3D]">{from}</span>–
        <span className="font-medium text-[#0B1E3D]">{to}</span> of {total}
      </p>

      <nav aria-label="Pagination" className="flex flex-wrap items-center justify-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className={buttonClass(page === 1, false)}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {buildPageNumbers(page, pageCount).map((n, i) =>
          n === "..." ? (
            <span key={`ellipsis-${i}`} className="w-8 2xl:w-9 text-center text-xs text-gray-400">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              aria-label={`Page ${n}`}
              aria-current={n === page ? "page" : undefined}
              className={buttonClass(false, n === page)}
            >
              {n}
            </button>
          )
        )}

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page === pageCount}
          aria-label="Next page"
          className={buttonClass(page === pageCount, false)}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </nav>
    </div>
  )
}
