// Accessible modal dialog: locks body scroll, closes on Escape or overlay click, and sizes via prop.
import { useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { X } from "lucide-react"

/**
 * Modal
 * @param {Object} props
 * @param {boolean} props.open - Controls dialog visibility.
 * @param {Function} props.onClose - Callback invoked to close the dialog.
 * @param {string} props.title - Dialog title (also used as the aria-label).
 * @param {string} [props.subtitle] - Optional subtitle below the title.
 * @param {"sm"|"md"|"lg"} [props.size] - Max-width preset for the dialog panel.
 * @param {ReactNode} props.children - Dialog body content.
 */
export default function Modal({ open, onClose, title, subtitle, size = "md", children }) {
  useEffect(() => {
    if (!open) return
    // While open: close on Escape and lock background scrolling
    const onKey = (e) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  // Map the size prop to Tailwind max-width classes
  const widthClass =
    size === "sm"
      ? "sm:max-w-md"
      : size === "lg"
        ? "sm:max-w-2xl 2xl:max-w-4xl"
        : "sm:max-w-lg 2xl:max-w-2xl"

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="flex min-h-full items-start sm:items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onClose}
              className="fixed inset-0 bg-[#0B1E3D]/50 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className={`relative w-full ${widthClass} bg-white rounded-2xl shadow-2xl shadow-[#0B1E3D]/20 overflow-hidden my-8`}
            >
              <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-heading font-bold text-[#0B1E3D]">{title}</h3>
                  {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="p-2 rounded-xl text-gray-400 hover:text-[#0B1E3D] hover:bg-[#F7F9FC] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-5 max-h-[calc(100vh-14rem)] overflow-y-auto">{children}</div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
