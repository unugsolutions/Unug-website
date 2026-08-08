// Demo requests table: search, filter by status/priority/service/timeline, sortable columns,
// and pagination. Rows open a details modal or trigger deletion.
import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { FileText, ArrowUpDown, SortAsc, SortDesc, SearchX, AlertTriangle, Plus } from "lucide-react"
import SearchBar from "../SearchBar"
import QuoteRow from "./QuoteRow"
import Pagination from "../Pagination"
import EmptyState from "../EmptyState"
import LoadingSkeleton from "../LoadingSkeleton"
import { QUOTE_STATUSES, QUOTE_PRIORITIES } from "../../../services/quoteService"

const PAGE_SIZE = 8
// Numeric rank used to sort by priority (low → urgent).
const PRIORITY_ORDER = { low: 0, medium: 1, high: 2, urgent: 3 }

const selectClass =
  "h-10 px-3 2xl:h-11 2xl:px-4 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 cursor-pointer"

export default function QuotesTable({ quotes, loading, error, onRetry, onView, onDelete }) {
  const [query, setQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [timelineFilter, setTimelineFilter] = useState("all")
  const [sortKey, setSortKey] = useState("submitted_at")
  const [sortDir, setSortDir] = useState("desc")
  const [page, setPage] = useState(1)

  // Derive filter dropdown options from the actual values present in the data.
  const serviceOptions = useMemo(
    () => [...new Set(quotes.map((q) => q.service).filter(Boolean))].sort(),
    [quotes]
  )

  const timelineOptions = useMemo(
    () => [...new Set(quotes.map((q) => q.timeline).filter(Boolean))].sort(),
    [quotes]
  )

  // Toggles asc/desc on the same column, or switches columns (resetting to the page start).
  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir(key === "submitted_at" ? "desc" : "asc")
    }
    setPage(1)
  }

  // Apply the active search query + filters, then sort by the chosen column.
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const rows = quotes.filter((item) => {
      if (
        q &&
        !`${item.reference_number} ${item.full_name} ${item.company ?? ""} ${item.email}`.toLowerCase().includes(q)
      ) {
        return false
      }
      if (statusFilter !== "all" && item.status !== statusFilter) return false
      if (priorityFilter !== "all" && item.priority !== priorityFilter) return false
      if (serviceFilter !== "all" && item.service !== serviceFilter) return false
      if (timelineFilter !== "all" && item.timeline !== timelineFilter) return false
      return true
    })

    return [...rows].sort((a, b) => {
      if (sortKey === "submitted_at") {
        return sortDir === "asc"
          ? new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime()
          : new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
      }
      if (sortKey === "priority") {
        const va = PRIORITY_ORDER[a.priority] ?? 1
        const vb = PRIORITY_ORDER[b.priority] ?? 1
        return sortDir === "asc" ? va - vb : vb - va
      }
      const cmp = String(a[sortKey] ?? "").localeCompare(String(b[sortKey] ?? ""))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [quotes, query, statusFilter, priorityFilter, serviceFilter, timelineFilter, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const to = Math.min(safePage * PAGE_SIZE, filtered.length)
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const resetFilters = () => {
    setQuery("")
    setStatusFilter("all")
    setPriorityFilter("all")
    setServiceFilter("all")
    setTimelineFilter("all")
    setPage(1)
  }

  const hasFilters =
    query ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    serviceFilter !== "all" ||
    timelineFilter !== "all"

  const selectWithPageReset = (setter) => (e) => {
    setter(e.target.value)
    setPage(1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 p-6 2xl:p-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 2xl:gap-6 2xl:mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center gap-3 2xl:gap-4">
          <SearchBar placeholder="Search by reference, client, company, email..." value={query} onChange={setQuery} className="w-full xl:w-64 2xl:w-80" />
          <div className="flex items-center gap-2 flex-wrap 2xl:gap-3">
            <label className="sr-only" htmlFor="filter-status">Status</label>
            <select id="filter-status" value={statusFilter} onChange={selectWithPageReset(setStatusFilter)} className={selectClass} aria-label="Filter by status">
              <option value="all">All Statuses</option>
              {QUOTE_STATUSES.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>

            <label className="sr-only" htmlFor="filter-priority">Priority</label>
            <select id="filter-priority" value={priorityFilter} onChange={selectWithPageReset(setPriorityFilter)} className={selectClass} aria-label="Filter by priority">
              <option value="all">All Priorities</option>
              {QUOTE_PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>

            <label className="sr-only" htmlFor="filter-service">Service</label>
            <select id="filter-service" value={serviceFilter} onChange={selectWithPageReset(setServiceFilter)} className={selectClass} aria-label="Filter by service">
              <option value="all">All Services</option>
              {serviceOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <label className="sr-only" htmlFor="filter-timeline">Timeline</label>
            <select id="filter-timeline" value={timelineFilter} onChange={selectWithPageReset(setTimelineFilter)} className={selectClass} aria-label="Filter by timeline">
              <option value="all">All Timelines</option>
              {timelineOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-400 lg:text-right">
          {filtered.length} request{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Could not load demo requests"
          description={error}
          action={{ label: "Try again", icon: Plus, onClick: onRetry }}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={hasFilters ? SearchX : FileText}
          title={hasFilters ? "No matching requests" : "No demo requests yet"}
          description={
            hasFilters
              ? "Try adjusting your search or filters."
              : "Requests submitted through the Request a Demo page will appear here."
          }
          action={hasFilters ? { label: "Clear filters", icon: Plus, onClick: resetFilters } : undefined}
        />
      ) : (
        <>
          <div className="overflow-x-auto -mx-6 px-6 2xl:-mx-8 2xl:px-8">
            <table className="w-full text-sm min-w-[1180px] xl:min-w-0">
              <thead>
                <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">Reference</th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort("full_name")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      Client
                      {sortKey === "full_name" ? (
                        sortDir === "asc" ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold xl:hidden 2xl:table-cell">Company</th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold xl:hidden 2xl:table-cell">Service</th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold xl:hidden 3xl:table-cell">Timeline</th>
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
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold xl:hidden 2xl:table-cell">
                    <button
                      type="button"
                      onClick={() => toggleSort("priority")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      Priority
                      {sortKey === "priority" ? (
                        sortDir === "asc" ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort("submitted_at")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      Date
                      {sortKey === "submitted_at" ? (
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
                {rows.map((quote) => (
                  <QuoteRow key={quote.id} quote={quote} onView={onView} onDelete={onDelete} />
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
