// Standard page header: breadcrumb, title, description, and an optional action (link or button).
import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import Breadcrumb from "./Breadcrumb"

/**
 * Builds the Tailwind class string for the header action button.
 * @param {"primary"|"secondary"} variant - Button style variant.
 * @returns {string} Compiled className string.
 */
const buttonClasses = (variant) =>
  `inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] ${
    variant === "secondary"
      ? "bg-white text-[#0B1E3D] border border-gray-200 hover:border-[#0057D9] hover:text-[#0057D9] shadow-sm"
      : "bg-[#0057D9] text-white shadow-lg shadow-[#0057D9]/20 hover:bg-[#004ab8] active:scale-[0.98]"
  }`

/**
 * PageHeader
 * @param {Object} props
 * @param {string} props.title - Page heading text.
 * @param {Array} [props.breadcrumbItems] - Intermediate breadcrumb links: { label, to }.
 * @param {string} [props.breadcrumbCurrent] - Current page label in the breadcrumb.
 * @param {string} [props.description] - Optional subheading text.
 * @param {Object} [props.action] - Optional action: { label, icon, to|onClick, variant }.
 */
export default function PageHeader({ title, breadcrumbItems = [], breadcrumbCurrent, description, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 2xl:mb-10"
    >
      <div>
        <Breadcrumb items={breadcrumbItems} current={breadcrumbCurrent} />
        <h1 className="mt-2 text-2xl sm:text-3xl 2xl:text-4xl font-heading font-bold text-[#0B1E3D] tracking-tight">
          {title}
        </h1>
        {description && <p className="mt-1.5 text-sm text-gray-500 max-w-xl">{description}</p>}
      </div>

      {action && (
        <motion.div
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.98 }}
          className="flex-shrink-0"
        >
          {action.to ? (
            <Link to={action.to} className={buttonClasses(action.variant)}>
              {action.icon && <action.icon className="w-4 h-4" />}
              {action.label}
            </Link>
          ) : (
            <button type="button" onClick={action.onClick} className={buttonClasses(action.variant)}>
              {action.icon && <action.icon className="w-4 h-4" />}
              {action.label}
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  )
}
