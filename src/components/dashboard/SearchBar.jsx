// Text input with a search icon and Ctrl K shortcut hint, used in the top navbar.
import { Search } from "lucide-react"

/**
 * SearchBar
 * @param {Object} props
 * @param {string} [props.placeholder] - Input placeholder text.
 * @param {string} [props.className] - Extra classes applied to the wrapper.
 * @param {string} [props.value] - Controlled input value.
 * @param {Function} [props.onChange] - Called with the new input value.
 */
export default function SearchBar({ placeholder = "Search anything...", className = "", value, onChange }) {
  return (
    <div className={`relative ${className}`}>
      <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="search"
        placeholder={placeholder}
        aria-label="Search"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full h-10 pl-10 pr-16 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"
      />
      <kbd className="hidden sm:inline-flex absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded-md px-1.5 py-0.5">
        Ctrl K
      </kbd>
    </div>
  )
}
