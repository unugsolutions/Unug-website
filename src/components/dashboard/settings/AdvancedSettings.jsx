import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ShieldCheck,
  Wifi,
  WifiOff,
  Server,
  Globe,
  Info,
  KeyRound,
  Loader2,
} from "lucide-react"
import { SectionCard, SectionTitle, Toggle } from "./fields"
import { getSettings } from "../../../services/settingsService"
import pkg from "../../../../package.json"

function StatusRow({ icon: Icon, iconClass, label, value, valueClass }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div className="flex items-center gap-3">
        <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
          <Icon className="w-4 h-4" />
        </span>
        <span className="text-sm text-[#1F2937]">{label}</span>
      </div>
      <span className={`text-sm font-semibold ${valueClass || "text-[#1F2937]"}`}>{value}</span>
    </div>
  )
}

export default function AdvancedSettings({ watch, setValue }) {
  const [connection, setConnection] = useState({ checking: true })

  useEffect(() => {
    let mounted = true
    const start = performance.now()
    getSettings()
      .then(() => {
        if (!mounted) return
        setConnection({ checking: false, ok: true, ms: Math.round(performance.now() - start) })
      })
      .catch((err) => {
        if (!mounted) return
        setConnection({ checking: false, ok: false, error: err.message })
      })
    return () => {
      mounted = false
    }
  }, [])

  const maintenance = !!watch("maintenance_mode")
  const hasSupabaseUrl = Boolean(import.meta.env.VITE_SUPABASE_URL)
  const hasAnonKey = Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

  return (
    <div className="space-y-4">
      <SectionCard>
        <SectionTitle
          title="Maintenance"
          description="Global controls for the public website."
        />
        <Toggle
          label="Maintenance Mode"
          description="Shows a maintenance page to visitors while you work. The admin dashboard stays accessible."
          checked={maintenance}
          onChange={(value) => setValue("maintenance_mode", value, { shouldDirty: true })}
        />
      </SectionCard>

      <SectionCard>
        <SectionTitle
          title="Website Status"
          description="Current state of the public website."
        />
        <StatusRow
          icon={Globe}
          iconClass={maintenance ? "bg-amber-50 text-amber-500" : "bg-emerald-50 text-emerald-500"}
          label="Website Status"
          value={maintenance ? "Maintenance Mode" : "Online"}
          valueClass={maintenance ? "text-amber-500" : "text-emerald-500"}
        />
      </SectionCard>

      <SectionCard>
        <SectionTitle
          title="Supabase Connection"
          description="Live connectivity check against your Supabase project."
        />
        {connection.checking ? (
          <div className="flex items-center gap-3 py-3 text-sm text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Checking connection...
          </div>
        ) : connection.ok ? (
          <StatusRow
            icon={Wifi}
            iconClass="bg-emerald-50 text-emerald-500"
            label="Connected"
            value={`${connection.ms} ms`}
            valueClass="text-emerald-500"
          />
        ) : (
          <StatusRow
            icon={WifiOff}
            iconClass="bg-red-50 text-red-500"
            label="Unavailable"
            value={connection.error || "Could not reach Supabase"}
            valueClass="text-red-500"
          />
        )}
      </SectionCard>

      <SectionCard>
        <SectionTitle
          title="Environment Information"
          description="Details about the current build and configuration."
        />
        <StatusRow
          icon={Server}
          iconClass="bg-[#0057D9]/10 text-[#0057D9]"
          label="Environment"
          value={import.meta.env.MODE === "production" ? "Production" : "Development"}
        />
        <StatusRow
          icon={Info}
          iconClass="bg-[#0057D9]/10 text-[#0057D9]"
          label="Application Version"
          value={`v${pkg.version}`}
        />
        <StatusRow
          icon={ShieldCheck}
          iconClass="bg-[#0057D9]/10 text-[#0057D9]"
          label="Supabase URL Configured"
          value={hasSupabaseUrl ? "Yes" : "No"}
          valueClass={hasSupabaseUrl ? "text-emerald-500" : "text-red-500"}
        />
        <StatusRow
          icon={KeyRound}
          iconClass="bg-[#0057D9]/10 text-[#0057D9]"
          label="API Key Configured"
          value={hasAnonKey ? "Yes" : "No"}
          valueClass={hasAnonKey ? "text-emerald-500" : "text-red-500"}
        />
      </SectionCard>

      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-400 text-center">
        All changes are saved to Supabase and appear on the public website immediately.
      </motion.p>
    </div>
  )
}
