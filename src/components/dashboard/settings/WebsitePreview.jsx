import { Eye, Mail, Phone, MapPin } from "lucide-react"

export default function WebsitePreview({ watch }) {
  const companyName = watch("company_name") || "UNUG Solutions"
  const tagline = watch("company_tagline") || "Engineering Digital Solutions"
  const logo = watch("logo_url")
  const email = watch("email") || "hello@example.com"
  const phone = watch("phone") || "+000 000 000 000"
  const city = watch("city") || "Hargeisa"
  const country = watch("country") || "Somaliland"
  const footerText = watch("footer_text") || ""
  const primary = /^#[0-9a-fA-F]{6}$/.test(watch("primary_color") || "") ? watch("primary_color") : "#2563EB"
  const secondary = /^#[0-9a-fA-F]{6}$/.test(watch("secondary_color") || "")
    ? watch("secondary_color")
    : "#0F172A"
  const accent = /^#[0-9a-fA-F]{6}$/.test(watch("accent_color") || "") ? watch("accent_color") : "#FF8C00"

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">
          <Eye className="w-3 h-3" />
          Live Preview
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
          {logo ? (
            <img src={logo} alt={companyName} className="h-8 w-8 object-contain" />
          ) : (
            <span
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: primary }}
            >
              {companyName.charAt(0)}
            </span>
          )}
          <div className="min-w-0">
            <p className="text-sm font-heading font-bold text-[#0F172A] truncate">{companyName}</p>
            <p className="text-[10px] text-gray-400 truncate">{tagline}</p>
          </div>
        </div>

        <div className="rounded-xl p-4" style={{ backgroundColor: primary }}>
          <p className="text-white text-sm font-semibold mb-1">Empowering Businesses with Next-Gen Solutions</p>
          <p className="text-white/80 text-[10px] mb-3">Build secure, scalable, and innovative digital products.</p>
          <span className="inline-block text-[10px] font-semibold px-3 py-1.5 rounded-lg text-white" style={{ backgroundColor: accent }}>
            Get Started
          </span>
        </div>

        <ul className="space-y-1.5 text-[11px] text-gray-500">
          <li className="flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" style={{ color: primary }} />
            {email}
          </li>
          <li className="flex items-center gap-2">
            <Phone className="w-3.5 h-3.5" style={{ color: primary }} />
            {phone}
          </li>
          <li className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" style={{ color: primary }} />
            {city}, {country}
          </li>
        </ul>

        <div className="rounded-xl p-3" style={{ backgroundColor: secondary }}>
          <p className="text-white/90 text-[10px] leading-relaxed">{footerText}</p>
          <div className="flex gap-1.5 mt-2">
            <span className="h-4 w-4 rounded" style={{ backgroundColor: primary }} />
            <span className="h-4 w-4 rounded" style={{ backgroundColor: accent }} />
            <span className="h-4 w-4 rounded bg-white/80" />
          </div>
        </div>
      </div>
    </div>
  )
}
