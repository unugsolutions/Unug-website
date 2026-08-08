import { Link } from "react-router-dom"
import { Mail, Phone, MapPin } from "lucide-react"
import { usePublicWebsiteSettings } from "../hooks/useWebsiteSettings"
import { SOCIAL_ICONS } from "../lib/socialIcons"

// Site footer: renders branding, services, quick links, contact info, and socials from public settings.

// Which social platforms the footer renders, and the order they appear in.
const FOOTER_SOCIAL_KEYS = ["facebook", "instagram", "linkedin", "whatsapp", "tiktok"]

// Default URLs used when a platform has no configured custom URL.
const SOCIAL_FALLBACK_URLS = {
  facebook: "https://www.facebook.com/profile.php?id=61592865038533",
  instagram: "https://instagram.com/",
  linkedin: "www.linkedin.com/in/unug-solutions-6a3618428",
  whatsapp: "Wa.me/+252638374348",
  tiktok: "https://www.tiktok.com/@unug.solutions?_r=1&_t=ZS-98i1D6D34YH",
}

const sections = [
  {
    title: "Services",
    links: ["Custom Software", "Web Development", "Mobile Apps", "UI/UX Design", "Cloud Solutions"],
  },
]

/**
 * Renders the page footer, pulling content from public website settings with sensible fallbacks.
 * @returns {JSX.Element} The footer with logo, description, socials, quick links, and contact details.
 */
function Footer() {
  const { settings } = usePublicWebsiteSettings()

  // Fall back to hardcoded brand defaults for every field missing from settings.
  const companyName = settings?.company_name || "UNUG"
  const logo = settings?.logo_url || "/mainlogo.svg"
  const description =
    settings?.company_description ||
    "Engineering Digital Solutions for a Smarter Tomorrow. We build modern websites, software, and platforms that drive business growth."
  const email = settings?.email || "unugsolutions@gmail.com"
  const phone = settings?.phone || "+252 63 837 4348"
  const address =
    settings?.address ||
    [settings?.city, settings?.country].filter(Boolean).join(", ") ||
    "Hargeisa, Somaliland"
  const footerText = settings?.footer_text || ""
  const copyrightText = settings?.copyright_text || "All rights reserved."
  const quickLinks = Array.isArray(settings?.quick_links)
    ? settings.quick_links.filter((l) => l && l.label && l.to)
    : []
  // Resolve each platform icon, then prefer a configured URL over the fallback.
  const socials = FOOTER_SOCIAL_KEYS.map((key) => {
    const icon = SOCIAL_ICONS.find((i) => i.key === key)
    if (!icon) return null
    const customUrl = key === "whatsapp" ? settings?.whatsapp : settings?.[`${key}_url`]
    const url = customUrl && customUrl.trim() && customUrl !== "#" ? customUrl : SOCIAL_FALLBACK_URLS[key]
    return { ...icon, url }
  }).filter(Boolean)

  return (
    <footer className="bg-navy text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt={companyName} className="h-8 md:h-10" />
              <span className="text-xl font-heading font-bold text-white tracking-tight">{companyName}</span>
            </Link>
            <p className="text-sm text-gray-400 mt-3 max-w-xs leading-relaxed">{description}</p>
            {socials.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-6">
                {socials.map((s) => (
                  <a
                    key={s.key}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-primary transition-colors"
                    aria-label={s.label}
                  >
                    <svg className="w-5 h-5 fill-white/70" viewBox="0 0 24 24">
                      <path d={s.path} />
                    </svg>
                  </a>
                ))}
              </div>
            )}
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <h4 className="text-sm font-heading font-semibold text-white mb-4">{s.title}</h4>
              <ul className="space-y-2.5">
                {s.links.map((l) => (
                  <li key={l.label || l}>
                    <Link
                      to={l.to || "#"}
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {l.label || l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-heading font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {/* Use configured quick links, or fall back to a default list of site pages. */}
              {(quickLinks.length > 0 ? quickLinks : [
                { label: "Home", to: "/" },
                { label: "Services", to: "/services" },
                { label: "Solutions", to: "/solutions" },
                { label: "About Us", to: "/about" },
                { label: "Contact Us", to: "/contact" },
              ]).map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to || "#"}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-heading font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-4">
              <li>
                <a href={`mailto:${email}`} className="flex items-start gap-3 text-sm text-gray-400 hover:text-white transition-colors group">
                  <Mail className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                  <span className="break-all">{email}</span>
                </a>
              </li>
              <li>
                <a href={`tel:${phone}`} className="flex items-start gap-3 text-sm text-gray-400 hover:text-white transition-colors group">
                  <Phone className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                  <span>{phone}</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                  <MapPin className="w-5 h-5 mt-0.5 text-primary shrink-0" />
                  <span>{address}</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {companyName}. {copyrightText}
          </p>
          {footerText && <p className="text-xs text-gray-600 text-center">{footerText}</p>}
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
