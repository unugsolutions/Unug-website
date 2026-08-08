import { motion } from "framer-motion"
import { AlertCircle } from "lucide-react"

export const inputClass =
  "w-full h-10 px-3.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400"

export const textareaClass =
  "w-full px-3.5 py-2.5 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 focus-visible:border-[#0057D9]/30 transition-all duration-200 placeholder:text-gray-400 resize-none"

export function SectionCard({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`bg-white rounded-2xl border border-gray-100 p-6 ${className}`}
    >
      {children}
    </motion.div>
  )
}

export function SectionTitle({ title, description }) {
  return (
    <div className="mb-5">
      <h3 className="text-base font-heading font-bold text-[#0B1E3D]">{title}</h3>
      {description && <p className="mt-1 text-xs text-gray-400 leading-relaxed">{description}</p>}
    </div>
  )
}

export function FieldError({ message }) {
  return message ? (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
      <AlertCircle className="w-3.5 h-3.5" />
      {message}
    </p>
  ) : null
}

function Label({ htmlFor, label, hint, required }) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="text-xs font-semibold text-[#0B1E3D]">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </span>
      {hint && <span className="block mt-0.5 text-[11px] text-gray-400">{hint}</span>}
    </label>
  )
}

export function TextField({
  register,
  name,
  label,
  placeholder = "",
  hint,
  required,
  errors,
  type = "text",
  prefix,
}) {
  const error = errors?.[name]?.message
  return (
    <div>
      <Label htmlFor={name} label={label} hint={hint} required={required} />
      <div className="relative mt-1.5">
        {prefix && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-400">
            {prefix}
          </span>
        )}
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`${inputClass} ${prefix ? "pl-12" : ""} ${error ? "!ring-2 !ring-red-300 !border-red-300" : ""}`}
        />
      </div>
      <FieldError message={error} />
    </div>
  )
}

export function TextAreaField({ register, name, label, placeholder = "", hint, required, errors, rows = 3 }) {
  const error = errors?.[name]?.message
  return (
    <div>
      <Label htmlFor={name} label={label} hint={hint} required={required} />
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        {...register(name)}
        className={`${textareaClass} mt-1.5 ${error ? "!ring-2 !ring-red-300 !border-red-300" : ""}`}
      />
      <FieldError message={error} />
    </div>
  )
}

export function Toggle({ label, description, checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={!!checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`w-full flex items-start justify-between gap-4 text-left rounded-xl border p-4 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] disabled:opacity-60 ${
        checked ? "border-[#0057D9]/30 bg-[#0057D9]/5" : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div>
        <span className="block text-sm font-semibold text-[#0B1E3D]">{label}</span>
        {description && <span className="block mt-0.5 text-xs text-gray-400 leading-relaxed">{description}</span>}
      </div>
      <span
        className={`relative inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors duration-200 ${
          checked ? "bg-[#0057D9]" : "bg-gray-200"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </span>
    </button>
  )
}
