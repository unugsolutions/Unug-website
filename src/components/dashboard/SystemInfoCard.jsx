// "System Information" card presenting static environment details in a definition list.
import { motion } from "framer-motion"

// Static system metadata displayed in the card
const systemInfo = [
  { label: "React Version", value: "19.2.7" },
  { label: "Supabase", value: "Connected" },
  { label: "Vercel", value: "Deployed" },
  { label: "Environment", value: "Production" },
  { label: "Version", value: "v1.0.0" },
]

/**
 * SystemInfoCard
 * @param {Object} props
 * @param {number} [props.index] - Stagger index for the entrance animation.
 */
export default function SystemInfoCard({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="bg-white rounded-2xl border border-gray-100 p-6"
    >
      <h3 className="text-base font-heading font-semibold text-[#0B1E3D] mb-5">System Information</h3>

      <dl className="space-y-3.5">
        {systemInfo.map((row) => (
          <div key={row.label} className="flex items-center justify-between gap-4">
            <dt className="text-sm text-gray-500">{row.label}</dt>
            <dd className="text-sm font-semibold text-[#0B1E3D] text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
    </motion.div>
  )
}
