import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { MessageSquareQuote, ArrowUpDown, SortAsc, SortDesc, SearchX, AlertTriangle, Plus, Star } from "lucide-react"
import SearchBar from "../SearchBar"
import TestimonialRow from "./TestimonialRow"
import Pagination from "../Pagination"
import EmptyState from "../EmptyState"
import LoadingSkeleton from "../LoadingSkeleton"

const PAGE_SIZE = 8

const selectClass =
  "h-10 px-3 2xl:h-11 2xl:px-4 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 cursor-pointer"

export default function TestimonialsTable({ testimonials, loading, error, onRetry, onView, onEdit, onDelete, onAdd }) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [featuredFilter, setFeaturedFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [sortKey, setSortKey] = useState("display_order")
  const [sortDir, setSortDir] = useState("asc")
  const [page, setPage] = useState(1)

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
    setPage(1)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = testimonials.filter((t) => {
      if (q && !`${t.client_name} ${t.company} ${t.position}`.toLowerCase().includes(q)) return false
      if (statusFilter !== "all" && t.status !== statusFilter) return false
      if (featuredFilter !== "all" && t.featured !== (featuredFilter === "featured")) return false
      if (ratingFilter !== "all" && t.rating !== Number(ratingFilter)) return false
      return true
    })
    if (!sortKey) return rows
    return [...rows].sort((a, b) => {
      const va = a[sortKey]
      const vb = b[sortKey]
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va
      }
      const cmp = String(va ?? "").localeCompare(String(vb ?? ""))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [testimonials, query, statusFilter, featuredFilter, ratingFilter, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const to = Math.min(safePage * PAGE_SIZE, filtered.length)
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const resetFilters = () => {
    setQuery("")
    setStatusFilter("all")
    setFeaturedFilter("all")
    setRatingFilter("all")
    setPage(1)
  }

  const hasFilters = query || statusFilter !== "all" || featuredFilter !== "all" || ratingFilter !== "all"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 p-6 2xl:p-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 2xl:gap-6 2xl:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 2xl:gap-4">
          <SearchBar placeholder="Search testimonials..." value={query} onChange={setQuery} className="w-full sm:w-56 2xl:w-72" />
          <div className="flex items-center gap-2 flex-wrap 2xl:gap-3">
            <label className="sr-only" htmlFor="filter-status">Status</label>
            <select id="filter-status" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }} className={selectClass} aria-label="Filter by status">
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>

            <label className="sr-only" htmlFor="filter-featured">Featured</label>
            <select id="filter-featured" value={featuredFilter} onChange={(e) => { setFeaturedFilter(e.target.value); setPage(1) }} className={selectClass} aria-label="Filter by featured">
              <option value="all">All Featured</option>
              <option value="featured">Featured</option>
              <option value="regular">Not Featured</option>
            </select>

            <label className="sr-only" htmlFor="filter-rating">Rating</label>
            <select id="filter-rating" value={ratingFilter} onChange={(e) => { setRatingFilter(e.target.value); setPage(1) }} className={selectClass} aria-label="Filter by rating">
              <option value="all">All Ratings</option>
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>{r} Stars</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-400 lg:text-right">
          {filtered.length} testimonial{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Could not load testimonials"
          description={error}
          action={{ label: "Try again", icon: Plus, onClick: onRetry }}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={hasFilters ? SearchX : MessageSquareQuote}
          title={hasFilters ? "No matching testimonials" : "No testimonials yet"}
          description={
            hasFilters
              ? "Try adjusting your search or filters."
              : "Add your first client testimonial to get started."
          }
          action={hasFilters ? { label: "Clear filters", icon: Plus, onClick: resetFilters } : { label: "Add Testimonial", icon: Plus, onClick: onAdd }}
        />
      ) : (
        <>
          <div className="overflow-x-auto -mx-6 px-6 2xl:-mx-8 2xl:px-8">
            <table className="w-full text-sm min-w-[820px]">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort("client_name")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      Client
                      {sortKey === "client_name" ? (
                        sortDir === "asc" ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">Company</th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort("rating")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      <Star className="w-3.5 h-3.5" />
                      Rating
                      {sortKey === "rating" ? (
                        sortDir === "asc" ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">Featured</th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort("status")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      Status
                      {sortKey === "status" ? (
                        sortDir === "asc" ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort("created_at")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      Created
                      {sortKey === "created_at" ? (
                        sortDir === "asc" ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 2xl:py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((testimonial) => (
                  <TestimonialRow
                    key={testimonial.id}
                    testimonial={testimonial}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={safePage}
            pageCount={pageCount}
            total={filtered.length}
            from={from}
            to={to}
            onPageChange={setPage}
          />
        </>
      )}
    </motion.div>
  )
}
