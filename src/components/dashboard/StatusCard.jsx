// "Website Status" card listing key system services and their readiness state.
import { motion } from "framer-motion"
import { Globe, Database, ShieldCheck, Server } from "lucide-react"

// Static system services rendered as green "online" rows
const statuses = [
  { label: "Website", value: "Online", icon: Globe, iconClass: "bg-[#0057D9]/10 text-[#0057D9]" },
  { label: "Database", value: "Connected", icon: Database, iconClass: "bg-violet-500/10 text-violet-600" },
  { label: "Authentication", value: "Active", icon: ShieldCheck, iconClass: "bg-emerald-500/10 text-emerald-600" },
  { label: "Storage", value: "Ready", icon: Server, iconClass: "bg-[#FF8C00]/10 text-[#FF8C00]" },
]

/**
 * StatusCard
 * @param {Object} props
 * @param {number} [props.index] - Stagger index for the entrance animation.
 */
export default function StatusCard({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 p-6"
    >
      <h3 className="text-base font-heading font-semibold text-[#0B1E3D] mb-5">Website Status</h3>

      <ul className="space-y-4">
        {statuses.map((s) => (
          <li key={s.label} className="flex items-center gap-3.5">
            <span className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconClass}`}>
              <s.icon className="w-4 h-4" />
            </span>
            <span className="flex-1 text-sm font-medium text-[#1F2937]">{s.label}</span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {s.value}
            </span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
