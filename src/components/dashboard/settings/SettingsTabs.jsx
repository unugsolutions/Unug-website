import { Settings, Image, Mail, Share2, Search, Palette, Monitor, ShieldCheck } from "lucide-react"

const SETTINGS_TABS = [
  { id: "general", label: "General", icon: Settings },
  { id: "branding", label: "Branding", icon: Image },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "social", label: "Social Media", icon: Share2 },
  { id: "seo", label: "SEO", icon: Search },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "footer", label: "Footer", icon: Monitor },
  { id: "advanced", label: "Advanced", icon: ShieldCheck },
]

export default function SettingsTabs({ active, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mb-2" role="tablist" aria-label="Website settings sections">
      {SETTINGS_TABS.map((tab) => {
        const isActive = active === tab.id
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] ${
              isActive
                ? "bg-[#0057D9] text-white shadow-lg shadow-[#0057D9]/20"
                : "bg-white text-[#0B1E3D] border border-gray-100 hover:border-[#0057D9]/40 hover:text-[#0057D9]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
