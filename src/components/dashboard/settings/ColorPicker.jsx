import { useEffect, useState } from "react"
import { Check } from "lucide-react"

const PRESET_COLORS = ["#2563EB", "#0F172A", "#FF8C00", "#0057D9", "#16A34A", "#DC2626", "#7C3AED", "#0EA5E9"]

export default function ColorPicker({ label, value = "", onChange, presets = PRESET_COLORS }) {
  const [text, setText] = useState(value || "")
  const [focused, setFocused] = useState(false)
  const [invalid, setInvalid] = useState(false)

  useEffect(() => {
    if (!focused) setText(value || "")
  }, [value, focused])

  const commit = () => {
    const trimmed = text.trim()
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(trimmed)) {
      const normalized =
        trimmed.length === 4
          ? `#${trimmed[1]}${trimmed[1]}${trimmed[2]}${trimmed[2]}${trimmed[3]}${trimmed[3]}`
          : trimmed.toLowerCase()
      onChange(normalized)
      setInvalid(false)
    } else {
      setText(value || "")
      setInvalid(false)
    }
  }

  const normalizedValue = /^#[0-9a-fA-F]{6}$/.test(value || "") ? value.toLowerCase() : "#2563EB"

  return (
    <div>
      <span className="text-xs font-semibold text-[#0B1E3D] block mb-1.5">{label}</span>
      <div className="flex items-center gap-2">
        <label
          className="relative w-11 h-11 rounded-xl border border-gray-200 overflow-hidden cursor-pointer shadow-sm flex-shrink-0"
          title={`Pick ${label} color`}
        >
          <input
            type="color"
            value={normalizedValue}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label={`Pick ${label} color`}
          />
          <span className="absolute inset-0" style={{ backgroundColor: normalizedValue }} />
        </label>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">#</span>
          <input
            type="text"
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setInvalid(false)
            }}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false)
              commit()
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                commit()
                e.currentTarget.blur()
              }
            }}
            className={`w-full h-11 pl-7 pr-3 text-sm text-[#1F2937] bg-[#F7F9FC] border border-transparent rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0057D9]/40 transition-all duration-200 placeholder:text-gray-400 ${
              invalid ? "ring-2 ring-red-300 border-red-300" : ""
            }`}
            aria-label={`${label} hex value`}
          />
        </div>
      </div>
      <div className="flex gap-1.5 mt-2 flex-wrap">
        {presets.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => onChange(preset)}
            className={`w-6 h-6 rounded-lg transition-transform hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0057D9] ${
              value && value.toLowerCase() === preset ? "ring-2 ring-[#0057D9] ring-offset-1" : ""
            }`}
            style={{ backgroundColor: preset }}
            title={preset}
            aria-label={`Set ${label} to ${preset}`}
          >
            {value && value.toLowerCase() === preset && <Check className="w-3.5 h-3.5 text-white mx-auto" />}
          </button>
        ))}
      </div>
    </div>
  )
}
