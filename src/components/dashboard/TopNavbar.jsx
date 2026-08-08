// Sticky top navbar: mobile menu trigger, page title, search, notifications, and user menu.
import { Menu } from "lucide-react"
import SearchBar from "./SearchBar"
import NotificationMenu from "./NotificationMenu"
import UserMenu from "./UserMenu"

/**
 * TopNavbar
 * @param {Object} props
 * @param {string} props.title - Current page title shown next to the menu button.
 * @param {Function} props.onOpenMobile - Callback to open the mobile sidebar drawer.
 */
export default function TopNavbar({ title, onOpenMobile }) {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center gap-3 h-16 px-4 sm:px-6">
        <button
          type="button"
          onClick={onOpenMobile}
          aria-label="Open menu"
          className="lg:hidden p-2 rounded-xl text-[#0B1E3D] hover:bg-[#F7F9FC] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wider hidden sm:block">Administration</p>
          <h2 className="text-[15px] sm:text-lg font-heading font-bold text-[#0B1E3D] truncate leading-tight">{title}</h2>
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <SearchBar className="hidden md:block w-64 lg:w-80" />
          <NotificationMenu />
          <div className="hidden sm:block w-px h-6 bg-gray-200" />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
