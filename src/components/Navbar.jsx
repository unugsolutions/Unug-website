import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Mail, Phone } from "lucide-react"
import { usePublicWebsiteSettings } from "../hooks/useWebsiteSettings"

// Sticky top navigation with a desktop link bar and an animated mobile drawer.

const links = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Solutions", to: "/solutions" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
  { label: "Request a Demo", to: "/request-a-demo", cta: true },
]

// Force an instant jump to the top when navigating, so routes always start fresh.
function scrollToTop() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" })
}

/**
 * Single navigation link; renders as a highlighted button for CTA items.
 * @param {object} props - NavLink props.
 * @param {object} props.item - Link config ({ label, to, cta? }).
 * @param {Function} [props.onClick] - Optional click handler forwarded from the parent.
 * @returns {JSX.Element} A router Link.
 */
function NavLink({ item, onClick }) {
  const className = item.cta
    ? "inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-primary text-white text-sm font-semibold shadow-sm hover:bg-primary/90 hover:shadow-md transition-all"
    : "text-sm font-medium text-gray-500 hover:text-primary transition-colors"
  return (
    <Link
      to={item.to}
      className={className}
      onClick={(e) => {
        scrollToTop()
        onClick?.(e)
      }}
    >
      {item.label}
    </Link>
  )
}

/**
 * Top navigation bar with desktop links, hamburger toggle, and a mobile slide-in drawer.
 * @returns {JSX.Element} The navbar fragment (nav + optional mobile overlay).
 */
function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { settings } = usePublicWebsiteSettings()

  const companyName = settings?.company_name || "UNUG"
  const logo = settings?.logo_url || "/mainlogo.svg"
  const email = settings?.email || "unugsolutions@gmail.com"
  const phone = settings?.phone || "+252 63 837 4348"

  // Lock body scroll while the mobile drawer is open, and always clean up on unmount.
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [open])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6 h-16 md:h-20">
            <a href="/" className="flex items-center gap-2">
              <img src={logo} alt={companyName} className="h-8 md:h-10" />
              <span className="text-xl font-heading font-bold text-navy tracking-tight">{companyName}</span>
            </a>

            <div className="hidden lg:flex items-center gap-8">
              {links.map((l) => (
                <NavLink key={l.label} item={l} />
              ))}
            </div>

            <button
              className="lg:hidden relative z-50 w-10 h-10 flex items-center justify-center -mr-2 text-navy"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {/* Three animated lines that morph into an X when the drawer is open. */}
              <div className="relative w-5 h-4">
                <span className={`absolute left-0 top-0 w-full h-[2px] bg-current rounded-full transition-all duration-300 ${open ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`absolute left-0 top-[7px] w-full h-[2px] bg-current rounded-full transition-all duration-300 ${open ? "opacity-0 scale-x-0" : ""}`} />
                <span className={`absolute left-0 bottom-0 w-full h-[2px] bg-current rounded-full transition-all duration-300 ${open ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {open && (
        // Full-screen overlay with a semi-transparent backdrop; clicking outside closes the drawer.
        <div className="fixed inset-0 top-0 z-40 lg:hidden" onClick={() => setOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
          <div
            className={`absolute top-0 right-0 bottom-0 w-[280px] sm:w-[320px] bg-white shadow-2xl border-l border-gray-100`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col h-full px-6 pt-20 pb-8 overflow-y-auto">
              <div className="flex-1 space-y-1">
                {links.map((l, i) => {
                  const isActive = location.pathname === l.to
                  const isCta = l.cta
                  const content = (
                    <div
                      className={`flex items-center justify-between px-4 py-3.5 text-base font-heading font-semibold rounded-xl transition-all duration-200 ${
                        isCta
                          ? "bg-primary text-white shadow-sm"
                          : isActive
                            ? "text-primary bg-blue-50"
                            : "text-navy hover:text-primary hover:bg-blue-50/60"
                      }`}
                    >
                      <span>{l.label}</span>
                      <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isCta ? "text-white/70" : isActive ? "translate-x-0.5" : "text-gray-300"}`} />
                    </div>
                  )

                  return (
                    <Link
                      key={l.label}
                      to={l.to}
                      onClick={() => {
                        scrollToTop()
                        setOpen(false)
                      }}
                      style={{ animationDelay: `${i * 0.05}s` }}
                      className="block animate-fade-in"
                    >
                      {content}
                    </Link>
                  )
                })}
              </div>

              {/* Contact shortcuts pinned to the bottom of the drawer. */}
              <div className="pt-6 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-3 px-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <a href={`mailto:${email}`} className="text-xs text-gray-500 hover:text-primary transition-colors">{email}</a>
                </div>
                <div className="flex items-center gap-3 px-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <a href={`tel:${phone}`} className="text-xs text-gray-500 hover:text-primary transition-colors">{phone}</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
