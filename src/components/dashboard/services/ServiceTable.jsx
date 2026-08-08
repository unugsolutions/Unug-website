import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { BriefcaseBusiness, ArrowUpDown, SortAsc, SortDesc, SearchX, AlertTriangle, Plus } from "lucide-react"
import SearchBar from "../SearchBar"
import ServiceRow from "./ServiceRow"
import Pagination from "../Pagination"
import EmptyState from "../EmptyState"
import LoadingSkeleton from "../LoadingSkeleton"

const PAGE_SIZE = 8

export default function ServiceTable({ services, loading, error, onRetry, onView, onEdit, onDelete, onAdd }) {
  const [query, setQuery] = useState("")
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
    const rows = services.filter((s) => {
      if (!q) return true
      return s.title.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q)
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
  }, [services, query, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const to = Math.min(safePage * PAGE_SIZE, filtered.length)
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 p-6 2xl:p-8"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 2xl:gap-6 2xl:mb-6">
        <SearchBar placeholder="Search services..." value={query} onChange={setQuery} className="w-full sm:max-w-xs 2xl:max-w-sm" />
        <p className="text-xs text-gray-400 sm:text-right">
          {filtered.length} service{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Could not load services"
          description={error}
          action={{ label: "Try again", icon: Plus, onClick: onRetry }}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={query ? SearchX : BriefcaseBusiness}
          title={query ? "No results found" : "No services yet"}
          description={
            query
              ? "Try a different search term."
              : "Create your first service to get started."
          }
          action={query ? undefined : { label: "Add Service", icon: Plus, onClick: onAdd }}
        />
      ) : (
        <>
          <div className="overflow-x-auto -mx-6 px-6 2xl:-mx-8 2xl:px-8">
            <table className="w-full text-sm min-w-[760px]">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort("title")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      Service
                      {sortKey === "title" ? (
                        sortDir === "asc" ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">Slug</th>
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
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">Featured</th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort("display_order")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      Order
                      {sortKey === "display_order" ? (
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
                {rows.map((service) => (
                  <ServiceRow
                    key={service.id}
                    service={service}
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
