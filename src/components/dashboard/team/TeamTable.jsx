import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Users, ArrowUpDown, SortAsc, SortDesc, SearchX, AlertTriangle, Plus } from "lucide-react"
import SearchBar from "../SearchBar"
import TeamRow from "./TeamRow"
import Pagination from "../Pagination"
import EmptyState from "../EmptyState"
import LoadingSkeleton from "../LoadingSkeleton"

const PAGE_SIZE = 8

const selectClass =
  "h-10 px-3 2xl:h-11 2xl:px-4 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 cursor-pointer"

export default function TeamTable({ team, loading, error, onRetry, onView, onEdit, onDelete, onAdd }) {
  const [query, setQuery] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [featuredFilter, setFeaturedFilter] = useState("all")
  const [sortKey, setSortKey] = useState("display_order")
  const [sortDir, setSortDir] = useState("asc")
  const [page, setPage] = useState(1)

  const departments = useMemo(() => {
    const set = new Set(team.map((m) => m.department).filter(Boolean))
    return [...set].sort()
  }, [team])

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
    const rows = team.filter((m) => {
      if (q && !`${m.full_name} ${m.position} ${m.department} ${m.email ?? ""}`.toLowerCase().includes(q)) return false
      if (departmentFilter !== "all" && m.department !== departmentFilter) return false
      if (statusFilter !== "all" && m.status !== statusFilter) return false
      if (featuredFilter !== "all" && m.featured !== (featuredFilter === "featured")) return false
      return true
    })
    if (!sortKey) return rows
    return [...rows].sort((a, b) => {
      let va = a[sortKey]
      let vb = b[sortKey]
      if (sortKey === "joined_date") {
        va = va ? new Date(va).getTime() : -Infinity
        vb = vb ? new Date(vb).getTime() : -Infinity
        return sortDir === "asc" ? va - vb : vb - va
      }
      if (typeof va === "number" && typeof vb === "number") {
        return sortDir === "asc" ? va - vb : vb - va
      }
      const cmp = String(va ?? "").localeCompare(String(vb ?? ""))
      return sortDir === "asc" ? cmp : -cmp
    })
  }, [team, query, departmentFilter, statusFilter, featuredFilter, sortKey, sortDir])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const to = Math.min(safePage * PAGE_SIZE, filtered.length)
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const resetFilters = () => {
    setQuery("")
    setDepartmentFilter("all")
    setStatusFilter("all")
    setFeaturedFilter("all")
    setPage(1)
  }

  const hasFilters = query || departmentFilter !== "all" || statusFilter !== "all" || featuredFilter !== "all"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 p-6 2xl:p-8"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 2xl:gap-6 2xl:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 2xl:gap-4">
          <SearchBar placeholder="Search team members..." value={query} onChange={setQuery} className="w-full sm:w-56 2xl:w-72" />
          <div className="flex items-center gap-2 flex-wrap 2xl:gap-3">
            <label className="sr-only" htmlFor="filter-department">Department</label>
            <select id="filter-department" value={departmentFilter} onChange={(e) => { setDepartmentFilter(e.target.value); setPage(1) }} className={selectClass} aria-label="Filter by department">
              <option value="all">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

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
          </div>
        </div>
        <p className="text-xs text-gray-400 lg:text-right">
          {filtered.length} member{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : error ? (
        <EmptyState
          icon={AlertTriangle}
          title="Could not load team members"
          description={error}
          action={{ label: "Try again", icon: Plus, onClick: onRetry }}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={hasFilters ? SearchX : Users}
          title={hasFilters ? "No matching team members" : "No team members yet"}
          description={
            hasFilters
              ? "Try adjusting your search or filters."
              : "Add your first team member to start building your team page."
          }
          action={hasFilters ? { label: "Clear filters", icon: Plus, onClick: resetFilters } : { label: "Add Team Member", icon: Plus, onClick: onAdd }}
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
                      onClick={() => toggleSort("full_name")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      Name
                      {sortKey === "full_name" ? (
                        sortDir === "asc" ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">
                    <button
                      type="button"
                      onClick={() => toggleSort("position")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      Position
                      {sortKey === "position" ? (
                        sortDir === "asc" ? <SortAsc className="w-3.5 h-3.5" /> : <SortDesc className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowUpDown className="w-3.5 h-3.5 opacity-50" />
                      )}
                    </button>
                  </th>
                  <th className="py-2.5 pr-4 2xl:py-3 2xl:pr-6 font-semibold">Department</th>
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
                      onClick={() => toggleSort("joined_date")}
                      className="inline-flex items-center gap-1 hover:text-[#0B1E3D] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] rounded"
                    >
                      Joined
                      {sortKey === "joined_date" ? (
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
                {rows.map((member) => (
                  <TeamRow
                    key={member.id}
                    member={member}
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
