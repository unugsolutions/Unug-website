import { Wrench, Mail, Phone } from "lucide-react"
import { usePublicWebsiteSettings } from "../hooks/useWebsiteSettings"

// Full-screen maintenance notice shown while the site is offline for scheduled work.

/**
 * Renders the "We'll Be Back Soon" maintenance screen.
 * @returns {JSX.Element} Centered page with logo, wrench icon, and email/phone contact buttons.
 */
export default function Maintenance() {
  const { settings } = usePublicWebsiteSettings()
  // Read branding values from settings so the notice matches the rest of the site.
  const companyName = settings?.company_name || "UNUG Solutions"
  const logo = settings?.logo_url || "/mainlogo.svg"
  const tagline = settings?.company_tagline || "Engineering Digital Solutions"
  const email = settings?.email || "unugsolutions@gmail.com"
  const phone = settings?.phone || "+252 63 837 4348"
  // Background glow uses the site's configured primary color.
  const primary = settings?.primary_color || "#2563EB"

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-b from-[#F8FAFF] to-white relative overflow-hidden">
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-3xl pointer-events-none opacity-20"
        style={{ backgroundColor: primary }}
      />
      <div className="relative z-10 text-center max-w-md w-full">
        <img src={logo} alt={companyName} className="h-14 max-w-full w-auto mx-auto mb-6" />
        <div className="w-16 h-16 rounded-2xl bg-[#EFF6FF] flex items-center justify-center mx-auto mb-5">
          <Wrench className="w-8 h-8" style={{ color: primary }} />
        </div>
        <h1 className="text-3xl md:text-4xl font-heading font-bold text-[#0F172A] mb-3">We'll Be Back Soon</h1>
        <p className="text-[#64748B] leading-relaxed mb-3">
          {companyName} is currently undergoing scheduled maintenance to bring you a better experience.
        </p>
        <p className="text-sm text-[#64748B] mb-8">{tagline}</p>
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <a
            href={`mailto:${email}`}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl text-white"
            style={{ backgroundColor: primary }}
          >
            <Mail className="w-4 h-4" />
            {email}
          </a>
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl border border-[#E5E7EB] text-[#0F172A] hover:bg-gray-50 transition-colors"
          >
            <Phone className="w-4 h-4" />
            {phone}
          </a>
        </div>
      </div>
    </div>
  )
}
