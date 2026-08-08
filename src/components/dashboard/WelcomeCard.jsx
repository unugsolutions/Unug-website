// Hero card on the dashboard overview with a welcome message and quick navigation links.
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { BriefcaseBusiness, Globe, Sparkles } from "lucide-react"

/**
 * WelcomeCard
 * @param {Object} props
 * @param {number} [props.index] - Stagger index for the entrance animation.
 */
export default function WelcomeCard({ index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0B1E3D] to-[#123073] p-6 sm:p-8 2xl:p-10 text-white shadow-xl shadow-[#0B1E3D]/20"
    >
      {/* Decorative blurred color circles behind the content */}
      <div className="absolute -top-20 -right-16 w-72 h-72 bg-[#0057D9]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-1/3 w-64 h-64 bg-[#FF8C00]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-semibold bg-white/10 border border-white/10 rounded-full px-3 py-1.5 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#FF8C00]" />
            UNUG Admin Dashboard
          </div>
          <h2 className="text-xl sm:text-2xl 2xl:text-3xl font-heading font-bold tracking-tight">
            Welcome to UNUG Admin Dashboard
          </h2>
          <p className="mt-2 text-sm sm:text-[15px] 2xl:text-base text-white/70">
            Manage your website content, portfolio, services, and customer inquiries from one
            centralized dashboard.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
          <Link
            to="/dashboard/services"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-[#0057D9] text-white rounded-xl hover:bg-[#004ab8] shadow-lg shadow-[#0057D9]/30 transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8C00]"
          >
            <BriefcaseBusiness className="w-4 h-4" />
            Manage Services
          </Link>
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/15 transition-all duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF8C00]"
          >
            <Globe className="w-4 h-4" />
            View Website
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
